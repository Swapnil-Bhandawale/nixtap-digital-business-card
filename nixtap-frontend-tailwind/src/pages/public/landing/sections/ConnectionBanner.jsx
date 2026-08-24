import { Mail, MessageSquare, Building2, Calendar, Users, Inbox } from 'lucide-react'
import { motion } from 'framer-motion'
import Reveal from '../components/ui/Reveal.jsx'
import NixtapLogo from '../components/ui/NixtapLogo.jsx'

const orbitIcons = [
  { icon: Mail, position: 'top-0 left-[8%]' },
  { icon: MessageSquare, position: 'top-0 right-[8%]' },
  { icon: Building2, position: 'top-1/2 -translate-y-1/2 left-0' },
  { icon: Calendar, position: 'top-1/2 -translate-y-1/2 right-0' },
  { icon: Users, position: 'bottom-0 left-[8%]' },
  { icon: Inbox, position: 'bottom-0 right-[8%]' },
]

export default function ConnectionBanner() {
  return (
    <section className="py-24 lg:py-28 bg-ink-900 overflow-hidden">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="text-[13px] font-semibold text-brand-400 tracking-wide uppercase">
              Stay connected
            </p>
            <h2 className="mt-3 text-display-md font-bold text-white">
              Remember everyone you meet. Follow up on time, every time.
            </h2>
            <p className="mt-5 text-[16px] text-cloud-400 leading-relaxed max-w-lg">
              Instead of losing touch, Nixtap turns every meeting into a
              lasting connection you can actually remember — synced straight
              into the tools your team already uses.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative h-[280px] flex items-center justify-center">
              <div className="absolute w-[260px] h-[260px] rounded-full border border-white/10" />
              <div className="absolute w-[180px] h-[180px] rounded-full border border-white/10" />

              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center shadow-glow"
              >
                <NixtapLogo showWordmark={false} size={40} />
              </motion.div>

              {orbitIcons.map(({ icon: Icon, position }, i) => (
                <div
                  key={i}
                  className={`absolute ${position} w-11 h-11 rounded-xl bg-white/10 dark:bg-slate-900/10 border border-white/10 flex items-center justify-center text-white backdrop-blur`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

