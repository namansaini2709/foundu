const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController");

router.post("/submit", queryController.submitQuery);
router.get("/list", queryController.getAllQueries); // Optional: Admin can list queries

module.exports = router;
