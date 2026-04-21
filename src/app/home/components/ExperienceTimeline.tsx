'use client'

import React from 'react'
import { Timeline } from '@/components/timeline/TimeLine'
import data from '@/data/data.json'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

import { Icon } from '@iconify/react/dist/iconify.js'

const ExperienceTimeline = () => {
    const timelineData = React.useMemo(() => data.profile.Experience.companyList.map((company) => ({
        title: company.duration,
        content: (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {company.logo && (
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-border bg-white shrink-0 shadow-sm">
                            <Image src={company.logo} alt={company.name} fill className="object-cover" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <h4 className="text-xl md:text-3xl font-bold text-foreground leading-tight">{company.name}</h4>
                        <p className="text-muted-foreground text-sm md:text-lg font-medium">{company.position}</p>
                    </div>
                </div>

                {company.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                        {company.technologies.map((tech) => (
                            <Badge
                                key={tech.name}
                                variant="secondary"
                                className="flex items-center gap-1 text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground border-none"
                            >
                                {tech.icon && <Icon icon={tech.icon} width="12" height="12" />}
                                {tech.name}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="space-y-6 pt-2">
                    {company.projects.map((project, index) => (
                        <div key={index} className="space-y-3 relative pl-4 border-l-2 border-border/50">
                            <h5 className="text-base md:text-xl font-bold text-foreground">{project.name}</h5>
                            <p className="text-xs md:text-base font-bold text-muted-foreground leading-relaxed">{project.description}</p>
                            <ul className="space-y-2 text-xs md:text-base text-muted-foreground">
                                {project.responsibilities.map((responsibility, idx) => (
                                    <li key={idx} className="flex gap-2">
                                        <span className="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        ),
    })), [])

    return (
        <div className="w-full">
            <Timeline data={timelineData} />
        </div>
    )
}

export default ExperienceTimeline