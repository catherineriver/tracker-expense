const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile packages from the monorepo
  transpilePackages: ['@ui', '@api', '@utils'],
  
  // Configure webpack for better monorepo support
  webpack: (config, { isServer }) => {
    // Resolve aliases for the workspace packages
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@api': path.resolve(__dirname, '../../packages/api/src'),
      '@utils': path.resolve(__dirname, '../../packages/utils/src'),
    }

    // Support for React Native Web (if needed)
    config.resolve.alias['react-native'] = 'react-native-web'

    return config
  },

  // Enable experimental features for better monorepo support
  experimental: {
    // Better handling of external packages
    externalDir: true,
  }
}

module.exports = nextConfig