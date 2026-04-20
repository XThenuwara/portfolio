import { useState, useEffect, useLayoutEffect, useCallback } from 'react'

interface BreakPoints {
  lg: number
  md: number
  sm: number
}

// Use useLayoutEffect on the client to avoid flash; fall back to useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const useResponsiveRowHeight = (breakpoints: BreakPoints) => {
  const getRowHeight = useCallback((width: number) => {
    if (width < breakpoints.sm) return 200
    if (width < breakpoints.md) return 200
    if (width < breakpoints.lg) return 220
    return 280
  }, [breakpoints.sm, breakpoints.md, breakpoints.lg])

  // Default to 200 (smallest/mobile value) for SSR so the server HTML is
  // closer to what mobile clients actually need, reducing layout jump on hydration.
  const [rowHeight, setRowHeight] = useState(200)

  // Run synchronously before the browser paints to set the correct height
  // immediately on mount — prevents the flash from SSR default → real value.
  useIsomorphicLayoutEffect(() => {
    setRowHeight(getRowHeight(window.innerWidth))
  }, [getRowHeight])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setRowHeight(getRowHeight(window.innerWidth))
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [getRowHeight])

  return rowHeight
}