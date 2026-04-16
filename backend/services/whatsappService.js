const twilio = require('twilio');

let client = null;

const initTwilio = () => {
    // We will initialize this once the env keys are ready
    if (!client && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    return client;
};

/**
 * Formats AI matches and sends them to the user's WhatsApp
 * @param {string} toPhoneNumber - The recipient's number
 * @param {string} userName - The recipient's name
 * @param {Array} matches - The matches found by Gemini
 * @param {string} customMessage - (Optional) Fully formatted message string
 */
const sendWhatsAppMatchAlert = async (toPhoneNumber, userName, matches, customMessage = null) => {
    try {
        const twilioClient = initTwilio();
        if (!twilioClient) {
            console.error("❌ Twilio is not configured. Missing credentials in .env");
            return false;
        }

        // Format phone number string (Twilio requires the country code + prefix)
        const formattedPhone = toPhoneNumber.startsWith('+') ? toPhoneNumber : `+${toPhoneNumber}`;

        // Prepare the text content
        let textMessage = "";

        if (customMessage) {
            // Use the pre-formatted message from the engine
            textMessage = customMessage;
        } else {
            // Fallback: Default Job Alert format
            textMessage = `🎯 *FoundU Match Alert!*\nHi ${userName}, our AI found ${matches.length} new jobs that perfectly fit your skills:\n\n`;

            const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_NAME);
            const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

            matches.forEach((m, index) => {
                textMessage += `*${index + 1}. ${m.job_title} @ ${m.startup_name}*\n`;
                textMessage += `💡 _${m.reason}_\n`;
                textMessage += `🔗 Apply: ${baseUrl}/job/${m.job_id}\n\n`;
            });

            textMessage += `_Don't want these alerts? Update preferences in your dashboard._`;
        }

        // 2. Trigger the Twilio Message API
        const response = await twilioClient.messages.create({
            body: textMessage,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, 
            to: `whatsapp:${formattedPhone}`
        });

        console.log(`✅ WhatsApp sent successfully to ${formattedPhone}! SID: ${response.sid}`);
        return true;

    } catch (error) {
        console.error("❌ WhatsApp Error:", error);
        return false;
    }
};

module.exports = { sendWhatsAppMatchAlert };
