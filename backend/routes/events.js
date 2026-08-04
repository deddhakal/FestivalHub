const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/events
 * @desc    Get all events (public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { stage, date, category, search } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (stage) {
      query += ' AND stage = ?';
      params.push(stage);
    }
    if (date) {
      query += ' AND event_date = ?';
      params.push(date);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR stage LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY event_date ASC, start_time ASC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get a single event by ID (public)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/events
 * @desc    Create a new event (admin only)
 * @access  Admin
 */
router.post('/', requireAdmin, async (req, res) => {
  const { title, description, stage, event_date, start_time, end_time, category, image_url, tickets_available } = req.body;
  if (!title || !event_date || !start_time) {
    return res.status(400).json({ error: 'title, event_date, and start_time are required' });
  }
  try {
    const [result] = await db.query(
      `INSERT INTO events (title, description, stage, event_date, start_time, end_time, category, image_url, tickets_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, stage, event_date, start_time, end_time, category, image_url, tickets_available ?? 100]
    );
    res.status(201).json({ message: 'Event created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event (admin only)
 * @access  Admin
 */
router.put('/:id', requireAdmin, async (req, res) => {
  const { title, description, stage, event_date, start_time, end_time, category, image_url, tickets_available } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE events SET title=?, description=?, stage=?, event_date=?, start_time=?, end_time=?,
       category=?, image_url=?, tickets_available=? WHERE id=?`,
      [title, description, stage, event_date, start_time, end_time, category, image_url, tickets_available, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event (admin only)
 * @access  Admin
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
