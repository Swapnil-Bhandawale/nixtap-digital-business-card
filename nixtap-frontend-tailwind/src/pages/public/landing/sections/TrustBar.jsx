import { ShieldCheck, Lock, Star, Globe2 } from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import Marquee from '../components/ui/Marquee.jsx'
import { motion } from 'framer-motion'

// Fictional geometric partner logos for demonstration purposes
const partnerLogos = [
  { name: 'Axiom', svg: <svg viewBox="0 0 100 30" className="h-6 fill-current"><path d="M15 0L30 30H0L15 0ZM40 10h20v10H40V10Zm30-10h10v30H70V0Z"/></svg> },
  { name: 'Nexa', svg: <svg viewBox="0 0 100 30" className="h-6 fill-current"><circle cx="15" cy="15" r="15"/><rect x="40" y="5" width="20" height="20" rx="4"/><polygon points="85,0 100,30 70,30"/></svg> },
  { name: 'Vortex', svg: <svg viewBox="0 0 100 30" className="h-6 fill-current"><path d="M10 5l20 20-20 5V5zm35 0c10 0 15 5 15 15s-5 15-15 15-15-5-15-15S35 5 45 5zm35 0v25h20V5H80z"/></svg> },
  { name: 'Nimbus', svg: <svg viewBox="0 0 100 30" className="h-6 fill-current"><rect x="0" y="10" width="30" height="10" rx="5"/><circle cx="50" cy="15" r="10"/><path d="M75 0h20l-10 30h-20l10-30z"/></svg> },
  { name: 'Solace', svg: <svg viewBox="0 0 100 30" className="h-6 fill-current"><polygon points="15,0 30,15 15,30 0,15"/><path d="M40 0h25v30H40V0Zm40 15a15 15 0 1 0 30 0a15 15 0 1 0 -30 0"/></svg> },
  { name: 'Quanta', svg: <svg viewBox="0 0 100 30" className="h-5 fill-current"><path d="M0 0h10v30H0zm20 10h10v20H20zm20-10h10v30H40zm20 15h10v15H60zm20-15h20v10H80z"/></svg> }
];

export default function TrustBar() {
  return (
    <section className="py-16 border-y border-cloud-200 dark:border-slate-800 bg-gradient-to-b from-white to-cloud-50/50">
      <div className="max-w-container-lg mx-auto container-px">
        <Reveal>
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-center text-[18px] font-semibold text-ink-900 dark:text-white mb-2">
              Built for professionals who never want to lose a connection.
            </h3>
            <p className="text-center text-[14px] text-cloud-500">
              Trusted by teams at forward-thinking companies worldwide.
            </p>
          </div>
        </Reveal>

        {/* Abstract Logos Marquee */}
        <div className="relative flex overflow-hidden group">
          {/* Subtle fade masks */}
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <Marquee speed={35} className="group-hover:[animation-play-state:paused]">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div
                key={i}
                className="flex items-center justify-center mx-10 text-cloud-400 hover:text-ink-800 dark:text-white transition-colors duration-300 cursor-default"
                title={logo.name}
              >
                {logo.svg}
                <span className="ml-3 text-[17px] font-bold tracking-tight">{logo.name}</span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Trust Metrics */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-8 border-t border-cloud-200 dark:border-slate-800/60">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="flex -space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400 drop-shadow-sm group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                ))}
              </div>
              <span className="text-[14px] font-bold text-ink-900 dark:text-white ml-1">
                4.9/5 <span className="font-medium text-cloud-600">rated by users</span>
              </span>
            </div>
            
            <div className="w-1.5 h-1.5 rounded-full bg-cloud-300 hidden md:block" />
            
            <div className="flex items-center gap-2 text-[14px] font-medium text-cloud-700 hover:text-brand-600 transition-colors cursor-default">
              <ShieldCheck size={18} className="text-brand-500" />
              SOC 2 Type II Certified
            </div>
            
            <div className="w-1.5 h-1.5 rounded-full bg-cloud-300 hidden md:block" />

            <div className="flex items-center gap-2 text-[14px] font-medium text-cloud-700 hover:text-brand-600 transition-colors cursor-default">
              <Lock size={16} className="text-brand-500" />
              GDPR Compliant
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-cloud-300 hidden lg:block" />

            <div className="flex items-center gap-2 text-[14px] font-medium text-cloud-700 hover:text-brand-600 transition-colors cursor-default">
              <Globe2 size={16} className="text-brand-500" />
              Available in 170+ Countries
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

