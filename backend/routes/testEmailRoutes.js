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

// Test: New Message Notification (In-App + Email)
// Hit: http://localhost:4000/api/test-message-notif?userId=YOUR_USER_ID
router.get("/test-message-notif", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Pass ?userId=YOUR_USER_ID" });

  try {
    const notificationService = require("../services/notificationService");
    const emailNotificationService = require("../services/emailNotificationService");

    // In-App
    await notificationService.sendNotification(
      userId,
      "New Message 💬",
      `Test User sent you a message: "Hey, this is a test message!"`,
      "message",
      "/chatbox"
    );

    // Email
    await emailNotificationService.sendEmailNotification(
      userId,
      "You Have a New Message 💬",
      `Test User has sent you a message on FoundU:<br><br><em>"Hey, this is a test message!"</em><br><br>Log in to your chatbox to continue the conversation.`,
      "Open Chatbox",
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/chatbox`
    );

    res.json({ success: true, message: `Message notification sent to user ${userId}! Check in-app + email.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test: Trigger 5+ Unread Message Checker manually
// Hit: http://localhost:4000/api/test-unread-check
router.get("/test-unread-check", async (req, res) => {
  try {
    const { checkUnreadMessages } = require("../services/unreadMessageService");
    await checkUnreadMessages();
    res.json({ success: true, message: "Unread message checker ran! Check server logs for results." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
