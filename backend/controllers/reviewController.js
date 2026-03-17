const db = require("../config/db");

/* CREATE REVIEW */
exports.createReview = (req, res) => {
  const { user_id, reviewer_id, review_text, stars } = req.body;

  if (!user_id || !reviewer_id || !review_text || !stars) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (user_id === reviewer_id) {
    return res.status(400).json({ message: "User cannot review himself" });
  }

  // 1️⃣ Fetch user being reviewed
  db.query(
    "SELECT user_type FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length)
        return res.status(404).json({ message: "User not found" });

      const userType = rows[0].user_type;

      let freelancer_id = null;
      let cofounder_id = null;

      // 2️⃣ Decide based on user_type
      if (userType === "freelancer") {
        freelancer_id = user_id;
      } else if (userType === "cofounder") {
        cofounder_id = user_id;
      } else {
        return res.status(400).json({
          message: "Reviews are allowed only for freelancers or cofounders"
        });
      }

      // 3️⃣ Insert review
      db.query(
        `INSERT INTO reviews 
         (user_id, reviewer_id, freelancer_id, cofounder_id, review_text, stars)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          reviewer_id,
          freelancer_id,
          cofounder_id,
          review_text,
          stars
        ],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            success: true,
            message: "Review added successfully",
            review_id: result.insertId
          });
        }
      );
    }
  );
};


/* GET REVIEWS BY USER ID */
exports.getReviewsByUserId = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT 
      r.*,
      u.full_name AS reviewer_name,
      u.user_type AS reviewer_type,
      us.profile_picture_url AS reviewer_photo,
      sp.startup_name
    FROM reviews r
    JOIN users u ON u.id = r.reviewer_id
    LEFT JOIN users_socials us ON us.user_id = r.reviewer_id
    LEFT JOIN users founder_user ON founder_user.id = r.reviewer_id
    LEFT JOIN startup_profiles sp ON sp.founder_id = founder_user.founder_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/* RECALCULATE CREDIBILITY SCORE */
exports.recalculateCredibility = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  db.query(
    `SELECT AVG(stars) AS avg_stars, COUNT(*) AS review_count 
     FROM reviews WHERE user_id = ?`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const { avg_stars, review_count } = rows[0];

      // Credibility score formula: weighted average of stars (0-5) mapped to 0-100
      // Plus bonus for review count
      let score = 0;
      let badge = 'Growing';

      if (review_count > 0) {
        const starScore = (avg_stars / 5) * 80; // Max 80 from stars
        const countBonus = Math.min(review_count * 2, 20); // Max 20 from count
        score = Math.round(starScore + countBonus);
        score = Math.min(score, 100);
      }

      if (score >= 90) badge = 'Exceptional';
      else if (score >= 85) badge = 'Excellent';
      else if (score >= 80) badge = 'Very Good';
      else badge = 'Growing';

      // Update credibility score in user table
      db.query(
        `UPDATE users SET credibility_score = ? WHERE id = ?`,
        [score, user_id],
        (updateErr) => {
          // Don't fail if column doesn't exist yet
          if (updateErr) console.log('Note: credibility_score column may not exist yet');

          res.json({
            success: true,
            credibility_score: score,
            badge,
            avg_stars: avg_stars ? parseFloat(avg_stars).toFixed(1) : '0.0',
            review_count: review_count || 0
          });
        }
      );
    }
  );
};

/* GET ALL REVIEWS */
exports.getAllReviews = (req, res) => {
  db.query(
    "SELECT * FROM reviews ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

/* GET REVIEW BY ID */
exports.getReviewById = (req, res) => {
  db.query(
    "SELECT * FROM reviews WHERE review_id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length)
        return res.status(404).json({ message: "Review not found" });

      res.json(rows[0]);
    }
  );
};

/* DELETE REVIEW */
exports.deleteReview = (req, res) => {
  db.query(
    "DELETE FROM reviews WHERE review_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows)
        return res.status(404).json({ message: "Review not found" });

      res.json({ success: true, message: "Review deleted" });
    }
  );
};
