const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.get("/notifications", notificationController.getNotifications);
router.put("/notifications/:id/read", notificationController.markAsRead);
router.delete("/notifications/:id", notificationController.deleteNotification);

// Special route purely for Postman testing!
router.post("/notifications/test", notificationController.testNotification);

module.exports = router;
