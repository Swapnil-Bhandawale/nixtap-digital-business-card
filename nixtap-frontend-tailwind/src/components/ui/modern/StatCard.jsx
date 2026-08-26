import React from 'react';
import { PremiumCard } from './PremiumCard';

export function StatCard({ title, value, icon: Icon, trend, trendValue, className = '' }) {
  return (
    <PremiumCard className={`p-6 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">{value}</h3>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {trendValue}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-2">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.05]">
            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
        )}
      </div>
    </PremiumCard>
  );
}
