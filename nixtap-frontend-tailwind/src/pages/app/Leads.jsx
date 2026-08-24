import { useEffect, useState, useCallback, useMemo } from 'react';
import { Users, Mail, Phone, Search, Eye, X } from 'lucide-react';
import { apiClient as axiosInstance } from '../../api/axios';
import CardSelector from '../../components/dashboard/CardSelector';
import EmptyState from '../../components/dashboard/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name) {
  if (!name) return 'N';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || 'N') + (parts[1]?.[0] || '').toUpperCase();
}

function TableSkeletonRows({ count = 5 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b border-gray-100 dark:border-white/[0.05] last:border-0">
      {Array.from({ length: 5 }).map((__, j) => (
        <td key={j} className="py-4 px-5">
          <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" style={{ width: `${50 + (j % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  ));
}

const IconButton = ({ icon: Icon, onClick, colorClass = "text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" }) => (
  <button onClick={onClick} className={`p-1.5 rounded-lg transition-colors ${colorClass}`} type="button">
    <Icon className="w-4 h-4" />
  </button>
);

export default function Leads() {
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, loading, ready, error
  const [query, setQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCardId]);

  const fetchCards = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/cards');
      const list = res.data?.data ?? [];
      setCards(list);
      if (list.length > 0 && !selectedCardId) {
        setSelectedCardId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load cards for leads', err);
      setCards([]);
    }
  }, [selectedCardId]);

  const fetchLeads = useCallback(async (cardId) => {
    if (!cardId) return;
    setStatus('loading');
    try {
      const res = await axiosInstance.get(`/cards/${cardId}/leads`);
      const list = res.data?.data ?? [];
      setLeads(list);
    } catch (err) {
      console.error('Failed to load leads', err);
      setLeads([]);
    } finally {
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (selectedCardId) fetchLeads(selectedCardId);
  }, [selectedCardId, fetchLeads]);

  const filteredLeads = useMemo(() => {
    if (!query.trim()) return leads;
    const q = query.toLowerCase();
    return leads.filter(l => 
      (l.visitorName || '').toLowerCase().includes(q) ||
      (l.visitorEmail || '').toLowerCase().includes(q) ||
      (l.visitorPhone || '').toLowerCase().includes(q)
    );
  }, [leads, query]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-200 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Lead Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
            View and manage contact inquiries collected from your digital business cards.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
          <div className="w-full md:w-auto">
            <CardSelector cards={cards} value={selectedCardId} onChange={setSelectedCardId} />
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 flex-1 md:justify-end">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name, email, phone..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-[#1e293b] shadow-sm">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="px-6 py-4 font-semibold text-slate-500 text-start text-xs dark:text-slate-400 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-start text-xs dark:text-slate-400 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-start text-xs dark:text-slate-400 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-start text-xs dark:text-slate-400 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-center text-xs dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {status === 'loading' && <TableSkeletonRows count={5} />}
                
                {status === 'ready' && paginatedLeads.map((lead) => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                           <span className="text-blue-700 dark:text-blue-400 font-semibold text-sm">
                             {getInitials(lead.visitorName)}
                           </span>
                        </div>
                        <div>
                          <span className="block font-semibold text-slate-900 text-sm dark:text-white">
                            {lead.visitorName || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-slate-500 text-start text-sm dark:text-slate-400">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> {lead.visitorEmail || '-'}
                        </span>
                        {lead.visitorPhone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> {lead.visitorPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-start text-sm dark:text-slate-400 max-w-[200px]">
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                         {lead.message || 'No message provided'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-start text-sm dark:text-slate-400 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <IconButton icon={Eye} onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {status === 'ready' && filteredLeads.length === 0 && (
            <div className="py-20 px-6">
              <EmptyState
                icon={Users}
                animate={false}
                title={query ? 'No matching leads' : 'No leads found'}
                description={query ? 'Try adjusting your search query.' : 'Leads generated from your digital card will appear here.'}
              />
            </div>
          )}
          
          {status === 'ready' && filteredLeads.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-medium text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-800 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-medium text-slate-800 dark:text-white">{filteredLeads.length}</span> leads
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Lead Details
                  </h2>
                  <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xl font-bold shrink-0">
                      {getInitials(selectedLead.visitorName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedLead.visitorName || 'Unknown'}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Received {formatDate(selectedLead.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 break-all">{selectedLead.visitorEmail || 'No email provided'}</span>
                    </div>
                    {selectedLead.visitorPhone && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{selectedLead.visitorPhone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Message</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap min-h-[100px]">
                      {selectedLead.message || <span className="text-slate-400 italic">No message provided.</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
