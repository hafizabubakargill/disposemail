const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const db = require('./lib/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Config
const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "change_me_to_a_secure_secret";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);

    // --- 1. THE NUCLEAR DIAGNOSTICS (Absolute Top) ---
    server.use((req, res, next) => {
        const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
        fs.appendFile(path.join(process.cwd(), 'requests.log'), logEntry, () => { });

        // Version Tracker for Debugging
        res.setHeader('X-Server-Version', '1.0.11-LOCKDOWN');

        // Anti-Cache Headers for all Diagnostic & API routes
        if (req.url.includes('CHECK') || req.url.includes('LOGS') || req.url.includes('api') || req.url.includes('x-feed') || req.url === '/V') {
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

    server.get('/MEGA-CHECK', (req, res) => {
        res.status(200).send(`
            <body style="font-family:sans-serif;padding:40px;">
                <h1>STRICT NUCLEAR MODE ACTIVE</h1>
                <p>Status: REACTIVE</p>
                <p>Version: 1.0.11-LOCKDOWN</p>
                <p>Path: ${req.url}</p>
                <p>Time: ${new Date().toISOString()}</p>
            </body>
        `);
    });

    server.get('/V', (req, res) => res.send('1.0.11-LOCKDOWN'));

    // BASIC STATUS BYPASS
    server.get('/status', (req, res) => res.send('OK'));

    // JSON FALLBACK (Prevents frontend crash if worker is bypassed)
    server.get('/sync-safety-net', (req, res) => res.json({ count: 0, note: "Server Fallback Active" }));

    server.get('/WHERE-AM-I', (req, res) => {
        res.status(200).json({
            cwd: process.cwd(),
            pid: process.pid,
            uptime: process.uptime(),
            node_version: process.version,
            env: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            registered_routes: ['/MEGA-CHECK', '/SEE-LOGS', '/WHERE-AM-I', '/api-test', '/api-v1/*', '/x-feed/*']
        });
    });

    server.get('/api-test', (req, res) => {
        res.send("API TEST SUCCESSFUL - Express is handling this directly.");
    });

    server.get('/SEE-LOGS', (req, res) => {
        const logPath = path.join(process.cwd(), 'requests.log');
        if (!fs.existsSync(logPath)) return res.send('No logs.');
        fs.readFile(logPath, 'utf8', (err, data) => {
            const lines = (data || "").trim().split('\n').reverse().slice(0, 100);
            res.send(`<pre style="background:#000;color:#0f0;padding:20px;">${lines.join('\n')}</pre><script>setTimeout(()=>location.reload(),3000)</script>`);
        });
    });

    // --- NEW DIAGNOSTIC ROUTES ---
    server.get('/DEBUG-EMAILS', (req, res) => {
        try {
            const emails = db.getAllEmails();
            res.json({
                count: emails.length,
                last_5: emails.slice(-5).map(e => ({ id: e.id, to: e.address, subject: e.subject, time: new Date(e.received_at).toISOString() }))
            });
        } catch (err) {
            res.status(500).json({ error: err.message, stack: err.stack });
        }
    });

    server.get('/TEST-WEBHOOK', (req, res) => {
        res.json({
            status: "OK",
            message: "Webhook route is reachable. Use POST to send data.",
            endpoint: "/x-feed/webhook/email"
        });
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
    const getStatus = (req, res) => res.json({ status: 'running', version: '1.0.11-LOCKDOWN' });

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
        server.get(`${p}/status`, getStatus);
        server.get(`${p}/emails`, getEmails);
        server.all(`${p}/emails/read`, express.json(), handleRead);
        server.all(`${p}/emails/unread`, express.json(), (req, res) => {
            db.markEmailAsUnread(req.body.id || req.query.id);
            res.json({ success: true });
        });
        server.post(`${p}/webhook/email`, express.json({ limit: '10mb' }), handleWebhook);

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

                res.setHeader('Content-Type', attachment.contentType);
                res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
                res.send(attachment.content);
            } catch (err) {
                console.error('Attachment download error:', err);
                res.status(500).send('Internal Server Error');
            }
        });

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

    io.on('connection', (socket) => {
        socket.on('join-room', (email) => { if (email) socket.join(email.toLowerCase()); });
    });

    // --- 4. NEXT.JS CATCH-ALL ---
    server.all('*', (req, res) => {
        if (req.url.startsWith('/api/') || req.url.startsWith('/x-feed/')) {
            return res.status(404).json({ error: 'Endpoint Not Found', path: req.url, note: "Nuclear Catch-all" });
        }
        return handle(req, res);
    });

    // --- 5. CLEANUP ---
    setInterval(() => db.cleanupOldEmails(), 60 * 1000);

    httpServer.listen(PORT, '0.0.0.0', () => {
        console.log(`> Nuclear Ready on port ${PORT}`);
    });
});
