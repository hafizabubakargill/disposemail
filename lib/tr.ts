import { dict } from './tr-dict';

// Translates a hard-coded English UI string. Falls back to the English text when
// there is no entry for the locale, so a missing translation never breaks a page.
export function tr(locale: string, en: string): string {
    if (locale === 'en') return en;
    return dict[en]?.[locale as 'es' | 'pt' | 'ru' | 'zh'] ?? en;
}

// Translates the title/description (and OpenGraph copies) of a static metadata object.
export function localizeMeta<T extends Record<string, any>>(meta: T, locale: string): T {
    const out: any = { ...meta };
    for (const k of ['title', 'description']) {
        if (typeof out[k] === 'string') out[k] = tr(locale, out[k]);
    }
    if (out.openGraph) {
        out.openGraph = { ...out.openGraph };
        for (const k of ['title', 'description']) {
            if (typeof out.openGraph[k] === 'string') out.openGraph[k] = tr(locale, out.openGraph[k]);
        }
    }
    if (out.twitter) {
        out.twitter = { ...out.twitter };
        for (const k of ['title', 'description']) {
            if (typeof out.twitter[k] === 'string') out.twitter[k] = tr(locale, out.twitter[k]);
        }
    }
    return out;
}
