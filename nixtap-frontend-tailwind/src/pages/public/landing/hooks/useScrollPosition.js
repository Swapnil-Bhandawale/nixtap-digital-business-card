import { useEffect, useState } from 'react'

/**
 * Tracks vertical scroll position and returns whether the page
 * has been scrolled past a given threshold. Used to drive the
 * navbar's "scrolled" visual state (blur, shadow, condensed height).
 */
export function useScrollPosition(threshold = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}
