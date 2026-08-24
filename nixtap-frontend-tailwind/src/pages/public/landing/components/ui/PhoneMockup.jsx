import { Wifi, Mail, Phone, Globe, User, CheckCircle2, ChevronRight, BarChart2, Bell, MoreHorizontal, Contact } from 'lucide-react'
import { motion } from 'framer-motion'
import NixtapLogo from './NixtapLogo.jsx'

/**
 * Premium flagship device mockup (iPhone 17 Pro Max Style)
 */
export default function PhoneMockup({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Dark Titanium Frame */}
      <div className="relative w-[320px] h-[670px] rounded-[3.5rem] p-[3px] bg-gradient-to-b from-[#3a3a3a] via-[#1a1a1a] to-[#3a3a3a] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-[#4a4a4a]/50">
        
        {/* Inner Black Bezel */}
        <div className="w-full h-full rounded-[3.35rem] bg-black p-[10px] relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]">
          
          {/* Edge highlight */}
          <div className="absolute inset-0 rounded-[3.35rem] border border-white/10 pointer-events-none" />
          
          {/* Screen Area */}
          <div className="w-full h-full rounded-[2.75rem] bg-white dark:bg-slate-950 relative overflow-hidden flex flex-col">
            
            {/* Status Bar */}
            <div className="h-12 w-full flex justify-between items-center px-7 pt-3 absolute top-0 z-20">
              <span className="text-[14px] font-semibold text-ink-900 dark:text-white tracking-tight">9:41</span>
              <div className="flex items-center gap-1.5 text-ink-900 dark:text-white">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M1 9.5a1 1 0 011-1h1.5a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1zm4.5-3a1 1 0 011-1h1.5a1 1 0 011 1v4a1 1 0 01-1 1H6.5a1 1 0 01-1-1v-4zm4.5-3a1 1 0 011-1h1.5a1 1 0 011 1v7a1 1 0 01-1 1H11a1 1 0 01-1-1v-7z"/></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5a7.5 7.5 0 00-5.3 2.2L1.6 3.6a9 9 0 0112.8 0l-1.1 1.1A7.5 7.5 0 008 2.5zm0 3a4.5 4.5 0 00-3.2 1.3L3.7 5.7a6 6 0 018.6 0L11.2 6.8A4.5 4.5 0 008 5.5zm0 3a1.5 1.5 0 00-1 2.6V11h2v.1A1.5 1.5 0 008 8.5z"/></svg>
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="17" height="8" rx="2.5"/><path d="M21 5v2" strokeWidth="2" strokeLinecap="round"/><rect x="2.5" y="3.5" width="14" height="5" rx="1" fill="currentColor" stroke="none"/></svg>
              </div>
            </div>

            {/* Dynamic Island Cutout */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[116px] h-[32px] bg-black rounded-full z-20 flex items-center justify-between px-2 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
               <div className="w-[10px] h-[10px] rounded-full bg-white/10 dark:bg-slate-900/10 ml-1.5" />
               <div className="w-[10px] h-[10px] rounded-full bg-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.6)] mr-1.5" />
            </div>

            {/* Screen content */}
            <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-950 overflow-y-auto hide-scrollbar">
              
              {/* Premium Gradient Header */}
              <div className="h-[200px] w-full relative shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] to-[#06b6d4]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />
              </div>

              {/* Card Body */}
              <div className="flex-1 bg-white dark:bg-slate-950 -mt-8 rounded-t-[32px] relative px-6 pt-0 flex flex-col shadow-[0_-8px_20px_rgba(0,0,0,0.04)] z-10 pb-[100px]">
                
                {/* Avatar */}
                <div className="-mt-12 mb-3 relative z-10 self-start">
                  <div className="w-[96px] h-[96px] rounded-[28px] bg-white dark:bg-slate-950 p-[4px] shadow-md relative">
                    <div className="w-full h-full rounded-[24px] overflow-hidden bg-cloud-100">
                       <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute top-[-2px] right-[-2px] w-[26px] h-[26px] bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-sm">
                       <CheckCircle2 size={22} className="text-blue-500 fill-blue-50" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-6 mt-1">
                  <h2 className="text-[22px] font-bold text-ink-900 dark:text-white tracking-tight flex items-center gap-1.5">
                    Aarav Mehta
                  </h2>
                  <p className="text-[13px] text-cloud-500 mt-1 font-medium">Product Designer &middot; Nixtap</p>
                </div>

                {/* Social/Contact Grid */}
                <div className="flex gap-3 mb-6">
                  {[
                    { icon: Phone },
                    { icon: Mail },
                    { icon: Globe },
                    { icon: User },
                  ].map((Item, i) => (
                    <div key={i} className="w-[42px] h-[42px] rounded-full bg-cloud-50 dark:bg-slate-800 flex items-center justify-center border border-cloud-100 dark:border-slate-800 hover:bg-cloud-100 transition-colors cursor-pointer shadow-sm">
                      <Item.icon size={18} className="text-ink-800 dark:text-white" strokeWidth={2} />
                    </div>
                  ))}
                </div>

                {/* Primary CTA */}
                <button className="w-full h-[52px] rounded-[20px] bg-ink-950 flex items-center justify-center gap-2.5 text-white font-semibold text-[15px] shadow-lg shadow-ink-900/10 hover:scale-[1.02] transition-transform mb-8">
                  <Wifi size={18} className="rotate-90" strokeWidth={2.5} />
                  Save contact
                </button>

                {/* Stats row */}
                <div className="flex justify-between items-center px-3 mb-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[17px] font-bold text-ink-900 dark:text-white">248</span>
                    <span className="text-[11px] text-cloud-500 font-medium mt-0.5">Shares</span>
                  </div>
                  <div className="w-px h-6 bg-cloud-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[17px] font-bold text-ink-900 dark:text-white">57</span>
                    <span className="text-[11px] text-cloud-500 font-medium mt-0.5">Connections</span>
                  </div>
                  <div className="w-px h-6 bg-cloud-200" />
                  <div className="flex flex-col items-center">
                    <span className="text-[17px] font-bold text-ink-900 dark:text-white">4.9</span>
                    <span className="text-[11px] text-cloud-500 font-medium mt-0.5">Rating</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-cloud-100 mb-6" />

                {/* Recent Activity */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-cloud-500 font-medium mb-1">Last connected</p>
                    <p className="text-[13px] font-bold text-ink-900 dark:text-white">Today at 10:42 AM</p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2">
                       <img src="https://i.pravatar.cc/150?img=11" className="w-[26px] h-[26px] rounded-full border-2 border-white bg-cloud-100 shadow-sm" />
                       <img src="https://i.pravatar.cc/150?img=12" className="w-[26px] h-[26px] rounded-full border-2 border-white bg-cloud-100 shadow-sm" />
                       <img src="https://i.pravatar.cc/150?img=13" className="w-[26px] h-[26px] rounded-full border-2 border-white bg-cloud-100 shadow-sm" />
                    </div>
                    <span className="text-[11px] font-bold text-cloud-500">+12</span>
                  </div>
                </div>
              </div>
              
            </div>
            
            {/* Bottom Navigation Bar */}
            <div className="absolute bottom-0 w-full h-[88px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-cloud-100 dark:border-slate-800 z-30 flex justify-between px-7 pt-4 pb-6">
               <div className="flex flex-col items-center gap-1.5 text-blue-600">
                 <Contact size={24} className="fill-blue-100" strokeWidth={2} />
                 <span className="text-[10px] font-bold">Card</span>
               </div>
               <div className="flex flex-col items-center gap-1.5 text-cloud-400">
                 <BarChart2 size={24} strokeWidth={2} />
                 <span className="text-[10px] font-medium">Analytics</span>
               </div>
               <div className="flex flex-col items-center gap-1.5 text-cloud-400">
                 <Bell size={24} strokeWidth={2} />
                 <span className="text-[10px] font-medium">Activity</span>
               </div>
               <div className="flex flex-col items-center gap-1.5 text-cloud-400">
                 <MoreHorizontal size={24} strokeWidth={2} />
                 <span className="text-[10px] font-medium">More</span>
               </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-ink-950 rounded-full z-40" />
          </div>
        </div>
        
        {/* Hardware Buttons */}
        <div className="absolute top-32 -left-[3px] w-[3px] h-[30px] bg-[#3a3a3a] rounded-l-md border-l border-y border-[#5a5a5a]" />
        <div className="absolute top-48 -left-[3px] w-[3px] h-[50px] bg-[#3a3a3a] rounded-l-md border-l border-y border-[#5a5a5a]" />
        <div className="absolute top-[260px] -left-[3px] w-[3px] h-[50px] bg-[#3a3a3a] rounded-l-md border-l border-y border-[#5a5a5a]" />
        <div className="absolute top-48 -right-[3px] w-[3px] h-[70px] bg-[#3a3a3a] rounded-r-md border-r border-y border-[#5a5a5a]" />
      </div>
    </div>
  )
}

