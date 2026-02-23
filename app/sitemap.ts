import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://disposemail.xyz';
    const locales = ['en', 'es', 'pt', 'ru', 'zh'];

    const routes = [
        '',
        '/about',
        '/faq',
        '/privacy',
        '/terms',
        '/api-docs',
        '/blog',
        '/contact',
        '/blog/why-disposable-emails-essential-privacy',
        '/blog/avoiding-spam-with-temporary-inboxes',
        '/blog/evolution-of-email-privacy-2026',
        '/blog/secure-online-shopping-disposable-emails',
        '/blog/top-privacy-extensions-temporary-inbox',
        '/blog/dangers-reusing-email-social-media',
        '/temp-mail-for-facebook',
        '/temp-mail-for-netflix',
        '/temp-mail-for-instagram',
        '/temp-mail-for-amazon',
        '/temp-mail-for-spotify',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route.includes('blog') ? 'weekly' : 'monthly' as any,
        priority: route === '' ? 1 : 0.8,
        alternates: {
            languages: Object.fromEntries(
                locales.map((lang) => [
                    lang,
                    `${baseUrl}${lang === 'en' ? '' : `/${lang}`}${route}`
                ])
            ),
        },
    }));
}
