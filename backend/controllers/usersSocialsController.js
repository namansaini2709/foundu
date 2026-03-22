const db = require("../config/db");
const notificationService = require("../services/notificationService");

exports.addUserSocials = (req, res) => {
  const {
    user_id,
    linkedin_url,
    github_url,
    portfolio_url,
    company_linkedin_url,
    company_social_url,
    company_registration_number,
    past_work_proof,
    profile_picture_url
  } = req.body;

  // 📂 Handle File Uploads (if any)
  let updatedProfilePictureUrl = profile_picture_url;
  let updatedPastWorkProof = past_work_proof;

  if (req.files) {
    if (req.files.profile_picture && req.files.profile_picture[0]) {
      updatedProfilePictureUrl = `/uploads/${req.files.profile_picture[0].filename}`;
    }
    if (req.files.past_work_proof && req.files.past_work_proof[0]) {
      updatedPastWorkProof = `/uploads/${req.files.past_work_proof[0].filename}`;
    }
  }

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  db.query(
    `SELECT 
      full_name, 
      freelancer_id, 
      founder_id, 
      cofounder_id 
     FROM users WHERE id = ?`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = rows[0];

      db.query(
        `INSERT INTO users_socials (
          user_id,
          full_name,
          freelancer_id,
          founder_id,
          cofounder_id,
          linkedin_url,
          github_url,
          portfolio_url,
          company_linkedin_url,
          company_social_url,
          company_registration_number,
          past_work_proof,
          profile_picture_url
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          linkedin_url                 = VALUES(linkedin_url),
          github_url                   = VALUES(github_url),
          portfolio_url                = VALUES(portfolio_url),
          company_linkedin_url         = VALUES(company_linkedin_url),
          company_social_url           = VALUES(company_social_url),
          company_registration_number  = VALUES(company_registration_number),
          past_work_proof              = VALUES(past_work_proof),
          profile_picture_url          = VALUES(profile_picture_url)`,
        [
          user_id,
          user.full_name,
          user.freelancer_id,
          user.founder_id,
          user.cofounder_id,
          linkedin_url,
          github_url,
          portfolio_url,
          company_linkedin_url,
          company_social_url,
          company_registration_number,
          updatedPastWorkProof,
          updatedProfilePictureUrl
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Keep admin panel in sync by explicitly setting status to pending
          db.query("UPDATE users SET blue_tick_status = 'pending' WHERE id = ?", [user_id]);

          res.json({
            success: true,
            message: "User socials saved successfully"
          });

          // Inform user that application is received
          notificationService.sendNotification(
            user_id,
            "Blue Tick Application Received",
            "Your profile details have been securely submitted. Please allow 24-48 hours for verification.",
            "badge",
            "/dashboard"
          );
        }
      );
    }
  );
};

/* ==========================
   GET USER SOCIALS + STATUS
========================== */
exports.getUserSocials = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) return res.status(400).json({ message: "user_id required" });

  db.query(
    `SELECT 
      us.linkedin_url,
      us.github_url,
      us.portfolio_url,
      us.profile_picture_url,
      us.past_work_proof,
      u.blue_tick_status,
      u.blue_tick_verified,
      u.green_tick_verified
    FROM users u
    LEFT JOIN users_socials us ON us.user_id = u.id
    WHERE u.id = ?
    LIMIT 1`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.status(404).json({ message: "User not found" });
      res.json({ success: true, data: rows[0] });
    }
  );
};