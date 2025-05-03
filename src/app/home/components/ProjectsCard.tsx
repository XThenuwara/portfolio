import React from 'react'
import data from '@/data/data.json'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

interface Project {
    title: string
    description: string
    link: string
}

const ProjectLink = React.memo(({ project }: { project: Project }) => (
    <div className="bg-gray-50 dark:bg-background p-2 md:p-3 rounded-lg w-full flex flex-col">
        <div>
            <h2 className="text-2xl font-semibold">{project.title}</h2>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{project.description}</span>
        </div>
        <div className="flex justify-end">
            <Link target="_blank" href={project.link} rel="noopener noreferrer" aria-label={`View ${project.title} project`}>
                <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-default-200 dark:bg-default-100 hover:scale-105 transition-transform"
                >
                    <Icon icon="mynaui:chevron-up-right" width="16" className="text-default-400" />
                </Button>
            </Link>
        </div>
    </div>
))

ProjectLink.displayName = 'ProjectLink'

const ProjectsCard = () => {
    const projects = React.useMemo(() => data.profile.projects, [])

    return (
        <div className="h-full w-full relative flex justify-between flex-col z-50">
            <div className="flex gap-5" role="list" aria-label="Projects showcase">
                {projects.map((project, index) => (
                    <ProjectLink key={`project-${index}`} project={project} />
                ))}
            </div>

            <div className="absolute scale-50 md:scale-100 -z-10" style={{ bottom: -10, left: -70 }} aria-hidden="true">
                <div className="solar-container" style={{ bottom: 5 }}>
                    <div className="planet"></div>
                    <div className="orbit">
                        <div className="moon"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsCard)
