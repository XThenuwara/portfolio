import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import data from '@/data/data.json'

const QuoteCard = () => {
    return (
        <div className="flex flex-col justify-between h-full">
            <span className="text-xl md:text-2xl font-medium text-default-900">
                {data.profile.quote}
            </span>
            <div className="flex justify-end mt-12">
                <Icon icon="mingcute:quote-right-fill" width="48" className="text-default-400" />
            </div>
        </div>
    )
}

export default QuoteCard
