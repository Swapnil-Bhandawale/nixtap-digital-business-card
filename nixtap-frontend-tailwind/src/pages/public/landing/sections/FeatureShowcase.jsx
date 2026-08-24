import { motion } from 'framer-motion'
import { ArrowUpRight, Zap, RefreshCcw, ScanEye, Database, BellRing, Tags } from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import { Link } from 'react-router-dom'

export default function FeatureShowcase() {
  return (
    <section className="py-24 lg:py-32 bg-cloud-50 dark:bg-slate-800 relative overflow-hidden border-t border-cloud-200 dark:border-slate-800">
      <div className="absolute inset-0 bg-grid-cloud-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      <div className="max-w-container-lg mx-auto container-px relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 text-center lg:text-left mb-16">
          <Reveal className="max-w-xl mx-auto lg:mx-0">
            <p className="text-[13px] font-bold text-indigo-600 uppercase tracking-widest mb-3">
              Powerful Workflows
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold text-ink-900 dark:text-white leading-tight">
              Networking on autopilot.
            </h2>
            <p className="mt-4 text-[16px] text-cloud-600 leading-relaxed">
              Every connection is organized instantly. Let Nixtap handle the busywork so you can focus on building relationships.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                Explore features
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 - Large Auto-enrichment */}
          <Reveal className="md:col-span-2" delay={0.1}>
            <div className="h-[380px] rounded-3xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 shadow-card-hover overflow-hidden flex flex-col md:flex-row group relative">
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-[20px] font-bold text-ink-900 dark:text-white mb-2">Auto-enrichment</h3>
                <p className="text-[15px] text-cloud-600 leading-relaxed">
                  Add an email address and Nixtap automatically pulls in their LinkedIn profile, job title, and company details instantly.
                </p>
              </div>
              <div className="flex-1 bg-gradient-to-br from-indigo-50 to-cloud-100 flex items-center justify-center p-6 relative overflow-hidden">
                <motion.div 
                  className="w-full max-w-[280px] bg-white dark:bg-slate-950 rounded-xl shadow-lg p-4 border border-cloud-200 dark:border-slate-800"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cloud-200 animate-pulse" />
                    <div>
                      <div className="w-24 h-3 bg-cloud-200 rounded mb-2" />
                      <div className="w-32 h-2 bg-cloud-200 rounded" />
                    </div>
                  </div>
                  <motion.div 
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    className="h-1 bg-indigo-500 rounded-full mb-3"
                  />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center justify-center rounded">LinkedIn</div>
                    <div className="h-6 w-16 bg-brand-50 text-brand-600 text-[10px] font-bold flex items-center justify-center rounded">Company</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Reveal>

          {/* Feature 2 - Small CRM Sync */}
          <Reveal delay={0.2}>
            <div className="h-[380px] rounded-3xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 shadow-card-hover p-8 flex flex-col group relative overflow-hidden">
               <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                 <Database size={24} />
               </div>
               <h3 className="text-[20px] font-bold text-ink-900 dark:text-white mb-2">One-click CRM Sync</h3>
               <p className="text-[15px] text-cloud-600 leading-relaxed mb-8">
                 Push contacts directly into Salesforce, HubSpot, and Pipedrive.
               </p>
               
               <div className="mt-auto h-32 bg-cloud-50 dark:bg-slate-800 rounded-xl border border-cloud-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-brand-50 transition-colors">
                  <motion.div
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <RefreshCcw size={32} className="text-brand-500 opacity-50" />
                  </motion.div>
               </div>
            </div>
          </Reveal>

          {/* Feature 3 - Small Paper Scanner */}
          <Reveal delay={0.3}>
            <div className="h-[380px] rounded-3xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 shadow-card-hover p-8 flex flex-col group relative overflow-hidden">
               <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6">
                 <ScanEye size={24} />
               </div>
               <h3 className="text-[20px] font-bold text-ink-900 dark:text-white mb-2">AI Paper Scanner</h3>
               <p className="text-[15px] text-cloud-600 leading-relaxed mb-8">
                 Convert physical paper business cards into digital contacts instantly.
               </p>
               
               <div className="mt-auto h-32 bg-cloud-50 dark:bg-slate-800 rounded-xl border border-cloud-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:bg-accent-50 transition-colors">
                  <div className="w-24 h-16 bg-white dark:bg-slate-950 border-2 border-cloud-300 dark:border-slate-800 rounded shadow-sm relative overflow-hidden">
                     <motion.div 
                       animate={{ top: ['0%', '100%', '0%'] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                       className="absolute left-0 w-full h-1 bg-accent-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                     />
                  </div>
               </div>
            </div>
          </Reveal>

          {/* Feature 4 - Large Follow Ups */}
          <Reveal className="md:col-span-2" delay={0.4}>
            <div className="h-[380px] rounded-3xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 shadow-card-hover overflow-hidden flex flex-col md:flex-row group relative">
              <div className="flex-1 bg-gradient-to-br from-rose-50 to-cloud-100 flex items-center justify-center p-6 relative overflow-hidden order-2 md:order-1">
                <motion.div 
                  className="w-full max-w-[280px] bg-white dark:bg-slate-950 rounded-xl shadow-lg border border-cloud-200 dark:border-slate-800 overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="p-3 bg-rose-50 border-b border-rose-100 flex items-center gap-2">
                    <BellRing size={14} className="text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-widest">Follow up reminder</span>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-cloud-200" />
                      <div>
                        <div className="w-20 h-2 bg-ink-800 rounded mb-1" />
                        <div className="w-16 h-2 bg-cloud-400 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-16 bg-cloud-50 dark:bg-slate-800 rounded border border-cloud-100 dark:border-slate-800 p-2">
                      <div className="w-3/4 h-1.5 bg-cloud-300 rounded mb-1.5" />
                      <div className="w-1/2 h-1.5 bg-cloud-300 rounded" />
                    </div>
                    <div className="mt-3 w-full h-8 bg-rose-500 rounded text-white text-[11px] font-bold flex items-center justify-center">
                      Send Email
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center order-1 md:order-2">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                  <BellRing size={24} />
                </div>
                <h3 className="text-[20px] font-bold text-ink-900 dark:text-white mb-2">Automated follow-ups</h3>
                <p className="text-[15px] text-cloud-600 leading-relaxed">
                  Trigger personalized email or SMS follow-ups the moment you connect. Never let a warm lead go cold again.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

