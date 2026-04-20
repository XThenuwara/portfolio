'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const Home = dynamic(() => import('./home/Home'), { ssr: false })
const Weblog = dynamic(() => import('./weblog/Weblog'), { ssr: false })
const BlogPost = dynamic(() => import('./weblog/WeblogPost'), { ssr: false })

export default function Page() {
  const [currentRoute, setCurrentRoute] = useState<string>('#/')

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash || '#/'
    setCurrentRoute(hash)
  }, [])

  useEffect(() => {
    handleHashChange()

    const debouncedHandler = () => {
      requestAnimationFrame(handleHashChange)
    }

    window.addEventListener('hashchange', debouncedHandler)
    return () => window.removeEventListener('hashchange', debouncedHandler)
  }, [handleHashChange])

  switch(currentRoute.split('?')[0]) {
    case '#/':
      return <Home />
    case '#/weblog':
      return <Weblog />
    case '#/weblog/post':
      const query = new URLSearchParams(window.location.hash.split('?')[1] || '')
      const id = query.get('id')
      return <BlogPost id={id || ''} />
    default:
      return <Home />
  }
}