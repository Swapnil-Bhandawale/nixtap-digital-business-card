const fs = require('fs');
let content = fs.readFileSync('src/pages/app/Dashboard.jsx', 'utf8');

const newStatCard = `const StatCard = ({ icon: Icon, label, value }) => {
  const { color } = useSettingsStore();
  const themeColors = themeColorMap[color] || themeColorMap['Violet'];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className={\`w-14 h-14 rounded-2xl bg-gradient-to-br \${themeColors.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-sm\`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};`;
content = content.replace(/const StatCard = \(\{ icon: Icon, label, value \}\) => \{[\s\S]*?<\/motion\.div>\s*\);\s*\};/, newStatCard);

const newHeaderAndGrid = `{/* 1. FLUX-STYLE CLEAN HEADER & KPIs */}
          <div className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your Nixtap profile today.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={CreditCard} label="Total Cards" value={data.stats.cards} />
            <StatCard icon={Eye} label="Total Views" value={data.stats.views} />
            <StatCard icon={Users} label="Total Leads" value={data.stats.leads} />
            <StatCard icon={Calendar} label="Appointments" value={data.stats.appointments} />
          </div>`;
content = content.replace(/\{\/\* 1\. FLUX-STYLE HERO BANNER WITH KPIs \*\/\}[\s\S]*?<\/motion\.div>/, newHeaderAndGrid);

fs.writeFileSync('src/pages/app/Dashboard.jsx', content, 'utf8');
