/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // Disabled strict mode for hydration stability
    transpilePackages: ['lucide-react'],
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Performance optimizations
    compress: true,
    swcMinify: true,
    // Enable SWC minification for faster builds

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        // Reduced for faster updates
        unoptimized: false,
        // Keep optimization enabled
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.ambrecandle.com',
                pathname: '/**',
            },
        ],
    },

    // Production source maps disabled for faster builds
    productionBrowserSourceMaps: false,

    // Increase body size limit for large uploads
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        }
    },

    // Security Headers
    async headers() {
        return [
            {
                // Apply these headers to all routes in the application
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
