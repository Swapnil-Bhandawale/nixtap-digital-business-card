import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CreditCard } from 'lucide-react';

import { apiClient as axiosInstance } from '../../api/axios';
import CardTile, { CardTileSkeleton } from '../../components/dashboard/CardTile';
import EmptyState from '../../components/dashboard/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import ShareDialog from '../../components/ui/ShareDialog';


import { useAuthStore } from '../../store/authStore';

const SKELETON_COUNT = 3;
const PUBLIC_CARD_BASE = 'https://nixtap.com/c/';

export default function MyCards() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
  
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('loading');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pendingShare, setPendingShare] = useState(null);
  const [toast, setToast] = useState(null);

  const handleCreate = () => {
    if (!isPro && cards.length >= 1) {
      navigate('/dashboard/premium');
      return;
    }
    navigate('/dashboard/cards/create');
  };

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const fetchCards = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await axiosInstance.get('/cards');
      const list = res.data?.data ?? [];
      if (list.length === 0) throw new Error('empty');
      setCards(list);
      setCards(list);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load cards', err);
      setCards([]);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const totals = useMemo(() => {
    const totalViews = cards.reduce((sum, c) => sum + (c.views || 0), 0);
    return { count: cards.length, totalViews };
  }, [cards]);

  const handleEdit = (card) => navigate(`/dashboard/cards/${card.id}/edit`);

  const handleShare = async (card) => {
    setPendingShare(card);
  };

  const handleDeleteConfirmed = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/cards/${pendingDelete.id}`);
      setCards((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      showToast('success', `"${pendingDelete.fullName}" deleted`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Could not delete this card');
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] dark:bg-[#0f0f13]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Your cards
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {status === 'ready'
                ? `${totals.count} card${totals.count === 1 ? '' : 's'} · ${totals.totalViews.toLocaleString()} total views`
                : 'Manage and share your digital business cards'}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> New card
          </button>
        </div>



        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <CardTileSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'ready' && cards.length === 0 && (
          <EmptyState
            icon={CreditCard}
            title="No cards yet"
            description="Create your first digital business card to start sharing your details in seconds."
            actionLabel="Create your first card"
            onAction={handleCreate}
          />
        )}

        {status === 'ready' && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card, i) => (
              <CardTile
                key={card.id}
                card={card}
                index={i}
                onEdit={handleEdit}
                onShare={handleShare}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this card?"
        description={
          pendingDelete
            ? `"${pendingDelete.fullName}" and its analytics, leads, and links will be permanently removed.`
            : ''
        }
        confirmLabel="Delete card"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />

      <ShareDialog
        open={Boolean(pendingShare)}
        card={pendingShare}
        onClose={() => setPendingShare(null)}
      />

      <Toast toast={toast} />
    </div>
  );
}

