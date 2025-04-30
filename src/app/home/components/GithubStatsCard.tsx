import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LoadingSpinner from '@/components/LoadingSpinner'
import profile from '@/data/data.json'

const GithubStatsCard = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${profile.blog.owner}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className='flex justify-center items-center mt-12'>
      <LoadingSpinner/>
    </div>
  }

  if (error) {
    return <div>
      <p>Error: {error}</p>
    </div>
  }

  return (
    <div className="relative">      
      <div 
        className="absolute -left-4 -bottom-4 w-24 h-24 opacity-25 blur-xs"
        style={{
          backgroundImage: `url(${data.avatar_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%'
        }}
      />
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="mingcute:github-fill" width="24" height="24" />
        <h2 className="text-xl font-semibold">GitHub Stats</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Repositories" value={data.public_repos} />
        <StatItem label="Followers" value={data.followers} />
        <StatItem label="Following" value={data.following} />
        <StatItem label="Member since" value={new Date(data.created_at).getFullYear()} />
      </div>

      <div className="mt-4 flex justify-end">
        <Button asChild size="icon" variant="outline" className='rounded-full'>
          <Link
            href={data.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Icon icon="mynaui:chevron-up-right" width="16" height="16" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
  <div className="p-2 rounded">
    <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
)

export default GithubStatsCard