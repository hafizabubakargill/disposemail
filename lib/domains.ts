// Base domains for email generation.
// To add a new domain:
// 1. Add it to Cloudflare Email Routing (Catch-All → Worker).
// 2. Add the string to this array.
// 3. Re-deploy.
//
// NOTE: disposemail.xyz is intentionally excluded so traffic is spread
// across the alternative domains (better for spam-filter avoidance).

export const BASE_DOMAINS = [
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com',
    'nivoramail.pro',
    'avelixmail.pro',
    'oryvomail.pro',
    'noviqmail.pro',
    'noemi.co.com'
];

export const DOMAINS = [
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com',
    'nivoramail.pro',
    'avelixmail.pro',
    'oryvomail.pro',
    'noviqmail.pro',
    'noemi.co.com'
];

/**
 * Generates a random subdomain address: [4-char].[base-domain]
 * Example: x7a2.noviqmail.pro
 * The 4-char subdomain is unique per session, so two users with the same
 * custom local-part are guaranteed different, non-overlapping inboxes.
 * Requires wildcard MX records (*.domain) in Cloudflare DNS — already configured.
 */
export const generateRandomDomain = (): string => {
    const base = BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];
    const sub = Math.random().toString(36).substring(2, 6); // 4 chars, e.g. x7a2
    return `${sub}.${base}`;
};

// Helper to pick a truly random base domain (same as above, kept for compatibility)
export const getRandomBaseDomain = (): string =>
    BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];

// Kept for compatibility if imported elsewhere
export const DEFAULT_DOMAIN = BASE_DOMAINS[0];

