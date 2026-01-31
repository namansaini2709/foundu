const db = require("../config/db");

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
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
          past_work_proof,
          profile_picture_url
        ],
        () => {
          res.json({
            success: true,
            message: "User socials saved successfully"
          });
        }
      );
    }
  );
};
