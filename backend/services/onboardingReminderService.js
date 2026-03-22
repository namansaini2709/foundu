const cron = require("node-cron");
const db = require("../config/db");
const notificationService = require("./notificationService");
const emailNotificationService = require("./emailNotificationService");

/**
 * Onboarding Reminder Service
 * Handles 1-hour and 96-hour reminders for incomplete profiles.
 */
const initOnboardingReminders = () => {
  // Run every 30 minutes to check for pending reminders
  cron.schedule("*/30 * * * *", async () => {
    console.log("[CRON] Checking for onboarding reminders...");
    
    try {
      // 1️⃣ Find users due for their FIRST reminder (1 hour after signup)
      const [firstReminders] = await db.promise().query(`
        SELECT id, full_name, user_type 
        FROM users 
        WHERE is_profile_complete = 0 
        AND onboarding_reminder_count = 0
        AND TIMESTAMPDIFF(HOUR, created_at, NOW()) >= 1
      `);

      for (const user of firstReminders) {
        await sendOnboardingReminder(user, 1);
      }

      // 2️⃣ Find users due for REPEATING reminders (every 96 hours after last reminder)
      const [repeatReminders] = await db.promise().query(`
        SELECT id, full_name, user_type 
        FROM users 
        WHERE is_profile_complete = 0 
        AND onboarding_reminder_count >= 1
        AND TIMESTAMPDIFF(HOUR, last_onboarding_reminder_at, NOW()) >= 96
      `);

      for (const user of repeatReminders) {
        await sendOnboardingReminder(user, 2);
      }

    } catch (err) {
      console.error("[CRON ERROR] Onboarding check failed:", err);
    }
  });
};

/**
 * Sends notification and email to the user
 */
const sendOnboardingReminder = async (user, type) => {
  const { id, full_name, user_type } = user;
  
  const title = "Boost Your Profile! 🚀";
  const message = `Hey ${full_name}, it looks like you haven't completed your ${user_type} profile yet. Profiles with details get 5x more visibility. Complete yours now to unlock all features!`;
  const actionText = "Complete Profile";
  const actionLink = "http://localhost:5173/user-type-selection"; // Redirect to selection or direct profile

  try {
    // Send Platform Notification
    await notificationService.sendNotification(
      id,
      title,
      message,
      "onboarding",
      "/user-type-selection"
    );

    // Send Email
    await emailNotificationService.sendEmailNotification(
      id,
      title,
      message,
      actionText,
      actionLink
    );

    // Update DB tracking
    await db.promise().query(`
      UPDATE users 
      SET last_onboarding_reminder_at = NOW(), 
          onboarding_reminder_count = onboarding_reminder_count + 1 
      WHERE id = ?
    `, [id]);

    console.log(`[ONBOARDING] Reminder #${type} sent to user ${id} (${full_name})`);
  } catch (err) {
    console.error(`[ONBOARDING ERROR] Failed to send reminder to user ${id}:`, err);
  }
};

module.exports = { initOnboardingReminders };
