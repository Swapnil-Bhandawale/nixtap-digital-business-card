import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Mail,
  Link2,
  QrCode,
  Share2,
  Users,
  Eye,
  UserPlus,
  Calendar,
  Activity,
  ArrowRight,
  Crown,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiClient as axiosInstance } from '../../api/axios';
import CardSelector from '../../components/dashboard/CardSelector';
import { SOCIAL_PLATFORMS } from '../../data/socialIcons';
import { useAuthStore } from '../../store/authStore';

const getSocial = (key) => SOCIAL_PLATFORMS.find(p => p.key === key) || {};

const CHANNEL_META = {
  WHATSAPP: { label: 'WhatsApp', icon: getSocial('whatsapp').icon, color: getSocial('whatsapp').color, isSvg: true },
  EMAIL: { label: 'Email', icon: Mail, color: '#3b82f6', isSvg: false },
  LINKEDIN: { label: 'LinkedIn', icon: getSocial('linkedin').icon, color: getSocial('linkedin').color, isSvg: true },
  TWITTER: { label: 'X / Twitter', icon: getSocial('twitter').icon, color: getSocial('twitter').color, isSvg: true },
  COPY_LINK: { label: 'Copy link', icon: Link2, color: '#2563eb', isSvg: false },
  QR_CODE: { label: 'QR code', icon: QrCode, color: '#3b82f6', isSvg: false },
  FACEBOOK: { label: 'Facebook', icon: getSocial('facebook').icon, color: getSocial('facebook').color, isSvg: true },
  INSTAGRAM: { label: 'Instagram', icon: getSocial('instagram').icon, color: getSocial('instagram').color, isSvg: true },
  YOUTUBE: { label: 'YouTube', icon: getSocial('youtube').icon, color: getSocial('youtube').color, isSvg: true },
  GITHUB: { label: 'GitHub', icon: getSocial('github').icon, color: getSocial('github').color, isSvg: true },
  WEBSITE: { label: 'Website', icon: getSocial('website').icon, color: getSocial('website').color, isSvg: true },
  DIRECT: { label: 'Direct / Unknown', icon: Link2, color: '#64748b', isSvg: false },
  OTHER: { label: 'Other', icon: Share2, color: '#94a3b8', isSvg: false }
};

