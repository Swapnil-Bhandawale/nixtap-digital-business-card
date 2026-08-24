import fs from 'fs';

let c = fs.readFileSync('src/pages/app/Dashboard.jsx', 'utf8');

c = c.replace(/const mockAppts = JSON\.parse\(localStorage\.getItem\('mockAppts'\) \|\| '\[\]'\)\.filter\(a => a\.cardId === c\.id\);\s*if \(mockAppts\.length > 0\) \{\s*cardAppts = \[\.\.\.cardAppts, \.\.\.mockAppts\];\s*\}/g, '');

c = c.replace(/const mockAppts = JSON\.parse\(localStorage\.getItem\('mockAppts'\) \|\| '\[\]'\)\.filter\(a => a\.cardId === c\.id\);\s*if \(mockAppts\.length > 0\) \{\s*totalAppts \+= mockAppts\.length;\s*mockAppts\.forEach\(appt => \{\s*allAppts\.push\(\{ \.\.\.appt, cardName: c\.title \|\| c\.name \|\| c\.fullName \}\);\s*allActivity\.push\(\{\s*id: `appt_$\{appt\.id\}`, type: 'appointment',\s*name: appt\.visitorName \|\| 'Unknown Appointment',\s*detail: `Meeting on $\{c\.title \|\| c\.name \|\| c\.fullName \|\| 'Card'\}`,\s*status: appt\.status \|\| 'PENDING', time: appt\.createdAt \|\| appt\.requestedDatetime, link: '\/dashboard\/appointments',\s*icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500\/10'\s*\}\);\s*\}\);\s*\}/g, '');

fs.writeFileSync('src/pages/app/Dashboard.jsx', c, 'utf8');
