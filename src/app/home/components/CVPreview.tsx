'use client'

import React from 'react'
import data from '@/data/data.json'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'

const CVPreview = () => {
    const { cvFilename } = data.profile
    // Use the basePath from next.config.ts for reliable asset loading
    const basePath = '/portfolio'
    const cvPath = `${basePath}/cv/${cvFilename}`

    return (
        <div className="flex flex-col h-full w-full gap-4 p-0">
            {/* Header Section */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <Icon icon="ph:file-pdf-duotone" width="24" height="24" className="text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Curriculum Vitae</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document • {cvFilename}</p>
                    </div>
                </div>
                <Button 
                    asChild
                    size="sm"
                    className="w-10 h-10 md:w-auto md:h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group transition-all duration-300 p-0 md:px-4"
                >
                    <a href={cvPath} download={cvFilename} title="Download">
                        <Icon icon="lucide:download" width="18" className="md:mr-2 group-hover:translate-y-0.5 transition-transform" />
                        <span className="hidden md:inline">Download</span>
                    </a>
                </Button>
            </div>

            {/* Preview Section */}
            <div className="flex-1 w-full h-[60vh] md:h-[75vh] rounded-xl overflow-hidden border border-border bg-[#2c3e50] shadow-2xl relative">
                <iframe
                    src={`${cvPath}#toolbar=0&view=FitH`}
                    className="absolute inset-0 w-full h-full border-none"
                    title="CV Preview"
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default React.memo(CVPreview)
