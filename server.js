const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const db = require('./lib/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

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

app.prepare().then(() => {
    const server = express();
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

    const getEmails = (req, res) => {
        const address = req.query.address;
        if (!address) return res.status(400).json({ error: 'Missing address' });
        res.json(db.getEmailsForAddress(address.toLowerCase()));
    };

    const handleRead = (req, res) => {
        const id = req.body.id || req.query.id;
        db.markEmailAsRead(id);
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

        const saved = db.saveEmail({
            id: finalId,
            address: to.toLowerCase(),
            from_address: from,
            subject: finalSubject,
            text: finalText,
            html: finalHtml,
            raw: raw,
            attachments: attachments,
            received_at: Date.now()
        });

        console.log(`[WEBHOOK] Saved Email ${saved.id} for ${to}`);
        io.to(to.toLowerCase()).emit('new-email', saved);
        res.json({ success: true, id: saved.id });
    };

    // Binding to ALL possible prefixes
    const prefixes = ['/api', '/api-v1', '/x-feed', '/internal'];
    prefixes.forEach(p => {
        server.use(`${p}/`, apiLimiter); // Apply general API rate limiting

        server.get(`${p}/status`, getStatus);
        server.get(`${p}/emails`, getEmails);
        server.all(`${p}/emails/read`, express.json(), handleRead);
        server.all(`${p}/emails/unread`, express.json(), (req, res) => {
            db.markEmailAsUnread(req.body.id || req.query.id);
            res.json({ success: true });
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

        // --- 5. CLEANUP (Every 5 Minutes) ---
        setInterval(() => {
            try {
                db.cleanupOldEmails();
            } catch (err) {
                console.error("[SQLite3] Error during periodic cleanup:", err.message);
            }
        }, 5 * 60 * 1000);

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
                results.push(db.saveEmail(data));
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
        const ip = socket.handshake.address || socket.conn.remoteAddress || 'unknown';
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

            if (!email || !token) return;

            const existingToken = roomTokens.get(email);
            if (!existingToken) {
                // First-Claim: Lock this room to this token
                roomTokens.set(email, token);
                socket.join(email);
                console.log(`[Socket.io] Room ${email} claimed by token ${token.substring(0, 6)}...`);
            } else if (existingToken === token) {
                // Verified owner rejoining
                socket.join(email);
                console.log(`[Socket.io] Owner rejoined room ${email}`);
            } else {
                // Eavesdropper Attempt
                console.warn(`[Socket.io] SEC-ALERT: Eavesdrop blocked on room ${email} from IP ${ip}`);
            }
        });
    });

    // --- 4. NEXT.JS CATCH-ALL ---
    server.all('*', (req, res) => {
        // Exception for Next.js API routes that need to be handled by app/api
        if (req.url.startsWith('/api/contact')) {
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
