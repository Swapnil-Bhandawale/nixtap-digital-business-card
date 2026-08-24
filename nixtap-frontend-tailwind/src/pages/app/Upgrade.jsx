import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, Crown, Zap, Shield, CheckCircle } from 'lucide-react';
import { apiClient } from '../../api/axios';

const PlanCard = ({ title, price, isPopular, currentPlan, features, onUpgrade, isLoading, ctaText }) => (
  <Card className={`relative flex flex-col h-full ${isPopular ? 'border-brand-500 shadow-premium' : ''}`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
        Most Popular
      </div>
    )}
    <CardHeader className="text-center pt-8">
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold text-gray-900">
        ₹{price}
        <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
      </div>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col justify-between p-6">
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-brand-500 mr-3 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="p-6 pt-0 border-none bg-transparent">
      <Button 
        className="w-full" 
        variant={isPopular ? 'primary' : 'outline'} 
        disabled={currentPlan || isLoading}
        onClick={onUpgrade}
        isLoading={isLoading}
      >
        {currentPlan ? 'Current Plan' : ctaText}
      </Button>
    </CardFooter>
  </Card>
);

export default function Upgrade() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (planName) => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway. Please check your internet connection.');
      }

      // Connect to the ASP.NET payment service via API Gateway
      const response = await apiClient.post('/payment/checkout', { plan: planName });
      
      const { gatewayOrderId, amount, currency, gatewayKeyId } = response.data;

      if (!gatewayOrderId || !gatewayKeyId) {
        throw new Error('Invalid payment configuration received from server.');
      }

      const options = {
        key: gatewayKeyId,
        amount: amount.toString(),
        currency: currency,
        name: 'Nixtap',
        description: `Upgrade to ${planName} Plan`,
        order_id: gatewayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on our backend
            const verifyRes = await apiClient.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: planName
            });
            
            if (verifyRes.data.success) {
              setSuccessData({
                orderId: response.razorpay_order_id,
                plan: planName
              });
            } else {
              setErrorMsg(verifyRes.data.failureReason || 'Payment verification failed.');
            }
          } catch (err) {
            setErrorMsg('Payment successful but verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        theme: {
          color: '#6366f1' // brand-500
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setErrorMsg(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 502) {
        setErrorMsg('The payment gateway is currently unavailable or undergoing maintenance.');
      } else {
        setErrorMsg(error.message || 'Failed to initialize payment. Please try again later.');
      }
      setIsProcessing(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-6 pt-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900">Payment Successful!</h2>
        <p className="text-xl text-gray-600">
          You are now upgraded to the <strong className="text-brand-600">{successData.plan}</strong> plan.
        </p>
        <div className="p-4 bg-gray-50 rounded-xl inline-block mt-4 text-sm font-medium text-gray-600">
          Order ID: {successData.orderId}
        </div>
        <div className="pt-8">
          <Button size="lg" onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-brand-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Crown className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Upgrade your digital identity</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Get access to premium templates, advanced analytics, and custom domains to take your professional identity to the next level.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-100 font-medium flex items-center justify-center">
          <Shield className="w-5 h-5 mr-2" />
          {errorMsg}
        </div>
      )}

      {isProcessing && !errorMsg && (
        <div className="max-w-2xl mx-auto p-4 bg-blue-50 text-blue-700 rounded-xl text-center border border-blue-100 font-medium flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 mr-2" />
          Preparing secure checkout...
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8 pt-8">
        <PlanCard
          title="Free"
          price="0"
          ctaText="Get Started"
          currentPlan={true}
          features={[
            '1 Digital Business Card',
            'Basic Templates',
            'Standard QR Code',
            'Basic Contact Saving'
          ]}
        />
        <PlanCard
          title="Pro"
          price="499"
          isPopular={true}
          ctaText="Upgrade to Pro"
          isLoading={isProcessing}
          onUpgrade={() => handleUpgrade('PREMIUM')}
          features={[
            'Unlimited Digital Cards',
            'All Premium Templates',
            'Advanced Analytics',
            'Custom Domain (yourname.com)',
            'Remove Nixtap Branding',
            'CRM Integrations'
          ]}
        />
        <PlanCard
          title="Business"
          price="999"
          ctaText="Contact Sales"
          isLoading={isProcessing}
          onUpgrade={() => handleUpgrade('BUSINESS')}
          features={[
            'Everything in Pro',
            'Team Management',
            'Centralized Billing',
            'Admin Dashboard',
            'Directory Sync',
            'Priority Support'
          ]}
        />
      </div>

      <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 text-center flex flex-col md:flex-row items-center justify-between">
        <div className="text-left mb-6 md:mb-0">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Zap className="w-5 h-5 text-yellow-500 mr-2" />
            Looking for an Enterprise solution?
          </h3>
          <p className="text-gray-500 mt-2">Custom integrations, SSO, and dedicated account management.</p>
        </div>
        <Button variant="outline" size="lg">Contact Sales Team</Button>
      </div>
    </div>
  );
}
