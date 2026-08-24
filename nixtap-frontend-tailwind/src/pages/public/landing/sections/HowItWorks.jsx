import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout, Palette, ScanLine, Share2, UserCheck, Download, TrendingUp, Sparkles, Check, Smartphone } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import PhoneMockup from '../components/ui/PhoneMockup.jsx'
import { steps } from '../utils/howItWorks.js'
import NixtapLogo from '../components/ui/NixtapLogo.jsx'

// Premium Create Visual
function CreateVisual() {
  const [activeColor, setActiveColor] = useState(0)
  const colors = [
    'from-brand-500 to-indigo-500',
    'from-rose-500 to-orange-500',
    'from-emerald-500 to-teal-500'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveColor((prev) => (prev + 1) % colors.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[480px] rounded-3xl bg-gradient-to-br from-cloud-50 to-cloud-100 overflow-hidden flex items-center justify-center border border-cloud-200 dark:border-slate-800 shadow-inner group">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid-cloud-200/60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/30 rounded-full blur-[80px]" />

      <div className="relative z-10 w-[90%] max-w-[420px] rounded-2xl bg-white dark:bg-slate-950 shadow-card-hover border border-cloud-200 dark:border-slate-800 overflow-hidden flex flex-col transform group-hover:scale-[1.02] transition-transform duration-500">
        
        {/* Editor Top Bar */}
        <div className="h-12 border-b border-cloud-100 dark:border-slate-800 flex items-center justify-between px-5 bg-white dark:bg-slate-950">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-cloud-200" />
            <div className="w-3 h-3 rounded-full bg-cloud-200" />
            <div className="w-3 h-3 rounded-full bg-cloud-200" />
          </div>
          <span className="text-[11px] font-bold text-ink-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={12} className="text-brand-500" /> Card Studio
          </span>
          <div className="w-6 h-6 rounded-md bg-brand-50 flex items-center justify-center text-brand-600">
            <Check size={14} strokeWidth={3} />
          </div>
        </div>
        
        <div className="p-5 flex gap-5 h-[320px] bg-cloud-50/30">
          
          {/* Controls Sidebar */}
          <div className="w-1/2 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold text-cloud-500 uppercase tracking-wider mb-2">Theme</p>
              <div className="flex gap-2">
                {colors.map((c, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveColor(i)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} flex items-center justify-center transition-all ${activeColor === i ? 'ring-2 ring-brand-500 ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {activeColor === i && <Check size={12} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-cloud-500 uppercase tracking-wider mb-2">Profile Details</p>
              <div className="space-y-2">
                <div className="h-8 w-full bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded-lg shadow-sm" />
                <div className="h-8 w-3/4 bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 rounded-lg shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
              <div className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 flex items-center justify-center text-cloud-600 shadow-sm hover:text-brand-600 hover:border-brand-200 transition-colors cursor-pointer"><Layout size={16}/></div>
              <div className="h-10 rounded-xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 flex items-center justify-center text-cloud-600 shadow-sm hover:text-brand-600 hover:border-brand-200 transition-colors cursor-pointer"><Palette size={16}/></div>
            </div>
          </div>
          
          {/* Live Preview Device */}
          <div className="w-1/2 rounded-2xl bg-ink-900 p-1.5 shadow-xl relative overflow-hidden flex flex-col items-center">
             <div className="w-12 h-3 bg-black rounded-b-lg absolute top-0 z-20" />
             <div className="w-full h-full bg-white dark:bg-slate-950 rounded-xl overflow-hidden relative">
               
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeColor}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className={`h-24 w-full bg-gradient-to-br ${colors[activeColor]}`}
                 />
               </AnimatePresence>

               <div className="absolute top-16 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white bg-cloud-100 overflow-hidden shadow-sm">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
               </div>

               <div className="mt-8 text-center px-2">
                 <div className="w-20 h-2.5 bg-ink-800 rounded-full mx-auto" />
                 <div className="w-16 h-1.5 bg-cloud-300 rounded-full mx-auto mt-1.5" />
               </div>

               <div className="mt-4 px-3">
                 <div className="w-full h-7 bg-ink-900 rounded-lg flex items-center justify-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-white/20 dark:bg-slate-900/20" />
                   <div className="w-10 h-1 rounded-full bg-white dark:bg-slate-950" />
                 </div>
               </div>

               <div className="flex justify-center gap-2 mt-4">
                 <div className="w-6 h-6 rounded-full bg-cloud-100" />
                 <div className="w-6 h-6 rounded-full bg-cloud-100" />
                 <div className="w-6 h-6 rounded-full bg-cloud-100" />
               </div>

             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Premium Share Visual
function ShareVisual() {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[480px] rounded-3xl bg-ink-950 overflow-hidden flex items-center justify-center border border-ink-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent)]" />
      
      <div className="relative z-10 flex items-center gap-8 lg:gap-12 w-full justify-center px-4">
        
        {/* Simplified Premium Phone Render */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotateY: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 w-[180px] sm:w-[200px]"
        >
          <div className="w-full aspect-[1/2.1] rounded-[2rem] bg-ink-900 p-1.5 border border-ink-700 shadow-2xl relative">
            <div className="w-full h-full rounded-[1.7rem] bg-white dark:bg-slate-950 overflow-hidden relative">
              <div className="absolute top-0 w-full h-[35%] bg-gradient-to-b from-brand-600 to-indigo-600" />
              <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-cloud-100" />
              <div className="absolute top-[45%] w-full flex flex-col items-center gap-2">
                <div className="w-24 h-3 bg-ink-900 rounded-full" />
                <div className="w-16 h-2 bg-cloud-400 rounded-full" />
              </div>
              <div className="absolute bottom-10 w-full px-6">
                <div className="w-full h-10 rounded-xl bg-ink-900" />
              </div>
            </div>
            
            {/* NFC Wave Animation */}
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-2 border-brand-400 rounded-full pointer-events-none"
            />
          </div>
        </motion.div>
        
        {/* Interaction Cards */}
        <div className="flex flex-col gap-6 relative z-10">
           
           {/* NFC Card */}
           <motion.div 
             animate={{ x: [-20, 0, -20], scale: [0.95, 1.05, 0.95] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="w-40 sm:w-48 p-4 rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-ink-700 relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/10" />
             <div className="flex justify-between items-center mb-6 relative z-10">
               <div className="w-6 h-6 bg-brand-500 rounded flex items-center justify-center text-[10px] text-white font-bold"><NixtapLogo /></div>
               <Share2 size={16} className="text-cloud-400" />
             </div>
             <p className="text-[11px] font-bold text-cloud-300 uppercase tracking-widest relative z-10">Tap to share</p>
           </motion.div>
           
           {/* QR Scanner Card */}
           <motion.div 
             animate={{ x: [10, -5, 10] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="w-40 sm:w-48 p-4 rounded-2xl bg-white dark:bg-slate-950 shadow-xl border border-cloud-200 dark:border-slate-800 flex items-center gap-3"
           >
             <div className="w-12 h-12 bg-cloud-50 dark:bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
               <ScanLine size={20} className="text-ink-900 dark:text-white relative z-10" />
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                 className="absolute left-0 w-full h-[2px] bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-20"
               />
             </div>
             <div>
               <p className="text-[12px] font-bold text-ink-900 dark:text-white">Scan QR</p>
               <p className="text-[10px] text-cloud-500 font-medium">No app needed</p>
             </div>
           </motion.div>

        </div>
      </div>
    </div>
  )
}

// Premium Connect Visual
function ConnectVisual() {
  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[480px] rounded-3xl bg-indigo-50/50 overflow-hidden flex flex-col items-center justify-center border border-indigo-100">
       <div className="absolute inset-0 bg-grid-indigo-900/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
       
       <div className="relative z-10 w-[90%] max-w-[340px] flex flex-col gap-4">
         
         {/* Success Notification */}
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           viewport={{ once: true }}
           className="w-full p-4 rounded-2xl bg-white dark:bg-slate-950 shadow-card-hover border border-cloud-200 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden"
         >
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
           <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
             <UserCheck size={20} />
           </div>
           <div>
             <h4 className="text-[15px] font-bold text-ink-900 dark:text-white">Contact Saved</h4>
             <p className="text-[13px] text-cloud-600 font-medium">Sarah Jenkins added you</p>
           </div>
         </motion.div>

         {/* Connection Line */}
         <div className="h-6 flex justify-center">
            <div className="w-px h-full bg-indigo-200 relative">
               <motion.div 
                 animate={{ y: [0, 24] }}
                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                 className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-indigo-500 rounded-full"
               />
            </div>
         </div>
         
         {/* CRM Sync Active */}
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="w-full p-5 rounded-2xl bg-ink-950 shadow-card border border-ink-800 flex items-center justify-between"
         >
           <div className="flex items-center gap-3 text-white">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <Download size={14} className="text-indigo-400" />
             </div>
             <div>
               <h4 className="text-[14px] font-bold">Salesforce Sync</h4>
               <p className="text-[11px] text-cloud-400">Contact routed successfully</p>
             </div>
           </div>
           <div className="w-12 h-6 rounded-full bg-indigo-500 relative flex items-center px-1 shadow-inner">
             <div className="absolute right-1 w-4 h-4 bg-white dark:bg-slate-950 rounded-full shadow-sm" />
           </div>
         </motion.div>

         {/* Connection Line */}
         <div className="h-6 flex justify-center">
            <div className="w-px h-full bg-indigo-200" />
         </div>
         
         {/* Analytics Graph */}
         <motion.div 
           initial={{ y: 20, opacity: 0 }}
           whileInView={{ y: 0, opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="w-full p-5 rounded-2xl bg-white dark:bg-slate-950 shadow-card-hover border border-cloud-200 dark:border-slate-800"
         >
           <div className="flex justify-between items-center mb-5">
             <span className="text-[13px] font-bold text-ink-900 dark:text-white">Networking ROI</span>
             <span className="text-[12px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md"><TrendingUp size={12} strokeWidth={2.5}/> +32%</span>
           </div>
           <div className="h-20 flex items-end justify-between gap-1.5">
             {[30, 45, 25, 60, 40, 85, 55].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 whileInView={{ height: `${h}%` }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.5 + (i * 0.05), ease: "easeOut" }}
                 className="w-full bg-gradient-to-t from-brand-600 to-indigo-400 rounded-sm relative group cursor-pointer"
               >
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                   {h * 2}
                 </div>
               </motion.div>
             ))}
           </div>
         </motion.div>
         
       </div>
    </div>
  )
}

function StepVisual({ index }) {
  if (index === 0) return <CreateVisual />
  if (index === 1) return <ShareVisual />
  return <ConnectVisual />
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white dark:bg-slate-950">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <SectionHeading
            eyebrow="How it works"
            title="Your digital identity, built in three simple steps."
            subtitle="Create your profile in seconds and share it via QR code, Apple Wallet, or NFC. No app required for your recipients."
          />
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`grid lg:grid-cols-[1fr_450px] gap-12 lg:gap-20 items-center ${
                i % 2 === 1 ? 'lg:grid-cols-[450px_1fr] lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <Reveal>
                <StepVisual index={i} />
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex flex-col max-w-md">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-[16px] font-bold border border-brand-100 shadow-sm">
                      0{i + 1}
                    </span>
                    <span className="text-[14px] font-bold text-brand-600 uppercase tracking-widest">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="text-[32px] sm:text-[36px] font-bold text-ink-900 dark:text-white leading-[1.1] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-5 text-[16px] text-cloud-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

