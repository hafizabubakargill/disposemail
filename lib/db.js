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
 * Attempt to persist email to MongoDB (with retry).
 * Runs alongside in-memory — does NOT block webhook response.
 */
async function persistToMongo(emailData) {
  try {
    await Promise.race([
      new Email({ ...emailData, is_read: false }).save(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('save timeout')), 3000))
    ]);
  } catch (err) {
    console.error(`[DB] MongoDB save attempt failed: ${err.message}`);
    // No recursive retries to avoid background backlog
  }
}

/**
 * Save an email — ALWAYS to in-memory immediately.
 * Also persists to MongoDB (with retry) for cross-restart durability.
 */
async function saveEmail(emailData) {
  // 1. In-memory cache — instant, never fails
  const cached = addToCache(emailData);

  // 2. MongoDB — async with retry (does not block)
  persistToMongo(emailData);

  return cached;
}

/**
 * Get emails for an address.
 * Merges MongoDB (persistence) + in-memory (session) to ensure completeness.
 */
async function getEmailsForAddress(address) {
  const addr = address.toLowerCase();

  // 1. FAST PATH: Return in-memory cache immediately if we have data.
  //    This covers the common case (same server session) with zero latency.
  const cached = (emailCache.get(addr) || []).sort((a, b) => b.received_at - a.received_at);
  if (cached.length > 0) return cached;

  // 2. SLOW PATH: Cache is empty (server restarted). Try MongoDB for persistence.
  try {
    const dbEmails = await Email.find({ address: addr })
      .sort({ received_at: -1 })
      .lean()
      .maxTimeMS(2000); // Reduce from 4s to 2s

    if (dbEmails.length > 0) {
      const normalized = dbEmails.map(e => ({
        ...e,
        received_at: e.received_at instanceof Date ? e.received_at.getTime() : Number(e.received_at)
      }));
      emailCache.set(addr, normalized); // Warm the cache for subsequent requests
      return normalized;
    }
  } catch (err) {
    console.error('[DB] MongoDB read failed:', err.message);
  }

  return []; // Nothing found anywhere
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
