const Email = require('../models/Email');

// =========================================================
// IN-MEMORY CACHE (Primary — always works, zero latency)
// MongoDB is a background fallback for persistence only.
// Since emails are ephemeral (1 hour), this is perfectly safe.
// =========================================================
const emailCache = new Map();       // address -> Email[]
const cacheTouchedAt = new Map();   // address -> timestamp (for negative-cache expiry)
const emailIdToAddress = new Map(); // email.id -> address (O(1) lookup by ID)
const MAX_INBOX_CACHE_ENTRIES = 20000;
const MAX_IN_MEMORY_RAW_BYTES = 150 * 1024; // Only keep raw MIME in RAM if <= 150KB; full raw stays in MongoDB

function touchAddress(addr) {
  cacheTouchedAt.set(addr, Date.now());
  // Evict oldest cached address if cache grows beyond 20,000 active inboxes during a surge
  if (emailCache.size > MAX_INBOX_CACHE_ENTRIES) {
    const oldestKey = emailCache.keys().next().value;
    if (oldestKey) {
      const oldEmails = emailCache.get(oldestKey) || [];
      for (const e of oldEmails) emailIdToAddress.delete(e.id);
      emailCache.delete(oldestKey);
      cacheTouchedAt.delete(oldestKey);
    }
  }
}

function addToCache(emailData) {
  const addr = emailData.address.toLowerCase();
  if (!emailCache.has(addr)) emailCache.set(addr, []);
  touchAddress(addr);

  const existing = emailCache.get(addr);
  if (!existing.find(e => e.id === emailData.id)) {
    // Keep RAM lean during traffic surges: omit huge raw MIME strings (>150KB) from in-memory array
    const memCopy = { ...emailData, is_read: false };
    if (memCopy.raw && memCopy.raw.length > MAX_IN_MEMORY_RAW_BYTES) {
      delete memCopy.raw;
    }
    existing.unshift(memCopy);
    emailIdToAddress.set(emailData.id, addr);

    if (existing.length > 100) {
      const evicted = existing.pop();
      if (evicted) emailIdToAddress.delete(evicted.id);
    }
  }
  return emailData;
}

// Auto-cleanup cache every 5 minutes (removes emails/inboxes older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [addr, emails] of emailCache.entries()) {
    const fresh = emails.filter(e => {
      const keep = (e.received_at || 0) > oneHourAgo;
      if (!keep) emailIdToAddress.delete(e.id);
      return keep;
    });
    const lastTouched = cacheTouchedAt.get(addr) || 0;
    if (fresh.length === 0 && lastTouched < oneHourAgo) {
      emailCache.delete(addr);
      cacheTouchedAt.delete(addr);
    } else {
      emailCache.set(addr, fresh);
    }
  }
}, 5 * 60 * 1000);

/**
 * Attempt to persist email to MongoDB (with timeout).
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
  }
}

/**
 * Save an email — ALWAYS to in-memory immediately.
 * Also persists to MongoDB in background for cross-restart durability.
 */
async function saveEmail(emailData) {
  const cached = addToCache(emailData);
  persistToMongo(emailData);
  return cached;
}

/**
 * Get emails for an address.
 * Uses negative caching so empty inboxes do NOT hammer MongoDB on every poll.
 */
async function getEmailsForAddress(address) {
  const addr = address.toLowerCase();

  // 1. FAST PATH: If this inbox is already tracked in memory (even if empty []),
  //    return immediately with zero latency and zero MongoDB queries.
  if (emailCache.has(addr)) {
    touchAddress(addr);
    return (emailCache.get(addr) || []).sort((a, b) => b.received_at - a.received_at);
  }

  // 2. SLOW PATH: First time seeing this address since server boot. Check MongoDB once.
  try {
    const dbEmails = await Email.find({ address: String(addr) })
      .select('-raw') // Exclude heavy raw MIME from list queries
      .sort({ received_at: -1 })
      .lean()
      .maxTimeMS(2000);

    const normalized = dbEmails.map(e => {
      const item = {
        ...e,
        received_at: e.received_at instanceof Date ? e.received_at.getTime() : Number(e.received_at)
      };
      emailIdToAddress.set(item.id, addr);
      return item;
    });

    // Cache both non-empty AND empty results so subsequent polls hit RAM
    emailCache.set(addr, normalized);
    touchAddress(addr);
    return normalized;
  } catch (err) {
    console.error('[DB] MongoDB read failed:', err.message);
    return [];
  }
}

/**
 * Mark email as read (O(1) lookup)
 */
async function markEmailAsRead(id) {
  const addr = emailIdToAddress.get(id);
  if (addr && emailCache.has(addr)) {
    const e = emailCache.get(addr).find(item => item.id === id);
    if (e) e.is_read = true;
  }
  Email.updateOne({ id: String(id) }, { is_read: true }).catch(() => {});
  return true;
}

/**
 * Mark email as unread (O(1) lookup)
 */
async function markEmailAsUnread(id) {
  const addr = emailIdToAddress.get(id);
  if (addr && emailCache.has(addr)) {
    const e = emailCache.get(addr).find(item => item.id === id);
    if (e) e.is_read = false;
  }
  Email.updateOne({ id: String(id) }, { is_read: false }).catch(() => {});
  return true;
}

/**
 * Get email by ID (O(1) memory lookup, falls back to MongoDB if raw MIME was omitted from RAM)
 */
async function getEmailById(id) {
  const addr = emailIdToAddress.get(id);
  if (addr && emailCache.has(addr)) {
    const e = emailCache.get(addr).find(item => item.id === id);
    if (e && e.raw) return e;
  }
  try {
    return await Email.findOne({ id: String(id) }).lean();
  } catch {
    return null;
  }
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
 * Delete email by ID (O(1) lookup)
 */
async function deleteEmailById(id) {
  let deleted = false;
  const addr = emailIdToAddress.get(id);
  if (addr && emailCache.has(addr)) {
    const emails = emailCache.get(addr);
    const filtered = emails.filter(e => e.id !== id);
    if (filtered.length < emails.length) deleted = true;
    emailCache.set(addr, filtered);
    emailIdToAddress.delete(id);
  }
  Email.deleteOne({ id: String(id) }).catch(() => {});
  return deleted;
}

/**
 * Permanently wipe all emails for an address (Burn Inbox)
 */
async function deleteEmailsForAddress(address) {
  if (!address) return false;
  const addr = address.toLowerCase();
  const existing = emailCache.get(addr) || [];
  for (const e of existing) {
    emailIdToAddress.delete(e.id);
  }
  emailCache.set(addr, []);
  touchAddress(addr);
  Email.deleteMany({ address: String(addr) }).catch(() => {});
  return true;
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
  deleteEmailById,
  deleteEmailsForAddress
};

