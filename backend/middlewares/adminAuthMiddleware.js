/* =========================
   ADMIN AUTH MIDDLEWARE
   Session-based — same pattern as authMiddleware.js
   Checks req.session.admin instead of req.session.user
========================= */
exports.isAdminAuthenticated = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }
  next();
};
