const axios = require("axios");
require("dotenv").config();

async function testWhatsAppTemplate() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const testRecipient = process.env.TEST_WHATSAPP_RECIPIENT;
    const graphApiVersion = process.env.META_GRAPH_API_VERSION || "v26.0";

    if (!accessToken || !phoneNumberId || !testRecipient) {
        throw new Error("Set META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, and TEST_WHATSAPP_RECIPIENT before running this test.");
    }

    console.log("🚀 Starting WhatsApp TEMPLATE Test...");
    console.log(`📡 Sending 'hello_world' template to: ${testRecipient}...`);

    try {
        const response = await axios.post(
            `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: testRecipient,
                type: "template",
                template: {
                    name: "hello_world",
                    language: {
                        code: "en_US"
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ SUCCESS! Template sent.", response.data);
    } catch (error) {
        console.error("❌ WhatsApp Template Error:", error.response ? error.response.data : error.message);
    }
}

testWhatsAppTemplate();
