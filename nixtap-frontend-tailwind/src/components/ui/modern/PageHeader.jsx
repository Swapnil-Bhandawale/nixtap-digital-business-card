import React from 'react';

export function PageHeader({ title, subtitle, breadcrumbs, actions, className = '' }) {
  return (
    <div className={`mb-8 ${className}`}>
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
}
