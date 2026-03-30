import { NextResponse } from 'next/server';
import { englishPosts } from '@/lib/blog-data/en';
import { useCases } from '@/lib/use-cases';

const BASE_URL = 'https://disposemail.xyz';

const STATIC_ROUTES = [
    { path: '', priority: '1.00' },
    { path: '/about', priority: '0.80' },
    { path: '/blog', priority: '0.80' },
    { path: '/free-tools', priority: '0.90' },
    { path: '/ip-lookup', priority: '0.90' },
    { path: '/domain-checker', priority: '0.90' },
    { path: '/password-generator', priority: '0.85' },
    { path: '/identity-generator', priority: '0.85' },
    { path: '/qr-code-generator', priority: '0.85' },
    { path: '/uuid-generator', priority: '0.85' },
    { path: '/base64', priority: '0.85' },
    { path: '/test-card-generator', priority: '0.85' },
    { path: '/faq', priority: '0.80' },
    { path: '/contact', priority: '0.80' },
    { path: '/privacy', priority: '0.70' },
    { path: '/terms', priority: '0.70' },
    { path: '/api-docs', priority: '0.75' },
];

export async function GET() {
    // Generate ISO string, e.g. 2026-03-08T09:35:47+00:00 instead of strict Z ending
    const now = new Date();
    const lastmod = now.toISOString().replace('Z', '+00:00');

    // Dynamically map blog posts
    const BLOG_ROUTES = englishPosts.map(post => ({
        path: `/blog/${post.slug}`,
        priority: '0.64'
    }));

    // Dynamically map use cases
    const englishUseCases = useCases.en || [];
    const USE_CASE_ROUTES = englishUseCases.map(uc => ({
        path: `/${uc.slug}`,
        priority: '0.64'
    }));

    const ROUTES = [...STATIC_ROUTES, ...BLOG_ROUTES, ...USE_CASE_ROUTES];

    // Build flat URL set
    const urls = ROUTES.map((route) => {
        const canonical = `${BASE_URL}${route.path}`;
        return `<url>
  <loc>${canonical}</loc>
  <lastmod>${lastmod}</lastmod>
  <priority>${route.priority}</priority>
</url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
