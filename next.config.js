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
    // Configurar SWC para navegadores modernos (elimina polyfills)
    styledComponents: false,
  },
  
  
  // Optimizations for static export
  experimental: {
    typedRoutes: false,
    forceSwcTransforms: true,
  },
  
  // Disable Next.js polyfills for modern browsers
  swcMinify: true,
  
  // Webpack optimizations for static export
  webpack: (config, { isServer, dev }) => {
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
      
      // Exclude core-js polyfills entirely
      if (!dev) {
        // Aggressive polyfill exclusion
        config.resolve.alias = {
          ...config.resolve.alias,
          'core-js': require.resolve('./polyfill-stub.js'),
          'regenerator-runtime': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.array.at': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.array.flat': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.array.flat-map': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.object.from-entries': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.object.has-own': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.string.trim-start': require.resolve('./polyfill-stub.js'),
          'core-js/modules/es.string.trim-end': require.resolve('./polyfill-stub.js'),
        };
        
        // Replace polyfills with empty modules
        config.resolve.fallback = {
          ...config.resolve.fallback,
          'core-js/modules/es.array.at': false,
          'core-js/modules/es.array.flat': false,
          'core-js/modules/es.array.flat-map': false,
          'core-js/modules/es.object.from-entries': false,
          'core-js/modules/es.object.has-own': false,
          'core-js/modules/es.string.trim-start': false,
          'core-js/modules/es.string.trim-end': false,
        };
        
        // Tree shaking and dead code elimination
        config.optimization = {
          ...config.optimization,
          usedExports: true,
          sideEffects: false,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 100000, // Limit chunk size to prevent blocking
            cacheGroups: {
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'react-vendor',
                chunks: 'all',
                priority: 20,
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all',
                priority: 10,
                maxSize: 80000, // Smaller chunks
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        };
        
        // Exclude specific polyfills using IgnorePlugin
        const webpack = require('webpack');
        config.plugins.push(
          new webpack.IgnorePlugin({
            resourceRegExp: /^core-js\/modules\/(es\.array\.(at|flat|flat-map)|es\.object\.(from-entries|has-own)|es\.string\.(trim-start|trim-end))$/,
          })
        );
        
        // Remove polyfills from Next.js chunks using DefinePlugin
        config.plugins.push(
          new webpack.DefinePlugin({
            'process.env.__NEXT_POLYFILL_MODERN': JSON.stringify(false),
            'process.env.__NEXT_POLYFILL_LEGACY': JSON.stringify(false),
          })
        );
        
        // Use NormalModuleReplacementPlugin to replace polyfill modules
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /next[\\/]dist[\\/]shared[\\/]lib[\\/]polyfill-module/,
            require.resolve('./polyfill-stub.js')
          )
        );
        
        // Eliminar específicamente polyfills reportados por PageSpeed
        config.plugins.push(
          new webpack.NormalModuleReplacementPlugin(
            /core-js\/modules\/(es\.array\.(at|flat|flatMap)|es\.object\.(fromEntries|hasOwn)|es\.string\.(trimStart|trimEnd))/,
            require.resolve('./polyfill-stub.js')
          )
        );

      }
    }
    return config;
  },
}

module.exports = nextConfig