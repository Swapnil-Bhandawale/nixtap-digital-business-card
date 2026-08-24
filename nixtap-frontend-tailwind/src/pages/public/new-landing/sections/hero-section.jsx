import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import LogoMarquee from "../components/LogoMarquee";

export default function HeroSection() {

    return (
        <section className="flex flex-col items-center justify-center relative min-h-[100svh] pt-32 pb-16 overflow-hidden">
            <svg className="absolute inset-0 -z-10 h-full w-full object-cover" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 1018" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#a)">
                    <ellipse cx="271.282" cy="200.379" rx="271.282" ry="200.379" fill="#FBFFE1" />
                </g>
                <g filter="url(#b)">
                    <ellipse cx="993.487" cy="451.53" rx="359.487" ry="265.53" fill="url(#c)" fillOpacity=".1" />
                </g>
                <defs>
                    <filter id="a" x="-300" y="-300" width="1142.56" height="1000.76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_8119_961" />
                    </filter>
                    <filter id="b" x="333.9" y="-114.1" width="1319.18" height="1131.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="150.05" result="effect1_foregroundBlur_8119_961" />
                        <feTurbulence type="fractalNoise" baseFrequency="inf inf" stitchTiles="stitch" numOctaves="3" result="noise" seed="9943" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                            <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" />
                        </feComponentTransfer>
                        <feComposite operator="in" in2="effect1_foregroundBlur_8119_961" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect2_noise_8119_961">
                            <feMergeNode in="effect1_foregroundBlur_8119_961" />
                            <feMergeNode in="color1" />
                        </feMerge>
                    </filter>
                    <linearGradient id="c" x1="550.41" y1="500.394" x2="1343.15" y2="82.986" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F6DFF4" />
                        <stop offset=".196" stopColor="#FF6E00" />
                        <stop offset=".407" stopColor="#F8C04D" />
                        <stop offset=".586" stopColor="#EF3EC2" />
                        <stop offset=".816" stopColor="#4700EC" />
                        <stop offset=".949" stopColor="#5100BA" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex flex-wrap items-center justify-center p-1.5 rounded-full border border-indigo-100">
                <div className="flex items-center -space-x-3">
                    <img className="size-7 rounded-full border-3 border-white"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                    <img className="size-7 rounded-full border-3 border-white"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                    <img className="size-7 rounded-full border-3 border-white"
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                        alt="userImage3" />
                </div>
                <p className="pl-2 pr-3 text-gray-600">Join community of 1m+ founders </p>
            </div>

            <h1 className="flex flex-col items-center text-center text-[36px] leading-[1.1] md:text-[64px] md:leading-[1.1] lg:text-[76px] lg:leading-[1.05] font-semibold tracking-tight md:tracking-[-2px] mt-8">
                <span className="text-slate-900">Digital Business Card</span>
                <span className="text-slate-500 mt-1 md:mt-2">The Original. The Best.</span>
            </h1>
            
            <p className="text-slate-500 md:text-lg max-md:px-4 text-center max-w-2xl mt-6 leading-relaxed font-medium">
                Create stunning digital business cards, share via QR, capture leads, and track analytics. Join the future of networking with Nixtap.
            </p>

            <div className="flex items-center gap-4 mt-8">
                <Link to="/register" className="flex items-center justify-center bg-slate-900 hover:bg-black text-white px-10 h-14 rounded-2xl transition-colors font-semibold text-[16px] shadow-sm">
                    Get started now
                </Link>
            </div>
            
            <div className="mt-16 mb-12 text-center">
                <p className="text-slate-800 text-[13px] font-bold tracking-[0.15em] uppercase mb-2">Trusted by professionals building meaningful connections.</p>
                <p className="text-slate-500 text-[15px]">Powering modern professionals and teams around the world.</p>
            </div>

            <LogoMarquee />
        </section >
    );
}