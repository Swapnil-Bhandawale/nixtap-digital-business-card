const fs = require('fs');
let content = fs.readFileSync('src/pages/app/Dashboard.jsx', 'utf8');

const replacement = `</motion.div>

          {/* 2. TWO-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* LEFT COLUMN: Main Chart & Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card Performance Chart */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Growth</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly recurring view trend</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                      <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">Views</button>
                      <button className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={() => navigate('/dashboard/analytics')}>Details</button>
                    </div>
                    <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#593cfb] transition-shadow appearance-none cursor-pointer" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                    </select>
                  </div>
                </div>`;

content = content.replace('</motion.div>\n              <div className="h-[300px] w-full mt-auto">', replacement + '\n              <div className="h-[300px] w-full mt-auto">');
fs.writeFileSync('src/pages/app/Dashboard.jsx', content, 'utf8');
