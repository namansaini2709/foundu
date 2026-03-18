const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-1.5-flash which is the most common model for free tier
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyzes review sentiment and quality to help determine credibility.
 * Returns a score between 0-100 and a qualitative summary.
 */
exports.analyzeReviews = async (reviews) => {
  if (!reviews || reviews.length === 0) {
    return { qualityScore: 0, summary: "No reviews to analyze." };
  }

  const reviewText = reviews.map(r => `[${r.stars} Stars]: ${r.review_text}`).join("\n");
  
  const prompt = `
    Analyze the following reviews for a freelancer/cofounder on a professional platform.
    Calculate a "Trust & Quality Score" from 0-100.
    Consider:
    1. Sentiment: Are the specific praises genuine and substantial?
    2. Consistency: Do the star ratings match the text?
    3. Red Flags: Detect any potential bot-like or repetitive feedback.
    
    Reviews:
    ${reviewText}
    
    Return ONLY a JSON object in this format:
    {
      "qualityScore": number,
      "summary": "Short 1-sentence summary of overall reputation",
      "sentiment": "Positive/Neutral/Negative"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean potential markdown code blocks
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("DEBUG: Gemini Analysis Error Stack:", error);
    console.error("DEBUG: Gemini Error Message:", error.message);
    return { qualityScore: 50, summary: "Analysis unavailable. Check backend logs for API errors.", sentiment: "Neutral" };
  }
};

/**
 * Enriches job details for QuickHire AI.
 */
exports.enrichJobDetails = async (role, initialInputs) => {
  const prompt = `
    You are an expert recruitment assistant for a startup platform called FoundU.
    Based on the following inputs for a ${role} role, generate a comprehensive job posting.
    Inputs: ${JSON.stringify(initialInputs)}
    
    Return a JSON object matching this schema:
    {
      "jobTitle": "Catchy professional title",
      "sector": "Primary domain",
      "commitment": "Full-time / Part-time / Contract / Hourly",
      "jobLevel": "Fresher / Mid / Senior / Lead",
      "priorities": "Top 3 priorities for this role",
      "jobDescription": "Detailed AI-optimized job vision/description",
      "requirements": "Key skills and qualifications",
      "responsibilities": "What they will be doing"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    return null;
  }
};
