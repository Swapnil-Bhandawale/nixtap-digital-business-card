const fs = require('fs');
let content = fs.readFileSync('src/components/layout/DashboardLayout.jsx', 'utf8');

// 1. Destructure language
content = content.replace(
  'const { color, density, layout, container, direction } = useSettingsStore();',
  'const { color, density, layout, container, direction, language } = useSettingsStore();'
);

// 2. Add Translations
const translationsCode = `
const t = (key, lang) => {
  const dict = {
    English: {
      Overview: 'Overview', Dashboard: 'Dashboard', Cards: 'Cards', Leads: 'Leads', Appointments: 'Appointments',
      Insights: 'Insights', Analytics: 'Analytics', Feedback: 'Feedback',
      Library: 'Library', Templates: 'Templates', Settings: 'Settings', Logout: 'Log out', Search: 'Search anything...'
    },
    Deutsch: {
      Overview: 'Überblick', Dashboard: 'Übersicht', Cards: 'Karten', Leads: 'Interessenten', Appointments: 'Termine',
      Insights: 'Einblicke', Analytics: 'Analytik', Feedback: 'Feedback',
      Library: 'Bibliothek', Templates: 'Vorlagen', Settings: 'Einstellungen', Logout: 'Abmelden', Search: 'Suche alles...'
    },
    'Français': {
      Overview: 'Aperçu', Dashboard: 'Tableau de bord', Cards: 'Cartes', Leads: 'Pistes', Appointments: 'Rendez-vous',
      Insights: 'Aperçus', Analytics: 'Analytique', Feedback: 'Commentaires',
      Library: 'Bibliothèque', Templates: 'Modèles', Settings: 'Paramètres', Logout: 'Déconnexion', Search: 'Rechercher...'
    }
  };
  return dict[lang]?.[key] || key;
};
`;
if (!content.includes('const t = (key, lang) =>')) {
    content = content.replace('export default function DashboardLayout() {', translationsCode + '\nexport default function DashboardLayout() {');
}

// 3. Fix container Boxed classes
content = content.replace(/max-w-\[1600px\]/g, 'max-w-[1200px]');
content = content.replace(/max-w-7xl/g, 'max-w-[1200px]');

// 4. Update direction hook to also set language
content = content.replace(
  'document.documentElement.dir = direction === \'RTL\' ? \'rtl\' : \'ltr\';',
  'document.documentElement.dir = direction === \'RTL\' ? \'rtl\' : \'ltr\';\n    document.documentElement.lang = language === \'Deutsch\' ? \'de\' : language === \'Français\' ? \'fr\' : \'en\';'
);
content = content.replace('[direction]', '[direction, language]');

// 5. Use translations in rendering
content = content.replace(/\{group\.label\}/g, '{t(group.label, language)}');
content = content.replace(/\{label\}/g, '{t(label, language)}');
content = content.replace(/>Settings<\/NavLink>/g, '>{t(\'Settings\', language)}</NavLink>');
content = content.replace(/>Settings<\/button>/g, '>{t(\'Settings\', language)}</button>');
content = content.replace(/>Logout<\/button>/g, '>{t(\'Logout\', language)}</button>');
content = content.replace(/>Log out<\/button>/g, '>{t(\'Logout\', language)}</button>');
content = content.replace(/placeholder="Search anything..."/g, 'placeholder={t(\'Search\', language)}');

fs.writeFileSync('src/components/layout/DashboardLayout.jsx', content, 'utf8');
