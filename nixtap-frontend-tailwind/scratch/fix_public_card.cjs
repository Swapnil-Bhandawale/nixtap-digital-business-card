const fs = require('fs');

let c = fs.readFileSync('src/pages/public/PublicCard.jsx', 'utf8');

if (!c.includes('import { publicApi }')) {
  c = c.replace(
    "import { cardApi } from '../../api/cardApi';",
    "import { cardApi } from '../../api/cardApi';\nimport { publicApi } from '../../api/publicApi';"
  );
}

const states = `
  const [isApptOpen, setIsApptOpen] = useState(false);
  const [apptState, setApptState] = useState('idle');
  const [apptForm, setApptForm] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '' });

  const handleApptSubmit = async (e) => {
    e.preventDefault();
    setApptState('submitting');
    try {
      const requestedDatetime = new Date(\`\${apptForm.date}T\${apptForm.time}\`).toISOString();
      await publicApi.bookAppointment(cardId, {
        visitorName: apptForm.name,
        visitorEmail: apptForm.email,
        visitorPhone: apptForm.phone,
        message: apptForm.message,
        requestedDatetime
      });
      setApptState('success');
      setApptForm({ name: '', email: '', phone: '', date: '', time: '', message: '' });
    } catch (err) {
      console.error(err);
      setApptState('error');
    }
  };
`;

if (!c.includes('const [isApptOpen')) {
  c = c.replace(
    'const [isLoading, setIsLoading] = useState(true);',
    'const [isLoading, setIsLoading] = useState(true);\n' + states
  );
}

fs.writeFileSync('src/pages/public/PublicCard.jsx', c, 'utf8');
