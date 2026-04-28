const redis = require('./redis');

// =========================================================
// IN-MEMORY CACHE (Primary — always works, zero latency)
// Redis is a background fallback for cross-restart persistence.
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
    const fresh = emails.filter(e => {
        const received = e.received_at instanceof Date ? e.received_at.getTime() : Number(e.received_at);
        return received > oneHourAgo;
    });
    if (fresh.length === 0) emailCache.delete(addr);
    else emailCache.set(addr, fresh);
  }
}, 5 * 60 * 1000);

/**
 * Attempt to persist email to Redis.
 * Runs alongside in-memory — does NOT block webhook response.
 */
async function persistToRedis(emailData) {
  try {
    if (!redis) return;
    const addr = emailData.address.toLowerCase();
    const key = `inbox:${addr}`;
    
    // Store as JSON string in a List
    await redis.lpush(key, JSON.stringify({ ...emailData, is_read: false }));
    // Set 1 hour expiry (3600 seconds)
    await redis.expire(key, 3600);
    // Trim list to keep only last 100 emails
    await redis.ltrim(key, 0, 99);
  } catch (err) {
    console.error(`[DB] Redis save attempt failed: ${err.message}`);
  }
}

/**
 * Save an email — ALWAYS to in-memory immediately.
 * Also persists to Redis for cross-restart durability.
 */
async function saveEmail(emailData) {
  // 1. In-memory cache — instant, never fails
  const cached = addToCache(emailData);

  // 2. Redis — async (does not block)
  persistToRedis(emailData);

  return cached;
}

/**
 * Get emails for an address.
 */
async function getEmailsForAddress(address) {
  const addr = address.toLowerCase();

  // 1. FAST PATH: Return in-memory cache immediately if we have data.
  const cached = (emailCache.get(addr) || []).sort((a, b) => {
      const timeA = a.received_at instanceof Date ? a.received_at.getTime() : Number(a.received_at);
      const timeB = b.received_at instanceof Date ? b.received_at.getTime() : Number(b.received_at);
      return timeB - timeA;
  });
  if (cached.length > 0) return cached;

  // 2. SLOW PATH: Cache is empty (server restarted). Try Redis for persistence.
  try {
    if (!redis) return [];
    const key = `inbox:${addr}`;
    const rawEmails = await redis.lrange(key, 0, 99);

    if (rawEmails && rawEmails.length > 0) {
      const normalized = rawEmails.map(raw => {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          return {
              ...parsed,
              received_at: parsed.received_at instanceof Date ? parsed.received_at.getTime() : Number(parsed.received_at)
          };
      });
      emailCache.set(addr, normalized); // Warm the cache
      return normalized;
    }
  } catch (err) {
    console.error('[DB] Redis read failed:', err.message);
  }

  return [];
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
  return null;
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
  return deleted;
}

/**
 * Cleanup
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
