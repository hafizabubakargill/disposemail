// Cookie/ad consent state shared by the banner, the analytics loader and the footer link.
export const CONSENT_KEY = 'disposemail_consent';
const LEGACY_KEY = 'disposemail_cookie_consent'; // old banner stored 'true' after "Accept All"

export type Consent = { analytics: boolean; ads: boolean };

export const CONSENT_EVENT = 'disposemail:consent';
export const OPEN_CONSENT_EVENT = 'disposemail:open-consent';

export function readConsent(): Consent | null {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (raw) {
            const c = JSON.parse(raw);
            return { analytics: !!c.analytics, ads: !!c.ads };
        }
        if (localStorage.getItem(LEGACY_KEY) === 'true') return { analytics: true, ads: true };
    } catch {
        /* storage unavailable: treat as no choice made */
    }
    return null;
}

export function applyConsentToGoogle(c: Consent) {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    const gtag = w.gtag || function () { w.dataLayer.push(arguments); };
    gtag('consent', 'update', {
        analytics_storage: c.analytics ? 'granted' : 'denied',
        ad_storage: c.ads ? 'granted' : 'denied',
        ad_user_data: c.ads ? 'granted' : 'denied',
        ad_personalization: c.ads ? 'granted' : 'denied',
    });
}

export function saveConsent(c: Consent) {
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...c, ts: Date.now() }));
    } catch {
        /* ignore */
    }
    applyConsentToGoogle(c);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
}
