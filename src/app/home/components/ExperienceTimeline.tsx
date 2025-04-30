'use client'

import React from 'react'
import { Timeline } from '@/components/timeline/TimeLine'
import data from '@/data/data.json'

const ExperienceTimeline = () => {
  const timelineData = data.profile.Experience.companyList.map(company => ({
    title: company.duration,
    content: (
      <div className="space-y-4">
        <div className="flex flex-col">
          <h4 className="text-3xl font-bold text-foreground">{company.name}</h4>
          <p className="text-neutral-700 dark:text-gray-400 font-medium">{company.position}</p>
        </div>
        
        {company.projects.map((project, index) => (
          <div key={index} className="space-y-2">
            <h5 className="text-lg font-semibold text-foreground">{project.name}</h5>
            <p className="text-sm text-neutral-700 dark:text-gray-400d">{project.description}</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700 dark:text-gray-400">
              {project.responsibilities.map((responsibility, idx) => (
                <li key={idx}>{responsibility}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }))

  return (
    <div className="w-full">
      <Timeline data={timelineData} />
    </div>
  )
}

export default ExperienceTimeline