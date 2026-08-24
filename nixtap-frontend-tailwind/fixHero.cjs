const fs = require('fs');
let content = fs.readFileSync('src/pages/app/Dashboard.jsx', 'utf8');

// 1. Revert StatCard to glassmorphic design
const newStatCard = `const StatCard = ({ icon: Icon, label, value }) => {
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
};`;
content = content.replace(/const StatCard = \(\{ icon: Icon, label, value \}\) => \{[\s\S]*?<\/motion\.div>\s*\);\s*\};/, newStatCard);

// 2. Revert to Hero Banner
const newHeaderAndGrid = `{/* 1. FLUX-STYLE HERO BANNER WITH KPIs */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={\`relative rounded-3xl overflow-hidden bg-gradient-to-r \${themeColors.gradient} p-8 md:p-10 text-white shadow-sm\`}>
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
          </motion.div>`;

content = content.replace(/\{\/\* 1\. FLUX-STYLE CLEAN HEADER & KPIs \*\/\}[\s\S]*?<\/div>\s*<\/div>/, newHeaderAndGrid);

fs.writeFileSync('src/pages/app/Dashboard.jsx', content, 'utf8');
