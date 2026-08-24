import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      themeMode: 'Light', // Light, Dark, System
      color: 'Violet', // Emerald, Blue, Violet, Rose, Orange, Slate
      density: 'Comfortable', // Compact, Comfortable, Spacious
      layout: 'Sidebar', // Sidebar, Top Nav
      container: 'Fluid', // Fluid, Boxed
      direction: 'LTR', // LTR, RTL
      language: 'English', // English, Deutsch, Français
      
      setSetting: (key, value) => set({ [key]: value }),
      resetToDefaults: () => set({
        themeMode: 'Light',
        color: 'Violet',
        density: 'Comfortable',
        layout: 'Sidebar',
        container: 'Fluid',
        direction: 'LTR',
        language: 'English',
      }),
    }),
    {
      name: 'nixtap-ui-settings',
    }
  )
);
