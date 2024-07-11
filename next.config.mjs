/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/dashboard',
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
