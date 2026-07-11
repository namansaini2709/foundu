const express = require("express");
const router = express.Router();
const aiChatController = require("../controllers/aiChatController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// All routes are scoped under /api/ai
router.post("/chat", isAuthenticated, aiChatController.chatStream);
router.get("/chat/history", isAuthenticated, aiChatController.getHistory);
router.post("/chat/reset", isAuthenticated, aiChatController.resetChat);

module.exports = router;
