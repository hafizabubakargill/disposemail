import { BASE_DOMAINS } from './domains';

// A small, hand-maintained list of widely known disposable email providers.
// It is intentionally not exhaustive: new disposable domains appear daily, so a
// domain that is not listed here may still be disposable.
export const KNOWN_DISPOSABLE_DOMAINS = [
    '10minutemail.com', '10minutemail.net', 'anonbox.net', 'burnermail.io',
    'discard.email', 'dispostable.com', 'emailondeck.com', 'fakeinbox.com',
    'getnada.com', 'grr.la', 'guerrillamail.biz', 'guerrillamail.com',
    'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org', 'jetable.org',
    'mailcatch.com', 'maildrop.cc', 'mailinator.com', 'mailnesia.com',
    'mintemail.com', 'mohmal.com', 'sharklasers.com', 'spambox.us',
    'spamgourmet.com', 'tempail.com', 'temp-mail.io', 'temp-mail.org',
    'tempinbox.com', 'tempmail.com', 'tempmail.net', 'tempr.email',
    'throwawaymail.com', 'trashmail.com', 'trashmail.net', 'yopmail.com',
    'yopmail.fr',
];

export const OWN_DOMAINS = [...BASE_DOMAINS, 'disposemail.xyz'];

export type DisposableVerdict = 'known' | 'own' | 'unlisted';

export function classifyDomain(domain: string): DisposableVerdict {
    const d = domain.toLowerCase();
    if (OWN_DOMAINS.includes(d)) return 'own';
    // Match the domain itself or any subdomain of a listed domain.
    if (KNOWN_DISPOSABLE_DOMAINS.some(k => d === k || d.endsWith('.' + k))) return 'known';
    return 'unlisted';
}
