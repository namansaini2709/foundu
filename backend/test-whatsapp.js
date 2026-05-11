require("dotenv").config();
const whatsappService = require("./services/whatsappService");

async function runTest() {
    console.log("🚀 Starting WhatsApp API Test...");
    
    // Replace this with your actual WhatsApp number for testing
    // Must include country code without '+' (e.g., 919318480126)
    const testNumber = "919318480126"; 
    const userName = "Devansh";

    const customMessage = `🌟 *Success! FoundU WhatsApp API is LIVE* 🌟\n\nHi ${userName},\n\nIf you are reading this, your Meta WhatsApp Business API integration and payment setup are working perfectly!\n\n🚀 *What's next?*\nYour users will now receive daily job alerts directly on their phones.\n\nKeep building! 🚀`;

    console.log(`📡 Sending test message to: ${testNumber}...`);
    
    const result = await whatsappService.sendWhatsAppMatchAlert(
        testNumber,
        userName,
        [],
        customMessage
    );

    if (result.success) {
        console.log("✅ SUCCESS! Check your WhatsApp.");
    } else {
        console.log("❌ FAILED!");
        console.log("Error Details:", result.error);
    }
}

runTest();
