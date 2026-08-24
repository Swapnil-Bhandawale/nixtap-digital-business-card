import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingSection() {
    const [billingCycle, setBillingCycle] = useState('standard');

    const plans = [
        {
            name: 'Basic',
            price: 0,
            target: 'for: beginners and individuals',
            features: [
                '1 Digital Business Card',
                'Standard digital card design',
                'Basic contact sharing',
                'QR Code generation',
                'Up to 10 link saves'
            ],
            highlighted: false,
            btnText: 'Get Started',
            isFree: true
        },
        {
            name: 'Pro',
            originalPrice: billingCycle === 'standard' ? 36 : 72,
            price: billingCycle === 'standard' ? 18 : 30,
            validity: billingCycle === 'standard' ? 'valid for 6 months' : 'valid for 1 year',
            badge: billingCycle === 'standard' ? '50% OFF' : 'Save 58%',
            prefix: billingCycle === 'standard' ? '(equivalent to $3/mo)' : '(equivalent to $2.50/mo)',
            target: 'for: freelancers, creators, pros',
            features: [
                'Up to 10 Digital Cards',
                'Everything in Free',
                'Unlock all PRO card designs',
                'Add videos, custom badges & PDFs',
                'Advanced Card analytics & insights',
                'Unlimited Visitor Feedback',
                'Priority support'
            ],
            highlighted: true,
            btnText: 'Start Free Trial'
        },
        {
            name: 'Business',
            originalPrice: billingCycle === 'standard' ? 80 : 120,
            price: billingCycle === 'standard' ? 56 : 60,
            validity: billingCycle === 'standard' ? 'valid for 8 months' : 'valid for 1 year',
            badge: billingCycle === 'standard' ? '30% OFF' : '50% OFF',
            prefix: billingCycle === 'standard' ? '(equivalent to $7/mo per user)' : '(equivalent to $5/mo per user)',
            target: 'for: teams, agencies, companies',
            features: [
                'Unlimited Digital Cards',
                'Everything in Pro',
                'Admin-controlled card templates',
                'Team email signature management',
                'Direct integrations with CRM',
                'Team analytics & leaderboard',
                'Dedicated account manager'
            ],
            highlighted: false,
            btnText: 'Contact Sales'
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-slate-50 font-sans">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
                
                {/* Header Section */}
                <div className="text-center mb-16 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Choose the plan</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Start free and upgrade when you're ready — your professional networking always comes first.
                    </p>

                    {/* Toggle */}
                    <div className="inline-flex mt-10 bg-slate-200/80 rounded-full p-1 border border-slate-200">
                        <button 
                            onClick={() => setBillingCycle('standard')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'standard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Standard
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Yearly <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">Mega Offer</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center relative z-10">
                    {plans.map((plan, idx) => (
                        <div 
                            key={idx} 
                            className={`relative rounded-[32px] p-8 flex flex-col transition-all duration-300 ${
                                plan.highlighted 
                                    ? 'bg-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.25)] md:scale-105 z-10 text-white border border-slate-800 h-full min-h-[550px]' 
                                    : 'bg-white border border-slate-200 shadow-lg text-slate-900 md:scale-100 min-h-[500px]'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-[32px] pointer-events-none" />
                            )}
                            <div className="text-center mb-6 relative z-10">
                                <h3 className={`text-base font-semibold mb-6 lowercase tracking-wide ${plan.highlighted ? 'text-indigo-300' : 'text-slate-500'}`}>{plan.name}</h3>
                                
                                {plan.originalPrice && (
                                    <div className={`text-sm font-bold line-through mb-1 ${plan.highlighted ? 'text-slate-500' : 'text-slate-400'}`}>
                                        ${plan.originalPrice}
                                    </div>
                                )}
                                
                                <div className="flex flex-col items-center justify-center gap-1 mb-2 relative">
                                    {plan.badge && (
                                        <div className="absolute -top-10 -right-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg rotate-[15deg] uppercase tracking-widest z-20">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <div className="flex items-end justify-center gap-1">
                                        <span className="text-5xl font-black">${plan.price}</span>
                                    </div>
                                    {plan.validity && (
                                        <span className={`text-sm font-bold mt-1 ${plan.highlighted ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {plan.validity}
                                        </span>
                                    )}
                                </div>
                                
                                {plan.prefix ? (
                                    <div className={`text-[11px] font-medium mb-4 ${plan.highlighted ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {plan.prefix}
                                    </div>
                                ) : (
                                    <div className="h-6 mb-4"></div>
                                )}
                                
                                {plan.isFree && (
                                    <div className="mb-2 min-h-[20px]">
                                        <Link to="/register" className={`text-xs font-bold hover:underline ${plan.highlighted ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            Start 30-Day PRO Trial
                                        </Link>
                                    </div>
                                )}
                                
                                <p className={`text-sm px-4 lowercase ${plan.highlighted ? 'text-slate-300 font-medium' : 'text-slate-500'}`}>
                                    {plan.target}
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-1 mt-2 relative z-10">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`shrink-0 mt-0.5 rounded-full p-1 flex items-center justify-center ${plan.highlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-200 text-slate-700'}`}>
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span className={`text-sm lowercase leading-relaxed ${plan.highlighted ? 'font-medium text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto relative z-10 w-full block">
                                <Link 
                                    to="/register" 
                                    className={`w-full h-12 rounded-full text-sm font-bold transition-all lowercase tracking-wide flex items-center justify-center ${
                                        plan.highlighted 
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/25' 
                                            : 'bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    {plan.btnText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
