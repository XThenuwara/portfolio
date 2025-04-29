'use client'

import { useState, useEffect } from 'react'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { Dialog, DialogContent } from './ui/dialog'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useTheme } from 'next-themes'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MDXContentProps {
    content: string
}

export default function MDXContent({ content }: MDXContentProps) {
    const { theme } = useTheme()

    const [mdxSource, setMdxSource] = useState<any>(null)

    useEffect(() => {
        const compileMDX = async () => {
            try {
                const mdxSource = await serialize(content, {
                    parseFrontmatter: true,
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [
                            rehypeSlug,
                            [
                                rehypeAutolinkHeadings,
                                {
                                    behavior: 'wrap',
                                    properties: {
                                        className: ['heading-link'],
                                    },
                                },
                            ],
                        ],
                        format: 'mdx',
                    },
                })
                setMdxSource(mdxSource)
            } catch (error) {
                console.error('Error compiling MDX:', error)
            }
        }

        if (content) {
            compileMDX()
        }
    }, [content])

    if (!mdxSource) {
        return <div>Loading...</div>
    }

    return (
        <div className="mdx-content prose max-w-none bg-background dark:bg-card rounded-md p-2 md:p-4 lg:p-6">
            <MDXRemote
                {...mdxSource}
                components={{
                    h1: ({ children }) => <h1 className="text-4xl font-bold my-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold my-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-bold my-2">{children}</h3>,
                    p: ({ children }) => <p className="my-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-8 my-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-8 my-4">{children}</ol>,
                    li: ({ children }) => <li className="my-2">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
                    code: ({ className, children }) => {
                        const language = className ? className.replace('language-', '') : 'text'
                        return (
                            <SyntaxHighlighter
                                className="syntax-highlight !bg-transparent"
                                language={language}
                                style={theme === 'dark' ? oneDark : oneLight}
                                customStyle={{
                                    backgroundColor: 'transparent',
                                    borderRadius: '0.375rem',
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.5',
                                    textShadow: 'none',
                                }}
                            >
                                {children}
                            </SyntaxHighlighter>
                        )
                    },
                    pre: ({ children }) => (
                        <pre className="bg-gray-100 dark:bg-background dark:border p-4 rounded my-4 overflow-x-auto">{children}</pre>
                    ),
                    img: ({ src, alt }) => {
                        const [isOpen, setIsOpen] = useState(false)

                        return (
                            <div className="w-full h-full">
                                <img src={src} alt={alt} className="h-72 object-cover rounded-lg cursor-pointer" onClick={() => setIsOpen(true)} />
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogContent className="min-w-[90vw] min-h-[90vh]">
                                        <img src={src} alt={alt} className="w-full h-full object-contain" />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )
                    },
                    hr: () => <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />,
                    table: ({ children }) => <table className="w-full my-4 border-collapse border-2">{children}</table>,
                    th: ({ children }) => <th className="border px-4 py-2 text-left bg-gray-100 dark:bg-background">{children}</th>,
                    td: ({ children }) => <td className="border px-4 py-2">{children}</td>,
                }}
            />
        </div>
    )
}
