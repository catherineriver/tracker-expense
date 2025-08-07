import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ['@ui', '@api', '@utils'],
    webpack: (config) => {
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

export default nextConfig
