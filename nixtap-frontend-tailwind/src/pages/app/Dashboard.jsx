import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { 
  Calendar, CreditCard, Eye, Users, 
  ArrowUpRight, Bell, Plus, Settings,
  Sun, Moon, ExternalLink, BarChart3,
  Activity, Star, FileText
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { themeColorMap } from '../../utils/themeColors';
import { cardApi } from '../../api/cardApi';
import { analyticsApi } from '../../api/analyticsApi';
import { apiClient as axiosInstance } from '../../api/axios';

// UTILS
function getRelativeTime(dateString) {
  if (!dateString) return 'Just now';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffMs = new Date(dateString) - new Date();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffMins = Math.round(diffMs / (1000 * 60));
  
  if (Math.abs(diffDays) > 0) return rtf.format(diffDays, 'day');
  if (Math.abs(diffHours) > 0) return rtf.format(diffHours, 'hour');
  if (Math.abs(diffMins) > 0) return rtf.format(diffMins, 'minute');
  return 'Just now';
}

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || 'N') + (parts[1]?.[0] || '');
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// COMPONENTS
const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white/10 hover:bg-white/20 transition-colors duration-300 rounded-2xl p-5 border border-white/10 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-white/80" />
        <p className="text-white/80 text-sm font-medium">{label}</p>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</h3>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <button onClick={onClick} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700/50 group w-full text-left">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} transition-transform group-hover:scale-105 duration-300`}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
  </button>
);

const Empty = ({ text }) => (
  <div className="flex-1 flex items-center justify-center py-8">
    <p className="text-sm text-slate-400 font-medium">{text}</p>
  </div>
);

