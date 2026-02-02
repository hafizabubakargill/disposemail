const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const db = require('./lib/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Config
const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;
// Add a secret key for the webhook to prevent public spamming if desired
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "change_me_to_a_secure_secret";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);

    // --- Custom Server Health Check (TOP OF STACK) ---
    server.get('/api/health-check', (req, res) => {
        res.json({
            status: 'ok',
            server: 'custom-socket-server',
            version: '1.0.4',
            time: new Date().toISOString()
        });
    });

    const io = new SocketIOServer(httpServer, {
        path: '/socket.io-live',
        addTrailingSlash: false,
        pingTimeout: 60000,   // Wait 60s for client pongs before disconnecting
        pingInterval: 25000,  // Send pings every 25s
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Increase body limit for large emails if using body-parser, 
    // but we will stream directly to mailparser where possible.
    // We'll use a raw body handler for the specific route.

    // --- Socket.io Setup ---
    io.on('connection', (socket) => {
        console.log(`[Socket.io] New connection: ${socket.id}`);
        socket.on('join-room', (email) => {
            socket.join(email);
            console.log(`[Socket.io] Socket ${socket.id} joined room: ${email}`);
        });
    });

    // NOTE: We are moving critical API routes directly into server.js 
    // to bypass App Router 404 issues on some Hostinger environments.

    // Health Check
    server.get('/api-v1/status', (req, res) => {
        res.json({ status: 'running', timestamp: Date.now() });
    });

    // Fetch Emails
    server.get('/api-v1/emails', (req, res) => {
        const address = req.query.address;
        if (!address) return res.status(400).json({ error: 'Address required' });
        try {
            const emails = db.getEmailsForAddress(address.toLowerCase());
            res.json(emails);
        } catch (error) {
            console.error('Error fetching emails:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Mark as Read
    server.post('/api-v1/emails/read', express.json(), (req, res) => {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'ID required' });
        try {
            const success = db.markEmailAsRead(id);
            res.json({ success });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Webhook (Cloudflare)
    server.post('/api-v1/webhook/email', express.json({ limit: '10mb' }), (req, res) => {
        const { to, from, subject, text, html, secret } = req.body;

        if (secret !== WEBHOOK_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const emailData = {
            id: uuidv4(),
            address: to.toLowerCase(),
            from_address: from,
            subject: subject || '(No Subject)',
            text: text || '',
            html: html || '',
            received_at: Date.now()
        };

        const saved = db.saveEmail(emailData);
        io.to(to.toLowerCase()).emit('new-email', saved);
        res.json({ success: true, id: saved.id });
    });

    // Explicit Manifest Serving to fix JSON Syntax Errors
    server.get(['/manifest.json', '/site.webmanifest'], (req, res) => {
        const manifest = {
            "name": "DisposeMail",
            "short_name": "DisposeMail",
            "description": "Secure Disposable Email",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#0a0a0a",
            "theme_color": "#2563eb",
            "icons": [{ "src": "/icon.svg", "sizes": "any", "type": "image/svg+xml" }]
        };
        res.setHeader('Content-Type', 'application/manifest+json; charset=UTF-8');
        res.send(JSON.stringify(manifest));
    });

    // NOTE: API routes are now handled by Next.js App Router (app/api/...)
    // This server.js is primarily for WebSocket support.

    // --- Next.js Handling ---
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // --- Cleanup Job ---
    setInterval(() => {
        db.cleanupOldEmails();
    }, 60 * 1000);

    httpServer.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
        console.log(`> Socket.io path: /socket.io/`);
    });
});
