const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/vendors
 * @desc    Get all vendors, optionally filtered by category (public)
 * @access  Public
 * @query   ?category=Food|Drinks|Merchandise|Attraction
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM vendors WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category ASC, name ASC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/vendors/:id
 * @desc    Get a single vendor (public)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/vendors
 * @desc    Create a new vendor (admin only)
 * @access  Admin
 */
router.post('/', requireAdmin, async (req, res) => {
  const { name, description, category, location, image_url, is_active } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'name and category are required' });
  }
  const validCategories = ['Food', 'Drinks', 'Merchandise', 'Attraction'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${validCategories.join(', ')}` });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO vendors (name, description, category, location, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, category, location, image_url, is_active !== undefined ? is_active : 1]
    );
    res.status(201).json({ message: 'Vendor created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/vendors/:id
 * @desc    Update a vendor (admin only)
 * @access  Admin
 */
router.put('/:id', requireAdmin, async (req, res) => {
  const { name, description, category, location, image_url, is_active } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE vendors SET name=?, description=?, category=?, location=?, image_url=?, is_active=? WHERE id=?',
      [name, description, category, location, image_url, is_active, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/vendors/:id
 * @desc    Delete a vendor (admin only)
 * @access  Admin
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM vendors WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
