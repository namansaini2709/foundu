const db = require("../config/db");
const mailService = require("./mailService");

/**
 * Generate a professional HTML email template
 */
const generateTemplate = (title, message, actionText = null, actionLink = null) => {
  const accentColor = "#3b82f6"; // FoundU Blue
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .header { background: #000000; padding: 30px; text-align: center; }
        .header h1 { color: #3b82f6; margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header span { color: #ffffff; font-weight: normal; }
        .content { padding: 40px; }
        .content h2 { color: #111827; margin-top: 0; font-size: 22px; }
        .content p { color: #4b5563; font-size: 16px; margin-bottom: 25px; }
        .button { display: inline-block; padding: 12px 24px; background-color: ${accentColor}; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.foundu.in/whitelogo.png" alt="FoundU Logo" style="width: 150px; height: auto;" />
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>${message}</p>
          ${actionText && actionLink ? `<a href="${actionLink}" class="button">${actionText}</a>` : ""}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} FoundU. All rights reserved.</p>
          <p>You received this email because of activity on your account.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Central function to send themed email notifications
 */
exports.sendEmailNotification = async (userId, title, message, actionText = null, actionLink = null) => {
  try {
    // 1. Fetch user email
    const [rows] = await db.promise().query("SELECT email, full_name FROM users WHERE id = ?", [userId]);
    if (!rows.length) return;

    const userEmail = rows[0].email;
    const userName = rows[0].full_name;
    const personalizedMessage = userName ? `Hi ${userName},<br><br>${message}` : message;

    // 2. Generate HTML
    const htmlBody = generateTemplate(title, personalizedMessage, actionText, actionLink);

    // 3. Send via mailService
    await mailService.sendEmail(userEmail, `${title} | FoundU`, message, htmlBody);
    console.log(`Email notification sent to ${userEmail}: ${title}`);
  } catch (err) {
    console.error("Error in sendEmailNotification:", err);
  }
};
