const db = require("../config/db");
const crypto = require("crypto");
const notificationService = require("../services/notificationService");
const whatsappService = require("../services/whatsappService");

/* =============================================================
   1. GET SUBSCRIPTION STATUS
   GET /api/whatsapp/status/:userId
============================================================= */
exports.getStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT whatsapp_subscription, whatsapp_plan, whatsapp_activated_via, 
              whatsapp_expires_at, whatsapp_subscribed_at, whatsapp_number,
              is_profile_complete
       FROM users WHERE id = ?`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("[WHATSAPP STATUS ERROR]", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   2. APPLY COUPON CODE
   POST /api/whatsapp/apply-coupon
   Body: { user_id, coupon_code }
============================================================= */
exports.applyCoupon = async (req, res) => {
  const { user_id, coupon_code } = req.body;
  if (!user_id || !coupon_code) {
    return res.status(400).json({ success: false, message: "user_id and coupon_code are required" });
  }

  try {
    // 1. Check profile completion
    const [userRows] = await db.promise().query(
      "SELECT is_profile_complete, whatsapp_subscription FROM users WHERE id = ?",
      [user_id]
    );
    if (!userRows.length) return res.status(404).json({ success: false, message: "User not found" });

    if (!userRows[0].is_profile_complete || String(userRows[0].is_profile_complete) === "0") {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile first before activating WhatsApp alerts."
      });
    }

    if (userRows[0].whatsapp_subscription) {
      return res.status(400).json({ success: false, message: "You already have an active WhatsApp subscription." });
    }

    // 2. Validate coupon
    const [couponRows] = await db.promise().query(
      `SELECT * FROM coupon_codes 
       WHERE code = ? AND is_active = true AND benefit = 'whatsapp_free'
       AND (expires_at IS NULL OR expires_at >= CURRENT_DATE)
       AND used_count < max_uses`,
      [coupon_code.trim().toUpperCase()]
    );

    if (!couponRows.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid, expired, or fully used coupon code."
      });
    }

    const coupon = couponRows[0];

    // 3. Check user hasn't already used this coupon
    const [alreadyUsed] = await db.promise().query(
      "SELECT id FROM coupon_redemptions WHERE user_id = ? AND coupon_code = ?",
      [user_id, coupon.code]
    );
    if (alreadyUsed.length) {
      return res.status(400).json({ success: false, message: "You have already used this coupon code." });
    }

    // 4. Calculate expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (coupon.duration_days || 30));
    const expiresAt = expiryDate.toISOString().split("T")[0];

    // 5. Activate subscription atomically
    await db.promise().query("START TRANSACTION");
    try {
      await db.promise().query(
        `UPDATE users SET 
           whatsapp_subscription = true,
           whatsapp_plan = ?,
           whatsapp_activated_via = 'coupon',
           whatsapp_expires_at = ?,
           whatsapp_subscribed_at = NOW()
         WHERE id = ?`,
        [coupon.plan || "monthly", expiresAt, user_id]
      );
      await db.promise().query(
        "INSERT INTO coupon_redemptions (user_id, coupon_code) VALUES (?, ?)",
        [user_id, coupon.code]
      );
      await db.promise().query(
        "UPDATE coupon_codes SET used_count = used_count + 1 WHERE code = ?",
        [coupon.code]
      );
      await db.promise().query("COMMIT");
    } catch (txErr) {
      await db.promise().query("ROLLBACK");
      throw txErr;
    }

    // 6. Send notification
    notificationService.sendNotification(
      user_id,
      "🎉 WhatsApp Alerts Activated!",
      `Your WhatsApp subscription is now active via coupon ${coupon.code}. Daily job recommendations will be sent to your WhatsApp number.`,
      "payment",
      "/dashboard"
    ).catch(e => console.error("WA coupon notify error:", e));

    res.json({
      success: true,
      message: `🎉 Coupon applied! WhatsApp alerts activated until ${expiresAt}.`,
      expires_at: expiresAt,
      plan: coupon.plan
    });

  } catch (err) {
    console.error("[APPLY COUPON ERROR]", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   3. ADMIN: CREATE COUPON CODE
   POST /api/whatsapp/admin/create-coupon
   Body: { code, plan, duration_days, max_uses, expires_at }
============================================================= */
exports.createCoupon = async (req, res) => {
  const { code, plan = "monthly", duration_days = 30, max_uses = 100, expires_at } = req.body;
  if (!code) return res.status(400).json({ success: false, message: "code is required" });

  try {
    await db.promise().query(
      `INSERT INTO coupon_codes (code, benefit, plan, duration_days, max_uses, expires_at, is_active)
       VALUES (?, 'whatsapp_free', ?, ?, ?, ?, 1)`,
      [code.trim().toUpperCase(), plan, duration_days, max_uses, expires_at || null]
    );
    res.json({ success: true, message: `Coupon ${code.toUpperCase()} created successfully.` });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "Coupon code already exists." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   4. ADMIN: GET ALL COUPONS
   GET /api/whatsapp/admin/coupons
============================================================= */
exports.getAllCoupons = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM coupon_codes ORDER BY created_at DESC"
    );
    res.json({ success: true, coupons: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   5. ADMIN: DEACTIVATE COUPON
   POST /api/whatsapp/admin/deactivate-coupon
   Body: { code }
============================================================= */
exports.deactivateCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    await db.promise().query("UPDATE coupon_codes SET is_active = false WHERE code = ?", [code]);
    res.json({ success: true, message: `Coupon ${code} deactivated.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   6. ADMIN: TRIGGER WHATSAPP JOB ALERTS
   POST /api/whatsapp/admin/send-alerts
   Sends to: whatsapp_subscription=1 AND is_profile_complete=1
