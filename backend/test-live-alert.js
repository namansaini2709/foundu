const axios = require("axios");
require("dotenv").config();

async function testMatchAlertTemplate() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const testRecipient = "919311293521"; // Unverified test number

    console.log("🚀 Starting LIVE WhatsApp Template Test...");
    console.log(`📡 Sending 'foundu_match_alert' to: ${testRecipient}...`);

    const waMatches = "[1] MERN Dev @ T-Corp - Great fit | [2] PM @ FoundU - Strong match";

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: testRecipient,
                type: "template",
                template: {
                    name: "foundu_match_alert",
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: "Devansh" },     // {{1}}
                                { type: "text", text: "2" },           // {{2}}
                                { type: "text", text: waMatches }      // {{3}}
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

        console.log("✅ SUCCESS! Live Match Alert template sent.", response.data);
    } catch (error) {
        console.error("❌ WhatsApp Template Error:", error.response ? error.response.data : error.message);
        if (error.response?.data?.error?.error_data?.details) {
            console.error("🔍 Details:", error.response.data.error.error_data.details);
        }
    }
}

testMatchAlertTemplate();
