import { Star, Quote, MessageCircle } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Marquee from '../components/ui/Marquee.jsx'
import { testimonials } from '../utils/content.js'

function TestimonialCard({ name, role, quote, index }) {
  return (
    <div className="w-[340px] sm:w-[400px] shrink-0 rounded-3xl border border-cloud-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-card-hover hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group cursor-pointer">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <MessageCircle size={18} className="text-cloud-300 group-hover:text-sky-400 transition-colors" />
        </div>
        
        <p className="text-[15px] sm:text-[16px] text-ink-900 dark:text-white leading-relaxed font-medium mb-8">
          "{quote}"
        </p>
        
        <div className="flex items-center gap-4 border-t border-cloud-100 dark:border-slate-800 pt-6">
          <div className="w-12 h-12 rounded-full border border-cloud-200 dark:border-slate-800 overflow-hidden bg-cloud-50 dark:bg-slate-800 shrink-0">
             <img src={`https://i.pravatar.cc/150?img=${index + 20}`} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-ink-900 dark:text-white">{name}</p>
            <p className="text-[12px] font-medium text-cloud-500 mt-0.5">{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  // Use fictional testimonials from content.js
  const firstRow = testimonials.slice(0, 3)
  const secondRow = testimonials.slice(3, 6)

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-cloud-50 overflow-hidden relative border-t border-cloud-200 dark:border-slate-800">
      
      <div className="max-w-container-lg mx-auto container-px relative z-10 text-center mb-16">
        <Reveal>
          <p className="text-[13px] font-bold text-brand-600 uppercase tracking-widest mb-3">
            Real Stories
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-bold text-ink-900 dark:text-white leading-tight">
            Trusted by the best.
          </h2>
          <p className="mt-5 text-[16px] text-cloud-600 max-w-2xl mx-auto leading-relaxed">
            See why founders, sales teams, and creatives are switching to Nixtap for their networking needs. (Note: Examples for demonstration)
          </p>
        </Reveal>
      </div>

      <div className="relative flex flex-col gap-6 w-full">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <Marquee gap="gap-6" speed={40} className="hover:[animation-play-state:paused] group">
          {[...firstRow, ...firstRow].map((item, i) => (
             <TestimonialCard key={i} {...item} index={i} />
          ))}
        </Marquee>

        <Marquee gap="gap-6" speed={35} reverse className="hover:[animation-play-state:paused] group mt-2">
          {[...secondRow, ...secondRow].map((item, i) => (
             <TestimonialCard key={i} {...item} index={i + 10} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}

