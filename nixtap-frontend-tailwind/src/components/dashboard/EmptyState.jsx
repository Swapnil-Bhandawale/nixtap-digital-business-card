import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description = 'Once you have some data, it will show up here.',
  actionLabel,
  onAction = () => {},
  animate = true,
}) {
  const Wrapper = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      }
    : {};

  return (
    <Wrapper
      {...motionProps}
      className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white dark:bg-[#1e1e2a] rounded-3xl border border-black/[0.06] dark:border-white/[0.08]"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-500/10 dark:to-violet-500/10 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6 max-w-xs">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all"
        >
          {actionLabel}
        </button>
      )}
    </Wrapper>
  );
}
