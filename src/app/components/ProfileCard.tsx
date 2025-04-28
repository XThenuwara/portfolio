'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeToggler } from '@/components/ThemeToggler'
import data from '@/data/data.json'
import Sparkles from '@/components/effects/Sparkles'

const ProfileCard = () => {
    return (
        <Sparkles className="absolute inset-0 -z-10">
            <div className="flex flex-col justify-between h-full relative z-10 p-2 md:p-4 lg:p-6">
                <div className="flex justify-end gap-2 items-center">
                    {data.profile.social.map((link, index) => (
                        <Link href={link.url} key={index} target="_blank">
                            <Button size="icon" variant="outline" className="rounded-full relative z-20 glass cursor-pointer">
                                <Icon icon={link.icon} width="24" className="text-default-400" />
                            </Button>
                        </Link>
                    ))}
                    {data.profile.contact.email && (
                        <Link href={`mailto:${data.profile.contact.email}`}>
                            <Button size="icon" variant="outline" className="rounded-full relative z-20 glass cursor-pointer">
                                <Icon icon="mingcute:mail-line" width="24" className="text-default-400" />
                            </Button>
                        </Link>
                    )}
                    <ThemeToggler />
                </div>
                <div>
                    <h3 className="text-6xl">{data.profile.name}</h3>
                    <span className="text-gray-500 font-semibold">{data.profile.title}</span>
                </div>
            </div>
        </Sparkles>
    )
}

export default ProfileCard
