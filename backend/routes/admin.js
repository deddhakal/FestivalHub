const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// POST admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Store admin in session
    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;
    res.json({ message: 'Login successful', admin: { id: admin.id, username: admin.username, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET admin session check
router.get('/me', (req, res) => {
  if (req.session.adminId) {
    res.json({ authenticated: true, username: req.session.adminUsername });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// POST admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not logout' });
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
