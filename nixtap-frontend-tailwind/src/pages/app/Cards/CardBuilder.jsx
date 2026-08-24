import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardEditorForm from '../../../components/cardEditor/CardEditorForm';
import { cardApi } from '../../../api/cardApi';
import { ArrowLeft } from 'lucide-react';

export default function CardBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchCard = async () => {
        try {
          const data = await cardApi.getCard(id);
          setInitialData(data);
        } catch (error) {
          console.error("Failed to fetch card", error);
          navigate('/dashboard/cards'); // Fallback if invalid ID
        } finally {
          setLoading(false);
        }
      };
      fetchCard();
    }
  }, [id, navigate, isEditing]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => navigate('/dashboard/cards')}
        className="absolute top-4 left-4 z-50 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm rounded-full text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black transition-all"
        title="Back to Cards"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <CardEditorForm 
        mode={isEditing ? 'edit' : 'create'} 
        cardId={id} 
        initial={initialData || {}} 
      />
    </div>
  );
}
