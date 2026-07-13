const bcrypt = require("bcrypt");
const db = require("../config/db");
const mailService = require("../services/mailService");
const { generateToken } = require("../utils/token");
const { generateJWT } = require("../utils/jwtUtils");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");

const resetTokens = {}; // temporary (move to DB/Redis later)

const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME);

// httpOnly cookie options for JWT
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "lax", // "lax" works since frontend & backend share .foundu.in
  maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days (match JWT_EXPIRES_IN)
  path: "/",
  domain: isProduction ? ".foundu.in" : undefined, // Share cookie across foundu.in & api.foundu.in
});

/* =========================
   SIGNUP
========================= */
exports.signup = async (req, res) => {
  const { full_name, email, password, user_type, referral_code } = req.body;

  try {
    if (!full_name || !email || !password || !user_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedRoles = ["freelancer", "founder", "cofounder"];
    if (!allowedRoles.includes(user_type)) {
      return res.status(400).json({ message: "Invalid user_type" });
    }

    // 🔍 Check email uniqueness
    const [existing] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);

    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 🔍 Validate referral code if provided
    let valid_referral = null;
    if (referral_code && referral_code.trim() !== "") {
      const codeToVerify = referral_code.trim();
      const [refResult] = await db.promise().query("SELECT id, is_active FROM referrals WHERE code = ?", [codeToVerify]);
      if (!refResult.length) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      if (!refResult[0].is_active) {
        return res.status(400).json({ message: "Referral code has expired or is offline" });
      }
      valid_referral = codeToVerify;
    }

    const hash = await bcrypt.hash(password, 10);

    let freelancer_id = null;
    let founder_id = null;
    let cofounder_id = null;

    // 🔢 Generate role-based ID
    if (user_type === "freelancer") {
      const [r] = await db
        .promise()
        .query(
          "SELECT COALESCE(MAX(freelancer_id),0)+1 AS next_id FROM users WHERE user_type='freelancer'",
        );
      freelancer_id = r[0].next_id;
    }

    if (user_type === "founder") {
      const [r] = await db
        .promise()
        .query(
          "SELECT COALESCE(MAX(founder_id),0)+1 AS next_id FROM users WHERE user_type='founder'",
        );
      founder_id = r[0].next_id;
    }

    if (user_type === "cofounder") {
      const [r] = await db
        .promise()
        .query(
          "SELECT COALESCE(MAX(cofounder_id),0)+1 AS next_id FROM users WHERE user_type='cofounder'",
        );
      cofounder_id = r[0].next_id;
    }

    // 🧠 Insert user
    const [result] = await db.promise().query(
      `INSERT INTO users (
        full_name,
        email,
        password_hash,
        user_type,
        freelancer_id,
        founder_id,
        cofounder_id,
        is_profile_complete
      ) VALUES (?,?,?,?,?,?,?,false)`,
      [
        full_name,
        email,
        hash,
        user_type,
        freelancer_id,
        founder_id,
        cofounder_id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: result.insertId,
      user_type,
      freelancer_id,
      founder_id,
      cofounder_id,
    });

    // Send Welcome Notification
    notificationService.sendNotification(
      result.insertId,
      "Welcome to FoundU! 🎉",
      "Your account has been successfully created. Complete your profile to get started.",
      "welcome",
      "/profile",
    );

      const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");
      const profilePath = user_type === "founder" ? "/startup-profile" : (user_type === "cofounder" ? "/cofounder-profile" : "/freelancer-profile");
      
      emailNotificationService.sendEmailNotification(
        result.insertId,
        "Welcome to FoundU! 🎉",
        "We're thrilled to have you on board. FoundU is the ultimate platform to connect top freelancers with the most innovative startups. Start by completing your profile to unlock all features!",
        "Complete Your Profile",
        `${baseUrl}${profilePath}`,
      );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  const email = String(req.body.email || "").trim();
  const password = req.body.password;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    console.log("[DEBUG] User Login Attempt:", email);
    if (rows.length > 0) {
      console.log("[DEBUG] User Found. Available Columns:", Object.keys(rows[0]));
    } else {
      console.log("[DEBUG] User NOT Found in DB.");
    }

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const user_hash = user.password_hash || user.password;

    if (!user_hash) {
      console.warn("[Auth] No password hash found for user:", user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user_hash);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ⭐ STORE USER IN SESSION
    req.session.user = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      is_profile_complete: user.is_profile_complete,
      freelancer_id: user.freelancer_id,
      founder_id: user.founder_id,
      cofounder_id: user.cofounder_id,
    };

    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session error" });
      }

      console.log("Session saved for user:", req.session.user.email);
      console.log("Session ID:", req.sessionID);
      console.log("Session Data:", req.session);

      // ── LOG LOGIN AUDIT (one row per day, UNIQUE key deduplicates) ──
      db.query(
        `INSERT INTO login_audit (user_id, login_date) VALUES (?, CURRENT_DATE) ON CONFLICT DO NOTHING`,
        [user.id],
        (auditErr) => {
          if (auditErr) console.error("Login audit error:", auditErr);
        },
      );

      // ── AUTO-CHECK GOLDEN TICK after login ──
      // Requires: blue_tick_verified=1 + 20 distinct login days this month
      db.query(
        `SELECT 
          u.blue_tick_verified,
          u.golden_tick_verified,
          u.golden_tick_month,
          to_char(CURRENT_DATE, 'YYYY-MM') AS current_month,
          COUNT(la.user_id) AS login_days_this_month
         FROM users u
         LEFT JOIN login_audit la 
           ON la.user_id = u.id 
           AND to_char(la.login_date, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM')
         WHERE u.id = ?
         GROUP BY u.id`,
        [user.id],
        (checkErr, checkRows) => {
          if (!checkErr && checkRows.length) {
            const row = checkRows[0];
            console.log("Golden Tick Debug - User 4 Stats:", row);
            const eligible =
              row.blue_tick_verified && row.login_days_this_month >= 20;
            const alreadyAwarded =
              row.golden_tick_verified &&
              row.golden_tick_month === row.current_month;

            if (eligible && !alreadyAwarded) {
              db.query(
                `UPDATE users 
                 SET golden_tick_verified = true, golden_tick_month = to_char(CURRENT_DATE, 'YYYY-MM')
                 WHERE id = ?`,
                [user.id],
              );

              // Push live Golden Tick notification
              const notificationService = require("../services/notificationService");
              notificationService.sendNotification(
                user.id,
                "Golden Tick Awarded! 🟡",
                "Amazing! You've logged in for 20 days this month and unlocked the Golden Tick.",
                "badge",
                "/dashboard",
              );
            }
          }
        },
      );

      // 🔑 Generate JWT Token
      const token = generateJWT(user);

      // 🍪 Set httpOnly cookie
      res.cookie("jwt", token, getCookieOptions());

      res.json({
        success: true,
        message: "Logged in successfully",
        token, // Still return token for backward compatibility
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          user_type: user.user_type,
          is_profile_complete: user.is_profile_complete,
          freelancer_id: user.freelancer_id,
          founder_id: user.founder_id,
          cofounder_id: user.cofounder_id,
        },
      });

      // Send Login Notification
      notificationService.sendNotification(
        user.id,
        "New Login Detected",
        "You successfully logged in to FoundU.",
        "security",
        "/profile",
      );
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   LOGOUT
========================= */
exports.logout = (req, res) => {
  // Clear httpOnly JWT cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    domain: isProduction ? ".foundu.in" : undefined,
  });
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 🔍 Check if user exists
    const [rows] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "No user found with this email" });
    }

    const token = generateToken();
    resetTokens[token] = email;

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const subject = "Reset Your Password - FoundU";
    const text = `You requested a password reset. Please use the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background: #000000; padding: 20px; text-align: center;">
          <img src="https://www.foundu.in/foundu-logo.png" alt="FoundU Logo" style="width: 150px; height: auto; background-color: #ffffff; padding: 10px; border-radius: 8px;" />
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your FoundU account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request this, please ignore this email. This link will expire shortly.</p>
        </div>
      </div>
    `;

    await mailService.sendEmail(email, subject, text, html);

    res.json({
      success: true,
      message: "A reset password link has been sent to your email address.",
    });

    // Send Notification
    notificationService.sendNotification(
      rows[0].id,
      "Password Reset Requested",
      "We received a request to reset your password. Check your email for instructions.",
      "security",
      "#",
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ error: "Failed to send reset link. Please try again later." });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const email = resetTokens[token];
    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await db
      .promise()
      .query("UPDATE users SET password_hash=? WHERE email=?", [hash, email]);

    delete resetTokens[token];
    res.json({
      success: true,
      message: "Your password has been updated successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ error: "Failed to reset password. Please try again later." });
  }
};

