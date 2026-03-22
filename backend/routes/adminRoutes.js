const router = require("express").Router();
const adminController = require("../controllers/adminController");

/* =========================
   ADMIN ROUTES
   Auth handled on frontend via localStorage (is_admin flag).
   No backend session middleware needed for this simple setup.
========================= */
router.get("/admin/dashboard/stats",  adminController.getDashboardStats);
router.get("/admin/badges/pending",   adminController.getPendingBlueTickRequests);
router.get("/admin/badges/all",       adminController.getAllBlueTickRequests);
router.post("/admin/badges/approve",  adminController.approveBlueTick);
router.post("/admin/badges/reject",   adminController.rejectBlueTick);
router.post("/admin/broadcast",       adminController.sendBulkNotification);

module.exports = router;
