import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardApi } from '../../api/cardApi';
import { publicApi } from '../../api/publicApi';
import { Mail, Phone, Globe, MapPin, Share2, Download, Calendar, BookOpen, MessageSquare, IndianRupee } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SOCIAL_PLATFORMS } from '../../data/socialIcons';
import { QRCodeSVG } from 'qrcode.react';



const ensureAbsoluteUrl = (url, platform) => {
  if (!url) return '#';
  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('@')) cleanUrl = cleanUrl.substring(1);
  
  if (platform === 'whatsapp') {
    cleanUrl = cleanUrl.replace(/[^0-9]/g, '');
    return 'https://wa.me/' + cleanUrl;
  }
  
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('mailto:') || cleanUrl.startsWith('tel:') || cleanUrl.startsWith('upi://')) {
    return cleanUrl;
  }
  
  if (!cleanUrl.includes('.') || !cleanUrl.includes('/')) {
    if (platform === 'instagram') return 'https://instagram.com/' + cleanUrl;
    if (platform === 'twitter') return 'https://twitter.com/' + cleanUrl;
    if (platform === 'github') return 'https://github.com/' + cleanUrl;
    if (platform === 'linkedin') return 'https://linkedin.com/in/' + cleanUrl;
    if (platform === 'facebook') return 'https://facebook.com/' + cleanUrl;
    if (platform === 'youtube') {
      if (cleanUrl.startsWith('UC') && cleanUrl.length === 24) {
        return 'https://youtube.com/channel/' + cleanUrl;
      }
      return 'https://youtube.com/@' + cleanUrl;
    }
  }
  
  return 'https://' + cleanUrl;
};

