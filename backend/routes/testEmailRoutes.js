const express = require("express");
const router = express.Router();
const mailService = require("../services/mailService");

// Diagnostic route to test email configuration
router.get("/test-email", async (req, res) => {
  const testEmail = process.env.MAIL_EMAIL;
  
  if (!testEmail) {
    return res.status(500).json({ 
      success: false, 
      error: "MAIL_EMAIL environment variable is not set." 
    });
  }

  try {
    console.log(`[MAIL TEST] Attempting to send test email to: ${testEmail}`);
    
    await mailService.sendEmail(
      testEmail,
      "Live Email Success! | FoundU",
      "If you are reading this, your FoundU email system is FINALLY working on Railway via the Resend API! 🚀",
      "<h1>Success! 🚀</h1><p>Your FoundU email system is finally working on Railway via the Resend API.</p>"
    );

    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${testEmail}! Please check your inbox.` 
    });
  } catch (error) {
    console.error("[MAIL TEST ERROR] Failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send test email.",
      details: error.message
    });
  }
});

module.exports = router;
