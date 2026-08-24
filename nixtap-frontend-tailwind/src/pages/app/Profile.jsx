import { useEffect, useState, useCallback } from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

import { apiClient as axiosInstance } from '../../api/axios';
import Toast from '../../components/ui/Toast';

const ROLE_LABELS = { ADMIN: 'Admin', USER: 'Member' };
const PROVIDER_LABELS = { LOCAL: 'Email & password', GOOGLE: 'Google' };


function FieldSkeleton() {
  return <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse" />;
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('loading');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const fetchProfile = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await axiosInstance.get('/users/me');
      const data = res.data?.data;
      if (!data) throw new Error('empty');
      setUser(data);
      setFullName(data.fullName ?? '');
      setPhone(data.phone ?? '');
      setIsDemo(false);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load profile', err);
      setUser(null);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const hasChanges = user && (fullName !== (user.fullName ?? '') || phone !== (user.phone ?? ''));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put('/users/me', { fullName, phone });
      setUser(res.data?.data ?? { ...user, fullName, phone });
      showToast('success', 'Profile updated');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] dark:bg-[#0f0f13]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Account settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your Nixtap account details</p>
          </div>
        </div>

        {/* Premium Upsell Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-indigo-500/20 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👑</span>
              <h3 className="text-lg font-bold text-white">Nixtap Premium</h3>
            </div>
            <p className="text-indigo-200 text-sm font-medium">You're currently using the Free plan. Elevate your networking game.</p>
          </div>
          <a href="/dashboard/premium" className="shrink-0 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
            Upgrade to Premium
          </a>
        </div>


        <div className="bg-white dark:bg-[#1e1e2a] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-7 pb-7 border-b border-black/[0.05] dark:border-white/[0.06]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {status === 'ready' ? (fullName?.[0] || 'N').toUpperCase() : ''}
            </div>
            <div className="min-w-0">
              {status === 'loading' ? (
                <div className="h-4 w-32 bg-slate-100 dark:bg-white/5 rounded-full animate-pulse mb-2" />
              ) : (
                <div className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{fullName}</div>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {status === 'ready' && (
                  <>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> {ROLE_LABELS[user?.role] || user?.role}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full">
                      {PROVIDER_LABELS[user?.authProvider] || user?.authProvider}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <User className="w-3.5 h-3.5" /> Full name
              </label>
              {status === 'loading' ? (
                <FieldSkeleton />
              ) : (
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/[0.07] transition-colors"
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              {status === 'loading' ? (
                <FieldSkeleton />
              ) : (
                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 border border-black/[0.06] dark:border-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Not editable</span>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              {status === 'loading' ? (
                <FieldSkeleton />
              ) : (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-white/[0.07] transition-colors"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end mt-7 pt-6 border-t border-black/[0.05] dark:border-white/[0.06]">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving || status === 'loading'}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

