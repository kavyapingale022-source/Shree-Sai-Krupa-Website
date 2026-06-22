const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const { Redis } = require('@upstash/redis');

const app = express();
const PORT = 8081;
const DB_FILE = path.join(__dirname, 'database.json');

const JWT_SECRET = 'amitdivekar_super_secret_key_2026';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

// DB Helpers - Hybrid Strategy (Upstash Redis or Local JSON)
const useKV = !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);

let kv;
if (useKV) {
    // Connect using either legacy KV vars or new Upstash vars
    kv = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    });
}

const readDB = async () => {
    const defaultServices = [
        { id: 1, title: 'Hair Cutting', description: 'Expert precision fade or classic scissor cut.', price: '₹120 / ₹150', icon: 'content_cut' },
        { id: 2, title: 'Beard Trimming', description: 'Precision line-up and contouring.', price: '₹70', icon: 'face' },
        { id: 3, title: 'Shaving', description: 'Classic clean shave experience.', price: '₹80', icon: 'cut' },
        { id: 4, title: 'Face Massage/Scrub', description: 'Relaxing massage and exfoliating scrub.', price: '₹250', icon: 'spa' },
        { id: 5, title: 'Facial', description: 'Complete facial treatment for skin rejuvenation.', price: '₹500', icon: 'auto_fix_high' },
        { id: 6, title: 'Cream Colour', description: 'Professional hair coloring.', price: '₹250', icon: 'palette' }
    ];

    if (useKV) {
        let admin = await kv.get('admin');
        if (!admin) {
            admin = { email: 'amitdivekar02@gmail.com', password: 'AmitDivekar_Saloon_Admin@2000' };
            await kv.set('admin', admin);
        }
        let services = await kv.get('services');
        if (!services) {
            services = defaultServices;
            await kv.set('services', services);
        }
        const gallery = await kv.get('gallery') || [];
        const messages = await kv.get('messages') || [];
        const analytics = await kv.get('analytics') || [];
        return { admin, gallery, messages, analytics, services };
    } else {
        if (!fs.existsSync(DB_FILE)) {
             const defaultDb = { 
                 admin: { email: 'amitdivekar02@gmail.com', password: 'AmitDivekar_Saloon_Admin@2000' }, 
                 gallery: [], 
                 messages: [], 
                 analytics: [],
                 services: defaultServices
             };
             fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
        }
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (!db.services) {
            db.services = defaultServices;
            fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        }
        return db;
    }
};

const writeDB = async (data) => {
    if (useKV) {
        await kv.set('admin', data.admin);
        await kv.set('gallery', data.gallery);
        await kv.set('messages', data.messages);
        await kv.set('analytics', data.analytics);
        await kv.set('services', data.services);
    } else {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
};

// Public Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.gallery || []);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.services || []);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/track', async (req, res) => {
    try {
        const db = await readDB();
        db.analytics = db.analytics || [];
        db.analytics.push(new Date().toISOString());
        await writeDB(db);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, contact, message } = req.body;
        if (!name || !contact || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required.' });
        }
        
        const db = await readDB();
        const newMsg = {
            id: Date.now(),
            name,
            contact,
            message,
            date: new Date().toISOString()
        };
        db.messages = db.messages || [];
        db.messages.unshift(newMsg);
        await writeDB(db);
        
        res.json({ success: true, message: 'Message sent successfully.' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await readDB();

        if (email === db.admin.email && password === db.admin.password) {
            const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
            res.cookie('adminToken', token, { httpOnly: true, maxAge: 12 * 60 * 60 * 1000 });
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
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
app.get('/api/admin/data', requireAdmin, async (req, res) => {
    try {
        const db = await readDB();
        res.json({
            stats: {
                visits: db.analytics ? db.analytics.length : 0,
                queries: db.messages ? db.messages.length : 0
            },
            analytics: db.analytics || [],
            admin: { email: db.admin.email },
            gallery: db.gallery || [],
            messages: db.messages || [],
            services: db.services || []
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/gallery', requireAdmin, async (req, res) => {
    try {
        const { url, alt } = req.body;
        if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
        
        const db = await readDB();
        db.gallery = db.gallery || [];
        db.gallery.push({ id: Date.now(), url, alt: alt || '' });
        await writeDB(db);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
    try {
        const db = await readDB();
        db.gallery = db.gallery.filter(g => g.id !== parseInt(req.params.id));
        await writeDB(db);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/services', requireAdmin, async (req, res) => {
    try {
        const { id, title, description, price, icon } = req.body;
        if (!title || !description || !price || !icon) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        
        const db = await readDB();
        db.services = db.services || [];
        
        if (id) {
            // Update existing service
            const index = db.services.findIndex(s => s.id === parseInt(id));
            if (index !== -1) {
                db.services[index] = { id: parseInt(id), title, description, price, icon };
            }
        } else {
            // Add new service
            db.services.push({ id: Date.now(), title, description, price, icon });
        }
        
        await writeDB(db);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
    try {
        const db = await readDB();
        if (db.services) {
            db.services = db.services.filter(s => s.id !== parseInt(req.params.id));
            await writeDB(db);
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/credentials', requireAdmin, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false });
        
        const db = await readDB();
        db.admin.email = email;
        db.admin.password = password;
        await writeDB(db);
        
        // Clear session so they have to re-login with new creds
        res.clearCookie('adminToken');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

module.exports = app;
