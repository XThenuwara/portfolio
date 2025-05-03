import { useState, useEffect, useCallback, useMemo } from 'react'

interface BreakPoints {
  lg: number
  md: number
  sm: number
}

export const useResponsiveRowHeight = (breakpoints: BreakPoints) => {
  const getRowHeight = useCallback((width: number) => {
    if (width < breakpoints.sm) return 200
    if (width < breakpoints.md) return 200
    if (width < breakpoints.lg) return 220
    return 280
  }, [breakpoints.sm, breakpoints.md, breakpoints.lg])

  const [rowHeight, setRowHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      return getRowHeight(window.innerWidth)
    }
    return 280
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const currentWidth = window.innerWidth
        setRowHeight(getRowHeight(currentWidth))
      }, 100)
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [getRowHeight])

  return rowHeight
}