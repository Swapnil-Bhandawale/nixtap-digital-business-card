import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

const DEFAULT_GRADIENT = 'linear-gradient(135deg,#1d4ed8,#7C3AED)';

export default function PhonePreview({
  avatarUrl,
  bannerUrl,
  themeGradient = DEFAULT_GRADIENT,
  fullName,
  jobTitle,
  locationText,
  initials,
  email,
  phone,
  website,
  socials, // array of { key, label, color, icon, url }
}) {
  const accentColor = (themeGradient.match(/#[0-9a-fA-F]{6}/) || [])[0] || '#1d4ed8';

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_25%,rgba(196,181,253,0.55)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(147,197,253,0.45)_0%,transparent_55%),radial-gradient(circle_at_30%_85%,rgba(249,168,212,0.4)_0%,transparent_55%)] dark:bg-[radial-gradient(circle_at_20%_25%,rgba(37,99,235,0.28)_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.22)_0%,transparent_55%),radial-gradient(circle_at_30%_85%,rgba(124,58,237,0.16)_0%,transparent_55%)]">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[200px] h-[420px] rounded-[44px] p-1.5 flex-shrink-0"
        style={{
          background: 'linear-gradient(160deg,#4b4b56 0%,#232332 55%,#141420 100%)',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.18), 0 0 0 3px rgba(0,0,0,0.3), 0 30px 80px rgba(0,0,0,0.35), 0 0 60px rgba(37,99,235,0.18)',
        }}
      >
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[52px] h-[15px] bg-black rounded-full z-10" />
        <div className="absolute -left-[3px] top-24 w-[3px] h-6 bg-[#57575f] rounded-l-sm" />
        <div className="absolute -left-[3px] top-32 w-[3px] h-6 bg-[#57575f] rounded-l-sm" />
        <div className="absolute -right-[3px] top-[104px] w-[3px] h-11 bg-[#57575f] rounded-r-sm" />

        <div className="w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col relative">
          {/* Banner + avatar */}
          <div className="h-[130px] relative flex-shrink-0">
            <div
              className="absolute inset-0 overflow-hidden transition-all duration-500"
              style={
                bannerUrl
                  ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: themeGradient }
              }
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-40% to-black/55" />
            </div>
            <div className="absolute -bottom-[30px] left-1/2 -translate-x-1/2 z-[5]">
              <div
                className="w-[68px] h-[68px] rounded-full border-4 border-white flex items-center justify-center text-white text-[21px] font-extrabold overflow-hidden"
                style={{
                  background: avatarUrl ? 'none' : accentColor,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)',
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-[38px] px-3.5 pb-2.5 text-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="text-[17px] font-extrabold text-slate-900 tracking-tight mb-1 leading-tight">
              {fullName || 'Your name'}
            </div>
            <div className="text-[11px] text-[#555] font-semibold mb-0.5">{jobTitle}</div>
            {locationText && (
              <div className="text-[10px] text-[#888] mb-3.5 flex items-center justify-center gap-1">
                <MapPin className="w-[9px] h-[9px] text-[#aaa]" />
                <span>{locationText}</span>
              </div>
            )}

            <div
              className="mx-2.5 mb-3.5 rounded-full py-2.5 text-xs font-bold text-white"
              style={{ background: `linear-gradient(90deg, ${accentColor}, #7C3AED)` }}
            >
              Connect with me
            </div>

            {/* Contacts */}
            <div className="flex flex-col gap-1.5 w-full mb-1">
              {email && (
                <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[10px] py-1.5 px-2.5">
                  <div
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor }}
                  >
                    <Mail className="w-[11px] h-[11px] text-white" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] text-[#333] font-medium truncate max-w-[110px]">{email}</div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[10px] py-1.5 px-2.5">
                  <div
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor }}
                  >
                    <Phone className="w-[11px] h-[11px] text-white" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] text-[#333] font-medium truncate max-w-[110px]">{phone}</div>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-2 bg-[#f8f9fa] rounded-[10px] py-1.5 px-2.5">
                  <div
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor }}
                  >
                    <Globe className="w-[11px] h-[11px] text-white" strokeWidth={2} />
                  </div>
                  <div className="text-[10px] text-[#333] font-medium truncate max-w-[110px]">{website}</div>
                </div>
              )}
            </div>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mt-3.5">
                <div className="text-[9px] font-extrabold tracking-[1.2px] text-[#aaa] uppercase mb-2">
                  Follow us
                </div>
                <div className="flex justify-center gap-2.5 flex-wrap mb-1">
                  {socials.map((s) => (
                    <div
                      key={s.key}
                      className="w-[38px] h-[38px] rounded-xl flex items-center justify-center"
                      style={{ background: s.color + '18', color: s.color, border: `1px solid ${s.color}44` }}
                    >
                      <span className="w-[18px] h-[18px] flex">{s.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
