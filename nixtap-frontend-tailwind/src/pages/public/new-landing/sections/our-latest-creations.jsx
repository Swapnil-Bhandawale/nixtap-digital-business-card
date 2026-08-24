import { useState } from "react";
import SectionTitle from "../components/section-title";
import { MoreHorizontal, Phone, Mail, MapPin, Globe, Briefcase, ArrowUpRight } from "lucide-react";

const profiles = [
    {
        name: "David Kim",
        role: "Freelance Designer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        bgClass: "bg-gradient-to-br from-emerald-900 to-slate-900",
        textClass: "text-white",
        btnClass: "bg-emerald-500 text-white border-none",
        itemBg: "bg-white/10",
        isLight: false,
        links: [
            { icon: Phone, title: "Call me", subtitle: "+1-212-456-7890", bg: "bg-[#22C55E]" },
            { icon: Globe, title: "Follow me", subtitle: "@david.kim", bg: "bg-[#1877F2]" },
            { icon: MapPin, title: "Visit my office", subtitle: "2093 Philadelphia Pike...", bg: "bg-white" },
            { icon: Mail, title: "Email me", subtitle: "david.kim@gmail.com", bg: "bg-[#0EA5E9]" },
            { icon: Briefcase, title: "Follow my Linkedin", subtitle: "david.kim", bg: "bg-[#0A66C2]" }
        ]
    },
    {
        name: "Elena Rostova",
        role: "Marketing Head",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
        bgClass: "bg-gradient-to-br from-slate-900 to-indigo-950",
        textClass: "text-white",
        btnClass: "bg-indigo-500 text-white border-none",
        itemBg: "bg-white/10",
        isLight: false,
        links: [
            { icon: Phone, title: "Call me", subtitle: "+1-212-456-7890", bg: "bg-[#22C55E]" },
            { icon: Globe, title: "Follow me", subtitle: "@elena.rost", bg: "bg-[#1877F2]" },
            { icon: MapPin, title: "Visit my office", subtitle: "2093 Philadelphia Pike...", bg: "bg-white" },
            { icon: Mail, title: "Email me", subtitle: "elena.rostova@gmail.com", bg: "bg-[#0EA5E9]" },
            { icon: Briefcase, title: "Follow my Linkedin", subtitle: "elena.rostova", bg: "bg-[#0A66C2]" }
        ]
    },
    {
        name: "Marcus Allen",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200",
        bgClass: "bg-white border-[3px] border-slate-900",
        textClass: "text-slate-900",
        btnClass: "bg-slate-900 text-white border-none shadow-md",
        itemBg: "bg-slate-50 border border-slate-100/50",
        isLight: true,
        links: [
            { icon: Phone, title: "Call me", subtitle: "+1-212-456-7890", bg: "bg-[#22C55E]" },
            { icon: Globe, title: "Follow me", subtitle: "@marcus.whitlow", bg: "bg-[#1877F2]" },
            { icon: MapPin, title: "Visit my office", subtitle: "2093 Philadelphia Pike...", bg: "bg-white" },
            { icon: Mail, title: "Email me", subtitle: "marcus.whitlow@gmail.com", bg: "bg-[#0EA5E9]" },
            { icon: Briefcase, title: "Follow my Linkedin", subtitle: "marcus.whitlow", bg: "bg-[#0A66C2]" }
        ]
    },
    {
        name: "Sarah Jenkins",
        role: "Creative Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
        bgClass: "bg-gradient-to-br from-slate-800 to-slate-900",
        textClass: "text-white",
        btnClass: "bg-pink-500 text-white border-none",
        itemBg: "bg-white/10",
        isLight: false,
        links: [
            { icon: Phone, title: "Call me", subtitle: "+1-212-456-7890", bg: "bg-[#22C55E]" },
            { icon: Globe, title: "Follow me", subtitle: "@sarah.jen", bg: "bg-[#1877F2]" },
            { icon: MapPin, title: "Visit my office", subtitle: "2093 Philadelphia Pike...", bg: "bg-white" },
            { icon: Mail, title: "Email me", subtitle: "sarah.jenkins@gmail.com", bg: "bg-[#0EA5E9]" },
            { icon: Briefcase, title: "Follow my Linkedin", subtitle: "sarah.jenkins", bg: "bg-[#0A66C2]" }
        ]
    },
    {
        name: "Ethan Carter",
        role: "Tech Lead",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
        bgClass: "bg-gradient-to-bl from-slate-900 to-teal-950",
        textClass: "text-white",
        btnClass: "bg-teal-500 text-white border-none",
        itemBg: "bg-white/10",
        isLight: false,
        links: [
            { icon: Phone, title: "Call me", subtitle: "+1-212-456-7890", bg: "bg-[#22C55E]" },
            { icon: Globe, title: "Follow me", subtitle: "@ethan.dev", bg: "bg-[#1877F2]" },
            { icon: MapPin, title: "Visit my office", subtitle: "2093 Philadelphia Pike...", bg: "bg-white" },
            { icon: Mail, title: "Email me", subtitle: "ethan.carter@gmail.com", bg: "bg-[#0EA5E9]" },
            { icon: Briefcase, title: "Follow my Linkedin", subtitle: "ethan.carter", bg: "bg-[#0A66C2]" }
        ]
    }
];

