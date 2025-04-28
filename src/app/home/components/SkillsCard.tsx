import React, { useMemo } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { InfiniteScroll } from '@/components/effects/InfiniteScroll'
import data from '@/data/data.json'

const SkillItem = ({ item }: { item: { name: string; icon: string } }) => {
    return (
        <div className="flex gap-3 items-center bg-gray-100 dark:bg-gray-800 p-2 py-1 rounded-full mx-2 w-full">
            <Icon icon={item.icon} width="16" />
            <span className="text-gray-600 dark:text-gray-300 font-semibold truncate">{item.name}</span>
        </div>
    )
}

const SkillsCard = () => {
    const randomConfigs = useMemo(() => {
        return Object.keys(data.profile.skills).map(() => ({
            duration: Math.random() * 5 + 5,
        }))
    }, [])

    return (
        <div className="flex flex-col gap-4">
            {Object.entries(data.profile.skills).map(([category, items], index) => (
                <InfiniteScroll key={category} duration={randomConfigs[index].duration} className="!text-base !leading-normal">
                    <div className="flex items-center">
                        {items.map((item: any, itemIndex: number) => (
                            <SkillItem key={itemIndex} item={item} />
                        ))}
                    </div>
                </InfiniteScroll>
            ))}
        </div>
    )
}

export default SkillsCard
