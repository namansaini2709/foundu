const axios = require("axios");
require("dotenv").config();

async function registerNumber() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const pin = "123456"; // REPLACE THIS with a secret 6-digit PIN of your choice

    console.log("🚀 Attempting to register phone number...");

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/register`,
            {
                messaging_product: "whatsapp",
                pin: pin,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Registration Successful!", response.data);
        console.log("\nNow try running your test-whatsapp.js script again!");
    } catch (error) {
        console.error("❌ Registration Failed:", error.response ? error.response.data : error.message);
    }
}

registerNumber();
