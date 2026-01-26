const db = require("../config/db");

/* CREATE REVIEW */
exports.createReview = (req, res) => {
  const {
    user_id,
    reviewer_id,
    freelancer_id,
    cofounder_id,
    review_text,
    stars
  } = req.body;

  if (!freelancer_id && !cofounder_id) {
    return res.status(400).json({
      message: "Either freelancer_id or cofounder_id is required"
    });
  }

  if (freelancer_id && cofounder_id) {
    return res.status(400).json({
      message: "Only one of freelancer_id or cofounder_id is allowed"
    });
  }

  db.query(
    `INSERT INTO reviews 
     (user_id, reviewer_id, freelancer_id, cofounder_id, review_text, stars)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      reviewer_id,
      freelancer_id || null,
      cofounder_id || null,
      review_text,
      stars
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        message: "Review created successfully",
        review_id: result.insertId
      });
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
