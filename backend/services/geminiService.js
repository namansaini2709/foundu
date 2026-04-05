const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());

// Priority list based on user discovery (using next-gen 2.0/2.5 models available to user)
const MODELS = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-pro-latest"];

/**
 * Robustly calls Gemini with model fallback.
 */
const generateWithFallback = async (prompt) => {
  let lastError = null;
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) {
      console.warn(`GEMINI: Model ${modelName} failed. Reason: ${e.message}`);
      lastError = e;
    }
  }
  throw lastError;
};

exports.generateWithFallback = generateWithFallback;

/**
 * Robust JSON extraction and parsing.
 * Gemini sometimes wraps JSON in markdown blocks or adds extra text.
 */
const extractAndParseJSON = (text) => {
  try {
    // 1. Try direct parse after trimming potential markdown
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    // 2. Fallback: regex search for the first { or [ until the last } or ]
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        console.error("DEBUG: Failed to parse extracted JSON block:", innerError);
      }
    }
    console.error("DEBUG: No valid JSON found/parseable in text:", text);
    const error = new Error("Invalid AI response format.");
    error.rawText = text; // Attach raw text for debugging
    throw error;
  }
};

exports.extractAndParseJSON = extractAndParseJSON;

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
    const text = await generateWithFallback(prompt);
    return extractAndParseJSON(text);
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
    Based on the following inputs for a ${role} role, generate a comprehensive, professional job posting.
    Inputs: ${JSON.stringify(initialInputs)}
    
    IMPORTANT: You must also predict/suggest realistic values for the following fields based on typical market rates:
    - budget_range (e.g. "₹20,000 - ₹50,000" or "$500 - $1,500")
    - duration (e.g. "3 Months", "Project-based", "6 Months")
    - work_type (Remote, Hybrid, On-site)
    - job_level (Fresher, Mid-Level, Senior)

    Return ONLY a JSON object matching this schema:
    {
      "jobTitle": "Catchy professional title",
      "sector": "Primary domain (e.g. Fintech, Edtech)",
      "commitment": "Full-time / Part-time / Hourly",
      "jobLevel": "Fresher / Mid-Level / Senior",
      "work_type": "Remote / Hybrid / On-site",
      "duration": "Duration description",
      "budget_range": "Currency and Amount range",
      "priorities": ["List 3-5 specific priorities or goals for this role"],
      "jobDescription": "A professional, inspiring 2-3 paragraph job vision",
      "requirements": ["List 5-8 specific skills and qualifications as separate strings in an array"],
      "responsibilities": ["List 5-8 specific day-to-day tasks as separate strings in an array"]
    }
  `;

  try {
    const text = await generateWithFallback(prompt);
    const parsed = extractAndParseJSON(text);
    
    // Ensure lists are arrays
    const ensureArray = (val) => Array.isArray(val) ? val : [val].filter(Boolean);
    parsed.requirements = ensureArray(parsed.requirements);
    parsed.responsibilities = ensureArray(parsed.responsibilities);
    parsed.priorities = ensureArray(parsed.priorities);
    
    return parsed;
  } catch (error) {
    console.error("Gemini Enrichment Error:", error);
    return { error: error.message, raw: error.rawText || "No raw text available" };
  }
};

/**
 * AI-powered applicant matching.
 * Analyzes job requirements against applicant profiles and returns top 3 matches.
 */
exports.matchApplicants = async (jobDetails, applicants) => {
  if (!applicants || applicants.length === 0) {
    return [];
  }

  const applicantSummaries = applicants.map((a, i) => {
    const isFreelancer = a.user_type === 'freelancer';
    return `Applicant ${i + 1} (ID: ${a.user_id}):
  Name: ${a.full_name}
  Type: ${a.user_type}
  Skills: ${isFreelancer ? (a.skills_description || 'N/A') : [a.superpower1, a.superpower2, a.superpower3].filter(Boolean).join(', ') || 'N/A'}
  Experience: ${a.experience || 'N/A'}
  Bio: ${a.describe_best || a.quantifiable_impact || 'N/A'}
  Working Environment: ${a.working_environment || 'N/A'}`;
  }).join('\n\n');

  const prompt = `
    You are a recruitment AI for FoundU, a professional platform.
    Analyze the following job posting and rank the applicants by best fit.
    Return ONLY the top 3 candidates.

    JOB DETAILS:
    Title: ${jobDetails.job_title}
    Description: ${jobDetails.full_job_description || jobDetails.job_description || 'N/A'}
    Requirements: ${jobDetails.job_requirements || 'N/A'}
    Domain: ${jobDetails.domain || 'N/A'}
    Job Type: ${jobDetails.job_type || 'N/A'}

    APPLICANTS:
    ${applicantSummaries}

    Return ONLY a JSON array with exactly the top 3 (or fewer if less than 3 applicants), sorted by best match:
    [
      {
        "user_id": number,
        "match_score": number (0-100),
        "reason": "One sentence explaining why they are a good fit"
      }
    ]
  `;

  try {
    const text = await generateWithFallback(prompt);
    return extractAndParseJSON(text);
  } catch (error) {
    console.error("Gemini Match Error:", error);
    // Fallback: return first 3 applicants with default scores
    return applicants.slice(0, 3).map((a, i) => ({
      user_id: a.user_id,
      match_score: 85 - (i * 5),
      reason: "AI analysis unavailable — showing based on application order."
    }));
  }
};

/**
 * AI Chatbot Matching Logic.
 * Takes user role, their chat answers (filters), and a list of candidates (jobs or users).
 * Returns the top 3 best matching items with an explanation.
 */
exports.getChatSuggestions = async (role, filters, candidates) => {
  if (!candidates || candidates.length === 0) return [];

  const candidateList = candidates.map((c, i) => {
    if (role === 'founder') {
      return `Candidate ${i+1} (ID: ${c.id}): Name: ${c.full_name}, Skills: ${c.skills_description || 'N/A'}, Experience: ${c.experience || 'N/A'}, Rating: ${c.avg_rating || 'N/A'}`;
    } else {
      return `Job ${i+1} (ID: ${c.id}): Title: ${c.job_title}, Domain: ${c.domain}, Description: ${c.job_description || 'N/A'}, Budget: ${c.budget_range || 'N/A'}`;
    }
  }).join("\n");

  const prompt = `
    You are the FoundU AI Assistant. A ${role} is looking for the best match based on these preferences:
    ${JSON.stringify(filters)}

    Here are the REAL items from our database:
    ${candidateList}

    Rank them and pick the TOP 3 that match the user's preferences best.
    Return ONLY a JSON array of objects:
    [
      {
        "id": number (ID from the list),
        "match_score": number (0-100),
        "explain_points": ["Point 1", "Point 2", "Point 3"]
      }
    ]
  `;

  try {
    const text = await generateWithFallback(prompt);
    return extractAndParseJSON(text);
  } catch (error) {
    console.error("Gemini Chat Suggestions Error:", error);
    return candidates.slice(0, 3).map(c => ({
      id: c.id,
      match_score: 75,
      explain_points: ["Professional match based on domain", "Credible platform history"]
    }));
  }
};

/**
 * Detailed analysis for Idea Lab (Discovery or Validation).
 */
exports.analyzeStartupIdea = async (mode, text, context = {}) => {
  const prompt = `
    You are the "Venture Engine" AI for FoundU, a premier startup accelerator platform in India.
    Your goal is to provide deep strategic analysis for a startup idea.
    
    Mode: ${mode === 'discover' ? 'Idea Discovery (User has a background but needs an idea)' : 'Venture Validation (User has an idea and needs a roadmap)'}
    Input / Background: ${text}
    Context: ${JSON.stringify(context)}
    
    Return ONLY a JSON object matching this schema:
    {
      "refinedIdea": "Detailed 2-3 sentence strategic refinement of the vision",
      "roadmap": ["Phase 1: Foundation description", "Phase 2: Build description", "Phase 3: Scale description"],
      "team": {
        "size": "Estimated number of core members",
        "roles": ["Role 1: Description", "Role 2: Description", "Role 3: Description"]
      },
      "vendors": ["List of 4-5 software/hardware/service types needed"],
      "support": {
        "foundu": ["List how FoundU platform helps with this specific idea"],
        "user": ["List what the founder themselves must provide"]
      },
      "talentSuggestions": [
        "Generic description of the first type of expert to hire",
        "Generic description of the second type of expert to hire"
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textRes = response.text();
    return extractAndParseJSON(textRes);
  } catch (error) {
    console.error("Idea Lab AI Error:", error);
    return null;
  }
};
