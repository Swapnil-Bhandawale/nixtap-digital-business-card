import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wifi } from 'lucide-react';
import NixtapLogo from '../../public/landing/components/ui/NixtapLogo';

const EASE = [0.16, 1, 0.3, 1];

// 3D Stacked Cards Component
export function StackedAuthCards() {
  const PROFILES = [
    {
      name: "Swapnil Bhandawale",
      role: "Full Stack Developer | C-DAC IACSD",
      url: "nixtap.online/swapnil",
      image: "/assets/swapnil.jpg",
      imgClass: "scale-125 origin-top", // Gentle 25% zoom for accuracy
      gradient: "linear-gradient(135deg, #020617 0%, #1e1b4b 100%)", // Midnight blue (from Krishna)
      textColor: "text-white",
      forceLight: true
    },
    {
      name: "Devesh Patil",
      role: "Full Stack Developer | C-DAC IACSD",
      url: "nixtap.online/devesh",
      image: "/assets/devesh.jpg",
      imgClass: "scale-125 origin-top", // Gentle 25% zoom for accuracy
      gradient: "linear-gradient(135deg, #0f172a 0%, #334155 100%)", // Slate dark
      textColor: "text-white",
      forceLight: true
    },
    {
      name: "Krishna Dhumal",
      role: "IIT Kharagpur | C-DAC ACTS",
      url: "nixtap.online/krishna",
      image: "/assets/krishna.jpg",
      imgClass: "", // Already a perfect square headshot
      gradient: "linear-gradient(135deg, #111111 0%, #2a2a2a 50%, #0a0a0a 100%)", // Founder's Edition Black Metal
      textColor: "text-white",
      forceLight: true
    }
  ];

  const [cards, setCards] = useState([0, 1, 2]);

  // Cycle cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const first = newCards.shift();
        newCards.push(first);
        return newCards;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[420px] aspect-[1.586/1] mt-4 relative z-20 h-[265px]">
      {/* Soft glow behind the stack */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />
      
      {cards.map((profileIndex, i) => {
        const profile = PROFILES[profileIndex];
        const isFront = i === 0;

        return (
          <motion.div
            key={profile.name}
            className="absolute top-0 left-0 w-full h-full rounded-[24px] shadow-2xl overflow-hidden"
            animate={{
              x: isFront ? 0 : i * 28,
              y: isFront ? 0 : i * -12,
              scale: isFront ? 1 : 1 - (i * 0.05),
              opacity: isFront ? 1 : 1 - (i * 0.15),
              zIndex: 3 - i,
              rotateZ: isFront ? 0 : i * 2
            }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 15,
              mass: 1,
              restDelta: 0.001 // Forces the animation to snap to whole numbers faster, removing sub-pixel blur
            }}
            style={{ 
              background: profile.gradient,
              border: profile.forceLight ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* Glass highlight overlay */}
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-[24px]" />
            
            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-3">
                  {/* Nixtap Logo */}
                  <NixtapLogo forceLight={profile.forceLight} className="scale-75 origin-top-left" />
                  
                  {/* Premium Profile Picture Container */}
                  <div className={`flex items-center justify-center w-[60px] h-[60px] rounded-full p-[2px] shadow-md overflow-hidden relative ${profile.forceLight ? 'bg-white/20' : 'bg-black/10'}`}>
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      className={`w-full h-full object-cover rounded-full ${profile.imgClass}`}
                      style={{ filter: "contrast(1.05)" }} // Slight contrast to match Krishna's sharpness
                    />
                  </div>
                </div>

                {/* Perfectly Aligned Contactless NFC Icon */}
                <div className={`${profile.textColor} mr-1 mt-1 drop-shadow-sm`}>
                   <Wifi className="w-6 h-6 rotate-90 opacity-80" strokeWidth={2.5} />
                </div>
              </div>
              
              <div className={`${profile.textColor} mt-auto`}>
                <h3 className="text-[24px] font-extrabold tracking-tight mb-[2px] truncate drop-shadow-sm">{profile.name}</h3>
                <p className={`text-[12px] font-semibold mb-4 truncate drop-shadow-sm ${profile.forceLight ? 'text-white/90' : 'text-slate-700'}`}>{profile.role}</p>
                <p className={`text-[11px] font-mono tracking-widest truncate uppercase ${profile.forceLight ? 'text-white/70' : 'text-slate-500'}`}>{profile.url}</p>
              </div>

            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AuthLayout({ children, eyebrow, heading, subtitle, cardProps }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-100 dark:bg-[#0a0a0f] font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Abstract screen background shapes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Floating Curved Card Container */}
      <div className="w-full max-w-[1200px] min-h-[600px] h-[85vh] max-h-[800px] bg-white dark:bg-[#111115] rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex overflow-hidden relative z-10 border border-slate-200/50 dark:border-white/5">
        
        {/* Left Panel - Premium Brand Visual */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0B0F19] overflow-hidden flex-col justify-center p-10 lg:p-14 border-r border-slate-200 dark:border-white/5">
          
          {/* Glowing orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/30 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
          
          {/* Top Header (Absolute to save space in center) */}
          <div className="absolute top-10 left-10 lg:left-14 z-20">
            <Link to="/">
              <NixtapLogo forceLight={true} />
            </Link>
          </div>

          {/* Center Content with 3D Card */}
          <div className="relative z-10 w-full max-w-[460px] mx-auto mt-6">
            
            <h1 className="text-4xl leading-[1.15] font-extrabold text-white mb-3 tracking-tight">
              Create your digital <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">identity.</span>
            </h1>
            <p className="text-slate-400 mb-8 text-[15px] leading-relaxed max-w-sm">
              Build your digital business card, share it instantly, and turn every introduction into a lasting connection.
            </p>

            <div className="flex justify-start">
               <StackedAuthCards />
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 relative">
          {/* Theme Toggle */}
          <div className="absolute top-6 right-6 z-10">
            {/* <ThemeToggle /> */}
          </div>
          
          <div className="min-h-full flex flex-col py-16 px-8 sm:px-12 lg:px-16">
            <div className="w-full max-w-md mx-auto my-auto">
              
              {/* Mobile Logo */}
              <div className="lg:hidden mb-10 flex justify-center">
                <Link to="/">
                  <NixtapLogo className="text-slate-900 dark:text-white" />
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {/* Form Content */}
                {eyebrow && (
                  <p className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] mb-2">
                    {eyebrow}
                  </p>
                )}
                {heading && (
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                    {heading}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-slate-500 dark:text-slate-400 text-[14px] mb-6 leading-relaxed">
                    {subtitle}
                  </p>
                )}
                
                {children}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
