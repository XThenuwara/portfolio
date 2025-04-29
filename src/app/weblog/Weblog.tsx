'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@iconify/react/dist/iconify.js'
import nextConfig from '@/../next.config'

async function getMarkdownPosts() {
    const repoOwner = 'XThenuwara'
    const repoName = 'WebLOG'
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/index.md`

    try {
        const response = await fetch(apiUrl, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        const decodedContent = atob(data.content.replace(/\n/g, ''))
        const lines = decodedContent.split('\n')
        const posts = []
        let currentYear = ''

        for (const line of lines) {
            if (line.startsWith('#')) {
                currentYear = line.replace('#', '').trim()
                continue
            }

            if (line.includes(' - ')) {
                const [fileName, title, description] = line.split(' - ')
                const [month] = fileName.split('.')
                posts.push({
                    year: currentYear,
                    month: month,
                    title: title.trim(),
                    description: description.trim(),
                    path: `${currentYear}/${fileName.trim()}`,
                })
            }
        }

        return posts.sort((a, b) => {
            if (a.year !== b.year) return b.year.localeCompare(a.year)
            return b.month.localeCompare(a.month)
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }
}

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
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-300">
                    {posts.map((post, index) => (
                        <a key={index} href={`./#/weblog/post?id=${post.year}-${post.month}`} className="no-underline">
                            <Card className="prose max-w-none hover:scale-105 transition-all duration-300">
                                <CardContent>
                                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                                    <h2 className="text text-gray-500 font-semibold mb-4">{post.description}</h2>
                                    <div className="text-sm text-gray-600 mb-4">
                                        {post.month}/{post.year}
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
