'use client'

import React from 'react'
import data from '@/data/data.json'
import HackerText from '@/components/effects/HackerText'

const ExperienceCard = () => {
    const calculateExperience = () => {
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
    }

    return (
        <div className="flex flex-col justify-around h-full">
            <div>
                <span className="text-gray-500 font-semibold">Experience</span>
                <HackerText value={calculateExperience().year} />
                <HackerText value={calculateExperience().months + " +"} />
            </div>
            <h3 className="text-xl text-transparent">Experience</h3>
        </div>
    )
}

export default ExperienceCard