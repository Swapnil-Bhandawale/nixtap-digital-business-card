import Reveal from './Reveal.jsx'

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex flex-col max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className="text-[13px] font-semibold text-brand-600 tracking-wide uppercase">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2 className="mt-3 text-display-md font-bold text-ink-900 dark:text-white">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <p className="mt-4 text-[16px] sm:text-[17px] text-cloud-600 leading-relaxed">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}

