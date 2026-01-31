const db = require("../config/db");

/* ===============================
   CHECK BLUE TICK ELIGIBILITY
================================ */
exports.isEligibleForBlueTick = (user_id, callback) => {
  db.query(
    "SELECT user_type FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (!rows.length) return callback(false);

      db.query(
        "SELECT * FROM users_socials WHERE user_id = ?",
        [user_id],
        (err, socials) => {
          if (!socials.length) return callback(false);

          const s = socials[0];
          const type = rows[0].user_type;

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

/* ===============================
   DUMMY CREDIBILITY BADGE
================================ */
exports.calculateCredibilityBadge = (user_id, callback) => {
  // ML model will come later
  // Dummy logic for now
  const dummyBadge = "85-90";

  db.query(
    "UPDATE users SET credibility_badge = ? WHERE id = ?",
    [dummyBadge, user_id],
    () => callback(dummyBadge)
  );
};
