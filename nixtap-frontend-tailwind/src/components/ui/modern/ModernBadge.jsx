import React from 'react';

export function ModernBadge({ children, variant = 'default', dot = false, className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 border-slate-200 dark:border-white/10',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    danger:  'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
    brand:   'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 border-brand-200/50 dark:border-brand-500/20'
  };
  
  const dotColors = {
    default: 'bg-slate-500 dark:bg-slate-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger:  'bg-rose-500 dark:bg-rose-400',
    brand:   'bg-brand-500 dark:bg-brand-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
