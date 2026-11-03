const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        workerThreads: false,
        cpus: 2,
    },
    generateBuildId: async () => {
        // This ensures the build ID is stable between deployments if the version is same
        return 'disposemail-v1';
    },
    async redirects() {
        // 301s for blog posts removed during the AdSense cleanup, so existing links
        // and search clicks land on the closest surviving page.
        const DISAMBIG = '/blog/tempmail-xyz-dispomail-xyz-free-temporary-email-guide';
        const ALT10 = '/blog/best-10-minute-mail-alternatives-2026';
        const removed = {
            'why-dispomail-best-disposable-email-generator-2026': DISAMBIG,
            'what-is-dispomail-ultimate-guide': DISAMBIG,
            'stop-spam-instantly-guide-using-dispomail': DISAMBIG,
            'disposalmail-free-disposable-email-generator-guide': DISAMBIG,
            'is-dipsasarchive-xyz-disposable-email-domain': DISAMBIG,
            '10-minute-mail-alternative-upgrade': ALT10,
            'temporary-email-netflix-trials-safe-access': '/temp-mail-for-netflix',
            'temp-mail-for-streaming-spotify-netflix': '/temp-mail-for-netflix',
            'discord-instagram-spotify-temp-mail-verification-guide-2026': '/blog',
            'how-to-use-temporary-email-for-discord': '/blog',
            'temporary-email-discord-gaming-identity': '/blog',
            'disposable-emails-free-trials': '/blog',
            'disposemail-launches-on-saashub-and-chrome-web-store': '/blog',
            'how-custom-email-prefixes-eliminate-spam-tracking': '/blog',
            'fake-identity-generator-use-cases': '/blog',
            'ultimate-guide-create-fake-identity-online': '/blog',
        };
        const rules = [];
        for (const [slug, dest] of Object.entries(removed)) {
            rules.push({ source: `/blog/${slug}`, destination: dest, permanent: true });
            rules.push({ source: `/:locale(en|es|pt|ru|zh)/blog/${slug}`, destination: dest, permanent: true });
        }
        return rules;
    },
    async rewrites() {
        return [
            {
                source: '/sitemap-index.xml',
                destination: '/sitemap.xml',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    {
                        key: 'X-Robots-Tag',
                        value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
                    },
                ],
            },
        ];
    },
};

module.exports = withNextIntl(nextConfig);
