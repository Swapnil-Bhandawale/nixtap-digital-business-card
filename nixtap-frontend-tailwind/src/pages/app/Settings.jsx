import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  User, Lock, Bell, Palette, Shield, Save, Sun, Moon, 
  CreditCard, Calendar, Users, EyeOff, BarChart2, DollarSign, 
  Link, AlertTriangle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { apiClient as axiosInstance } from '../../api/axios';
import Toast from '../../components/ui/Toast';

export default function Settings() {
  const { user, fetchUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarBase64, setAvatarBase64] = useState(user?.avatarBase64 || '');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      showToast('error', 'Image size should be less than 1MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put('/users/me', { fullName, phone, avatarBase64 });
      await fetchUser(); // Sync auth store with latest DB state
      showToast('success', 'Profile updated successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto">
      <Toast toast={toast} />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-cloud-900 dark:text-white">Settings</h2>
        <p className="text-cloud-500 dark:text-cloud-400 mt-1">Manage your account preferences and system integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <nav className="glass dark:glass-dark rounded-[24px] p-3 flex flex-col gap-1.5 h-full max-h-[80vh] overflow-y-auto">
            <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Account & Security" />
            <TabButton active={activeTab === 'digital-card'} onClick={() => setActiveTab('digital-card')} icon={CreditCard} label="Digital Card" />
            <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={Palette} label="Appearance" />
            <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notifications" />
            
            <div className="my-2 border-t border-slate-200/50 dark:border-slate-700/50"></div>
            
            <TabButton active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={Calendar} label="Appointments" />
            <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={Users} label="Leads" />
            <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={BarChart2} label="Analytics" />
            
            <div className="my-2 border-t border-slate-200/50 dark:border-slate-700/50"></div>
            
            <TabButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} icon={EyeOff} label="Privacy" />
            <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={DollarSign} label="Subscription & Billing" />
            <TabButton active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} icon={Link} label="Integrations" />
            
            <div className="my-2 border-t border-slate-200/50 dark:border-slate-700/50"></div>
            
            <TabButton active={activeTab === 'danger'} onClick={() => setActiveTab('danger')} icon={AlertTriangle} label="Danger Zone" isDanger />
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="glass dark:glass-dark rounded-[32px] p-8 min-h-[600px] shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Account Profile</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your account's profile information and email address.</p>
                </div>
                
                <div className="flex items-center gap-6 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md overflow-hidden relative group">
                    {avatarBase64 ? (
                      <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.fullName?.charAt(0) || 'U'
                    )}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <span className="text-xs text-white">Edit</span>
                      <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <label className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-colors cursor-pointer inline-block">
                      Upload Avatar
                      <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                    <p className="text-xs text-slate-400 mt-2 font-medium">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 transition-colors shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 transition-colors shadow-sm" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email Address</label>
                    <input type="email" value={user?.email || ''} readOnly className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed" />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Account & Security</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password, 2FA, and security preferences.</p>
                </div>
                
                <div className="space-y-5 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors shadow-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md transition-all active:scale-95">
                    <Lock className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'digital-card' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Digital Card Settings</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure global defaults for your digital NFC cards.</p>
                </div>
                
                <div className="space-y-4">
                  <ToggleOption title="Auto-save to Contacts" description="Prompt visitors to download your vCard automatically." defaultChecked={true} />
                  <ToggleOption title="NFC Tap Vibration" description="Enable haptic feedback when card is tapped." defaultChecked={true} />
                  <ToggleOption title="Show 'Powered by Nixtap'" description="Display the Nixtap branding on your public card." defaultChecked={user?.planType === 'FREE'} disabled={user?.planType === 'FREE'} badge={user?.planType === 'FREE' ? 'PRO Feature' : null} />
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Appearance</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customize how NIXTAP dashboard looks on your device.</p>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Theme Preference</label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 bg-white dark:bg-slate-800/50'}`}>
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shadow-sm"><Sun className="w-6 h-6" /></div>
                      <span className="font-bold text-slate-900 dark:text-white">Light Mode</span>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 bg-white dark:bg-slate-800/50'}`}>
                      <div className="w-12 h-12 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 shadow-sm"><Moon className="w-6 h-6" /></div>
                      <span className="font-bold text-slate-900 dark:text-white">Dark Mode</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notification Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Choose what updates you want to receive.</p>
                </div>
                
                <div className="space-y-4">
                  <ToggleOption title="Email Notifications" description="Receive emails about new leads and appointments." defaultChecked={true} />
                  <ToggleOption title="Push Notifications" description="Receive push notifications in your browser." defaultChecked={false} />
                  <ToggleOption title="Marketing Emails" description="Receive emails about new features and updates." defaultChecked={true} />
                  <ToggleOption title="Weekly Summary" description="Receive a weekly analytics digest." defaultChecked={false} />
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Appointment Defaults</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure global booking rules for all your cards.</p>
                </div>
                
                <div className="space-y-4">
                  <ToggleOption title="Auto-Accept Appointments" description="Automatically accept all incoming meeting requests." defaultChecked={false} />
                  <ToggleOption title="Send Reminder Emails" description="Send automated reminders 24h before meeting." defaultChecked={true} />
                </div>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Lead Capture Settings</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure how you collect contact information.</p>
                </div>
                
                <div className="space-y-4">
                  <ToggleOption title="Require Phone Number" description="Make phone number mandatory in the lead form." defaultChecked={false} />
                  <ToggleOption title="Auto-Reply Email" description="Send a welcome email when a lead is captured." defaultChecked={true} />
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Privacy & Visibility</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Control who can see your digital footprint.</p>
                </div>
                
                <div className="space-y-4">
                  <ToggleOption title="Search Engine Indexing" description="Allow Google to index your public digital cards." defaultChecked={true} />
                  <ToggleOption title="Hide from Directory" description="Hide your profile from the global Nixtap directory." defaultChecked={false} />
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analytics & Tracking</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configure third-party tracking pixels.</p>
                </div>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Google Analytics ID</label>
                    <input type="text" placeholder="G-XXXXXXXXXX" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors shadow-sm" disabled={user?.planType === 'FREE'} />
                    {user?.planType === 'FREE' && <p className="text-xs text-amber-600 font-medium mt-1">Upgrade to PRO to unlock</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Meta Pixel ID</label>
                    <input type="text" placeholder="1234567890" className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 transition-colors shadow-sm" disabled={user?.planType === 'FREE'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Subscription & Billing</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your Nixtap plan and billing details.</p>
                </div>
                
                <div className="p-6 border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Current Plan: <span className="text-brand-600 dark:text-brand-400 uppercase tracking-wider">{user?.planType || 'FREE'}</span></h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">You are currently on the {user?.planType || 'FREE'} tier.</p>
                  </div>
                  <button onClick={() => navigate('/dashboard/premium')} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                    Upgrade Plan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Integrations</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Connect Nixtap with your favorite tools.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Salesforce', 'HubSpot', 'Zapier', 'Mailchimp'].map(tool => (
                    <div key={tool} className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between bg-white dark:bg-slate-800/50">
                      <span className="font-bold text-slate-900 dark:text-white">{tool}</span>
                      <button className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible and destructive actions.</p>
                </div>
                
                <div className="p-6 border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 rounded-2xl">
                  <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-1">Delete Account</h4>
                  <p className="text-sm text-rose-700/80 dark:text-rose-400/80 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                <button onClick={() => showToast('error', 'Please contact support to permanently delete your account.')} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95">
                    Delete My Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, isDanger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm w-full ${
        active 
          ? (isDanger ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shadow-sm' : 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 shadow-sm')
          : (isDanger ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20' : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white')
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? (isDanger ? 'text-rose-600 dark:text-rose-400' : 'text-brand-500') : (isDanger ? 'text-rose-500' : 'text-slate-400')}`} />
      {label}
    </button>
  );
}

function ToggleOption({ title, description, defaultChecked, disabled, badge }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className={`flex items-center justify-between py-4 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0 ${disabled ? 'opacity-50 grayscale' : ''}`}>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
          {badge && <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{badge}</span>}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      <button 
        onClick={() => !disabled && setChecked(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}
