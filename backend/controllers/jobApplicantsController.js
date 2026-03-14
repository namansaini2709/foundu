const db = require("../config/db");

/* =========================
   APPLY TO JOB
========================= */
exports.applyToJob = (req, res) => {
  const { job_id, user_id } = req.body;

  if (!job_id || !user_id) {
    return res.status(400).json({ message: "job_id and user_id are required" });
  }

  // 1️⃣ Get user type & role IDs
  db.query(
    `SELECT user_type, freelancer_id, cofounder_id 
     FROM users WHERE id = ?`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = rows[0];

      if (!["freelancer", "cofounder"].includes(user.user_type)) {
        return res
          .status(400)
          .json({ message: "Only freelancers or cofounders can apply" });
      }

      // 2️⃣ Insert application
      db.query(
        `INSERT INTO job_applicants (
          job_id,
          user_id,
          applicant_type,
          freelancer_id,
          cofounder_id
        ) VALUES (?,?,?,?,?)`,
        [
          job_id,
          user_id,
          user.user_type,
          user.freelancer_id,
          user.cofounder_id
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            success: true,
            message: "Applied to job successfully"
          });
        }
      );
    }
  );
};

/* =========================
   GET ALL APPLICANTS (JOB)
========================= */
exports.getAllApplicants = (req, res) => {
  const { job_id } = req.params;

  const query = `
    SELECT 
      ja.*,

      u.full_name,
      u.email,
      u.user_type,

      us.profile_picture_url,

      fp.*,
      cp.*,
      ja.user_id,
      COALESCE(fp.linkedin, cp.linkedin) AS linkedin

    FROM job_applicants ja

    JOIN users u ON u.id = ja.user_id
    LEFT JOIN users_socials us ON us.user_id = u.id
    LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
    LEFT JOIN cofounder_profiles cp ON cp.user_id = u.id

    WHERE ja.job_id = ?
    ORDER BY ja.created_at DESC
  `;

  db.query(query, [job_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/* =========================
   GET APPLICANT BY USER ID
========================= */
exports.getApplicantByUserId = (req, res) => {
  const { job_id, user_id } = req.params;

  const query = `
    SELECT 
      ja.*,
      u.full_name,
      u.email,
      us.profile_picture_url,
      fp.*,
      cp.*
    FROM job_applicants ja
    JOIN users u ON u.id = ja.user_id
    LEFT JOIN users_socials us ON us.user_id = u.id
    LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
    LEFT JOIN cofounder_profiles cp ON cp.user_id = u.id
    WHERE ja.job_id = ? AND ja.user_id = ?
  `;

  db.query(query, [job_id, user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    res.json(rows[0]);
  });
};

/* =========================
   UPDATE APPLICANT STATUS
========================= */
exports.updateApplicantStatus = (req, res) => {
  const { job_id, user_id } = req.params;
  const { status } = req.body;

  if (!["pending", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    `UPDATE job_applicants 
     SET status = ? 
     WHERE job_id = ? AND user_id = ?`,
    [status, job_id, user_id],
    () => {
      res.json({
        success: true,
        message: "Applicant status updated"
      });
    }
  );
};

/* =========================
   DELETE APPLICANT
========================= */
exports.deleteApplicant = (req, res) => {
  const { job_id, user_id } = req.params;

  db.query(
    `DELETE FROM job_applicants 
     WHERE job_id = ? AND user_id = ?`,
    [job_id, user_id],
    () => {
      res.json({
        success: true,
        message: "Applicant removed"
      });
    }
  );
};
