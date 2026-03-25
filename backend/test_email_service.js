require('dotenv').config();
const emailNotificationService = require('./services/emailNotificationService');

async function testEmailService() {
    try {
        console.log("Testing email notification service...");
        // Assuming user ID 1 exists, change to a known ID if needed
        await emailNotificationService.sendEmailNotification(1, "Test Notification", "This is a test message.", "Click Here", "http://localhost:5173");
        console.log("Test finished.");
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testEmailService();
