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
function saveEmail(email) {
  db.get('emails')
    .push(email)
    .write();
}

/**
 * Get emails for a specific address
 */
function getEmailsForAddress(address) {
  return db.get('emails')
    .filter({ address: address })
    .orderBy(['received_at'], ['desc'])
    .value();
}

/**
 * Delete emails older than 1 hour
 */
function cleanupOldEmails() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);

  // Lowdb doesn't have a direct "delete where" that returns count easily in v1, 
  // but we can remove using remove()
  const removed = db.get('emails')
    .remove(email => email.received_at < oneHourAgo)
    .write();

  console.log(`Cleaned up ${removed.length} expired emails`);
}

module.exports = {
  saveEmail,
  getEmailsForAddress,
  cleanupOldEmails
};
