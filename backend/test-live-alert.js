const axios = require("axios");
require("dotenv").config();

async function testMatchAlertTemplate() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const testRecipient = process.env.TEST_WHATSAPP_RECIPIENT;
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || "v26.0";

    if (!accessToken || !phoneNumberId || !testRecipient) {
        throw new Error("Set META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, and TEST_WHATSAPP_RECIPIENT before running this test.");
    }

    console.log("🚀 Starting LIVE WhatsApp Template Test...");
    console.log(`📡 Sending 'foundu_match_alert' to: ${testRecipient}...`);

    const waMatches = "[1] MERN Dev @ T-Corp - Great fit | [2] PM @ FoundU - Strong match";

    try {
        const response = await axios.post(
            `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
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
