import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "react-toastify";
import api, { API_BASE } from "../utils/axiosConfig";
import { getUserId, getUserType } from "../utils/authUtils";
import "./SmartChatbot.css";
import blueBadge from "../assets/bluebadge.png";
import greenBadge from "../assets/greenbadge.png";
import goldenBadge from "../assets/goldenbadge.png";
import badge9095 from "../assets/9095.png";
import badge8590 from "../assets/8590.png";
import badge8085 from "../assets/8085.png";
import badgeBelow80 from "../assets/below80.png";
/* ================================================================
   CONVERSATION FLOWS — per role, 5 questions each
   ================================================================ */
const FLOWS = {
  founder: {
    greeting:
      "Hey, I'm your **FoundU AI Assistant**! I can find the best talent for your startup using credibility scores, badge verification, and AI-powered matching. What are you looking for?",
    questions: [
      {
        key: "type",
        text: "What type of talent do you need?",
        options: ["Freelancer", "Co-Founder", "Show me both"],
      },
      {
        key: "domain",
        text: "What domain is your job in?",
        options: ["Tech", "Design", "Marketing", "Finance", "Legal", "Other"],
      },
      {
        key: "experience",
        text: "What experience level do you prefer?",
        options: ["Fresher", "Mid-Level", "Senior", "Any Level"],
      },
      {
        key: "priority",
        text: "What matters most to you?",
        options: ["Highest Rating", "Best Credibility", "Exact Skill Match", "Discover Hidden Talent"],
      },
      {
        key: "includeNonApplicants",
        text: "Should I include people who haven't applied yet?",
        options: ["Yes, show hidden talent", "Applicants only"],
      },
    ],
  },
  freelancer: {
    greeting:
      "Hey, I'm your **FoundU AI Assistant**! I can find the best opportunities matching your skills, or show you which founders are actively looking for someone like you. What would you like?",
    questions: [
      {
        key: "goal",
        text: "What are you looking for?",
        options: ["Find Matching Jobs", "Who might want me?", "My Application Status"],
      },
      {
        key: "domain",
        text: "What's your preferred domain?",
        options: ["Tech", "Design", "Marketing", "Finance", "Other"],
      },
      {
        key: "workType",
        text: "What work type do you prefer?",
        options: ["Remote", "Onsite", "Hybrid", "Any"],
      },
      {
        key: "budget",
        text: "What budget range works for you?",
        options: ["Under 10K", "10K-50K", "50K+", "Open to discuss"],
      },
      {
        key: "priority",
        text: "What matters most in a job?",
        options: ["Highest Paying", "Best Reputation Founder", "Short Duration", "Long Term Growth"],
      },
    ],
  },
  cofounder: {
    greeting:
      "Hey, I'm your **FoundU AI Assistant**! I can find the best co-founder roles matching your profile, or discover which founders might be looking for someone exactly like you. Let's go!",
    questions: [
      {
        key: "goal",
        text: "What are you looking for?",
        options: ["Find Co-Founder Roles", "Who might want me?", "Explore Startups"],
      },
      {
        key: "stage",
        text: "What startup stage interests you?",
        options: ["Idea Stage", "MVP Stage", "Early Revenue", "Growth Stage"],
      },
      {
        key: "domain",
        text: "What domain are you focused on?",
        options: ["Tech", "Product", "Marketing", "Finance", "Other"],
      },
      {
        key: "equity",
        text: "What equity range works for you?",
        options: ["Below 5%", "5-15%", "15%+", "Open to discuss"],
      },
      {
        key: "founderQuality",
        text: "What matters most in a founder?",
        options: ["Strong Track Record", "Verified Identity", "Domain Expert", "Cultural Fit"],
      },
    ],
  },
  visitor: {
    greeting:
      "Welcome to FoundU! I'm Genie, your AI Assistant. To get started, please tell me what you're looking for.",
    questions: [
      {
        key: "intent",
        text: "What type of category are you looking for?",
        options: ["Hire Talent (Founder)", "Find Jobs (Freelancer)", "Join Startup (Co-Founder)"],
      },
    ],
  },
};
/* ================================================================
   MOCK SUGGESTION DATA — used until backend is connected
   ================================================================ */
