const express = require("express");
const router = express.Router();
const { runMatchmaker } = require("../services/aiMatchmakerJob");

// @route   GET /api/ai/trigger-matchmaker
// @desc    Manually trigger the Gemini Job Matchmaker (For testing/admin)
// @access  Public (for now, during testing phase)
router.get("/trigger-matchmaker", async (req, res) => {
    try {
        console.log("Manual trigger hit for AI Matchmaker...");
        const result = await runMatchmaker();
        
        if (result.success) {
            res.json({
                message: "AI Matchmaker executed successfully!",
                emailsSent: result.messages_sent,
                data: result.raw_matches
            });
        } else {
            res.status(500).json({ error: "Matchmaker failed", details: result.error || result.message });
        }
    } catch (error) {
        console.error("Matchmaker route error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
