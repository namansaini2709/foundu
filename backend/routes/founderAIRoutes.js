const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/founderAIController");

router.post("/chat", chat);

module.exports = router;
