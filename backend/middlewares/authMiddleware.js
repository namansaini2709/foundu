const { verifyJWT } = require("../utils/jwtUtils");

/**
 * DUAL-MODE AUTH MIDDLEWARE
 * 1. First checks for JWT in Authorization header (Bearer token)
 * 2. Falls back to express-session (req.session.user) for backward compatibility
 * 3. Sets req.user for all downstream controllers
 */
exports.isAuthenticated = (req, res, next) => {
  // ── METHOD 1: JWT Token ──
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (decoded) {
      req.user = decoded; // { id, email, user_type, full_name }
      return next();
    }
    // If token exists but is invalid/expired, reject immediately
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // ── METHOD 2: Session Cookie (backward compatibility) ──
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};

// Alias for convenience (Phase 1.5 cleanup)
exports.verifyJWT = exports.isAuthenticated;
