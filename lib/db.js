const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dbPath = path.join(process.cwd(), 'emails.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    address TEXT NOT NULL,
    from_address TEXT,
    subject TEXT,
    text TEXT,
    html TEXT,
    received_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_address ON emails(address);
  CREATE INDEX IF NOT EXISTS idx_received_at ON emails(received_at);
`);

/**
 * Save an email to the database
 */
function saveEmail(email) {
    const stmt = db.prepare(`
    INSERT INTO emails (id, address, from_address, subject, text, html, received_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(
        email.id,
        email.address,
        email.from_address,
        email.subject,
        email.text,
        email.html || '',
        email.received_at
    );
}

/**
 * Get emails for a specific address
 */
function getEmailsForAddress(address) {
    const stmt = db.prepare(`
    SELECT * FROM emails 
    WHERE address = ? 
    ORDER BY received_at DESC
  `);
    return stmt.all(address);
}

/**
 * Delete emails older than 1 hour
 */
function cleanupOldEmails() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const stmt = db.prepare('DELETE FROM emails WHERE received_at < ?');
    const result = stmt.run(oneHourAgo);
    console.log(`Cleaned up ${result.changes} expired emails`);
}

module.exports = {
    saveEmail,
    getEmailsForAddress,
    cleanupOldEmails
};
