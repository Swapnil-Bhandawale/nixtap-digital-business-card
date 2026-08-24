const fs = require('fs');
let content = fs.readFileSync('src/components/layout/DashboardLayout.jsx', 'utf8');

// 1. Inject state and useEffect for TopHeader
const topHeaderSearch = `  const TopHeader = () => {
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
      }, 2000);
      return () => clearInterval(interval);
    }, []);
`;
content = content.replace('  const TopHeader = () => {', topHeaderSearch);

// 2. Add new translations for the new strings
const translationsAddition = `Search: 'Search anything...', SearchCards: 'Search cards...', SearchAppointments: 'Search appointments...', SearchLeads: 'Search leads...'`;
content = content.replace(/Search: 'Search anything...'/g, translationsAddition);
content = content.replace(/Search: 'Suche alles...'/g, `Search: 'Suche alles...', SearchCards: 'Karten suchen...', SearchAppointments: 'Termine suchen...', SearchLeads: 'Interessenten suchen...'`);
content = content.replace(/Search: 'Rechercher...'/g, `Search: 'Rechercher...', SearchCards: 'Rechercher des cartes...', SearchAppointments: 'Rechercher des rendez-vous...', SearchLeads: 'Rechercher des pistes...'`);


// 3. Update the input placeholder to use the rotating state
content = content.replace(
  `placeholder={t('Search', language)}`,
  `placeholder={t(placeholders[placeholderIndex].replace('Search anything...', 'Search').replace('Search cards...', 'SearchCards').replace('Search appointments...', 'SearchAppointments').replace('Search leads...', 'SearchLeads'), language)}`
);

// 4. Remove the ⌘K element
// The element is:
/*
            <div className="absolute right-3 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">⌘K</span>
            </div>
*/
const kBlockRegex = /<div className="absolute right-3 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1\.5 py-0\.5 shadow-\[0_1px_2px_rgba\(0,0,0,0\.05\)\]">[\s\S]*?<\/div>/;
content = content.replace(kBlockRegex, '');

fs.writeFileSync('src/components/layout/DashboardLayout.jsx', content, 'utf8');
