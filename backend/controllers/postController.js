const db = require("../config/db");
const notificationService = require("../services/notificationService");

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

// Toggle like on a post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.body;

  if (!user_id) return res.status(401).json({ success: false, message: "Login required to like posts" });

  try {
    // Check if already liked
    const [existing] = await db.promise().query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, user_id]
    );

    if (existing.length > 0) {
      // Unlike
      await db.promise().query("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", [postId, user_id]);
      await db.promise().query("UPDATE user_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?", [postId]);
      const [[post]] = await db.promise().query("SELECT likes_count FROM user_posts WHERE id = ?", [postId]);
      return res.json({ success: true, liked: false, likes_count: post.likes_count });
    } else {
      // Like
      await db.promise().query("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)", [postId, user_id]);
      await db.promise().query("UPDATE user_posts SET likes_count = likes_count + 1 WHERE id = ?", [postId]);
      const [[post]] = await db.promise().query("SELECT likes_count, user_id FROM user_posts WHERE id = ?", [postId]);

      // Send real-time notification to post owner (skip if liking own post)
      if (post.user_id !== parseInt(user_id)) {
        const [[liker]] = await db.promise().query("SELECT full_name FROM users WHERE id = ?", [user_id]);
        const likerName = liker?.full_name || "Someone";
        notificationService.sendNotification(
          post.user_id,
          "\u2764\uFE0F New Like!",
          `${likerName} liked your post.`,
          "general",
          "/live-feed"
        ).catch(e => console.error("Like notify error:", e));
      }

      return res.json({ success: true, liked: true, likes_count: post.likes_count });
    }
  } catch (err) {
    console.error("[LIKE ERROR]", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Check if a user liked a specific post
exports.getLikeStatus = async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.query;

  if (!user_id) return res.json({ liked: false });

  try {
    const [rows] = await db.promise().query(
      "SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, user_id]
    );
    res.json({ liked: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
