/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    generateBuildId: async () => {
        // This ensures the build ID is stable between deployments if the version is same
        return 'disposemail-v1';
    },
};

module.exports = nextConfig;
