'use client'

import React from 'react'
import data from '@/data/data.json'
import HackerText from '@/components/effects/HackerText'
import Image from 'next/image'

const ExperienceCard = () => {
    const experienceText = React.useMemo(() => {
        const startDate = new Date(data.profile.Experience.startDate)
        const currentDate = new Date()

        const yearDiff = currentDate.getFullYear() - startDate.getFullYear()
        const monthDiff = currentDate.getMonth() - startDate.getMonth()

        let years = yearDiff
        let months = monthDiff

        if (monthDiff < 0) {
            years--
            months = 12 + monthDiff
        }

        return {
            year: `${years} Years`,
            months: `${months} Months`
        }
    }, [])

    const companyLogos = React.useMemo(() => {
        return data.profile.Experience.companyList.map((company, i) => (
            company.logo ? (
                <div 
                    key={company.name} 
                    className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-background bg-white z-10"
                    style={{ zIndex: data.profile.Experience.companyList.length - i }}
                >
                    <Image 
                        src={company.logo} 
                        alt={company.name} 
                        fill 
                        className="object-cover"
                    />
                </div>
            ) : null
        ))
    }, [])

    return (
        <div className="flex flex-col justify-around h-full">
            <div>
                <span className="text-gray-500 font-semibold">Experience</span>
                <HackerText value={experienceText.year} />
                <HackerText value={experienceText.months + " +"} />
            </div>
            <div className="absolute bottom-4 right-4 flex -space-x-2">
                {companyLogos}
            </div>
            <h3 className="text-xl text-transparent">Experience</h3>
        </div>
    )
}

export default React.memo(ExperienceCard)