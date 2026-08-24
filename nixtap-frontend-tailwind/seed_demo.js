import mysql from 'mysql2/promise';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/v1';

async function seed() {
    console.log("Starting Demo Data Seeding...");
    const dbConfig = {
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: 'root'
    };

    const email = 'demo@nixtap.online';
    const password = 'DemoNixtap@2026';
    let authRes;

    try {
        console.log("1. Registering user...");
        authRes = await axios.post(`${API_BASE}/auth/register`, {
            email,
            password,
            fullName: 'Demo User',
            phone: '+15550000000'
        });
        console.log("Registration successful (unverified).");
    } catch (e) {
        if (e.response && e.response.status === 409) {
            console.log("User already exists. Skipping registration.");
        } else {
            console.error("Registration failed:", e.response ? e.response.data : e.message);
            process.exit(1);
        }
    }

    const authConn = await mysql.createConnection({ ...dbConfig, database: 'nixtap_auth_db' });
    const cardConn = await mysql.createConnection({ ...dbConfig, database: 'nixtap_card_db' });
    const engConn = await mysql.createConnection({ ...dbConfig, database: 'nixtap_engagement_db' });
    const analyticsConn = await mysql.createConnection({ ...dbConfig, database: 'nixtap_analytics_db' });

    console.log("2. Verifying user in DB...");
    await authConn.execute('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);
    console.log("User verified.");

    console.log("3. Logging in...");
    const loginRes = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const token = loginRes.data.data.token;
    const userId = loginRes.data.data.userId;
    console.log("Logged in. Token acquired.");

    const ax = axios.create({
        baseURL: API_BASE,
        headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log("4. Getting or Creating Card...");
    let cardId;
    let cardSlug;
    const cardsRes = await ax.get('/cards');
    if (cardsRes.data.data && cardsRes.data.data.length > 0) {
        cardId = cardsRes.data.data[0].id;
        cardSlug = cardsRes.data.data[0].customSlug;
        console.log("Card already exists:", cardId);
    } else {
        const createCardRes = await ax.post('/cards', {
            templateId: 1,
            fullName: 'Demo User',
            jobTitle: 'Creative Director',
            company: 'Nexus Innovations',
            email: 'hello@nexus-innovations.demo',
            phone: '+1 (555) 123-4567',
            bio: 'Helping brands build meaningful digital experiences. Let\'s connect and create something amazing together.',
            customSlug: 'nexus-demo-' + Date.now(),
            themeColor: '#2563EB'
        });
        cardId = createCardRes.data.data.id;
        cardSlug = createCardRes.data.data.customSlug;
        console.log("Created Card:", cardId);
        
        // Add social links
        await cardConn.execute('INSERT INTO social_links (card_id, platform, url, display_order) VALUES (?, ?, ?, ?)', [cardId, 'LINKEDIN', 'https://linkedin.com', 1]);
        await cardConn.execute('INSERT INTO social_links (card_id, platform, url, display_order) VALUES (?, ?, ?, ?)', [cardId, 'TWITTER', 'https://twitter.com', 2]);
        await cardConn.execute('INSERT INTO social_links (card_id, platform, url, display_order) VALUES (?, ?, ?, ?)', [cardId, 'WEBSITE', 'https://example.com', 3]);
    }

    console.log("5. Checking existing Leads...");
    const [existingLeads] = await engConn.execute('SELECT count(*) as c FROM lead_capture WHERE card_id = ?', [cardId]);
    if (existingLeads[0].c < 25) {
        console.log("6. Creating 25 Leads with backdated timestamps...");
        const names = ['Emma Watson', 'James Smith', 'Olivia Johnson', 'William Brown', 'Sophia Davis', 'Alexander Miller', 'Isabella Wilson', 'Ethan Moore', 'Mia Taylor', 'Benjamin Anderson', 'Charlotte Thomas', 'Jacob Jackson', 'Amelia White', 'Michael Harris', 'Harper Martin', 'Elijah Thompson', 'Evelyn Garcia', 'Daniel Martinez', 'Abigail Robinson', 'Matthew Clark', 'Emily Rodriguez', 'Henry Lewis', 'Elizabeth Lee', 'Jackson Walker', 'Sofia Hall'];
        
        for (let i = 0; i < 25; i++) {
            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            const msg = `Interested in discussing a potential collaboration. Please reach out when you have a moment. - ${names[i]}`;
            await engConn.execute(
                'INSERT INTO lead_capture (card_id, visitor_name, visitor_email, visitor_phone, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
                [cardId, names[i], names[i].split(' ')[0].toLowerCase() + '@example.com', '+1555' + Math.floor(1000000 + Math.random() * 9000000), msg, date]
            );
        }
    } else {
        console.log("Leads already populated.");
    }

    console.log("7. Checking existing Appointments...");
    const [existingAppts] = await engConn.execute('SELECT count(*) as c FROM appointments WHERE card_id = ?', [cardId]);
    if (existingAppts[0].c < 25) {
        console.log("8. Creating 25 Appointments with varied dates and statuses...");
        const names = ['Lucas Allen', 'Chloe Young', 'Mason Hernandez', 'Grace King', 'Logan Wright', 'Victoria Lopez', 'Levi Hill', 'Aria Scott', 'Sebastian Green', 'Lily Adams', 'Jack Baker', 'Hannah Gonzalez', 'Owen Nelson', 'Lillian Carter', 'Theodore Mitchell', 'Addison Perez', 'Aiden Roberts', 'Aubrey Turner', 'Samuel Phillips', 'Ellie Campbell', 'Joseph Parker', 'Stella Evans', 'John Edwards', 'Natalie Collins', 'David Stewart'];
        const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
        
        for (let i = 0; i < 25; i++) {
            // Requested date between 10 days ago and 20 days in the future
            const requestedDate = new Date(Date.now() + (Math.floor(Math.random() * 30) - 10) * 24 * 60 * 60 * 1000);
            const createdDate = new Date(requestedDate.getTime() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000));
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const msg = `Appointment request for consultation regarding new project layout.`;
            
            await engConn.execute(
                'INSERT INTO appointments (card_id, visitor_name, visitor_email, visitor_phone, requested_datetime, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [cardId, names[i], names[i].split(' ')[0].toLowerCase() + '@example.com', '+1555' + Math.floor(1000000 + Math.random() * 9000000), requestedDate, msg, status, createdDate]
            );
        }
    } else {
        console.log("Appointments already populated.");
    }
    
    console.log("9. Checking existing Feedback...");
    const [existingFb] = await engConn.execute('SELECT count(*) as c FROM visitor_feedback WHERE card_id = ?', [cardId]);
    if (existingFb[0].c < 10) {
        console.log("10. Creating 10 Feedback records...");
        const fbs = ['Great design!', 'Very professional.', 'Loved the quick response.', 'Impressive portfolio.', 'Nice to meet you!', 'Let\'s connect soon.', 'Highly recommended.', 'Excellent communication.', 'Beautiful digital card.', 'Thanks for your time.'];
        for (let i = 0; i < 10; i++) {
            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            await engConn.execute(
                'INSERT INTO visitor_feedback (card_id, visitor_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
                [cardId, 'Visitor ' + (i+1), Math.floor(Math.random() * 2) + 4, fbs[i], date]
            );
        }
    } else {
        console.log("Feedback already populated.");
    }

    console.log("11. Checking existing Analytics...");
    const [existingViews] = await analyticsConn.execute('SELECT count(*) as c FROM profile_views WHERE card_id = ?', [cardId]);
    if (existingViews[0].c < 100) {
        console.log("12. Creating 100+ Views over the last 30 days...");
        for (let i = 0; i < 200; i++) { // ~200 views
            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            const ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '8.8.8.8', '1.1.1.1'];
            await analyticsConn.execute(
                'INSERT INTO profile_views (card_id, visitor_ip, viewed_at) VALUES (?, ?, ?)',
                [cardId, ips[Math.floor(Math.random() * ips.length)], date]
            );
        }
        
        console.log("13. Creating 30+ Shares over the last 30 days...");
        const channels = ['WHATSAPP', 'EMAIL', 'LINKEDIN', 'TWITTER', 'COPY_LINK', 'QR_CODE', 'OTHER'];
        for (let i = 0; i < 50; i++) { // ~50 shares
            const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            // Weight towards certain channels
            let channel;
            const r = Math.random();
            if (r < 0.4) channel = 'COPY_LINK';
            else if (r < 0.7) channel = 'WHATSAPP';
            else if (r < 0.85) channel = 'LINKEDIN';
            else channel = channels[Math.floor(Math.random() * channels.length)];
            
            await analyticsConn.execute(
                'INSERT INTO card_shares (card_id, share_channel, shared_at) VALUES (?, ?, ?)',
                [cardId, channel, date]
            );
        }
    } else {
        console.log("Analytics already populated.");
    }

    await authConn.end();
    await cardConn.end();
    await engConn.end();
    await analyticsConn.end();

    console.log("==========================================");
    console.log("DEMO SEEDING COMPLETE");
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("Card ID: " + cardId);
    console.log("==========================================");
}

seed().catch(console.error);
