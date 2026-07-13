const db = require("../config/db");
const emailNotificationService = require("./emailNotificationService");

/**
 * Check for users with 5+ unread messages and send them an email reminder.
 * This should be called periodically (e.g., every 30 minutes via setInterval in server.js).
 * It uses a throttle mechanism — won't email the same user more than once every 6 hours.
 */

// Track last email sent time per user to avoid spamming
const lastEmailSent = new Map();
const THROTTLE_MS = 6 * 60 * 60 * 1000; // 6 hours

async function checkUnreadMessages() {
  try {
    // Find all users who have 5+ total unread messages across all their chats
    const [rows] = await db.promise().query(`
      SELECT 
        cp.user_id,
        u.full_name,
        SUM(
          (SELECT COUNT(*) FROM messages m 
           WHERE m.chat_id = cp.chat_id 
           AND m.is_seen = false 
           AND m.sender_id != cp.user_id)
        ) AS total_unread
      FROM chat_participants cp
      JOIN users u ON u.id = cp.user_id
      GROUP BY cp.user_id, u.full_name
      HAVING total_unread >= 5
    `);

    if (!rows.length) {
      console.log("[Unread Checker] No users with 5+ unread messages.");
      return;
    }

    console.log(`[Unread Checker] Found ${rows.length} users with 5+ unread messages.`);

    for (const row of rows) {
      const userId = row.user_id;
      const lastSent = lastEmailSent.get(userId);

      // Throttle: Skip if we already emailed this user within 6 hours
      if (lastSent && Date.now() - lastSent < THROTTLE_MS) {
        continue;
      }

      // Send email
      await emailNotificationService.sendEmailNotification(
        userId,
        "You Have Unread Messages 💬",
        `Hi ${row.full_name || "there"},<br><br>You have <strong>${row.total_unread} unread messages</strong> waiting for you on FoundU. Don't miss out on important conversations!<br><br>Log in to your chatbox to catch up.`,
        "Open Chatbox",
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/chatbox`
      );

      lastEmailSent.set(userId, Date.now());
      console.log(`[Unread Checker] Emailed user ${userId} (${row.full_name}) — ${row.total_unread} unread messages.`);
    }
  } catch (error) {
    console.error("[Unread Checker] Error:", error);
  }
}

module.exports = { checkUnreadMessages };
