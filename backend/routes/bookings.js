const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings with event details (admin only)
 * @access  Admin
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        b.id,
        b.booking_ref,
        b.visitor_name,
        b.visitor_email,
        b.ticket_type,
        b.quantity,
        b.created_at,
        e.title   AS event_title,
        e.event_date,
        e.stage
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   GET /api/bookings/:ref
 * @desc    Get a booking by booking reference (public — visitor receipt lookup)
 * @access  Public
 */
router.get('/:ref', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: 'Email is required for ticket lookup' });
  }

  try {
    const [rows] = await db.query(`
      SELECT b.*, e.title AS event_title, e.event_date, e.stage, e.start_time
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      WHERE b.booking_ref = ? AND b.visitor_email = ?
    `, [req.params.ref, email]);
    
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found or email does not match' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/bookings/public/:ref
 * @desc    Cancel a booking (public - requires email validation)
 * @access  Public
 */
router.delete('/public/:ref', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [bookings] = await db.query(`
      SELECT b.id, b.event_id, b.quantity, e.event_date 
      FROM bookings b 
      JOIN events e ON b.event_id = e.id 
      WHERE b.booking_ref = ? AND b.visitor_email = ?
    `, [req.params.ref, email]);
    
    if (bookings.length === 0) return res.status(404).json({ error: 'Ticket not found or email does not match' });

    const booking = bookings[0];

    // Cancellation Policy Check
    const eventDate = new Date(booking.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of today

    // If the event is today or in the past, block cancellation
    if (eventDate <= today) {
      return res.status(400).json({ error: 'Tickets can only be cancelled 24 hours before the event.' });
    }

    // Delete booking
    await db.query('DELETE FROM bookings WHERE id = ?', [booking.id]);

    // Restore tickets
    await db.query(
      'UPDATE events SET tickets_available = tickets_available + ? WHERE id = ?',
      [booking.quantity, booking.event_id]
    );

    res.json({ message: 'Ticket successfully cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (public — visitor ticket reservation)
 * @access  Public
 * @body    { event_id, visitor_name, visitor_email, ticket_type, quantity }
 */
router.post('/', async (req, res) => {
  const { event_id, visitor_name, visitor_email, ticket_type, quantity } = req.body;

  // Validation
  if (!event_id || !visitor_name || !visitor_email || !ticket_type || !quantity) {
    return res.status(400).json({ error: 'All fields are required: event_id, visitor_name, visitor_email, ticket_type, quantity' });
  }
  if (!['General', 'VIP'].includes(ticket_type)) {
    return res.status(400).json({ error: 'ticket_type must be "General" or "VIP"' });
  }
  if (quantity < 1 || quantity > 10) {
    return res.status(400).json({ error: 'quantity must be between 1 and 10' });
  }

  try {
    // Check event exists and has availability
    const [events] = await db.query('SELECT id, title, tickets_available FROM events WHERE id = ?', [event_id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (events[0].tickets_available < quantity) {
      return res.status(400).json({
        error: `Not enough tickets available. Only ${events[0].tickets_available} remaining.`
      });
    }

    // Insert booking
    const [result] = await db.query(
      'INSERT INTO bookings (event_id, visitor_name, visitor_email, ticket_type, quantity) VALUES (?, ?, ?, ?, ?)',
      [event_id, visitor_name, visitor_email, ticket_type, quantity]
    );

    // Generate booking reference and update record
    const bookingRef = `FH-${String(result.insertId).padStart(5, '0')}`;
    await db.query('UPDATE bookings SET booking_ref = ? WHERE id = ?', [bookingRef, result.insertId]);

    // Decrement available tickets
    await db.query(
      'UPDATE events SET tickets_available = tickets_available - ? WHERE id = ?',
      [quantity, event_id]
    );

    res.status(201).json({
      message: 'Booking confirmed!',
      booking_ref: bookingRef,
      event: events[0].title,
      ticket_type,
      quantity
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel/delete a booking (admin only)
 * @access  Admin
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    // Get booking quantity to restore tickets
    const [bookings] = await db.query('SELECT event_id, quantity FROM bookings WHERE id = ?', [req.params.id]);
    if (bookings.length === 0) return res.status(404).json({ error: 'Booking not found' });

    await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);

    // Restore ticket availability
    await db.query(
      'UPDATE events SET tickets_available = tickets_available + ? WHERE id = ?',
      [bookings[0].quantity, bookings[0].event_id]
    );

    res.json({ message: 'Booking cancelled and tickets restored' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
