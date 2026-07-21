import { NextResponse } from 'next/server';
import { englishPosts } from '@/lib/blog-data/en';
import { useCases } from '@/lib/use-cases';

export const dynamic = 'force-static';
export const revalidate = 86400;

const BASE_URL = 'https://disposemail.xyz';
const LOCALES = ['en', 'es', 'pt', 'ru', 'zh'];

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
    const now = new Date();
    const lastmod = now.toISOString().replace('Z', '+00:00');

    // Collect base relative paths (e.g. '', '/about', '/blog/my-post', '/temp-mail-for-qa')
    const basePaths: { path: string, basePriority: string }[] = [];

    // Static Routes
    STATIC_ROUTES.forEach(route => {
        basePaths.push({ path: route.path, basePriority: route.priority });
    });

    // Blog Routes
    englishPosts.forEach(post => {
        basePaths.push({ path: `/blog/${post.slug}`, basePriority: '0.64' });
    });

    // Use Case Routes (from English use cases as baseline slugs)
    const enCases = useCases.en || [];
    enCases.forEach(uc => {
        basePaths.push({ path: `/${uc.slug}`, basePriority: '0.64' });
    });

    const urlEntries: string[] = [];

    // For every base path, generate entries for ALL 5 locales with xhtml:link hreflang annotations
    basePaths.forEach(({ path, basePriority }) => {
        const alternateLinks = LOCALES.map(loc => {
            const prefix = loc === 'en' ? '' : `/${loc}`;
            const href = `${BASE_URL}${prefix}${path}`;
            return `  <xhtml:link rel="alternate" hreflang="${loc}" href="${href}" />`;
        });
        alternateLinks.push(`  <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}" />`);

        LOCALES.forEach(loc => {
            const prefix = loc === 'en' ? '' : `/${loc}`;
            const canonical = `${BASE_URL}${prefix}${path}`;
            const priority = loc === 'en' ? basePriority : (parseFloat(basePriority) * 0.9).toFixed(2);

            urlEntries.push(`<url>
  <loc>${canonical}</loc>
${alternateLinks.join('\n')}
  <lastmod>${lastmod}</lastmod>
  <priority>${priority}</priority>
</url>`);
        });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
