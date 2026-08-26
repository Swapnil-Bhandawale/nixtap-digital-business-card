import React from 'react';

export function ActivityItem({ icon: Icon, title, description, time, isLast = false }) {
  return (
    <div className="relative flex gap-4">
      {!isLast && <div className="absolute left-4 top-10 bottom-[-1rem] w-px bg-slate-200 dark:bg-white/10" />}
      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-[#1e1e2a] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
        {Icon ? <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <div className="w-2 h-2 rounded-full bg-brand-500" />}
      </div>
      <div className="pb-6">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        {time && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{time}</p>}
      </div>
    </div>
  );
}
