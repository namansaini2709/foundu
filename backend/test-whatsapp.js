const axios = require("axios");
require("dotenv").config();

async function testWhatsApp() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const testRecipient = "919625207157"; // The new number you provided

    console.log("🚀 Starting WhatsApp API Test...");
    console.log(`📡 Sending test message to: ${testRecipient}...`);

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: testRecipient,
                type: "text",
                text: {
                    preview_url: true,
                    body: "Hello! This is a test message from your FoundU WhatsApp API. 🚀",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ SUCCESS! Message sent.", response.data);
    } catch (error) {
        console.error("❌ WhatsApp Meta API Error:", error.response ? error.response.data : error.message);
        
        if (error.response && error.response.data.error.code === 131030) {
            console.log("\n💡 TIP: You might need to use a TEMPLATE because the 24-hour window is closed.");
            console.log("Or, send a message FROM 9625207157 TO your bot first to open the window!");
        }
    }
}

testWhatsApp();
