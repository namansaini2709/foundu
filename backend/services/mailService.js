const transporter = require("../config/mail");
const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send an email using standard SMTP or Resend API.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 */
const sendEmail = async (to, subject, text, html = "") => {
    try {
        if (resend) {
            console.log("[MAIL] Using Resend API to send email...");
            const { data, error } = await resend.emails.send({
                from: "FoundU <noreply@foundu.in>", // Custom domain sender
                to,
                subject,
                text,
                html,
            });

            if (error) throw error;
            console.log("Email sent via Resend:", data.id);
            return data;
        }

        // Fallback to Nodemailer (for local development)
        console.log("[MAIL] Using Nodemailer SMTP to send email...");
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent via SMTP: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email! DETAILS:", error);
        throw error;
    }
};

module.exports = {
    sendEmail,
};
