import { Globe, Mail, MessageCircle, Link2, ShieldCheck, Lock, Smartphone, PlayCircle } from 'lucide-react'
import NixtapLogo from '../ui/NixtapLogo.jsx'

const columns = [
  {
    title: 'Solutions',
    links: ['For Individuals', 'For Teams', 'For Enterprise'],
  },
  {
    title: 'Products',
    links: ['Digital Business Card', 'Email Signature', 'Event Lead Capture', 'Shop NFC Cards'],
  },
  {
    title: 'Resources',
    links: ['Pricing', 'Blog', 'FAQ', 'Docs', 'Contact Us'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Trust Report', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Data Privacy Addendum', 'Refund Policy'],
  },
]

const socials = [Globe, Mail, MessageCircle, Link2]

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-cloud-400 pt-20 pb-10">
      <div className="max-w-container-lg mx-auto container-px">
        <div className="grid lg:grid-cols-[1.4fr_repeat(5,1fr)] gap-10">
          <div>
            <NixtapLogo className="[&_span]:text-white" />
            <p className="mt-5 text-[13.5px] leading-relaxed max-w-xs">
              Nixtap is a digital business card platform for individuals and
              teams. Replace paper cards with a secure profile that works on
              iOS and Android, anywhere in the world.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 dark:bg-slate-900/5 hover:bg-white/10 dark:bg-slate-900/10 flex items-center justify-center transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-white uppercase tracking-wide">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[13.5px] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <ShieldCheck size={15} />
              SOC 2 Type II
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <Lock size={15} />
              GDPR
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12.5px] hover:border-white/30 transition-colors">
              <Smartphone size={15} />
              App Store
            </a>
            <a href="#" className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[12.5px] hover:border-white/30 transition-colors">
              <PlayCircle size={15} />
              Google Play
            </a>
          </div>

          <p className="text-[12.5px] text-cloud-500">© 2026 Nixtap</p>
        </div>
      </div>
    </footer>
  )
}

