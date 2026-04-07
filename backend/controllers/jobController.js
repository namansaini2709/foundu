const db = require("../config/db");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");

/* ===============================
   POST FREELANCER JOB
================================ */
exports.createFreelancerJob = (req, res) => {
  const {
    user_id,
    domain,
    role_category,
    work_type,
    duration,
    budget_range,
    urgency,

    // 🔹 NEW FIELDS
    job_level,
    job_type,              // ✅ This comes from frontend as "job_type"
    job_requirements,

    job_title,
    full_job_description,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Validate founder
  db.query(
    "SELECT user_type, founder_id FROM users WHERE id = ?",
    [user_id],
    (err, userRows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!userRows.length || userRows[0].user_type !== "founder") {
        return res.status(403).json({ message: "Only founders can post jobs" });
      }

      const founder_id = userRows[0].founder_id;

      // 2️⃣ Get startup name
      db.query(
        "SELECT startup_name FROM startup_profiles WHERE founder_id = ?",
        [founder_id],
        (err, startupRows) => {
          if (err) return res.status(500).json({ error: err.message });

          if (!startupRows.length) {
            return res.status(400).json({ message: "Startup profile not found" });
          }

          const startup_name = startupRows[0].startup_name;

          // 3️⃣ Get next freelancer_job_id
          db.query(
            `SELECT COALESCE(MAX(freelancer_job_id), 0) + 1 AS next_id
             FROM foundu_jobs
             WHERE job_type = 'freelancer'`,
            (err, idRows) => {
              if (err) return res.status(500).json({ error: err.message });

              const freelancer_job_id = idRows[0].next_id;

              // 4️⃣ Insert job
              db.query(
                `INSERT INTO foundu_jobs (
                  user_id,
                  founder_id,
                  startup_name,
                  freelancer_job_id,
                  job_type,
                  domain,
                  role_category,
                  work_type,
                  duration,
                  budget_range,
                  urgency,

                  job_level,
                  job_location_type,
                  job_requirements,

                  job_title,
                  full_job_description
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  user_id,
                  founder_id,
                  startup_name,
                  freelancer_job_id,
                  "freelancer",
                  domain || null,
                  role_category || null,
                  work_type || null,
                  duration || null,
                  budget_range || null,
                  urgency || null,

                  job_level || null,
                  job_type || null,          // ✅ FIXED: Now correctly maps job_type to job_location_type column
                  job_requirements
                    ? JSON.stringify(job_requirements)
                    : null,

                  job_title || null,
                  full_job_description || null,
                ],
                (err) => {
                  if (err) {
                    console.error("Freelancer job insert error:", err);
                    return res.status(500).json({ error: err.message });
                  }

                  res.json({
                    success: true,
                    message: "Freelancer job posted successfully",
                    freelancer_job_id,
                  });

                  // Notify Founder
                  notificationService.sendNotification(
                    user_id,
                    "Job Posted Successfully",
                    `Your job listing for "${job_title}" is now live!`,
                    "success",
                    `/job/${freelancer_job_id}`
                  );

                  // 🔥 Email Notification
                  emailNotificationService.sendEmailNotification(
                    user_id,
                    "Your Job is Live! 🚀",
                    `Congratulations! Your job listing for "${job_title}" has been successfully posted and is now visible to thousands of potential matches on FoundU.`,
                    "View Job Listing",
                    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/job/${freelancer_job_id}`
                  );
                }); // This closes the (err) => { ... } callback for the INSERT query
            }
          );
        }
      );
    }
  );
};

/* ===============================
   POST COFOUNDER JOB
================================ */
exports.createCofounderJob = (req, res) => {
  const {
    user_id,
    domain,
    role_type,
    compensation,
    commitment,
    priority_factors,

    // 🔹 NEW FIELDS
    job_level,
    job_location_type,
    job_requirements,
    responsibilities,

    job_title,
    full_job_description
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  db.query(
    "SELECT user_type, founder_id FROM users WHERE id = ?",
    [user_id],
    (err, userRows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!userRows.length || userRows[0].user_type !== "founder") {
        return res.status(403).json({ message: "Only founders can post jobs" });
      }

      const founder_id = userRows[0].founder_id;

      db.query(
        "SELECT startup_name FROM startup_profiles WHERE founder_id = ?",
        [founder_id],
        (err, startupRows) => {
          if (err) return res.status(500).json({ error: err.message });

          if (!startupRows.length) {
            return res.status(400).json({ message: "Startup profile not found" });
          }

          const startup_name = startupRows[0].startup_name;

          // 3️⃣ Get next cofounder_job_id
          db.query(
            "SELECT COALESCE(MAX(cofounder_job_id), 0) + 1 AS next_id FROM foundu_jobs WHERE job_type = 'cofounder'",
            (err, idRows) => {
              if (err) return res.status(500).json({ error: err.message });

              const cofounder_job_id = idRows[0].next_id;

              // 4️⃣ Insert job
              db.query(
                `INSERT INTO foundu_jobs (
                  user_id,
                  founder_id,
                  startup_name,
                  cofounder_job_id,
                  job_type,
                  domain,
                  role_type,
                  compensation,
                  commitment,
                  priority_factors,

                  job_level,
                  job_location_type,
                  job_requirements,
                  responsibilities,

                  job_title,
                  full_job_description
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  user_id,
                  founder_id,
                  startup_name,
                  cofounder_job_id,
                  "cofounder",
                  domain || null,
                  role_type || null,
                  compensation || null,
                  commitment || null,
                  JSON.stringify(priority_factors || []),

                  job_level || null,
                  job_location_type || null,
                  job_requirements ? JSON.stringify(job_requirements) : null,
                  responsibilities ? JSON.stringify(responsibilities) : null,

                  job_title || null,
                  full_job_description || null
                ],
                (err) => {
                  if (err) {
                    console.error("Cofounder job insert error:", err);
                    return res.status(500).json({ error: err.message });
                  }

                  res.json({
                    success: true,
                    message: "Cofounder job posted successfully",
                    cofounder_job_id
                  });

                  // Notify Founder
                  notificationService.sendNotification(
                    user_id,
                    "Cofounder Request Posted",
                    `Your cofounder request "${job_title || 'Untitled'}" is now live.`,
                    "job",
                    `/jobs/${cofounder_job_id}`
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};


/* ===============================
   GET ALL JOBS
================================ */
exports.getAllJobs = (req, res) => {
  db.query(
    "SELECT * FROM foundu_jobs ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

/* ===============================
   GET JOB BY ID
================================ */
exports.getJobById = (req, res) => {
  db.query(
    "SELECT * FROM foundu_jobs WHERE job_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!rows.length)
        return res.status(404).json({ message: "Job not found" });

      res.json(rows[0]);
    }
  );
};

/* ===============================
   DELETE JOB
================================ */
exports.deleteJobById = (req, res) => {
  db.query(
    "DELETE FROM foundu_jobs WHERE job_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!result.affectedRows)
        return res.status(404).json({ message: "Job not found" });

      res.json({ success: true, message: "Job deleted successfully" });
    }
  );
};

exports.getJobsByUserId = (req, res) => {
  const { userId } = req.params;
  db.query(
    "SELECT * FROM foundu_jobs WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};