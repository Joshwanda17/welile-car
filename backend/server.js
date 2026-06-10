const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// helper
const runAsync = (sql, params) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const getAsync = (sql, params) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const allAsync = (sql, params) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

// Auth API
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, residence, referralCode } = req.body;
  const userId = uuidv4();
  const id = `prof_${userId}`;
  try {
    await runAsync(
      `INSERT INTO profiles (id, user_id, email, name, phone, residence, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, email, name, phone, residence || null, referralCode || '']
    );
    await runAsync(
      `INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)`,
      [uuidv4(), userId, 'user']
    );
    const profile = await getAsync(`SELECT * FROM profiles WHERE user_id = ?`, [userId]);
    res.json({ user: profile, role: 'user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let profile = await getAsync(`SELECT * FROM profiles WHERE email = ?`, [email]);
    if (!profile) {
      // Mock for admin/cfo if they don't exist yet
      if (email === 'admin@admin.com') {
        const userId = uuidv4();
        await runAsync(`INSERT INTO profiles (id, user_id, email, name, phone, referral_code) VALUES (?, ?, ?, ?, ?, ?)`,
          [`prof_${userId}`, userId, email, 'Admin User', '000', 'ADMIN']);
        await runAsync(`INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)`, [uuidv4(), userId, 'admin']);
        profile = await getAsync(`SELECT * FROM profiles WHERE email = ?`, [email]);
      } else if (email === 'cfo@admin.com') {
        const userId = uuidv4();
        await runAsync(`INSERT INTO profiles (id, user_id, email, name, phone, referral_code) VALUES (?, ?, ?, ?, ?, ?)`,
          [`prof_${userId}`, userId, email, 'CFO User', '000', 'CFO']);
        await runAsync(`INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?)`, [uuidv4(), userId, 'admin']);
        profile = await getAsync(`SELECT * FROM profiles WHERE email = ?`, [email]);
      } else {
        return res.status(401).json({ error: 'User not found' });
      }
    }
    const roleRow = await getAsync(`SELECT role FROM user_roles WHERE user_id = ?`, [profile.user_id]);
    res.json({ user: profile, role: roleRow?.role || 'user' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profile API
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const profile = await getAsync(`SELECT * FROM profiles WHERE user_id = ?`, [req.params.userId]);
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile/:userId', async (req, res) => {
  try {
    const updates = req.body;
    // Basic protection against empty updates
    if (Object.keys(updates).length === 0) {
      const profile = await getAsync(`SELECT * FROM profiles WHERE user_id = ?`, [req.params.userId]);
      return res.json(profile);
    }
    
    // Prevent updating id or user_id
    delete updates.id;
    delete updates.user_id;

    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    
    await runAsync(`UPDATE profiles SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [...values, req.params.userId]);
    const profile = await getAsync(`SELECT * FROM profiles WHERE user_id = ?`, [req.params.userId]);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions API
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const txs = await allAsync(`SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`, [req.params.userId]);
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions/:userId', async (req, res) => {
  try {
    const { type, amount, method } = req.body;
    const tx = { id: uuidv4(), user_id: req.params.userId, type, amount, method };
    await runAsync(`INSERT INTO transactions (id, user_id, type, amount, method) VALUES (?, ?, ?, ?, ?)`, 
      [tx.id, tx.user_id, tx.type, tx.amount, tx.method]);
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile/:userId/deposit', async (req, res) => {
  try {
    const { amount, method } = req.body;
    const userId = req.params.userId;
    
    const tx = { id: uuidv4(), user_id: userId, type: 'deposit', amount, method };
    await runAsync(`INSERT INTO transactions (id, user_id, type, amount, method) VALUES (?, ?, ?, ?, ?)`, 
      [tx.id, tx.user_id, tx.type, tx.amount, tx.method]);
      
    await runAsync(`
      UPDATE profiles 
      SET wallet_balance = wallet_balance + ?, 
          total_deposits = total_deposits + ?, 
          deposits_this_month = deposits_this_month + 1, 
          last_deposit_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`, [amount, amount, userId]);
      
    res.json({ success: true, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile/:userId/growth', async (req, res) => {
  try {
    const userId = req.params.userId;
    const profile = await getAsync(`SELECT * FROM profiles WHERE user_id = ?`, [userId]);
    
    if (!profile || profile.wallet_balance === 0 || profile.savings_locked) {
      return res.json({ success: false, message: 'Ineligible for growth' });
    }

    const baseRate = 0.02;
    const bonusRate = (!profile.has_withdrawn_this_month && profile.deposits_this_month >= 4) ? 0.03 : 0;
    const rate = baseRate + bonusRate;
    const growth = Math.round(profile.wallet_balance * rate);

    const tx = { id: uuidv4(), user_id: userId, type: 'growth', amount: growth, method: 'system' };
    await runAsync(`INSERT INTO transactions (id, user_id, type, amount, method) VALUES (?, ?, ?, ?, ?)`, 
      [tx.id, tx.user_id, tx.type, tx.amount, tx.method]);

    await runAsync(`
      UPDATE profiles 
      SET wallet_balance = wallet_balance + ?, 
          growth_earned = growth_earned + ?, 
          last_growth_date = CURRENT_TIMESTAMP,
          deposits_this_month = 0,
          has_withdrawn_this_month = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`, [growth, growth, userId]);

    res.json({ success: true, growth, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile/:userId/financing', async (req, res) => {
  try {
    const userId = req.params.userId;
    await runAsync(`
      UPDATE profiles 
      SET financing_unlocked = 1, 
          financing_status = 'pending',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?`, [userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin API
app.get('/api/admin/profiles', async (req, res) => {
  try {
    const profiles = await allAsync(`SELECT * FROM profiles`);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/cfo_requests', async (req, res) => {
  try {
    const reqs = await allAsync(`SELECT * FROM cfo_requests ORDER BY requested_at DESC`);
    res.json(reqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/cfo_requests', async (req, res) => {
  try {
    const { userId, userName, userPhone, type, details } = req.body;
    
    const existing = await getAsync(`SELECT * FROM cfo_requests WHERE user_id = ? AND type = ? AND status = 'pending'`, [userId, type]);
    if (existing) {
      return res.status(400).json({ error: 'A request of this type is already pending CFO review.' });
    }

    const reqId = uuidv4();
    await runAsync(`INSERT INTO cfo_requests (id, user_id, user_name, user_phone, type, details) VALUES (?, ?, ?, ?, ?, ?)`,
      [reqId, userId, userName, userPhone, type, details]);
      
    if (type === 'financing_approval') {
      await runAsync(`UPDATE profiles SET financing_status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [userId]);
    }
      
    res.json({ id: reqId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/cfo_requests/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const reqId = req.params.id;
    
    const request = await getAsync(`SELECT * FROM cfo_requests WHERE id = ?`, [reqId]);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    await runAsync(`UPDATE cfo_requests SET status = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, reqId]);
    
    if (request.type === 'financing_approval') {
      if (status === 'approved') {
        await runAsync(`UPDATE profiles SET financing_status = 'approved', savings_locked = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [request.user_id]);
      } else if (status === 'rejected') {
        await runAsync(`UPDATE profiles SET financing_status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [request.user_id]);
      }
    } else if (request.type === 'unflag_request') {
      if (status === 'approved') {
        await runAsync(`UPDATE profiles SET flagged = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`, [request.user_id]);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
