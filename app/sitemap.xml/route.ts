import { NextResponse } from 'next/server';
import { englishPosts } from '@/lib/blog-data/en';
import { useCases } from '@/lib/use-cases';

const BASE_URL = 'https://disposemail.xyz';
const LOCALES = ['en', 'es', 'pt', 'ru', 'zh'];

const STATIC_ROUTES = [
    { path: '', priority: '1.0', freq: 'daily' },
    { path: '/about', priority: '0.8', freq: 'monthly' },
    { path: '/faq', priority: '0.8', freq: 'monthly' },
    { path: '/privacy', priority: '0.7', freq: 'monthly' },
    { path: '/terms', priority: '0.7', freq: 'monthly' },
    { path: '/blog', priority: '0.9', freq: 'daily' },
    { path: '/contact', priority: '0.7', freq: 'monthly' }
];

export async function GET() {
    const now = new Date().toISOString();

    // Dynamically map blog posts
    const BLOG_ROUTES = englishPosts.map(post => ({
        path: `/blog/${post.slug}`,
        priority: '0.8',
        freq: 'weekly'
    }));

    // Dynamically map use cases (e.g. /temp-mail-for-facebook)
    const englishUseCases = useCases.en || [];
    const USE_CASE_ROUTES = englishUseCases.map(uc => ({
        path: `/${uc.slug}`,
        priority: '0.8',
        freq: 'monthly'
    }));

    const ROUTES = [...STATIC_ROUTES, ...BLOG_ROUTES, ...USE_CASE_ROUTES];

    // Build URL set
    const urls = ROUTES.map((route) => {
        const alternates = LOCALES.map((lang) => {
            const hrefLang = lang === 'en' ? `${BASE_URL}${route.path}` : `${BASE_URL}/${lang}${route.path}`;
            return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${hrefLang}"/>`;
        }).join('\n');

        const canonical = `${BASE_URL}${route.path}`;
        return `  <url>
    <loc>${canonical}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
${alternates}
  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
