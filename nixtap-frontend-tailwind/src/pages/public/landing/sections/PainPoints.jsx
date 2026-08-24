import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, Database, Layers, RefreshCcw, BellOff, ArrowRight } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { painPoints } from '../utils/painPoints.js'

function TiltCard({ item, index }) {
  const ref = useRef(null)
  
  // Motion values for 3D tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // Bespoke Visuals for each pain point
  const renderVisual = () => {
    if (index === 0) {
      // Paper cards
      return (
        <div className="w-full h-24 bg-cloud-50/50 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-brand-50/50 transition-colors duration-500">
           <motion.div className="w-16 h-10 bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded shadow-sm absolute z-10"
              initial={{ y: 0, rotate: -6 }}
              whileHover={{ y: -8, rotate: -12, scale: 1.05 }}
           />
           <motion.div className="w-16 h-10 bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded shadow-sm absolute z-20"
              initial={{ y: 2, rotate: 2 }}
              whileHover={{ y: 0, rotate: 4, scale: 1.05 }}
           />
           <motion.div className="w-16 h-10 bg-white dark:bg-slate-950 border border-cloud-300 dark:border-slate-800 rounded shadow-md absolute z-30 flex items-center justify-center"
              initial={{ y: 4, rotate: 8 }}
              whileHover={{ y: 8, rotate: 16, scale: 1.05 }}
           >
             <div className="w-8 h-1 bg-cloud-100 rounded-full" />
           </motion.div>
        </div>
      )
    }
    if (index === 1) {
      // Outdated info
      return (
         <div className="w-full h-24 bg-cloud-50/50 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-amber-50/50 transition-colors duration-500">
            <div className="w-20 h-16 bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1.5 p-2 relative overflow-hidden">
               <motion.div className="w-6 h-6 rounded-full bg-cloud-100" />
               <motion.div 
                 animate={{ width: ["40%", "60%", "40%"] }} 
                 transition={{ duration: 3, repeat: Infinity }}
                 className="h-1.5 bg-cloud-200 rounded-full" 
               />
               <motion.div 
                 animate={{ opacity: [1, 0, 1] }} 
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 bg-red-500/10 flex items-center justify-center"
               >
                 <RefreshCcw size={14} className="text-red-500" />
               </motion.div>
            </div>
         </div>
      )
    }
    if (index === 2) {
      // CRM Entry
      return (
         <div className="w-full h-24 bg-cloud-50/50 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-indigo-50/50 transition-colors duration-500">
            <div className="flex items-center gap-2">
              <div className="w-10 h-12 bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded shadow-sm flex flex-col gap-1 p-1">
                <div className="w-full h-1 bg-cloud-200 rounded" />
                <div className="w-full h-1 bg-cloud-200 rounded" />
              </div>
              <motion.div 
                animate={{ x: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={14} className="text-indigo-400" />
              </motion.div>
              <div className="w-12 h-14 bg-indigo-500 rounded flex items-center justify-center shadow-md">
                <Database size={16} className="text-white" />
              </div>
            </div>
         </div>
      )
    }
    if (index === 3) {
      // Follow up
      return (
         <div className="w-full h-24 bg-cloud-50/50 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-rose-50/50 transition-colors duration-500">
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <BellOff size={24} className="text-cloud-400 group-hover:text-rose-400 transition-colors" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"
              />
            </div>
         </div>
      )
    }
    
    // Default fallback visual for remaining
    return (
      <div className="w-full h-24 bg-cloud-50/50 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center group-hover:bg-brand-50/50 transition-colors duration-500">
         <motion.div 
           whileHover={{ scale: 1.1, rotate: 5 }}
           className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl border border-cloud-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-cloud-400 group-hover:text-brand-500 transition-colors"
         >
           <item.icon size={20} />
         </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group h-full"
    >
      <div className="h-full rounded-2xl border border-cloud-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
        {/* Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-accent-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
        
        <div className="relative z-10">
          {renderVisual()}
          <h3 className="text-[17px] font-bold text-ink-900 dark:text-white leading-snug">
            {item.title}
          </h3>
          <p className="mt-2 text-[14px] text-cloud-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function PainPoints() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Reveal>
            <p className="text-[13px] font-bold text-brand-600 uppercase tracking-widest mb-3">
              The Old Way
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-ink-900 dark:text-white leading-tight">
              You meet people every day. <br />
              <span className="text-cloud-400">But you forget most of them.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1000px" }}>
          {painPoints.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.1}>
              <TiltCard item={item} index={i} />
            </Reveal>
          ))}
        </div>
        
        <Reveal delay={0.4}>
          <div className="mt-24 flex flex-col items-center justify-center">
            <p className="text-[16px] font-medium text-cloud-500 mb-6">
              From introductions that disappear...
            </p>
            <div className="w-px h-16 bg-gradient-to-b from-cloud-200 to-brand-500 relative">
               <motion.div 
                 animate={{ y: [0, 64] }} 
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
               />
            </div>
            <p className="text-[18px] font-bold text-brand-600 mt-6">
              ...to connections that stay.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

