const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/auth");

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, firstname, fullname, lastname, username, status FROM tbl_users"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query failed" });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User not found
 */
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, firstname, fullname, lastname, username, status FROM tbl_users WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Query failed" });
  }
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - username
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               fullname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */
router.post("/", verifyToken, async (req, res) => {
  const { firstname, fullname, lastname, username, password, status } = req.body;

  if (!firstname || !username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO tbl_users 
       (firstname, fullname, lastname, username, password, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, fullname, lastname, username, hashedPassword, status || "user"]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               fullname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { firstname, fullname, lastname, password } = req.body;

  try {
    let sql = "UPDATE tbl_users SET firstname=?, fullname=?, lastname=?";
    const params = [firstname, fullname, lastname];

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      sql += ", password=?";
      params.push(hashed);
    }

    sql += " WHERE id=?";
    params.push(id);

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "DELETE FROM tbl_users WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
