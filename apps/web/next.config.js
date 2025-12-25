const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds to avoid config issues
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Only transpile necessary packages, exclude native files
  transpilePackages: [
    '@multi-platform-app/ui',
  ],

  // Enable experimental features for faster builds
  experimental: {
    // esmExternals: false, // Not supported in Turbopack mode
    optimizeCss: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize for development
    if (dev) {
      // Enable faster development builds
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };

      // IMPORTANT: Remove parallelism restriction for faster builds
      // Default parallelism uses number of CPUs - 1, which is much faster
      // config.parallelism = 1; // REMOVED - was causing slow builds
    }

    // Optimize alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/providers': path.resolve(__dirname, './providers'),
      // Mock React Native for web with better optimization
      'react-native$': 'react-native-web',
      // Ensure scheduler is resolved correctly and avoid native variants
      'scheduler$': require.resolve('scheduler'),
      'scheduler/index.native': require.resolve('scheduler'),
      // Ensure primitives index resolves to .ts (which has all exports including getTextBaseStyles)
      '@multi-platform-app/ui/primitives$': path.resolve(__dirname, '../../packages/ui/src/primitives/index.ts'),
    };

    // Better file extension resolution for cross-platform files
    // Prioritize web extensions and exclude native extensions entirely
    // Order matters: .web.tsx > .web.ts > .ts > .tsx (prioritize .ts for index files)
    config.resolve.extensions = [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      '.ts', '.tsx', '.js', '.jsx',
      ...config.resolve.extensions.filter(ext => !ext.includes('.native.'))
    ];

    // Optimize module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      ...config.resolve.modules
    ];

    // Add IgnorePlugin to exclude native files and React Native specific modules
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.native\.(tsx?|jsx?|json)$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /react-native\/.*\/.*\.native\.js$/,
      }),
      // Ignore React Native scheduler native modules
      new webpack.NormalModuleReplacementPlugin(
        /scheduler\/index\.native/,
        require.resolve('scheduler')
      ),
      new webpack.NormalModuleReplacementPlugin(
        /scheduler.*\.native/,
        require.resolve('scheduler')
      )
    );

    // Add performance hints
    config.performance = {
      hints: dev ? false : 'warning',
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    };

    // Enable bundle analyzer in development (optional)
    if (process.env.ANALYZE === 'true') {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;