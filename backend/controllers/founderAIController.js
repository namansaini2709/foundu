const geminiService = require("../services/geminiService");
const db = require("../config/db");

const SYSTEM_PROMPT = `You are FounderGPT — an elite AI startup advisor built exclusively for founders on FoundU, India's premier startup platform.

Your personality:
- Sharp, direct, and no-nonsense like a seasoned venture capitalist
- You speak from experience, not theory
- You are brutally honest when needed, but always constructive
- You use clear, structured responses with practical action items
- You understand the Indian startup ecosystem deeply

Your areas of expertise:
- Startup idea validation and stress-testing
- MVP scoping and product strategy
- Hiring strategy (co-founders, freelancers, early team)
- Business model design and unit economics
- Go-to-market strategy
- Fundraising (pre-seed, seed, Series A)
- Pricing strategy
- Competitive analysis
- Growth hacking and marketing

Rules:
- Never give generic advice. Always be specific.
- If a founder asks something vague, ask a clarifying question first.
- Break down complex answers with bullet points or numbered steps.
- If you don't know something specific, say so and redirect to what you do know.
- Always relate advice back to the founder's actual situation when possible.
- Keep responses concise but complete. Aim for quality over length.

You are NOT a general chatbot. You only advise on startup and business topics. If asked about unrelated topics, politely redirect the conversation back to building their startup.

IF THE USER ASKS FOR TALENT, FREELANCERS, OR CO-FOUNDERS, CHOOSE TO CALL THE 'search_freelancers' FUNCTION AUTOMATICALLY TO MATCH CANDIDATES SEMANTICALLY FROM THE DATABASE.
IF THEY WANT A DETAILED ANALYSIS OR REPORT FOR THEIR BUSINESS IDEA, RUN THE 'analyze_startup_idea' FUNCTION.`;

exports.chat = async (req, res) => {
  const { message, history = [] } = req.body;
  const userId = req.user?.id;

  if (!message || message.trim() === "") {
    return res.status(400).json({ success: false, error: "Message is required." });
  }

  try {
    let context = null;
    let enrichedSystemPrompt = SYSTEM_PROMPT;

    if (userId) {
      // 1. Fetch startup profile context
      const [profiles] = await db.promise().query(
        "SELECT * FROM startup_profiles WHERE user_id = ?",
        [userId]
      );
      if (profiles.length > 0) {
        const p = profiles[0];
        context = {
          startupName: p.startup_name,
          startupDesc: p.solution_building,
          hiringNeeds: p.current_need,
          budget: p.monthly_investment
        };
      }

      // 2. Fetch semantic vector memories from database via local cosine similarity
      let vectorMemories = [];
      try {
        vectorMemories = await geminiService.queryPineconeMemories(userId, message);
        if (vectorMemories.length > 0) {
          console.log(`[FounderAI] Retrieved ${vectorMemories.length} vector memories for user ${userId}`);
        }
      } catch (vecErr) {
        console.warn("[FounderAI] Vector memory query warning:", vecErr.message);
      }

      // 3. Fetch recent extracted facts
      const [rawMemories] = await db.promise().query(
        "SELECT extracted_fact FROM founder_memories WHERE user_id = ? ORDER BY id DESC LIMIT 10",
        [userId]
      );

      const allMemories = Array.from(new Set([
        ...rawMemories.map(m => m.extracted_fact),
        ...vectorMemories
      ]));

      if (allMemories.length > 0) {
        const memoryBlock = allMemories.map(f => `- ${f}`).join("\n");
        enrichedSystemPrompt += `\n\nKNOWN HISTORICAL FACTS & MEMORIES ABOUT THIS FOUNDER/STARTUP:\n${memoryBlock}`;
      }
    }

    const reply = await geminiService.nonStreamChatCompletion({
      systemInstruction: enrichedSystemPrompt,
      history,
      message,
      context
    });

    // 4. Asynchronously trigger background worker for fact extraction & profile autocompletion
    if (userId) {
      const updatedHistory = [...history, { role: "user", content: message }, { role: "model", content: reply }];
      geminiService.extractProfileFactsAndSave(userId, updatedHistory).catch(err => {
        console.error("[FounderAI Worker Error]:", err.message);
      });
    }

    return res.json({ success: true, reply });
  } catch (err) {
    console.error("[FounderGPT Error]:", err);
    return res.status(500).json({
      success: false,
      error: "AI is temporarily unavailable. Please try again in a moment.",
    });
  }
};

