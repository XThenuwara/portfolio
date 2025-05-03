import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'development' ? '/portfolio' : '/portfolio',
    assetPrefix: process.env.NODE_ENV === 'development' ? '/portfolio' : './',
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    minSize: 20000,
                    maxSize: 256000,
                    minChunks: 1,
                    maxAsyncRequests: 30,
                    maxInitialRequests: 30,
                    cacheGroups: {
                        defaultVendors: {
                            test: /[\\/]node_modules[\\/]/,
                            priority: -10,
                            reuseExistingChunk: true,
                        },
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true,
                        },
                    },
                },
            }
        }
        return config
    },
}

export default nextConfig