const MOCK_SUGGESTIONS = {
  founder: [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Full Stack Developer",
      avatarColor: "linear-gradient(135deg,#7c3aed,#06b6d4)",
      initials: "RS",
      matchScore: 94,
      credibility: "88-92",
      blue_tick_verified: true,
      green_tick_verified: true,
      golden_tick_verified: true,
      skills: ["React", "Node.js", "MongoDB"],
      isApplicant: true,
      explainPoints: [
        "Domain match: Tech/SaaS — exact match to your job",
        "88-92 Credibility Score based on history",
        "✅ Blue + 🟢 Green + 🏆 Golden tick verified",
      ],
    },
    {
      id: 2,
      name: "Sneha Patel",
      role: "React Native Developer",
      avatarColor: "linear-gradient(135deg,#ec4899,#8b5cf6)",
      initials: "SP",
      matchScore: 88,
      credibility: "82-88",
      blue_tick_verified: true,
      green_tick_verified: true,
      golden_tick_verified: false,
      skills: ["React Native", "Firebase", "UI/UX"],
      isApplicant: false,
      explainPoints: [
        "Hidden talent — hasn't applied yet but profile matches 88%",
        "Strong mobile dev background aligns with your requirements",
        "✅ Blue + 🟢 Green tick verified",
      ],
    },
  ],
  freelancer: [
    {
      id: 4,
      name: "TechVision Startup",
      role: "Hiring: Full Stack Developer",
      avatarColor: "linear-gradient(135deg,#0ea5e9,#6366f1)",
      initials: "TV",
      matchScore: 91,
      credibility: "90-95",
      blue_tick_verified: true,
      green_tick_verified: true,
      golden_tick_verified: true,
      skills: ["React", "Node.js", "AWS"],
      isApplicant: false,
      explainPoints: [
        "Your Tech/React skills match this job's requirements 91%",
        "Remote role — matches your work preference",
        "Budget ₹40K–₹60K — aligns with your expectations",
      ],
    },
  ],
  cofounder: [
    {
      id: 6,
      name: "EduSpark",
      role: "Co-Founder: Tech Lead Role",
      avatarColor: "linear-gradient(135deg,#a855f7,#ec4899)",
      initials: "ES",
      matchScore: 93,
      credibility: "87-93",
      blue_tick_verified: true,
      green_tick_verified: true,
      golden_tick_verified: true,
      skills: ["EdTech", "MVP Stage", "Equity: 15%"],
      isApplicant: false,
      explainPoints: [
        "Startup stage (MVP) matches your preference",
        "15% equity — within your preferred range",
        "Founder has ✅ Blue + 🟢 Green + 🏆 Golden tick verified",
      ],
    },
  ],
};
/* ================================================================
   HELPER UTILITIES
   ================================================================ */
const getScoreClass = (score) => {
  if (score >= 85) return "sc-score-high";
  if (score >= 70) return "sc-score-mid";
  return "sc-score-low";
};
const getScoreLabel = (score) => {
  if (score >= 90) return `${score}% Top Pick`;
  if (score >= 80) return `${score}% Strong`;
  return `${score}% Good Fit`;
};
const getCredibilityBadgeImg = (scoreStr) => {
  // scoreStr might be "88-92" (mock) or 88 (real)
  let score = 0;
  if (typeof scoreStr === "string" && scoreStr.includes("-")) {
    score = parseInt(scoreStr.split("-")[0]);
  } else {
    score = parseInt(scoreStr) || 0;
  }

  if (score >= 90) return badge9095;
  if (score >= 85) return badge8590;
  if (score >= 80) return badge8085;
  return badgeBelow80;
};
const avatarGradients = [
  "linear-gradient(135deg,#1d4ed8,#0284c7)",
  "linear-gradient(135deg,#2563eb,#0891b2)",
  "linear-gradient(135deg,#1e40af,#0369a1)",
  "linear-gradient(135deg,#3b82f6,#06b6d4)",
  "linear-gradient(135deg,#1d4ed8,#4338ca)",
];
/* ================================================================
   SUB-COMPONENTS
   ================================================================ */
