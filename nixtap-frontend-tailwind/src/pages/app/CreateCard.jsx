import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardEditorForm from '../../components/cardEditor/CardEditorForm';
import { useAuthStore } from '../../store/authStore';
import { apiClient as axiosInstance } from '../../api/axios';
import { Loader2 } from 'lucide-react';

export default function CreateCard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLimit = async () => {
      const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
      if (isPro) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await axiosInstance.get('/cards');
        const list = res.data?.data || [];
        if (list.length >= 1) {
          navigate('/dashboard/premium');
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    checkLimit();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f13]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return <CardEditorForm mode="create" />;
}
