import { Check, X } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import { comparison } from '../utils/content.js'

export default function Comparison() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container-lg mx-auto container-px">
        <SectionHeading
          eyebrow="Why switch"
          title="Every connection remembered. Every follow-up on time."
          subtitle="See why Nixtap is the better alternative to paper business cards — stop losing contacts and start automating your follow-ups."
        />

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full rounded-3xl border-2 border-brand-500 bg-brand-50/40 p-8">
              <h3 className="text-[18px] font-bold text-ink-900 dark:text-white">With Nixtap</h3>
              <ul className="mt-6 space-y-4">
                {comparison.withNixtap.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] text-ink-800 dark:text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-cloud-200 dark:border-slate-800 bg-cloud-100/50 p-8">
              <h3 className="text-[18px] font-bold text-cloud-600">With traditional tools</h3>
              <ul className="mt-6 space-y-4">
                {comparison.traditional.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-cloud-300 flex items-center justify-center">
                      <X size={12} className="text-white" strokeWidth={3} />
                    </span>
                    <span className="text-[14.5px] text-cloud-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="flex justify-center mt-12">
          <Button variant="primary" size="lg" as="a" href="#get-started">
            Get started
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

