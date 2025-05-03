import React, { useMemo } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { InfiniteScroll } from '@/components/effects/InfiniteScroll'
import data from '@/data/data.json'

interface SkillItem {
    name: string
    icon: string
}

interface SkillCategory {
    [key: string]: SkillItem[]
}

const SkillItem = React.memo(({ item }: { item: SkillItem }) => (
    <div role="listitem" className="flex gap-2 items-center bg-gray-100 dark:bg-background border p-1.5 rounded-full mx-1.5 w-full transition-colors">
        <Icon icon={item.icon} width="14" className="flex-shrink-0" />
        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm truncate">{item.name}</span>
    </div>
))

SkillItem.displayName = 'SkillItem'

const SkillsCard = () => {
    const { skills } = data.profile

    const skillCategories = useMemo(() => {
        return Object.entries(skills as SkillCategory).map(([category, items]) => ({
            category,
            items,
            duration: Math.random() * 3 + 7, // Random duration between 7 and 10 seconds, so that they don't all start at the same time
        }))
    }, [skills])

    return (
        <div className="flex flex-col gap-3 h-full overflow-hidden p-2">
            {skillCategories.map(({ category, items, duration }) => (
                <InfiniteScroll key={category} duration={duration} className="!text-sm !leading-normal" aria-label={`Skills in ${category}`}>
                    <div className="flex items-center gap-1" role="list" aria-label={`${category} skills list`}>
                        {items.map((item, index) => (
                            <SkillItem key={`${category}-${item.name}-${index}`} item={item} />
                        ))}
                    </div>
                </InfiniteScroll>
            ))}
        </div>
    )
}

export default React.memo(SkillsCard)
