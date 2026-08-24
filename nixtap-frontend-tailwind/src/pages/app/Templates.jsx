import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, Filter, Crown, X, LayoutTemplate } from 'lucide-react';
import { apiClient as axiosInstance } from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../../components/dashboard/EmptyState';
import { useAuthStore } from '../../store/authStore';

function TemplateSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1e1e2a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse shadow-sm">
      <div className="h-[240px] bg-slate-100 dark:bg-slate-800/50" />
      <div className="p-5 border-t border-slate-100 dark:border-slate-800">
        <div className="h-5 w-32 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-3" />
        <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-2" />
        <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800/50 rounded-full" />
      </div>
    </div>
  );
}

function MiniCardPreview({ template }) {
  const theme = template.defaultThemeColor || '#3b82f6';
  
  return (
    <div className="w-full h-[240px] relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#151520] group-hover:bg-slate-100 dark:group-hover:bg-[#1a1a28] transition-colors duration-500">
      
      {/* Subtle Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} 
      />
      
      {/* Soft Top Glow based on Theme */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 opacity-20 dark:opacity-10 transition-opacity duration-500 group-hover:opacity-30" 
        style={{ background: theme.includes('gradient') ? theme : `linear-gradient(to bottom, ${theme}, transparent)` }} 
      />

      {/* Mobile Card Mockup */}
      <div className="relative w-[130px] h-[200px] bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] shadow-xl border-4 border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl z-10">
        
        {/* Device Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-slate-100 dark:bg-slate-800 rounded-b-md z-20" />

        {/* Card Banner */}
        <div className="h-16 w-full relative" style={{ background: theme }}>
          {template.previewImageUrl && (
            <div 
              className="absolute inset-0 mix-blend-overlay opacity-50"
              style={{ backgroundImage: `url(${template.previewImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          )}
        </div>
        
        {/* Profile Avatar */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full border-[3px] border-white dark:border-[#1e1e2a] bg-slate-200 overflow-hidden shadow-sm z-10">
           <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
             UN
           </div>
        </div>

        {/* Content Lines */}
        <div className="pt-7 pb-3 px-3 flex flex-col items-center text-center flex-1">
          <div className="w-16 h-2 bg-slate-800 dark:bg-slate-200 rounded-full mb-1.5" />
          <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mb-4" />
          
          <div className="flex justify-center gap-1.5 mb-auto w-full">
            <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>

          <div 
            className="w-full h-5 rounded-md flex items-center justify-center mt-3 shadow-sm"
            style={{ background: theme }}
          >
            <div className="w-8 h-1 bg-white/70 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] z-20">
        {/* Buttons injected from parent */}
      </div>
    </div>
  )
}

function PreviewModal({ template, onClose, onUse }) {
  if (!template) return null;
  const theme = template.defaultThemeColor || '#3b82f6';
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-[#1e1e2a] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: Mockup Preview */}
        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-[#15151e] p-8 flex items-center justify-center border-r border-slate-100 dark:border-slate-800 relative overflow-hidden">
           
           {/* Decorative Back Glow */}
           <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 dark:opacity-10 pointer-events-none"
              style={{ background: theme }}
           />

           <div className="w-full max-w-[280px] aspect-[9/19] bg-white dark:bg-[#1e1e2a] rounded-[2.5rem] shadow-xl border-4 border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 dark:bg-slate-700 rounded-b-xl z-20" />
              
              {/* Card Banner */}
              <div className="h-36 w-full relative" style={{ background: theme }}>
                {template.previewImageUrl && (
                  <div 
                    className="absolute inset-0 opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${template.previewImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                )}
              </div>
              
              {/* Profile */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[4px] border-white dark:border-[#1e1e2a] bg-slate-100 overflow-hidden shadow-md z-10 flex items-center justify-center">
                 <div className="text-2xl font-bold text-slate-400">UN</div>
              </div>

              <div className="pt-14 px-6 flex flex-col items-center text-center flex-1">
                <div className="w-32 h-3 bg-slate-800 dark:bg-slate-200 rounded-full mb-3" />
                <div className="w-20 h-2 bg-slate-300 dark:bg-slate-600 rounded-full mb-8" />
                
                <div className="flex justify-center gap-4 mb-8 w-full">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm"><div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full"/></div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm"><div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full"/></div>
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm"><div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full"/></div>
                </div>

                <div className="w-full mt-auto mb-8">
                  <div className="h-12 w-full rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md" style={{ background: theme }}>
                    Save Contact
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-8 flex flex-col relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                {template.category || 'General'}
              </span>
              {template.isPremium && (
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              {template.name}
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {template.description || "A professional digital business card template designed to leave a lasting impression. Fully customizable with your own information, links, and branding."}
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Included in this template:</h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Pre-configured color palette</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Optimized layout structure</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Mobile-first responsive design</li>
                  {template.isPremium && <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Premium font typography</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            <button
              onClick={() => onUse(template)}
              className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center transition-colors shadow-lg shadow-blue-500/25"
            >
              Use This Template
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
  
  const [templates, setTemplates] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await axiosInstance.get('/templates');
      const list = res.data?.data ?? [];
      setTemplates(list);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load templates', err);
      setTemplates([]);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category || 'General'));
    return ['All', ...Array.from(cats).sort()];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(t => (t.category || 'General') === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    return filtered;
  }, [templates, activeCategory, query]);

  const handleUse = async (template) => {
    if (template.isPremium && !isPro) {
      navigate('/dashboard/premium');
      return;
    }
    
    if (!isPro) {
      try {
        const res = await axiosInstance.get('/cards');
        const userCards = res.data?.data || [];
        if (userCards.length >= 1) {
          navigate('/dashboard/premium');
          return;
        }
      } catch (err) {
        console.error('Failed to check card limits', err);
      }
    }

    navigate(`/dashboard/cards/create?templateId=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-[#0f172a] pb-20">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Template Library</h1>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                Choose a professional, ready-made design for your digital business card. 
                Customize it with your own details in seconds.
              </p>
            </div>
            <div className="w-full md:w-auto relative max-w-md flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-white shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Categories */}
        {status === 'ready' && categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <Filter className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                    : 'bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {status === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <TemplateSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'ready' && filteredTemplates.length === 0 && (
          <div className="py-20">
            <EmptyState
              icon={LayoutTemplate}
              title={query ? 'No templates match your search' : 'No templates available'}
              description={query ? 'Try adjusting your search terms or filters.' : 'We are adding new professional designs soon!'}
            />
          </div>
        )}

        {status === 'ready' && filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((t) => (
              <div 
                key={t.id} 
                className="group bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 dark:hover:shadow-black/50 transition-all duration-300 flex flex-col"
              >
                {/* Preview Area */}
                <div className="relative">
                  <MiniCardPreview template={t} />
                  
                  {/* Hover Buttons */}
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <button 
                      onClick={() => setPreviewTemplate(t)}
                      className="px-6 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => handleUse(t)}
                      className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
                    >
                      Use Template
                    </button>
                  </div>
                  
                  {/* Floating PRO Badge */}
                  {t.isPremium && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-500 text-[10px] font-black rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                        <Crown className="w-3 h-3" /> Pro
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-5 flex-1 flex flex-col bg-white dark:bg-[#1e293b] border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t.name}
                      </h3>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        {t.category || 'General'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal 
            template={previewTemplate} 
            onClose={() => setPreviewTemplate(null)} 
            onUse={(t) => { setPreviewTemplate(null); handleUse(t); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
