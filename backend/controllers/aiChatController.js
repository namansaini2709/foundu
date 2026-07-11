const geminiService = require("../services/geminiService");
const db = require("../config/db");

/**
 * Handle Conversational Chat Streaming via Server-Sent Events (SSE).
 */
exports.chatStream = async (req, res) => {
  const userId = req.user?.id; // Assuming user is populated via authMiddleware
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Message and sessionId are required." });
  }

  try {
    // 1. Ensure conversation exists, otherwise create it
    const [convs] = await db.promise().query(
      "SELECT * FROM ai_conversations WHERE session_id = ? AND user_id = ?",
      [sessionId, userId]
    );

    let sessionSummary = "";
    if (convs.length === 0) {
      await db.promise().query(
        "INSERT INTO ai_conversations (user_id, session_id) VALUES (?, ?)",
        [userId, sessionId]
      );
    } else {
      sessionSummary = convs[0].summary || "";
    }

    // 2. Load Founder Profile Facts (from startup_profiles and founder_memories)
    const [profiles] = await db.promise().query(
      "SELECT * FROM startup_profiles WHERE user_id = ?",
      [userId]
    );
    const profile = profiles[0] || {};

    let pineconeMemories = [];
    try {
      pineconeMemories = await geminiService.queryPineconeMemories(userId, message);
      console.log(`[AI Chat] Pinecone vector memories retrieved: ${pineconeMemories.length}`);
    } catch (pineconeErr) {
      console.warn("[AI Chat] Pinecone semantic retrieval failed/skipped:", pineconeErr.message);
    }

    const [memories] = await db.promise().query(
      "SELECT extracted_fact FROM founder_memories WHERE user_id = ? LIMIT 10",
      [userId]
    );
    
    const allUniqueMemories = new Set([
      ...memories.map(m => m.extracted_fact),
      ...pineconeMemories
    ]);
    const memoryText = Array.from(allUniqueMemories).map(fact => `- ${fact}`).join("\n");

    // 3. Load recent 10 messages for context
    const [historyRows] = await db.promise().query(
      "SELECT sender, message FROM ai_messages WHERE session_id = ? ORDER BY id ASC LIMIT 10",
      [sessionId]
    );

    // 4. Construct System Instruction
    let systemInstruction = `
      You are the "FoundU Ginnie" AI Startup Assistant.
      Your goal is to guide and assist startup founders.
      
      About the Founder & Startup:
      - Startup Name: ${profile.startup_name || "Not Specified"}
      - Current Stage: ${profile.current_stage || "Not Specified"}
      - Primary Needs: ${profile.current_need || "Not Specified"}
      - Budget Info: ${profile.monthly_investment || "Not Specified"}
      
      Known Facts about the founder:
      ${memoryText || "No prior facts recorded."}
      
      ${sessionSummary ? `Summary of past discussions in this session:\n${sessionSummary}\n` : ""}
      
      Rules:
      1. Always act as an encouraging, knowledgeable VC mentor and accelerator lead.
      2. If the user asks for talent, freelancers, or cofounders, call 'search_freelancers' to find candidates matching their needs.
      3. If they describe a new business idea or ask for evaluation, use 'analyze_startup_idea'.
      4. If they ask about competitors, market trends, or search validation, use 'web_search'.
      5. Always format your responses in clear Markdown. Keep explanations crisp.
    `;

    // 5. Initialize Server Sent Events headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullReply = "";

    // 6. Run Streaming
    await geminiService.streamChatCompletion({
      systemInstruction,
      history: historyRows,
      message,
      onChunk: (chunk) => {
        fullReply += chunk;
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      },
      onToolCall: (name, args) => {
        res.write(`data: ${JSON.stringify({ toolCall: { name, args } })}\n\n`);
      }
    });

    // 7. Write history to DB
    await db.promise().query(
      "INSERT INTO ai_messages (session_id, sender, message) VALUES (?, 'user', ?)",
      [sessionId, message]
    );
    await db.promise().query(
      "INSERT INTO ai_messages (session_id, sender, message) VALUES (?, 'assistant', ?)",
      [sessionId, fullReply]
    );

    // Send closing tag
    res.write("data: [DONE]\n\n");
    res.end();

    // 8. Fire off background workers asynchronously
    const updatedHistory = [...historyRows, { sender: "user", message }, { sender: "assistant", message: fullReply }];
    geminiService.extractProfileFactsAndSave(userId, updatedHistory).catch(console.error);
    geminiService.updateSessionSummary(sessionId).catch(console.error);

  } catch (error) {
    console.error("[AI Chat Streaming Error]:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Fetch Chat History for a session.
 */
exports.getHistory = async (req, res) => {
  const userId = req.user?.id;
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "SessionId is required." });
  }

  try {
    const [messages] = await db.promise().query(
      `SELECT m.sender, m.message, m.created_at 
       FROM ai_messages m
       JOIN ai_conversations c ON m.session_id = c.session_id
       WHERE c.session_id = ? AND c.user_id = ?
       ORDER BY m.id ASC`,
      [sessionId, userId]
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("[AI Chat History Error]:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reset a Chat Session.
 */
exports.resetChat = async (req, res) => {
  const userId = req.user?.id;
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "SessionId is required." });
  }

  try {
    await db.promise().query(
      "DELETE FROM ai_conversations WHERE session_id = ? AND user_id = ?",
      [sessionId, userId]
    );
    res.json({ success: true, message: "Chat reset successfully." });
  } catch (error) {
    console.error("[AI Chat Reset Error]:", error);
    res.status(500).json({ error: error.message });
  }
};
