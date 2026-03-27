const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
  console.log("Testing Gemini API...");
  console.log("API Key found:", process.env.GEMINI_API_KEY ? "YES" : "NO");
  
  try {
    const result = await model.generateContent("Say 'AI is working'");
    const response = await result.response;
    console.log("Response:", response.text());
    process.exit(0);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    process.exit(1);
  }
}

test();
