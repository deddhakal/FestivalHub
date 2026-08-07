const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics and recent activity (admin only)
 * @access  Admin
 */
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [[{ total_events }]]        = await db.query('SELECT COUNT(*) AS total_events FROM events');
    const [[{ total_bookings }]]      = await db.query('SELECT COUNT(*) AS total_bookings FROM bookings');
    const [[{ total_vendors }]]       = await db.query('SELECT COUNT(*) AS total_vendors FROM vendors');
    const [[{ total_messages }]]      = await db.query('SELECT COUNT(*) AS total_messages FROM contact_messages');
    const [[{ total_announcements }]] = await db.query('SELECT COUNT(*) AS total_announcements FROM announcements');

    // Bookings summed by ticket type
    const [ticket_summary] = await db.query(`
      SELECT ticket_type, SUM(quantity) AS total_tickets
      FROM bookings GROUP BY ticket_type
    `);

    // Revenue calculation
    const [[revenue_data]] = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN b.ticket_type = 'General' THEN b.quantity * e.general_price ELSE 0 END), 0) AS general_revenue,
        COALESCE(SUM(CASE WHEN b.ticket_type = 'VIP' THEN b.quantity * e.vip_price ELSE 0 END), 0) AS vip_revenue
      FROM bookings b
      JOIN events e ON b.event_id = e.id
    `);

    const total_revenue = Number(revenue_data.general_revenue) + Number(revenue_data.vip_revenue);

    const revenue_sources = [
      { name: 'General Tickets', value: Number(revenue_data.general_revenue), color: '#FF6B6B' }, // brand-500 (coral)
      { name: 'VIP Tickets', value: Number(revenue_data.vip_revenue), color: '#FFB703' } // gold-500
    ].filter(s => s.value > 0);

    // Recent bookings (last 5)
    const [recent_bookings] = await db.query(`
      SELECT
        b.visitor_name,
        b.booking_ref,
        b.ticket_type,
        b.quantity,
        e.title AS event_title,
        b.created_at
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
      ORDER BY b.created_at DESC LIMIT 5
    `);

    // Upcoming events (next 5 from today)
    const [upcoming_events] = await db.query(`
      SELECT id, title, stage, event_date, start_time, tickets_available
      FROM events
      WHERE event_date >= CURDATE()
      ORDER BY event_date ASC, start_time ASC LIMIT 5
    `);

    res.json({
      total_events,
      total_bookings,
      total_vendors,
      total_messages,
      total_announcements,
      ticket_summary,
      recent_bookings,
      upcoming_events,
      revenue: {
        total: total_revenue,
        sources: revenue_sources
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
