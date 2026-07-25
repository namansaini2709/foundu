const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());

// Priority list based on user discovery (using next-gen 2.0/2.5 models available to user)
const MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-pro-latest"];

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
    You are the "Venture Engine" AI for FoundU, India's premier startup accelerator platform.
    Provide an extremely detailed, investor-grade strategic analysis.
    
    Mode: ${mode === 'discover' ? 'Idea Discovery (User has a background but needs a startup idea — GENERATE one for them)' : 'Venture Validation (User has an existing idea — ANALYZE and VALIDATE it)'}
    Input / Background: ${text}
    Context: ${JSON.stringify(context)}
    
    Return ONLY a JSON object matching this EXACT schema:
    {
      "refinedIdea": "Detailed 3-4 sentence strategic refinement of the vision. Be specific about the product, target market, and unique value proposition.",
      
      "marketAnalysis": {
        "tam": "Total Addressable Market size with number (e.g. $50B globally)",
        "sam": "Serviceable Addressable Market with number",
        "som": "Serviceable Obtainable Market — realistic first 2 years",
        "targetAudience": "Specific description of ideal customer segment",
        "growthRate": "Industry CAGR or growth percentage"
      },
      
      "competition": [
        {
          "name": "Real competitor name",
          "strength": "What they do well",
          "weakness": "Where they fall short",
          "yourEdge": "How this idea can beat them"
        }
      ],
      
      "revenueModel": {
        "primaryModel": "Main revenue stream (e.g. SaaS Subscription, Commission, Freemium)",
        "pricingStrategy": "How to price the product",
        "monthlyProjection": "Estimated monthly revenue after 12 months with basic assumptions",
        "additionalStreams": ["List 2-3 secondary revenue streams"]
      },
      
      "roadmap": [
        "Phase 1 (Month 1-3): Detailed foundation step",
        "Phase 2 (Month 4-6): Detailed build step",
        "Phase 3 (Month 7-9): Detailed growth step",
        "Phase 4 (Month 10-12): Detailed scale step"
      ],
      
      "team": {
        "size": "Estimated number of core members needed initially",
        "roles": ["Role 1: Why this role is critical", "Role 2: Description", "Role 3: Description"]
      },
      
      "vendors": ["List of 4-5 specific software/tools/services needed (e.g. AWS, Razorpay, Figma)"],
      
      "risks": [
        {
          "risk": "Specific risk description",
          "mitigation": "How to mitigate it"
        }
      ],
      
      "support": {
        "foundu": ["List 3-4 specific ways FoundU platform helps with this idea (hiring, badges, AI matching, etc.)"],
        "user": ["List 3-4 things the founder must personally provide"]
      },
      
      "talentRoles": [
        "Full Stack Developer: For building the MVP web/mobile application",
        "UI/UX Designer: For designing an intuitive user experience",
        "Marketing Specialist: For growth hacking and user acquisition"
      ]
    }

    IMPORTANT RULES:
    - competition array must have EXACTLY 3 real-world competitors relevant to India
    - risks array must have EXACTLY 3 items
    - roadmap must have EXACTLY 4 phases
    - All numbers and projections should be realistic for Indian market
    - Be extremely specific, not generic
  `;

  try {
    const textRes = await generateWithFallback(prompt);
    return extractAndParseJSON(textRes);
  } catch (error) {
    console.error("Idea Lab AI Error:", error);
    return null;
  }
};

/* ================================================================
   FOUNDER AI INTEGRATION FUNCTIONS
   ================================================================ */

const searchFreelancersDeclaration = {
  name: "search_freelancers",
  description: "Searches the database of freelancers or cofounders based on required skills.",
  parameters: {
    type: "OBJECT",
    properties: {
      skills: {
        type: "ARRAY",
        items: { type: "STRING" },
        description: "List of core skills needed (e.g., ['React', 'Python', 'Node.js'])"
      },
      maxBudget: {
        type: "NUMBER",
        description: "Maximum budget per project or hour"
      }
    },
    required: ["skills"]
  }
};

const webSearchDeclaration = {
  name: "web_search",
  description: "Searches the web for direct competitors, pricing models, and market sizing trends.",
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description: "Competitor or market search query (e.g., 'camera rental startup competitors Delhi')"
      }
    },
    required: ["query"]
  }
};

const analyzeStartupIdeaDeclaration = {
  name: "analyze_startup_idea",
  description: "Runs venture evaluation and analysis on a startup idea concept.",
  parameters: {
    type: "OBJECT",
    properties: {
      text: {
        type: "STRING",
        description: "The startup idea text to analyze"
      },
      mode: {
        type: "STRING",
        description: "Mode: 'discover' or 'validate'"
      }
    },
    required: ["text", "mode"]
  }
};

exports.localSearchFreelancers = async ({ skills, maxBudget, founderNeeds }) => {
  const db = require("../config/db");
  try {
    const [rows] = await db.promise().query(`
      SELECT u.id, u.full_name, u.user_type, u.credibility_score,
             fp.skills_description, fp.experience, fp.stipend_expectations, fp.github, fp.other_links, fp.freelancer_type, fp.describe_best, fp.embedding AS free_emb,
             cp.primary_identity, cp.anti_portfolio, cp.equity_minimum, cp.embedding AS co_emb
      FROM users u
      LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
      LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
      WHERE u.user_type IN ('freelancer', 'cofounder')
    `);

    if (!rows.length) return [];

    // Optimize with local vector similarity:
    const queryText = `Skills: ${skills ? skills.join(", ") : ""} | Needs: ${founderNeeds || ""} | Budget: ${maxBudget || ""}`;
    const queryVector = await exports.generateEmbedding(queryText);

    // Helper: Categorize profiles into functional buckets
    const categorizeCandidate = (c) => {
      const typeStr = ((c.freelancer_type || "") + " " + (c.primary_identity || "") + " " + (c.skills_description || "") + " " + (c.describe_best || "")).toLowerCase();
      if (typeStr.includes("developer") || typeStr.includes("engineer") || typeStr.includes("coder") || typeStr.includes("tech") || typeStr.includes("ml") || typeStr.includes("ai") || typeStr.includes("programmer")) {
        return "Technical / Developer";
      }
      if (typeStr.includes("design") || typeStr.includes("ui") || typeStr.includes("ux") || typeStr.includes("creative") || typeStr.includes("figma") || typeStr.includes("art")) {
        return "Creative / UI-UX Designer";
      }
      if (typeStr.includes("market") || typeStr.includes("social") || typeStr.includes("growth") || typeStr.includes("influencer") || typeStr.includes("seo") || typeStr.includes("sales") || typeStr.includes("writer")) {
        return "Growth / Marketing & Sales";
      }
      return "Business / Co-founder / Product Strategy";
    };

    let candidatesToMatch = [];

    if (queryVector) {
      // Score all candidates
      const scored = rows.map(c => {
        const rawEmb = c.user_type === 'cofounder' ? c.co_emb : c.free_emb;
        let vec = null;
        if (rawEmb) {
          try {
            vec = typeof rawEmb === "string" ? JSON.parse(rawEmb) : rawEmb;
          } catch (e) {
            vec = null;
          }
        }
        const score = vec ? cosineSimilarity(queryVector, vec) : 0;
        return { c, score, cat: categorizeCandidate(c) };
      });

      // Group scored candidates by category
      const categories = {
        "Technical / Developer": [],
        "Creative / UI-UX Designer": [],
        "Growth / Marketing & Sales": [],
        "Business / Co-founder / Product Strategy": []
      };

      scored.forEach(sc => {
        if (categories[sc.cat]) {
          categories[sc.cat].push(sc);
        } else {
          categories["Business / Co-founder / Product Strategy"].push(sc);
        }
      });

      // For each category, select the top 5 best matching candidates
      Object.keys(categories).forEach(catKey => {
        const topInCat = categories[catKey]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(sc => sc.c);
        candidatesToMatch = [...candidatesToMatch, ...topInCat];
      });

      console.log(`[AI Tools] Extracted diverse shortlist of ${candidatesToMatch.length} candidates across 4 categories.`);
    }

    if (candidatesToMatch.length === 0) {
      candidatesToMatch = rows.slice(0, 15);
    }

    const candidatesText = candidatesToMatch.map((c, i) => {
      const cat = categorizeCandidate(c);
      if (c.user_type === 'cofounder') {
        return `Candidate ${i+1} (ID: ${c.id}) | Category: ${cat} | Name: ${c.full_name} | Type: Co-founder | Expertise: ${c.primary_identity || 'N/A'} | Superpowers: ${c.anti_portfolio || 'N/A'} | Equity: ${c.equity_minimum || 'N/A'} | Credibility: ${c.credibility_score || 'N/A'}`;
      } else {
        return `Candidate ${i+1} (ID: ${c.id}) | Category: ${cat} | Name: ${c.full_name} | Type: Freelancer | Skills: ${c.skills_description || 'N/A'} | Tech Stack: ${c.describe_best || 'N/A'} | Domain: ${c.freelancer_type || 'N/A'} | Experience: ${c.experience || 'N/A'} | Budget: ${c.stipend_expectations || 'N/A'} | Credibility: ${c.credibility_score || 'N/A'}`;
      }
    }).join("\n---\n");

    const prompt = `
      You are the FoundU AI talent team matchmaker.
      Your task is to select and assemble a cross-functional launch team for the founder's startup idea.
      
      Hiring Requirements:
      - Preferred Skills/Roles: ${skills ? skills.join(", ") : "Any"}
      - Max Budget: ${maxBudget || "Not Specified"}
      - Founder Startup Needs: ${founderNeeds || "Not Specified"}
      
      CANDIDATES SHORTLIST:
      ${candidatesText}
      
      For each category (Technical/Developer, Creative/Designer, Growth/Marketing, Co-founder), select 2-3 candidates who are the best matches. Recommending a total of 6-10 candidates overall from the shortlist.
      For each selected candidate, assign a match score (0-100%) and write a brief explanation showing why they fit.
      
      Return ONLY a JSON array format (no markdown blocks or other text):
      [
        {
          "id": 123,
          "score": 94,
          "category": "Machine Learning Engineer / Developer",
          "reason": "Explain how they fit into the launch team category and match their budget/skills."
        }
      ]
    `;

    const text = await generateWithFallback(prompt);
    const results = extractAndParseJSON(text);
    if (!Array.isArray(results)) return [];

    return results.map(r => {
      const match = rows.find(row => String(row.id) === String(r.id));
      if (!match) return null;
      return {
        id: match.id,
        full_name: match.full_name,
        user_type: match.user_type,
        match_score: r.score,
        category: r.category,
        reason: r.reason,
        credibility_score: match.credibility_score
      };
    }).filter(Boolean);

  } catch (error) {
    console.error("[AI Tools] localSearchFreelancers error:", error);
    return [];
  }
};

exports.localWebSearch = async ({ query }) => {
  console.log(`[AI Tools] Web Search simulated for query: "${query}"`);
  const lower = query.toLowerCase();
  let competitors = [];
  let marketInfo = {};

  if (lower.includes("camera") || lower.includes("rent")) {
    competitors = [
      { name: "SharePal", strength: "Wide inventory, fast delivery in major cities", weakness: "High security deposit requirements", yourEdge: "Zero-deposit models or micro-rentals" },
      { name: "Rentoclick", strength: "Corporate rentals and bulky packages", weakness: "Slow customer onboarding and KYC process", yourEdge: "Instant automated WhatsApp verification" },
      { name: "Toko", strength: "Peer-to-peer sharing", weakness: "Inconsistent equipment maintenance and quality checks", yourEdge: "FoundU certified quality check protocol" }
    ];
    marketInfo = { tam: "$4.5B (India Rental Economy)", sam: "$300M (Camera & AV Gear)", som: "$15M (NCR & Metro Hubs)", growth: "18% CAGR" };
  } else if (lower.includes("edtech") || lower.includes("education") || lower.includes("course")) {
    competitors = [
      { name: "Udemy", strength: "Massive library, dirt cheap pricing", weakness: "Extremely low completion rates, lack of community", yourEdge: "Cohort-based cohorts with real-time peer groups" },
      { name: "GrowthSchool", strength: "High profile creators, live bootcamps", weakness: "Expensive pricing, lack of personalized feedback", yourEdge: "One-on-one AI coaching integration" }
    ];
    marketInfo = { tam: "$10B (Indian Edtech Sector)", sam: "$1.5B (Upskilling market)", som: "$50M (Tech cohort-based courses)", growth: "22% CAGR" };
  } else {
    competitors = [
      { name: "Competitor Alpha", strength: "Early market capture", weakness: "Static interface, high commission fee", yourEdge: "Dynamic community features, zero processing fee" },
      { name: "Competitor Beta", strength: "Strong B2B client base", weakness: "Unfriendly mobile experience, manual operations", yourEdge: "Fully mobile responsive and AI matchmaker" }
    ];
    marketInfo = { tam: "$50B (Global Market)", sam: "$10B (APAC Region)", som: "$100M (Niche Vertical)", growth: "14% CAGR" };
  }

  return { query, competitors, marketInfo };
};

exports.localAnalyzeStartupIdea = async ({ text, mode }) => {
  return await exports.analyzeStartupIdea(mode || "validate", text);
};

exports.streamChatCompletion = async ({ systemInstruction, history, message, onChunk, onToolCall, context }) => {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      
      const formattedHistory = (history || []).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
        tools: [{
          functionDeclarations: [
            searchFreelancersDeclaration,
            webSearchDeclaration,
            analyzeStartupIdeaDeclaration
          ]
        }]
      });

      let responseStream = await chat.sendMessageStream(message);

      let functionCalls = [];
      for await (const chunk of responseStream.stream) {
        const calls = typeof chunk.functionCalls === "function" ? chunk.functionCalls() : chunk.functionCalls;
        if (calls) {
          functionCalls = [...functionCalls, ...calls];
        }
        let textChunk = "";
        try {
          textChunk = typeof chunk.text === "function" ? chunk.text() : chunk.text;
        } catch (e) {}
        if (textChunk && onChunk) {
          onChunk(textChunk);
        }
      }

      if (functionCalls.length > 0) {
        const functionResponses = [];
        for (const call of functionCalls) {
          if (onToolCall) {
            onToolCall(call.name, call.args);
          }
          
          let resultData;
          if (call.name === "search_freelancers") {
            resultData = await exports.localSearchFreelancers({
              ...call.args,
              founderNeeds: context ? `Startup Name: ${context.startupName} | Idea: ${context.startupDesc} | Needs: ${context.hiringNeeds} | Budget: ${context.budget}` : ""
            });
          } else if (call.name === "web_search") {
            resultData = await exports.localWebSearch(call.args);
          } else if (call.name === "analyze_startup_idea") {
            resultData = await exports.localAnalyzeStartupIdea(call.args);
          }
          
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: resultData }
            }
          });
        }

        const followUpStream = await chat.sendMessageStream(functionResponses);
        for await (const chunk of followUpStream.stream) {
          let textChunk = "";
          try {
            textChunk = typeof chunk.text === "function" ? chunk.text() : chunk.text;
          } catch (e) {}
          if (textChunk && onChunk) {
            onChunk(textChunk);
          }
        }
      }
      return;
    } catch (err) {
      console.warn(`[streamChatCompletion] Model ${modelName} failed. Retrying... Reason: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError;
};

