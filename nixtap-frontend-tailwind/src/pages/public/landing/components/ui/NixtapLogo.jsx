/**
 * Original Nixtap wordmark + icon.
 * A clean rounded-square mark with a blue gradient and a bold white "N",
 * matching Nixtap's physical NFC card branding exactly.
 */
export default function NixtapLogo({ className = '', showWordmark = true, size = 36, forceLight = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="block shrink-0"
      >
        <defs>
          <linearGradient id="nixtapBase" x1="4" y1="3" x2="32" y2="33" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5B8DF6" />
            <stop offset="100%" stopColor="#2E4FE0" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="32" height="32" rx="9" fill="url(#nixtapBase)" />
        <path
          d="M11.5 24.5V11.5h2.3l8.7 9.2v-9.2h2.1v13h-2.3l-8.7-9.2v9.2h-2.1Z"
          fill="white"
        />
      </svg>
      {showWordmark && (
        <span className={`text-[19px] font-bold tracking-tight ${forceLight ? 'text-white' : 'text-ink-900 dark:text-white'}`}>
          Nixtap
        </span>
      )}
    </div>
  )
}

