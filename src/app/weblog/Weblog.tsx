'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/react/dist/iconify.js'
import { getMarkdownPosts, Post } from '@/service/blog.service'


export default function Weblog() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const fetchPosts = async () => {
            try {
                const data = await getMarkdownPosts()
                if (mounted) {
                    setPosts(data)
                }
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchPosts()

        return () => {
            mounted = false
        }
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <div className="animate-pulse space-y-8">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen">
            <a href="./#/weblog" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <Icon icon="tabler:topology-star" width="32" />
                <h1 className="text-4xl font-bold">WebLOG</h1>
            </a>
            {posts.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No posts available at the moment.</p>
            ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
                    {posts.map((post) => (
                        <a 
                            key={`${post.year}-${post.fileName}`} 
                            href={`./#/weblog/post?id=${post.year}-${post.fileName}`} 
                            className="no-underline transform transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Card className="prose max-w-none h-full">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                                    <p className="text-gray-500 dark:text-gray-300 font-medium mb-4 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {post.index}/{post.year}
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
            )}
        </main>
    )
}
