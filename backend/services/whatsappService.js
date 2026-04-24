const axios = require("axios");

/**
 * Send WhatsApp Match Alerts or Broadcasts via Meta WhatsApp Cloud API
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} userName - Name of the recipient
 * @param {Array} matches - Array of job match objects
 * @param {string} customMessage - (Optional) Pre-formatted message (e.g., from AI or Admin)
 */
const sendWhatsAppMatchAlert = async (to, userName, matches, customMessage = "") => {
    try {
        const accessToken = process.env.META_ACCESS_TOKEN;
        const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) {
            console.error("❌ Meta WhatsApp API credentials missing in .env");
            return;
        }

        // 1. Format the phone number (strip spaces/dashes, ensure country code)
        let formattedTo = to.replace(/\D/g, "");
        if (!formattedTo.startsWith("91") && formattedTo.length === 10) {
            formattedTo = "91" + formattedTo;
        }

        // 2. Prepare the Message Body
        let messageText = "";
        if (customMessage) {
            messageText = customMessage;
        } else {
            const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME);
            const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

            messageText = `🎯 *FoundU Match Alert!*\nHi ${userName}, our AI found ${matches.length} new jobs that perfectly fit your skills:\n\n`;
            matches.forEach((m, index) => {
                messageText += `*${index + 1}. ${m.job_title} @ ${m.startup_name}*\n`;
                messageText += `💡 _${m.reason}_\n`;
                messageText += `🔗 Apply: ${baseUrl}/job/${m.job_id}\n\n`;
            });
            messageText += `_Don't want these alerts? Update preferences in your dashboard._`;
        }

        // 3. Send via Meta API
        const response = await axios.post(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedTo,
                type: "text",
                text: {
                    preview_url: true,
                    body: messageText,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(`✅ WhatsApp sent via Meta to ${formattedTo}:`, response.data);
        return { success: true, data: response.data };

    } catch (error) {
        console.error("❌ WhatsApp Meta API Error:", error.response ? error.response.data : error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendWhatsAppMatchAlert };
