import { UserPlus, QrCode, Handshake } from "lucide-react";
import SectionTitle from "../components/section-title";

export default function HowItWorksSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle 
                    title="How it works" 
                    subtitle="Get started in minutes. Networking has never been this simple." 
                />
                
                <div className="grid md:grid-cols-3 gap-12 mt-16 text-center max-w-5xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100">
                            <UserPlus className="size-8" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">1. Create Profile</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Sign up and build your digital identity. Add your contact details, social links, and profile picture in seconds.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100 relative">
                            <QrCode className="size-8" strokeWidth={1.5} />
                            {/* Decorative line connecting to next step on desktop */}
                            <div className="hidden md:block absolute top-1/2 left-full w-full h-[2px] bg-slate-100 -z-10"></div>
                            {/* Decorative line connecting to previous step on desktop */}
                            <div className="hidden md:block absolute top-1/2 right-full w-full h-[2px] bg-slate-100 -z-10"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">2. Share Instantly</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Share your profile via QR code, URL link, or simply tap your NFC card on any smartphone. No app needed.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 shadow-sm border border-indigo-100">
                            <Handshake className="size-8" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">3. Connect & Grow</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Your connections can save your details directly to their phone's address book with a single tap.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
