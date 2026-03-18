const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/enrich-job", aiController.enrichJob);

module.exports = router;
