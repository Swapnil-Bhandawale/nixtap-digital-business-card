import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaSection() {
    return (
        <section className="py-24 bg-white px-4">
            <div className="max-w-5xl mx-auto rounded-[40px] bg-slate-900 text-white px-6 py-20 text-center relative overflow-hidden shadow-2xl">
                {/* Decorative background blur */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl leading-tight">
                        Ready to upgrade your networking?
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl">
                        Join thousands of professionals who have ditched paper cards. Create your free digital business card today.
                    </p>
                    
                    <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 h-16 rounded-2xl transition-colors font-semibold text-lg shadow-lg shadow-indigo-600/30">
                        <span>Get started for free</span>
                        <ArrowRightIcon className="size-5" />
                    </Link>
                    <p className="text-slate-500 text-sm mt-5">No credit card required. Setup takes 2 minutes.</p>
                </div>
            </div>
        </section>
    );
}
