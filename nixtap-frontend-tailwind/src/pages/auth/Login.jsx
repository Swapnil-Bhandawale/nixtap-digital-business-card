import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" heading="Log in to your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg font-medium">
            {error}
            {error.includes('verify your email') && (
              <div className="mt-2">
                <Link to={`/verify-otp?email=${encodeURIComponent(email)}`} className="text-brand-600 dark:text-brand-400 underline font-bold">
                  Click here to verify your OTP
                </Link>
              </div>
            )}
          </div>
        )}
        
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-brand-500 focus:border-brand-500"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:ring-brand-500 focus:border-brand-500"
        />

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full mt-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all" 
          isLoading={isLoading}
        >
          Log in
        </Button>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <span className="w-1/5 border-b border-slate-200 dark:border-slate-800 lg:w-1/4"></span>
        <span className="text-xs text-center text-slate-500 uppercase tracking-widest font-bold">Or continue with</span>
        <span className="w-1/5 border-b border-slate-200 dark:border-slate-800 lg:w-1/4"></span>
      </div>

      <button 
        type="button" 
        onClick={() => alert("Google Sign-In is under development and will be integrated soon! 🚀")}
        className="w-full flex items-center justify-center gap-3 mt-6 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 h-12 transition-all shadow-sm dark:bg-[#111115] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-white/5 hover:scale-[1.02]"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
        Sign in with Google
      </button>

      <div className="mt-6 flex flex-col gap-2">
        <Link to="/forgot-password" className="text-[14px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
          Forgot password?
        </Link>
        <div className="text-[14px] text-cloud-600 dark:text-cloud-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

