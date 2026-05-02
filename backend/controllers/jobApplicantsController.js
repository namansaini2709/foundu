const db = require("../config/db");
const badgeService = require("../services/badgeService");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");

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
    `SELECT user_type, freelancer_id, cofounder_id, is_profile_complete 
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

      if (!user.is_profile_complete) {
        return res
          .status(403)
          .json({ success: false, message: "Profile incomplete. Please complete your profile to apply." });
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
          user.cofounder_id,
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            success: true,
            message: "Applied to job successfully",
          });

          // Fetch the job owner and notify them
          db.query(
            "SELECT user_id as owner_id, job_title FROM foundu_jobs WHERE job_id = ?",
            [job_id],
            (err, resJob) => {
              if (!err && resJob.length) {
                // Notify Owner
                notificationService.sendNotification(
                  resJob[0].owner_id,
                  "New Job Applicant",
                  `${user.full_name || "A user"} applied for your startup.`,
                  "application",
                  `/job/${job_id}`,
                );

                // Notify Applicant (Confirmation)
                notificationService.sendNotification(
                  user_id,
                  "Application Submitted! 🚀",
                  `Your application for "${resJob[0].job_title}" has been successfully sent.`,
                  "success",
                  "/dashboard",
                );

                // 🔥 Email Notification (Owner)
                emailNotificationService.sendEmailNotification(
                  resJob[0].owner_id,
                  "New Candidate Applied! 👤",
                  `A new candidate has recently applied for your job listing "${resJob[0].job_title}". Log in to your dashboard to review their profile and experience.`,
                  "Review Applications",
                  `${process.env.FRONTEND_URL || "http://localhost:5173"}/job/${job_id}`,
                );

                // 🔥 Email Notification (Applicant Confirmation)
                emailNotificationService.sendEmailNotification(
                  user_id,
                  "Application Received 🤝",
                  `Your application for "${resJob[0].job_title}" has been successfully submitted to the founder. We will notify you once they review your profile.`,
                  "Go to Dashboard",
                  `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`,
                );
              }
            },
          );
        },
      );
    },
  );
};

/* =========================
   GET ALL APPLICANTS (JOB)
========================= */
exports.getAllApplicants = (req, res) => {
  const { job_id } = req.params;

  const query = `
    SELECT 
      ja.user_id,
      ja.job_id,
      ja.applicant_type,
      ja.status,
      ja.created_at,

      u.full_name,
      u.email,
      u.user_type,

      us.profile_picture_url,

      fp.skills_description,
      fp.experience,
      fp.phone_number,
      fp.github,
      fp.linkedin AS linkedin,
      fp.working_environment,

      cp.full_legal_name,
      cp.github_behance,
      cp.linkedin AS cp_linkedin,
      cp.reference_contact,
      cp.superpower1,
      cp.superpower2,
      cp.superpower3

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

  console.log(
    `[UPDATE STATUS] job_id=${job_id}, user_id=${user_id}, status=${status}`,
  );

  if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    `UPDATE job_applicants 
     SET status = ? 
     WHERE job_id = ? AND user_id = ?`,
    [status, job_id, user_id],
    (err, result) => {
      if (err) {
        console.error("[UPDATE STATUS ERROR]", err);
        return res.status(500).json({ error: err.message });
      }

      // ── TRIGGER GREEN TICK EVALUATION ──
      if (status === "accepted" || status === "completed") {
        badgeService.evaluateGreenTick(user_id);
      }

      // ── WALLET CREDIT ON COMPLETION ──
      if (status === "completed") {
        handleJobCompletionCredit(job_id, user_id);
      }

      console.log(`[UPDATE STATUS RESULT] affectedRows=${result.affectedRows}`);
      res.json({
        success: true,
        message: "Applicant status updated",
        affectedRows: result.affectedRows,
      });

      // Send status update notification to the applicant
      notificationService.sendNotification(
        user_id,
        "Application Updated",
        `Your job application status was updated to: ${status.toUpperCase()}.`,
        "application",
        "/dashboard",
      );

      // 🔥 Email Notification (Status Update)
      emailNotificationService.sendEmailNotification(
        user_id,
        "Application Status Update 📢",
        `There's an update regarding your application for a job listing on FoundU. Your current status has been updated to: **${status.toUpperCase()}**.`,
        "View Application Status",
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`,
      );
    },
  );
};

/* =========================
   GET APPLICATIONS BY USER ID
========================= */
exports.getApplicationsByUserId = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      ja.job_id,
      ja.user_id,
      ja.applicant_type,
      ja.status,
      ja.created_at AS applied_on,
      fj.job_title,
      fj.startup_name,
      fj.job_type,
      fj.domain
    FROM job_applicants ja
    JOIN foundu_jobs fj ON fj.job_id = ja.job_id
    WHERE ja.user_id = ?
    ORDER BY ja.created_at DESC
  `;

  db.query(query, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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
        message: "Applicant removed",
      });
    },
  );
};

