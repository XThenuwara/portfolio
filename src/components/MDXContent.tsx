'use client'

import { useState, useEffect } from 'react'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Dialog, DialogContent } from './ui/dialog'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

SyntaxHighlighter.registerLanguage('javascript', js)
SyntaxHighlighter.registerLanguage('typescript', ts)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('yaml', yaml)

interface MDXContentProps {
    content: string
}

export default function MDXContent({ content }: MDXContentProps) {
    const { theme } = useTheme()

    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

    useEffect(() => {
        const compileMDX = async () => {
            try {
                const [{ serialize }, remarkGfm, rehypeSlug, rehypeAutolinkHeadings] = await Promise.all([
                    import('next-mdx-remote/serialize'),
                    import('remark-gfm').then(mod => mod.default),
                    import('rehype-slug').then(mod => mod.default),
                    import('rehype-autolink-headings').then(mod => mod.default)
                ]);

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
        <div className="mdx-content prose max-w-none bg-background dark:bg-card rounded-md p-2 md:p-4 lg:p-6 dark:font-medium text-wrap">
            <MDXRemote
                {...mdxSource}
                components={{
                    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold my-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold my-3 mt-12">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold my-2 mt-6">{children}</h3>,
                    p: ({ children }) => <p className="my-4 leading-relaxed md:text-lg">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-8 my-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-8 my-4">{children}</ol>,
                    li: ({ children }) => <li className="my-2 text-wrap break-all">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>,
                    code: ({ className, children }) => {
                        const content = String(children).trim()
                        const words = content.split(/\s+/).length
                        const language = className ? className.replace('language-', '') : ''

                        if (words <= 10 && !language) {
                            return (
                                <pre className="inline-block px-2 py-0  bg-gray-100 dark:bg-gray-800 border font-semibold rounded-full font-mono text-sm">
                                    {children}
                                </pre>
                            )
                        }

                        return (
                            <SyntaxHighlighter
                                className="syntax-highlight font-semibold rounded-lg"
                                language={language || 'text'}
                                style={theme === 'dark' ? atomDark : oneLight}
                                customStyle={{
                                    borderRadius: '0.375rem',
                                    padding: '0.375rem 0.75rem',
                                    lineHeight: '1.5',
                                    textShadow: 'none',
                                }}
                            >
                                {children}
                            </SyntaxHighlighter>
                        )
                    },
                    img: ({ src, alt }) => {
                        const [isOpen, setIsOpen] = useState(false)

                        return (
                            <div className="w-full h-full my-9">
                                <img
                                    src={src}
                                    alt={alt}
                                    className="max-h-72 min-h-32 object-contain rounded-lg cursor-pointer"
                                    onClick={() => setIsOpen(true)}
                                />
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogContent className="min-w-[90vw] min-h-[90vh] p-0 overflow-hidden">
                                        <TransformWrapper
                                            initialScale={1}
                                            minScale={0.5}
                                            maxScale={4}
                                            centerOnInit
                                            doubleClick={{ mode: 'reset' }}
                                            wheel={{ step: 0.1 }}
                                            pinch={{ step: 5 }}
                                        >
                                            <TransformComponent
                                                wrapperClass="w-full h-full"
                                                contentClass="w-full h-full flex items-center justify-center"
                                            >
                                                <img 
                                                    src={src} 
                                                    alt={alt} 
                                                    className="w-full h-full object-contain"
                                                />
                                            </TransformComponent>
                                        </TransformWrapper>
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
