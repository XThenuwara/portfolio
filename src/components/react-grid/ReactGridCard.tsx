import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ReactGridCardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    header?: React.ReactNode
    children: React.ReactNode
    expandedContent?: React.ReactNode
    id: string
    title?: string
    description?: string
    isExpandable?: boolean
}

const ReactGridCard = React.forwardRef<HTMLDivElement, ReactGridCardProps>(
    ({ className, children, expandedContent, header, id, title, description, isExpandable = false, ...props }, ref) => {
        const [isExpanded, setIsExpanded] = useState(false)

        // Optimize body scroll lock with a single effect
        useEffect(() => {
            document.body.style.overflow = isExpanded ? 'hidden' : 'unset'
            return () => { document.body.style.overflow = 'unset' }
        }, [isExpanded])

        const handleClick = () => {
            if (isExpandable) {
                setIsExpanded(true)
            }
        }

        const springTransition = {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.2
        }

        return (
            <>
                <motion.div 
                    initial={false} 
                    className={cn(isExpanded ? 'invisible' : 'visible')}
                >
                    <motion.div
                        layoutId={`card-${id}`}
                        onClick={handleClick}
                        className={cn('cursor-pointer', !isExpandable && 'cursor-default')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                            ...springTransition,
                            opacity: { duration: 0.1 }
                        }}
                    >
                        <Card
                            ref={ref}
                            className={cn(
                                'h-full overflow-hidden rounded-sm border bg-card text-card-foreground shadow',
                                isExpandable && 'hover:shadow-lg hover:scale-[1.005] !transition-all duration-300',
                                className
                            )}
                            {...props}
                        >
                            <motion.div layoutId={`content-${id}`} transition={springTransition}>
                                <CardContent className="p-0">{children}</CardContent>
                            </motion.div>
                        </Card>
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && isExpandable && (
                        <>
                            {/* Backdrop overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsExpanded(false)}
                                className="fixed inset-0 z-40 bg-gray-700/25 dark:bg-gray-700/25 backdrop-blur-sm overflow-hidden"
                                transition={{ duration: 0.15, ease: "easeInOut" }}
                            />
                            
                            {/* Modal container */}
                            <motion.div
                                layoutId={`card-${id}`}
                                className="fixed z-50 w-[90vw] max-w-5xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                                transition={springTransition}
                            >
                                <Card className={cn(
                                    "flex flex-col max-h-[90vh] !bg-background/25 backdrop-blur-md rounded-lg shadow-xl",
                                    className
                                )}>
                                    <motion.div layoutId={`header-${id}`} transition={springTransition} className="flex-none">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <motion.div layoutId={`title-${id}`} transition={springTransition}>
                                                        <CardTitle className="text-2xl">{title}</CardTitle>
                                                    </motion.div>
                                                    {description && (
                                                        <motion.div 
                                                            layoutId={`desc-${id}`}
                                                            transition={springTransition}
                                                        >
                                                            <CardDescription className="mt-2">{description}</CardDescription>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.15 }}
                                                >
                                                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="h-8 w-8">
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Close</span>
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div 
                                        layoutId={`content-${id}`} 
                                        className="flex-1 min-h-0 overflow-y-auto"
                                        transition={springTransition}
                                    >
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

export default ReactGridCard
