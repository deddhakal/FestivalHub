const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements, newest first (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/announcements/:id
 * @desc    Get a single announcement (public)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/announcements
 * @desc    Create a new announcement (admin only)
 * @access  Admin
 * @body    { title, content, type }  — type: info|warning|alert|success
 */
router.post('/', requireAdmin, async (req, res) => {
  const { title, content, type } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const validTypes = ['info', 'warning', 'alert', 'success'];
  const announcementType = validTypes.includes(type) ? type : 'info';

  try {
    const [result] = await db.query(
      'INSERT INTO announcements (title, content, type) VALUES (?, ?, ?)',
      [title, content, announcementType]
    );
    res.status(201).json({ message: 'Announcement created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/announcements/:id
 * @desc    Update an announcement (admin only)
 * @access  Admin
 */
router.put('/:id', requireAdmin, async (req, res) => {
  const { title, content, type } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE announcements SET title=?, content=?, type=? WHERE id=?',
      [title, content, type, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ message: 'Announcement updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Delete an announcement (admin only)
 * @access  Admin
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
