import React from 'react'
import data from '@/data/data.json'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

const ProjectsCard = () => {
  const projects = data.profile.projects

  return (
    <div className="h-full w-full relative flex justify-between flex-col z-50">
      <div className="flex gap-5">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-50 p-2 md:p-3 rounded-lg w-full flex flex-col">
            <div>
              <h3 className="text-2xl font-semibold">{project.title}</h3>
              <span className="text-xs font-medium">{project.description}</span>
            </div>
            <div className="flex justify-end">
              <Link target='_blank' href={project.link}>
                <Button size="icon" variant="outline" className="rounded-full bg-default-200 dark:bg-default-100">
                  <Icon icon="mynaui:chevron-up-right" width="16" className="text-default-400" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute scale-50 md:scale-100 -z-10" style={{ bottom: -250, left: -70 }}>
        <div className="solar-container" style={{ bottom: 5 }}>
          <div className="planet"></div>
          <div className="orbit">
            <div className="moon"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsCard