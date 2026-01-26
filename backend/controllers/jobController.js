const db = require("../config/db");

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
    full_job_description
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Validate startup
  db.query(
    "SELECT founder_id FROM users WHERE id = ?",
    [user_id],
    (err, userRows) => {
      if (!userRows.length || !userRows[0].founder_id) {
        return res
          .status(400)
          .json({ message: "Only startups can post jobs" });
      }

      const founder_id = userRows[0].founder_id;

      // 2️⃣ Get startup name
      db.query(
        "SELECT startup_name FROM startup_profiles WHERE founder_id = ?",
        [founder_id],
        (err, startupRows) => {
          if (!startupRows.length) {
            return res
              .status(400)
              .json({ message: "Startup profile not found" });
          }

          const startup_name = startupRows[0].startup_name;

          // 3️⃣ Insert job
          db.query(
            `INSERT INTO foundu_jobs (
              user_id, founder_id, startup_name,
              freelancer_job_id, job_type,
              domain, role_category, work_type,
              duration, budget_range, urgency,
              full_job_description
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              user_id,
              founder_id,
              startup_name,
              Date.now(), // freelancer_job_id
              "freelancer",
              domain,
              role_category,
              work_type,
              duration,
              budget_range,
              urgency,
              full_job_description
            ],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({
                success: true,
                message: "Freelancer job posted successfully"
              });
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
    full_job_description
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  db.query(
    "SELECT founder_id FROM users WHERE id = ?",
    [user_id],
    (err, userRows) => {
      if (!userRows.length || !userRows[0].founder_id) {
        return res
          .status(400)
          .json({ message: "Only startups can post jobs" });
      }

      const founder_id = userRows[0].founder_id;

      db.query(
        "SELECT startup_name FROM startup_profiles WHERE founder_id = ?",
        [founder_id],
        (err, startupRows) => {
          if (!startupRows.length) {
            return res
              .status(400)
              .json({ message: "Startup profile not found" });
          }

          const startup_name = startupRows[0].startup_name;

          db.query(
            `INSERT INTO foundu_jobs (
              user_id, founder_id, startup_name,
              cofounder_job_id, job_type,
              domain, role_type, compensation,
              commitment, priority_factors,
              full_job_description
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
              user_id,
              founder_id,
              startup_name,
              Date.now(), // cofounder_job_id
              "cofounder",
              domain,
              role_type,
              compensation,
              commitment,
              JSON.stringify(priority_factors || []),
              full_job_description
            ],
            (err) => {
              if (err) return res.status(500).json({ error: err.message });

              res.json({
                success: true,
                message: "Cofounder job posted successfully"
              });
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
      if (!result.affectedRows)
        return res.status(404).json({ message: "Job not found" });

      res.json({ success: true, message: "Job deleted successfully" });
    }
  );
};
