'use client'

import { motion } from 'motion/react'
import React from 'react'
import { cn } from '@/lib/utils'

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    duration?: number
    distance?: number
}

export function InfiniteScroll({ children, className, duration = 20, distance = 300, ...props }: InfiniteScrollProps) {
    return (
        <div className={cn('w-full overflow-hidden', className)} {...props}>
            <motion.div
                className="flex gap-2"
                animate={{ x: [0, -distance] }}
                transition={{
                    ease: 'easeIn',
                    repeatType: 'mirror',
                    duration: duration,
                    repeat: Infinity,
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}
