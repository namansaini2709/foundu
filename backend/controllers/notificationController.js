const db = require("../config/db");
const notificationService = require("../services/notificationService");

// Get all recent notifications for a user (persistence)
exports.getNotifications = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  // Get active notifications (both read and unread for persistence)
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = ?
    ORDER BY created_at DESC 
    LIMIT 50
  `;
  
  db.query(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
};

// Mark a specific notification as read
exports.markAsRead = (req, res) => {
  const notifId = req.params.id;
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
    [notifId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Marked as read" });
    }
  );
};

// Manually trigger a notification (Useful for Postman testing)
exports.testNotification = async (req, res) => {
  const { userId, title, message, type, link } = req.body;
  if (!userId || !title || !message) {
    return res.status(400).json({ error: "userId, title, and message are required." });
  }

  try {
    await notificationService.sendNotification(userId, title, message, type, link);
    res.json({ success: true, message: "Test notification sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a specific notification
exports.deleteNotification = (req, res) => {
  const notifId = req.params.id;
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    [notifId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: "Notification deleted" });
    }
  );
};
