'use client'

import { useEffect, useState } from 'react'
import { getMarkdownPosts } from '@/service/blog.service'


export default function BlogCard() {
    const [latestPost, setLatestPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLatestPost = async () => {
            try {
                const posts = await getMarkdownPosts()
                setLatestPost(posts[0])
            } catch (error) {
                console.error('Error fetching latest post:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchLatestPost()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!latestPost) {
        return <div>No posts available</div>
    }

    return (
        <div>
            <div>
                <h3 className="text-2xl font-semibold">{latestPost.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">{latestPost.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                    {latestPost.month}/{latestPost.year}
                </div>
                <a href={`./#/weblog/post?id=${latestPost.year}-${latestPost.fileName}`} className="mt-4 inline-block text-blue-500 hover:text-blue-700">
                    Read more →
                </a>
            </div>
        </div>
    )
}
