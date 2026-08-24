import { motion } from 'framer-motion'
import { ArrowRight, QrCode, Wifi, Link, WalletCards } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { shareMethods } from '../utils/features.js'

function MethodVisual({ index, Icon }) {
  if (index === 0) {
    // QR Code
    return (
      <div className="w-full aspect-square rounded-xl bg-cloud-50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-brand-50 transition-colors duration-300 border border-cloud-200 dark:border-slate-800">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 bg-white dark:bg-slate-950 shadow-card rounded-xl p-2 relative"
        >
          <div className="w-full h-full border-[3px] border-ink-900 rounded-lg border-dashed" />
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-[2px] bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          />
        </motion.div>
      </div>
    )
  }
  
  if (index === 1) {
    // NFC Tap
    return (
      <div className="w-full aspect-square rounded-xl bg-cloud-50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-accent-50 transition-colors duration-300 border border-cloud-200 dark:border-slate-800">
        <motion.div 
          animate={{ rotateY: [0, 15, 0], y: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[85%] h-14 bg-gradient-to-r from-ink-800 to-ink-900 rounded-lg shadow-card relative overflow-hidden flex items-center justify-end px-4 border border-ink-700"
        >
           <Wifi size={16} className="text-cloud-400 rotate-90" />
        </motion.div>
        
        <motion.div
           animate={{ scale: [1, 1.5, 2], opacity: [0.8, 0.3, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute w-20 h-20 rounded-full border border-accent-400 pointer-events-none"
        />
      </div>
    )
  }
  
  if (index === 2) {
    // Custom Link
    return (
      <div className="w-full aspect-square rounded-xl bg-cloud-50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50 transition-colors duration-300 border border-cloud-200 dark:border-slate-800 px-4">
        <motion.div 
           whileHover={{ scale: 1.05 }}
           className="w-full py-2.5 px-3 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-cloud-200 dark:border-slate-800 flex items-center gap-2"
        >
           <div className="w-5 h-5 rounded-full bg-cloud-100 flex items-center justify-center shrink-0">
             <Link size={10} className="text-cloud-500" />
           </div>
           <div className="w-full h-1.5 bg-cloud-200 rounded-full" />
           <div className="w-6 h-4 bg-brand-100 rounded text-[8px] font-bold text-brand-600 flex items-center justify-center shrink-0">
             Copy
           </div>
        </motion.div>
      </div>
    )
  }
  
  // Wallet
  return (
    <div className="w-full aspect-square rounded-xl bg-cloud-50 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-violet-50 transition-colors duration-300 border border-cloud-200 dark:border-slate-800">
      <motion.div
        animate={{ y: [2, -2, 2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl shadow-card relative flex items-start p-2"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm" />
        <div className="absolute bottom-2 left-2 flex gap-1">
          <div className="w-3 h-1 bg-white/40 dark:bg-slate-900/40 rounded-full" />
          <div className="w-6 h-1 bg-white/40 dark:bg-slate-900/40 rounded-full" />
        </div>
      </motion.div>
    </div>
  )
}

export default function ShareMethods() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container-lg mx-auto container-px">
        <SectionHeading
          eyebrow="Share anywhere"
          title="Share your digital business card in seconds."
          subtitle="Share via QR code, NFC, or Apple Wallet. Always ready when you are, even offline."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shareMethods.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <motion.a
                href="#"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full flex flex-col rounded-2xl border border-cloud-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-soft hover:shadow-card-hover transition-shadow duration-300"
              >
                <MethodVisual index={i} Icon={item.icon} />
                <h3 className="mt-5 text-[15.5px] font-bold text-ink-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-[13.5px] text-cloud-600 leading-relaxed flex-1">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600">
                  {item.link}
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

