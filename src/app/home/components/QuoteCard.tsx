import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { ContainerTextFlip } from '../../../components/effects/TextFlip'

const QuoteCard = () => {
    return (
        <div className="flex flex-col justify-between h-full">
            <span className="text-xl md:text-2xl font-medium text-default-900">
                <ContainerTextFlip
                    words={[
                        "Embracing the web, experimenting with UIs, and devoted to software creation",
                         "Embracing the web, experimenting with UIs, and devoted to software creation",
                          "Embracing the web, experimenting with UIs, and devoted to software creation"
                    ]}
                    />
            </span>
            <div className="flex justify-end">
                <Icon icon="mingcute:quote-right-fill" width="48" className="text-default-400" />
            </div>
        </div>
    )
}

export default QuoteCard
