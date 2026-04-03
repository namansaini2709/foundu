const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdminAuthenticated } = require("../middlewares/adminAuthMiddleware");

/* =========================
   ADMIN ROUTES
   JWT-based auth using cookies
========================= */
router.post("/admin/login",            adminController.adminLogin);
router.post("/admin/logout",           adminController.adminLogout);
router.get("/admin/dashboard/stats",  isAdminAuthenticated, adminController.getDashboardStats);

router.get("/admin/badges/pending",   isAdminAuthenticated, adminController.getPendingBlueTickRequests);
router.get("/admin/badges/all",       isAdminAuthenticated, adminController.getAllBlueTickRequests);
router.post("/admin/badges/approve",  isAdminAuthenticated, adminController.approveBlueTick);
router.post("/admin/badges/reject",   isAdminAuthenticated, adminController.rejectBlueTick);
router.post("/admin/broadcast",       isAdminAuthenticated, adminController.sendBulkNotification);

module.exports = router;

