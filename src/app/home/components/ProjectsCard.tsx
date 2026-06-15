'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import data from '@/data/data.json'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'

interface Project {
    title: string
    description: string
    link: string
}

const ProjectsCard = () => {
    const projects = useMemo(() => data.profile.projects as Project[], [])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right

    // Auto-play interval - resets when currentIndex changes (manual navigation)
    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1)
            setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [currentIndex, projects.length])

    const handleNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, [projects.length])

    const handlePrev = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setDirection(-1)
        setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
    }, [projects.length])

    const handleDotClick = useCallback((e: React.MouseEvent, index: number) => {
        e.stopPropagation()
        setDirection(index > currentIndex ? 1 : -1)
        setCurrentIndex(index)
    }, [currentIndex])

    const currentProject = projects[currentIndex]

    // Animation variants for smooth sliding
    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 30 : -30,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -30 : 30,
            opacity: 0,
        }),
    }

    return (
        <div className="h-full w-full relative flex flex-col justify-between z-30 p-2 md:p-3">
            {/* Header / Nav Row */}
            <div className="flex justify-between items-center w-full mb-1 select-none">
                <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Projects</span>
                <div className="flex gap-1 z-40">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        onClick={handlePrev}
                        aria-label="Previous project"
                    >
                        <Icon icon="mynaui:chevron-left" width="18" className="text-gray-600 dark:text-gray-400" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        onClick={handleNext}
                        aria-label="Next project"
                    >
                        <Icon icon="mynaui:chevron-right" width="18" className="text-gray-600 dark:text-gray-400" />
                    </Button>
                </div>
            </div>

            {/* Slider Content */}
            <div className="flex-1 flex flex-col justify-center relative overflow-hidden min-h-[90px] w-full">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="w-full flex flex-col justify-between h-full"
                    >
                        <div className="w-full">
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-850 dark:text-neutral-100 truncate w-full">
                                {currentProject.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed line-clamp-3 select-none">
                                {currentProject.description}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Row: Dots + Link Button */}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/40 select-none">
                {/* Dot Indicators */}
                <div className="flex gap-1.5 z-40">
                    {projects.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={(e) => handleDotClick(e, index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'w-5 bg-neutral-800 dark:bg-neutral-200' 
                                    : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                            }`}
                            aria-label={`Go to project ${index + 1}`}
                        />
                    ))}
                </div>

                {/* View Project Button */}
                <Link
                    target="_blank"
                    href={currentProject.link}
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="z-40"
                    aria-label={`View ${currentProject.title} live project`}
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-full hover:scale-105 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 text-neutral-500 hover:text-neutral-800 dark:text-neutral-450 dark:hover:text-neutral-200 transition-all"
                    >
                        <Icon icon="mynaui:chevron-up-right" width="16" />
                    </Button>
                </Link>
            </div>

            {/* Space Background Solar Animation */}
            <div className="absolute scale-50 md:scale-90 lg:scale-100 -z-10" style={{ bottom: -25, left: -65 }} aria-hidden="true">
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
