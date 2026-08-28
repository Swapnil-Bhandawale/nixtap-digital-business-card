import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User as UserIcon, Briefcase, Building2, MapPin, ArrowRight, Crown } from 'lucide-react';

import { apiClient as axiosInstance } from '../../api/axios';
import { SOCIAL_PLATFORMS } from '../../data/socialIcons';
import { LOCATION_DATA, DIAL_CODES, THEME_GRADIENTS } from '../../data/locationData';
import PhonePreview from './PhonePreview';
import Toast from '../ui/Toast';
import { useAuthStore } from '../../store/authStore';

function slugify(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function defaultForm(initial = {}) {
  return {
    firstName: initial.firstName ?? 'Aniket',
    middleName: initial.middleName ?? '',
    lastName: initial.lastName ?? 'Sharma',
    jobTitle: initial.jobTitle ?? 'Java Full Stack Developer',
    company: initial.company ?? 'NIXTAP',
    country: initial.country ?? 'India',
    state: initial.state ?? 'Maharashtra',
    city: initial.city ?? 'Pune',
    slug: initial.slug ?? 'aniket-sharma',
    slugManual: Boolean(initial.slug),
    email: initial.email ?? 'aniket@example.com',
    dial: initial.dial ?? '+91',
    phoneNumber: initial.phoneNumber ?? '9503334444',
    website: initial.website ?? '',
    bio: initial.bio ?? '',
    googleMaps: (initial.customFields && initial.customFields.googleMaps) ? initial.customFields.googleMaps : '',
    upi: (initial.customFields && initial.customFields.upi) ? initial.customFields.upi : '',
  };
}

export default function CardEditorForm({ mode = 'create', cardId = null, initial = {} }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';

  const [form, setForm] = useState(() => defaultForm(initial));
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl ?? null);
  const [bannerUrl, setBannerUrl] = useState(initial.bannerUrl ?? null);
  const [themeGradient, setThemeGradient] = useState(initial.themeGradient ?? THEME_GRADIENTS[0].value);
  const [socials, setSocials] = useState(initial.socials ?? {}); // key -> url
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2800);
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (form.slugManual) return;
    const full = [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' ');
    setForm((prev) => ({ ...prev, slug: slugify(full) }));
  }, [form.firstName, form.middleName, form.lastName]);

  useEffect(() => {
    if (mode === 'create') {
      const q = new URLSearchParams(window.location.search);
      const tid = q.get('templateId');
      if (tid) {
        axiosInstance.get('/templates').then(res => {
           const list = res.data?.data || [];
           const t = list.find(x => x.id === parseInt(tid, 10));
           if (t) {
             if (t.isPremium && !isPro) {
               navigate('/dashboard/premium');
               return;
             }
             if (t.defaultThemeColor) {
               setThemeGradient(`linear-gradient(135deg, ${t.defaultThemeColor} 0%, #312e81 100%)`);
             }
             if (t.previewImageUrl && !bannerUrl) {
               setBannerUrl(t.previewImageUrl);
             }
           }
        }).catch(err => console.error("Could not fetch templates config", err));
      }
    }
  }, [mode, navigate, isPro, bannerUrl]);

  const fullName = useMemo(
    () => [form.firstName, form.middleName, form.lastName].filter(Boolean).join(' '),
    [form.firstName, form.middleName, form.lastName]
  );

  const initials = useMemo(() => {
    const i = ((form.firstName[0] || '') + (form.lastName[0] || form.firstName[1] || '')).toUpperCase();
    return i || 'NX';
  }, [form.firstName, form.lastName]);

  const locationText = useMemo(() => {
    if (form.city && form.company) return `${form.city} • ${form.company}`;
    return form.city || form.company || '';
  }, [form.city, form.company]);

  const phoneCombined = useMemo(
    () => (form.phoneNumber ? `${form.dial} ${form.phoneNumber}` : ''),
    [form.dial, form.phoneNumber]
  );

  const states = useMemo(() => Object.keys(LOCATION_DATA[form.country] || {}), [form.country]);
  const cities = useMemo(
    () => LOCATION_DATA[form.country]?.[form.state] || [],
    [form.country, form.state]
  );

  const handleCountryChange = (country) => {
    const nextStates = Object.keys(LOCATION_DATA[country]);
    const nextState = nextStates[0];
    const nextCity = LOCATION_DATA[country][nextState][0];
    setForm((prev) => ({ ...prev, country, state: nextState, city: nextCity }));
  };
  const handleStateChange = (state) => {
    const nextCity = LOCATION_DATA[form.country][state][0];
    setForm((prev) => ({ ...prev, state, city: nextCity }));
  };

  const activeSocials = useMemo(
    () =>
      SOCIAL_PLATFORMS.filter((p) => socials[p.key]).map((p) => ({
        key: p.key,
        label: p.label,
        color: p.color,
        icon: p.icon,
        url: socials[p.key],
      })),
    [socials]
  );

  const toggleSocial = (key) => {
    setSocials((prev) => {
      const next = { ...prev };
      if (next[key] !== undefined) {
        delete next[key];
      } else {
        next[key] = '';
      }
      return next;
    });
  };
  const setSocialUrl = (key, url) => setSocials((prev) => ({ ...prev, [key]: url }));

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(await readFileAsDataUrl(file));
  };
  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUrl(await readFileAsDataUrl(file));
  };

  const syncSocialLinks = async (savedCardId) => {
    // Get existing
    const existingRes = await axiosInstance.get(`/cards/${savedCardId}/social-links`);
    const existing = existingRes.data?.data || [];
    // Delete all existing
    for (const link of existing) {
      await axiosInstance.delete(`/cards/${savedCardId}/social-links/${link.id}`);
    }
    // Add new
    for (const s of activeSocials) {
      await axiosInstance.post(`/cards/${savedCardId}/social-links`, {
        platform: s.key.toUpperCase(),
        url: s.url,
        displayOrder: 0
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const customFields = {
      country: form.country,
      state: form.state,
      city: form.city,
      website: form.website,
      googleMaps: form.googleMaps,
      upi: form.upi,
    };
    
    const query = new URLSearchParams(window.location.search);
    const templateId = parseInt(query.get('templateId') || '1', 10);

    const payload = {
      templateId,
      fullName,
      jobTitle: form.jobTitle,
      company: form.company,
      email: form.email,
      phone: phoneCombined,
      customSlug: form.slug,
      theme: themeGradient,
      profileImageUrl: avatarUrl,
      coverImageUrl: bannerUrl,
      customFields,
      bio: form.bio,
    };
    
    if (mode === 'edit') {
       payload.isPublished = true;
    }

    try {
      let savedCardId = cardId;
      if (mode === 'edit' && cardId) {
        await axiosInstance.put(`/cards/${cardId}`, payload);
      } else {
        const res = await axiosInstance.post('/cards', payload);
        savedCardId = res.data?.data?.id;
      }
      
      if (savedCardId) {
        await syncSocialLinks(savedCardId);
      }
      
      showToast('success', 'Card saved');
      setTimeout(() => navigate('/dashboard/cards'), 700);
    } catch (err) {
      let errorText = err.response?.data?.message || 'Could not save the card — check your backend connection.';
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const firstKey = Object.keys(fieldErrors)[0];
        errorText = `${firstKey}: ${fieldErrors[firstKey]}`;
      }
      showToast('error', errorText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#0f0f13]">
      {/* LEFT: phone preview */}
      <div className="lg:w-[40%] h-72 lg:h-auto flex-shrink-0">
        <PhonePreview
          avatarUrl={avatarUrl}
          bannerUrl={bannerUrl}
          themeGradient={themeGradient}
          fullName={fullName}
          jobTitle={form.jobTitle}
          locationText={locationText}
          initials={initials}
          email={form.email}
          phone={phoneCombined}
          website={form.website}
          socials={activeSocials}
        />
      </div>

      {/* RIGHT: editor */}
      <div className="flex-1 bg-white dark:bg-[#1e1e2a] overflow-y-auto px-6 sm:px-10 py-10 max-w-2xl">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 text-blue-700 dark:text-blue-400 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2.5">
            <Sparkles className="w-2.5 h-2.5" /> Live editor
          </span>
          <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {mode === 'edit' ? 'Edit your' : 'Design your'}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              NIXTAP card
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Every change reflects instantly on the phone preview
          </p>
        </div>

        {/* Media */}
        <Section title="Media">
          <div className="flex gap-2.5">
            <UploadBox label="Profile photo" onChange={handleAvatarUpload} />
            <UploadBox label="Cover banner" onChange={handleBannerUpload} />
          </div>
        </Section>

        {/* Theme */}
        <Section title="Card theme">
          <div className="flex gap-2 flex-wrap">
            {THEME_GRADIENTS.map((g) => (
              <button
                key={g.value}
                onClick={() => {
                  if (g.isPremium && !isPro) {
                    showToast('error', 'Upgrade to PRO to use premium themes! 💎');
                  } else {
                    setThemeGradient(g.value);
                  }
                }}
                aria-label="Select theme"
                className={`relative w-14 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                  themeGradient === g.value ? 'border-slate-900 dark:border-white' : 'border-transparent'
                }`}
                style={{ background: g.value }}
              >
                {g.isPremium && (
                  <div className="absolute -top-2 -right-2 bg-amber-400 text-white rounded-full p-0.5 shadow-md border border-white dark:border-slate-800" title="PRO Theme">
                    <Crown className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* Personal details */}
        <Section title="Personal details">
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <Field label="First name">
              <Input value={form.firstName} onChange={(v) => setField('firstName', v)} placeholder="First name" />
            </Field>
            <Field label="Middle name">
              <Input value={form.middleName} onChange={(v) => setField('middleName', v)} placeholder="Optional" />
            </Field>
            <Field label="Last name">
              <Input value={form.lastName} onChange={(v) => setField('lastName', v)} placeholder="Last name" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Field label="Job title" icon={Briefcase}>
              <Input value={form.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Job title" />
            </Field>
            <Field label="Company" icon={Building2}>
              <Input value={form.company} onChange={(v) => setField('company', v)} placeholder="Company" />
            </Field>
          </div>
          <Field label="Location" icon={MapPin} className="mt-3">
            <div className="grid grid-cols-3 gap-2.5">
              <Select value={form.country} onChange={handleCountryChange} options={Object.keys(LOCATION_DATA)} />
              <Select value={form.state} onChange={handleStateChange} options={states} />
              <Select value={form.city} onChange={(v) => setField('city', v)} options={cities} />
            </div>
          </Field>
          <Field label="Custom URL" className="mt-3">
            <div className="flex items-center bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[10px] overflow-hidden focus-within:border-blue-500/60">
              <span className="px-2.5 py-2.5 text-[11px] text-slate-500 dark:text-slate-400 border-r border-black/10 dark:border-white/10 whitespace-nowrap">
                nixtap.online/c/
              </span>
              <input
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value, slugManual: true }))}
                placeholder="your-name"
                className="flex-1 min-w-0 bg-transparent px-2.5 py-2.5 text-[13px] text-slate-900 dark:text-slate-100 outline-none"
              />
            </div>
          </Field>
        </Section>

        {/* Contact info */}
        <Section title="Contact info">
          <Field label="Email" icon={UserIcon}>
            <Input type="email" value={form.email} onChange={(v) => setField('email', v)} placeholder="you@example.com" />
          </Field>
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <Field label="Phone">
              <div className="flex items-center bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[10px] overflow-hidden focus-within:border-blue-500/60">
                <select
                  value={form.dial}
                  onChange={(e) => setField('dial', e.target.value)}
                  className="bg-transparent border-r border-black/10 dark:border-white/10 px-1.5 py-2.5 text-[13px] text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
                >
                  {DIAL_CODES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setField('phoneNumber', e.target.value)}
                  placeholder="9503334444"
                  className="flex-1 min-w-0 bg-transparent px-2.5 py-2.5 text-[13px] text-slate-900 dark:text-slate-100 outline-none"
                />
              </div>
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={(v) => setField('website', v)} placeholder="https://..." />
            </Field>
            
            <Field label="Bio (About me)" className="mt-3">
              <textarea 
                value={form.bio} 
                onChange={(e) => setField('bio', e.target.value)} 
                placeholder="Tell your clients about yourself..." 
                rows={3}
                className="w-full bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </Field>
            
            <Field label="Google Maps Link" className="mt-3">
              <Input value={form.googleMaps} onChange={(v) => setField('googleMaps', v)} placeholder="https://maps.google.com/..." />
            </Field>
            
            <Field label="UPI ID / Payment Link" className="mt-3">
              <Input value={form.upi} onChange={(v) => setField('upi', v)} placeholder="yourname@upi or https://razorpay.me/..." />
            </Field>
          </div>
        </Section>

        {/* Socials */}
        <Section title="Social links">
          <div className="grid grid-cols-4 gap-2">
            {SOCIAL_PLATFORMS.map((p) => {
              const isOn = socials[p.key] !== undefined;
              const isDarkBrand = p.color === '#000000' || p.color === '#24292e';
              return (
                <div
                  key={p.key}
                  onClick={() => toggleSocial(p.key)}
                  className={`cursor-pointer rounded-xl border px-1.5 py-2.5 flex flex-col items-center gap-1.5 text-[10px] font-medium transition-colors ${
                    isOn
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <span 
                    className="w-[18px] h-[18px] text-[var(--brand-color)] dark:text-[var(--brand-color-dark)]" 
                    style={{ '--brand-color': p.color, '--brand-color-dark': isDarkBrand ? '#ffffff' : p.color }}
                  >
                    {p.icon}
                  </span>
                  <span className={isOn ? 'text-blue-700 dark:text-blue-400' : ''}>{p.label}</span>
                  {isOn && (
                    <input
                      onClick={(e) => e.stopPropagation()}
                      value={socials[p.key]}
                      onChange={(e) => setSocialUrl(p.key, e.target.value)}
                      placeholder={p.placeholder}
                      className="w-full bg-black/[0.03] dark:bg-white/5 border border-black/[0.12] dark:border-white/10 rounded-[7px] px-1.5 py-1 text-[10px] text-slate-900 dark:text-slate-100 outline-none mt-0.5"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white font-bold text-[13px] px-7 py-3 rounded-[20px] shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Save card'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {title}
        </span>
        <span className="flex-1 h-px bg-black/[0.08] dark:bg-white/[0.08]" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, icon: Icon, className = '', children }) {
  return (
    <div className={`mb-3 last:mb-0 ${className}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[10px] px-3 py-2.5 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-blue-500/60 transition-colors"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#f8f9fc] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[10px] px-2 py-2.5 text-xs text-slate-900 dark:text-slate-100 outline-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function UploadBox({ label, onChange }) {
  const inputRef = useRef(null);
  const icons = {
    'Profile photo': (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" fill="none" stroke="currentColor" className="w-4 h-4">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    'Cover banner': (
      <svg viewBox="0 0 24 24" strokeWidth="1.5" fill="none" stroke="currentColor" className="w-4 h-4">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M3 13l4-4 4 4 4-6 4 4" />
      </svg>
    ),
  };
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex-1 h-16 bg-black/[0.02] dark:bg-white/[0.03] border border-dashed border-black/[0.15] dark:border-white/20 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:bg-blue-500/[0.06] hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {icons[label]}
      {label}
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </button>
  );
}

