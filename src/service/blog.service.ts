import data from '@/data/data.json'

export interface Post {
    year: string
    fileName: string
    title: string
    description: string
    index: string
    path: string
}

interface GithubResponse {
    content: string
}

export async function getMarkdownPosts(): Promise<Post[]> {
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
            throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`)
        }

        const data = await response.json() as GithubResponse
        const decodedContent = atob(data.content.replace(/\n/g, ''))
        const lines = decodedContent.split('\n').filter(Boolean) // Remove empty lines
        const posts: Post[] = []
        let currentYear = ''

        for (const line of lines) {
            if (!line.trim()) continue

            if (line.startsWith('#')) {
                currentYear = line.replace('#', '').trim()
                continue
            }

            if (line.includes(' - ')) {
                const parts = line.split(' - ').map(part => part.trim())
                if (parts.length < 3) continue
                const [fileName, title, description] = parts
                const [index] = fileName.split('.')

                if (!currentYear || !index || !fileName || !title) continue;

                posts.push({
                    year: currentYear,
                    index,
                    title,
                    description: description || '',
                    fileName,
                    path: `${currentYear}/${fileName}`,
                })
            }
        }

        return posts.sort((a, b) => {
            const yearDiff = Number(b.year) - Number(a.year)
            if (yearDiff !== 0) return yearDiff

            return Number(b.index) - Number(a.index)
        })
    } catch (error) {
        console.error('Error fetching posts:', error instanceof Error ? error.message : 'Unknown error')
        return []
    }
}