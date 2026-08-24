import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open = false,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  danger = true,
  loading = false,
  onConfirm = () => {},
  onCancel = () => {},
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1e1e2a] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-2xl p-6"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${
                danger ? 'bg-red-50 dark:bg-red-500/10' : 'bg-blue-50 dark:bg-blue-500/10'
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}
                strokeWidth={2}
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{description}</p>

            <div className="flex items-center gap-2.5 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full py-2.5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 text-sm font-semibold text-white rounded-full py-2.5 transition-all disabled:opacity-60 ${
                  danger
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-br from-blue-600 to-violet-600 hover:opacity-90'
                }`}
              >
                {loading ? 'Please wait…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
