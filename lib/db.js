const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

// Ensure the data directory exists
const dbPath = path.join(process.cwd(), 'emails.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

// Initialize database
db.defaults({ emails: [] }).write();

/**
 * Save an email to the database
 */
function saveEmail(emailData) {
  db.read();
  // Idempotency: Don't save if ID already exists
  const exists = db.get('emails').find({ id: emailData.id }).value();
  if (exists) return exists;

  const email = {
    ...emailData,
    is_read: false, // Default to unread
    created_at: Date.now()
  };
  db.get('emails')
    .push(email)
    .write();
  return email;
}

/**
 * Get emails for a specific address
 */
function getEmailsForAddress(address) {
  db.read(); // Ensure data is fresh
  return db.get('emails')
    .filter({ address: address })
    .orderBy(['received_at'], ['desc'])
    .value();
}

/**
 * Mark an email as read by its ID
 */
function markEmailAsRead(id) {
  db.read(); // Ensure data is fresh
  const email = db.get('emails').find({ id: id }).value();
  if (email) {
    db.get('emails')
      .find({ id: id })
      .assign({ is_read: true })
      .write();
    return true;
  }
  return false;
}

/**
 * Delete emails older than 1 hour
 */
function cleanupOldEmails() {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

  // Lowdb doesn't have a direct "delete where" that returns count easily in v1,
  // but we can remove using remove()
  const removed = db.get('emails')
    .remove(email => email.received_at < oneDayAgo)
    .write();

  console.log(`Cleaned up ${removed.length} expired emails`);
}

/**
 * Mark an email as unread by its ID
 */
function markEmailAsUnread(id) {
  db.read();
  const email = db.get('emails').find({ id: id }).value();
  if (email) {
    db.get('emails')
      .find({ id: id })
      .assign({ is_read: false })
      .write();
    return true;
  }
  return false;
}

/**
 * Get a specific email by ID
 */
function getEmailById(id) {
  db.read();
  return db.get('emails').find({ id: id }).value();
}

/**
 * Get all emails (for debugging)
 */
function getAllEmails() {
  db.read();
  return db.get('emails').value() || [];
}

module.exports = {
  saveEmail,
  getEmailsForAddress,
  markEmailAsRead,
  markEmailAsUnread,
  cleanupOldEmails,
  getAllEmails,
  getEmailById
};
