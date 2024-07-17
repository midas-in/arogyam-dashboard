/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/dashboard',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                basePath: false,
                permanent: false
            }
        ]
    },
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "*.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "*",
            },
        ],
    },
};

export default nextConfig;
