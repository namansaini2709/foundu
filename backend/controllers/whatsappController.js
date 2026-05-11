const db = require("../config/db");
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

    if (userRows[0].whatsapp_subscription === 1) {
      return res.status(400).json({ success: false, message: "You already have an active WhatsApp subscription." });
    }

    // 2. Validate coupon
    const [couponRows] = await db.promise().query(
      `SELECT * FROM coupon_codes 
       WHERE code = ? AND is_active = 1 AND benefit = 'whatsapp_free'
       AND (expires_at IS NULL OR expires_at >= CURDATE())
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
           whatsapp_subscription = 1,
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
    await db.promise().query("UPDATE coupon_codes SET is_active = 0 WHERE code = ?", [code]);
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
    // Fetch all eligible users
    const [eligibleUsers] = await db.promise().query(
      `SELECT u.id, u.full_name, u.whatsapp_number, u.user_type,
              COALESCE(fp.freelancer_type, cp.primary_identity) as category
       FROM users u
       LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
       LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
       WHERE u.whatsapp_subscription = 1
         AND u.is_profile_complete = 1
         AND u.whatsapp_number IS NOT NULL
         AND (u.whatsapp_expires_at IS NULL OR u.whatsapp_expires_at >= CURDATE())`
    );

    if (!eligibleUsers.length) {
      return res.json({ success: true, message: "No eligible users found.", sent: 0 });
    }

    // Fetch latest 5 jobs for the message
    const [latestJobs] = await db.promise().query(
      `SELECT job_title, domain, budget_range FROM foundu_jobs 
       ORDER BY created_at DESC LIMIT 5`
    );

    const jobList = latestJobs
      .map((j, i) => `${i + 1}. *${j.job_title}* (${j.domain}) — ${j.budget_range || "Negotiable"}`)
      .join("\n");

    const results = { sent: 0, failed: 0, skipped: 0 };

    for (const user of eligibleUsers) {
      try {
        const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
        const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

        const jobListFormatted = latestJobs
          .map((j, i) => `${i + 1}. *${j.job_title}* (${j.domain})\n   💼 Budget: ${j.budget_range || "Negotiable"}`)
          .join("\n\n");

        const message = `🚀 *FoundU Daily Job Alerts*\n\nHi ${user.full_name}! Here are today's top opportunities matched for you:\n\n${jobListFormatted}\n\n🔗 View all jobs: ${baseUrl}/jobs\n\n_Reply STOP to unsubscribe._`;

        // Send real WhatsApp message via Meta API
        await whatsappService.sendWhatsAppMatchAlert(
          user.whatsapp_number,
          user.full_name,
          [],
          message
        );

        // Notify on platform too
        await notificationService.sendNotification(
          user.id,
          "📱 WhatsApp Alert Sent!",
          "Your daily job recommendations have been sent to your WhatsApp number.",
          "broadcast",
          "/jobs"
        );

        results.sent++;
      } catch (err) {
        console.error(`[WHATSAPP ALERT ERROR] User ${user.id}:`, err);
        results.failed++;
      }
    }

    res.json({
      success: true,
      message: `WhatsApp alerts triggered for ${results.sent} users.`,
      results
    });
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
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_subscription = 1"
    );
    const [[eligible]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE whatsapp_subscription = 1 AND is_profile_complete = 1"
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

