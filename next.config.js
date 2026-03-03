const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    generateBuildId: async () => {
        // This ensures the build ID is stable between deployments if the version is same
        return 'disposemail-v1';
    },
    async redirects() {
        return [
            {
                source: '/:locale/api-docs',
                destination: '/:locale',
                permanent: true,
            },
            {
                source: '/:locale/api-doc',
                destination: '/:locale',
                permanent: true,
            },
            {
                source: '/api-docs',
                destination: '/',
                permanent: true,
            },
            {
                source: '/api-doc',
                destination: '/',
                permanent: true,
            }
        ];
    }
};

module.exports = withNextIntl(nextConfig);
