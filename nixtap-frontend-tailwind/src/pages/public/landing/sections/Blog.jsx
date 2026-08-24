import { motion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { blogPosts } from '../utils/content.js'

export default function Blog() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeading
            eyebrow="Resources"
            title="Blogs, resources, and guides"
            subtitle="Tips, guides, and product updates to help you get the most out of Nixtap."
            align="left"
            className="max-w-xl"
          />
          <Reveal delay={0.1}>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink-900 dark:text-white whitespace-nowrap"
            >
              View all posts
              <ArrowRight size={16} />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.map((post, i) => (
            <Reveal key={post.title} delay={(i % 3) * 0.08}>
              <motion.a
                href="#"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group h-full flex flex-col rounded-2xl border border-cloud-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-soft hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-cloud-100 to-cloud-200 flex items-center justify-center">
                  <FileText size={32} strokeWidth={1.5} className="text-cloud-400" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11.5px] font-semibold text-brand-600 uppercase tracking-wide">
                    {post.tag}
                  </span>
                  <h3 className="mt-2 text-[15.5px] font-bold text-ink-900 dark:text-white leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] text-cloud-600 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-900 dark:text-white">
                    Read more
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

