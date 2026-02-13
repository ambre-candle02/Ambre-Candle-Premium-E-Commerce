/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['lucide-react'],

    // Performance optimizations
    compress: true,

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 3600,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.ambrecandle.com',
                pathname: '/**',
            },
        ],
    },


    // Reduce bundle size
    modularizeImports: {
        'lucide-react': {
            transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
        },
    },

    // Increase body size limit for large uploads
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        }
    },
};

export default nextConfig;