// MAIN EXPORT
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { color } = useSettingsStore();
  const themeColors = themeColorMap[color] || themeColorMap['Violet'];
  
  const [data, setData] = useState({
    stats: { cards: 0, views: 0, leads: 0, appointments: 0 },
    cards: [],
    leads: [],
    appointments: [],
    activity: [],
    analytics: { dates: [], views: [] }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await cardApi.getCards();
      const cards = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      
      let totalViews = 0, totalLeads = 0, totalAppts = 0;
      let allLeads = [], allAppts = [], allActivity = [];
      let dailyViewsMap = {};

      await Promise.allSettled(cards.map(async (c) => {
        totalViews += (c.views || 0);

        const [leadResult, apptResult, analyticsResult] = await Promise.allSettled([
          axiosInstance.get(`/cards/${c.id}/leads`),
          axiosInstance.get(`/cards/${c.id}/appointments`),
          analyticsApi.getAnalytics(c.id, parseInt(timeRange))
        ]);

        if (leadResult.status === 'fulfilled') {
          const cardLeads = leadResult.value.data?.data || [];
          totalLeads += cardLeads.length;
          cardLeads.forEach(lead => {
            allLeads.push({ ...lead, cardName: c.title || c.name || c.fullName });
            allActivity.push({
              id: `lead_${lead.id}`, type: 'lead',
              name: lead.visitorName || 'Unknown Lead',
              detail: `Lead via ${c.title || c.name || c.fullName || 'Card'}`,
              status: 'NEW', time: lead.createdAt, link: '/dashboard/leads',
              icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10'
            });
          });
        }

        if (apptResult.status === 'fulfilled') {
          const cardAppts = apptResult.value.data?.data || [];
          totalAppts += cardAppts.length;
          cardAppts.forEach(appt => {
            allAppts.push({ ...appt, cardName: c.title || c.name || c.fullName });
            allActivity.push({
              id: `appt_${appt.id}`, type: 'appointment',
              name: appt.visitorName || 'Unknown Appointment',
              detail: `Meeting on ${c.title || c.name || c.fullName || 'Card'}`,
              status: appt.status || 'PENDING', time: appt.createdAt || appt.requestedDatetime, link: '/dashboard/appointments',
              icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10'
            });
          });
        } else {
          const mockAppts = JSON.parse(localStorage.getItem('mockAppts') || '[]').filter(a => a.cardId === c.id);
          if (mockAppts.length > 0) {
            totalAppts += mockAppts.length;
            mockAppts.forEach(appt => {
              allAppts.push({ ...appt, cardName: c.title || c.name || c.fullName });
              allActivity.push({
                id: `appt_${appt.id}`, type: 'appointment',
                name: appt.visitorName || 'Unknown Appointment',
                detail: `Meeting on ${c.title || c.name || c.fullName || 'Card'}`,
                status: appt.status || 'PENDING', time: appt.createdAt || appt.requestedDatetime, link: '/dashboard/appointments',
                icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10'
              });
            });
          }
        }

        if (analyticsResult.status === 'fulfilled') {
          const viewsByDay = analyticsResult.value?.data?.viewsByDay || [];
          viewsByDay.forEach(dayData => {
            const dateStr = new Date(dayData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyViewsMap[dateStr] = (dailyViewsMap[dateStr] || 0) + (dayData.count || 0);
          });
        }
      }));

      allLeads.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      allAppts.sort((a,b) => new Date(b.requestedDatetime || b.createdAt) - new Date(a.requestedDatetime || a.createdAt));
      allActivity.sort((a,b) => new Date(b.time) - new Date(a.time));
      
      let dates = Object.keys(dailyViewsMap).sort((a,b) => new Date(a) - new Date(b));
      let views = dates.map(d => dailyViewsMap[d]);

      if (dates.length === 0) {
        dates = []; views = [];
        for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
          views.push(0);
        }
      }

      setData({
        stats: { cards: cards.length, views: totalViews, leads: totalLeads, appointments: totalAppts },
        cards,
        leads: allLeads.slice(0, 4),
        appointments: allAppts.slice(0, 4),
        activity: allActivity.slice(0, 5),
        analytics: { dates, views }
      });
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit', background: 'transparent' },
    colors: [themeColors.hex],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 90, 100] } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: { categories: data.analytics.dates, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: theme === 'dark' ? '#94a3b8' : '#64748b' } } },
    yaxis: { labels: { style: { colors: theme === 'dark' ? '#94a3b8' : '#64748b' } } },
    grid: { borderColor: theme === 'dark' ? '#334155' : '#f1f5f9', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    theme: { mode: theme === 'dark' ? 'dark' : 'light' },
    tooltip: { theme: theme === 'dark' ? 'dark' : 'light' }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-6 lg:p-8 flex justify-center">
        <div className="animate-pulse w-full max-w-[1400px] space-y-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* 1. FLUX-STYLE HERO BANNER WITH KPIs */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${themeColors.gradient} p-8 md:p-10 text-white shadow-sm`}>
            <div className="relative z-10">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Good {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}</h1>
                <p className="text-white/80 text-lg">Here's what's happening with your product today.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <StatCard icon={CreditCard} label="Total Cards" value={data.stats.cards} />
                <StatCard icon={Eye} label="Total Views" value={data.stats.views} />
                <StatCard icon={Users} label="Total Leads" value={data.stats.leads} />
                <StatCard icon={Calendar} label="Appointments" value={data.stats.appointments} />
              </div>
            </div>
            {/* Background effects */}
            <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>

          {/* 2. TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Main Chart & Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card Performance Chart */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Growth</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly recurring view trend</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                      <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">Views</button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => navigate('/dashboard/analytics')}>Details</button>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#593cfb] transition-shadow appearance-none cursor-pointer" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                    </select>
                  </div>
                </div>
              <div className="h-[300px] w-full mt-auto">
                <Chart options={chartOptions} series={[{ name: 'Views', data: data.analytics.views }]} type="area" height="100%" />
              </div>
            </motion.div>

            {/* Active Cards Grid */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Active Cards</h3>
                  <p className="text-sm text-slate-500 mt-1">Manage your digital presence</p>
                </div>
                <button onClick={() => navigate('/dashboard/cards')} className={`text-sm font-semibold flex items-center group ${themeColors.text} hover:opacity-80`}>
                  View All <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.cards.slice(0, 4).length === 0 ? <Empty text="No cards yet." /> : data.cards.slice(0, 4).map(card => (
                  <div key={card.id} className="border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-500/50 transition-all group flex flex-col bg-white dark:bg-slate-800/30">
                    <div className="flex justify-between items-start mb-4">
                      <div className="min-w-0 pr-3">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{card.fullName || card.title || card.name || 'Untitled Card'}</h4>
                        <p className="text-sm text-slate-500 truncate mt-0.5">{card.jobTitle || card.profession || 'No Title'}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${card.status === 'PUBLISHED' || !card.status ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {card.status || 'PUBLISHED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
                      <div className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-slate-400" /> {card.views || 0}</div>
                      <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {card.leads || 0}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => navigate(`/dashboard/cards/${card.id}/edit`)} className="flex-1 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-600/50">
                        Edit
                      </button>
                      <button onClick={() => window.open(`https://nixtap.online/c/${card.customSlug || card.id}`, '_blank')} className="p-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors border border-slate-200/50 dark:border-slate-600/50">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Widgets */}
          <div className="space-y-6">
            
            {/* Quick Actions (Matches Flux 'Sprint 24' widget placement) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <QuickAction icon={Plus} label="New Card" onClick={() => {
                  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
                  if (!isPro && data.cards.length >= 1) {
                    navigate('/dashboard/premium');
                    return;
                  }
                  navigate('/dashboard/cards/create');
                }} color={`bg-gradient-to-r ${themeColors.gradient} text-white border-0`} />
                <QuickAction icon={CreditCard} label="My Cards" onClick={() => navigate('/dashboard/cards')} color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" />
                <QuickAction icon={Activity} label="Analytics" onClick={() => navigate('/dashboard/analytics')} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" />
              </div>
            </motion.div>

            {/* Recent Leads */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Leads</h3>
                <button onClick={() => navigate('/dashboard/leads')} className={`text-sm font-semibold ${themeColors.text} hover:opacity-80`}>
                  View All
                </button>
              </div>
              <div className="flex-1 space-y-4">
                {data.leads.length === 0 ? <Empty text="No leads yet." /> : data.leads.map(lead => (
                  <div key={lead.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold flex-shrink-0 text-sm border border-slate-200 dark:border-slate-700">
                      {initialsOf(lead.visitorName || '?')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate dark:text-slate-100">{lead.visitorName || 'Unknown'}</h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{lead.visitorEmail || lead.visitorPhone || 'No contact info'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-medium text-slate-400 mb-1">{getRelativeTime(lead.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Appointments</h3>
                <button onClick={() => navigate('/dashboard/appointments')} className={`text-sm font-semibold ${themeColors.text} hover:opacity-80`}>
                  View All
                </button>
              </div>
              <div className="flex-1 space-y-4">
                {data.appointments.length === 0 ? <Empty text="No appointments yet." /> : data.appointments.map(appt => {
                  const statusColors = { PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400', CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400', CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' };
                  const sc = statusColors[appt.status] || statusColors.PENDING;
                  return (
                    <div key={appt.id} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate dark:text-slate-100">{appt.visitorName || 'Unknown'}</h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{new Date(appt.requestedDatetime || appt.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc}`}>
                          {appt.status || 'PENDING'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activity (Aggregated) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h3>
              </div>
              <div className="flex-1">
                {data.activity.length === 0 ? <Empty text="No recent activity." /> : (
                  <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 dark:before:from-slate-700 before:to-transparent">
                    {data.activity.map(act => (
                      <div key={act.id} className="relative flex items-start gap-4 group cursor-pointer" onClick={() => navigate(act.link)}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${act.bg} ${act.color} ring-4 ring-white dark:ring-[#1e293b] transition-transform group-hover:scale-110 border border-slate-200/50 dark:border-slate-700`}>
                          <act.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className={`text-sm font-semibold text-slate-900 dark:text-slate-100 truncate ${themeColors.groupHoverText} transition-colors`}>
                            {act.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{act.detail}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-1">{getRelativeTime(act.time)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
