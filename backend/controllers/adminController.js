const bcrypt = require("bcrypt");
const db = require("../config/db");

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

    res.json({
      success: true,
      stats: {
        pendingBlueTickRequests: pendingBlueTick.count,
        totalUsers: totalUsers.count,
        approvedBlueTick: approvedBlueTick.count,
        totalJobs: totalJobs.count,
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
