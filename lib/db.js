const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dbPath = path.join(process.cwd(), 'emails.db');
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? console.log : null });

// Performance optimizations for high-throughput write/read operations
db.pragma('journal_mode = WAL'); // Write-Ahead Logging (Non-blocking reads)
db.pragma('synchronous = NORMAL');
db.pragma('temp_store = MEMORY');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id TEXT PRIMARY KEY,
    address TEXT NOT NULL,
    from_address TEXT,
    subject TEXT,
    text TEXT,
    html TEXT,
    raw TEXT,
    attachments TEXT, 
    received_at INTEGER NOT NULL,
    is_read INTEGER DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_emails_address ON emails(address);
  CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
`);

// --- COMPILED PREPARED STATEMENTS (For sub-millisecond execution) ---
const stmt_insertEmail = db.prepare(`
  INSERT OR IGNORE INTO emails 
  (id, address, from_address, subject, text, html, raw, attachments, received_at, is_read)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
`);

const stmt_getEmailsByAddress = db.prepare(`
  SELECT * FROM emails WHERE address = ? ORDER BY received_at DESC
`);

const stmt_getEmailById = db.prepare(`
  SELECT * FROM emails WHERE id = ?
`);

const stmt_markAsRead = db.prepare(`
  UPDATE emails SET is_read = 1 WHERE id = ?
`);

const stmt_markAsUnread = db.prepare(`
  UPDATE emails SET is_read = 0 WHERE id = ?
`);

const stmt_deleteOldEmails = db.prepare(`
  DELETE FROM emails WHERE received_at < ?
`);

const stmt_deleteEmailById = db.prepare(`
  DELETE FROM emails WHERE id = ?
`);

const stmt_getAllEmails = db.prepare(`
  SELECT * FROM emails
`);

/**
 * Save an email to the database
 */
function saveEmail(emailData) {
  // Convert attachments array to JSON string for SQLite storage
  const attachmentsJson = emailData.attachments ? JSON.stringify(emailData.attachments) : null;
  const receivedAt = emailData.received_at || emailData.timestamp || Date.now();
  
  // The DB handles id collision gracefully due to "INSERT OR IGNORE" & PRIMARY KEY
  const info = stmt_insertEmail.run(
    emailData.id,
    emailData.address || emailData.to,
    emailData.from_address || emailData.from,
    emailData.subject,
    emailData.text,
    emailData.html,
    emailData.raw,
    attachmentsJson,
    receivedAt
  );

  // Return formatted object expected by Socket.io
  return {
    ...emailData,
    address: emailData.address || emailData.to,
    from_address: emailData.from_address || emailData.from,
    attachments: emailData.attachments || [],
    received_at: receivedAt,
    is_read: false
  };
}

/**
 * Get emails for a specific address
 */
function getEmailsForAddress(address) {
  const rows = stmt_getEmailsByAddress.all(address);
  // Parse SQLite JSON blobs back into arrays
  return rows.map(row => ({
    ...row,
    is_read: row.is_read === 1,
    attachments: row.attachments ? JSON.parse(row.attachments) : []
  }));
}

/**
 * Mark an email as read by its ID
 */
function markEmailAsRead(id) {
  const info = stmt_markAsRead.run(id);
  return info.changes > 0;
}

/**
 * Delete emails older than 1 hour  (Cron Job calls this as 24h currently but moving to dynamic)
 */
function cleanupOldEmails() {
  const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000); 
  const info = stmt_deleteOldEmails.run(twoHoursAgo);
  console.log(`[SQLite3] Cleaned up ${info.changes} expired emails from DB.`);
}

/**
 * Mark an email as unread by its ID
 */
function markEmailAsUnread(id) {
  const info = stmt_markAsUnread.run(id);
  return info.changes > 0;
}

/**
 * Get a specific email by ID
 */
function getEmailById(id) {
  const row = stmt_getEmailById.get(id);
  if (!row) return null;
  return {
    ...row,
    is_read: row.is_read === 1,
    attachments: row.attachments ? JSON.parse(row.attachments) : []
  };
}

/**
 * Delete a specific email by ID entirely
 */
function deleteEmailById(id) {
  const info = stmt_deleteEmailById.run(id);
  return info.changes > 0;
}

/**
 * Get all emails (for debugging/admin)
 */
function getAllEmails() {
  const rows = stmt_getAllEmails.all();
  return rows.map(row => ({
    ...row,
    is_read: row.is_read === 1,
    attachments: row.attachments ? JSON.parse(row.attachments) : []
  }));
}

module.exports = {
  saveEmail,
  getEmailsForAddress,
  markEmailAsRead,
  markEmailAsUnread,
  cleanupOldEmails,
  getAllEmails,
  getEmailById,
  deleteEmailById
};