============================================================= */
exports.sendWhatsAppAlerts = async (req, res) => {
  try {
    const [eligibleUsers] = await db.promise().query(
      `SELECT u.id, u.full_name, u.whatsapp_number, u.user_type
       FROM users u
       WHERE u.whatsapp_subscription = true
         AND u.is_profile_complete = true
         AND u.whatsapp_number IS NOT NULL
         AND (u.whatsapp_expires_at IS NULL OR u.whatsapp_expires_at >= CURRENT_DATE)`
    );

    if (!eligibleUsers.length) {
      return res.json({ success: true, message: "No eligible users found.", sent: 0 });
    }

    const results = { sent: 0, failed: 0 };

    for (const user of eligibleUsers) {
      try {
        const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
        const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

        let categoryName = "jobs";
        let matchDataString = "";

        // Logic based on user type
        if (user.user_type === "startup") {
          // Founder receives Talent Profiles
          categoryName = "profiles";
          const [talents] = await db.promise().query(
            `SELECT full_name, user_type FROM users WHERE user_type != 'startup' ORDER BY created_at DESC LIMIT 3`
          );
          matchDataString = talents.map((t, i) => `*${i+1}. Talent:* ${t.full_name} (${t.user_type})\n💡 Top match for your open roles.`).join("\n\n");
        } else {
          // Freelancer/Co-founder receives Jobs
          categoryName = "jobs";
          const [jobs] = await db.promise().query(
            `SELECT job_title, startup_name FROM foundu_jobs ORDER BY created_at DESC LIMIT 3`
          );
          matchDataString = jobs.map((j, i) => `*${i+1}. Job:* ${j.job_title} @ ${j.startup_name || 'FoundU'}\n💡 Matches your skills and experience.`).join("\n\n");
        }

        // Send via Meta Template: foundu_match_alert
        const waResult = await whatsappService.sendWhatsAppTemplate(
          user.whatsapp_number,
          "foundu_match_alert", 
          [
            user.full_name.split(" ")[0], // {{1}} - Name
            categoryName,                 // {{2}} - "jobs" or "profiles"
            matchDataString               // {{3}} - The dynamic list
          ]
        );

        if (waResult.success) {
          results.sent++;
        } else {
          results.failed++;
        }
      } catch (err) {
        console.error(`[WA ALERT ERROR] User ${user.id}:`, err);
        results.failed++;
      }
    }

    res.json({ success: true, message: `Alerts sent to ${results.sent} users.`, results });
  } catch (err) {
    console.error("[SEND WA ALERTS ERROR]", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   7. ADMIN: GET WHATSAPP SUBSCRIBER STATS
   GET /api/whatsapp/admin/stats
============================================================= */
exports.getAdminStats = async (req, res) => {
  try {
    const [[total]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_subscription = true"
    );
    const [[eligible]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_subscription = true AND is_profile_complete = true"
    );
    const [[viaCoupon]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_activated_via = 'coupon'"
    );
    const [[viaPaid]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_activated_via = 'paid'"
    );
    const [coupons] = await db.promise().query(
      "SELECT code, max_uses, used_count, is_active, expires_at FROM coupon_codes ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      stats: {
        totalSubscribers: total.count,
        eligibleForAlerts: eligible.count,
        viaCoupon: viaCoupon.count,
        viaPaid: viaPaid.count,
        coupons
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   8. ADMIN: GET USERS WHO USED A COUPON
   GET /api/whatsapp/admin/coupon-users/:code
============================================================= */
exports.getCouponUsers = async (req, res) => {
  const { code } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT u.id, u.full_name, u.email, u.user_type, u.is_profile_complete,
              cr.redeemed_at
       FROM users u
       JOIN coupon_redemptions cr ON u.id = cr.user_id
       WHERE cr.coupon_code = ?
       ORDER BY cr.redeemed_at DESC`,
      [code]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* =============================================================
   9. WEBHOOK VERIFICATION (META CLOUD API)
   GET /api/whatsapp/webhook
============================================================= */
exports.verifyWebhook = (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN?.trim();
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (!verifyToken) {
    console.error("[WhatsApp Webhook] WHATSAPP_VERIFY_TOKEN is not configured.");
    return res.sendStatus(500);
  }

  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("✅ Meta Webhook verified successfully!");
      return res.status(200).send(challenge);
    } else {
      console.warn("❌ Webhook verification token mismatch.");
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
};

/* =============================================================
   10. HANDLE INCOMING MESSAGE
   POST /api/whatsapp/webhook
============================================================= */
exports.handleIncomingMessage = async (req, res) => {
  const appSecret = process.env.META_APP_SECRET;
  if (appSecret) {
    const signature = req.get("x-hub-signature-256");
    const expected = `sha256=${crypto
      .createHmac("sha256", appSecret)
      .update(req.rawBody || Buffer.alloc(0))
      .digest("hex")}`;

    if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      console.warn("[WhatsApp Webhook] Rejected invalid signature.");
      return res.sendStatus(401);
    }
  }

  // Respond immediately to prevent Meta from retrying
  res.sendStatus(200);

  const body = req.body;
  try {
    if (!body.object || !body.entry) return;

    const entries = body.entry;
    for (const entry of entries) {
      if (!entry.changes) continue;
      for (const change of entry.changes) {
        if (change.field !== "messages") continue;
        
        const value = change.value;
        if (!value.messages || !value.messages.length) continue;

        const messageObj = value.messages[0];
        const senderPhone = messageObj.from;
        const profileName = value.contacts?.[0]?.profile?.name || "Member";

        let messageText = "";
        if (messageObj.type === "text") {
          messageText = messageObj.text.body;
        } else if (messageObj.type === "button") {
          messageText = messageObj.button.text;
        } else if (messageObj.type === "interactive") {
          const interactiveType = messageObj.interactive.type;
          if (interactiveType === "button_reply") {
            messageText = messageObj.interactive.button_reply.title;
          } else if (interactiveType === "list_reply") {
            messageText = messageObj.interactive.list_reply.title;
          }
        } else if (messageObj.type === "document") {
          const doc = messageObj.document;
          const mime = (doc.mime_type || "").toLowerCase();
          const filename = (doc.filename || "").toLowerCase();
          const isValid = mime === "application/pdf" || mime === "image/jpeg" || mime === "image/jpg" || 
                          filename.endsWith(".pdf") || filename.endsWith(".jpg") || filename.endsWith(".jpeg");
          
          if (!isValid) {
            console.log(`[WhatsApp Webhook] Rejected unsupported document from ${senderPhone}: ${filename} (${mime})`);
            const whatsappService = require("../services/whatsappService");
            await whatsappService.sendWhatsAppDirectMessage(
              senderPhone,
              "❌ Unsupported file format! Please upload your Resume/CV only in PDF or JPG/JPEG format."
            );
            continue;
          }
          messageText = `[DOCUMENT_UPLOAD] id: ${doc.id} filename: ${doc.filename || "resume.pdf"}`;
        } else if (messageObj.type === "image") {
          const img = messageObj.image;
          console.log(`[WhatsApp Webhook] Received direct photo/image from ${senderPhone}. Mapping to JPG document.`);
          messageText = `[DOCUMENT_UPLOAD] id: ${img.id} filename: resume_photo.jpg`;
        }

        if (messageText.trim()) {
          console.log(`[WhatsApp Webhook] Received message from ${senderPhone} (${profileName}): "${messageText}"`);
          const onboardingService = require("../services/whatsappOnboardingService");
          await onboardingService.processMessage(senderPhone, profileName, messageText.trim());
        }
      }
    }
  } catch (err) {
    console.error("[WhatsApp Webhook Processing Error]:", err);
  }
};

