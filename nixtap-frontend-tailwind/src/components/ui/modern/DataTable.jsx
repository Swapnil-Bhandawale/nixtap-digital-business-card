import React from 'react';

export function DataTable({ columns, data, keyField = 'id', className = '' }) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
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
}
