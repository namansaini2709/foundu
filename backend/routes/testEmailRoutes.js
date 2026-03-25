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
    const dns = require("dns").promises;
    console.log("[DIAGNOSTIC] Checking DNS resolution for smtp.gmail.com...");
    const lookup = await dns.lookup("smtp.gmail.com");
    console.log(`[DIAGNOSTIC] DNS Resolved: ${lookup.address}`);

    const ports = [465, 587, 2525];
    const results = [];

    for (const port of ports) {
      console.log(`[DIAGNOSTIC] Testing connection to ${lookup.address}:${port}...`);
      try {
        const net = require("net");
        const socket = new net.Socket();
        
        const connect = new Promise((resolve, reject) => {
          socket.setTimeout(5000);
          socket.connect(port, "smtp.gmail.com", () => {
            socket.destroy();
            resolve(true);
          });
          socket.on("timeout", () => {
            socket.destroy();
            reject(new Error("Timeout"));
          });
          socket.on("error", (err) => {
            socket.destroy();
            reject(err);
          });
        });

        const isOk = await connect;
        results.push({ port, status: "OPEN" });
      } catch (err) {
        results.push({ port, status: "CLOSED/TIMEOUT", error: err.message });
      }
    }

    res.json({
      success: false,
      message: "Diagnostic complete. Check results to see which ports are blocked.",
      dns: lookup.address,
      portResults: results
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
