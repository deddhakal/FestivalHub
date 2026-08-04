/**
 * authMiddleware.js
 * Protects admin-only routes.
 * Checks if the request has a valid admin session.
 */

function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorised. Please log in as admin.' });
}

module.exports = { requireAdmin };
