const http = require('http');

const JWT = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyMiIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzg2MzQ1MjQ5LCJleHAiOjE3ODY0MzE2NDl9.5u9JDyTkThBNNGUtX76cyO2wpJnZUobIpppPQjWlMI_l-O20Q0VxkjoWVyufEHsy';

const request = (path, method, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 8083, // bypassing API Gateway to hit engagement-service directly
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject('Error ' + res.statusCode + ': ' + body);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

(async () => {
  try {
    console.log('Using Card 6 for seeding leads and appointments...');
    /*
    console.log('Seeding Card 1...');
    const card1 = await request('/api/v1/cards', 'POST', {
      templateId: 1,
      fullName: 'Nixtap QA User',
      jobTitle: 'Senior Product Designer',
      company: 'Nixtap',
      phone: '+919876543210',
      email: 'qa@nixtap.test',
      customSlug: 'nixtap-qa-user',
      theme: '{"color":"#4f46e5","mode":"dark"}'
    });
    console.log('Created Card 1:', card1.data.id);

    console.log('Seeding Card 2...');
    const card2 = await request('/api/v1/cards', 'POST', {
      templateId: 2,
      fullName: 'Nixtap QA Business',
      jobTitle: 'Founder',
      company: 'Nixtap',
      customSlug: 'nixtap-qa-business'
    });
    console.log('Created Card 2:', card2.data.id);

    console.log('Seeding Card 3...');
    const card3 = await request('/api/v1/cards', 'POST', {
      templateId: 1,
      fullName: 'Nixtap QA Professional',
      jobTitle: 'Technology Consultant',
      company: 'Nixtap',
      customSlug: 'nixtap-qa-pro'
    });
    console.log('Created Card 3:', card3.data.id);
    */

    const cardId = 6; // Hardcoded to Card 6 which was created successfully in previous run
    console.log('Seeding Leads for Card', cardId);
    
    await request('/api/v1/public/cards/' + cardId + '/leads', 'POST', {
      visitorName: 'Rahul Deshmukh', visitorEmail: 'rahul.d@example.com', visitorPhone: '+919876543210', message: 'Would love to connect.'
    });
    await request('/api/v1/public/cards/' + cardId + '/leads', 'POST', {
      visitorName: 'Sneha Kulkarni', visitorEmail: 'sneha.k@example.com', visitorPhone: '+918765432109', message: 'Can we schedule a call?'
    });
    await request('/api/v1/public/cards/' + cardId + '/leads', 'POST', {
      visitorName: 'Aditya Joshi', visitorEmail: 'aditya.j@example.com', visitorPhone: '+917654321098', message: 'Interested in services.'
    });
    await request('/api/v1/public/cards/' + cardId + '/leads', 'POST', {
      visitorName: 'Meera Shah', visitorEmail: 'meera.s@example.com', visitorPhone: '+916543210987', message: 'Lead from networking event'
    });
    await request('/api/v1/public/cards/' + cardId + '/leads', 'POST', {
      visitorName: 'Vikram Patil', visitorEmail: 'vikram.p@example.com', visitorPhone: '+915432109876', message: 'Inquiry about pricing'
    });
    console.log('Created 5 Leads for Card 1');

    console.log('Seeding Appointments...');
    await request('/api/v1/public/cards/' + cardId + '/appointments', 'POST', {
      visitorName: 'Meera Shah', visitorEmail: 'meera.s@example.com', requestedDatetime: new Date(Date.now() + 86400000).toISOString(), message: 'Introductory call'
    });
    await request('/api/v1/public/cards/' + cardId + '/appointments', 'POST', {
      visitorName: 'Vikram Patil', visitorEmail: 'vikram.p@example.com', requestedDatetime: new Date(Date.now() + 172800000).toISOString(), message: 'Project discussion'
    });
    await request('/api/v1/public/cards/' + cardId + '/appointments', 'POST', {
      visitorName: 'Rahul Deshmukh', visitorEmail: 'rahul.d@example.com', requestedDatetime: new Date(Date.now() + 259200000).toISOString(), message: 'Final review'
    });
    console.log('Created 3 Appointments for Card 1');

  } catch(e) {
    console.error('Seeding failed:', e);
  }
})();
