import { ArrowUpRight } from 'lucide-react'
import Reveal from '../components/ui/Reveal.jsx'
import Counter from '../components/ui/Counter.jsx'
import Button from '../components/ui/Button.jsx'
import { stats } from '../utils/content.js'

export default function Stats() {
  return (
    <section className="py-24 lg:py-32 bg-ink-900 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-container-lg mx-auto container-px">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-display-md font-bold text-white max-w-2xl">
              Millions of shares, powered by the digital business card for
              professionals.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Button variant="accent" size="lg" as="a" href="#get-started">
                Get started
                <ArrowUpRight size={18} strokeWidth={2.4} />
              </Button>
              <Button variant="outline" size="lg" as="a" href="#" className="!bg-transparent !text-white !border-white/20 hover:!border-white/50">
                For teams
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <p className="text-[42px] sm:text-[52px] font-bold text-white tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-[14.5px] text-cloud-400">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
