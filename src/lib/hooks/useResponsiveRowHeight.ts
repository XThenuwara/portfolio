import { useState, useEffect } from 'react'

interface BreakPoints {
  lg: number
  md: number
  sm: number
}

export const useResponsiveRowHeight = (breakpoints: BreakPoints) => {
  const getRowHeight = (width: number) => {
    if (width < breakpoints.sm) return 200  // mobile
    if (width < breakpoints.md) return 200  // tablet
    if (width < breakpoints.lg) return 220  // laptop
    return 280                              // desktop
  }

  const [rowHeight, setRowHeight] = useState<number>(
    getRowHeight(typeof window !== 'undefined' ? window.innerWidth : breakpoints.lg)
  )

  useEffect(() => {
    const handleResize = () => {
      setRowHeight(getRowHeight(window.innerWidth))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return rowHeight
}