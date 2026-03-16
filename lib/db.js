const Email = require('../models/Email');

/**
 * Save an email to the database
 */
async function saveEmail(emailData) {
  try {
    // Idempotency: Don't save if ID already exists
    const exists = await Email.findOne({ id: emailData.id });
    if (exists) return exists;

    const email = new Email({
      ...emailData,
      is_read: false
    });
    
    return await email.save();
  } catch (err) {
    console.error('Error saving email:', err);
    return null;
  }
}

/**
 * Get emails for a specific address
 */
async function getEmailsForAddress(address) {
  try {
    return await Email.find({ address: address.toLowerCase() })
      .sort({ received_at: -1 });
  } catch (err) {
    console.error('Error getting emails:', err);
    return [];
  }
}

/**
 * Mark an email as read by its ID
 */
async function markEmailAsRead(id) {
  try {
    const result = await Email.updateOne({ id: id }, { is_read: true });
    return result.modifiedCount > 0;
  } catch (err) {
    console.error('Error marking email as read:', err);
    return false;
  }
}

/**
 * Delete emails older than 1 hour
 * (Manual trigger - though TTL index handles this automatically now)
 */
async function cleanupOldEmails() {
  // No-op or manual cleanup if needed. 
  // TTL index on 'received_at' handles this automatically in MongoDB.
  return;
}

/**
 * Mark an email as unread by its ID
 */
async function markEmailAsUnread(id) {
  try {
    const result = await Email.updateOne({ id: id }, { is_read: false });
    return result.modifiedCount > 0;
  } catch (err) {
    console.error('Error marking email as unread:', err);
    return false;
  }
}

/**
 * Get a specific email by ID
 */
async function getEmailById(id) {
  try {
    return await Email.findOne({ id: id });
  } catch (err) {
    console.error('Error getting email by ID:', err);
    return null;
  }
}

/**
 * Get all emails (for debugging)
 */
async function getAllEmails() {
  try {
    return await Email.find({});
  } catch (err) {
    console.error('Error getting all emails:', err);
    return [];
  }
}

/**
 * Delete a specific email by ID
 */
async function deleteEmailById(id) {
  try {
    const result = await Email.deleteOne({ id: id });
    return result.deletedCount > 0;
  } catch (err) {
    console.error('Error deleting email:', err);
    return false;
  }
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
