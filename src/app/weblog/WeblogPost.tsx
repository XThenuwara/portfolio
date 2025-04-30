'use client'
import { useEffect, useState, useCallback } from 'react'
import MDXContent from '@/components/MDXContent'
import { Icon } from '@iconify/react/dist/iconify.js'
import data from '@/data/data.json'
import LoadingSpinner from '@/components/LoadingSpinner'
import nextConfig from '@/../next.config'

interface BlogPostProps {
    id?: string
}

export default function BlogPost({ id }: BlogPostProps) {
    const [post, setPost] = useState<{ content: string; name: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPost = useCallback(async () => {
        console.log('📡 Starting fetchPost with ID:', id)
        if (!id) {
            setError('No post ID provided')
            setLoading(false)
            return
        }

        try {
            const repoOwner = data.blog.owner
            const repoName = data.blog.repo
            const [year, index] = id.split('-')
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${year}/${index}`

            const response = await fetch(apiUrl, {
                headers: {
                    Accept: 'application/vnd.github.v3+json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch post')
            }

            const file = await response.json()
            const content = await fetch(file.download_url)

            if (!content.ok) {
                throw new Error('Failed to fetch content')
            }

            let markdown = await content.text()
            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
            markdown = markdown.replace(imageRegex, (match, alt, url) => {
                if (!url.startsWith('http')) {
                    const baseUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/refs/heads/main/${year}/`
                    url = baseUrl + url
                }
                return `![${alt}](${url})`
            })

            const title = id.split('/').pop()?.split('.')[1] || 'Untitled'

            setPost({
                content: markdown,
                name: title,
            })
        } catch (error) {
            setError('Failed to load post')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) {
            fetchPost()
        }
    }, [fetchPost, id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 h-[70vh] flex items-center justify-center">
                <div className='flex flex-col items-center'>
                    <LoadingSpinner />
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-8 h-[70vh] flex items-center justify-center">
                <div className='flex flex-col items-center'>
                    <LoadingSpinner />
                    <div className="text-red-600 dark:text-red-400 mt-12">{error || 'Post not found'}</div>
                    <a href={`./#/weblog`} className="flex flex-col items-center gap-2 mt-12">
                        <div className='flex items-center gap-2'>
                        <Icon icon="tabler:topology-star" width="32" />
                        <h1 className="text-4xl font-bold">WebLOG</h1>
                        </div>
                        <span className="text-sm text-gray-500">Go back to WebLOG</span>
                    </a>

                    <a href="/" className="flex flex-col items-center gap-2 mt-8">
                        <span className="text-4xl font-bold">Portfolio</span>
                        <span className="text-sm text-gray-500">go back to Portfolio</span>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-1 min-h-screen">
            <a href={`./#/weblog`} className="flex items-center gap-2 mb-8">
                <Icon icon="tabler:topology-star" width="32" />
                <h1 className="text-4xl font-bold">WebLOG</h1>
            </a>
            <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-1 rounded-lg shadow-lg">
                <MDXContent content={post.content} />
            </div>
        </div>
    )
}
