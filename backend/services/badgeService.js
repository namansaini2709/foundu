const db = require("../config/db");
const notificationService = require("./notificationService");
const emailNotificationService = require("./emailNotificationService");

/* =========================
   BLUE TICK ELIGIBILITY
========================= */
exports.isEligibleForBlueTick = (user_id, callback) => {
  db.query(
    "SELECT user_type FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (!rows.length) return callback(false);

      const type = rows[0].user_type;

      db.query(
        "SELECT * FROM users_socials WHERE user_id = ?",
        [user_id],
        (err, socials) => {
          if (!socials.length) return callback(false);
          const s = socials[0];

          if (
            type === "freelancer" &&
            s.linkedin_url &&
            (s.github_url || s.portfolio_url)
          )
            return callback(true);

          if (
            type === "founder" &&
            s.company_linkedin_url &&
            s.company_registration_number
          )
            return callback(true);

          if (
            type === "cofounder" &&
            s.linkedin_url &&
            (s.portfolio_url || s.past_work_proof)
          )
            return callback(true);

          callback(false);
        },
      );
    },
  );
};

/* =========================
   GREEN TICK (AUTOMATIC)
========================= */
exports.evaluateGreenTick = (user_id) => {
  db.query(
    "SELECT user_type FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (!rows.length) return;

      const type = rows[0].user_type;

      // ── FREELANCERS & CO-FOUNDERS: Completed Jobs ──
      if (type === "freelancer" || type === "cofounder") {
        db.query(
          "SELECT COUNT(*) as cnt FROM job_applicants WHERE user_id = ? AND status IN ('accepted', 'completed')",
          [user_id],
          (err, res) => {
            if (!err && res[0].cnt >= 1) {
              db.query(
                "UPDATE users SET green_tick_verified = true WHERE id = ?",
                [user_id],
              );
              notificationService.sendNotification(
                user_id,
                "Green Tick Awarded! ✅",
                "You successfully completed a job and earned a Green Tick on your profile.",
                "badge",
                "/profile"
              );

              // 🔥 Email Notification
              emailNotificationService.sendEmailNotification(
                user_id,
                "Badge Achieved: Green Tick! ✅",
                "We're excited to inform you that you've earned the Green Tick badge! This badge is awarded for successfully completing a job on FoundU, proving your reliability to the community.",
                "View Your Badge",
                "http://localhost:5173/profile"
              );
            }
          },
        );
      }

      // ── FOUNDERS: Posted Jobs ──
      if (type === "founder") {
        db.query(
          "SELECT COUNT(*) as cnt FROM foundu_jobs WHERE founder_id = ?",
          [user_id],
          (err, res) => {
            if (!err && res[0].cnt >= 1) {
              db.query(
                "UPDATE users SET green_tick_verified = true WHERE id = ?",
                [user_id],
              );
              notificationService.sendNotification(
                user_id,
                "Green Tick Awarded! ✅",
                "You successfully posted a job and earned a Green Tick on your profile.",
                "badge",
                "/profile"
              );

              // 🔥 Email Notification
              emailNotificationService.sendEmailNotification(
                user_id,
                "Badge Achieved: Green Tick! ✅",
                "We're excited to inform you that you've earned the Green Tick badge! This badge is awarded for successfully posting a job on FoundU, proving your reliability to the community.",
                "View Your Badge",
                "http://localhost:5173/profile"
              );
            }
          },
        );
      }
    },
  );
};

/* =========================
   GOLDEN TICK (MONTHLY)
========================= */
exports.evaluateGoldenTick = (user_id) => {
  db.query(
    `SELECT 
      blue_tick_verified 
     FROM users WHERE id = ?`,
    [user_id],
    (err, rows) => {
      if (!rows.length || !rows[0].blue_tick_verified) return;

      db.query(
        `SELECT COUNT(*) as cnt 
         FROM login_audit 
         WHERE user_id = ? 
         AND MONTH(login_date) = MONTH(CURRENT_DATE())
         AND YEAR(login_date) = YEAR(CURRENT_DATE())`,
        [user_id],
        (err, res) => {
          if (!err && res[0] && res[0].cnt >= 20) {
            db.query(
              "UPDATE users SET golden_tick_verified = true WHERE id = ?",
              [user_id],
            );
            notificationService.sendNotification(
              user_id,
              "Golden Tick Awarded! 🏆",
              "You've logged in 20 times this month and earned a Golden Tick!",
              "badge",
              "/profile"
            );

            // 🔥 Email Notification
            emailNotificationService.sendEmailNotification(
              user_id,
              "Milestone Badge: Golden Tick! 🏆",
              "Congratulations! Your consistent activity on FoundU has earned you the prestigious Golden Tick badge. This represents your commitment and regular engagement with the platform.",
              "View Your Badge",
              "http://localhost:5173/profile"
            );
          } else {
            db.query(
              "UPDATE users SET golden_tick_verified = false WHERE id = ?",
              [user_id],
            );
          }
        },
      );
    },
  );
};

/* =========================
   CREDIBILITY BADGE (DUMMY)
========================= */
exports.evaluateCredibilityBadge = (user_id) => {
  const dummy = "85-90";
  db.query("UPDATE users SET credibility_badge = ? WHERE id = ?", [
    dummy,
    user_id,
  ]);
};
