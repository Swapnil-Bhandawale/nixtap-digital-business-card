const fs = require('fs');
let content = fs.readFileSync('src/pages/public/PublicCard.jsx', 'utf8');

// Add state for Lead modal
if (!content.includes('isLeadOpen')) {
  content = content.replace(
    /const \[isApptOpen, setIsApptOpen\] = useState\(false\);/,
    `const [isApptOpen, setIsApptOpen] = useState(false);
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [leadState, setLeadState] = useState('idle');
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadState('submitting');
    try {
      await publicApi.submitLead(cardId, {
        visitorName: leadForm.name,
        visitorEmail: leadForm.email,
        visitorPhone: leadForm.phone,
        message: leadForm.message
      });
      setLeadState('success');
      setLeadForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setLeadState('error');
    }
  };\n`
  );
}

// Add 'Connect' button
if (!content.includes('setIsLeadOpen(true)')) {
  content = content.replace(
    /<Button className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" style=\{\{ backgroundColor: card.themeColor \|\| '#8b5cf6', color: '#fff' \}\}>\s*Save Contact\s*<\/Button>/,
    `<Button className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
              Save Contact
            </Button>
            <Button onClick={() => setIsLeadOpen(true)} className="w-full h-14 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all bg-white border-2 text-gray-800" style={{ borderColor: card.themeColor || '#8b5cf6' }}>
              Exchange Contacts
            </Button>`
  );
}

// Add Lead Modal JSX
if (!content.includes('Lead Capture Modal')) {
  const leadModalJsx = `
          {/* Lead Capture Modal */}
          {isLeadOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <h2 className="text-xl font-bold text-gray-900">Exchange Contacts</h2>
                  <button onClick={() => setIsLeadOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {leadState === 'success' ? (
                  <div className="p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Details Sent!</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">{card.fullName} has received your information.</p>
                    <Button onClick={() => { setIsLeadOpen(false); setLeadState('idle'); }} className="w-full h-12 text-base font-semibold rounded-xl" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                      {leadState === 'error' && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-100">
                          Failed to send. Please try again.
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Name *</label>
                        <input type="text" required value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                          <input type="email" required value={leadForm.email} onChange={e => setLeadForm({...leadForm, email: e.target.value})} placeholder="jane@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                          <input type="tel" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
                        <textarea value={leadForm.message} onChange={e => setLeadForm({...leadForm, message: e.target.value})} placeholder="Any message?" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none" style={{ '--tw-ring-color': card.themeColor || '#8b5cf6' }} />
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                      <Button type="submit" disabled={leadState === 'submitting'} className="w-full h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70" style={{ backgroundColor: card.themeColor || '#8b5cf6', color: '#fff' }}>
                        {leadState === 'submitting' ? 'Sending...' : 'Send Details'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
`;
  content = content.replace('{/* Appointment Booking Modal */}', leadModalJsx + '\n\n          {/* Appointment Booking Modal */}');
}

fs.writeFileSync('src/pages/public/PublicCard.jsx', content, 'utf8');
console.log('PublicCard.jsx updated with Lead flow');
