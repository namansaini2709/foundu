const db = require("../config/db");

// Create a new post
exports.createPost = (req, res) => {
  const { user_id, caption } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!user_id || !image_url) {
    return res.status(400).json({ success: false, message: "User ID and image are required" });
  }

  const query = "INSERT INTO user_posts (user_id, image_url, caption) VALUES (?, ?, ?)";
  db.query(query, [user_id, image_url, caption], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: "Post created successfully", id: result.insertId });
  });
};

// Get all posts for live feed
exports.getAllPosts = (req, res) => {
  const query = `
    SELECT 
      p.*, 
      u.full_name, 
      u.user_type, 
      u.credibility_score,
      u.blue_tick_verified,
      u.green_tick_verified,
      u.golden_tick_verified,
      us.profile_picture_url
    FROM user_posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN users_socials us ON u.id = us.user_id
    ORDER BY p.created_at DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
};

// Get posts for a specific user
exports.getUserPosts = (req, res) => {
  const { userId } = req.params;
  const query = "SELECT * FROM user_posts WHERE user_id = ? ORDER BY created_at DESC";

  db.query(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
};

// Delete a post
exports.deletePost = (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body; // To verify ownership

  db.query("DELETE FROM user_posts WHERE id = ? AND user_id = ?", [postId, user_id], (err, result) => {
    if (err) {
      console.error("[DELETE POST ERROR]", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ success: false, message: "Unauthorized or post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  });
};
