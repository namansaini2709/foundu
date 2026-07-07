const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());

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

You are NOT a general chatbot. You only advise on startup and business topics. If asked about unrelated topics, politely redirect the conversation back to building their startup.`;

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build conversation history for context
    const chatHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.json({ success: true, reply: text });
  } catch (err) {
    console.error("[FounderGPT] Error:", err.message);

    // Fallback to an alternate current model if the primary is unavailable.
    // (Note: "gemini-pro" was removed from the v1beta API and returns 404.)
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await fallbackModel.generateContent(req.body.message);
      const text = result.response.text();
      return res.json({ success: true, reply: text });
    } catch (fallbackErr) {
      console.error("[FounderGPT] Fallback also failed:", fallbackErr.message);
      return res.status(500).json({
        success: false,
        error: "AI is temporarily unavailable. Please try again in a moment.",
      });
    }
  }
};
