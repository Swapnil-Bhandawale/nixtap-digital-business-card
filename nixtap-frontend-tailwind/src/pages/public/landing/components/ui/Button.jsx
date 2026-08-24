import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-700 shadow-card hover:shadow-card-hover',
  accent:
    'bg-brand-500 text-white hover:bg-brand-600 shadow-glow',
  ghost:
    'bg-transparent text-ink-900 dark:text-white hover:bg-cloud-200',
  outline:
    'bg-white dark:bg-slate-950 text-ink-900 dark:text-white border border-cloud-300 dark:border-slate-800 hover:border-ink-900',
}

const sizes = {
  sm: 'text-[13px] px-4 py-2 rounded-full',
  md: 'text-[14px] px-5 py-2.5 rounded-full',
  lg: 'text-[15px] px-7 py-3.5 rounded-full',
}

/**
 * Shared Button used across the whole landing page so every CTA
 * shares the same easing, scale, and shadow language.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  ...props
}) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block"
    >
      <Component
        className={`font-semibold whitespace-nowrap transition-colors duration-200 ease-out inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  )
}

