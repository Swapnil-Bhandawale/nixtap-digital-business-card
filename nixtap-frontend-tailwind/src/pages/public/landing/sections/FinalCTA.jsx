import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../components/ui/Reveal.jsx'
import PhoneMockup from '../components/ui/PhoneMockup.jsx'

export default function FinalCTA() {
  const containerRef = useRef(null)
  
  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05])

  // Simple floating particles generator
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section 
      id="get-started" 
      ref={containerRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-ink-950"
    >
      {/* Deep Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-brand-900 to-indigo-900 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.3),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJub25lIi8+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20 dark:bg-slate-900/20 pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -100], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}

      <div className="max-w-container-lg mx-auto container-px relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="text-center lg:text-left">
            <Reveal>
              <h2 className="text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold text-white leading-[1.05] tracking-tight">
                Stop handing out cards.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-indigo-300">
                  Start building connections.
                </span>
              </h2>
              <p className="mt-6 text-[18px] text-cloud-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join thousands of professionals upgrading their network with Nixtap. Free forever for individuals, built to scale for teams.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto block group">
                  <button className="w-full h-14 px-8 rounded-full bg-white dark:bg-slate-950 text-ink-900 dark:text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-[1.02] transition-all duration-300">
                    Create your free card
                    <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </Link>
                <Link to="/register" className="w-full sm:w-auto block">
                  <button className="w-full h-14 px-8 rounded-full bg-transparent border border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 dark:bg-slate-900/10 transition-colors duration-300">
                    Explore for teams
                  </button>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex justify-center relative">
            
            {/* Ambient glows behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/40 rounded-full blur-[80px]" />
            
            {/* Parallax Phone Mockup */}
            <motion.div style={{ y: y1, scale }} className="relative z-10 scale-[0.85] sm:scale-100 origin-bottom">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <PhoneMockup />
                
                {/* Floating elements attached to phone */}
                <motion.div
                   animate={{ y: [0, 20, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                   className="absolute -left-10 bottom-20 w-24 h-24 bg-gradient-to-br from-brand-400 to-indigo-500 rounded-2xl shadow-2xl rotate-12 flex items-center justify-center border border-white/20"
                >
                   <div className="text-white text-4xl font-bold tracking-tighter">N</div>
                </motion.div>

              </motion.div>
            </motion.div>
          </Reveal>

        </div>
      </div>
      
      {/* Footer transition curve */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent opacity-5 pointer-events-none" />
    </section>
  )
}