/* Typing indicator */
function TypingIndicator() {
  return (
    <div className="sc-typing">
      <div className="sc-typing-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}
/* Single suggestion card */
function SuggestionCard({ candidate, onInvite, userRole }) {
  const [showExplain, setShowExplain] = useState(false);
  return (
    <div className="sc-card">
      <div className="sc-card-top">
        <div className="sc-card-left">
          <div
            className="sc-card-avatar"
            style={{ background: candidate.avatarColor || avatarGradients[candidate.id % 5] }}
          >
            {candidate.initials}
          </div>
          <div>
            <p className="sc-card-name">{candidate.name}</p>
            <p className="sc-card-role">
              {candidate.isApplicant ? "✉️ Applied" : "💎 Hidden Talent"} · {candidate.role}
            </p>
          </div>
        </div>
        <span className={`sc-score ${getScoreClass(candidate.matchScore)}`}>
          {getScoreLabel(candidate.matchScore)}
        </span>
      </div>
      {/* Stats row */}
      <div className="sc-card-stats">
        <div className="sc-cred-badge-container">
          <img src={getCredibilityBadgeImg(candidate.credibility)} alt="Credibility" className="sc-cred-img" />
          <span className="sc-cred-text">{candidate.credibility}</span>
        </div>
        <div className="sc-badges-row">
          {candidate.blue_tick_verified ? (
            <img src={blueBadge} alt="Blue Tick" className="sc-tick-img" title="Blue Tick — Identity Verified" />
          ) : null}
          {candidate.green_tick_verified ? (
            <img src={greenBadge} alt="Green Tick" className="sc-tick-img" title="Green Tick — 3+ Projects Done" />
          ) : null}
          {candidate.golden_tick_verified ? (
            <img src={goldenBadge} alt="Golden Tick" className="sc-tick-img" title="Golden Tick — Highly Active" />
          ) : null}
        </div>
      </div>
      {/* Skill tags */}
      <div className="sc-skills">
        {candidate.skills.map((s) => (
          <span key={s} className="sc-skill-tag">{s}</span>
        ))}
      </div>
      {/* Action buttons */}
      <div className="sc-card-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="sc-btn-explain"
          onClick={() => setShowExplain((p) => !p)}
        >
          {showExplain ? "▲ Hide" : "🔍 Why this match?"}
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="sc-btn-contact" 
            onClick={() => window.location.href = `/chatbox?userId=${candidate.id || candidate.user_id}`}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "8px 16px",
              borderRadius: "100px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "0.2s"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; }}
          >
            💬 Contact
          </button>
          <button className="sc-btn-invite" onClick={() => onInvite(candidate)}>
            {userRole === "founder" ? "📨 Invite" : "✉️ Apply"}
          </button>
        </div>
      </div>
      {/* Match explainer */}
      {showExplain && (
        <div className="sc-explain-box">
          <p>AI Match Analysis:</p>
          <ul>
            {candidate.explainPoints.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
/* Invite modal */
function InviteModal({ candidate, jobContext, onClose, onSend }) {
  const [msg, setMsg] = useState(
    `Hi ${candidate?.name?.split(" ")[0] || "there"},\n\nI found your profile through FoundU's AI matcher and think you'd be a great fit${jobContext ? ` for our open role` : ""}. Your credibility score and verified badges really stood out!\n\nWould you be interested in connecting?\n\nBest,\nFoundU`
  );
  const [sent, setSent] = useState(false);
  const handleSend = async () => {
    setSent(true);
    try {
      const currentUserId = getUserId();
      await api.post(`/api/ai/invite`, {
        sender_id: currentUserId,
        receiver_id: candidate.user_id || candidate.id, // candidate.id for jobs, user_id for candidates
        message: msg,
        job_id: jobContext
      });

      onSend();
      onClose();

      // IF it's a job (has jobContext), redirect to the job page for formal application
      if (jobContext && (getUserType() === "freelancer" || getUserType() === "cofounder")) {
        window.location.href = `/job/${jobContext}`;
      }
    } catch (error) {
      console.error("Invite Send Error:", error);
      toast.error("Failed to send invite notification.");
      setSent(false);
    }
  };
  return (
    <div className="sc-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sc-modal">
        <h4>📨 Invite {candidate?.name}</h4>
        <p>This will send a direct message + notification to {candidate?.name?.split(" ")[0]}.</p>
        <textarea
          rows={7}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="sc-modal-actions">
          <button className="sc-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="sc-modal-send" onClick={handleSend} disabled={sent}>
            {sent ? "✅ Sent!" : "Send Invite 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function SmartChatbot({ userRole: propRole, userId, isLoggedIn, activePopup, setActivePopup }) {
  const location = useLocation();
  /* ── Detect role from localStorage if not passed as prop ── */
  const userRole = propRole || getUserType() || "founder";
  /* ── Detect job_id from URL ─────────────────────────────── */
  const jobMatch = location.pathname.match(/\/job(?:posting)?[/=?]?(\d+)/i);
  const queryJobId = new URLSearchParams(location.search).get("job_id");
  const jobId = jobMatch?.[1] || queryJobId || null;
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(() => {
    try { const s = sessionStorage.getItem("ginnie_step"); return s ? JSON.parse(s) : 0; } catch(e){ return 0; }
  });
  const [messages, setMessages] = useState(() => {
    try { const s = sessionStorage.getItem("ginnie_messages"); return s ? JSON.parse(s) : []; } catch(e){ return []; }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [filters, setFilters] = useState(() => {
    try { const s = sessionStorage.getItem("ginnie_filters"); return s ? JSON.parse(s) : {}; } catch(e){ return {}; }
  });
  const [suggestions, setSuggestions] = useState(() => {
    try { const s = sessionStorage.getItem("ginnie_suggestions"); return s ? JSON.parse(s) : []; } catch(e){ return []; }
  });

  useEffect(() => {
    sessionStorage.setItem("ginnie_step", JSON.stringify(step));
    sessionStorage.setItem("ginnie_messages", JSON.stringify(messages));
    sessionStorage.setItem("ginnie_filters", JSON.stringify(filters));
    sessionStorage.setItem("ginnie_suggestions", JSON.stringify(suggestions));
  }, [step, messages, filters, suggestions]);
  const [inviteTarget, setInviteTarget] = useState(null);
  const [hasNotif, setHasNotif] = useState(true);
  const messagesEndRef = useRef(null);

  // Conversational AI States
  const [chatMode, setChatMode] = useState("matcher"); // "matcher" or "chat"
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationalMessages, setConversationalMessages] = useState([]);

  /* ── Pages where chatbot should be HIDDEN ───────────────── */
  const hiddenPaths = ["/login-signup", "/signup"];
  const shouldHide = hiddenPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith("/login-signup")
  );

  const flow = !isLoggedIn ? FLOWS.visitor : (FLOWS[userRole] || FLOWS.founder);
  /* ── Auto-scroll to bottom on new messages ──────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversationalMessages, isTyping]);

  /* ── Initialize chat when opened ───────────────────────── */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setHasNotif(false);
      startGreeting();
    }
  }, [isOpen]);
  /* ── Load chat history when conversational mode is active ── */
  useEffect(() => {
    if (isOpen && chatMode === "chat" && conversationalMessages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, chatMode]);

  const loadChatHistory = async () => {
    setIsTyping(true);
    try {
      const currentUserId = getUserId();
      const res = await api.get(`/api/ai/chat/history`, {
        params: { sessionId: `session-${currentUserId}` }
      });
      if (res.data.success && res.data.messages && res.data.messages.length > 0) {
        setConversationalMessages(res.data.messages.map(m => ({
          type: m.sender === 'user' ? 'user' : 'bot',
          text: m.message
        })));
      } else {
        setConversationalMessages([
          {
            type: "bot",
            text: `Hi there! I am **Ginnie**, your personalized FoundU Assistant. 
            
Ask me anything about your startup idea, competitor research, or let me know what kind of freelancers you need!`
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setConversationalMessages([
        {
          type: "bot",
          text: `Hi there! I am **Ginnie**, your personalized FoundU Assistant. How can I help you today?`
        }
      ]);
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userMsg = inputText.trim();
    setInputText("");
    setIsSending(true);

    setConversationalMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const currentUserId = getUserId();
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          message: userMsg,
          sessionId: `session-${currentUserId}`
        })
      });

      setIsTyping(false);

      if (!response.ok) {
        throw new Error("API returned an error response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let partialText = "";

      setConversationalMessages(prev => [...prev, { type: "bot", text: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunkText = decoder.decode(value, { stream: !done });

        const lines = chunkText.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.substring(6).trim();
            if (content === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(content);
              if (parsed.text) {
                partialText += parsed.text;
                setConversationalMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { type: "bot", text: partialText };
                  return updated;
                });
              } else if (parsed.toolCall) {
                const { name, args } = parsed.toolCall;
                let statusMsg = "";
                if (name === "search_freelancers") {
                  statusMsg = `\n\n*(Ginnie is searching the database for freelancers matching: ${args.skills.join(", ")})*\n\n`;
                } else if (name === "web_search") {
                  statusMsg = `\n\n*(Ginnie is scanning market intelligence for: "${args.query}")*\n\n`;
                } else if (name === "analyze_startup_idea") {
                  statusMsg = `\n\n*(Ginnie is initiating venture valuation diagnostics...)*\n\n`;
                }
                if (statusMsg) {
                  partialText += statusMsg;
                  setConversationalMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { type: "bot", text: partialText };
                    return updated;
                  });
                }
              }
            } catch (jsonErr) {
              // Ignore boundary errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Conversational streaming error:", error);
      toast.error("Failed to connect to Ginnie's AI core.");
      setConversationalMessages(prev => [
        ...prev,
        { type: "bot", text: "❌ Connection error. Please try again later." }
      ]);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleResetConversationalChat = async () => {
    if (isSending) return;
    try {
      const currentUserId = getUserId();
      await api.post(`/api/ai/chat/reset`, { sessionId: `session-${currentUserId}` });
      setConversationalMessages([]);
      loadChatHistory();
      toast.success("Conversation reset successfully.");
    } catch (err) {
      console.error("Failed to reset chat:", err);
      toast.error("Failed to reset conversation.");
    }
  };

  /* ── Reset when role/location changes ───────────────────── */
  useEffect(() => {
    const savedRole = sessionStorage.getItem("ginnie_role");
    if (savedRole && savedRole !== userRole) {
      setMessages([]);
      setStep(0);
      setFilters({});
      setSuggestions([]);
    }
    sessionStorage.setItem("ginnie_role", userRole);
  }, [userRole]);
  /* ── Helpers ────────────────────────────────────────────── */
  const addBotMsg = (text, delay = 0) => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { type: "bot", text }]);
        resolve();
      }, delay + 700);
    });
  };
  const addUserMsg = (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };
  const addCards = (cards) => {
    setMessages((prev) => [...prev, { type: "cards", cards }]);
  };
  /* ── Greeting flow ───────────────────────────────────────── */
  const startGreeting = async () => {
    setStep(0);
    await addBotMsg(flow.greeting, 200);
    // If founder on a job page, add context message
    if (userRole === "founder" && jobId) {
      await addBotMsg(`I can see you're viewing **Job #${jobId}**. I'll tailor my suggestions specifically for this posting!`, 300);
    }
    setStep(1);
  };
  /* ── Handle option click ─────────────────────────────────── */
  const handleOption = async (option) => {
    const currentQ = flow.questions[step - 1];
    if (!currentQ) return;
    
    // Record user answer
    addUserMsg(option);

    if (!isLoggedIn) {
      await addBotMsg("Great! Redirecting you to login to continue your journey...");
      
      // Determine role from option
      let targetRole = "founder";
      if (option.includes("Freelancer")) targetRole = "freelancer";
      if (option.includes("Co-Founder")) targetRole = "cofounder";

      setTimeout(() => {
        window.location.href = `/login-signup?role=${targetRole}`;
      }, 1500);
      return;
    }

    const newFilters = { ...filters, [currentQ.key]: option };
    setFilters(newFilters);
    const nextStep = step + 1;
    if (nextStep <= flow.questions.length) {
      // Next question
      const nextQ = flow.questions[nextStep - 1];
      await addBotMsg(`Got it! ${getTransitionLine(option)} — ${nextQ.text}`);
      setStep(nextStep);
    } else {
      // All questions done → show results
      await addBotMsg("Great! Analyzing all profiles using credibility scores, badge verification, and AI matching...");
      setStep("loading");

      try {
        const res = await api.post(`/api/ai/chat-suggestions`, {
          role: userRole,
          filters: newFilters
        });

        if (res.data.success) {
          const processedSuggestions = res.data.suggestions
            .map(s => ({
              ...s,
              name: s.full_name || s.job_title,
              role: s.user_type || s.domain,
              initials: (s.full_name || s.job_title || "?").substring(0, 2).toUpperCase(),
              credibility: s.credibility_score ? s.credibility_score : "70-75",
              skills: s.skills_description ? s.skills_description.split(",").slice(0, 3) : ["Verified Member", "FoundU Verified"]
            }))
            .filter(s => s.matchScore >= 70);

          setSuggestions(processedSuggestions);
          setStep("results");

          if (processedSuggestions.length === 0) {
            await addBotMsg("I've carefully scanned all platform members, but **we don't have suggestions related to these specific criteria right now**.");
            await addBotMsg("Don't worry! We've noted your requirements and **we will notify you soon** as soon as a matching profile is found or joins FoundU.");
          } else {
            addCards(processedSuggestions);
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: `✅ Found **${processedSuggestions.length} top matches** for you! These are real platform members ranked by AI:`,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("AI Assistant API Error:", err);
        const errorMsg = err.response?.data?.error || err.message;
        toast.error(`AI Assistant connection failed: ${errorMsg}`);
        console.log("Using backup MOCK_SUGGESTIONS due to error.");
        const mockData = MOCK_SUGGESTIONS[userRole] || MOCK_SUGGESTIONS.founder;
        setSuggestions(mockData);
        addCards(mockData);
        setStep("results");
      }
    }
  };
  /* Context-aware transition lines for natural conversation */
  const getTransitionLine = (option) => {
    const lines = {
      "Freelancer": "Looking for freelancers",
      "Co-Founder": "Looking for a co-founder",
      "Show me both": "Showing all talent types",
      "Tech": "Tech domain scoped",
      "Design": "Design domain scoped",
      "Marketing": "Marketing domain scoped",
      "Fresher": "Fresher-level preference noted",
      "Mid-Level": "Mid-level preference noted",
      "Senior": "Senior-level preference noted",
      "Any Level": "Open to any experience level",
      "Highest Rating": "Prioritizing top-rated talent",
      "Best Credibility": "Prioritizing most credible profiles",
      "Exact Skill Match": "Prioritizing skill-exact matches",
      "Discover Hidden Talent": "Including hidden talent in search",
      "Yes, show hidden talent": "Including proactive talent discovery",
      "Applicants only": "Limiting to applicants only",
    };
    return lines[option] || "Preference noted";
  };
  /* ── Reset chat ──────────────────────────────────────────── */
  const handleReset = () => {
    setMessages([]);
    setStep(0);
    setFilters({});
    setSuggestions([]);
    setTimeout(startGreeting, 100);
  };
  /* ── Current options to display ─────────────────────────── */
  const currentOptions = () => {
    if (step === "results") {
      return ["Start Over", "Refine Filters"];
    }
    if (typeof step === "number" && step >= 1 && step <= flow.questions.length) {
      return flow.questions[step - 1].options;
    }
    return [];
  };
  const handleOptionClickWrapper = (opt) => {
    if (opt === "Start Over" || opt === "Refine Filters") {
      handleReset();
    } else {
      handleOption(opt);
    }
  };
  /* ── Render a single message ─────────────────────────────── */
  const renderMessage = (msg, idx) => {
    if (msg.type === "bot") {
      return (
        <div key={idx} className="sc-msg-bot">
          <div
            className="sc-msg-bot-bubble"
            dangerouslySetInnerHTML={{
              __html: msg.text
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      );
    }
    if (msg.type === "user") {
      return (
        <div key={idx} className="sc-msg-user">
          <div className="sc-msg-user-bubble">{msg.text}</div>
        </div>
      );
    }
    if (msg.type === "cards") {
      return (
        <div key={idx} className="sc-cards">
          {msg.cards.map((c) => (
            <SuggestionCard
              key={c.id}
              candidate={c}
              userRole={userRole}
              onInvite={(candidate) => {
                if (userRole === "founder") {
                  setInviteTarget(candidate);
                } else {
                  window.location.href = `/job-description?job_id=${candidate.id}`;
                }
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };
  /* ── Page title for context display ─────────────────────── */
  const getPageContext = () => {
    if (userRole === "founder" && jobId) return `Job #${jobId}`;
    const map = {
      "/startup-dashboard": "Your Dashboard",
      "/freelancer-dashboard": "Your Dashboard",
      "/cofounder-dashboard": "Your Dashboard",
      "/freelancer-jobs": "Browse Jobs",
      "/cofounder-jobs": "Browse Jobs",
    };
    return map[location.pathname] || null;
  };
  /* ================================================================
     RENDER
     ================================================================ */
  if (shouldHide) return null;

  // Hide FAB when another popup is open
  if (activePopup && activePopup !== "smartchatbot" && !isOpen) return null;

  return (

    <>
      {/* Floating trigger button */}
      <button
        className={`sc-fab${isOpen ? " open" : ""}`}
        onClick={() => {
          const next = !isOpen;
          setIsOpen(next);
          setActivePopup(next ? "smartchatbot" : null);
        }}
        aria-label="Open AI Assistant"
      >
        <span className="sc-fab-icon">
          {isOpen ? "✕" : (
            <DotLottieReact
              src="https://lottie.host/7d07affa-7420-4fa7-b118-0834ce127b1b/M1WQe2EcHa.lottie"
              loop
              autoplay
              style={{ width: "200px", height: "200px" }}
            />
          )}
        </span>
        {hasNotif && !isOpen && <span className="sc-notif-dot" />}
      </button>
      {/* Chat popup */}
      {isOpen && (
        <div className="sc-popup">
          {/* Header */}
          <div className="sc-header">
            <div className="sc-header-left">
              <div className="sc-avatar">
                <DotLottieReact
                  src="https://lottie.host/7d07affa-7420-4fa7-b118-0834ce127b1b/M1WQe2EcHa.lottie"
                  loop
                  autoplay
                  style={{ width: "56px", height: "56px" }}
                />
                <span className="sc-avatar-online" />
              </div>
              <div className="sc-header-info">
                <h3>FoundU Genie</h3>
                <p>
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", marginRight: 4 }} />
                  Online · AI-Powered
                  {getPageContext() && (
                    <span style={{ marginLeft: 6, color: "#c4b5fd" }}>
                      · {getPageContext()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="sc-header-actions">
              {(chatMode === "chat" || step > 0) && (
                <button
                  className="sc-icon-btn"
                  onClick={chatMode === "chat" ? handleResetConversationalChat : handleReset}
                  title="Restart chat"
                >
                  🔄
                </button>
              )}
              <button
                className="sc-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="sc-modes-tab">
            <button
              className={`sc-tab-btn ${chatMode === 'matcher' ? 'active' : ''}`}
              onClick={() => setChatMode('matcher')}
            >
              ⚡ Quick Matcher
            </button>
            <button
              className={`sc-tab-btn ${chatMode === 'chat' ? 'active' : ''}`}
              onClick={() => setChatMode('chat')}
            >
              💬 Chat with Ginnie
            </button>
          </div>

          {/* Messages */}
          <div className="sc-messages">
            {chatMode === "matcher" && step === 0 && messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#4b5563" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>
                  <DotLottieReact
                    src="https://lottie.host/7d07affa-7420-4fa7-b118-0834ce127b1b/M1WQe2EcHa.lottie"
                    loop
                    autoplay
                    style={{ width: "120px", height: "120px", margin: "0 auto" }}
                  />
                </div>
                <p style={{ fontSize: 13 }}>Starting AI Assistant...</p>
              </div>
            )}
            {(chatMode === "chat" ? conversationalMessages : messages).map((msg, idx) => renderMessage(msg, idx))}
            {isTyping && (
              <TypingIndicator />
            )}
            {chatMode === "matcher" && step === "loading" && !isTyping && (
              <div style={{ textAlign: "center", padding: "16px", color: "#3b82f6", fontSize: 12 }}>
                <div style={{ marginBottom: 8 }}>🔍 Scanning profiles...</div>
                <div style={{ fontSize: 11, color: "#93c5fd", marginBottom: 10 }}>
                  Analyzing credibility scores, badges & AI matching...
                </div>
                <div style={{
                  height: 3, background: "rgba(59,130,246,0.15)",
                  borderRadius: 3, overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    background: "linear-gradient(90deg,#1d4ed8,#93c5fd)",
                    borderRadius: 3,
                    animation: "sc-loading-bar 1.6s ease-in-out infinite"
                  }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Option buttons or Chat Input form */}
          {chatMode === "matcher" ? (
            currentOptions().length > 0 && !isTyping && step !== "loading" && (
              <div className="sc-options">
                {currentOptions().map((opt) => (
                  <button
                    key={opt}
                    className={
                      opt === "Start Over" || opt === "Refine Filters"
                        ? "sc-reset-btn"
                        : "sc-option-btn"
                    }
                    onClick={() => handleOptionClickWrapper(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )
          ) : (
            <form onSubmit={handleSendMessage} className="sc-input-form">
              <input
                type="text"
                placeholder="Ask Ginnie anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSending}
              />
              <button type="submit" disabled={isSending || !inputText.trim()}>
                {isSending ? "..." : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
      {/* Invite modal */}
      {inviteTarget && (
        <InviteModal
          candidate={inviteTarget}
          jobContext={jobId}
          onClose={() => setInviteTarget(null)}
          onSend={() => {
            toast.success(`✅ Invite sent to ${inviteTarget.name}!`, {
              theme: "dark",
              icon: "📨",
            });
            setInviteTarget(null);
          }}
        />
      )}
    </>
  );
}
