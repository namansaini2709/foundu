const db = require("../config/db");
const geminiService = require("../services/geminiService");
const notificationService = require("../services/notificationService");
const emailNotificationService = require("../services/emailNotificationService");

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
          message: "Reviews are allowed only for freelancers or cofounders",
        });
      }

      // 3️⃣ Insert review
      db.query(
        `INSERT INTO reviews 
         (user_id, reviewer_id, freelancer_id, cofounder_id, review_text, stars)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, reviewer_id, freelancer_id, cofounder_id, review_text, stars],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({
            success: true,
            message: "Review added successfully",
            review_id: result.insertId,
          });

          // Send notification to the reviewed user
          notificationService.sendNotification(
            user_id,
            "New Profile Review",
            `You received a new ${stars}-star review. Your credibility score will update shortly.`,
            "review",
            "/profile"
          );

          // 🔥 Email Notification
          emailNotificationService.sendEmailNotification(
            user_id,
            "New Review Received! ⭐",
            `A user on FoundU has just left you a new ${stars}-star review. This feedback helps build your credibility within the community.`,
            "Read Your Reviews",
            `${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile`
          );
        },
      );
    },
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

/* GET BASIC CREDIBILITY DATA (No recalculation, no notification) */
exports.getCredibility = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1. Fetch stored score and badge from users table
  // 2. Calculate current avg_stars and review_count from reviews table
  const query = `
    SELECT 
      u.credibility_score, 
      u.credibility_badge,
      COALESCE(r_stats.avg_stars, 0) as avg_stars,
      COALESCE(r_stats.review_count, 0) as review_count
    FROM users u
    LEFT JOIN (
      SELECT user_id, AVG(stars) as avg_stars, COUNT(review_id) as review_count
      FROM reviews
      WHERE user_id = ?
      GROUP BY user_id
    ) r_stats ON u.id = r_stats.user_id
    WHERE u.id = ?
  `;

  db.query(query, [user_id, user_id], (err, rows) => {
    if (err) {
      console.error("[DEBUG] Error fetching credibility:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const row = rows[0];
    console.log(`[DEBUG] Fetching credibility for user ${user_id}. Stored Score: ${row.credibility_score}`);

    res.json({
      success: true,
      credibility_score: row.credibility_score !== null ? row.credibility_score : 0,
      badge: row.credibility_badge || "Below 80",
      avg_stars: row.avg_stars ? parseFloat(row.avg_stars).toFixed(1) : "0.0",
      review_count: row.review_count || 0,
      ai_summary: null,
      breakdown: null
    });
  });
};

/* RECALCULATE CREDIBILITY SCORE */
exports.recalculateCredibility = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1. Fetch user data (stars, badges, review text)
  const userQuery = `
    SELECT 
      u.blue_tick_verified, 
      u.green_tick_verified, 
      u.golden_tick_verified,
      AVG(r.stars) as avg_stars,
      COUNT(r.review_id) as review_count
    FROM users u
    LEFT JOIN reviews r ON r.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id
  `;

  db.query(userQuery, [user_id], (err, userRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!userRows.length)
      return res.status(404).json({ message: "User not found" });

    const {
      blue_tick_verified,
      green_tick_verified,
      golden_tick_verified,
      avg_stars,
      review_count,
    } = userRows[0];

    // Fetch all review texts for AI analysis
    db.query(
      "SELECT stars, review_text FROM reviews WHERE user_id = ?",
      [user_id],
      async (err, reviews) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
          let aiAnalysis = {
            qualityScore: 50,
            summary: "No reviews to analyze.",
          };
          if (reviews.length > 0) {
            aiAnalysis = await geminiService.analyzeReviews(reviews);
          }

          /* ── CALCULATE SCORE (45/45/10) ── */
          const starScore = avg_stars ? (avg_stars / 5) * 45 : 0;
          const qualityWeight = (aiAnalysis.qualityScore / 100) * 35;
          const countBonus = Math.min(review_count * 2, 10);
          const reviewScore = qualityWeight + countBonus;
          const blueBonus = blue_tick_verified ? 4 : 0;
          const greenBonus = green_tick_verified ? 3 : 0;
          const goldenBonus = golden_tick_verified ? 3 : 0;
          const badgeScore = blueBonus + greenBonus + goldenBonus;

          const totalScore = Math.round(starScore + reviewScore + badgeScore);
          const finalScore = Math.min(Math.max(totalScore, 0), 100);

          let badgeValue = "below-80";
          if (finalScore >= 90) badgeValue = "90-95";
          else if (finalScore >= 85) badgeValue = "85-90";
          else if (finalScore >= 80) badgeValue = "80-85";

          // UPDATE users table with score and badge
          db.query(
            "UPDATE users SET credibility_score = ?, credibility_badge = ? WHERE id = ?",
            [finalScore, badgeValue, user_id],
            (updateErr, result) => {
              if (updateErr) {
                console.error("[DEBUG] DB Update Error:", updateErr);
                return res.status(500).json({ success: false, message: "Database update failed", error: updateErr.message });
              }

              // Notify user about score refresh
              notificationService.sendNotification(
                user_id,
                "Credibility Score Updated!",
                `Your credibility score has been recalculated. Your current score is: ${finalScore}/100.`,
                "review",
                "/profile"
              ).catch(e => console.error("Notification Error:", e));

              res.json({
                success: true,
                credibility_score: finalScore,
                badge: badgeValue,
                avg_stars: avg_stars ? parseFloat(avg_stars).toFixed(1) : "0.0",
                review_count,
                ai_summary: aiAnalysis.summary,
                breakdown: {
                  stars: Math.round(starScore),
                  reviews: Math.round(reviewScore),
                  badges: badgeScore,
                },
              });
            },
          );
        } catch (error) {
          console.error("[DEBUG] Recalculate Error:", error);
          res.status(500).json({ success: false, message: "Internal server error during recalculation", error: error.message });
        }
      },
    );
  });
};

/* GET ALL REVIEWS */
exports.getAllReviews = (req, res) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
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
    },
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
    },
  );
};
