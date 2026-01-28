const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const { simpleParser } = require('mailparser');
const { v4: uuidv4 } = require('uuid');
const db = require('./lib/db');

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
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Increase body limit for large emails if using body-parser, 
    // but we will stream directly to mailparser where possible.
    // We'll use a raw body handler for the specific route.

    // --- Webhook Endpoint for Cloudflare Worker ---
    server.post('/api/webhook/email', (req, res) => {
        // Optional: Check Secret
        if (WEBHOOK_SECRET && req.headers['x-api-key'] !== WEBHOOK_SECRET) {
            // Allow it if secret isn't set, or if it matches
            // But if secret IS set, we must match it
            return res.status(401).send('Unauthorized');
        }

        simpleParser(req, (err, parsed) => {
            if (err) {
                console.error('Error parsing email webhook:', err);
                return res.status(500).send('Error parsing email');
            }

            // Extract "To" address
            // Cloudflare Worker usually preserves the original headers.
            // Often strictly speaking the headers are in parsed.to, but 
            // sometimes email routing adds X-Forwarded-To etc.
            // We'll trust the parsed 'To' for now.

            const toAddressObj = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to;
            // mailparser 'to' object has { value, text, html }. value is array of { address, name }
            // If parsed.to is directly the object:
            const rawAddress = toAddressObj?.address || toAddressObj?.text || '';
            const toAddress = rawAddress.toLowerCase().trim();

            if (!toAddress) {
                return res.status(400).send('No recipient found');
            }

            const emailData = {
                id: uuidv4(),
                address: toAddress,
                from_address: parsed.from?.text || 'unknown',
                subject: parsed.subject || '(No Subject)',
                text: parsed.text || '', // Fallback to text if html is missing
                html: parsed.html || '',
                received_at: Date.now()
            };

            try {
                db.saveEmail(emailData);
                console.log(`Received email webhook for ${toAddress}`);
                io.to(toAddress).emit('new-email', emailData);
                res.status(200).send('OK');
            } catch (e) {
                console.error('Error saving email:', e);
                res.status(500).send('Internal Error');
            }
        });
    });

    // --- Socket.io Setup ---
    io.on('connection', (socket) => {
        socket.on('join-room', (email) => {
            socket.join(email);
        });
    });

    // --- API Routes ---
    server.get('/api/emails', (req, res) => {
        const address = req.query.address;
        if (!address) return res.status(400).json({ error: 'Address required' });
        const emails = db.getEmailsForAddress(address);
        res.json(emails);
    });

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
    });
});
