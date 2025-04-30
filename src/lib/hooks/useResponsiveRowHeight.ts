import { useState, useEffect } from 'react'

interface BreakPoints {
  lg: number
  md: number
  sm: number
}

export const useResponsiveRowHeight = (breakpoints: BreakPoints) => {
  const getRowHeight = (width: number) => {
    if (width < breakpoints.sm) return 200
    if (width < breakpoints.md) return 200
    if (width < breakpoints.lg) return 220
    return 280
  }

  const [rowHeight, setRowHeight] = useState<number>(280)

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth
      setRowHeight(getRowHeight(currentWidth))
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints.sm, breakpoints.md, breakpoints.lg])

  return rowHeight
}