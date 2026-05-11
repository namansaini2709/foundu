const geminiService = require("../services/geminiService");
const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../ai_debug_error.log");

const logError = (error, context) => {
  const timestamp = new Date().toISOString();
  const logMsg = `\n[${timestamp}] CONTEXT: ${context}\nERROR: ${error.message}\nSTACK: ${error.stack}\n`;
  fs.appendFileSync(LOG_FILE, logMsg);
};

/**
 * Enriches job details based on user inputs.
 */
exports.enrichJob = async (req, res) => {
  const { role, inputs } = req.body;

  if (!role || !inputs) {
    return res.status(400).json({ message: "Role and inputs are required." });
  }

  try {
    const enrichedData = await geminiService.enrichJobDetails(role, inputs);
    if (!enrichedData) {
      return res.status(500).json({ message: "Failed to enrich job details with AI." });
    }

    res.json({
      success: true,
      data: enrichedData
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    logError(error, "enrichJob");
    res.status(500).json({ 
      error: error.message, 
      stack: error.stack,
      hint: "Check if GEMINI_API_KEY is valid and not restricted."
    });
  }
};

/**
 * Chatbot Suggestions based on real DB data.
 */
exports.chatSuggestions = async (req, res) => {
  const { role, filters } = req.body;
  console.log(`[AI CHAT] Request received for role: ${role}`, filters);
  const db = require("../config/db");

  try {
    let candidates = [];
    let query = "";
    let params = [];

    if (role === "founder") {
      // Fetch Freelancers and Cofounders with filtering
      let whereClauses = ["u.user_type IN ('freelancer', 'cofounder')"];
      
      if (filters.domain && filters.domain !== "Other") {
        whereClauses.push("(fp.freelancer_type LIKE ? OR cp.primary_identity LIKE ?)");
        params.push(`%${filters.domain}%`, `%${filters.domain}%`);
      }
      if (filters.experience && filters.experience !== "Any Level") {
        whereClauses.push("(fp.experience LIKE ? OR cp.current_occupational_status LIKE ?)");
        params.push(`%${filters.experience}%`, `%${filters.experience}%`);
      }

      query = `
        SELECT u.id, u.full_name, u.user_type, 
               COALESCE(fp.skills_description, cp.primary_identity) as skills_description,
               COALESCE(fp.experience, cp.current_occupational_status) as experience,
               u.credibility_score,
               u.blue_tick_verified,
               u.green_tick_verified,
               u.golden_tick_verified,
               COALESCE(r_stats.avg_stars, 0) as avg_rating
        FROM users u
        LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
        LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
        LEFT JOIN (
          SELECT user_id, AVG(stars) as avg_stars 
          FROM reviews 
          GROUP BY user_id
        ) r_stats ON u.id = r_stats.user_id
        WHERE ${whereClauses.join(" AND ")}
        ORDER BY u.credibility_score DESC
        LIMIT 50
      `;
    } else {
      // Fetch Jobs with filtering
      let whereClauses = ["1=1"];
      if (filters.domain && filters.domain !== "Other") {
        whereClauses.push("domain LIKE ?");
        params.push(`%${filters.domain}%`);
      }
      if (filters.workType && filters.workType !== "Any") {
        whereClauses.push("job_location_type LIKE ?");
        params.push(`%${filters.workType}%`);
      }

      query = `
        SELECT job_id as id, job_title, domain, full_job_description as job_description, budget_range, job_location_type as job_type
        FROM foundu_jobs
        WHERE ${whereClauses.join(" AND ")}
        ORDER BY created_at DESC
        LIMIT 50
      `;
    }

    const [rows] = await db.promise().query(query, params);
    candidates = rows;

    // If we have zero results with filters, fallback to general search
    if (candidates.length === 0) {
      console.log("[AI CHAT] No filtered results, falling back to general search.");
      const fallbackQuery = role === "founder" 
        ? "SELECT u.id, u.full_name, u.user_type, u.credibility_score, u.blue_tick_verified, u.green_tick_verified, u.golden_tick_verified FROM users u WHERE u.user_type IN ('freelancer', 'cofounder') ORDER BY u.credibility_score DESC LIMIT 20"
        : "SELECT job_id as id, job_title, domain, budget_range FROM foundu_jobs ORDER BY created_at DESC LIMIT 20";
      const [fallbackRows] = await db.promise().query(fallbackQuery);
      candidates = fallbackRows;
    }

    const aiMatches = await geminiService.getChatSuggestions(role, filters, candidates);
    
    // Merge AI scores with real data
    const finalResults = aiMatches.map(match => {
      const realData = candidates.find(c => c.id === match.id);
      if (!realData) return null;
      return {
        ...realData,
        matchScore: match.match_score,
        explainPoints: match.explain_points
      };
    }).filter(Boolean);

    console.log(`[AI CHAT] Returning ${finalResults.length} suggestions.`);
    res.json({
      success: true,
      suggestions: finalResults
    });
  } catch (error) {
    console.error("[AI CHAT ERROR]:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Sends a real notification when an "Invite" is sent from the chatbot.
 */
exports.sendInvite = async (req, res) => {
  const { sender_id, receiver_id, message, job_id } = req.body;
  const db = require("../config/db");
  const notificationService = require("../services/notificationService");

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ message: "Sender and receiver IDs are required." });
  }

  try {
    // 3. Send the notification to the receiver
    await notificationService.sendNotification(
      receiver_id,
      "New AI Collaboration Match! ✨",
      message,
      "invite",
      job_id ? `/job/${job_id}` : "/dashboard"
    );

    res.json({
      success: true,
      message: "Invite sent successfully. You will now be redirected to the job page to complete your formal application."
    });
  } catch (error) {
    console.error("[AI INVITE ERROR]:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Startup Idea Analysis (Idea Lab).
 */
exports.analyzeIdea = async (req, res) => {
  const { mode, text, context } = req.body;
  const db = require("../config/db");

  if (!mode || !text) {
    return res.status(400).json({ message: "Mode and text are required." });
  }

  try {
    const analysis = await geminiService.analyzeStartupIdea(mode, text, context || {});
    if (!analysis) {
      return res.status(500).json({ message: "Failed to analyze idea with AI." });
    }

    // Fetch real talent from DB that matches the AI-suggested roles
    let realTalent = [];
    try {
      const [rows] = await db.promise().query(`
        SELECT u.id, u.full_name, u.user_type, u.credibility_score,
               COALESCE(fp.skills_description, cp.primary_identity) as skills,
               COALESCE(fp.experience, cp.current_occupational_status) as experience
        FROM users u
        LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id
        LEFT JOIN cofounder_profiles cp ON u.id = cp.user_id
        WHERE u.user_type IN ('freelancer', 'cofounder')
        AND u.credibility_score > 0
        ORDER BY u.credibility_score DESC
        LIMIT 6
      `);
      realTalent = rows.map(r => ({
        id: r.id,
        name: r.full_name,
        role: r.skills || r.user_type,
        credibility: r.credibility_score || 0,
        experience: r.experience || "Not specified",
        userType: r.user_type
      }));
    } catch (dbErr) {
      console.error("DB Talent Fetch Error:", dbErr);
    }

    res.json({
      success: true,
      data: {
        ...analysis,
        realTalent
      }
    });
  } catch (error) {
    console.error("AI Controller (Idea) Error:", error);
    logError(error, "analyzeIdea");
    res.status(500).json({ 
      error: error.message, 
      stack: error.stack
    });
  }
};
