'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import data from '@/data/data.json'

const CVDownloadCard = () => {
    const { cvFilename, name } = data.profile

    const cvPath = `./cv/${cvFilename}`

    return (
        <div className="relative h-full w-full flex flex-col justify-between p-4 md:p-4 lg:p-6 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 pointer-events-none">
                <Icon icon="pepicons-pencil:cv" width="160" height="160" />
            </div>
            
            <div className="z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Icon icon="ph:file-pdf-duotone" width="28" height="28" className="text-red-500" />
                    <h2 className="text-xl font-bold tracking-tight">Curriculum Vitae</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">
                    Download my professional resume to see my full experience and skills.
                </p>
            </div>

            <div className="mt-auto z-10 flex justify-end md:justify-start">
                <Button 
                    asChild
                    className="w-12 h-12 md:w-full md:h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group transition-all duration-300"
                >
                    <a href={cvPath} download={cvFilename} title="Download CV">
                        <Icon icon="lucide:download" width="20" className="md:mr-2 group-hover:translate-y-0.5 transition-transform" />
                        <span className="hidden md:inline">Download CV</span>
                    </a>
                </Button>
            </div>
        </div>
    )
}

export default React.memo(CVDownloadCard)
