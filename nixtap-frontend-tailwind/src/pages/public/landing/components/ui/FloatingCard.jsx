import { Wifi } from 'lucide-react'
import NixtapLogo from './NixtapLogo.jsx'

/**
 * A stylized illustration of the physical Nixtap NFC card, rendered
 * entirely in CSS/SVG. Distinct from the real product photography —
 * used only as a lightweight decorative element in the hero.
 */
export default function FloatingCard({ className = '' }) {
  return (
    <div
      className={`w-[190px] sm:w-[210px] aspect-[1.6/1] rounded-2xl bg-ink-900 shadow-[0_30px_60px_-15px_rgba(11,13,18,0.4)] p-5 flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-500/20 blur-xl" />
      <NixtapLogo size={26} className="relative z-10" />
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] text-white/60 tracking-wide">TAP TO CONNECT</span>
        <Wifi size={16} className="text-white/70 rotate-90" strokeWidth={2} />
      </div>
    </div>
  )
}
