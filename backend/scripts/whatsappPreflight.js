require("dotenv").config();

const axios = require("axios");
const db = require("../config/db");

const required = [
  "DATABASE_URL",
  "META_ACCESS_TOKEN",
  "META_PHONE_NUMBER_ID",
  "WHATSAPP_VERIFY_TOKEN",
  "TEST_WHATSAPP_RECIPIENT",
];

async function check() {
  const valueFor = (key) => process.env[key]?.trim();
  const missing = required.filter((key) => !valueFor(key));
  if (missing.length) console.error(`Missing configuration: ${missing.join(", ")}`);

  const testRecipient = valueFor("TEST_WHATSAPP_RECIPIENT");
  if (testRecipient && !/^\d{10,15}$/.test(testRecipient.replace(/\D/g, ""))) {
    console.error("TEST_WHATSAPP_RECIPIENT must contain a valid phone number with country code.");
  }

  try {
    await db.pool.query("SELECT 1");
    console.log("Database: OK");
  } catch (error) {
    console.error(`Database: FAILED (${error.code || error.message})`);
  }

  if (!valueFor("META_ACCESS_TOKEN") || !valueFor("META_PHONE_NUMBER_ID") || missing.length) {
    await db.pool.end();
    process.exitCode = 1;
    return;
  }

  try {
    const version = valueFor("META_GRAPH_API_VERSION") || "v26.0";
    await axios.get(
      `https://graph.facebook.com/${version}/${valueFor("META_PHONE_NUMBER_ID")}`,
      {
        params: { fields: "id" },
        headers: { Authorization: `Bearer ${valueFor("META_ACCESS_TOKEN")}` },
        timeout: 15_000,
      },
    );
    console.log("Meta credentials: OK");
  } catch (error) {
    const metaError = error.response?.data?.error;
    console.error(`Meta credentials: FAILED (${metaError?.code || error.code || error.message})`);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
}

check();
