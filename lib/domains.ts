// List of available domains
// To add a new domain:
// 1. Add it to Cloudflare Email Routing (and point to the same Worker).
// 2. Add the string to this array.
// 3. Re-deploy.

export const DOMAINS = [
    'disposemail.xyz',
    'groundtips.com'
];

export const DEFAULT_DOMAIN = DOMAINS[0];
