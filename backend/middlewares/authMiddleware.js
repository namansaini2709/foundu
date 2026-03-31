const { verifyJWT } = require("../utils/jwtUtils");

/**
 * TRIPLE-MODE AUTH MIDDLEWARE
 * 1. First checks for JWT in Authorization header (Bearer token)
 * 2. Then checks for JWT in httpOnly cookie
 * 3. Falls back to express-session (req.session.user) for backward compatibility
 * Sets req.user for all downstream controllers
 */
exports.isAuthenticated = (req, res, next) => {
  // ── METHOD 1: JWT from Authorization Header ──
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (decoded) {
      req.user = decoded;
      return next();
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // ── METHOD 2: JWT from httpOnly Cookie ──
  const cookieToken = req.cookies && req.cookies.jwt;
  if (cookieToken) {
    const decoded = verifyJWT(cookieToken);
    if (decoded) {
      req.user = decoded;
      return next();
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // ── METHOD 3: Session Cookie (backward compatibility) ──
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
};

// Alias for convenience
exports.verifyJWT = exports.isAuthenticated;
