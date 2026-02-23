import { NextResponse } from 'next/server';

const BASE_URL = 'https://disposemail.xyz';
const LOCALES = ['en', 'es', 'pt', 'ru', 'zh'];

const ROUTES = [
    { path: '', priority: '1.0', freq: 'monthly' },
    { path: '/about', priority: '0.8', freq: 'monthly' },
    { path: '/faq', priority: '0.8', freq: 'monthly' },
    { path: '/privacy', priority: '0.7', freq: 'monthly' },
    { path: '/terms', priority: '0.7', freq: 'monthly' },
    { path: '/api-docs', priority: '0.8', freq: 'monthly' },
    { path: '/blog', priority: '0.9', freq: 'weekly' },
    { path: '/contact', priority: '0.7', freq: 'monthly' },
    { path: '/blog/why-disposable-emails-essential-privacy', priority: '0.8', freq: 'weekly' },
    { path: '/blog/avoiding-spam-with-temporary-inboxes', priority: '0.8', freq: 'weekly' },
    { path: '/blog/evolution-of-email-privacy-2026', priority: '0.8', freq: 'weekly' },
    { path: '/blog/secure-online-shopping-disposable-emails', priority: '0.8', freq: 'weekly' },
    { path: '/blog/top-privacy-extensions-temporary-inbox', priority: '0.8', freq: 'weekly' },
    { path: '/blog/dangers-reusing-email-social-media', priority: '0.8', freq: 'weekly' },
    { path: '/temp-mail-for-facebook', priority: '0.8', freq: 'monthly' },
    { path: '/temp-mail-for-netflix', priority: '0.8', freq: 'monthly' },
    { path: '/temp-mail-for-instagram', priority: '0.8', freq: 'monthly' },
    { path: '/temp-mail-for-amazon', priority: '0.8', freq: 'monthly' },
    { path: '/temp-mail-for-spotify', priority: '0.8', freq: 'monthly' },
];

export async function GET() {
    const now = new Date().toISOString();

    const urls = ROUTES.map((route) => {
        const alternates = LOCALES.map((lang) => {
            const hrefLang = lang === 'en' ? `${BASE_URL}${route.path}` : `${BASE_URL}/${lang}${route.path}`;
            return `<xhtml:link rel="alternate" hreflang="${lang}" href="${hrefLang}"/>`;
        }).join('\n      ');

        const canonical = `${BASE_URL}${route.path}`;
        return `
  <url>
    <loc>${canonical}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
    ${alternates}
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
