const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ui', '@api', '@utils'],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@api': path.resolve(__dirname, '../../packages/api/src'),
      '@utils': path.resolve(__dirname, '../../packages/utils/src'),
    }

    return config
  },
  experimental: {
    externalDir: true,
  }
}

module.exports = nextConfig
