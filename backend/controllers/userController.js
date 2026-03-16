const bcrypt = require("bcrypt");
const db = require("../config/db");
const transporter = require("../config/mail");
const { generateToken } = require("../utils/token");

const resetTokens = {}; // temporary (move to DB/Redis later)

/* =========================
   SIGNUP
========================= */
exports.signup = async (req, res) => {
  const { full_name, email, password, user_type } = req.body;

  try {
    if (!full_name || !email || !password || !user_type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedRoles = ["freelancer", "founder", "cofounder"];
    if (!allowedRoles.includes(user_type)) {
      return res.status(400).json({ message: "Invalid user_type" });
    }

    // 🔍 Check email uniqueness
    const [existing] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    let freelancer_id = null;
    let founder_id = null;
    let cofounder_id = null;

    // 🔢 Generate role-based ID
    if (user_type === "freelancer") {
      const [r] = await db.promise().query(
        "SELECT COALESCE(MAX(freelancer_id),0)+1 AS next_id FROM users WHERE user_type='freelancer'"
      );
      freelancer_id = r[0].next_id;
    }

    if (user_type === "founder") {
      const [r] = await db.promise().query(
        "SELECT COALESCE(MAX(founder_id),0)+1 AS next_id FROM users WHERE user_type='founder'"
      );
      founder_id = r[0].next_id;
    }

    if (user_type === "cofounder") {
      const [r] = await db.promise().query(
        "SELECT COALESCE(MAX(cofounder_id),0)+1 AS next_id FROM users WHERE user_type='cofounder'"
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
        cofounder_id
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user_id: result.insertId,
      user_type,
      freelancer_id,
      founder_id,
      cofounder_id
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

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
      cofounder_id: user.cofounder_id
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
        `INSERT IGNORE INTO login_audit (user_id, login_date) VALUES (?, CURDATE())`,
        [user.id],
        (auditErr) => {
          if (auditErr) console.error("Login audit error:", auditErr);
        }
      );

      // ── AUTO-CHECK GOLDEN TICK after login ──
      // Requires: blue_tick_verified=1 + 20 distinct login days this month
      db.query(
        `SELECT 
          u.blue_tick_verified,
          u.golden_tick_verified,
          u.golden_tick_month,
          DATE_FORMAT(CURDATE(), '%Y-%m') AS current_month,
          COUNT(la.id) AS login_days_this_month
         FROM users u
         LEFT JOIN login_audit la 
           ON la.user_id = u.id 
           AND MONTH(la.login_date)  = MONTH(CURDATE())
           AND YEAR(la.login_date)   = YEAR(CURDATE())
         WHERE u.id = ?
         GROUP BY u.id`,
        [user.id],
        (checkErr, checkRows) => {
          if (!checkErr && checkRows.length) {
            const row = checkRows[0];
            const eligible =
              row.blue_tick_verified == 1 &&
              row.login_days_this_month >= 20;
            const alreadyAwarded =
              row.golden_tick_verified == 1 &&
              row.golden_tick_month === row.current_month;

            if (eligible && !alreadyAwarded) {
              db.query(
                `UPDATE users 
                 SET golden_tick_verified = 1, golden_tick_month = DATE_FORMAT(CURDATE(), '%Y-%m')
                 WHERE id = ?`,
                [user.id]
              );
            }
          }
        }
      );

      res.json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          user_type: user.user_type,
          is_profile_complete: user.is_profile_complete,
          freelancer_id: user.freelancer_id,
          founder_id: user.founder_id,
          cofounder_id: user.cofounder_id
        }
      });
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
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const token = generateToken();

  resetTokens[token] = email;

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  transporter.sendMail({
    to: email,
    subject: "Reset Password - FoundU",
    text: `Reset your password using this link:\n${resetLink}`
  });

  res.json({ success: true, message: "Reset link sent to email" });
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const email = resetTokens[token];
  if (!email) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await db.promise().query(
    "UPDATE users SET password_hash=? WHERE email=?",
    [hash, email]
  );

  delete resetTokens[token];
  res.json({ message: "Password updated successfully" });
};

/* =========================
   GET USERS
========================= */
exports.getAllUsers = async (_, res) => {
  const [rows] = await db.promise().query("SELECT * FROM users");
  res.json(rows);
};

exports.getUserById = async (req, res) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM users WHERE id=?",
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
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
   DELETE USER
========================= */
exports.deleteUser = async (req, res) => {
  await db.promise().query(
    "DELETE FROM users WHERE id=?",
    [req.params.id]
  );
  res.json({ message: "User deleted" });
};
