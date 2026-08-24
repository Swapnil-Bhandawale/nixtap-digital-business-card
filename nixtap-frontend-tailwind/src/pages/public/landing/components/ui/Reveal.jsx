import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Wraps children in a fade-up reveal that triggers once when scrolled
 * into view. Used throughout the landing page for consistent motion.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}
