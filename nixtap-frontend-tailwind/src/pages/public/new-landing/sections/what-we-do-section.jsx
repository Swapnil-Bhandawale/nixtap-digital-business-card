import { ArrowRightIcon, Wallet, QrCode, Share2, UserPlus, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhatWeDoSection() {
    return (
        <div className="flex flex-col gap-32 my-32 max-w-7xl mx-auto px-6">
            
            {/* Feature 1: Digital Business Card */}
            <section className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="relative shrink-0 w-full lg:w-1/2 order-2 lg:order-1 flex justify-center">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-20 rounded-full"></div>
                    <img className="relative max-w-md w-full object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
                        src="/assets/images/dbc-graphic.webp"
                        alt="Nixtap Digital Business Card" />
                </div>
                
                <div className="text-slate-600 max-w-xl order-1 lg:order-2 w-full lg:w-1/2">
                    <h2 className="text-sm uppercase font-bold tracking-widest text-indigo-600 mb-2">Digital Identity</h2>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                        Your professional identity, beautifully packaged.
                    </h1>
                    <p className="text-[16px] leading-relaxed mb-6">
                        Replace outdated paper cards with a stunning digital identity. Nixtap lets you share contact details, social links, and custom pages instantly with a single tap or QR scan.
                    </p>
                    
                    <ul className="flex flex-col gap-4 mb-8">
                        <li className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                <QrCode className="text-indigo-600 size-5" />
                            </div>
                            <span className="font-medium text-slate-800">Scan & Share Instantly</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                <Share2 className="text-indigo-600 size-5" />
                            </div>
                            <span className="font-medium text-slate-800">No App Required to View</span>
                        </li>
                    </ul>

                    <Link to="/register" className="inline-flex items-center gap-2 hover:opacity-90 transition btn py-3.5 px-8 rounded-full text-white shadow-lg shadow-indigo-500/25 font-semibold">
                        <span>Create Your Card</span>
                        <ArrowRightIcon className='size-5' />
                    </Link>
                </div>
            </section>

            {/* Feature 2: Seamless Connection */}
            <section className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="text-slate-600 max-w-xl w-full lg:w-1/2">
                    <h2 className="text-sm uppercase font-bold tracking-widest text-indigo-600 mb-2">Seamless Connection</h2>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                        Instant saving, never lost.
                    </h1>
                    <p className="text-[16px] leading-relaxed mb-6">
                        Make it effortless for people to remember you. Allow your connections to save your complete profile directly to their phone's native address book with a single tap.
                    </p>

                    <ul className="flex flex-col gap-4 mb-8">
                        <li className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                                <UserPlus className="text-slate-700 size-5" />
                            </div>
                            <span className="font-medium text-slate-800">Save to Phone Contacts (vCard)</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                                <Smartphone className="text-slate-700 size-5" />
                            </div>
                            <span className="font-medium text-slate-800">Works on all iOS & Android</span>
                        </li>
                    </ul>

                    <a href="#faqs" className="inline-flex items-center gap-2 hover:bg-slate-50 border border-slate-200 transition py-3.5 px-8 rounded-full text-slate-700 font-semibold">
                        <span>Explore Features</span>
                        <ArrowRightIcon className='size-5' />
                    </a>
                </div>

                <div className="relative shrink-0 w-full lg:w-1/2 flex justify-center">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-10 rounded-full"></div>
                    <img className="relative max-w-md w-full object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
                        src="/assets/images/wallet-graphic.webp"
                        alt="Nixtap Native Integration" />
                </div>
            </section>
        </div>
    );
};