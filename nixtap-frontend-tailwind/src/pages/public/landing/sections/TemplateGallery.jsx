import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, QrCode } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import NixtapLogo from '../components/ui/NixtapLogo.jsx'

const templates = [
  { id: 1, name: 'Midnight', bg: 'bg-ink-950', border: 'border-ink-800', text: 'text-white', subtext: 'text-cloud-400', glow: 'shadow-[0_0_40px_rgba(255,255,255,0.05)]' },
  { id: 2, name: 'Aurora', bg: 'bg-gradient-to-br from-brand-600 to-indigo-600', border: 'border-white/20', text: 'text-white', subtext: 'text-white/70', glow: 'shadow-[0_20px_40px_rgba(79,70,229,0.25)]' },
  { id: 3, name: 'Minimal', bg: 'bg-white dark:bg-slate-950', border: 'border-cloud-200 dark:border-slate-800', text: 'text-ink-900 dark:text-white', subtext: 'text-cloud-500', glow: 'shadow-card' },
  { id: 4, name: 'Onyx Glass', bg: 'bg-gradient-to-br from-zinc-800 to-ink-950', border: 'border-zinc-700', text: 'text-white', subtext: 'text-zinc-400', glow: 'shadow-[0_20px_40px_rgba(0,0,0,0.4)]' },
  { id: 5, name: 'Crimson', bg: 'bg-gradient-to-br from-rose-500 to-red-700', border: 'border-white/20', text: 'text-white', subtext: 'text-white/70', glow: 'shadow-[0_20px_40px_rgba(225,29,72,0.25)]' },
  { id: 6, name: 'Frost', bg: 'bg-cloud-50 dark:bg-slate-800', border: 'border-cloud-200 dark:border-slate-800', text: 'text-ink-900 dark:text-white', subtext: 'text-cloud-500', glow: 'shadow-soft' },
]

export default function TemplateGallery() {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])

  return (
    <section ref={containerRef} className="py-24 lg:py-32 overflow-hidden bg-white dark:bg-slate-950 border-t border-cloud-200 dark:border-slate-800">
      <div className="max-w-container-lg mx-auto container-px mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <p className="text-[13px] font-bold text-brand-600 uppercase tracking-widest mb-3">
              Premium Templates
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-ink-900 dark:text-white leading-tight">
              Stand out with <br className="hidden sm:block" /> beautiful designs.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] text-cloud-600 max-w-md leading-relaxed">
              Choose from dozens of professionally designed templates. Customize colors, fonts, and layouts to match your personal brand perfectly.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Horizontal Draggable/Scrollable Gallery */}
      <div className="w-full relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          style={{ x }}
          className="flex gap-5 px-4 md:px-8 lg:px-16 w-max cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ right: 0, left: -1500 }}
          dragElastic={0.1}
        >
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className={`w-[220px] h-[360px] sm:w-[260px] sm:h-[400px] rounded-[1.5rem] p-5 flex flex-col justify-between ${template.bg} ${template.border} border ${template.glow} shrink-0`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-full border-2 ${template.border} overflow-hidden bg-white dark:bg-slate-950`}>
                  <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <NixtapLogo className={template.text} size={20} />
                </div>
              </div>

              {/* Card Info */}
              <div className="mt-auto mb-8">
                <h3 className={`text-[20px] font-bold ${template.text}`}>Alex Morgan</h3>
                <p className={`text-[13px] font-medium ${template.subtext} mt-0.5`}>Creative Director</p>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end">
                <div className="flex gap-2">
                  <div className={`w-8 h-8 rounded-full bg-black/10 flex items-center justify-center border ${template.border}`}>
                     <div className={`w-3 h-3 rounded-full ${template.bg} border border-white/20`} />
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center border ${template.border}`}>
                  <QrCode size={18} className={template.text} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className="max-w-container-lg mx-auto container-px mt-16 flex justify-center">
         <Reveal delay={0.2}>
           <button className="flex items-center gap-2 text-[15px] font-bold text-brand-600 hover:text-brand-700 group">
             Explore all templates
             <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
           </button>
         </Reveal>
      </div>
    </section>
  )
}

