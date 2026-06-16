'use client'

import React, { useMemo } from 'react'
import data from '@/data/data.json'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

interface Project {
    title: string
    description: string
    link: string
}

const ProjectsExpanded = () => {
    const projects = useMemo(() => data.profile.projects as Project[], [])

    return (
        <div className="p-4 md:p-6 w-full select-none">
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
                    Personal Projects
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    A curated selection of tools, applications, and experiments I've built.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => {
                    const isGitHub = project.link.includes('github.com')

                    return (
                        <Card 
                            key={`expanded-project-${index}`}
                            className="glass group relative flex flex-col justify-between overflow-hidden border-transparent dark:border-white/10 hover:bg-neutral-100/10 dark:hover:bg-neutral-900/10 transition-all duration-300 hover:shadow-xl rounded-xl"
                        >
                            <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                                <div className="space-y-3">
                                    {/* Icon / Type Indicator */}
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 w-10 h-10 flex items-center justify-center">
                                            <Icon 
                                                icon={isGitHub ? "lucide:github" : "lucide:globe"} 
                                                width="20" 
                                            />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-semibold tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800">
                                            {isGitHub ? "Open Source" : "Web Application"}
                                        </Badge>
                                    </div>

                                    {/* Text Info */}
                                    <div className="space-y-1.5">
                                        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed min-h-[70px]">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link 
                                    href={project.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="block w-full"
                                >
                                    <Button 
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2 text-xs py-2 bg-neutral-50/50 hover:bg-neutral-100/80 dark:bg-neutral-900/50 dark:hover:bg-neutral-850/80 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg transition-all duration-200"
                                    >
                                        <span>{isGitHub ? "View Source Code" : "Launch Application"}</span>
                                        <Icon 
                                            icon="mynaui:chevron-up-right" 
                                            width="14" 
                                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-neutral-500" 
                                        />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default React.memo(ProjectsExpanded)
