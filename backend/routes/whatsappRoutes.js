const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/whatsappController");
const { isAdminAuthenticated } = require("../middlewares/adminAuthMiddleware");

// User routes
router.get("/whatsapp/status/:userId",       ctrl.getStatus);
router.post("/whatsapp/apply-coupon",         ctrl.applyCoupon);

// Admin-only routes
router.post("/whatsapp/admin/create-coupon",  isAdminAuthenticated, ctrl.createCoupon);
router.get("/whatsapp/admin/coupons",         isAdminAuthenticated, ctrl.getAllCoupons);
router.post("/whatsapp/admin/deactivate-coupon", isAdminAuthenticated, ctrl.deactivateCoupon);
router.post("/whatsapp/admin/send-alerts",    isAdminAuthenticated, ctrl.sendWhatsAppAlerts);
router.get("/whatsapp/admin/stats",           isAdminAuthenticated, ctrl.getAdminStats);
router.get("/whatsapp/admin/coupon-users/:code", isAdminAuthenticated, ctrl.getCouponUsers);

module.exports = router;
