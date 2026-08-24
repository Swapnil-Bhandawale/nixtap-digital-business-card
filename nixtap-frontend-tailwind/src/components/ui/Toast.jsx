import { CheckCircle2, XCircle } from 'lucide-react';

export default function Toast({ toast = null }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <div className="flex items-center gap-2.5 bg-slate-900 dark:bg-[#1e1e2a] border dark:border-white/10 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        {toast.message}
      </div>
    </div>
  );
}
