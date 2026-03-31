const { verifyJWT } = require("../utils/jwtUtils");

/* =========================
   ADMIN AUTH MIDDLEWARE
   Dual-mode: JWT + Session
   Checks for admin JWT or req.session.admin
========================= */
exports.isAdminAuthenticated = (req, res, next) => {
  // ── METHOD 1: JWT Token ──
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (decoded && decoded.isAdmin) {
      req.admin = decoded;
      return next();
    }
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }

  // ── METHOD 2: Session Cookie (backward compatibility) ──
  if (req.session && req.session.admin) {
    req.admin = req.session.admin;
    return next();
  }

  return res.status(401).json({ message: "Admin not authenticated" });
};
