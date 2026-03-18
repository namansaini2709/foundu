const db = require("../config/db");

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
          ) return callback(true);

          if (
            type === "founder" &&
            s.company_linkedin_url &&
            s.company_registration_number
          ) return callback(true);

          if (
            type === "cofounder" &&
            s.linkedin_url &&
            (s.portfolio_url || s.past_work_proof)
          ) return callback(true);

          callback(false);
        }
      );
    }
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
                [user_id]
              );
            }
          }
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
                [user_id]
              );
            }
          }
        );
      }
    }
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
         FROM login_activity 
         WHERE user_id = ? 
         AND MONTH(created_at) = MONTH(CURRENT_DATE())`,
        [user_id],
        (err, res) => {
          if (res[0].cnt >= 20) {
            db.query(
              "UPDATE users SET golden_tick_verified = true WHERE id = ?",
              [user_id]
            );
          } else {
            db.query(
              "UPDATE users SET golden_tick_verified = false WHERE id = ?",
              [user_id]
            );
          }
        }
      );
    }
  );
};

/* =========================
   CREDIBILITY BADGE (DUMMY)
========================= */
exports.evaluateCredibilityBadge = (user_id) => {
  const dummy = "85-90";
  db.query(
    "UPDATE users SET credibility_badge = ? WHERE id = ?",
    [dummy, user_id]
  );
};
