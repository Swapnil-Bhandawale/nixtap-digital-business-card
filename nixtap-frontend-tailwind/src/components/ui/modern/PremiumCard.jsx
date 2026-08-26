import React from 'react';
export function PremiumCard({ children, className = '', hover = true, glass = false }) {
  const base = "relative overflow-hidden rounded-2xl border transition-all duration-300";
  const bg = glass ? "bg-white/70 dark:bg-black/40 backdrop-blur-xl border-white/20 dark:border-white/10" : "bg-white dark:bg-[#0f0f13] border-black/[0.06] dark:border-white/[0.08]";
  const hoverStyle = hover ? "hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:border-black/[0.1] dark:hover:border-white/[0.12] hover:-translate-y-0.5" : "shadow-sm";
  
  return (
    <div className={`${base} ${bg} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}
