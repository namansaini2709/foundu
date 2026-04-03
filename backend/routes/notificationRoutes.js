const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/notifications",           isAuthenticated, notificationController.getNotifications);
router.put("/notifications/:id/read",  isAuthenticated, notificationController.markAsRead);
router.delete("/notifications/:id",    isAuthenticated, notificationController.deleteNotification);

// Special route purely for Postman testing!
router.post("/notifications/test", notificationController.testNotification);

module.exports = router;

