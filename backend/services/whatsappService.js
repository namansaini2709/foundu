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
            console.error("❌ Meta WhatsApp API credentials (META_ACCESS_TOKEN / META_PHONE_NUMBER_ID) missing in .env");
            return;
        }

        // 1. Format the phone number (strip spaces/dashes, ensure country code)
        let formattedTo = to.replace(/\D/g, "");
        if (!formattedTo.startsWith("91") && formattedTo.length === 10) {
            formattedTo = "91" + formattedTo;
        }

        // 2. Prepare Template Parameters
        const isFounder = !!(userName && matches.some(m => m.candidate_name));
        
        let waMatches = matches.map((m, i) => {
            const title = isFounder ? `Talent: ${m.candidate_name}` : `Job: ${m.job_title}`;
            const company = isFounder ? `(${m.role})` : `@ ${m.startup_name}`;
            return `[${i+1}] ${title} ${company} - ${m.reason}`;
        }).join(' | ');

        // 3. Send via Meta API (Template)
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedTo,
                type: "template",
                template: {
                    name: "foundu_match_alert",
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: userName.split(" ")[0] }, // {{1}} - First Name
                                { type: "text", text: isFounder ? "profiles" : "jobs" }, // {{2}} - Category
                                { type: "text", text: waMatches } // {{3}} - Match List
                            ]
                        }
                    ]
                }
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

/**
 * Send a direct text message via WhatsApp
 */
const sendWhatsAppDirectMessage = async (to, message) => {
    try {
        const accessToken = process.env.META_ACCESS_TOKEN;
        const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) return { success: false, error: "Credentials missing" };

        let formattedTo = to.replace(/\D/g, "");
        if (!formattedTo.startsWith("91") && formattedTo.length === 10) {
            formattedTo = "91" + formattedTo;
        }

        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedTo,
                type: "text",
                text: { preview_url: true, body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        console.error("❌ WhatsApp Direct Message Error:", error.response ? error.response.data : error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send a Template message via WhatsApp
 */
const sendWhatsAppTemplate = async (to, templateName, components = []) => {
    try {
        const accessToken = process.env.META_ACCESS_TOKEN;
        const phoneNumberId = process.env.META_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) return { success: false, error: "Credentials missing" };

        let formattedTo = to.replace(/\D/g, "");
        if (!formattedTo.startsWith("91") && formattedTo.length === 10) {
            formattedTo = "91" + formattedTo;
        }

        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedTo,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: "en_US" },
                    components: [
                        {
                            type: "body",
                            parameters: components.map(val => ({ type: "text", text: val }))
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        console.error("❌ WhatsApp Template Error:", error.response ? error.response.data : error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { 
    sendWhatsAppMatchAlert, 
    sendWhatsAppDirectMessage,
    sendWhatsAppTemplate 
};
