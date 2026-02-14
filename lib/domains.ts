// Base domains for random subdomain generation
// To add a new domain:
// 1. Add it to Cloudflare Email Routing (and point to the same Worker).
// 2. Add the string to this array.
// 3. Re-deploy.

export const BASE_DOMAINS = [
    'disposemail.xyz',
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com'
];

export const DOMAINS = [
    'disposemail.xyz',
    'inveromail.info',
    'dunedistrict.com',
    'groundtips.com'
];

/**
 * Generates a random domain using one of the base domains.
 * Format: [random-subdomain].[base-domain]
 * Example: x7a2.inveromail.info
 */
export const generateRandomDomain = (): string => {
    const base = BASE_DOMAINS[Math.floor(Math.random() * BASE_DOMAINS.length)];
    // Generate a short, random subdomain (3-5 chars for readability)
    const sub = Math.random().toString(36).substring(2, 6); // 4 chars
    return `${sub}.${base}`;
};

// Kept for compatibility if imported elsewhere, but should be replaced by dynamic generation
export const DEFAULT_DOMAIN = BASE_DOMAINS[0];
