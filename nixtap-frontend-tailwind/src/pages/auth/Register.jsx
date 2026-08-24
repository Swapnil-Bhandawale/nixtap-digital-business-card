import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from './components/AuthLayout';
import { Check } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password),
    });
  }, [password]);

  const isPasswordValid = passwordValidation.length && passwordValidation.uppercase && passwordValidation.number && passwordValidation.special;
  const passwordsMatch = password === confirmPassword && password !== '';
  const isFormValid = name && email && isPasswordValid && passwordsMatch && agreedToTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await register({ fullName: name, email, password });
      // The backend requires OTP verification before logging in
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  const ValidationItem = ({ isValid, text }) => (
    <div className={`flex items-center gap-1.5 text-[12px] font-medium transition-colors ${isValid ? 'text-[#10b981]' : 'text-cloud-400 dark:text-cloud-500'}`}>
      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isValid ? 'bg-[#10b981]/10' : 'bg-cloud-100 dark:bg-slate-800'}`}>
        {isValid && <Check size={10} strokeWidth={3} className="text-[#10b981]" />}
      </div>
      {text}
    </div>
  );

  return (
    <AuthLayout 
      eyebrow="GET STARTED" 
      heading="Create your account"
      subtitle="Create your Nixtap account and start sharing your digital identity."
      cardProps={{
        name: name || "Your Name",
        role: "New Member",
        url: name ? `nixtap.in/${name.toLowerCase().replace(/\s+/g, '-')}` : "nixtap.in/your-link"
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-[13px] rounded-lg font-medium">
            {error}
          </div>
        )}
        
        <Input
          label="Full name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus:ring-brand-500 focus:border-brand-500"
        />

        <Input
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-brand-500 focus:border-brand-500"
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-brand-500 focus:border-brand-500"
          />
          <div className="flex gap-4 pt-1 flex-wrap">
            <ValidationItem isValid={passwordValidation.length} text="8+ chars" />
            <ValidationItem isValid={passwordValidation.uppercase} text="Uppercase" />
            <ValidationItem isValid={passwordValidation.number} text="Number" />
            <ValidationItem isValid={passwordValidation.special} text="Special Char" />
          </div>
        </div>

        <Input
          label="Confirm password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`focus:ring-brand-500 focus:border-brand-500 ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
        
        {!passwordsMatch && confirmPassword.length > 0 && (
          <p className="text-red-500 text-[12px] font-medium mt-1">Passwords do not match</p>
        )}

        <div className="flex items-start gap-3 pt-2">
          <div className="flex items-center h-5 mt-0.5">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 rounded border-cloud-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
          <label htmlFor="terms" className="text-[13px] text-cloud-600 dark:text-cloud-400 cursor-pointer select-none leading-snug">
            I agree to the <a href="#" className="text-brand-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 font-medium hover:underline">Privacy Policy</a>.
          </label>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white disabled:opacity-50 disabled:hover:bg-[#4f46e5] rounded-xl shadow-lg shadow-indigo-500/25 transition-all" 
          isLoading={isLoading}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account ↗'}
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
        Sign up with Google
      </button>

      <div className="mt-6 flex items-center justify-center border-t border-cloud-100 pt-6">
        <div className="text-[14px] text-cloud-600 dark:text-cloud-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}


