const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/enrich-job", aiController.enrichJob);
router.post("/chat-suggestions", aiController.chatSuggestions);
router.post("/invite", aiController.sendInvite);
router.post("/analyze-idea", aiController.analyzeIdea);
router.get("/test", async (req, res) => {
  const key = process.env.GEMINI_API_KEY || "";
  try {
    const geminiService = require("../services/geminiService");
    const testResult = await geminiService.enrichJobDetails("freelancer", { role: "Web Developer" });
    
    res.json({ 
      message: "AI Routes working", 
      keyPreview: key ? `${key.substring(0, 4)}... (length: ${key.length})` : "NOT FOUND",
      geminiTest: "SUCCESS",
      testData: testResult,
      sdkVersion: require("@google/generative-ai/package.json").version
    });
  } catch (err) {
    res.json({ 
      message: "AI Routes working, but GEMINI FAILED", 
      keyPreview: key ? `${key.substring(0, 4)}... (length: ${key.length})` : "NOT FOUND",
      geminiTest: "FAILED",
      error: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;