/* =========================
   AI-MATCHED APPLICANTS
========================= */
const geminiService = require("../services/geminiService");

exports.getAIMatchedApplicants = async (req, res) => {
  const { job_id } = req.params;

  try {
    // 1. Get job details
    const [jobRows] = await db
      .promise()
      .query("SELECT * FROM foundu_jobs WHERE job_id = ?", [job_id]);
    if (!jobRows.length) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 2. Get all applicants for this job
    const [applicants] = await db.promise().query(
      `
      SELECT 
        ja.user_id, ja.status, ja.created_at,
        u.full_name, u.email, u.user_type, u.credibility_score,
        u.blue_tick_verified, u.golden_tick_verified, u.green_tick_verified,
        us.profile_picture_url,
        fp.skills_description, fp.experience, fp.describe_best,
        fp.phone_number, fp.github, fp.linkedin, fp.freelancer_type,
        fp.working_environment, fp.job_profile,
        cp.superpower1, cp.superpower2, cp.superpower3,
        cp.quantifiable_impact, cp.github_behance,
        cp.linkedin AS cp_linkedin, cp.reference_contact, cp.primary_identity
      FROM job_applicants ja
      JOIN users u ON u.id = ja.user_id
      LEFT JOIN users_socials us ON us.user_id = u.id
      LEFT JOIN freelancer_profiles fp ON fp.user_id = u.id
      LEFT JOIN cofounder_profiles cp ON cp.user_id = u.id
      WHERE ja.job_id = ?
      ORDER BY ja.created_at DESC
    `,
      [job_id],
    );

    if (applicants.length === 0) {
      return res.json([]);
    }

    // 3. Call Gemini AI
    const aiResults = await geminiService.matchApplicants(
      jobRows[0],
      applicants,
    );

    // 4. Merge AI results with full applicant data
    const merged = aiResults
      .map((aiMatch) => {
        const full = applicants.find((a) => a.user_id === aiMatch.user_id);
        if (!full) return null;
        return {
          ...full,
          match_score: aiMatch.match_score,
          ai_reason: aiMatch.reason,
          isAI: true,
        };
      })
      .filter(Boolean);

    res.json(merged);
  } catch (error) {
    console.error("AI Match Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =========================
   HELPERS
   ========================= */
async function handleJobCompletionCredit(job_id, user_id) {
  try {
    // 1. Get job details (amount & payment status)
    const [jobRows] = await db.promise().query(
      "SELECT numeric_budget, payment_status, is_completed, job_title FROM foundu_jobs WHERE job_id = ?",
      [job_id]
    );

    if (!jobRows.length || jobRows[0].payment_status !== 'paid' || jobRows[0].is_completed) {
      console.warn(`[Wallet Credit] Job ${job_id} not eligible for credit.`);
      return;
    }

    const amountToCredit = jobRows[0].numeric_budget;

    // 2. Ensure freelancer has a wallet
    const [walletRows] = await db.promise().query("SELECT id FROM wallets WHERE user_id = ?", [user_id]);
    let wallet_id;
    if (!walletRows.length) {
      const [res] = await db.promise().query("INSERT INTO wallets (user_id, balance) VALUES (?, 0)", [user_id]);
      wallet_id = res.insertId;
    } else {
      wallet_id = walletRows[0].id;
    }

    // 3. Update wallet balance
    await db.promise().query("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amountToCredit, wallet_id]);

    // 4. Log transaction
    await db.promise().query(
      `INSERT INTO wallet_transactions (wallet_id, amount, transaction_type, description) 
       VALUES (?, ?, 'credit', ?)`,
      [wallet_id, amountToCredit, `Payment for Job: ${jobRows[0].job_title}`]
    );

    // 5. Mark job as completed to prevent double credit
    await db.promise().query("UPDATE foundu_jobs SET is_completed = TRUE WHERE job_id = ?", [job_id]);

    // 6. Notify Freelancer
    notificationService.sendNotification(
      user_id,
      "Payment Received! 💰",
      `₹${amountToCredit} has been credited to your FoundU Virtual Wallet for completing "${jobRows[0].job_title}".`,
      "success",
      "/dashboard"
    );

    console.log(`[Wallet Credit] Credited ₹${amountToCredit} to user ${user_id} for job ${job_id}`);
  } catch (error) {
    console.error("[Wallet Credit Error]", error);
  }
}
