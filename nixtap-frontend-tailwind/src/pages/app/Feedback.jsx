import { useEffect, useState, useCallback, useMemo } from 'react';
import { Star, MessageSquare, Image as ImageIcon, Camera } from 'lucide-react';
import { apiClient as axiosInstance } from '../../api/axios';
import CardSelector from '../../components/dashboard/CardSelector';
import EmptyState from '../../components/dashboard/EmptyState';
import { useAuthStore } from '../../store/authStore';

function ReviewCard({ feedback }) {
  const dateStr = new Date(feedback.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow mb-6 mx-2">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">{feedback.visitorName || 'Anonymous'}</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{dateStr}</span>
        </div>
        <div className="flex gap-0.5 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
          ))}
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
        {feedback.comment || "No comment left."}
      </p>
    </div>
  );
}

function MediaCard({ feedback }) {
  return (
    <div className="relative group rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-6 break-inside-avoid shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <img src={feedback.imageUrl} alt="Customer feedback" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <h4 className="font-bold text-white mb-1">{feedback.visitorName || 'Anonymous'}</h4>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
          ))}
        </div>
        <p className="text-white/90 text-xs line-clamp-2 leading-relaxed">{feedback.comment}</p>
      </div>
    </div>
  );
}

export default function Feedback() {
  const { user } = useAuthStore();
  
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeTab, setActiveTab] = useState('reviews');

  const fetchCards = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/cards');
      const list = res.data?.data ?? [];
      if (list.length === 0) throw new Error('empty');
      setCards(list);
      setCardId(list[0].id.toString());
    } catch (err) {
      setCards([]);
      setStatus('error');
    }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const loadFeedback = useCallback(async () => {
    if (!cardId) return;
    setStatus('loading');
    try {
      const res = await axiosInstance.get(`/cards/${cardId}/feedback`);
      setFeedback(res.data?.data ?? []);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load feedback', err);
      setFeedback([]);
      setStatus('ready');
    }
  }, [cardId]);

  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  const averageRating = useMemo(() => {
    if (feedback.length === 0) return 0;
    return feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  }, [feedback]);

  const textReviews = useMemo(() => feedback.filter(f => !f.imageUrl), [feedback]);
  const mediaReviews = useMemo(() => feedback.filter(f => f.imageUrl), [feedback]);

  const col1 = textReviews.filter((_, i) => i % 2 === 0);
  const col2 = textReviews.filter((_, i) => i % 2 !== 0);

  if (status === 'error') {
    return (
      <div className="p-8"><EmptyState icon={MessageSquare} title="No feedback available" description="Create a card first to start receiving feedback." /></div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0f172a]">
      <style>{`
        @keyframes scroll-up { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scroll-down { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
        .animate-scroll-up { animation: scroll-up 25s linear infinite; }
        .animate-scroll-down { animation: scroll-down 25s linear infinite; }
        .scroll-container:hover .animate-scroll-up, .scroll-container:hover .animate-scroll-down { animation-play-state: paused; }
      `}</style>

      <div className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Wall of Love</h1>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                See what your visitors are saying about you and the moments they've captured.
              </p>
            </div>
            {cards.length > 0 && (
              <div className="w-full md:w-64">
                <CardSelector cards={cards} value={cardId} onChange={setCardId} />
              </div>
            )}
          </div>
          
          {status === 'ready' && feedback.length > 0 && (
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-slate-900 dark:text-white">{averageRating.toFixed(1)}</div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{feedback.length} total reviews</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-x-auto scrollbar-hide">
                <button onClick={() => setActiveTab('reviews')} className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                  <MessageSquare className="w-4 h-4" /> Reviews ({textReviews.length})
                </button>
                <button onClick={() => setActiveTab('media')} className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'media' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                  <ImageIcon className="w-4 h-4" /> Media Wall ({mediaReviews.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {status === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        )}

        {status === 'ready' && feedback.length === 0 && (
          <div className="py-20">
            <EmptyState icon={MessageSquare} title="No feedback yet" description="Share your digital card to start collecting reviews and photos!" />
          </div>
        )}

        {status === 'ready' && feedback.length > 0 && activeTab === 'reviews' && (
          <div className="overflow-hidden h-[700px] relative scroll-container mask-image-vertical">
            {textReviews.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No text reviews" description="You have media feedback but no text reviews." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="flex flex-col animate-scroll-up">
                  {[...col1, ...col1, ...col1].map((f, i) => (
                    <ReviewCard key={`col1-${i}`} feedback={f} />
                  ))}
                </div>
                <div className="flex flex-col animate-scroll-down hidden md:flex" style={{ marginTop: '-400px' }}>
                  {[...col2, ...col2, ...col2].map((f, i) => (
                    <ReviewCard key={`col2-${i}`} feedback={f} />
                  ))}
                </div>
              </div>
            )}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-50 dark:from-[#0f172a] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-[#0f172a] to-transparent pointer-events-none z-10" />
          </div>
        )}

        {status === 'ready' && feedback.length > 0 && activeTab === 'media' && (
          <div className="">
            {mediaReviews.length === 0 ? (
               <div className="py-20">
                 <EmptyState icon={Camera} title="No customer photos yet" description="Encourage your clients to snap a picture when they leave a review!" />
               </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {mediaReviews.map((f, i) => (
                  <MediaCard key={i} feedback={f} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
