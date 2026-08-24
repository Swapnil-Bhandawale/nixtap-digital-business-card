import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'

export default function AccordionItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-cloud-200 dark:border-slate-800">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-[15.5px] sm:text-[16px] font-semibold text-ink-900 dark:text-white">
          {question}
        </span>
        <span className="shrink-0 w-8 h-8 rounded-full bg-cloud-100 flex items-center justify-center">
          <Plus
            size={16}
            className={`text-ink-700 dark:text-white transition-transform duration-300 ease-out ${
              open ? 'rotate-45' : ''
            }`}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14.5px] text-cloud-600 leading-relaxed pr-10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

