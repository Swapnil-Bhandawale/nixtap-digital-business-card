import { motion } from 'framer-motion'
import Reveal from '../components/ui/Reveal.jsx'
import { highlights } from '../utils/howItWorks.js'

export default function Highlights() {
  return (
    <section className="py-24 lg:py-28">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-2xl bg-ink-900 p-6 text-white"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 dark:bg-slate-900/10 flex items-center justify-center">
                  <item.icon size={20} strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-[16px] font-bold leading-snug">{item.title}</h3>
                <p className="mt-2 text-[13.5px] text-cloud-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

