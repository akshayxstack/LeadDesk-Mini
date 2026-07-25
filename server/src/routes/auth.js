const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const admin = await AdminUser.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      expiresIn: 3600
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await AdminUser.findOne({ username: trimmedUsername });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = new AdminUser({
      username: trimmedUsername,
      passwordHash,
      createdAt: new Date()
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    return res.status(201).json({
      token,
      expiresIn: 3600
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.status(200).json({
    username: req.user.username
  });
});

module.exports = router;
