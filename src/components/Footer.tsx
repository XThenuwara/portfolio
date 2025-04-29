import React from 'react'
import pkg from '../../package.json'
import data from '@/data/data.json'
import { ThemeToggler } from '@/components/ThemeToggler'

const Footer = () => {
    return (
      <div className='flex items-center justify-between w-full'>
        <a href="#/" className="flex items-center gap-2 text-3xl font-semibold">
            Portfolio
        </a>
        <div className='flex items-center gap-2'>
            <ThemeToggler />
            <div className="flex flex-col items-end p-2 lg:p-4">
                <small className="text-xs font-semibold text-gray-400">
                    {new Date().getFullYear()} © {data.profile.name}
                </small>
                <small>
                    <span className="text-xs font-semibold text-gray-400">version {pkg.version}</span>
                </small>
            </div>
        </div>
      </div>
    )
}

export default Footer