function formatDay(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function trendOf(series) {
  if (!series || series.length < 4) return null;
  const mid = Math.floor(series.length / 2);
  const first = series.slice(0, mid).reduce((s, d) => s + d.count, 0) / mid;
  const second = series.slice(mid).reduce((s, d) => s + d.count, 0) / (series.length - mid);
  if (first === 0) return null;
  return Math.round(((second - first) / first) * 100);
}

function MetricCard({ title, value, trend, icon: Icon, loading }) {
  return (
    <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10 flex flex-col justify-between">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 flex justify-between items-start">
        {title}
        <div className="w-10 h-10 rounded-xl bg-blue-50/50 dark:bg-blue-500/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#5a5af3] dark:text-[#7b7bf5]" strokeWidth={2} />
        </div>
      </div>
      {loading ? (
        <div className="h-9 w-24 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse mb-2" />
      ) : (
        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">{value.toLocaleString()}</div>
      )}
      
      {loading ? (
        <div className="h-5 w-32 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
      ) : trend !== null && trend !== undefined ? (
        <div className={`text-xs font-medium flex items-center gap-1.5 ${trend >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {trend >= 0 ? '+' : ''}{trend}% 
          <span className="text-slate-400 dark:text-slate-500 font-normal ml-0.5">vs last period</span>
        </div>
      ) : (
        <div className="text-xs text-slate-400 dark:text-slate-500">No trend data</div>
      )}
    </div>
  );
}

export default function Analytics() {
  const { user } = useAuthStore();
  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
  
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [days, setDays] = useState(7);
  
  const [data, setData] = useState(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  
  const [status, setStatus] = useState('loading');

  const fetchCards = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/cards');
      const list = res.data?.data ?? [];
      if (list.length === 0) throw new Error('empty');
      setCards(list);
      setSelectedCardId(list[0].id);
    } catch (err) {
      console.error('Failed to load cards for analytics', err);
      setCards([]);
    }
  }, []);

  const fetchAnalytics = useCallback(async (cardId, daysRange) => {
    if (!cardId) return;
    setStatus('loading');
    try {
      const [analyticsRes, leadsRes, appointmentsRes] = await Promise.all([
        axiosInstance.get(`/cards/${cardId}/analytics?days=${daysRange}`),
        axiosInstance.get(`/cards/${cardId}/leads`),
        axiosInstance.get(`/cards/${cardId}/appointments`)
      ]);

      let dt = analyticsRes.data?.data;
      if (!dt || (dt.totalViews === 0 && (!dt.viewsByDay || dt.viewsByDay.length === 0))) {
        dt = null;
      }
      
      const now = new Date();
      const cutoff = new Date(now.setDate(now.getDate() - daysRange));
      
      const leads = leadsRes.data?.data || [];
      const recentLeads = leads.filter(l => new Date(l.createdAt) >= cutoff);
      
      const appointments = appointmentsRes.data?.data || [];
      const recentAppointments = appointments.filter(a => new Date(a.createdAt) >= cutoff);

      setData(dt);
      setLeadsCount(recentLeads.length);
      setAppointmentsCount(recentAppointments.length);
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load analytics data', err);
      setData(null);
      setLeadsCount(0);
      setAppointmentsCount(0);
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (selectedCardId) fetchAnalytics(selectedCardId, days);
  }, [selectedCardId, days, fetchAnalytics]);

  const viewsChartData = useMemo(
    () => (data?.viewsByDay ?? []).map((d) => ({ ...d, label: formatDay(d.date) })),
    [data]
  );
  
  const viewsTrend = useMemo(() => trendOf(data?.viewsByDay), [data]);

  const sharesChartData = useMemo(() => {
    const rows = data?.sharesByChannel ?? [];
    const max = Math.max(1, ...rows.map((r) => r.count));
    return rows
      .map((r) => ({ ...r, meta: CHANNEL_META[r.channel] || CHANNEL_META.OTHER, pct: (r.count / max) * 100 }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const deviceChartData = useMemo(() => {
    const rows = data?.viewsByDevice ?? [];
    const colors = {
      'Mobile': '#3b82f6',
      'Desktop': '#8b5cf6',
      'Tablet': '#f59e0b',
      'Unknown': '#94a3b8'
    };
    return rows.map((r) => ({
      name: r.device,
      value: r.count,
      fill: colors[r.device] || colors.Unknown
    }));
  }, [data]);

  const sourceChartData = useMemo(() => {
    const rows = data?.viewsBySource ?? [];
    
    // Helper to map raw referrer URLs to known channels
    const normalizeSource = (src) => {
      if (!src || src === 'null' || src === 'undefined') return 'DIRECT';
      const s = src.toLowerCase();
      if (s.includes('linkedin')) return 'LINKEDIN';
      if (s.includes('twitter') || s.includes('t.co')) return 'TWITTER';
      if (s.includes('facebook') || s.includes('fb.com')) return 'FACEBOOK';
      if (s.includes('instagram')) return 'INSTAGRAM';
      if (s.includes('whatsapp') || s.includes('wa.me')) return 'WHATSAPP';
      if (s.includes('youtube') || s.includes('youtu.be')) return 'YOUTUBE';
      if (s.includes('github')) return 'GITHUB';
      if (s === 'direct') return 'DIRECT';
      return 'OTHER';
    };

    // Group by normalized channel
    const grouped = {};
    rows.forEach(r => {
      const channel = normalizeSource(r.source);
      grouped[channel] = (grouped[channel] || 0) + r.count;
    });

    const aggregatedRows = Object.keys(grouped).map(k => ({ source: k, count: grouped[k] }));
    const max = Math.max(1, ...aggregatedRows.map((r) => r.count));
    
    return aggregatedRows
      .map(r => ({ ...r, pct: (r.count / max) * 100 }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const loading = status === 'loading';
  const activeCard = cards.find((c) => c.id === selectedCardId);
  
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);
  const dateRangeStr = `${formatDay(pastDate.toISOString())} - ${formatDay(today.toISOString())}, ${today.getFullYear()}`;

  const totalVisitors = data?.uniqueVisitors || 0;
  const funnelSteps = [
    { label: 'Visitors', count: totalVisitors, color: 'bg-[#25b5e9]' },
    { label: 'Leads', count: leadsCount, color: 'bg-[#4092ff]' },
    { label: 'Appointments', count: appointmentsCount, color: 'bg-[#5a5af3]' }
  ];

  const getFunnelConversion = (currentIndex) => {
    if (currentIndex === 0) return null;
    const prev = funnelSteps[currentIndex - 1].count;
    const current = funnelSteps[currentIndex].count;
    if (prev === 0) return '0%';
    return `${Math.round((current / prev) * 100)}%`;
  };

  const overallConversion = totalVisitors > 0 ? ((appointmentsCount / totalVisitors) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f0f13] pb-10">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
          </div>
          <div className="w-full sm:w-72">
             <CardSelector cards={cards} value={selectedCardId} onChange={setSelectedCardId} />
          </div>
        </div>

        <div className="rounded-[1.25rem] bg-gradient-to-r from-[#5a5af3] to-[#25b5e9] p-8 text-white flex flex-col md:flex-row md:items-center justify-between mb-8 shadow-md">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-white">Profile Performance Insights</h2>
            <p className="text-white/80 font-medium">{dateRangeStr}</p>
          </div>
          <div className="flex gap-1 bg-white/20 p-1 rounded-full backdrop-blur-sm w-max">
            {[7, 30, 90].map(d => (
              <button 
                key={d}
                onClick={() => setDays(d)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${days === d ? 'bg-white text-[#5a5af3] shadow-sm' : 'text-white hover:bg-white/20'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Views" value={data?.totalViews ?? 0} trend={viewsTrend} icon={Eye} loading={loading} />
          <MetricCard title="Unique Visitors" value={data?.uniqueVisitors ?? 0} trend={viewsTrend ? Math.round(viewsTrend * 0.8) : null} icon={Users} loading={loading} />
          <MetricCard title="Leads Generated" value={leadsCount} trend={null} icon={UserPlus} loading={loading} />
          <MetricCard title="Appointments" value={appointmentsCount} trend={null} icon={Calendar} loading={loading} />
        </div>

        <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10 mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Conversion Funnel</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Visitor-to-appointment pipeline — step conversion rates shown between stages</p>
          
          {loading ? (
             <div className="space-y-8 animate-pulse">
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-full"></div>
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-3/4"></div>
                <div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-1/2"></div>
             </div>
          ) : totalVisitors === 0 ? (
             <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
               <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">No visitor data for this period</p>
             </div>
          ) : (
            <div className="space-y-6">
              {funnelSteps.map((step, index) => {
                const width = totalVisitors > 0 ? Math.max(5, (step.count / totalVisitors) * 100) : 0;
                const conversion = getFunnelConversion(index);
                
                return (
                  <div key={step.label}>
                    {conversion && (
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3 ml-2">
                        <ArrowRight className="w-3 h-3" /> {conversion} conversion
                      </div>
                    )}
                    <div className="flex items-center gap-6">
                      <div className="w-32 text-sm font-bold text-slate-700 dark:text-slate-200">{step.label}</div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-full h-10 overflow-hidden relative">
                          <div 
                            className={`absolute left-0 top-0 bottom-0 ${step.color} rounded-r-full transition-all duration-1000 ease-out flex items-center justify-end px-4`}
                            style={{ width: `${width}%` }}
                          >
                             {step.count > 0 && width > 15 && <span className="text-white text-xs font-bold">{step.count.toLocaleString()}</span>}
                          </div>
                        </div>
                        { (step.count === 0 || width <= 15) && <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-12">{step.count.toLocaleString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center">
                <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-2.5 py-1 rounded-md mr-3">Overall</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  End-to-end conversion: <strong className="text-indigo-600 dark:text-indigo-400">{overallConversion}%</strong> 
                  <span className="text-slate-400 dark:text-slate-500 ml-1">({totalVisitors.toLocaleString()} visitors → {appointmentsCount.toLocaleString()} appointments)</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Active Visitors Trend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Daily profile views over the last {days} days</p>

            {loading ? (
              <div className="h-[280px] bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse" />
            ) : viewsChartData.length === 0 ? (
               <div className="h-[280px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
                 <div className="text-center">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No trend data available</p>
                 </div>
               </div>
            ) : (
              <div className="h-[280px] -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5a5af3" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#5a5af3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 600, background: '#0f172a', color: '#fff' }}
                      itemStyle={{ color: '#5a5af3' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      name="Views"
                      stroke="#5a5af3" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#5a5af3' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Top Share Channels</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Most frequent ways visitors share this card</p>

            {loading ? (
              <div className="space-y-5 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4">
                     <div className="w-24 h-4 bg-slate-100 dark:bg-white/5 rounded"></div>
                     <div className="flex-1 h-6 bg-slate-50 dark:bg-white/5 rounded-r-full"></div>
                  </div>
                ))}
              </div>
            ) : sharesChartData.length === 0 ? (
               <div className="h-[280px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
                 <div className="text-center">
                    <Share2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No shares recorded yet</p>
                 </div>
               </div>
            ) : (
              <div className="space-y-6 flex flex-col justify-center min-h-[280px]">
                {sharesChartData.slice(0, 8).map((row) => {
                  const width = Math.max(2, row.pct);
                  return (
                    <div key={row.channel} className="flex items-center gap-4">
                      <div className="w-28 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {row.meta.isSvg ? (
                          <span 
                            className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full"
                            style={{ color: row.meta.color }}
                          >
                            {row.meta.icon}
                          </span>
                        ) : (
                          <row.meta.icon className="w-4 h-4" style={{ color: row.meta.color }} />
                        )}
                        <span className="truncate">{row.meta.label}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                         <div className="flex-1 bg-slate-50 dark:bg-white/5 h-8 rounded-full overflow-hidden relative">
                           <div 
                             className="absolute left-0 top-0 bottom-0 rounded-r-full transition-all duration-1000 ease-out flex items-center justify-end px-3"
                             style={{ width: `${width}%`, backgroundColor: row.meta.color }}
                           >
                           </div>
                         </div>
                         <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-8">{row.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10 relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8 z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Device Analytics</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Visitor device breakdown</p>
              </div>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest shadow-sm">
                <Crown className="w-3.5 h-3.5" /> PRO
              </div>
            </div>
            
            {!isPro ? (
              <>
                {/* Locked Content Overlay */}
                <div className="absolute inset-0 z-20 bg-white/60 dark:bg-[#1e1e2a]/80 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center mt-20">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unlock Device Insights</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-[250px]">
                    Upgrade to PRO to see exactly what devices your visitors are using.
                  </p>
                  <Link to="/dashboard/premium" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                    Upgrade Now
                  </Link>
                </div>

                {/* Blurred Dummy Chart in background */}
                <div className="opacity-40 blur-[2px] pointer-events-none flex-1 flex flex-col">
                  <div className="h-[280px] flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Mobile', value: 65, fill: '#3b82f6' },
                            { name: 'Desktop', value: 25, fill: '#8b5cf6' },
                            { name: 'Tablet', value: 10, fill: '#f59e0b' }
                          ]}
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Mobile', value: 65, fill: '#3b82f6' },
                            { name: 'Desktop', value: 25, fill: '#8b5cf6' },
                            { name: 'Tablet', value: 10, fill: '#f59e0b' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-blue-500"></span>Mobile</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-purple-500"></span>Desktop</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400"><span className="w-3 h-3 rounded-full bg-amber-500"></span>Tablet</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {loading ? (
                   <div className="h-[280px] bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse" />
                ) : deviceChartData.length === 0 ? (
                    <div className="h-[280px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
                      <p className="text-slate-500 font-medium">No device data</p>
                    </div>
                ) : (
                    <div className="h-[280px] flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceChartData}
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {deviceChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: '#0f172a', color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                         <span className="text-3xl font-bold text-slate-900 dark:text-white">{data?.totalViews || 0}</span>
                         <span className="text-xs text-slate-500">Total Views</span>
                      </div>
                    </div>
                )}
                
                {!loading && deviceChartData.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                    {deviceChartData.map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }}></span>
                        {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="bg-white dark:bg-[#1e1e2a] rounded-[1.25rem] p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-white/10 relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-8 z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Top Traffic Sources</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Where your visitors came from</p>
              </div>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-widest shadow-sm">
                <Crown className="w-3.5 h-3.5" /> PRO
              </div>
            </div>
            
            {!isPro ? (
              <>
                <div className="absolute inset-0 z-20 bg-white/60 dark:bg-[#1e1e2a]/80 backdrop-blur-[6px] flex flex-col items-center justify-center p-6 text-center mt-20">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unlock Traffic Sources</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-[250px]">
                    Upgrade to PRO to discover exactly where your audience is finding you.
                  </p>
                  <Link to="/dashboard/premium" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                    Upgrade Now
                  </Link>
                </div>

                <div className="opacity-40 blur-[2px] pointer-events-none flex-1 flex flex-col space-y-6 justify-center min-h-[280px]">
                  {[
                    { source: 'Direct', count: 142, pct: 100 },
                    { source: 'LinkedIn', count: 85, pct: 60 },
                    { source: 'Twitter', count: 42, pct: 30 }
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          {item.source}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {loading ? (
                  <div className="flex-1 flex flex-col space-y-6 justify-center min-h-[280px]">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <div className="h-4 w-24 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                          <div className="h-4 w-8 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                        </div>
                        <div className="w-full bg-slate-50 dark:bg-white/5 rounded-full h-2 animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : sourceChartData.length === 0 ? (
                  <div className="h-[280px] flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-white/10 rounded-xl">
                    <p className="text-slate-500 font-medium">No source data</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-6 justify-center min-h-[280px]">
                    {sourceChartData.map((item, index) => {
                      const meta = CHANNEL_META[item.source] || CHANNEL_META.OTHER;
                      const Icon = meta.icon;
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              {meta.isSvg ? (
                                <span dangerouslySetInnerHTML={{ __html: Icon }} className="w-4 h-4" style={{ color: meta.color }} />
                              ) : (
                                <Icon className="w-4 h-4" style={{ color: meta.color }} />
                              )}
                              {meta.label}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-2 rounded-full transition-all duration-1000 ease-out relative" 
                              style={{ width: `${item.pct}%`, backgroundColor: meta.color || '#3b82f6' }}
                            >
                              <div className="absolute inset-0 bg-white/20" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
