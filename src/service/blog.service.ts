import data from '@/data/data.json'

export async function getMarkdownPosts() {
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
                const [index] = fileName.split('.')
                posts.push({
                    year: currentYear,
                    index: index,
                    title: title.trim(),
                    description: description.trim(),
                    fileName: fileName.trim(),
                    path: `${currentYear}/${fileName.trim()}`,
                })
            }
        }

        return posts.sort((a, b) => {
            if (a.year !== b.year) return b.year.localeCompare(a.year)
            return b.index.localeCompare(a.index)
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }
}