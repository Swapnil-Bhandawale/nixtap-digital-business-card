import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import { paymentApi } from '../../api/paymentApi';
import Toast from '../../components/ui/Toast';

export default function Premium() {
  const [billingCycle, setBillingCycle] = useState('standard');
  const { user, fetchUser } = useAuthStore();
  const [startingTrial, setStartingTrial] = useState(false);
  const [toast, setToast] = useState(null);

  const handleStartTrial = async () => {
    if (startingTrial) return;
    setStartingTrial(true);
    try {
      await authApi.startTrial();
      await fetchUser();
      setToast({ type: 'success', message: '30-Day PRO trial started successfully!' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to start trial' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setStartingTrial(false);
    }
  };

  const [processingPlan, setProcessingPlan] = useState(null);

  const handleUpgrade = async (planName) => {
    if (planName === 'Basic' || user?.planType === planName.toUpperCase()) return;
    
    setProcessingPlan(planName);
    try {
      const isLoaded = await paymentApi.loadRazorpay();
      if (!isLoaded) {
        setToast({ type: 'error', message: 'Failed to load Razorpay SDK. Check your connection.' });
        setProcessingPlan(null);
        return;
      }

      const res = await paymentApi.createCheckout(planName.toUpperCase());
      const { gatewayOrderId, amount, currency, gatewayKeyId } = res.data;

      // Real Payment Flow
      const options = {
        key: gatewayKeyId,
        amount: amount.toString(),
        currency: currency,
        name: 'Nixtap',
        description: `Upgrade to ${planName} Plan`,
        order_id: gatewayOrderId,
        handler: async function (response) {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: planName.toUpperCase()
            });
            await fetchUser();
            useAuthStore.setState((state) => ({ user: { ...state.user, planType: planName.toUpperCase() } }));
            setToast({ type: 'success', message: `Successfully upgraded to ${planName}!` });
          } catch (e) {
            console.error('Payment verification failed:', e);
            setToast({ type: 'error', message: e.response?.data?.message || 'Payment verification failed. Please contact support.' });
          } finally {
            setProcessingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPlan(null);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Checkout error:', error);
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to start payment. Please try again.' });
      setProcessingPlan(null);
    }
  };

  const isTrialActive = user?.planType === 'PRO' && user?.trialEndDate;
  const hasUsedTrial = user?.trialUsed;

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
      btnText: 'Current Plan',
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
      btnText: 'Upgrade to Pro'
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
    <div className="min-h-[calc(100vh-76px)] bg-[#fafafa] dark:bg-[#0a0a0c] py-16 px-6 overflow-y-auto font-sans transition-colors duration-300">
      <Toast toast={toast} />
      
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Choose the plan</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Start free and upgrade when you're ready — your professional networking always comes first.
          </p>

          {/* Toggle */}
          <div className="inline-flex mt-10 bg-slate-200/80 dark:bg-white/5 rounded-full p-1 border border-slate-200 dark:border-white/10">
            <button 
              onClick={() => setBillingCycle('standard')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'standard' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Standard
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Yearly <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider">Mega Offer</span>
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
                  ? 'bg-gradient-to-b from-amber-200 via-orange-200 to-purple-300 dark:from-amber-300 dark:via-orange-300 dark:to-purple-400 shadow-[0_20px_50px_rgba(251,191,36,0.2)] md:scale-105 z-10 text-slate-900 border-0 h-full min-h-[550px]' 
                  : 'bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 shadow-lg text-slate-900 dark:text-white md:scale-100 min-h-[500px]'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className={`text-base font-semibold mb-6 lowercase tracking-wide ${plan.highlighted ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}>{plan.name}</h3>
                
                {plan.originalPrice && (
                  <div className={`text-sm font-bold line-through mb-1 ${plan.highlighted ? 'text-amber-700/60' : 'text-slate-400'}`}>
                    ${plan.originalPrice}
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center gap-1 mb-2 relative">
                  {plan.badge && (
                    <div className="absolute -top-10 -right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg rotate-[15deg] uppercase tracking-widest z-20">
                      {plan.badge}
                    </div>
                  )}
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-5xl font-black">${plan.price}</span>
                  </div>
                  {plan.validity && (
                    <span className={`text-sm font-bold mt-1 ${plan.highlighted ? 'text-slate-800' : 'text-slate-600 dark:text-slate-300'}`}>
                      {plan.validity}
                    </span>
                  )}
                </div>
                
                {plan.prefix ? (
                  <div className={`text-[11px] font-medium mb-4 ${plan.highlighted ? 'text-slate-700' : 'text-slate-500 dark:text-slate-500'}`}>
                    {plan.prefix}
                  </div>
                ) : (
                  <div className="h-6 mb-4"></div>
                )}
                
                {plan.isFree && (
                  <div className="mb-2 min-h-[20px]">
                    {isTrialActive ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PRO Trial Active 👑</span>
                    ) : hasUsedTrial ? (
                      <span className="text-xs font-medium text-slate-400"></span>
                    ) : (
                      <button 
                        onClick={handleStartTrial}
                        disabled={startingTrial}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {startingTrial ? 'Starting...' : 'Start 30-Day PRO Trial'}
                      </button>
                    )}
                  </div>
                )}
                
                <p className={`text-sm px-4 lowercase ${plan.highlighted ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.target}
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-1 mt-2">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`shrink-0 mt-0.5 rounded-full p-1 flex items-center justify-center ${plan.highlighted ? 'bg-slate-900 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={`text-sm lowercase leading-relaxed ${plan.highlighted ? 'font-medium text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleUpgrade(plan.name)}
                disabled={processingPlan === plan.name}
                className={`w-full h-12 rounded-full text-sm font-bold transition-all lowercase tracking-wide ${
                  plan.highlighted 
                    ? 'bg-[#15151a] text-white hover:bg-black shadow-xl hover:shadow-2xl' 
                    : 'bg-transparent border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {processingPlan === plan.name ? 'Processing...' : plan.btnText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
