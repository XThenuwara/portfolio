import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
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

        const handleClick = () => {
            if (isExpandable) {
                setIsExpanded(true)
            }
        }

        return (
            <>
                <motion.div initial={false} className={cn(isExpanded ? 'invisible' : 'visible')}>
                    <motion.div layoutId={`card-${id}`} onClick={handleClick} className={cn('cursor-pointer', !isExpandable && 'cursor-default')}>
                        <Card
                            ref={ref}
                            className={cn(
                                'overflow-hidden rounded-sm border bg-card text-card-foreground shadow transition-all duration-300',
                                isExpandable && 'hover:shadow-lg',
                                className
                            )}
                            {...props}
                        >
                            <motion.div layoutId={`header-${id}`}>
                                <CardHeader>
                                    <motion.div layoutId={`title-${id}`}>
                                        <CardTitle>{title}</CardTitle>
                                    </motion.div>
                                    {description && (
                                        <motion.div layoutId={`desc-${id}`}>
                                            <CardDescription>{description}</CardDescription>
                                        </motion.div>
                                    )}
                                </CardHeader>
                            </motion.div>
                            <motion.div layoutId={`content-${id}`}>
                                <CardContent>{children}</CardContent>
                            </motion.div>
                        </Card>
                    </motion.div>
                </motion.div>

                <AnimatePresence>
                    {isExpanded && isExpandable && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsExpanded(false)}
                                className="fixed inset-0 bg-black/50 z-40"
                            />
                            <motion.div
                                layoutId={`card-${id}`}
                                className="fixed z-50 w-[90vw] max-w-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            >
                                <Card>
                                    <motion.div layoutId={`header-${id}`}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <motion.div layoutId={`title-${id}`}>
                                                        <CardTitle className="text-2xl">{title}</CardTitle>
                                                    </motion.div>
                                                    {description && (
                                                        <motion.div layoutId={`desc-${id}`}>
                                                            <CardDescription className="mt-2">{description}</CardDescription>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="h-8 w-8">
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Close</span>
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </CardHeader>
                                    </motion.div>
                                    <motion.div layoutId={`content-${id}`}>
                                        <CardContent>{expandedContent || children}</CardContent>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <CardFooter>
                                            <Button onClick={() => setIsExpanded(false)} className="ml-auto">
                                                Close
                                            </Button>
                                        </CardFooter>
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
