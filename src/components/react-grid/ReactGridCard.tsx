import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ReactGridCardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
    header?: React.ReactNode
    children: React.ReactNode
}

const ReactGridCard = React.forwardRef<HTMLDivElement, ReactGridCardProps>(({ className, children, header, ...props }, ref) => {
    return (
        <Card ref={ref} className={cn('rounded-sm border bg-card text-card-foreground shadow hover:shadow-lg', className)} {...props}>
            {header && <CardHeader>{header}</CardHeader>}
            <CardContent className="p-6">{children}</CardContent>
        </Card>
    )
})

ReactGridCard.displayName = 'ReactGridCard'

export default ReactGridCard
