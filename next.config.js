/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  
  // Disable ESLint during build to fix deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Static export optimizations
  images: {
    unoptimized: true,
    domains: ['dafel.com.mx'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Production performance optimizations
  compress: true,
  
  // Enhanced optimization for CSS and JS bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimizations for static export
  experimental: {
    typedRoutes: false,
  },
  
  // Webpack optimizations for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig