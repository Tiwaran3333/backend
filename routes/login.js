const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ✅ ต้องมี

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const [rows] = await db.query(
      'SELECT id, username, password FROM tbl_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 🔐 สร้าง JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ ต้องส่ง token กลับ
    res.json({
      message: 'Login success',
      token: token
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({
      error: 'Login failed',
      detail: err.message
    });
  }
});

module.exports = router;
