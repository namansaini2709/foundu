const axios = require("axios");

const BASE_URL = "http://localhost:4000/api";
const PHONE = "919999999999"; // Simulated phone number
const NAME = "Test Onboarding User";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendWhatsAppMessage(text) {
  try {
    // Send mock Meta webhook payload
    const response = await axios.post(`${BASE_URL}/whatsapp/webhook`, {
      entry: [{
        changes: [{
          value: {
            contacts: [{ profile: { name: NAME }, wa_id: PHONE }],
            messages: [{
              from: PHONE,
              text: { body: text },
              type: "text",
              timestamp: String(Math.floor(Date.now() / 1000))
            }]
          },
          field: "messages"
        }]
      }],
      object: "whatsapp_business_account"
    });
    console.log(`[Sent text]: "${text}"`);
    await sleep(2500); // Wait for the backend step/embedding generation to finish
  } catch (error) {
    console.error(`[Error sending "${text}"]:`, error.message);
  }
}

async function simulate() {
  console.log("=== 🚀 SIMULATING WHATSAPP ONBOARDING ENGINE ===");
  
  // 1. Initial greeting message (creates session, prompts for role)
  console.log("\nStep 1: Greeting message...");
  await sendWhatsAppMessage("Hello! I want to join FoundU");
  
  // 2. Select Freelancer role
  console.log("\nStep 2: Selecting Freelancer role (Choice 1)...");
  await sendWhatsAppMessage("1");
  
  // 3. Provide Name
  console.log("\nStep 3: Providing Name...");
  await sendWhatsAppMessage("Jane Freelancer");
  
  // 4. Provide Email
  console.log("\nStep 4: Providing Email...");
  await sendWhatsAppMessage("jane.free@example.com");
  
  // 5. Provide Portfolio link
  console.log("\nStep 5: Providing Portfolio Link...");
  await sendWhatsAppMessage("github.com/janefree");
  
  // 6. Provide Skills
  console.log("\nStep 6: Providing Core Skills...");
  await sendWhatsAppMessage("React, Node.js, Stripe, PostgreSQL");
  
  // 7. Provide Preferred Tech Stack
  console.log("\nStep 7: Providing Tech Stack...");
  await sendWhatsAppMessage("MERN Stack, Postgres");
  
  // 8. Provide Domain Expertise
  console.log("\nStep 8: Providing Domain...");
  await sendWhatsAppMessage("FinTech, E-Commerce");
  
  // 9. Provide Years of Experience
  console.log("\nStep 9: Providing Experience...");
  await sendWhatsAppMessage("4 years");
  
  // 10. Provide Expected Monthly Budget
  console.log("\nStep 10: Providing Budget Expectations...");
  await sendWhatsAppMessage("₹60,000/mo");
  
  // 11. Provide Resume Text (Completes onboarding, registers user, generates embedding!)
  console.log("\nStep 11: Pasting Resume text (completing onboarding)...");
  await sendWhatsAppMessage("Experienced fullstack JavaScript developer who has built 5 fintech products with Stripe payment gateway integrations.");
  
  console.log("\n=== 🎉 Onboarding Simulation Completed successfully! ===");
  console.log("Check the database users and freelancer_profiles tables for user 'jane.free@example.com'!");
  process.exit(0);
}

simulate();
