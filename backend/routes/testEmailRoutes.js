const express = require("express");
const router = express.Router();
const mailService = require("../services/mailService");

// Diagnostic route to test SMTP configuration
router.get("/test-email", async (req, res) => {
  const testEmail = process.env.MAIL_EMAIL;
  
  if (!testEmail) {
    return res.status(500).json({ 
      success: false, 
      error: "MAIL_EMAIL environment variable is not set." 
    });
  }

  try {
    console.log(`[DIAGNOSTIC] Attempting to send test email to: ${testEmail}`);
    
    await mailService.sendEmail(
      testEmail,
      "Test Email | FoundU Diagnostic",
      "If you are reading this, your FoundU SMTP configuration is working perfectly on Railway! 🚀",
      "<h1>Success! 🚀</h1><p>Your FoundU SMTP configuration is working perfectly on Railway.</p>"
    );

    res.json({ 
      success: true, 
      message: `Test email sent successfully to ${testEmail}. Please check your inbox and the Railway logs.` 
    });
  } catch (error) {
    console.error("[DIAGNOSTIC ERROR] Test email failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send test email. Check Railway logs for detailed SMTP error codes.",
      details: error.message
    });
  }
});

module.exports = router;
