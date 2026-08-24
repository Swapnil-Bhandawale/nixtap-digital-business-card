import { X, Sun, Moon, Monitor, PanelLeft, PanelTop, Maximize, Shrink, AlignLeft, AlignRight, Globe, Check, Lock } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../context/ThemeContext';
import { themeColorMap } from '../../utils/themeColors';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

// Custom icons based on the image
const CompactIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg>
);
const ComfortableIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
);
const SpaciousIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="4" rx="1"></rect><rect x="4" y="14" width="16" height="4" rx="1"></rect></svg>
);

const colors = [
  { name: 'Emerald', class: 'bg-[#10b981]', isPremium: true },
  { name: 'Blue', class: 'bg-[#3b82f6]', isPremium: false },
  { name: 'Violet', class: 'bg-[#593cfb]', isPremium: false }, // Matching the brand color
  { name: 'Rose', class: 'bg-[#e11d48]', isPremium: true },
  { name: 'Orange', class: 'bg-[#f97316]', isPremium: true },
  { name: 'Slate', class: 'bg-[#64748b]', isPremium: false },
];

export default function ThemeCustomizer({ isOpen, onClose }) {
  const settings = useSettingsStore();
  const { setTheme } = useTheme();
  const { user } = useAuthStore();
  const isPro = user?.planType === 'PRO' || user?.planType === 'BUSINESS';
  
  const themeColors = themeColorMap[settings.color] || themeColorMap['Violet'];

  // Sync theme
  useEffect(() => {
    if (settings.themeMode === 'Light') setTheme('light');
    else if (settings.themeMode === 'Dark') setTheme('dark');
  }, [settings.themeMode, setTheme]);

  // UI Builder Helper
  const OptionCard = ({ label, icon: Icon, isSelected, onClick, children }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
        isSelected 
          ? themeColors.activeNav
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-400 dark:hover:border-slate-600'
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-[100]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[320px] bg-white dark:bg-[#0f172a] shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme Customizer</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              <OptionCard label="Light" icon={Sun} isSelected={settings.themeMode === 'Light'} onClick={() => settings.setSetting('themeMode', 'Light')} />
              <OptionCard label="Dark" icon={Moon} isSelected={settings.themeMode === 'Dark'} onClick={() => settings.setSetting('themeMode', 'Dark')} />
              <OptionCard label="System" icon={Monitor} isSelected={settings.themeMode === 'System'} onClick={() => settings.setSetting('themeMode', 'System')} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Color</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {colors.map(c => {
                const isLocked = c.isPremium && !isPro;
                return (
                  <div key={c.name} className="relative">
                    <OptionCard 
                      label={c.name} 
                      isSelected={settings.color === c.name} 
                      onClick={() => {
                        if (!isLocked) {
                          settings.setSetting('color', c.name);
                        }
                      }}
                    >
                      <div className={`w-5 h-5 rounded-full ${c.class} flex items-center justify-center`}>
                        {settings.color === c.name && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </OptionCard>

                    {isLocked && (
                      <Link 
                        to="/dashboard/premium" 
                        onClick={onClose}
                        className="absolute inset-0 z-10 bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur-[1.5px] rounded-xl flex items-center justify-center border border-amber-200/50 dark:border-amber-900/30 hover:bg-white/50 dark:hover:bg-[#0f172a]/70 transition-colors group"
                        title="Upgrade to PRO to unlock"
                      >
                        <div className="bg-amber-100 dark:bg-amber-500/20 p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        </div>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Density */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Density</h3>
            <div className="grid grid-cols-3 gap-3">
              <OptionCard label="Compact" icon={CompactIcon} isSelected={settings.density === 'Compact'} onClick={() => settings.setSetting('density', 'Compact')} />
              <OptionCard label="Comfortable" icon={ComfortableIcon} isSelected={settings.density === 'Comfortable'} onClick={() => settings.setSetting('density', 'Comfortable')} />
              <OptionCard label="Spacious" icon={SpaciousIcon} isSelected={settings.density === 'Spacious'} onClick={() => settings.setSetting('density', 'Spacious')} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Layout</h3>
            <div className="grid grid-cols-2 gap-3">
              <OptionCard label="Sidebar" icon={PanelLeft} isSelected={settings.layout === 'Sidebar'} onClick={() => settings.setSetting('layout', 'Sidebar')} />
              <OptionCard label="Top Nav" icon={PanelTop} isSelected={settings.layout === 'Top Nav'} onClick={() => settings.setSetting('layout', 'Top Nav')} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Container */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Container</h3>
            <div className="grid grid-cols-2 gap-3">
              <OptionCard label="Fluid" icon={Maximize} isSelected={settings.container === 'Fluid'} onClick={() => settings.setSetting('container', 'Fluid')} />
              <OptionCard label="Boxed" icon={Shrink} isSelected={settings.container === 'Boxed'} onClick={() => settings.setSetting('container', 'Boxed')} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Direction */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Direction</h3>
            <div className="grid grid-cols-2 gap-3">
              <OptionCard label="LTR" icon={AlignLeft} isSelected={settings.direction === 'LTR'} onClick={() => settings.setSetting('direction', 'LTR')} />
              <OptionCard label="RTL" icon={AlignRight} isSelected={settings.direction === 'RTL'} onClick={() => settings.setSetting('direction', 'RTL')} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Language */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Language</h3>
            <div className="grid grid-cols-3 gap-3">
              <OptionCard label="English" icon={Globe} isSelected={settings.language === 'English'} onClick={() => settings.setSetting('language', 'English')} />
              <OptionCard label="Deutsch" icon={Globe} isSelected={settings.language === 'Deutsch'} onClick={() => settings.setSetting('language', 'Deutsch')} />
              <OptionCard label="FranÃ§ais" icon={Globe} isSelected={settings.language === 'FranÃ§ais'} onClick={() => settings.setSetting('language', 'FranÃ§ais')} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-[#1e293b]/50">
          <button 
            onClick={settings.resetToDefaults}
            className="w-full py-2.5 px-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            Reset to Defaults
          </button>
        </div>

      </div>
    </>
  );
}
