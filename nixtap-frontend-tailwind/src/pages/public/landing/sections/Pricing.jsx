import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import { pricingPlans } from '../utils/content.js'

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      
      {/* Soft background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-container-lg mx-auto container-px relative z-10">
        <SectionHeading
          eyebrow="Simple Pricing"
          title="Start for free. Scale when you need to."
          subtitle="No hidden fees. No credit card required to start. Choose the plan that fits your networking needs."
        />

        <div className="mt-16 grid lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1} className={`h-full ${plan.featured ? 'lg:-my-6 z-10 relative' : ''}`}>
              <div
                className={`h-full flex flex-col rounded-3xl p-[2px] transition-transform duration-300 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-brand-500 to-indigo-500 shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:scale-[1.02]'
                    : 'bg-cloud-200 shadow-sm hover:shadow-card hover:-translate-y-1'
                }`}
              >
                <div className={`h-full flex flex-col rounded-[22px] p-8 ${plan.featured ? 'bg-ink-950' : 'bg-white dark:bg-slate-950'}`}>
                  
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-brand-500 to-indigo-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full shadow-md tracking-wide uppercase">
                        Most popular
                      </div>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className={`text-[20px] font-bold ${plan.featured ? 'text-white' : 'text-ink-900 dark:text-white'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-[14px] mt-2 ${plan.featured ? 'text-cloud-400' : 'text-cloud-500'} min-h-[40px]`}>
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className={`text-[44px] font-extrabold tracking-tight ${plan.featured ? 'text-white' : 'text-ink-900 dark:text-white'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-[14px] font-medium ${plan.featured ? 'text-cloud-500' : 'text-cloud-500'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <Link to="/register" className="w-full block">
                    <button
                      className={`w-full h-12 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center ${
                        plan.featured
                          ? 'bg-white dark:bg-slate-950 text-ink-900 dark:text-white hover:bg-cloud-50 dark:bg-slate-800 shadow-md hover:scale-[1.02]'
                          : 'bg-cloud-50 dark:bg-slate-800 text-ink-900 dark:text-white border border-cloud-200 dark:border-slate-800 hover:bg-cloud-100 hover:border-cloud-300 dark:border-slate-800'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>

                  <div className={`w-full h-px mt-8 mb-6 ${plan.featured ? 'bg-ink-800' : 'bg-cloud-100'}`} />

                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check size={18} className={`shrink-0 mt-0.5 ${plan.featured ? 'text-brand-400' : 'text-brand-600'}`} strokeWidth={2.5} />
                        <span className={`text-[14.5px] leading-snug ${plan.featured ? 'text-cloud-300' : 'text-ink-700 dark:text-white'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

