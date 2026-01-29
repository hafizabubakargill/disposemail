const express = require('express');
const next = require('next');
const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
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

    // --- Socket.io Setup ---
    io.on('connection', (socket) => {
        socket.on('join-room', (email) => {
            socket.join(email);
        });
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
    });
});
