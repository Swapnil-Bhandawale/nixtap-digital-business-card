import fs from 'fs';
import path from 'path';

const dir = 'D:/NixtapFinal3/NixtapFinal3/nixtap-frontend-tailwind/src/components/ui/modern';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
  'PremiumCard.jsx': `import React from 'react';
export function PremiumCard({ children, className = '', hover = true, glass = false }) {
  const base = "relative overflow-hidden rounded-2xl border transition-all duration-300";
  const bg = glass ? "bg-white/70 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10" : "bg-white dark:bg-[#0f0f13] border-black/[0.06] dark:border-white/[0.08]";
  const hoverStyle = hover ? "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:border-black/[0.1] dark:hover:border-white/[0.12] hover:-translate-y-0.5" : "shadow-sm";
  
  return (
    <div className={\`\${base} \${bg} \${hoverStyle} \${className}\`}>
      {children}
    </div>
  );
}`,
  
  'StatCard.jsx': `import React from 'react';
import { PremiumCard } from './PremiumCard';

export function StatCard({ title, value, icon: Icon, trend, trendValue, className = '' }) {
  return (
    <PremiumCard className={\`p-6 \${className}\`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">{value}</h3>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={\`font-medium \${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}\`}>
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
}`,

  'ModernBadge.jsx': `import React from 'react';

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
    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border \${variants[variant]} \${className}\`}>
      {dot && <span className={\`w-1.5 h-1.5 rounded-full \${dotColors[variant]}\`} />}
      {children}
    </span>
  );
}`,

  'SectionHeader.jsx': `import React from 'react';

export function SectionHeader({ title, description, actions, className = '' }) {
  return (
    <div className={\`flex flex-col sm:flex-row sm:items-center justify-between gap-4 \${className}\`}>
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}`,

  'ModernEmptyState.jsx': `import React from 'react';
import { PremiumCard } from './PremiumCard';

export function ModernEmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <PremiumCard hover={false} className={\`p-10 flex flex-col items-center justify-center text-center border-dashed \${className}\`}>
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
}`,

  'DataTable.jsx': `import React from 'react';

export function DataTable({ columns, data, keyField = 'id', className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto \${className}\`}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/[0.06] dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]">
            {columns.map((col, i) => (
              <th key={i} className="py-3.5 px-5 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {data.map((row, i) => (
            <tr key={row[keyField] || i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
              {columns.map((col, j) => (
                <td key={j} className="py-4 px-5 text-slate-700 dark:text-slate-300">
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,

  'ModernDropdown.jsx': `import React, { useState, useRef, useEffect } from 'react';

export function ModernDropdown({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div 
          className={\`absolute z-50 mt-2 w-48 rounded-xl bg-white/80 dark:bg-[#1a1a24]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 \${align === 'right' ? 'right-0' : 'left-0'} \${className}\`}
          onClick={() => setOpen(false)}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={\`w-full text-left px-4 py-2 text-sm transition-colors \${danger ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}\`}
    >
      {children}
    </button>
  );
}`,

  'ModernModal.jsx': `import React, { useEffect } from 'react';

export function ModernModal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={\`relative bg-white dark:bg-[#16161f] rounded-2xl border border-black/[0.05] dark:border-white/[0.1] shadow-2xl w-full \${maxWidth} animate-in zoom-in-95 duration-200 overflow-hidden\`}>
        {title && (
          <div className="px-6 py-4 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}`,

  'ModernSearchInput.jsx': `import React from 'react';

export function ModernSearchInput({ placeholder = 'Search...', value, onChange, className = '' }) {
  return (
    <div className={\`relative group \${className}\`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 bg-slate-50/50 dark:bg-[#0a0a0f]/50 border border-slate-200 dark:border-white/[0.08] rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all shadow-sm"
      />
    </div>
  );
}`,

  'ActivityItem.jsx': `import React from 'react';

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
}`,

  'PageHeader.jsx': `import React from 'react';

export function PageHeader({ title, subtitle, breadcrumbs, actions, className = '' }) {
  return (
    <div className={\`mb-8 \${className}\`}>
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              <span className={crumb.active ? 'text-slate-900 dark:text-slate-100 font-medium' : ''}>{crumb.label}</span>
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}`,

  'GradientAccent.jsx': `import React from 'react';

export function GradientAccent({ position = 'top-right', color = 'brand' }) {
  const positions = {
    'top-right': 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
    'top-left': 'top-0 left-0 -translate-x-1/3 -translate-y-1/3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };
  
  const colors = {
    brand: 'from-brand-500/20 to-purple-500/20',
    emerald: 'from-emerald-500/20 to-teal-500/20',
    rose: 'from-rose-500/20 to-orange-500/20'
  };

  return (
    <div className={\`absolute pointer-events-none z-0 w-96 h-96 rounded-full blur-[100px] bg-gradient-to-br \${colors[color]} \${positions[position]}\`} />
  );
}`,

  'LoadingSkeleton.jsx': `import React from 'react';

export function LoadingSkeleton({ className = '' }) {
  return (
    <div className={\`animate-pulse bg-slate-200 dark:bg-white/10 rounded-md \${className}\`} />
  );
}`,

  'index.js': `export * from './PremiumCard';
export * from './StatCard';
export * from './ModernBadge';
export * from './SectionHeader';
export * from './ModernEmptyState';
export * from './DataTable';
export * from './ModernDropdown';
export * from './ModernModal';
export * from './ModernSearchInput';
export * from './ActivityItem';
export * from './PageHeader';
export * from './GradientAccent';
export * from './LoadingSkeleton';
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
}

console.log("Flux-inspired design system components generated.");
