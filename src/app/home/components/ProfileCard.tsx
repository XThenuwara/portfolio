'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeToggler } from '@/components/ThemeToggler'
import data from '@/data/data.json'
import Sparkles from '@/components/effects/Sparkles'

const SocialLink = React.memo(({ url, icon, title }: { url: string; icon: string; title: string }) => (
    <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={title}>
        <Button size="icon" variant="outline" className="rounded-full relative z-20 glass cursor-pointer">
            <Icon icon={icon} width="24" className="text-default-400" />
        </Button>
    </Link>
))

SocialLink.displayName = 'SocialLink'

const ProfileCard = () => {
    const socialLinks = React.useMemo(() => data.profile.social, [])
    const email = React.useMemo(() => data.profile.contact.email, [])
    const { name, title } = data.profile

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 pointer-events-none">
                <Sparkles />
            </div>
            <div className="flex flex-col justify-between h-full z-10 p-2 md:p-4 lg:p-6">
                <div className="flex justify-end gap-2 items-center">
                    {socialLinks.map((link, index) => (
                        <SocialLink key={index} url={link.url} icon={link.icon} title={`Connect with ${name} on ${link.url.split('.')[1]}`} />
                    ))}
                    {email && <SocialLink url={`mailto:${email}`} icon="mingcute:mail-line" title={`Send email to ${name}`} />}
                    <ThemeToggler />
                </div>
                <div className="mt-auto">
                    <h1 className="text-6xl font-bold tracking-tight">{name}</h1>
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">{title}</span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProfileCard)
