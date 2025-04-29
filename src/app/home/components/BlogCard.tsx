'use client'

import { useEffect, useState } from 'react'
import data from '@/data/data.json'

async function getMarkdownPosts() {
    const repoOwner = data.blog.owner
    const repoName = data.blog.repo
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
                <p className="text-gray-600 mt-2">{latestPost.description}</p>
                <div className="text-sm text-gray-500 mt-2">
                    {latestPost.month}/{latestPost.year}
                </div>
                <a href={`/#/weblog/post?id=${latestPost.year}-${latestPost.month}`} className="mt-4 inline-block text-blue-500 hover:text-blue-700">
                    Read more →
                </a>
            </div>
        </div>
    )
}
