'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/react/dist/iconify.js'
import { getMarkdownPosts } from '@/service/blog.service'

export default function Weblog() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getMarkdownPosts()
                setPosts(data as any)
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <main className="container mx-auto px-4 py-8 min-h-screen">
            <a href={`./#/weblog`} className='flex items-center gap-2 mb-8'>
                <Icon icon="tabler:topology-star" width="32" />
                <h1 className="text-4xl font-bold">WebLOG</h1>
            </a>
            {posts.length === 0 ? (
                <p className="text-gray-600">No posts available at the moment.</p>
            ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
                    {posts.map((post, index) => (
                        <a key={index} href={`./#/weblog/post?id=${post.year}-${post.fileName}`} className="no-underline">
                            <Card className="prose max-w-none hover:scale-105 transition-all duration-300">
                                <CardContent>
                                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                                    <h2 className="text text-gray-500 dark:text-gray-300 font-medium mb-4">{post.description}</h2>
                                    <div className="text-sm text-gray-500 mb-4">
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
