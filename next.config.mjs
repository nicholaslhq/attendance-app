/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, //For react-big-calendar button to work
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    }
};

export default nextConfig;