/* =========================
   GET USERS
========================= */
exports.getAllUsers = async (_, res) => {
  try {
    const query = `
      SELECT 
        u.id, u.full_name, u.email, u.user_type, u.credibility_score,
        u.blue_tick_verified, u.golden_tick_verified, u.green_tick_verified,
        us.profile_picture_url,
        COALESCE(fp.freelancer_type, cp.primary_identity, sp.founder_type) AS professional_role
      FROM users u
      LEFT JOIN users_socials us ON u.id = us.user_id
      LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
      LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
      LEFT JOIN startup_profiles sp ON u.id = sp.user_id
      ORDER BY u.credibility_score DESC
    `;
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = (req, res) => {
  const query = `
    SELECT 
      u.id, u.full_name, u.email, u.user_type, u.credibility_score, u.is_profile_complete,
      u.blue_tick_verified, u.golden_tick_verified, u.green_tick_verified,
      us.profile_picture_url,
      COALESCE(fp.describe_best, cp.quantifiable_impact, sp.why_building) AS professional_bio,
      COALESCE(fp.phone_number, cp.reference_contact) AS contact_phone,
      COALESCE(fp.linkedin, cp.linkedin, us.linkedin_url) AS contact_linkedin,
      COALESCE(fp.github, cp.github_behance, us.github_url) AS contact_github,
      COALESCE(fp.freelancer_type, cp.primary_identity, sp.founder_type) AS professional_role,
      fp.experience,
      fp.job_profile,
      (SELECT COUNT(*) FROM job_applicants ja WHERE ja.user_id = u.id AND ja.status = 'completed') AS jobs_completed
    FROM users u
    LEFT JOIN users_socials us ON u.id = us.user_id
    LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
    LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
    LEFT JOIN startup_profiles sp ON u.id = sp.user_id
    WHERE u.id = ?
  `;
  db.query(query, [req.params.id], (err, rows) => {
    if (err) {
      console.error("Error in getUserById:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: rows[0] });
  });
};

/* =========================
   GET ME (Current User)
========================= */
exports.getMe = (req, res) => {
  const id = req.user.id;
  const query = `
    SELECT u.*, us.profile_picture_url 
    FROM users u 
    LEFT JOIN users_socials us ON u.id = us.user_id 
    WHERE u.id = ?
  `;
  db.query(query, [id], (err, rows) => {
    if (err) {
      console.error("Error in getMe:", err);
      return res.status(500).json({ success: false, message: "Database Error" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user = rows[0];
    delete user.password;
    res.json({ success: true, data: user });
  });
};

/* =========================
   GET LIVE USER FEED
========================= */
exports.getLiveFeed = (req, res) => {
  const query = `
    SELECT 
      u.id, 
      u.full_name, 
      u.user_type, 
      u.credibility_score, 
      u.blue_tick_verified, 
      u.golden_tick_verified,
      u.green_tick_verified,
      u.is_profile_complete,
      us.profile_picture_url,
      COALESCE(us.github_url, fp.github, cp.github_behance) AS github,
      COALESCE(us.linkedin_url, fp.linkedin, cp.linkedin) AS linkedin,
      us.portfolio_url AS portfolio,
      fp.skills_description,
      fp.experience,
      fp.working_environment,
      cp.superpower1,
      cp.superpower2,
      cp.superpower3,
      cp.full_legal_name,
      COALESCE(r_stats.avg_stars, 0) as avg_stars,
      COALESCE(r_stats.review_count, 0) as review_count
    FROM users u
    LEFT JOIN users_socials us ON u.id = us.user_id
    LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
    LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
    LEFT JOIN (
      SELECT user_id, AVG(stars) as avg_stars, COUNT(review_id) as review_count
      FROM reviews
      GROUP BY user_id
    ) r_stats ON u.id = r_stats.user_id
    WHERE u.user_type IN ('freelancer', 'cofounder')
    ORDER BY u.credibility_score DESC, u.created_at DESC
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error("[LIVE FEED ERROR]", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

/* =========================
   GET PUBLIC STATS
========================= */
exports.getPublicStats = async (req, res) => {
  try {
    const [[freelancers]] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE user_type = 'freelancer'");
    const [[founders]] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE user_type = 'founder'");
    const [[cofounders]] = await db.promise().query("SELECT COUNT(*) as count FROM users WHERE user_type = 'cofounder'");
    const [[jobs]] = await db.promise().query("SELECT COUNT(*) as count FROM foundu_jobs");

    res.json({
      success: true,
      stats: {
        freelancers: freelancers.count,
        founders: founders.count,
        cofounders: cofounders.count,
        totalJobs: jobs.count
      }
    });
  } catch (error) {
    console.error("[PUBLIC STATS ERROR]", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  await db.promise().query("DELETE FROM users WHERE id=?", [req.params.id]);
  res.json({ message: "User deleted" });
};
