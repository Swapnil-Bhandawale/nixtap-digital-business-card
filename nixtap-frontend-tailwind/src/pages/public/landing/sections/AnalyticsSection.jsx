import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, TrendingUp, Users, ScanLine, BarChart2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'

export default function AnalyticsSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden border-t border-cloud-200 dark:border-slate-800">
      
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-brand-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-container-lg mx-auto container-px flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Text Content */}
        <div className="flex-1 max-w-xl">
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                <BarChart2 size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-brand-600 uppercase tracking-widest">
                Actionable Insights
              </span>
            </div>
            <h2 className="text-[36px] sm:text-[44px] font-bold text-ink-900 dark:text-white leading-[1.1] tracking-tight">
              See exactly how <br className="hidden sm:block" /> your network grows.
            </h2>
            <p className="mt-6 text-[16.5px] text-cloud-600 leading-relaxed">
              Stop wondering if your business card actually worked. Nixtap gives you real-time analytics on profile views, contact saves, and link clicks so you can measure your networking ROI.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                { label: 'Track card views across multiple platforms' },
                { label: 'Monitor contact saves and direct connections' },
                { label: 'Analyze which links get the most engagement' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[15px] font-medium text-ink-800 dark:text-white">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  {item.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <Link to="/register">
              <Button variant="primary" size="lg" className="bg-ink-900 hover:bg-ink-950 shadow-lg shadow-ink-900/10">
                Start tracking now
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* Analytics Visuals */}
        <div className="flex-1 w-full relative h-[450px] sm:h-[550px] flex items-center justify-center lg:justify-end">
           
           <motion.div 
             style={{ y: y1 }}
             className="w-full max-w-[400px] p-6 bg-white dark:bg-slate-950 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-cloud-200 dark:border-slate-800 relative z-10"
           >
             <div className="flex justify-between items-start mb-8">
               <div>
                 <p className="text-[13px] font-bold text-cloud-500 uppercase tracking-wider mb-1">Total Views</p>
                 <h4 className="text-[32px] font-bold text-ink-900 dark:text-white leading-none">12,482</h4>
               </div>
               <div className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 flex items-center gap-1.5 text-[12px] font-bold">
                 <TrendingUp size={14} strokeWidth={2.5} />
                 +24.8%
               </div>
             </div>

             {/* Line Chart Animation */}
             <div className="w-full h-32 relative flex items-end">
               
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                 {/* Grid lines */}
                 <line x1="0" y1="25" x2="400" y2="25" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                 <line x1="0" y1="100" x2="400" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                 
                 {/* Chart Line */}
                 <motion.path
                   d="M0 80 Q 40 70 80 50 T 160 40 T 240 60 T 320 20 T 400 10"
                   fill="none"
                   stroke="url(#chart-gradient)"
                   strokeWidth="4"
                   strokeLinecap="round"
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                 />

                 {/* Gradient definition */}
                 <defs>
                   <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#3b82f6" />
                     <stop offset="100%" stopColor="#6366f1" />
                   </linearGradient>
                 </defs>
               </svg>
               
               {/* Data Points */}
               <motion.div 
                 initial={{ scale: 0, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 1.5 }}
                 className="absolute right-0 top-[10%] w-3 h-3 bg-white dark:bg-slate-950 border-2 border-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] translate-x-1.5 -translate-y-1.5"
               />
             </div>

           </motion.div>

           {/* Floating Floating Metric 1 */}
           <motion.div
             style={{ y: y2 }}
             className="absolute left-0 lg:left-[-15%] top-10 lg:top-[15%] z-20"
           >
             <motion.div
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl shadow-xl border border-cloud-200 dark:border-slate-800 flex items-center gap-4"
             >
               <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                 <Users size={20} strokeWidth={2} />
               </div>
               <div>
                 <p className="text-[20px] font-bold text-ink-900 dark:text-white leading-none">1,284</p>
                 <p className="text-[12px] font-medium text-cloud-500 mt-1">Connections made</p>
               </div>
             </motion.div>
           </motion.div>

           {/* Floating Floating Metric 2 */}
           <motion.div
             style={{ y: y2 }}
             className="absolute right-0 lg:right-[-5%] bottom-10 lg:bottom-[15%] z-20"
           >
             <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-2xl shadow-xl border border-cloud-200 dark:border-slate-800 flex items-center gap-4"
             >
               <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                 <ScanLine size={20} strokeWidth={2} />
               </div>
               <div>
                 <p className="text-[20px] font-bold text-ink-900 dark:text-white leading-none">8,492</p>
                 <p className="text-[12px] font-medium text-cloud-500 mt-1">Total Scans & Taps</p>
               </div>
             </motion.div>
           </motion.div>

        </div>

      </div>
    </section>
  )
}

