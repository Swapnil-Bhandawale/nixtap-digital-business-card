import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardApi } from '../../api/cardApi';
import { publicApi } from '../../api/publicApi';
import { Mail, Phone, Globe, MapPin, Share2, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function PublicCard() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isApptOpen, setIsApptOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [leadState, setLeadState] = useState('idle');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadState('submitting');
    try {
      await publicApi.submitLead(cardId, {
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
      await publicApi.bookAppointment(cardId, {
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
      await publicApi.submitFeedback(cardId, {
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


  useEffect(() => {
    const fetchCard = async () => {
      try {
        const data = await cardApi.getPublicCard(cardId);
        setCard(data);
      } catch (error) {
        console.error('Failed to load public card', error);
        setCard(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [cardId]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading profile...</div>;
  if (!card) return <div className="min-h-screen flex items-center justify-center">Card not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pb-20 sm:py-10">
      <div className="w-full max-w-md bg-white sm:rounded-[2rem] shadow-2xl overflow-hidden relative">
        {/* Cover Photo area */}
        <div className="h-48 relative" style={{ backgroundColor: card.theme || card.themeColor || '#8b5cf6' }}>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-8 relative -mt-16 pb-8">
          <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg mx-auto flex items-center justify-center text-4xl font-bold overflow-hidden" style={{ color: card.theme || card.themeColor || '#8b5cf6' }}>
            {card.profileImageUrl ? (
              <img src={card.profileImageUrl} alt={card.fullName} className="w-full h-full object-cover" />
            ) : (
              card.fullName ? card.fullName.charAt(0).toUpperCase() : 'N'
            )}
          </div>
          
          <div className="text-center mt-6 space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{card.fullName}</h1>
            <p className="text-lg font-medium" style={{ color: card.theme || card.themeColor || '#8b5cf6' }}>{card.jobTitle}</p>
            <p className="text-gray-500 font-medium">{card.company}</p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {card.bio}
            </p>
          </div>

            <div className="px-8 mt-12 space-y-4">
              <Button className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
                Save Contact
              </Button>
              <Button onClick={() => setIsLeadOpen(true)} className="w-full h-14 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all bg-white border-2 text-gray-800" style={{ borderColor: card.themeColor || '#8b5cf6' }}>
                Exchange Contacts
              </Button>
              <Button onClick={() => setIsApptOpen(true)} className="w-full h-14 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all bg-white border-2 text-gray-800" style={{ borderColor: card.themeColor || '#8b5cf6' }}>
                Book an Appointment
              </Button>
              <Button onClick={() => setIsFeedbackOpen(true)} className="w-full h-14 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all bg-white border-2 text-gray-800" style={{ borderColor: card.themeColor || '#8b5cf6' }}>
                Leave Feedback
              </Button>
            </div>

          
          {/* Lead Capture Modal */}
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
                    <Button onClick={() => { setIsLeadOpen(false); setLeadState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
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
                      <Button type="submit" disabled={leadState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
                        {leadState === 'submitting' ? 'Sending...' : 'Send Details'}
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
                    <Button onClick={() => { setIsApptOpen(false); setApptState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
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
                      <Button type="submit" disabled={apptState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:shadow-md" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
                        {apptState === 'submitting' ? 'Sending Request...' : 'Send Request'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          <div className="mt-10 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact Info</h3>
            
            {card.email && (
              <a href={`mailto:${card.email}`} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${card.theme || card.themeColor || '#8b5cf6'}15`, color: card.theme || card.themeColor || '#8b5cf6' }}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="font-medium text-gray-900">{card.email}</p>
                </div>
              </a>
            )}
            
            {card.phone && (
              <a href={`tel:${card.phone}`} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${card.theme || card.themeColor || '#8b5cf6'}15`, color: card.theme || card.themeColor || '#8b5cf6' }}>
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="font-medium text-gray-900">{card.phone}</p>
                </div>
              </a>
            )}
            
            {card.website && (
              <a href={card.website} target="_blank" rel="noopener noreferrer" className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: `${card.theme || card.themeColor || '#8b5cf6'}15`, color: card.theme || card.themeColor || '#8b5cf6' }}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Website</p>
                  <p className="font-medium text-gray-900">{card.website.replace(/^https?:\/\//, '')}</p>
                </div>
              </a>
            )}
          </div>
        </div>
        
        <div className="py-6 text-center border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-medium text-gray-400">Powered by Nixtap</p>
        </div>
      </div>
    </div>
  );
}