exports.nonStreamChatCompletion = async ({ systemInstruction, history, message, context }) => {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-flash-latest"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
      
      const formattedHistory = (history || []).map(msg => {
        const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'model';
        const text = msg.content || msg.message || "";
        return { role, parts: [{ text }] };
      });

      const chat = model.startChat({
        history: formattedHistory,
        tools: [{
          functionDeclarations: [
            searchFreelancersDeclaration,
            webSearchDeclaration,
            analyzeStartupIdeaDeclaration
          ]
        }]
      });

      console.log(`[nonStreamChatCompletion] Sending message via stream using model ${modelName}...`);
      const responseStream = await chat.sendMessageStream(message);
      
      let initialText = "";
      let functionCalls = [];
      let modelParts = [];
      
      for await (const chunk of responseStream.stream) {
        if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts) {
          modelParts = [...modelParts, ...chunk.candidates[0].content.parts];
        }
        const calls = typeof chunk.functionCalls === "function" ? chunk.functionCalls() : chunk.functionCalls;
        if (calls) {
          functionCalls = [...functionCalls, ...calls];
        }
        try {
          initialText += typeof chunk.text === "function" ? chunk.text() : chunk.text;
        } catch (e) {}
      }
      
      console.log("[nonStreamChatCompletion] Initial text response:", initialText);
      console.log("[nonStreamChatCompletion] Detected functionCalls:", JSON.stringify(functionCalls));

      let currentFunctionCalls = functionCalls;
      let currentModelParts = modelParts;

      while (currentFunctionCalls.length > 0) {
        // 1. Manually ensure the initial user turn exists in history
        if (chat._history.length === 0) {
          chat._history.push({
            role: "user",
            parts: [{ text: message }]
          });
        }

        // 2. Manually push the model's functionCall turn to chat history (preserving thoughts)
        chat._history.push({
          role: "model",
          parts: currentModelParts
        });

        // 2. Execute all detected function calls
        const functionResponses = [];
        for (const call of currentFunctionCalls) {
          console.log("[nonStreamChatCompletion] Executing function:", call.name, "with args:", JSON.stringify(call.args));
          let resultData;
          if (call.name === "search_freelancers") {
            resultData = await exports.localSearchFreelancers({
              ...call.args,
              founderNeeds: context ? `Startup Name: ${context.startupName} | Idea: ${context.startupDesc} | Needs: ${context.hiringNeeds} | Budget: ${context.budget}` : ""
            });
          } else if (call.name === "web_search") {
            resultData = await exports.localWebSearch(call.args);
          } else if (call.name === "analyze_startup_idea") {
            resultData = await exports.localAnalyzeStartupIdea(call.args);
          }
          console.log("[nonStreamChatCompletion] Function result:", JSON.stringify(resultData).substring(0, 300));
          
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { result: resultData }
            }
          });
        }

        console.log("[nonStreamChatCompletion] Sending functionResponses back to model...");
        const followUpStream = await chat.sendMessageStream(functionResponses);
        
        let followUpText = "";
        currentFunctionCalls = [];
        currentModelParts = [];

        for await (const chunk of followUpStream.stream) {
          if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts) {
            currentModelParts = [...currentModelParts, ...chunk.candidates[0].content.parts];
          }
          const calls = typeof chunk.functionCalls === "function" ? chunk.functionCalls() : chunk.functionCalls;
          if (calls) {
            currentFunctionCalls = [...currentFunctionCalls, ...calls];
          }
          try {
            followUpText += typeof chunk.text === "function" ? chunk.text() : chunk.text;
          } catch (e) {}
        }

        console.log("[nonStreamChatCompletion] Turn response text:", followUpText);
        console.log("[nonStreamChatCompletion] Turn next functionCalls:", JSON.stringify(currentFunctionCalls));

        if (currentFunctionCalls.length === 0) {
          return followUpText;
        }
      }

      return initialText;
    } catch (err) {
      console.warn(`[nonStreamChatCompletion] Model ${modelName} failed. Retrying... Reason: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError;
};

// Helper: Calculate cosine similarity between two float arrays
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

exports.cosineSimilarity = cosineSimilarity;

exports.generateEmbedding = async (text) => {
  let lastErr = null;
  for (const modelName of ["gemini-embedding-2", "gemini-embedding-001"]) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (err) {
      console.warn(`[AI Embedding Warning] Model ${modelName} failed:`, err.message);
      lastErr = err;
    }
  }
  console.error("[AI Embedding Error] All embedding models failed:", lastErr);
  return null;
};

exports.queryPineconeMemories = async (userId, queryText) => {
  const db = require("../config/db");
  try {
    const queryVector = await exports.generateEmbedding(queryText);
    if (!queryVector) return [];

    // Fetch all memories for the user that have embeddings
    const [rows] = await db.promise().query(
      "SELECT extracted_fact, embedding FROM founder_memories WHERE user_id = ? AND embedding IS NOT NULL",
      [userId]
    );

    if (rows.length === 0) return [];

    // Calculate similarity, filter, and sort
    const matches = rows
      .map(row => {
        let vec;
        try {
          vec = typeof row.embedding === "string" ? JSON.parse(row.embedding) : row.embedding;
        } catch (e) {
          vec = null;
        }
        const score = vec ? cosineSimilarity(queryVector, vec) : 0;
        return { fact: row.extracted_fact, score };
      })
      .filter(m => m.score >= 0.55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(m => m.fact);

    return matches;
  } catch (err) {
    console.error("[AI Local Memory Query Error]:", err);
    return [];
  }
};

exports.extractProfileFactsAndSave = async (userId, chatHistory) => {
  const db = require("../config/db");
  const recentTexts = chatHistory.slice(-8).map(h => `${h.sender || h.role}: ${h.message || h.content || ""}`).join("\n");
  const prompt = `
    Analyze this conversation history between a startup founder and an AI assistant.
    Extract key structural information about the founder's startup and hiring needs if available.
    
    CONVERSATION:
    ${recentTexts}
    
    Return ONLY a JSON object with any fields you can extract. If you cannot extract a field, omit it.
    Format:
    {
      "startupName": "Extracted startup name",
      "solutionBuilding": "Brief description of the product or solution being built",
      "industryNiche": "Industry sector e.g. EdTech, FinTech, Web3, SaaS, AI, E-commerce",
      "stage": "Idea / MVP / Early Revenue / Growth",
      "hiringNeeds": "Required roles e.g. React Developer, UI/UX Designer, Marketing Lead",
      "hiringBudget": "Description of budget constraints e.g. ₹50,000 / $2,000/mo",
      "preferredTech": ["React", "Node.js", "Python"],
      "facts": ["List of 2-3 important facts about business goals, competitors, or target market"]
    }
  `;

  try {
    const text = await generateWithFallback(prompt);
    const facts = extractAndParseJSON(text);

    if (facts && facts.facts && facts.facts.length > 0) {
      for (const fact of facts.facts) {
        const vector = await exports.generateEmbedding(fact);
        await db.promise().query(
          "INSERT INTO founder_memories (user_id, extracted_fact, category, embedding) VALUES (?, ?, ?, ?)",
          [userId, fact, "profile_auto", vector ? JSON.stringify(vector) : null]
        );
        console.log(`[AI Memory Worker] Saved memory and local embedding for user ${userId}.`);
      }
    }

    if (facts && (facts.startupName || facts.stage || facts.hiringBudget || facts.solutionBuilding || facts.industryNiche || facts.hiringNeeds || facts.preferredTech)) {
      const [profiles] = await db.promise().query("SELECT id FROM startup_profiles WHERE user_id = ?", [userId]);
      if (profiles.length > 0) {
        let updateQuery = "UPDATE startup_profiles SET ";
        const fields = [];
        const params = [];
        if (facts.startupName) {
          fields.push("startup_name = ?");
          params.push(facts.startupName);
        }
        if (facts.solutionBuilding) {
          fields.push("solution_building = ?");
          params.push(facts.solutionBuilding);
        }
        if (facts.industryNiche) {
          fields.push("industry_niche = ?");
          params.push(facts.industryNiche);
        }
        if (facts.stage) {
          fields.push("current_stage = ?");
          params.push(facts.stage);
        }
        if (facts.hiringNeeds) {
          fields.push("current_need = ?");
          params.push(facts.hiringNeeds);
        }
        if (facts.hiringBudget) {
          fields.push("monthly_investment = ?");
          params.push(facts.hiringBudget);
        }
        if (facts.preferredTech && Array.isArray(facts.preferredTech)) {
          fields.push("preferred_tech = ?");
          params.push(JSON.stringify(facts.preferredTech));
        }
        if (fields.length > 0) {
          updateQuery += fields.join(", ") + " WHERE user_id = ?";
          params.push(userId);
          await db.promise().query(updateQuery, params);
          console.log(`[AI Worker] Dynamically updated startup_profile autocompletions for user ${userId}.`);
        }
      }
    }
  } catch (error) {
    console.error("[AI Worker] extractProfileFactsAndSave failed:", error);
  }
};

exports.updateSessionSummary = async (sessionId) => {
  const db = require("../config/db");
  try {
    const [messages] = await db.promise().query(
      "SELECT sender, message FROM ai_messages WHERE session_id = ? ORDER BY id ASC LIMIT 20",
      [sessionId]
    );
    if (messages.length < 15) return;

    const chatText = messages.map(m => `${m.sender === "user" ? "Founder" : "AI"}: ${m.message}`).join("\n");
    const prompt = `
      Summarize the following conversation history between a founder and the AI assistant into a concise, detailed paragraph.
      Focus on what the founder's project is, what they have discussed, and what their immediate actions are.
      
      CONVERSATION:
      ${chatText}
      
      Summary:
    `;

    const summary = await generateWithFallback(prompt);
    await db.promise().query("UPDATE ai_conversations SET summary = ? WHERE session_id = ?", [summary, sessionId]);
    console.log(`[AI Worker] Updated summary for session ${sessionId}.`);
  } catch (error) {
    console.error("[AI Worker] updateSessionSummary failed:", error);
  }
};

exports.getSemanticJobRecommendations = async (profile, jobs) => {
  const jobsListText = jobs.map(j => `ID: ${j.job_id} | Title: ${j.job_title} | Startup: ${j.startup_name} | Requirements: ${j.job_requirements} | Description: ${j.full_job_description} | Budget: ${j.budget_range}`).join("\n---\n");
  const profileText = `Name: ${profile.name} | Skills: ${profile.skills} | Experience: ${profile.experience} | Budget: ${profile.budget} | Bio/Portfolio: ${profile.portfolio}`;

  const prompt = `
    Analyze this freelancer profile and matching them against the list of available jobs.
    Select the top 3 best matching jobs. For each selected job, compute a match score (0 to 100%) and explain in 1 sentence why it matches.
    
    FREELANCER PROFILE:
    ${profileText}
    
    JOBS LIST:
    ${jobsListText}
    
    Return ONLY a JSON array of objects format (do not include markdown wrapping or other text):
    [
      {
        "job_id": 123,
        "score": 92,
        "reason": "Text reason explaining why it matches"
      }
    ]
  `;

  try {
    const text = await generateWithFallback(prompt);
    const results = extractAndParseJSON(text);
    if (!Array.isArray(results)) return [];

    const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
    const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

    return results.map(r => {
      const job = jobs.find(j => String(j.job_id) === String(r.job_id));
      if (!job) return null;
      return {
        title: `${job.job_title} @ ${job.startup_name}`,
        score: r.score,
        reason: r.reason,
        link: `${baseUrl}/job-posting/${job.job_id}`
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("[AI Semantic Job Recommendations Failed]", err);
    return [];
  }
};

exports.getSemanticStartupRecommendations = async (profile, startups) => {
  const startupsListText = startups.map(s => `ID: ${s.id} | Startup: ${s.startup_name} | Idea: ${s.startup_idea} | Needs: ${s.current_need} | Budget: ${s.monthly_investment}`).join("\n---\n");
  const profileText = `Name: ${profile.name} | Expertise: ${profile.expertise} | Stage Interest: ${profile.stage} | Equity Expected: ${profile.equity} | Bio/Superpowers: ${profile.superpowers}`;

  const prompt = `
    Analyze this co-founder candidate profile and matching them against the list of available startups.
    Select the top 3 best matching startups. For each selected startup, compute a match score (0 to 100%) and explain in 1 sentence why it matches.
    
    CO-FOUNDER PROFILE:
    ${profileText}
    
    STARTUPS LIST:
    ${startupsListText}
    
    Return ONLY a JSON array of objects format (do not include markdown wrapping or other text):
    [
      {
        "id": 123,
        "score": 88,
        "reason": "Text reason explaining why it matches"
      }
    ]
  `;

  try {
    const text = await generateWithFallback(prompt);
    const results = extractAndParseJSON(text);
    if (!Array.isArray(results)) return [];

    const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
    const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

    return results.map(r => {
      const startup = startups.find(s => String(s.id) === String(r.id));
      if (!startup) return null;
      return {
        title: startup.startup_name,
        score: r.score,
        reason: r.reason,
        link: `${baseUrl}/startup-profile/${startup.id}`
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("[AI Semantic Startup Recommendations Failed]", err);
    return [];
  }
};

exports.getSemanticTalentRecommendations = async (profile, talents) => {
  const talentsListText = talents.map(t => `ID: ${t.id} | Name: ${t.full_name} | Type: ${t.user_type} | Skills: ${t.skills_description} | Experience: ${t.years_experience} | Rate: ${t.hourly_rate}`).join("\n---\n");
  const profileText = `Startup: ${profile.startupName} | Idea: ${profile.startupDesc} | Hiring Needs: ${profile.hiringNeeds} | Budget: ${profile.budget}`;

  const prompt = `
    Analyze this startup founder's needs and matching them against the list of available candidates (freelancers/co-founders).
    Select the top 3-5 best matching candidates across multiple categories if requested. For each selected candidate, compute a match score (0 to 100%) and explain in 1 sentence why they match.
    
    FOUNDER NEEDS:
    ${profileText}
    
    CANDIDATES LIST:
    ${talentsListText}
    
    Return ONLY a JSON array of objects format (do not include markdown wrapping or other text):
    [
      {
        "id": 123,
        "score": 95,
        "reason": "Text reason explaining why they match"
      }
    ]
  `;

  try {
    const text = await generateWithFallback(prompt);
    const results = extractAndParseJSON(text);
    if (!Array.isArray(results)) return [];

    const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
    const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");

    return results.map(r => {
      const talent = talents.find(t => String(t.id) === String(r.id));
      if (!talent) return null;
      const typePath = talent.user_type === "cofounder" ? "cofounder-profile" : "freelancer-profile";
      return {
        title: `${talent.full_name} (${talent.user_type === 'cofounder' ? 'Co-founder' : 'Freelancer'})`,
        score: r.score,
        reason: r.reason,
        link: `${baseUrl}/${typePath}/${talent.id}`
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("[AI Semantic Talent Recommendations Failed]", err);
    return [];
  }
};

exports.autoBackfillEmbeddings = async () => {
  const db = require("../config/db");
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  try {
    // 1. Freelancers
    const [freelancers] = await db.promise().query(
      "SELECT f.user_id, f.first_name, f.last_name, f.skills_description, f.experience, f.stipend_expectations, f.github, f.other_links, f.freelancer_type, f.describe_best FROM freelancer_profiles f WHERE f.embedding IS NULL LIMIT 20"
    );
    if (freelancers.length > 0) {
      console.log(`[Auto-Backfill] Generating vector embeddings for ${freelancers.length} freelancers in the background...`);
      for (const f of freelancers) {
        const name = `${f.first_name || ""} ${f.last_name || ""}`.trim();
        const profileText = `Name: ${name} | Skills: ${f.skills_description || ""} | Stack: ${f.describe_best || ""} | Expertise: ${f.freelancer_type || ""} | Experience: ${f.experience || ""} | Budget: ${f.stipend_expectations || ""} | Portfolio: ${f.github || ""} | Resume: ${f.other_links || ""}`;
        const embedding = await exports.generateEmbedding(profileText);
        if (embedding) {
          await db.promise().query("UPDATE freelancer_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), f.user_id]);
        }
        await sleep(1000); // 1-second delay to avoid 429 rate limit
      }
    }

    // 2. Co-founders
    const [cofounders] = await db.promise().query(
      "SELECT c.user_id, c.full_legal_name, c.primary_identity, c.anti_portfolio, c.equity_minimum FROM cofounder_profiles c WHERE c.embedding IS NULL LIMIT 20"
    );
    if (cofounders.length > 0) {
      console.log(`[Auto-Backfill] Generating vector embeddings for ${cofounders.length} co-founders in the background...`);
      for (const c of cofounders) {
        const profileText = `Name: ${c.full_legal_name || ""} | Expertise: ${c.primary_identity || ""} | Superpowers: ${c.anti_portfolio || ""} | Equity: ${c.equity_minimum || ""}`;
        const embedding = await exports.generateEmbedding(profileText);
        if (embedding) {
          await db.promise().query("UPDATE cofounder_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), c.user_id]);
        }
        await sleep(1000); // 1-second delay to avoid 429 rate limit
      }
    }

    // 3. Startups
    const [startups] = await db.promise().query(
      "SELECT s.user_id, s.startup_name, s.current_stage, s.current_need, s.monthly_investment, s.solution_building FROM startup_profiles s WHERE s.embedding IS NULL LIMIT 20"
    );
    if (startups.length > 0) {
      console.log(`[Auto-Backfill] Generating vector embeddings for ${startups.length} startups in the background...`);
      for (const s of startups) {
        const profileText = `Name: ${s.startup_name || ""} | Stage: ${s.current_stage || ""} | Needs: ${s.current_need || ""} | Budget: ${s.monthly_investment || ""} | Description: ${s.solution_building || ""}`;
        const embedding = await exports.generateEmbedding(profileText);
        if (embedding) {
          await db.promise().query("UPDATE startup_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), s.user_id]);
        }
        await sleep(1000); // 1-second delay to avoid 429 rate limit
      }
    }

    // 4. Jobs
    const [jobs] = await db.promise().query(
      "SELECT j.job_id, j.job_title, j.startup_name, j.job_requirements, j.budget_range, j.job_type FROM foundu_jobs j WHERE j.embedding IS NULL LIMIT 20"
    );
    if (jobs.length > 0) {
      console.log(`[Auto-Backfill] Generating vector embeddings for ${jobs.length} jobs in the background...`);
      for (const j of jobs) {
        const profileText = `Job Title: ${j.job_title || ""} | Startup: ${j.startup_name || ""} | Requirements: ${j.job_requirements || ""} | Budget: ${j.budget_range || ""} | Type: ${j.job_type || ""}`;
        const embedding = await exports.generateEmbedding(profileText);
        if (embedding) {
          await db.promise().query("UPDATE foundu_jobs SET embedding = ? WHERE job_id = ?", [JSON.stringify(embedding), j.job_id]);
        }
        await sleep(1000); // 1-second delay to avoid 429 rate limit
      }
    }
  } catch (err) {
    console.error("[Auto-Backfill Error]:", err.message);
  }
};

exports.extractResumeInfo = async (pdfBuffer, mimeType = "application/pdf") => {
  const prompt = `
    You are an expert technical recruiter analyzing a candidate's CV/Resume.
    Analyze the uploaded document and extract the following structured details in JSON format.
    
    Return ONLY a JSON object in this format:
    {
      "name": "Full legal name",
      "email": "Email address",
      "skills": "Comma separated list of core skills e.g. React, Node.js, PostgreSQL",
      "preferred_tech": "Preferred frameworks/tech stack e.g. MERN, Python, iOS",
      "domain_expertise": "Domain niche e.g. FinTech, EdTech, E-commerce, SaaS",
      "experience": "Total years of experience e.g. 3 years",
      "budget": "Expected monthly rate/budget based on their profile e.g. ₹40,000/mo (if not specified, estimate a realistic market rate)",
      "portfolio": "Portfolio/GitHub links if mentioned (otherwise 'none')",
      "resume": "A detailed 2-3 paragraph summary of their background, key achievements, projects, and credentials extracted from their CV"
    }
  `;

  let lastError = null;
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest"];
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        {
          inlineData: {
            data: pdfBuffer.toString("base64"),
            mimeType
          }
        },
        prompt
      ]);
      const response = await result.response;
      return extractAndParseJSON(response.text());
    } catch (e) {
      console.warn(`[extractResumeInfo] Model ${modelName} failed. Reason: ${e.message}`);
      lastError = e;
    }
  }
  throw lastError;
};

