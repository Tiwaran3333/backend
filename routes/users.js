const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require('bcrypt'); //เพิ่ม bcrypt
const verifyToken = require('../middleware/auth'); //Verify Token

/**
 * @openapi
 * /api/users:
 *   get:
 *      tags: [Users]
 *      summary: Test DB connection
 *      responses:
 *        200:
 *          description: OK
*/
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname, fullname, lastname FROM tbl_users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

// GET user by id
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *      tags: [Users]
 *      summary: Test DB connection
 *      responses:
 *        200:
 *          description: OK
*/
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id, firstname, fullname, lastname FROM tbl_users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  }
});

//POST: เพิ่มผู้ใช้ใหม่ พร้อม hash password
/**
 * @openapi
 * /api/users:
 *   post:
 *      tags: [Users]
 *      summary: Test DB connection
 *      responses:
 *        200:
 *          description: OK
*/
router.post('/', async (req, res) => {

  const { firstname, fullname, lastname, username, password, status } = req.body;

  try {
    if (!password) return res.status(400).json({ error: 'Password is required' });

    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO tbl_users (firstname, fullname, lastname, username, password, status) VALUES (?, ?, ?, ?, ?, ?)',
      [firstname, fullname, lastname, username, hashedPassword, status]
    );

    res.status(200).json({ id: result.insertId, firstname, fullname, lastname, username, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// PUT: อัปเดตข้อมูลผู้ใช้ + เปลี่ยนรหัสผ่านถ้ามีส่งมา
/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *      tags: [Users]
 *      summary: Test DB connection
 *      responses:
 *        200:
 *          description: OK
*/
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, fullname, lastname, password } = req.body;

  try {
    let query = 'UPDATE tbl_users SET firstname = ?, fullname = ?, lastname = ?';
    const params = [firstname, fullname, lastname];

    // ถ้ามี password ใหม่ให้ hash แล้วอัปเดตด้วย
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE user
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *      tags: [Users]
 *      summary: Test DB connection
 *      responses:
 *        200:
 *          description: OK
*/
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM tbl_users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;