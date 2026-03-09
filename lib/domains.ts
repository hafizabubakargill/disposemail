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
    'noviqmail.pro'
];

export const DOMAINS = [
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com',
    'nivoramail.pro',
    'avelixmail.pro',
    'oryvomail.pro',
    'noviqmail.pro'
];

/**
 * Picks a random domain from BASE_DOMAINS.
 * Uses the apex domain directly so Cloudflare Catch-All can route it.
 */
export const generateRandomDomain = (): string =>
    BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];

// Helper to pick a truly random base domain (same as above, kept for compatibility)
export const getRandomBaseDomain = (): string =>
    BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];

// Kept for compatibility if imported elsewhere
export const DEFAULT_DOMAIN = BASE_DOMAINS[0];

