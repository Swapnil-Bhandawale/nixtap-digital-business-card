import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '../../api/axios';
import CardSelector from '../../components/dashboard/CardSelector';
import { Calendar as CalendarIcon, Clock, Mail, Phone, Check, X, Search, ChevronRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, IconButton } from '@mui/material';
import * as dateFns from 'date-fns';
import { useSettingsStore } from '../../store/settingsStore';
import { themeColorMap } from '../../utils/themeColors';

// --- Custom Toast ---
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${isError ? 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200' : 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-200'}`}>
      {isError ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
      <span className="text-sm font-semibold">{toast.message}</span>
    </div>
  );
};

// --- StatCard Component ---
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30'
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${styles[status] || styles.PENDING}`}>
      {status || 'PENDING'}
    </span>
  );
};

// --- Custom Calendar ---
const CustomCalendar = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = dateFns.startOfMonth(currentDate);
  const monthEnd = dateFns.endOfMonth(monthStart);
  const startDate = dateFns.startOfWeek(monthStart);
  const endDate = dateFns.endOfWeek(monthEnd);

  const dateFormat = 'd';
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = '';

  const nextMonth = () => setCurrentDate(dateFns.addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(dateFns.subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = dateFns.format(day, dateFormat);
      const cloneDay = day;
      
      const dayEvents = events.filter(e => dateFns.isSameDay(new Date(e.start), cloneDay));
      
      days.push(
        <div 
          key={day} 
          className={`min-h-[100px] p-2 border-r border-b border-slate-100 dark:border-slate-800 ${!dateFns.isSameMonth(day, monthStart) ? 'bg-slate-50/50 dark:bg-slate-900/30 text-slate-400' : 'bg-white dark:bg-[#1e293b]'} ${dateFns.isSameDay(day, new Date()) ? 'bg-blue-50/10 dark:bg-blue-900/10' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-semibold ${dateFns.isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>{formattedDate}</span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map(evt => (
              <div 
                key={evt.id} 
                onClick={() => onEventClick({ event: { extendedProps: evt.extendedProps } })}
                className="text-[10px] sm:text-xs px-2 py-1 rounded-md text-white font-medium truncate cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: evt.backgroundColor }}
              >
                {dateFns.format(new Date(evt.start), 'h:mm a')} - {evt.title}
              </div>
            ))}
          </div>
        </div>
      );
      day = dateFns.addDays(day, 1);
    }
    rows.push(<div className="grid grid-cols-7" key={day}>{days}</div>);
    days = [];
  }

  return (
    <div className="flex flex-col h-[600px] border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#1e293b]">
      <div className="flex items-center justify-between p-4 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          {dateFns.format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={today} className="px-3 py-1.5 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200">Today</button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200/60 dark:border-slate-800 last:border-0">
            {d}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {rows}
      </div>
    </div>
  );
};

export default function Appointments() {
  const { color } = useSettingsStore();
  const themeColors = themeColorMap[color] || themeColorMap['Violet'];

  const [cardId, setCardId] = useState('');
  const [cards, setCards] = useState([]);
  
  useEffect(() => {
    import('../../api/cardApi').then(({ cardApi }) => {
      cardApi.getCards().then(res => {
        const c = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setCards(c);
        if (c.length > 0 && !cardId) setCardId(c[0].id);
      }).catch(console.error);
    });
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState('idle');
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL');

  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAppointments = useCallback(async (selectedCardId) => {
    if (!selectedCardId) return;
    setStatus('loading');
    try {
      const res = await apiClient.get(`/cards/${selectedCardId}/appointments`);
      const list = res.data?.data ?? [];
      setAppointments(list);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load appointments', err);
      setAppointments([]);
      setStatus('ready'); // Fallback to ready with empty array
    }
  }, []);

  useEffect(() => {
    if (cardId) fetchAppointments(cardId);
  }, [cardId, fetchAppointments]);

  const handleCardChange = (id) => {
    setCardId(id);
  };

  const updateStatus = async (apptId, newStatus) => {
    setIsUpdating(true);
    try {
      await apiClient.put(`/cards/${cardId}/appointments/${apptId}`, { status: newStatus });
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
      setSelectedEvent(prev => prev ? { ...prev, status: newStatus } : null);
      showToast(`Appointment ${newStatus.toLowerCase()}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = (a.visitorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.visitorEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (a.visitorPhone || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'ALL' || a.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [appointments, searchQuery, filter]);

  const upcomingAppointments = useMemo(() => {
    return [...filteredAppointments]
      .filter(a => new Date(a.requestedDatetime || a.createdAt) >= new Date().setHours(0,0,0,0))
      .sort((a,b) => new Date(a.requestedDatetime || a.createdAt) - new Date(b.requestedDatetime || b.createdAt));
  }, [filteredAppointments]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'PENDING').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
  }, [appointments]);

  const calendarEvents = useMemo(() => {
    return filteredAppointments.map(appt => {
      let bgColor = '#3b82f6';
      if (appt.status === 'PENDING') bgColor = '#f59e0b';
      if (appt.status === 'CONFIRMED') bgColor = '#10b981';
      if (appt.status === 'CANCELLED') bgColor = '#ef4444';
      
      return {
        id: appt.id,
        title: appt.visitorName || 'Visitor',
        start: appt.requestedDatetime || appt.createdAt,
        backgroundColor: bgColor,
        borderColor: bgColor,
        extendedProps: appt
      };
    });
  }, [filteredAppointments]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage appointment requests received from visitors.</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
          <div className="w-full md:w-auto">
            <CardSelector cards={cards} value={cardId} onChange={setCardId} />
          </div>
          
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 flex-1 md:justify-end">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search visitor name, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-white"
              />
            </div>
          </div>
        </div>

        {status === 'loading' ? (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div><div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div></div>
            <div className="h-[600px] bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>
        ) : !cardId ? (
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200/60 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
            <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select a Card</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Choose a card from the dropdown above to view its appointments.</p>
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <StatCard icon={CalendarIcon} label="Total Appointments" value={stats.total} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" />
              <StatCard icon={Clock} label="Pending Requests" value={stats.pending} colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" />
              <StatCard icon={Check} label="Confirmed" value={stats.confirmed} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" />
              <StatCard icon={X} label="Cancelled" value={stats.cancelled} colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" />
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              
              {/* Calendar Area */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-4 md:p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                  <CustomCalendar events={calendarEvents} onEventClick={handleEventClick} />
                </motion.div>
              </div>

              {/* Sidebar / List Area */}
              <div className="space-y-6">
                
                {/* Upcoming List (Flux Style) */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                    Upcoming Events
                  </h3>
                  
                  <div className="flex-1 space-y-4">
                    {upcomingAppointments.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-60 py-10">
                        <Clock className="w-8 h-8 text-slate-400 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">No upcoming events</p>
                      </div>
                    ) : (
                      upcomingAppointments.map(appt => {
                        let dotColor = 'bg-blue-500';
                        if (appt.status === 'PENDING') dotColor = 'bg-amber-500';
                        if (appt.status === 'CONFIRMED') dotColor = 'bg-emerald-500';
                        if (appt.status === 'CANCELLED') dotColor = 'bg-red-500';

                        return (
                          <div key={appt.id} onClick={() => { setSelectedEvent(appt); setIsModalOpen(true); }} className="flex items-start gap-3 group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`}></div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{appt.visitorName || 'Untitled Event'}</h4>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                {dateFns.format((appt.requestedDatetime ? new Date(appt.requestedDatetime) : new Date(0)), "MMM d 'at' h:mm a")}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => !isUpdating && setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: 'transparent',
            boxShadow: 'none',
          }
        }}
      >
        <div className="bg-white dark:bg-[#1e293b] w-full rounded-[24px] shadow-2xl border border-slate-200/50 dark:border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedEvent && (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white pr-4">
                    {selectedEvent.visitorName || 'Appointment Details'}
                  </h2>
                  <IconButton onClick={() => !isUpdating && setIsModalOpen(false)} size="small" disabled={isUpdating}>
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </IconButton>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={selectedEvent.status} />
                  <span className="text-xs font-semibold text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {dateFns.format(selectedEvent.createdAt ? new Date(selectedEvent.createdAt) : new Date(), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5"/> Date</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {dateFns.format((selectedEvent.requestedDatetime ? new Date(selectedEvent.requestedDatetime) : new Date(0)), 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Time</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {dateFns.format((selectedEvent.requestedDatetime ? new Date(selectedEvent.requestedDatetime) : new Date(0)), 'h:mm a')}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 break-all">{selectedEvent.visitorEmail || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{selectedEvent.visitorPhone || 'No phone provided'}</span>
                    </div>
                  </div>
                </div>

                {selectedEvent.message && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Message</h3>
                    <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 rounded-2xl p-4">
                      <p className="text-sm text-amber-900 dark:text-amber-200/80 whitespace-pre-wrap leading-relaxed">{selectedEvent.message}</p>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                {selectedEvent.status === 'PENDING' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={isUpdating}
                      onClick={() => updateStatus(selectedEvent.id, 'CANCELLED')}
                      className="flex-1 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => updateStatus(selectedEvent.id, 'CONFIRMED')}
                      className={`flex-1 py-3 bg-gradient-to-r ${themeColors.gradient} text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      {isUpdating ? 'Updating...' : 'Confirm'}
                    </button>
                  </div>
                )}
                
                {selectedEvent.status === 'CONFIRMED' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={isUpdating}
                      onClick={() => updateStatus(selectedEvent.id, 'CANCELLED')}
                      className="w-full py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Dialog>

      <Toast toast={toast} />
    </div>
  );
}
