import fs from 'fs';

let c = fs.readFileSync('src/pages/app/Appointments.jsx', 'utf8');

c = c.replace(/const \[isAddModalOpen, setIsAddModalOpen\] = useState\(false\);\s*const \[addForm, setAddForm\] = useState\(\{ title: '', date: '', startTime: '', endTime: '', color: 'Primary', description: '' \}\);\s*const \[isAdding, setIsAdding\] = useState\(false\);/g, '');

c = c.replace(/const handleAddSubmit = async \(e\) => \{[\s\S]*?\}\s*\};/g, '');

c = c.replace(/<button[\s\S]*?onClick=\{[\s\S]*?setIsAddModalOpen\(true\)[\s\S]*?>[\s\S]*?<Plus[\s\S]*?\/>[\s\S]*?Add Event[\s\S]*?<\/button>/g, '');

c = c.replace(/\{\/\* Flux Style Add Event Modal \*\/\}\s*<Dialog open=\{isAddModalOpen\} onClose=\{\(\) => setIsAddModalOpen\(false\)\} className="relative z-50">[\s\S]*?<\/Dialog>/g, '');

c = c.replace(/\/\/ Fallback to localStorage if API failed or returned 0[\s\S]*?if \(mockAppts\.length > 0\) \{[\s\S]*?\/\/ Merge them in[\s\S]*?list = \[\.\.\.list, \.\.\.mockAppts\];[\s\S]*?\}/g, '');
c = c.replace(/const mockAppts = JSON\.parse\(localStorage\.getItem\('mockAppts'\) \|\| '\[\]'\)\.filter\(a => a\.cardId === cardId\);\s*setAppointments\(mockAppts\);/g, 'setAppointments([]);');

fs.writeFileSync('src/pages/app/Appointments.jsx', c, 'utf8');
