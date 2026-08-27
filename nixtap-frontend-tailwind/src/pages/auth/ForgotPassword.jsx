import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authApi } from '../../api/authApi';
import AuthLayout from './components/AuthLayout';
import { Mail, KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Password, 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({ email });
      setStep(2);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your connection.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp) {
      setError("Please enter the OTP sent to your email");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      setStep(3);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please check your connection.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to reset password. Please check your OTP and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Rendering step 1: Enter email
  if (step === 1) {
    return (
      <AuthLayout eyebrow="Reset Password" heading="Forgot your password?">
        <form onSubmit={handleSendOtp} className="space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              required
            />
          </div>

          <Button type="submit" className="w-full h-11" isLoading={loading}>
            Send Reset OTP
          </Button>

          <div className="text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">Remembered your password? </span>
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Back to login
            </Link>
          </div>
        </form>
      </AuthLayout>
    );
  }

  // Rendering step 2: Enter OTP and New Password
  if (step === 2) {
    return (
      <AuthLayout eyebrow="Verification" heading="Reset your password">
        <form onSubmit={handleResetPassword} className="space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We've sent an OTP to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>. Please enter it below along with your new password.
          </p>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="otp" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                OTP Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                icon={<KeyRound className="w-5 h-5" />}
                required
                maxLength={6}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Must be at least 8 characters"
                icon={<Lock className="w-5 h-5" />}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                icon={<Lock className="w-5 h-5" />}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" isLoading={loading}>
            Reset Password
          </Button>

          <div className="text-center text-sm">
            <button 
              type="button" 
              onClick={() => {
                setStep(1);
                setOtp('');
                setError(null);
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline-offset-4 hover:underline"
            >
              Didn't receive the OTP? Try another email
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  // Rendering step 3: Success
  return (
    <AuthLayout eyebrow="Success" heading="Password Reset Complete">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your password has been successfully reset. You can now use your new password to log in to your account.
        </p>

        <Button 
          type="button"
          onClick={() => navigate('/login')} 
          className="w-full h-11"
        >
          Go to Login
        </Button>
      </div>
    </AuthLayout>
  );
}
