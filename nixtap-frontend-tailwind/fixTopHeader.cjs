const fs = require('fs');
let content = fs.readFileSync('src/components/layout/DashboardLayout.jsx', 'utf8');

const oldTopHeader = `  const TopHeader = () => (
    <header className="h-[76px] shrink-0 bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">`;

const newTopHeader = `  const TopHeader = () => {
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
      }, 1500);
      return () => clearInterval(interval);
    }, []);

    return (
      <header className="h-[76px] shrink-0 bg-white dark:bg-[#1e293b] border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">`;

content = content.replace(oldTopHeader, newTopHeader);

// Now I also need to make sure the closing `)` is changed to `); }` at the end of TopHeader
// TopHeader ends right before:
//  const TopNavMenu = () => (

const topNavRegex = /      <\/div>\n    <\/header>\n  \);/g;
content = content.replace(topNavRegex, `      </div>\n    </header>\n  );\n  };`);

fs.writeFileSync('src/components/layout/DashboardLayout.jsx', content, 'utf8');