const DBCard = ({ profile, sizeClass, zIndex, transformClass }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // When the card is light (center) OR hovered (dark cards), we show the colored background.
    const showColor = profile.isLight || isHovered;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative rounded-[32px] overflow-hidden transition-all duration-500 ease-out cursor-pointer hover:!scale-110 hover:!z-50 hover:!opacity-100 hover:!blur-none hover:-translate-y-4 ${sizeClass} ${zIndex} ${transformClass} ${profile.bgClass}`}
        >
            
            {/* Top right menu icon */}
            <div className={`absolute top-5 right-5 w-8 h-8 rounded-full ${profile.isLight ? 'bg-black/5' : 'bg-white/10'} flex items-center justify-center z-20`}>
                <MoreHorizontal className={`size-4 ${profile.textClass} opacity-60`} />
            </div>
            
            {/* Card Content */}
            <div className="relative flex flex-col items-center pt-10 pb-6 px-5 h-full text-center z-10">
                <div className="relative mb-4">
                    <img src={profile.image} className="w-20 h-20 rounded-full object-cover border-[3px] border-white/20 shadow-lg" alt={profile.name} />
                </div>
                
                <h3 className={`font-bold text-xl leading-tight mb-1 ${profile.textClass}`}>{profile.name}</h3>
                <p className={`text-[13px] font-medium opacity-70 mb-6 ${profile.textClass}`}>{profile.role}</p>
                
                <button className={`w-full py-2.5 rounded-xl text-[14px] font-semibold mb-6 transition-transform active:scale-95 ${profile.btnClass}`}>
                    Save Contact
                </button>
                
                <div className="flex flex-col gap-2.5 w-full">
                    {profile.links.map((link, i) => (
                        <div key={i} className={`w-full h-[52px] rounded-xl ${profile.itemBg} flex items-center px-3 gap-3 relative overflow-hidden transition-colors duration-300`}>
                            {/* Icon Box */}
                            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300 ${showColor ? (link.bg || 'bg-white shadow-sm') : 'bg-white/10'}`}>
                                {showColor && link.bg === "bg-white" ? (
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Google_Maps_icon_%282015-2020%29.svg" className="w-5 h-5" alt="map" />
                                ) : (
                                    <link.icon className={`size-[18px] transition-colors duration-300 ${showColor ? 'text-white' : 'text-white'}`} strokeWidth={2} />
                                )}
                            </div>
                            
                            {/* Text */}
                            <div className="flex flex-col items-start flex-1 text-left justify-center overflow-hidden">
                                <p className={`text-[13px] font-bold ${profile.textClass} leading-tight`}>{link.title}</p>
                                <p className={`text-[11px] truncate w-full ${profile.isLight ? 'text-slate-500' : 'text-white/60'} font-medium mt-0.5`}>{link.subtitle}</p>
                            </div>
                            
                            {/* Arrow */}
                            <ArrowUpRight className={`size-[14px] flex-shrink-0 ${profile.isLight ? 'text-slate-300' : 'text-white/30'}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function OurLatestCreations() {
    return (
        <section className="flex flex-col items-center justify-center mt-32 px-4 overflow-hidden py-10 bg-slate-50/50">
            <SectionTitle 
                title="Endless Possibilities" 
                subtitle="Design your digital identity exactly how you want it. Stand out with custom themes, colors, and layouts." 
            />
            
            <div className="flex items-center justify-center -space-x-20 md:-space-x-12 mt-24 mb-16 group perspective-1000">
                
                {/* 1. Outer Left */}
                <DBCard 
                    profile={profiles[0]} 
                    sizeClass="w-[300px] h-[600px] hidden lg:block shrink-0" 
                    zIndex="z-0" 
                    transformClass="scale-[0.70] opacity-40 blur-[2px] translate-x-16" 
                />
                
                {/* 2. Inner Left */}
                <DBCard 
                    profile={profiles[1]} 
                    sizeClass="w-[300px] h-[600px] hidden md:block shrink-0" 
                    zIndex="z-10" 
                    transformClass="scale-[0.85] opacity-80 shadow-2xl translate-x-8" 
                />
                
                {/* 3. Center */}
                <DBCard 
                    profile={profiles[2]} 
                    sizeClass="w-[300px] h-[600px] shrink-0" 
                    zIndex="z-20" 
                    transformClass="scale-100 opacity-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]" 
                />
                
                {/* 4. Inner Right */}
                <DBCard 
                    profile={profiles[3]} 
                    sizeClass="w-[300px] h-[600px] hidden md:block shrink-0" 
                    zIndex="z-10" 
                    transformClass="scale-[0.85] opacity-80 shadow-2xl -translate-x-8" 
                />
                
                {/* 5. Outer Right */}
                <DBCard 
                    profile={profiles[4]} 
                    sizeClass="w-[300px] h-[600px] hidden lg:block shrink-0" 
                    zIndex="z-0" 
                    transformClass="scale-[0.70] opacity-40 blur-[2px] -translate-x-16" 
                />
                
            </div>
            
            <div className="mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-blue-600/30">
                    Create your card
                </button>
            </div>
        </section>
    );
}