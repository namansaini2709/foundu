const bcrypt = require("bcrypt");
const db = require("../config/db");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");

/* =========================
   ADMIN LOGIN
   Same pattern as userController.login
========================= */
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await db.promise().query(
      "SELECT * FROM admin_users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Store admin in session (same pattern as req.session.user)
    req.session.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Admin session save error:", err);
        return res.status(500).json({ message: "Session error" });
      }

      res.json({
        success: true,
        message: "Admin logged in successfully",
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   ADMIN LOGOUT
========================= */
exports.adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Admin logged out" });
  });
};

/* =========================
   CHECK SESSION (for frontend to verify on refresh)
========================= */
exports.getAdminSession = (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ success: true, admin: req.session.admin });
};

/* =========================
   DASHBOARD STATS
========================= */
exports.getDashboardStats = async (req, res) => {
  try {
    const [[pendingBlueTick]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE blue_tick_status = 'pending'"
    );
    const [[totalUsers]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users"
    );
    const [[approvedBlueTick]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM users WHERE blue_tick_status = 'approved'"
    );
    const [[totalJobs]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM foundu_jobs"
    );
    const [[totalTestimonials]] = await db.promise().query(
      "SELECT COUNT(*) as count FROM homepage_testimonials"
    );

    res.json({
      success: true,
      stats: {
        pendingBlueTickRequests: pendingBlueTick.count,
        totalUsers: totalUsers.count,
        approvedBlueTick: approvedBlueTick.count,
        totalJobs: totalJobs.count,
        totalTestimonials: totalTestimonials.count,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET PENDING BLUE TICK REQUESTS
   Joins users + users_socials to show submitted links
========================= */
exports.getPendingBlueTickRequests = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        u.id          AS user_id,
        u.full_name,
        u.email,
        u.user_type,
        u.blue_tick_status,
        u.blue_tick_verified,
        u.created_at  AS registered_on,
        us.linkedin_url,
        us.github_url,
        us.portfolio_url,
        us.profile_picture_url,
        us.company_linkedin_url,
        us.company_registration_number,
        us.past_work_proof
      FROM users u
      LEFT JOIN users_socials us ON us.user_id = u.id
      WHERE u.blue_tick_status = 'pending'
      ORDER BY u.created_at DESC`
    );

    res.json({ success: true, requests: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   GET ALL BLUE TICK REQUESTS (all statuses for admin view)
========================= */
exports.getAllBlueTickRequests = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: pending / approved / rejected

    let whereClause = "WHERE u.blue_tick_status IS NOT NULL";
    const params = [];

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      whereClause = "WHERE u.blue_tick_status = ?";
      params.push(status);
    }

    const [rows] = await db.promise().query(
      `SELECT 
        u.id          AS user_id,
        u.full_name,
        u.email,
        u.user_type,
        u.blue_tick_status,
        u.blue_tick_verified,
        u.created_at  AS registered_on,
        us.linkedin_url,
        us.github_url,
        us.portfolio_url,
        us.profile_picture_url,
        us.company_linkedin_url,
        us.company_registration_number,
        us.past_work_proof
      FROM users u
      LEFT JOIN users_socials us ON us.user_id = u.id
      ${whereClause}
      ORDER BY u.created_at DESC`,
      params
    );

    res.json({ success: true, requests: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   APPROVE BLUE TICK
========================= */
exports.approveBlueTick = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "user_id required" });

  try {
    await db.promise().query(
      `UPDATE users 
       SET blue_tick_verified = 1, blue_tick_status = 'approved'
       WHERE id = ?`,
      [user_id]
    );
    res.json({ success: true, message: "Blue Tick approved ✅" });

    // Notify user
    notificationService.sendNotification(
      user_id,
      "Blue Tick Approved! 🌟",
      "Congratulations! Your profile has officially been verified with a Blue Tick.",
      "badge",
      "/dashboard"
    );

    // 🔥 Email Notification
    emailNotificationService.sendEmailNotification(
      user_id,
      "Blue Tick Approved! 🌟",
      "Congratulations! Your social verification request has been approved. You now have a Blue Tick badge on your profile, signaling high credibility to other users.",
      "View Your Profile",
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   REJECT BLUE TICK
========================= */
exports.rejectBlueTick = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "user_id required" });

  try {
    await db.promise().query(
      `UPDATE users 
       SET blue_tick_status = 'rejected', blue_tick_verified = 0
       WHERE id = ?`,
      [user_id]
    );
    res.json({ success: true, message: "Blue Tick rejected ❌" });

    // Notify user
    notificationService.sendNotification(
      user_id,
      "Blue Tick Request Update",
      "Unfortunately, your Blue Tick application could not be verified at this time.",
      "badge",
      "/dashboard"
    );

    // 🔥 Email Notification
    emailNotificationService.sendEmailNotification(
      user_id,
      "Blue Tick Request Update 🛡️",
      "We've reviewed your request for social verification. Unfortunately, we couldn't verify your account at this time. Please ensure your links are correct and try again later.",
      "Update Profile Socials",
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile`
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   SEND BULK NOTIFICATION (BROADCAST)
========================= */
exports.sendBulkNotification = async (req, res) => {
  const { targetType, title, message } = req.body;

  if (!targetType || !title || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1️⃣ Fetch users based on category
    let query = "SELECT id, full_name, email FROM users";
    let params = [];

    if (targetType !== "all") {
      query += " WHERE user_type = ?";
      params.push(targetType);
    }

    const [recipients] = await db.promise().query(query, params);

    if (!recipients.length) {
      return res.status(404).json({ message: `No users found for category: ${targetType}` });
    }

    // 2️⃣ Send notifications & emails in a loop
    const results = {
      total: recipients.length,
      success: 0,
      failed: 0,
    };

    const actionText = "View Dashboard";
    const actionLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`;

    for (const user of recipients) {
      try {
        // Platform Notification
        await notificationService.sendNotification(
          user.id,
          title,
          message,
          "broadcast",
          "/dashboard"
        );

        // Email Notification
        await emailNotificationService.sendEmailNotification(
          user.id,
          title,
          message,
          actionText,
          actionLink
        );

        results.success++;
      } catch (err) {
        console.error(`Failed to notify user ${user.id}:`, err);
        results.failed++;
      }
    }

    res.json({
      success: true,
      message: `Broadcast sent to ${results.success} users successfully.`,
      results,
    });
  } catch (error) {
    console.error("Bulk notification error:", error);
    res.status(500).json({ error: error.message });
  }
};
