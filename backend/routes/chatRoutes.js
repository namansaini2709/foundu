const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/my-chats", isAuthenticated, chatController.getMyChats);
router.get("/:chatId/messages", isAuthenticated, chatController.getMessages);
router.post("/message", isAuthenticated, chatController.sendMessage);
router.get("/total-unread", isAuthenticated, chatController.getTotalUnreadCount);
router.patch("/:chatId/seen", isAuthenticated, chatController.markAsSeen);
router.post("/create", isAuthenticated, chatController.createChat);

module.exports = router;