export default function PublicCard() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const [isApptOpen, setIsApptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [leadState, setLeadState] = useState('idle');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadState('submitting');
    try {
      await publicApi.submitLead(card.id, {
        visitorName: leadForm.name,
        visitorEmail: leadForm.email,
        visitorPhone: leadForm.phone,
        message: leadForm.message
      });
      setLeadState('success');
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setLeadState('error');
    }
  };

  const [apptState, setApptState] = useState('idle');
  const [apptForm, setApptForm] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '' });

  const handleApptSubmit = async (e) => {
    e.preventDefault();
    setApptState('submitting');
    try {
      const requestedDatetime = new Date(`${apptForm.date}T${apptForm.time}`).toISOString();
      await publicApi.bookAppointment(card.id, {
        visitorName: apptForm.name,
        visitorEmail: apptForm.email,
        visitorPhone: apptForm.phone,
        message: apptForm.message,
        requestedDatetime
      });
      setApptState('success');
      setApptForm({ name: '', email: '', phone: '', date: '', time: '', message: '' });
    } catch (err) {
      console.error(err);
      setApptState('error');
    }
  };

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState('idle');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', rating: 5, comment: '' });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackState('submitting');
    try {
      await publicApi.submitFeedback(card.id, {
        visitorName: feedbackForm.name,
        visitorEmail: feedbackForm.email,
        rating: feedbackForm.rating,
        comment: feedbackForm.comment
      });
      setFeedbackState('success');
      setFeedbackForm({ name: '', email: '', rating: 5, comment: '' });
    } catch (err) {
      console.error(err);
      setFeedbackState('error');
    }
  };


  
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // Custom theme colors for buttons based on card theme
  const themeColor = card?.themeColor || card?.theme || '#2563eb';
  const accentColor = React.useMemo(() => {
    if (!themeColor) return '#3b82f6';
    if (themeColor.startsWith('#')) return themeColor;
    const match = themeColor.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    return match ? match[0] : '#3b82f6';
  }, [themeColor]);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await cardApi.getPublicCard(cardId);
        const data = res?.data || res;
        setCard(data);
        if (data?.fullName || data?.title) {
          document.title = `${data.fullName || data.title} - Nixtap Digital Card`;
        }
        
        // Fetch feedbacks
        try {
           const fbs = await publicApi.getFeedbacks(data.id);
           setFeedbacks(fbs?.data || []);
        } catch(e) {
           console.log("Feedbacks not found", e);
        }
          // Record View once
          if (data && data.id) {
            const viewKey = `viewed_${data.id}`;
            if (!localStorage.getItem(viewKey)) {
              publicApi.recordView(data.id).catch(e => console.error(e));
              localStorage.setItem(viewKey, 'true');
            }
          }
        } catch (error) {

        console.error('Failed to load public card', error);
        setCard(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [cardId]);

  const handleSaveContact = () => {
    let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
    if (card.fullName) vcard += `FN:${card.fullName}\nN:${card.fullName};;;;\n`;
    if (card.company) vcard += `ORG:${card.company}\n`;
    if (card.jobTitle) vcard += `TITLE:${card.jobTitle}\n`;
    if (card.phone) vcard += `TEL;TYPE=CELL:${card.phone}\n`;
    if (card.email) vcard += `EMAIL;TYPE=WORK,INTERNET:${card.email}\n`;
    if (card.bio) vcard += `NOTE:${card.bio.replace(/\n/g, '\\n')}\n`;
    vcard += `URL:${window.location.href}\n`;
    
    if (card.profileImageUrl) {
      vcard += `PHOTO;VALUE=URI:${card.profileImageUrl}\n`;
    }
    
    if (card.socialLinks && card.socialLinks.length > 0) {
      card.socialLinks.forEach((link, idx) => {
        vcard += `item${idx+1}.URL:${ensureAbsoluteUrl(link.url, link.platform)}\n`;
        vcard += `item${idx+1}.X-ABLabel:${link.platform}\n`;
      });
    }
    
    let mapAdded = false;
    if (card.customFields) {
      if (card.customFields.googleMaps) {
        vcard += `itemMap.URL:${ensureAbsoluteUrl(card.customFields.googleMaps, 'map')}\n`;
        vcard += `itemMap.X-ABLabel:Location\n`;
        mapAdded = true;
      }
      
      const city = card.customFields.city || '';
      const state = card.customFields.state || '';
      const country = card.customFields.country || '';
      if (city || state || country) {
        vcard += `ADR;TYPE=HOME:;;;${city};${state};;${country}\n`;
      }
      
      if (card.customFields.website) {
        vcard += `URL:${ensureAbsoluteUrl(card.customFields.website, 'website')}\n`;
      }
    }
    
    vcard += `END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = + 'contact.vcf';
    if(card.fullName) { a.download = card.fullName.replace(/\s+/g, '_') + '.vcf'; }
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading profile...</div>;
  if (!card) return <div className="min-h-screen flex items-center justify-center">Card not found</div>;

    return (
    <div className="min-h-screen bg-[#f3f4f6] flex justify-center antialiased">
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl relative overflow-y-auto pb-20">
        
        {/* Cover Photo */}
        <div className="relative h-48 w-full bg-gray-200" style={{ background: card.themeColor || card.theme || '#8b5cf6' }}>
          {card.coverImageUrl && (
            <img src={card.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
          )}
          
          <div className="absolute top-4 right-4 z-10">
            <button onClick={() => setIsQrOpen(true)} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition shadow-lg">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
                <div className="px-6 relative -mt-16 flex flex-col items-center">
          
          {/* Avatar with Logo */}
          <div className="relative mb-3 inline-block">
            <div className="w-[124px] h-[124px] rounded-full border-[5px] border-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] overflow-hidden bg-white flex items-center justify-center text-4xl font-bold" style={{ color: accentColor }}>
              {card.profileImageUrl ? (
                <img src={card.profileImageUrl} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                card.fullName ? card.fullName.charAt(0).toUpperCase() : 'N'
              )}
            </div>
            {card.customFields?.companyLogo && (
               <div className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                 <img src={card.customFields.companyLogo} alt="Logo" className="w-full h-full object-cover" />
               </div>
            )}
          </div>

          {/* Name & Details */}
          <h1 className="text-[22px] font-bold text-slate-800 mb-1 flex items-center gap-1.5 text-center mt-3 justify-center">
            {card.fullName}
            <svg className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </h1>
          <p className="text-[15px] font-medium text-slate-500 mb-0.5 text-center">{card.jobTitle}</p>
          <p className="text-[13px] text-slate-500 font-medium mb-6 flex items-center justify-center gap-1.5 text-center">
            <MapPin className="w-3 h-3 shrink-0" />
            {card.customFields?.city || ''}{card.customFields?.city && card.customFields?.country ? ', ' : ''}{card.customFields?.country || ''} 
            {(card.customFields?.city || card.customFields?.country) && card.company ? ' • ' : ''} 
            {card.company}
          </p>

          {/* Primary Action Buttons */}
          <div className="w-full flex gap-3 mb-8">
            <button onClick={handleSaveContact} className={`flex-1 py-3.5 rounded-full text-white font-bold text-[15px] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${isSaved ? '!bg-emerald-500' : ''}`} style={!isSaved ? { background: themeColor, shadowcolor: accentColor } : {}}>
                {isSaved ? <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <Download className="w-4 h-4" />}
                {isSaved ? 'Saved!' : 'Save Contact'}
              </button>
            <button onClick={() => setIsApptOpen(true)} className="w-[52px] h-[52px] rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform active:scale-[0.98] shadow-sm group" style={{ color: accentColor }}>
              <Calendar className="w-5 h-5 transition-colors" />
            </button>
          </div>

          {/* ABOUT Section */}
          {card.bio && (
            <div className="w-full mb-8">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-4">About</h3>
              <p className="text-[14px] text-slate-800 leading-relaxed text-center whitespace-pre-wrap">
                {card.bio}
              </p>
            </div>
          )}

          {/* SOCIALS Section */}
          {card.socialLinks && card.socialLinks.length > 0 && (
            <div className="w-full mb-10">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Socials</h3>
              <div className="grid grid-cols-4 gap-y-5 gap-x-4 justify-items-center px-2">
                {card.socialLinks.map((link) => {
                  const platformData = SOCIAL_PLATFORMS.find(p => p.key === link.platform.toLowerCase());
                  if (!platformData) return null;
                  return (
                    <a key={link.id} href={ensureAbsoluteUrl(link.url, platformData.key)} target="_blank" rel="noopener noreferrer" className="w-[64px] h-[64px] bg-white border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-slate-200 rounded-[20px] flex items-center justify-center transition-all transform hover:-translate-y-1 group" style={{ color: platformData.color }}>
                      <div className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full group-hover:scale-110 transition-transform">
                        {platformData.icon}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTIONS Section (Grid) */}
          <div className="w-full mb-8">
            <div className="grid grid-cols-2 gap-3 mb-3">
              {card.customFields?.googleMaps && (
                <a href={ensureAbsoluteUrl(card.customFields.googleMaps)} target="_blank" rel="noopener noreferrer" className="w-full flex flex-col items-center justify-center bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] transition-all p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] group gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors shrink-0 shadow-inner">
                    <img src="https://img.icons8.com/color/48/google-maps-new.png" alt="Google Maps" className="w-7 h-7 transition-all duration-300 group-hover:brightness-0 group-hover:invert" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[13px] leading-tight">Navigate<br/>to Office</span>
                </a>
              )}
              {card.customFields?.upi && (
                <button onClick={() => setIsPaymentOpen(true)} className="w-full flex flex-col items-center justify-center bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] transition-all p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] group gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors shrink-0 shadow-inner">
                    <IndianRupee className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-800 text-[13px] leading-tight">Make a<br/>Payment</span>
                </button>
              )}
              <button onClick={() => setIsLeadOpen(true)} className="w-full flex flex-col items-center justify-center bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] transition-all p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] group gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors shrink-0 shadow-inner">
                  <BookOpen className="w-5 h-5 group-hover:text-white transition-colors" style={{ color: accentColor }} />
                </div>
                <span className="font-semibold text-slate-800 text-[13px] leading-tight">Exchange<br/>Contacts</span>
              </button>
              <button onClick={() => setIsApptOpen(true)} className="w-full flex flex-col items-center justify-center bg-white border border-slate-100 hover:border-blue-200 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] transition-all p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] group gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-500 transition-colors shrink-0 shadow-inner">
                  <Calendar className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-slate-800 text-[13px] leading-tight">Book an<br/>Appointment</span>
              </button>
            </div>

            <button onClick={() => setIsFeedbackOpen(true)} className="w-full relative flex items-center justify-center bg-white border border-slate-100 hover:border-orange-200 hover:shadow-[0_8px_20px_rgb(0,0,0,0.04)] transition-all px-4 py-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] group gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors shrink-0">
                <MessageSquare className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-slate-800 text-[15px]">Leave Feedback</span>
              <svg className="w-3 h-3 text-slate-300 group-hover:text-orange-500 transition-colors absolute right-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Wall of Love Section */}
          {feedbacks && feedbacks.length > 0 && (
            <div className="w-full mb-10">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Wall of Love ❤️</h3>
              <div className="relative h-[250px] overflow-hidden rounded-[24px] bg-slate-50/50 border border-slate-100 shadow-inner p-4">
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#f8fafc] to-transparent z-10 pointer-events-none rounded-t-[24px]"></div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#f8fafc] to-transparent z-10 pointer-events-none rounded-b-[24px]"></div>
                <div className="animate-ticker-vertical flex flex-col gap-4">
                  {feedbacks.map((fb, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3 snap-start w-full mx-auto">
                      <div className="flex gap-1 text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                      </div>
                      <p className="text-[13.5px] text-slate-700 leading-relaxed font-medium italic">"{fb.comment}"</p>
                      {fb.imageUrl && (
                        <div className="w-full h-32 rounded-xl overflow-hidden mt-1">
                          <img src={fb.imageUrl} alt="Feedback" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                          {fb.visitorName ? fb.visitorName.charAt(0) : 'A'}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{fb.visitorName || 'Anonymous'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
{/* Footer Branding */}
        <div className="mt-4 pb-6 flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mb-1">Create your own</p>
            <p className="text-sm font-bold text-[#111827] tracking-tight">Nixtap Profile</p>
          </div>
        </div>

        {/* MODALS */}
        {/* Lead Capture Modal */}
                {/* Payment Modal */}
      {isPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPaymentOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Make a Payment</h2>
              <button onClick={() => setIsPaymentOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center overflow-y-auto">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <QRCodeSVG value={card.customFields.upi.includes('://') ? card.customFields.upi : `upi://pay?pa=${card.customFields.upi}`} size={200} />
              </div>
              <p className="text-sm text-slate-500 mb-2">Scan with any UPI app</p>
              <p className="text-lg font-bold text-slate-800 mb-6">{card.customFields.upi}</p>
              
              <a href={card.customFields.upi.includes('://') ? card.customFields.upi : `upi://pay?pa=${card.customFields.upi}`} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors flex justify-center items-center gap-2">
                <IndianRupee className="w-4 h-4" /> Open UPI App
              </a>
            </div>
          </div>
        </div>
      )}

      {isLeadOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">Exchange Contacts</h2>
                  <button onClick={() => setIsLeadOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {leadState === 'success' ? (
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Sent!</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">{card.fullName} has received your information.</p>
                    <Button onClick={() => { setIsLeadOpen(false); setLeadState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ background: card.themeColor || '#8b5cf6', color: '#fff' }}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                      {leadState === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
                          Failed to send. Please try again.
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name *</label>
                        <input type="text" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                          <input type="email" required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} placeholder="jane@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                          <input type="tel" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                        <textarea value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} placeholder="Any message?" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                      <Button type="submit" disabled={leadState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70" style={{ background: card.themeColor || '#8b5cf6', color: '#fff' }}>
                        {leadState === 'submitting' ? 'Sending...' : 'Send Details'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        
                {/* QR Code Modal */}
        {isQrOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[320px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Scan to Connect</h2>
                <button onClick={() => setIsQrOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-white border border-gray-100 shadow-sm rounded-xl p-2 mb-4">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(card.shareableUrl || window.location.href)}`} alt="QR Code" className="w-full h-full object-cover rounded-lg" />
                </div>
                <p className="text-sm font-semibold text-slate-800">{card.fullName}</p>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-full px-2 mb-6">{card.shareableUrl || window.location.href}</p>
                <div className="flex gap-3 w-full">
                  <Button onClick={() => {
                    navigator.clipboard.writeText(card.shareableUrl || window.location.href);
                    alert("Link copied to clipboard!");
                  }} className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Copy Link
                  </Button>
                  {navigator.share && (
                    <Button onClick={() => {
                      navigator.share({
                        title: `${card.fullName}'s Digital Business Card`,
                        url: card.shareableUrl || window.location.href
                      }).catch(console.error);
                    }} className="flex-1 py-2 text-sm font-semibold rounded-xl text-white" style={{ background: themeColor }}>
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Leave Feedback</h2>
                  <p className="text-sm text-gray-500 mt-1">Share your experience with {card.fullName}</p>
                </div>
                <button onClick={() => setIsFeedbackOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {feedbackState === 'success' ? (
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">Your feedback has been submitted successfully.</p>
                    <Button onClick={() => { setIsFeedbackOpen(false); setFeedbackState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ background: themeColor, color: '#fff' }}>
                      Done
                    </Button>
                  </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="flex flex-col flex-1 overflow-hidden">
                  <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                    {feedbackState === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
                          Failed to submit. Please try again.
                        </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Rating</label>
                      <div className="flex gap-2 text-3xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} onClick={() => setFeedbackForm({...feedbackForm, rating: star})} className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name *</label>
                      <input type="text" required value={feedbackForm.name} onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})} placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': themeColor }} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Review / Comment</label>
                      <textarea value={feedbackForm.comment} onChange={e => setFeedbackForm({...feedbackForm, comment: e.target.value})} placeholder="Write your experience..." rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none" style={{ '--tw-ring-color': themeColor }}></textarea>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                    <Button type="submit" disabled={feedbackState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl text-white shadow-md hover:opacity-90 transition-all disabled:opacity-70" style={{ background: themeColor }}>
                      {feedbackState === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Appointment Booking Modal */}
          {isApptOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
                    <p className="text-sm text-gray-500 mt-1">Schedule a meeting with {card.fullName}</p>
                  </div>
                  <button onClick={() => setIsApptOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors">
                    <span className="sr-only">Close</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                
                {apptState === 'success' ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center flex-1">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">Your appointment request is pending confirmation. {card.fullName} will review it shortly.</p>
                    <Button onClick={() => { setIsApptOpen(false); setApptState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ background: card.themeColor || '#8b5cf6', color: '#fff' }}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleApptSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                      {apptState === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
                          Failed to send request. Please try again.
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Date *</label>
                          <input type="date" required value={apptForm.date} onChange={e => setApptForm({...apptForm, date: e.target.value})} min={new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Time *</label>
                          <input type="time" required value={apptForm.time} onChange={e => setApptForm({...apptForm, time: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name *</label>
                        <input type="text" required value={apptForm.name} onChange={e => setApptForm({...apptForm, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-gray-400" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                          <input type="email" required value={apptForm.email} onChange={e => setApptForm({...apptForm, email: e.target.value})} placeholder="jane@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-gray-400" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                          <input type="tel" value={apptForm.phone} onChange={e => setApptForm({...apptForm, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-gray-400" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                        <textarea value={apptForm.message} onChange={e => setApptForm({...apptForm, message: e.target.value})} placeholder="What would you like to discuss?" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder-gray-400 resize-none" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                      <Button type="submit" disabled={apptState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:shadow-md" style={{ background: card.themeColor || '#8b5cf6', color: '#fff' }}>
                        {apptState === 'submitting' ? 'Sending Request...' : 'Send Request'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}



