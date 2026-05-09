const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const { isAdminAuthenticated } = require("../middlewares/adminAuthMiddleware");

// Admin routes
router.post("/", isAdminAuthenticated, referralController.createReferralCode);
router.put("/:id", isAdminAuthenticated, referralController.toggleReferralCode);
router.get("/", isAdminAuthenticated, referralController.getAllReferrals);
router.get("/users/:code", isAdminAuthenticated, referralController.getReferralUsers);

module.exports = router;
