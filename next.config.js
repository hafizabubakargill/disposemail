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
