import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AuthLayout from './components/AuthLayout';
import { authApi } from '../../api/authApi';

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await authApi.verifyOtp({ email, otp });
      setSuccess('Email verified successfully! You can now log in.');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email to resend OTP.");
      return;
    }
    try {
      await authApi.resendOtp({ email });
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.');
    }
  };

  return (
    <AuthLayout 
      eyebrow="VERIFICATION" 
      heading="Verify your email"
      subtitle="We've sent a 6-digit OTP to your email address. Please enter it below to verify your account."
      cardProps={{
        name: "Verification",
        role: "New Member",
        url: "nixtap.in/verify"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] rounded-lg font-medium">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 text-[13px] rounded-lg font-medium">
            {success}
          </div>
        )}
        
        <Input
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-brand-500 focus:border-brand-500"
          readOnly={!!emailParam}
        />

        <Input
          label="6-Digit OTP"
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={6}
          className="focus:ring-brand-500 focus:border-brand-500 text-center tracking-widest text-lg font-bold"
        />

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white disabled:opacity-50" 
          isLoading={isLoading}
          disabled={!email || otp.length < 4 || isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center justify-center gap-2 border-t border-cloud-100 pt-6">
        <div className="text-[14px] text-cloud-600 dark:text-cloud-400">
          Didn't receive the code?{' '}
          <button type="button" onClick={handleResend} className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Resend OTP
          </button>
        </div>
        <div className="text-[14px] text-cloud-600 dark:text-cloud-400">
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
