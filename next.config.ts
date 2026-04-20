import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'export',
    turbopack: {},
    basePath: process.env.NODE_ENV === 'development' ? '/portfolio' : '/portfolio',
    assetPrefix: process.env.NODE_ENV === 'development' ? '/portfolio' : './',
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    // Keep chunks small so the browser can parallelise downloads
                    // and parse/execute them incrementally
                    minSize: 10_000,
                    maxSize: 150_000,
                    minChunks: 1,
                    maxAsyncRequests: 30,
                    maxInitialRequests: 25,
                    cacheGroups: {
                        // Isolate the heaviest libraries into their own async chunks
                        // so they are NOT included in the initial bundle
                        tsparticles: {
                            test: /[\\/]node_modules[\\/]@tsparticles[\\/]/,
                            name: 'tsparticles',
                            chunks: 'async',
                            priority: 40,
                            enforce: true,
                        },
                        motion: {
                            test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
                            name: 'motion',
                            chunks: 'all',
                            priority: 35,
                            enforce: true,
                        },
                        reactGridLayout: {
                            test: /[\\/]node_modules[\\/](react-grid-layout|react-resizable)[\\/]/,
                            name: 'react-grid-layout',
                            chunks: 'async',
                            priority: 30,
                            enforce: true,
                        },
                        mdx: {
                            test: /[\\/]node_modules[\\/](next-mdx-remote|unified|remark|rehype|mdast|hast|micromark|vfile)[\\/]/,
                            name: 'mdx',
                            chunks: 'async',
                            priority: 25,
                            enforce: true,
                        },
                        syntaxHighlighter: {
                            test: /[\\/]node_modules[\\/](react-syntax-highlighter|highlight\.js|refractor|prismjs)[\\/]/,
                            name: 'syntax-highlighter',
                            chunks: 'async',
                            priority: 20,
                            enforce: true,
                        },
                        // Stable vendor chunk for small shared libs
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all',
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
