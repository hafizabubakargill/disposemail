const Email = require('../models/Email');

// =========================================================
// IN-MEMORY CACHE (Primary — always works, zero latency)
// MongoDB is a background fallback for persistence only.
// Since emails are ephemeral (1 hour), this is perfectly safe.
// =========================================================
const emailCache = new Map(); // address -> Email[]

function addToCache(emailData) {
  const addr = emailData.address.toLowerCase();
  if (!emailCache.has(addr)) emailCache.set(addr, []);
  const existing = emailCache.get(addr);
  if (!existing.find(e => e.id === emailData.id)) {
    existing.unshift({ ...emailData, is_read: false });
    if (existing.length > 100) existing.pop(); // cap per inbox
  }
  return emailData;
}

// Auto-cleanup cache every 5 minutes (removes emails older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [addr, emails] of emailCache.entries()) {
    const fresh = emails.filter(e => (e.received_at || 0) > oneHourAgo);
    if (fresh.length === 0) emailCache.delete(addr);
    else emailCache.set(addr, fresh);
  }
}, 5 * 60 * 1000);

/**
 * Save an email — always succeeds via in-memory.
 * MongoDB save happens in background (silent fallback).
 */
async function saveEmail(emailData) {
  // 1. ALWAYS save to in-memory first (never fails)
  const cached = addToCache(emailData);

  // 2. Try to persist to MongoDB silently in the background
  Email.findOne({ id: emailData.id })
    .then(exists => {
      if (!exists) {
        return new Email({ ...emailData, is_read: false }).save();
      }
    })
    .catch(err => console.error('[DB] MongoDB background save failed:', err.message));

  return cached;
}

/**
 * Get emails for an address.
 * Returns in-memory results instantly, tries to enrich from MongoDB.
 */
async function getEmailsForAddress(address) {
  const addr = address.toLowerCase();

  // Try MongoDB first for persistence across restarts
  try {
    const dbEmails = await Email.find({ address: addr })
      .sort({ received_at: -1 })
      .lean()
      .maxTimeMS(3000); // 3 second timeout max

    if (dbEmails.length > 0) {
      // Sync the in-memory cache with what's in DB
      emailCache.set(addr, dbEmails.map(e => ({ ...e, received_at: new Date(e.received_at).getTime() })));
      return dbEmails;
    }
  } catch (err) {
    console.error('[DB] MongoDB read failed, using cache:', err.message);
  }

  // Fall back to in-memory cache (always available)
  return (emailCache.get(addr) || []).sort((a, b) => b.received_at - a.received_at);
}

/**
 * Mark email as read
 */
async function markEmailAsRead(id) {
  // Update in-memory
  for (const emails of emailCache.values()) {
    const e = emails.find(e => e.id === id);
    if (e) e.is_read = true;
  }
  // Background DB update
  Email.updateOne({ id }, { is_read: true }).catch(() => {});
  return true;
}

/**
 * Mark email as unread
 */
async function markEmailAsUnread(id) {
  for (const emails of emailCache.values()) {
    const e = emails.find(e => e.id === id);
    if (e) e.is_read = false;
  }
  Email.updateOne({ id }, { is_read: false }).catch(() => {});
  return true;
}

/**
 * Get email by ID
 */
async function getEmailById(id) {
  for (const emails of emailCache.values()) {
    const e = emails.find(e => e.id === id);
    if (e) return e;
  }
  try {
    return await Email.findOne({ id }).lean();
  } catch { return null; }
}

/**
 * Get all emails (for debugging)
 */
async function getAllEmails() {
  const all = [];
  for (const emails of emailCache.values()) all.push(...emails);
  return all;
}

/**
 * Delete email by ID
 */
async function deleteEmailById(id) {
  let deleted = false;
  for (const [addr, emails] of emailCache.entries()) {
    const before = emails.length;
    emailCache.set(addr, emails.filter(e => e.id !== id));
    if (emailCache.get(addr).length < before) deleted = true;
  }
  Email.deleteOne({ id }).catch(() => {});
  return deleted;
}

/**
 * Cleanup (no-op — handled by TTL index + interval)
 */
async function cleanupOldEmails() { return; }

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
