import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'

interface ReactGridCardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    children: React.ReactNode
    expandedContent?: React.ReactNode
    id: string
    title?: string
    description?: string
    isExpandable?: boolean
}

const morphSpring = {
    type: 'spring',
    stiffness: 380,
    damping: 38,
    mass: 0.6,
} as const

const contentSpring = {
    type: 'spring',
    stiffness: 300,
    damping: 34,
    mass: 0.5,
} as const

const ReactGridCard = React.forwardRef<HTMLDivElement, ReactGridCardProps>(
    ({ className, children, expandedContent, id, title, description, isExpandable = false, ...props }, ref) => {
        const [isExpanded, setIsExpanded] = useState(false)

        const toggleScrollLock = useCallback((lock: boolean) => {
            document.body.style.overflow = lock ? 'hidden' : 'unset'
        }, [])

        useEffect(() => {
            if (isExpanded) {
                toggleScrollLock(true)
                return () => toggleScrollLock(false)
            }
        }, [isExpanded, toggleScrollLock])

        useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && isExpanded) setIsExpanded(false)
            }
            window.addEventListener('keydown', onKey)
            return () => window.removeEventListener('keydown', onKey)
        }, [isExpanded])

        const handleClick = useCallback(() => {
            if (isExpandable) setIsExpanded(true)
        }, [isExpandable])

        const handleClose = useCallback(() => {
            setIsExpanded(false)
        }, [])

        return (
            <>
                {/*
                 * Outer div — owned by react-grid-layout.
                 * Gets ref + all positioning props (style, onMouse*, etc.)
                 * We just toggle visibility here so the slot stays in the DOM
                 * for Framer Motion to morph back to.
                 */}
                <div
                    ref={ref}
                    {...props}
                    style={{
                        ...props.style,
                        visibility: isExpanded ? 'hidden' : 'visible',
                    }}
                >
                    {/*
                     * Inner motion.div — this is what Framer Motion owns.
                     * layoutId lives here, NOT on the outer div.
                     */}
                    <motion.div
                        layoutId={`card-${id}`}
                        onClick={handleClick}
                        className={cn('h-full will-change-transform', isExpandable ? 'cursor-pointer' : 'cursor-default')}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...morphSpring, opacity: { duration: 0.15 } }}
                        style={{ borderRadius: 4 }}
                    >
                        <Card
                            className={cn(
                                'h-full overflow-hidden rounded-sm border bg-card text-card-foreground shadow will-change-transform',
                                isExpandable && 'hover:shadow-lg hover:scale-[1.005] !transition-transform duration-300',
                                className
                            )}
                        >
                            <motion.div layoutId={`content-${id}`} transition={contentSpring} className="h-full">
                                <CardContent className="p-0 h-full">{children}</CardContent>
                            </motion.div>
                        </Card>
                    </motion.div>
                </div>

                {/* ── Expanded overlay ── */}
                <AnimatePresence>
                    {isExpanded && isExpandable && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key={`backdrop-${id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleClose}
                                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                            />

                            {/*
                             * Expanded card shares layoutId with the inner motion.div above.
                             * On exit, AnimatePresence keeps it mounted while layoutId morphs
                             * it back to the tile's exact position/size.
                             */}
                            <motion.div
                                key={`expanded-${id}`}
                                layoutId={`card-${id}`}
                                className="fixed z-50 w-[92vw] max-w-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
                                transition={morphSpring}
                                exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
                                style={{ borderRadius: 16 }}
                            >
                                <Card
                                    className={cn(
                                        'flex flex-col max-h-[90vh] overflow-hidden',
                                        '!bg-card/70 backdrop-blur-xl',
                                        'border border-white/10 shadow-2xl ring-1 ring-white/5 rounded-2xl',
                                        className
                                    )}
                                >
                                    {/* Header — staggered fade in, instant fade out */}
                                    <motion.div
                                        className="flex-none flex items-start justify-between p-3 pb-1"
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, transition: { duration: 0.08 } }}
                                        transition={{ delay: 0.15, duration: 0.2 }}
                                    >
                                        {title && (
                                            <div className="flex-1 px-1">
                                                <CardTitle className="text-xl">{title}</CardTitle>
                                                {description && <CardDescription className="mt-1">{description}</CardDescription>}
                                            </div>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClose}
                                            className="h-8 w-8 rounded-full shrink-0 hover:bg-white/10 ml-auto"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Close</span>
                                        </Button>
                                    </motion.div>

                                    {/* Content */}
                                    <motion.div layoutId={`content-${id}`} className="flex-1 min-h-0 overflow-y-auto" transition={contentSpring}>
                                        <CardContent className="h-full p-2">{expandedContent || children}</CardContent>
                                    </motion.div>
                                </Card>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        )
    }
)

ReactGridCard.displayName = 'ReactGridCard'

export default React.memo(ReactGridCard)
