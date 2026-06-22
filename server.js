const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();
const PORT = 8081;
const DB_FILE = path.join(__dirname, 'database.json');

const JWT_SECRET = 'amitdivekar_super_secret_key_2026';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// DB Helpers
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Public Routes
app.get('/api/gallery', (req, res) => {
    const db = readDB();
    res.json(db.gallery || []);
});

app.post('/api/track', (req, res) => {
    const db = readDB();
    db.analytics = db.analytics || [];
    db.analytics.push(new Date().toISOString());
    writeDB(db);
    res.json({ success: true });
});

app.post('/api/contact', (req, res) => {
    const { name, contact, message } = req.body;
    if (!name || !contact || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    
    const db = readDB();
    const newMsg = {
        id: Date.now(),
        name,
        contact,
        message,
        date: new Date().toISOString()
    };
    db.messages = db.messages || [];
    db.messages.unshift(newMsg);
    writeDB(db);
    
    res.json({ success: true, message: 'Message sent successfully.' });
});

// Admin Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();

    if (email === db.admin.email && password === db.admin.password) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
        res.cookie('adminToken', token, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000 });
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true });
});

// Middleware
const requireAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') return res.status(401).json({ error: 'Unauthorized' });
        next();
    });
};

// Protected Routes
app.get('/api/admin/data', requireAdmin, (req, res) => {
    const db = readDB();
    res.json({
        stats: {
            visits: db.analytics ? db.analytics.length : 0,
            queries: db.messages ? db.messages.length : 0
        },
        analytics: db.analytics || [],
        admin: { email: db.admin.email },
        gallery: db.gallery || [],
        messages: db.messages || []
    });
});

app.post('/api/admin/gallery', requireAdmin, (req, res) => {
    const { url, alt } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
    
    const db = readDB();
    db.gallery = db.gallery || [];
    db.gallery.push({ id: Date.now(), url, alt: alt || '' });
    writeDB(db);
    res.json({ success: true });
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
    const db = readDB();
    db.gallery = db.gallery.filter(g => g.id !== parseInt(req.params.id));
    writeDB(db);
    res.json({ success: true });
});

app.post('/api/admin/credentials', requireAdmin, (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false });
    
    const db = readDB();
    db.admin.email = email;
    db.admin.password = password;
    writeDB(db);
    
    // Clear session so they have to re-login with new creds
    res.clearCookie('adminToken');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
