import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Settings as SettingsIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Bell,
  Palette,
  Plus
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center px-4 py-3 mb-1.5 rounded-xl transition-all duration-300 font-medium relative group overflow-hidden ${
      active 
      ? 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 shadow-sm' 
      : 'text-cloud-500 hover:bg-cloud-100 hover:text-cloud-900 dark:text-cloud-400 dark:hover:bg-cloud-800 dark:hover:text-cloud-100'
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full" />
    )}
    <Icon className={`w-5 h-5 mr-3 transition-colors ${active ? 'text-brand-600 dark:text-brand-400' : 'text-cloud-400 dark:text-cloud-500 group-hover:text-brand-500'}`} />
    {label}
  </Link>
);

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] || 'N') + (parts[1]?.[0] || '');
}

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact endpoints mapping to Backend APIs as per plan
  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Cards', to: '/dashboard/cards', icon: CreditCard },
    { name: 'Leads', to: '/dashboard/leads', icon: Users },
    { name: 'Appointments', to: '/dashboard/appointments', icon: Calendar },
    { name: 'Feedback', to: '/dashboard/feedback', icon: MessageSquare },
    { name: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  ];

  const bottomNav = [
    { name: 'Settings', to: '/dashboard/settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-[#0a0a0f] overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Premium Glassmorphism */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full md:h-auto 
        w-64 glass dark:glass-dark m-0 md:m-4 md:rounded-[24px] 
        flex flex-col shadow-2xl md:shadow-xl z-50 
        transition-transform duration-300 ease-out border border-slate-100 dark:border-slate-800
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-cloud-200/30 dark:border-cloud-700/30">
          {/* Re-using Nixtap text logo style */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold">N</div>
            <span className="text-xl font-bold text-cloud-900 dark:text-white tracking-tight">NIXTAP</span>
          </div>
          <button className="md:hidden text-cloud-500" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide">
          <div className="space-y-1">
            {navigation.map((item) => (
              <SidebarItem 
                key={item.name}
                icon={item.icon}
                label={item.name}
                to={item.to}
                active={location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to))}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-cloud-200/30 dark:border-cloud-700/30">
          <div className="space-y-1 mb-4">
            {bottomNav.map((item) => (
              <SidebarItem 
                key={item.name}
                icon={item.icon}
                label={item.name}
                to={item.to}
                active={location.pathname === item.to}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
          </div>
          <button onClick={logout} className="w-full px-4 py-3 flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm">
            <LogOut size={16} className="mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Bar matching Flux Template */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 mt-0 md:mt-4 md:mr-4 bg-white/40 dark:bg-[#1e293b]/40 backdrop-blur-md md:rounded-2xl border-b md:border border-white/40 dark:border-slate-800/40 shadow-sm z-10 transition-colors">
          <div className="flex items-center flex-1">
            <button 
              className="md:hidden p-2 mr-3 text-cloud-600 dark:text-cloud-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Flux Style Search Bar */}
            <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 flex-1 placeholder:text-slate-400"
              />
              <div className="flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400 text-[10px] font-bold px-1.5 py-0.5 ml-2">
                ⌘K
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 ml-4">
            <button 
              onClick={() => navigate('/dashboard/cards/create')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> New Card
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all hidden sm:block">
              <Palette className="w-5 h-5" />
            </button>

            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0a0a0f]"></span>
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer ml-1 select-none">
              {initialsOf(user?.fullName)}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0 scrollbar-hide">
          <div className="max-w-7xl mx-auto h-full pb-20">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
