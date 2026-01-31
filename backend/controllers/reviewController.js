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
