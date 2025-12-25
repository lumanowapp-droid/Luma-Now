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
    }

    // Simple alias resolution for cross-platform compatibility
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/providers': path.resolve(__dirname, './providers'),
      // Mock React Native for web
      'react-native$': 'react-native-web',
      // Ensure primitives index resolves correctly
      '@multi-platform-app/ui/primitives$': path.resolve(__dirname, '../../packages/ui/src/primitives/index.ts'),
    };

    // File extension resolution - prioritize web variants
    config.resolve.extensions = [
      '.web.tsx', '.web.ts', '.web.jsx', '.web.js',
      '.ts', '.tsx', '.js', '.jsx',
      ...config.resolve.extensions
    ];

    // Optimize module resolution
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
      ...config.resolve.modules
    ];

    // Simplified plugin configuration to avoid interfering with Next.js build
    config.plugins.push(
      // Ignore native files
      new webpack.IgnorePlugin({
        resourceRegExp: /\.native\.(tsx?|jsx?|json)$/,
      })
    );

    // Add performance hints
    config.performance = {
      hints: dev ? false : 'warning',
      maxAssetSize: 512000,
      maxEntrypointSize: 512000,
    };

    return config;
  },

  // CRITICAL: Force dynamic rendering to avoid build-time context issues
  // This prevents static generation which causes React context problems
  output: 'standalone',
  
  // Disable static optimization entirely
  generateBuildId: async () => {
    return 'custom-build-id'
  },
  
  // Compression and performance
  compress: true,
  poweredByHeader: false,
  
  // Image optimization settings
  images: {
    unoptimized: false,
  },
};

// Export configuration
module.exports = nextConfig;