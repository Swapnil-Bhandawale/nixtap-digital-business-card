import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, CreditCard, Users, Calendar, BarChart3, MessageSquare, Layers, Settings,
  Sun, Moon, LogOut, Menu, X, Search, Plus, Palette, Bell, CheckCircle, Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { themeColorMap } from '../../utils/themeColors';
import { useState, useEffect, useRef } from 'react';
import ThemeCustomizer from './ThemeCustomizer';
import { apiClient as axiosInstance } from '../../api/axios';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid, end: true },
      { to: '/dashboard/cards', label: 'Cards', icon: CreditCard },
      { to: '/dashboard/leads', label: 'Leads', icon: Users },
      { to: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { to: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare },
    ],
  },
  {
    label: 'Library',
    items: [{ to: '/dashboard/templates', label: 'Templates', icon: Layers }],
  },
];


const t = (key, lang) => {
  const dict = {
    English: {
      Overview: 'Overview', Dashboard: 'Dashboard', Cards: 'Cards', Leads: 'Leads', Appointments: 'Appointments',
      Insights: 'Insights', Analytics: 'Analytics', Feedback: 'Feedback',
      Library: 'Library', Templates: 'Templates', Settings: 'Settings', Logout: 'Log out', Search: 'Search anything...', SearchCards: 'Search cards...', SearchAppointments: 'Search appointments...', SearchLeads: 'Search leads...'
    },
    Deutsch: {
      Overview: 'Überblick', Dashboard: 'Übersicht', Cards: 'Karten', Leads: 'Interessenten', Appointments: 'Termine',
      Insights: 'Einblicke', Analytics: 'Analytik', Feedback: 'Feedback',
      Library: 'Bibliothek', Templates: 'Vorlagen', Settings: 'Einstellungen', Logout: 'Abmelden', Search: 'Suche alles...', SearchCards: 'Karten suchen...', SearchAppointments: 'Termine suchen...', SearchLeads: 'Interessenten suchen...'
    },
    'Français': {
      Overview: 'Aperçu', Dashboard: 'Tableau de bord', Cards: 'Cartes', Leads: 'Pistes', Appointments: 'Rendez-vous',
      Insights: 'Aperçus', Analytics: 'Analytique', Feedback: 'Commentaires',
      Library: 'Bibliothèque', Templates: 'Modèles', Settings: 'Paramètres', Logout: 'Déconnexion', Search: 'Rechercher...', SearchCards: 'Rechercher des cartes...', SearchAppointments: 'Rechercher des rendez-vous...', SearchLeads: 'Rechercher des pistes...'
    }
  };
  return dict[lang]?.[key] || key;
};

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const { color, density, layout, container, direction, language } = useSettingsStore();
  const themeColors = themeColorMap[color] || themeColorMap['Violet'];

  const handleNewCardClick = async () => {
    if (user?.planType === 'PRO' || user?.planType === 'BUSINESS') {
      navigate('/dashboard/cards/create');
      return;
    }
    try {
      const res = await axiosInstance.get('/cards');
      const cards = res.data?.data || [];
      if (cards.length >= 1) navigate('/dashboard/premium');
      else navigate('/dashboard/cards/create');
    } catch (err) {
      console.error('Failed to check card limit', err);
      navigate('/dashboard/cards/create');
    }
  };

  // Apply Direction
  useEffect(() => {
    document.documentElement.dir = direction === 'RTL' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'Deutsch' ? 'de' : language === 'Français' ? 'fr' : 'en';
  }, [direction, language]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  // Density Mapping for sidebar items
  const densityPadding = {
    Compact: 'py-1.5',
    Comfortable: 'py-2.5',
    Spacious: 'py-3.5',
  }[density] || 'py-2.5';

  const densitySpacing = {
    Compact: 'space-y-2',
    Comfortable: 'space-y-6',
    Spacious: 'space-y-8',
  }[density] || 'space-y-6';

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-6 py-6 shrink-0">
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center text-white font-bold text-sm`}>
          N
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">Nixtap</span>
      </div>

      <nav className={`flex-1 px-4 ${densitySpacing} overflow-y-auto mt-2`}>
        {NAV_GROUPS.map((group) => (
          <div key={t(group.label, language)}>
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t(group.label, language)}
            </p>
            <div className="space-y-1">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 ${densityPadding} rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? themeColors.activeNav
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {t(label, language)}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {layout === 'Sidebar' && (
        <div className="p-4 shrink-0 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          <NavLink
            to="/dashboard/premium"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 ${densityPadding} rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 text-amber-700 dark:text-amber-400'
                  : 'text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`
            }
          >
            <span className="text-[16px]">💎</span>
            Premium
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            onClick={closeMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 ${densityPadding} rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? themeColors.activeNav
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            <Settings className="w-[18px] h-[18px]" />
            Settings
          </NavLink>
        </div>
      )}
    </>
  );

  const TopNavMenu = () => (
    <div className="bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800/60 px-8 flex items-center gap-6 h-12 overflow-x-auto shrink-0">
      {NAV_GROUPS.flatMap(g => g.items).map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm font-semibold whitespace-nowrap h-full border-b-2 transition-colors ${
              isActive
                ? `border-current ${themeColors.text}`
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`
          }
        >
          <Icon className="w-4 h-4" />
          {t(label, language)}
        </NavLink>
      ))}
      <NavLink
        to="/dashboard/premium"
        className={({ isActive }) =>
          `flex items-center gap-2 text-sm font-bold whitespace-nowrap h-full border-b-2 transition-colors ${
            isActive
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-amber-500 hover:text-amber-600 dark:hover:text-amber-400'
          }`
        }
      >
        <span className="text-[14px]">💎</span>
        Premium
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        className={({ isActive }) =>
          `flex items-center gap-2 text-sm font-semibold whitespace-nowrap h-full border-b-2 transition-colors ${
            isActive
              ? `border-current ${themeColors.text}`
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`
        }
      >
        <Settings className="w-4 h-4" />
        Settings
      </NavLink>
    </div>
  );

  const TopHeader = () => {
    const placeholders = [
      'Search anything...',
      'Search cards...',
      'Search appointments...',
      'Search leads...'
    ];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 4000);
      return () => clearInterval(interval);
    }, []);

    return (
      <header className="h-[76px] shrink-0 bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0">
      
      {layout === 'Top Nav' && (
        <div className="hidden lg:flex items-center gap-2 mr-6">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center text-white font-bold text-sm`}>
            N
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">Nixtap</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="hidden md:flex items-center w-full max-w-md">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-4 w-[18px] h-[18px] text-slate-400" />
          <input 
            type="text" 
            placeholder={t(placeholders[placeholderIndex].replace('Search anything...', 'Search').replace('Search cards...', 'SearchCards').replace('Search appointments...', 'SearchAppointments').replace('Search leads...', 'SearchLeads'), language)} 
            className={`w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-700/80 rounded-[14px] pl-11 pr-12 py-2.5 text-sm outline-none focus:ring-2 ${themeColors.ring} dark:text-slate-200 placeholder-slate-400 transition-shadow`}
          />
          
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 lg:gap-5 ml-auto">
        <button onClick={handleNewCardClick} className={`hidden sm:flex items-center gap-2 bg-gradient-to-r ${themeColors.gradient} hover:opacity-90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-opacity shadow-sm`}>
          <Plus className="w-4 h-4" />
          New Card
        </button>

        <div className="flex items-center gap-1 lg:gap-2 ml-1">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button onClick={() => setIsCustomizerOpen(true)} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Palette className="w-5 h-5" />
          </button>
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-[9px] right-[9px] w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1e293b]"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden z-50 py-2">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Notifications <span className="ml-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs">2</span></span>
                  <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Mark all read
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {/* Dummy Appointments */}
                  <div 
                    onClick={() => { setShowNotifications(false); navigate('/dashboard/appointments'); }}
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800 flex gap-3 text-left"
                  >
                    <div className={`w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shrink-0`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">New Appointment Request</p>
                      <p className="text-xs text-slate-500 mt-0.5">Jane Doe requested a meeting for tomorrow at 10:00 AM.</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">10 mins ago</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  </div>
                  <div 
                    onClick={() => { setShowNotifications(false); navigate('/dashboard/appointments'); }}
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 text-left"
                  >
                    <div className={`w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Appointment Confirmed</p>
                      <p className="text-xs text-slate-500 mt-0.5">Your meeting with John Smith has been confirmed.</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 p-2">
                  <button onClick={() => { setShowNotifications(false); navigate('/dashboard/appointments'); }} className={`w-full text-center py-2 text-sm font-semibold ${themeColors.text} hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors`}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-1" ref={profileRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer overflow-hidden`}
            >
              {user?.avatarBase64 ? (
                <img src={user.avatarBase64} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.fullName)
              )}
            </div>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden z-50 py-2">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
              
              <div className="py-1">
                <button onClick={() => { setShowProfileMenu(false); navigate('/dashboard/settings'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>
                <button onClick={() => { setShowProfileMenu(false); setShowNotifications(true); }} className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-slate-400" />
                    Notifications
                  </div>
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">2</span>
                </button>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left">
                  <LogOut className="w-4 h-4 text-red-400" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Desktop Sidebar (Only if layout is Sidebar) */}
      {layout === 'Sidebar' && (
        <aside className="hidden lg:flex w-[260px] flex-shrink-0 bg-white dark:bg-[#1e293b] border-r border-slate-200/60 dark:border-slate-800/60 flex-col">
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col flex-1 w-full min-w-0 h-screen">
        <header className="h-16 shrink-0 bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 z-50 relative">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${themeColors.gradient} flex items-center justify-center text-white font-bold text-xs`}>
              N
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">Nixtap</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 bg-white dark:bg-[#1e293b] flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <SidebarContent />
          </div>
        )}

        <main className={`flex-1 min-w-0 overflow-auto ${mobileMenuOpen ? 'hidden' : 'block'}`}>
          <div className={container === 'Boxed' ? 'max-w-[1200px] mx-auto w-full' : 'w-full'}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Desktop Main */}
      <main className="hidden lg:flex flex-col flex-1 min-w-0 h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a]">
        <TopHeader />
        {layout === 'Top Nav' && <TopNavMenu />}
        <div className="flex-1 overflow-auto">
          <div className={container === 'Boxed' ? 'max-w-[1200px] mx-auto w-full transition-all duration-300' : 'w-full transition-all duration-300'}>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Theme Customizer Drawer */}
      <ThemeCustomizer isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
    </div>
  );
}
