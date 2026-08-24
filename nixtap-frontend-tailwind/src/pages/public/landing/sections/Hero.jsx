import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, PlayCircle, QrCode, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import PhoneMockup from '../components/ui/PhoneMockup.jsx'
import NixtapLogo from '../components/ui/NixtapLogo.jsx'
import Reveal from '../components/ui/Reveal.jsx'

const EASE = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay },
  }),
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const y2 = useTransform(scrollY, [0, 500], [0, -50])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative overflow-hidden pt-[160px] pb-24 lg:pt-[200px] lg:pb-32 bg-white dark:bg-slate-950">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-brand-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid-cloud-200/40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="max-w-container-lg mx-auto container-px flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* Left: Text Block */}
        <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left z-10 w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-cloud-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur px-4 py-1.5 text-[12px] font-bold tracking-wide text-brand-600 uppercase shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Your Digital Identity
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="mt-6 text-[48px] sm:text-[64px] lg:text-[72px] font-extrabold text-ink-900 dark:text-white leading-[1.05] tracking-tight"
          >
            One tap. <br />
            One link. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              Your whole identity.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="mt-6 text-[18px] text-cloud-600 leading-relaxed max-w-[480px]"
          >
            Create your digital business card, share it instantly with QR or NFC, and turn every introduction into a lasting connection.
          </motion.p>

          <Reveal
            y={15}
            custom={0.3}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 h-14 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all duration-300 group">
                Create your card
                <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 h-14 rounded-full border border-cloud-300 dark:border-slate-800 bg-white dark:bg-slate-950 text-ink-800 dark:text-white font-semibold flex items-center justify-center gap-2 hover:bg-cloud-50 dark:bg-slate-800 transition-colors duration-300">
              <PlayCircle size={19} strokeWidth={2} className="text-cloud-500" />
              See how it works
            </a>
          </Reveal>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.4}
            className="mt-6 flex items-center gap-2 text-[13px] font-medium text-cloud-500"
          >
            <CheckCircle2 size={16} className="text-green-500" />
            Free forever for individuals &middot; No credit card required
          </motion.div>
        </div>

        {/* Right: Product Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="flex-1 relative flex items-center justify-center w-full min-h-[550px] sm:min-h-[650px] lg:min-h-[750px] mt-10 lg:mt-0 overflow-visible"
          style={{ perspective: 1500 }}
        >
          {/* Scaled 3D Scene Container for perfect responsive behavior */}
          <div className="relative w-[500px] h-[700px] flex items-center justify-center scale-[0.65] xs:scale-[0.7] sm:scale-[0.85] lg:scale-100 origin-center">
            
            {/* Main Phone Mockup */}
            <motion.div 
              style={{ 
                x: mousePosition.x * -0.1, 
                y: mousePosition.y * -0.1,
                rotateY: -4,
                rotateX: 1.5,
                rotateZ: -1,
              }}
              className="relative z-10 mr-[100px]"
            >
              <PhoneMockup />
            </motion.div>

            {/* Floating Notifications (Right side stack) */}
            <div className="absolute right-[0px] top-[100px] z-20 flex flex-col gap-4">
              
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                className="px-4 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[18px] border border-white flex items-center gap-4 w-[230px]"
              >
                <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink-900 dark:text-white tracking-tight leading-snug">Contact saved</p>
                  <p className="text-[11px] font-medium text-cloud-500 leading-snug mt-0.5">Synced to CRM</p>
                </div>
                <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="px-4 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[18px] border border-white flex items-center gap-4 w-[230px] ml-8"
              >
                <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                  <div className="flex items-center justify-center w-full h-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink-900 dark:text-white tracking-tight leading-snug">Profile viewed</p>
                  <p className="text-[11px] font-medium text-cloud-500 leading-snug mt-0.5">2 min ago</p>
                </div>
                <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="px-4 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.06)] rounded-[18px] border border-white flex items-center gap-4 w-[230px] ml-16"
              >
                <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(59,130,246,0.2)]">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-ink-900 dark:text-white tracking-tight leading-snug">Connection added</p>
                  <p className="text-[11px] font-medium text-cloud-500 leading-snug mt-0.5">Great meeting you!</p>
                </div>
                <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              </motion.div>
            </div>

            {/* Floating NFC Card (Bottom Right) */}
            <motion.div
              style={{ 
                x: mousePosition.x * 0.2, 
                y: mousePosition.y * 0.2,
                rotateY: 8,
                rotateX: 6,
                rotateZ: 4
              }}
              className="absolute right-[40px] bottom-[30px] z-30"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
                className="w-[210px] h-[132px] bg-[#1a1c20] rounded-[16px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
              >
                {/* Subtle waves texture & gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-20" />
                <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDFzPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzVmN2FmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNWY3YWZmIiBzdG9wLW9wYWNpdHk9IjEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCA1MCBRIDI1IDI1IDUwIDUwIFQgMTAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-cover" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-8 h-8 rounded-[6px] bg-[#2563eb] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                    N
                  </div>
                  <div className="text-white/40">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a10 10 0 0 1 16 0"/><path d="M8 17a4 4 0 0 1 8 0"/><path d="M12 20h.01"/></svg>
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-[10.5px] font-medium text-[#8892b0] tracking-[0.2em] uppercase">Tap to connect</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

