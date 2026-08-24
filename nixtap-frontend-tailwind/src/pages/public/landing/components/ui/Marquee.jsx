/**
 * Infinite horizontal marquee. Duplicates children once so the CSS
 * animation can loop seamlessly from -50% back to 0.
 */
export default function Marquee({ children, speed = 'normal', pauseOnHover = true, gap = 'gap-4' }) {
  const animClass = speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee'

  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max ${gap} ${animClass} ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
      >
        <div className={`flex shrink-0 ${gap}`}>{children}</div>
        <div className={`flex shrink-0 ${gap}`} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
