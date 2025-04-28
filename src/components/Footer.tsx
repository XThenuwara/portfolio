import React from 'react'
import pkg from '../../package.json'
import data from '@/data/data.json'

const Footer = () => {
    return (
        <div className="w-full flex justify-end flex-col items-end p-2 lg:p-4">
            <small className="text-xs font-semibold text-gray-400">{new Date().getFullYear()} © {data.profile.name}</small>
            <small>
                <span className="text-xs font-semibold text-gray-400">version {pkg.version}</span>
            </small>
        </div>
    )
}

export default Footer
