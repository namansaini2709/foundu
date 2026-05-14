const axios = require("axios");
require("dotenv").config();

async function testWhatsAppTemplate() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const testRecipient = "919625207157"; 

    console.log("🚀 Starting WhatsApp TEMPLATE Test...");
    console.log(`📡 Sending 'hello_world' template to: ${testRecipient}...`);

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
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
