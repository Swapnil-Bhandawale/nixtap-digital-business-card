import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Plus, Edit2, Share2, Eye, CreditCard, Copy, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cardApi } from '../../../api/cardApi';

export default function CardList() {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const data = await cardApi.getCards();
      setCards(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      setError("Unable to load your cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await cardApi.deleteCard(id);
        fetchCards();
      } catch (err) {
        console.error("Failed to delete card", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-cloud-200 dark:bg-cloud-800 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-cloud-200 dark:bg-cloud-800 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 glass-card dark:glass-card-dark rounded-[24px] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass dark:glass-dark rounded-[24px] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Cards</h3>
        <p className="text-cloud-500 dark:text-cloud-400 mb-6">{error}</p>
        <Button onClick={fetchCards} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-cloud-900 dark:text-white">Digital Cards</h2>
          <p className="text-cloud-500 dark:text-cloud-400 mt-1">Manage your business cards and profiles.</p>
        </div>
        <Link to="/dashboard/cards/create">
          <button className="flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold shadow-premium hover:shadow-premium-hover transition-all text-sm hover:-translate-y-0.5">
            <Plus className="w-4 h-4 mr-2" />
            Create Card
          </button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="glass dark:glass-dark rounded-[24px] p-12 text-center flex flex-col items-center justify-center min-h-[400px] border border-cloud-200/50 dark:border-cloud-700/50">
          <div className="w-16 h-16 bg-white/50 dark:bg-cloud-800/50 rounded-full flex items-center justify-center shadow-sm mb-4 text-brand-600 dark:text-brand-400">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-cloud-900 dark:text-white">No business cards yet</h3>
          <p className="text-sm text-cloud-500 dark:text-cloud-400 mt-1 mb-6">Create your first digital business card to get started.</p>
          <Link to="/dashboard/cards/create">
            <button className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              Create Card →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="glass-card dark:glass-card-dark rounded-[24px] hover:shadow-premium-hover transition-all duration-300 group relative flex flex-col border border-white/40 dark:border-cloud-700/40">
              <div 
                className="h-28 rounded-t-[24px] relative opacity-90 transition-opacity group-hover:opacity-100 overflow-hidden"
                style={{ background: card.themeColor || 'linear-gradient(to right, #3b82f6, #8b5cf6)' }}
              >
                {/* Optional subtle pattern inside header */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <a 
                    href={`/c/${card.publicUrl}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white/20 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/40 transition-colors shadow-sm"
                    title="View Public Card"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="p-6 relative flex-1 flex flex-col">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-cloud-800 border-[3px] border-white dark:border-cloud-800 shadow-md absolute -top-8 left-6 flex items-center justify-center text-xl font-bold text-brand-600 dark:text-brand-400 overflow-hidden shrink-0">
                  {card.profileImageUrl ? (
                     <img src={card.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     (card.fullName || 'U').charAt(0)
                  )}
                </div>
                
                <div className="mt-8 flex-1">
                  <h3 className="font-bold text-cloud-900 dark:text-white text-lg truncate">{card.fullName || 'Untitled Card'}</h3>
                  <p className="text-xs font-medium text-cloud-500 dark:text-cloud-400 truncate mt-1">
                    {card.jobTitle} {card.company ? `• ${card.company}` : ''}
                  </p>
                  <p className="text-[10px] text-cloud-400 dark:text-cloud-500 mt-2">
                    nixtap.in/{card.publicUrl}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-cloud-200/50 dark:border-cloud-700/50">
                  <div className="flex space-x-4">
                    <div className="flex items-center text-xs font-semibold text-cloud-400 dark:text-cloud-500">
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      {card.views || 0}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(`https://nixtap.online/c/${card.publicUrl}`)}
                      className="p-2 rounded-lg bg-cloud-50 dark:bg-cloud-800 hover:bg-cloud-100 dark:hover:bg-cloud-700 text-cloud-500 dark:text-cloud-400 shadow-sm transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <Link to={`/dashboard/cards/${card.id}/edit`}>
                      <button className="p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 shadow-sm transition-colors" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(card.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 shadow-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

