import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

import { apiClient as axiosInstance } from '../../api/axios';
import CardEditorForm from '../../components/cardEditor/CardEditorForm';
import { DIAL_CODES } from '../../data/locationData';

function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
    middleName: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
  };
}

function splitPhone(phone = '') {
  const dial = DIAL_CODES.find((c) => phone.startsWith(c));
  if (dial) return { dial, phoneNumber: phone.slice(dial.length).trim() };
  return { dial: '+91', phoneNumber: phone };
}

export default function EditCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let active = true;
    axiosInstance
      .get(`/cards/${id}`)
      .then((res) => {
        if (!active) return;
        const card = res.data?.data ?? {};
        const { firstName, middleName, lastName } = splitName(card.fullName);
        const { dial, phoneNumber } = splitPhone(card.phone);
        const socials = {};
        (card.socialLinks || []).forEach((s) => {
          if (s.platform) socials[s.platform.toLowerCase()] = s.url;
        });
        const customFields = card.customFields || {};
        setInitial({
          firstName,
          middleName,
          lastName,
          jobTitle: card.jobTitle || '',
          company: card.company || '',
          country: customFields.country || 'India',
          state: customFields.state || 'Maharashtra',
          city: customFields.city || 'Pune',
          slug: card.customSlug || '',
          email: card.email || '',
          dial,
          phoneNumber,
          website: customFields.website || '',
          themeGradient: card.theme || null,
          avatarUrl: card.profileImageUrl || null,
          bannerUrl: card.coverImageUrl || null,
          socials,
        });
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f13]">
        <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f13] px-6">
        <div className="text-center bg-slate-50 dark:bg-[#1e1e2a] border border-black/[0.06] dark:border-white/[0.08] rounded-3xl py-16 px-8 max-w-md">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">Could not load this card</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Check your backend connection and try again.
          </p>
          <button
            onClick={() => navigate('/dashboard/cards')}
            className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-violet-600 px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Back to your cards
          </button>
        </div>
      </div>
    );
  }

  return <CardEditorForm mode="edit" cardId={id} initial={initial} />;
}

