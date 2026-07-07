const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const db = require('./lib/db');
const path = require('path');
const { randomUUID: uuidv4 } = require('crypto');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const connectDB = require('./lib/mongoose');
const jwt = require('jsonwebtoken');
const DOMPurify = require('isomorphic-dompurify');

// Rate Limiting Configurations
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after a minute' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const webhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // Limit webhook strictly
    message: { error: 'Webhook rate limit exceeded' }
});

const globalSiteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // Allow high amounts of normal browsing, but block DDoS/Brute force
    skip: (req) => req.url.startsWith('/_next/') || req.url.match(/\.(svg|png|jpg|jpeg|ico|json|xsl|txt)$/),
    message: 'We have detected unusual traffic from your network. To prevent abuse, please wait a minute before accessing DisposeMail again.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Config
const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "change_me_to_a_secure_secret";

const app = next({ dev });
const handle = app.getRequestHandler();

const JWT_SECRET = process.env.JWT_SECRET || '8f4a3c2b1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4g';

app.prepare().then(async () => {
    // 1. Connect to MongoDB (Wait until connected so early requests don't crash)
    try {
        await connectDB();
    } catch (err) {
        console.error('Initial DB connection failed:', err.message);
    }

    const server = express();
    
    // SEC-FIX: Trust Cloudflare proxies so express-rate-limit 
    // doesn't block all global traffic as a single IP address
    server.set('trust proxy', 1);

    const httpServer = http.createServer(server);

    // Apply Global Site Limiter to everything
    server.use(globalSiteLimiter);

    // SEO: Redirect www to non-www
    server.use((req, res, next) => {
        if (req.headers.host && req.headers.host.startsWith('www.')) {
            const cleanHost = req.headers.host.substring(4);
            return res.redirect(301, 'https://' + cleanHost + req.url);
        }
        next();
    });

    // --- 1. CORE API WRAPPER ---
    server.use((req, res, next) => {
        // Secure Version Tracker
        res.setHeader('X-Server-Version', '1.0.12-SECURE');

        // Anti-Cache Headers for all API routes
        if (req.url.startsWith('/api') || req.url.startsWith('/x-feed')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        next();
    });

    // --- 2. PRIORITY FLAT ROUTES (No Routers) ---

    // Explicit Manifest
    const serveManifest = (req, res) => {
        const manifest = {
            "name": "DisposeMail", "short_name": "DisposeMail",
            "start_url": "/", "display": "standalone",
            "background_color": "#0a0a0a", "theme_color": "#2563eb",
            "icons": [{ "src": "/icon.svg", "sizes": "any", "type": "image/svg+xml" }]
        };
        res.setHeader('Content-Type', 'application/manifest+json');
        res.status(200).send(JSON.stringify(manifest));
    };
    server.get('/manifest.json', serveManifest);
    server.get('/site.webmanifest', serveManifest);

    // Flat API Handlers
    const getStatus = (req, res) => res.json({ status: 'running', version: '1.0.12-SECURE' });

    const getEmails = async (req, res) => {
        const address = req.query.address;
        if (!address) return res.status(400).json({ error: 'Missing address' });
        // Note: Auth for REST is handled by the random address itself (unguessable).
        // JWT is enforced on WebSockets where the real eavesdropping threat exists.
        const emails = await db.getEmailsForAddress(address.toLowerCase());
        res.json(emails);
    };

    const handleRead = async (req, res) => {
        const id = req.body.id || req.query.id;
        await db.markEmailAsRead(id);
        res.json({ success: true });
    };

    const handleWebhook = async (req, res) => {
        console.log(`[WEBHOOK] Incoming request at ${new Date().toISOString()}`);
        const { id, to, from, subject, text, html, raw, secret } = req.body;

        if (secret !== WEBHOOK_SECRET) {
            console.error(`[WEBHOOK] AUTH FAILURE. Expected: ${WEBHOOK_SECRET.substring(0, 4)}..., Received: ${secret ? secret.substring(0, 4) : 'null'}...`);
            return res.status(401).json({ error: 'Auth failed' });
        }

        console.log(`[WEBHOOK] Payload: ID=${id}, TO=${to}, FROM=${from}, SUBJECT=${subject}`);

        // Use provided ID or generate new one (Idempotency)
        const finalId = id || uuidv4();
        let finalHtml = html || '';
        let finalText = text || '';
        let finalSubject = subject || '(No Subject)';
        let attachments = [];

        // IF RAW MIME IS PROVIDED, PARSE IT PROPERLY
        if (raw) {
            console.log(`[WEBHOOK] Parsing Raw MIME (${raw.length} bytes)`);
            try {
                const { simpleParser } = require('mailparser');
                const parsed = await simpleParser(raw);
                finalHtml = parsed.html || parsed.textAsHtml || '';
                finalText = parsed.text || '';
                finalSubject = parsed.subject || finalSubject;
                attachments = (parsed.attachments || []).map(att => ({
                    filename: att.filename || 'attachment.dat',
                    contentType: att.contentType,
                    size: att.size,
                    checksum: att.checksum
                }));
            } catch (err) {
                console.error('[WEBHOOK] MIME Parsing Error:', err);
            }
        }

        const saved = await db.saveEmail({
            id: finalId,
            address: to.toLowerCase(),
            from_address: from,
            subject: finalSubject,
            text: finalText,
            html: DOMPurify.sanitize(finalHtml),
            raw: raw,
            attachments: attachments,
            received_at: Date.now()
        });

        // Null guard: if save failed, use the raw data for socket emit
        const emailToEmit = saved || { id: finalId, address: to.toLowerCase(), from_address: from, subject: finalSubject, text: finalText, is_read: false, received_at: Date.now() };
        console.log(`[WEBHOOK] Email ${emailToEmit.id} for ${to}`);
        io.to(to.toLowerCase()).emit('new-email', emailToEmit);
        res.json({ success: true, id: emailToEmit.id });
    };

    // --- SESSION GENERATION (NEW) ---
    server.post('/api/session/generate', express.json(), (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email required' });
        
        const token = jwt.sign({ email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });

    // Binding to ALL possible prefixes
    const prefixes = ['/api', '/api-v1', '/x-feed', '/internal'];
    prefixes.forEach(p => {
        server.use(`${p}/`, apiLimiter); // Apply general API rate limiting

        server.get(`${p}/status`, getStatus);
        server.get(`${p}/emails`, getEmails);
        server.all(`${p}/emails/read`, express.json(), handleRead);
        server.all(`${p}/emails/unread`, express.json(), async (req, res) => {
            await db.markEmailAsUnread(req.body.id || req.query.id);
            res.json({ success: true });
        });
        server.delete(`${p}/emails/delete`, express.json(), async (req, res) => {
            const success = await db.deleteEmailById(req.body.id);
            res.json({ success });
        });
        server.post(`${p}/webhook/email`, webhookLimiter, express.json({ limit: '10mb' }), handleWebhook);

        server.get(`${p}/emails/attachment`, async (req, res) => {
            const { id, checksum } = req.query;
            if (!id || !checksum) return res.status(400).send('Missing params');

            const email = db.getEmailById(id);
            if (!email || !email.raw) return res.status(404).send('Email/Raw source not found');

            try {
                const { simpleParser } = require('mailparser');
                const parsed = await simpleParser(email.raw);
                const attachment = parsed.attachments.find(a => a.checksum === checksum);

                if (!attachment) return res.status(404).send('Attachment not found');

                // Standardized headers for reliable binary streaming
                res.attachment(attachment.filename || 'attachment');
                res.setHeader('Content-Type', attachment.contentType || 'application/octet-stream');
                res.setHeader('Content-Length', attachment.size);
                res.send(attachment.content);
            } catch (err) {
                console.error('Attachment download error:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        // --- 4.5 IMAGE PROXY (Anti-Tracking) ---
        server.get(`${p}/proxy-image`, async (req, res) => {
            const { url } = req.query;
            if (!url || typeof url !== 'string') return res.status(400).send('Missing image URL');

            try {
                // 1. Strict Protocol Check
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    return res.status(400).send('Invalid URL protocol. Only http and https are allowed.');
                }

                // 2. Hostname Validation (Prevent SSRF)
                const parsedUrl = new URL(url);
                const host = parsedUrl.hostname.toLowerCase();
                
                // Block Localhost & Private IP Ranges (RFC 1918 + RFC 3927)
                const isPrivate = 
                    host === 'localhost' || 
                    host === '127.0.0.1' || 
                    host.startsWith('10.') || 
                    host.startsWith('192.168.') || 
                    host.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
                    host.startsWith('169.254.') ||
                    host === '::1' || host.startsWith('fe80:');

                if (isPrivate) {
                    console.warn(`[ImageProxy] BLOCKED request to private host: ${host}`);
                    return res.status(403).send('Forbidden: Internal or private network addresses are not allowed.');
                }

                // 3. Set a short timeout so requests don't hang the server
                const proxyReq = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.1; +https://disposemail.xyz)',
                        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
                    },
                    signal: AbortSignal.timeout(5000) 
                });

                if (!proxyReq.ok) {
                    return res.status(proxyReq.status).send('External image fetch failed');
                }

                // 4. Content-Type Validation (Prevent CSRF-like attacks/Amplification)
                const contentType = proxyReq.headers.get('content-type') || '';
                if (!contentType.toLowerCase().startsWith('image/')) {
                    console.error('[ImageProxy] Rejected non-image content type:', contentType);
                    return res.status(400).send('Invalid response content-type: must be an image.');
                }

                res.setHeader('Content-Type', contentType);
                // Cache perfectly for 1 hour to reduce server load
                res.setHeader('Cache-Control', 'public, max-age=3600');

                // 5. Stream the response directly to the client (using Buffer safely)
                const arrayBuffer = await proxyReq.arrayBuffer();
                res.send(Buffer.from(arrayBuffer));
            } catch (err) {
                console.error('[ImageProxy] Fetch error:', err.message);
                res.status(500).send('Proxy Error');
            }
        });

        // --- 5. CLEANUP (Every 5 Minutes) ---
        setInterval(() => {
            try {
                db.cleanupOldEmails();
            } catch (err) {
                console.error("[DB] Error during periodic cleanup:", err.message);
            }
        }, 5 * 60 * 1000);

        // --- 6. AUTO INDEXER (Every 12 Hours) ---
        // Runs purely in the background to slowly drip URLs to Google
        setInterval(() => {
            try {
                const runIndexer = require('./scripts/auto_indexer');
                runIndexer();
            } catch (err) {
                console.error("[AutoIndexer] Failed to execute:", err.message);
            }
        }, 12 * 60 * 60 * 1000);

        // Run indexer once 1 minute after server start
        setTimeout(() => {
            try {
                const runIndexer = require('./scripts/auto_indexer');
                runIndexer();
            } catch (err) {
                console.error("[AutoIndexer] Failed to execute initial run:", err.message);
            }
        }, 60 * 1000);

        // Rescue Endpoint (Phase 14)
        server.post(`${p}/rescue`, express.json(), async (req, res) => {
            const { emails, secret } = req.body;
            if (secret !== WEBHOOK_SECRET) return res.status(401).json({ error: 'Auth failed' });

            const { simpleParser } = require('mailparser');

            const results = [];
            for (const e of emails) {
                let finalHtml = e.html || '';
                let finalText = e.text || '';
                let finalSubject = e.subject || '(No Subject)';
                let attachments = [];

                if (e.raw) {
                    try {
                        const parsed = await simpleParser(e.raw);
                        finalHtml = parsed.html || parsed.textAsHtml || '';
                        finalText = parsed.text || '';
                        finalSubject = parsed.subject || finalSubject;
                        attachments = (parsed.attachments || []).map(att => ({
                            filename: att.filename || 'attachment.dat',
                            contentType: att.contentType,
                            size: att.size,
                            checksum: att.checksum
                        }));
                    } catch (err) {
                        console.error('Rescue MIME Error:', err);
                    }
                }

                const data = {
                    ...e,
                    id: e.id || uuidv4(),
                    received_at: e.timestamp || Date.now(),
                    html: finalHtml,
                    text: finalText,
                    subject: finalSubject,
                    raw: e.raw,
                    attachments: attachments
                };
                results.push(await db.saveEmail(data));
            }
            res.json({ success: true, count: results.length });
        });
    });

    // --- 3. SOCKET.IO ---
    const io = new SocketIOServer(httpServer, {
        path: '/socket.io-live',
        pingTimeout: 120000,
        pingInterval: 30000,
        cors: { origin: "*" }
    });

    // Basic WebSocket connection rate limiter
    const connectionLimits = new Map();
    setInterval(() => connectionLimits.clear(), 60000); // Clear every minute

    // Token Ownership Map for Socket Rooms (Anti-Eavesdropping)
    const roomTokens = new Map();
    // Periodically purge room tokens to prevent memory leaks in production
    setInterval(() => {
        if (roomTokens.size > 50000) roomTokens.clear();
    }, 24 * 60 * 60 * 1000); 

    io.on('connection', (socket) => {
        // SEC-FIX: Read true IP behind Cloudflare/Nginx instead of the proxy server's IP
        const ip = socket.handshake.headers['cf-connecting-ip'] || 
                   (socket.handshake.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() || 
                   socket.handshake.address || 
                   socket.conn.remoteAddress || 
                   'unknown';
                  
        const currentCount = connectionLimits.get(ip) || 0;

        if (currentCount > 30) {
            console.warn(`[Socket.io] Blocked connection from ${ip} (Rate Limit)`);
            socket.disconnect(true);
            return;
        }

        connectionLimits.set(ip, currentCount + 1);

        socket.on('join-room', (data) => {
            if (!data) return;
            const email = typeof data === 'string' ? data.toLowerCase() : data.email?.toLowerCase();
            const token = typeof data === 'object' ? data.token : null;

            if (!email || !token) {
                console.warn(`[Socket.io] Join attempt Refused: Missing Email or Token`);
                return;
            }

            // SEC-FIX: Cryptographic JWT Verification for Socket Rooms
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded.email !== email) {
                    console.warn(`[Socket.io] SEC-ALERT: Token/Email Mismatch for room ${email}`);
                    return;
                }
                
                socket.join(email);
                console.log(`[Socket.io] Verified Owner joined room ${email}`);
            } catch (err) {
                console.warn(`[Socket.io] SEC-ALERT: Invalid JWT for room ${email}`);
            }
        });
    });

    // --- 4. NEXT.JS CATCH-ALL ---
    server.all('*', (req, res) => {
        // Whitelist all Next.js App Router API routes (app/api/*)
        // Add new routes here as they are created
        const nextJsApiRoutes = ['/api/contact', '/api/ip', '/api/breach', '/api/notes', '/api/diag', '/api/session'];
        
        if (nextJsApiRoutes.some(route => req.url.startsWith(route))) {
            return handle(req, res);
        }

        if (req.url.startsWith('/api/') || req.url.startsWith('/x-feed/')) {
            return res.status(404).json({ error: 'Endpoint Not Found', path: req.url, note: "Nuclear Catch-all" });
        }
        return handle(req, res);
    });

    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`> Nuclear Ready on port ${PORT}`);
        if (WEBHOOK_SECRET === "change_me_to_a_secure_secret") {
            console.warn("\n========================================================");
            console.warn("⚠️ CRITICAL SECURITY WARNING ⚠️");
            console.warn("WEBHOOK_SECRET is currently set to the default fallback!");
            console.warn("Attackers can spoof emails and inject phishing links.");
            console.warn("Define a strong WEBHOOK_SECRET in your .env immediately.");
            console.warn("========================================================\n");
        }
    });
});
