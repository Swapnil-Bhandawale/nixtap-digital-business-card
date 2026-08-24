import { useEffect } from 'react'

/**
 * Locks body scroll while `locked` is true. Used for mobile nav
 * overlays and modals so the page behind doesn't scroll.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}
