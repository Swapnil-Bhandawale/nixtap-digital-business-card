import React from 'react';
import { PremiumCard } from './PremiumCard';

export function ModernEmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <PremiumCard hover={false} className={`p-10 flex flex-col items-center justify-center text-center border-dashed ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center mb-4 border border-black/[0.05] dark:border-white/[0.05]">
          <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </PremiumCard>
  );
}