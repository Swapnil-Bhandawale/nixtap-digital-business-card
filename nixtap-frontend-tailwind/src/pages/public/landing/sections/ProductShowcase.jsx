import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3, Users, Settings, Zap } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function ProductShowcase() {
  return (
    <section className="py-24 lg:py-32 bg-ink-950 relative overflow-hidden">
      {/* Dark premium atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="max-w-container-lg mx-auto container-px relative z-10 text-center mb-16">
        <Reveal>
          <p className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-3">
            More than just a card
          </p>
          <h2 className="text-[32px] sm:text-[48px] font-bold text-white leading-tight">
            Everything your business <br className="hidden sm:block" /> card should have been.
          </h2>
          <p className="mt-5 text-[16px] text-cloud-300 max-w-2xl mx-auto leading-relaxed">
            Manage your entire network from a powerful desktop dashboard. Track analytics, export leads to your CRM, and manage teams seamlessly.
          </p>
        </Reveal>
      </div>

      {/* Layered Dashboard Mockup */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10 mt-20">
         <Reveal delay={0.2}>
           <div className="w-full aspect-[16/10] sm:aspect-[16/9] bg-ink-900 rounded-2xl sm:rounded-[2rem] border border-ink-800 shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group">
             
             {/* Browser Bar */}
             <div className="h-10 sm:h-12 bg-ink-950 border-b border-ink-800 flex items-center px-4 gap-4">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                 <div className="w-3 h-3 rounded-full bg-green-500/80" />
               </div>
               <div className="flex-1 max-w-md h-6 sm:h-8 bg-ink-900 rounded-md border border-ink-800 flex items-center justify-center">
                 <span className="text-[11px] sm:text-[12px] text-cloud-500 flex items-center gap-2">
                   <LockIcon /> app.nixtap.online
                 </span>
               </div>
             </div>

             {/* Dashboard Layout */}
             <div className="flex-1 flex overflow-hidden">
               {/* Sidebar */}
               <div className="w-48 sm:w-60 border-r border-ink-800 bg-ink-900/50 p-4 hidden sm:flex flex-col gap-2">
                 <div className="h-8 w-24 bg-ink-800 rounded mb-4" />
                 <SidebarItem icon={<Users size={16}/>} text="Contacts" active />
                 <SidebarItem icon={<BarChart3 size={16}/>} text="Analytics" />
                 <SidebarItem icon={<Zap size={16}/>} text="Integrations" />
                 <SidebarItem icon={<Settings size={16}/>} text="Settings" />
               </div>

               {/* Main Content Area */}
               <div className="flex-1 p-4 sm:p-8 bg-ink-900 relative overflow-hidden">
                 
                 <div className="flex justify-between items-end mb-8">
                   <div>
                     <div className="w-32 h-6 bg-ink-800 rounded mb-2" />
                     <div className="w-48 h-4 bg-ink-800/50 rounded" />
                   </div>
                   <div className="w-24 h-8 bg-brand-600 rounded-lg" />
                 </div>

                 {/* Grid Content */}
                 <div className="grid grid-cols-3 gap-4 sm:gap-6">
                   <div className="col-span-3 sm:col-span-2 h-48 bg-ink-800/50 rounded-xl border border-ink-800 p-4">
                     {/* Fake Graph */}
                     <div className="w-full h-full flex items-end justify-between gap-2 opacity-50">
                        {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="w-full bg-brand-500 rounded-t-sm"
                          />
                        ))}
                     </div>
                   </div>
                   <div className="col-span-3 sm:col-span-1 h-48 bg-ink-800/50 rounded-xl border border-ink-800" />
                   
                   <div className="col-span-1 h-32 bg-ink-800/50 rounded-xl border border-ink-800" />
                   <div className="col-span-1 h-32 bg-ink-800/50 rounded-xl border border-ink-800" />
                   <div className="col-span-1 h-32 bg-ink-800/50 rounded-xl border border-ink-800" />
                 </div>

                 {/* Animated Cursor */}
                 <motion.div 
                   animate={{ x: [0, 250, 100, 300, 0], y: [0, -100, 50, -50, 0] }}
                   transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute top-1/2 left-1/4 z-50 pointer-events-none drop-shadow-xl"
                 >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35a.5.5 0 00-.85.35z" fill="white"/>
                      <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.42c.45 0 .67-.54.35-.85L6.35 3.35a.5.5 0 00-.85.35z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                 </motion.div>

               </div>
             </div>

           </div>
         </Reveal>
      </div>
      
      <div className="mt-16 flex justify-center relative z-10">
        <Reveal delay={0.4}>
          <Link to="/register">
            <Button variant="primary" size="lg" className="bg-white dark:bg-slate-950 text-ink-900 dark:text-white hover:bg-cloud-50 dark:bg-slate-800">
              Get started free
              <ArrowUpRight size={18} strokeWidth={2.4} />
            </Button>
          </Link>
        </Reveal>
      </div>

    </section>
  )
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  )
}

function SidebarItem({ icon, text, active = false }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-default ${active ? 'bg-brand-500/10 text-brand-400' : 'text-cloud-400 hover:bg-ink-800 hover:text-white'}`}>
      {icon}
      {text}
    </div>
  )
}

