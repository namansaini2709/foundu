require("dotenv").config();

const db = require("../config/db");
const { processMessage } = require("../services/whatsappOnboardingService");

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDemo() {
  const phone = (process.env.TEST_WHATSAPP_RECIPIENT || "").replace(/\D/g, "");
  if (!phone) {
    throw new Error("Set TEST_WHATSAPP_RECIPIENT to your allowed Meta test phone number.");
  }

  const demoEmail = `whatsapp.demo.${Date.now()}@example.com`;
  const answers = [
    "Hi",
    "3",
    "FoundU WhatsApp Demo",
    demoEmail,
    "FoundU Live Demo",
    "An early-stage collaboration platform matching startup founders with skilled talent.",
    "One full-stack developer and one product designer.",
    "INR 50,000 per month",
  ];

  console.log(`Starting WhatsApp onboarding demo for ${phone}.`);
  console.log(`Demo email: ${demoEmail}`);

  for (const message of answers) {
    await processMessage(phone, "FoundU Demo", message);
    await pause(1250);
  }

  console.log("WhatsApp onboarding demo submitted.");
  await db.pool.end();
}

runDemo().catch(async (error) => {
  console.error("WhatsApp onboarding demo failed:", error.message);
  await db.pool.end();
  process.exitCode = 1;
});
