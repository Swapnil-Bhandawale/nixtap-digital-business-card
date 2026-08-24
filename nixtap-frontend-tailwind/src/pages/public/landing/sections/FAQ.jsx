import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import AccordionItem from '../components/ui/AccordionItem.jsx'
import { faqs } from '../utils/content.js'

export default function FAQ() {
  return (
    <section className="py-24 lg:py-32 bg-cloud-100/50">
      <div className="max-w-3xl mx-auto container-px">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Quick answers to the most common questions about the Nixtap platform."
        />

        <Reveal delay={0.1} className="mt-14">
          <div className="rounded-3xl bg-white dark:bg-slate-950 border border-cloud-200 dark:border-slate-800 px-6 sm:px-8">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} {...faq} defaultOpen={i === 0} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

