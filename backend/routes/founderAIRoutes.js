const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/founderAIController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/chat", isAuthenticated, chat);

module.exports = router;
