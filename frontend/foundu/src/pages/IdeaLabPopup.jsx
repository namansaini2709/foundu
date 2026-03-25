import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Lightbulb,
  X,
  Rocket,
  Target,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Search,
  Zap,
  Shield,
  Users,
  BarChart3,
  Globe,
  Briefcase,
  IndianRupee,
  MessageSquare,
  History,
} from "lucide-react";
import "./IdeaLabPopup.css";
const API_BASE = `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`}/api`;
const IdeaLabPopup = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'discover' or 'validate'
  const [phase, setPhase] = useState("start"); // 'start', 'input', 'loading', 'results'
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ideaText, setIdeaText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  // QUESTIONS FOR DISCOVERY
  const QUESTIONS = [
    {
      id: "bg",
      q: "Aapka professional background kya hai?",
      opts: [
        { v: "Tech / Engineering", e: "💻" },
        { v: "Business / Finance", e: "📊" },
        { v: "Design / Creative", e: "🎨" },
        { v: "Other", e: "✨" },
      ],
    },
    {
      id: "skills",
      q: "Aapki core skills kya hain?",
      opts: [
        { v: "Development / AI", e: "⚙️" },
        { v: "Marketing / Sales", e: "📢" },
        { v: "Operations / Logistics", e: "📦" },
        { v: "Product Management", e: "🎯" },
      ],
    },
    {
      id: "passions",
      q: "Aap kis sector mein passionate hain?",
      opts: [
        { v: "FinTech / Crypto", e: "💰" },
        { v: "AgriTech / Sustainability", e: "🌱" },
        { v: "HealthTech / Wellness", e: "🏥" },
        { v: "EdTech / Learning", e: "🎓" },
      ],
    },
    {
      id: "capital",
      q: "Starting capital kitna hai?",
      opts: [
        { v: "₹0–50K (Lean)", e: "🪙" },
        { v: "₹50K–5L (Moderate)", e: "💵" },
        { v: "₹5L+ (Serious)", e: "🏦" },
      ],
    },
    {
      id: "ambition",
      q: "Aapka primary goal kya hai?",
      opts: [
        { v: "Lifestyle Business", e: "🏠" },
        { v: "Hyper-Growth Scale", e: "🚀" },
        { v: "Social Impact", e: "🌍" },
        { v: "Side Hustle", e: "⚡" },
      ],
    },
  ];
  useEffect(() => {
    if (isOpen && userId) fetchHistory();
  }, [isOpen, userId]);
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/ideas/user/${userId}`);
      if (res.data.success) setHistory(res.data.ideas);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };
  const handleRunAnalysis = (text, customTitle = null) => {
    setLoading(true);
    setPhase("loading");
    // MOCK AI PIPELINE (Dummy Data Only)
    setTimeout(() => {
      const mockReport = {
        title: customTitle || text.substring(0, 30) + "...",
        refinedIdea:
          mode === "discover"
            ? `Based on your ${answers.bg} background and ${answers.skills} skills, we recommend: **A Smart ${answers.passions} Platform** leveraging AI to optimize ${answers.bg === "Tech / Engineering" ? "backend efficiency" : "market reach"}.`
            : "A comprehensive hyper-local marketplace platform connecting organic farmers directly with urban consumers using blockchain for transparency and AI for logistics optimization.",
        roadmap: [
          "Foundation: Market research, entity registration and team assembly.",
          "Build: MVP development, supply chain integration and pilot testing.",
          "Scaling: Brand building, aggressive marketing and multi-city expansion.",
        ],
        team: {
          size: "4-6 Key Roles",
          roles: [
            "Tech Lead (Full Stack)",
            "Operations Manager",
            "Supply Chain Expert",
            "Marketing Strategist",
          ],
        },
        vendors: [
          "Cloud Hosting (AWS/Azure)",
          "Logistics Partner (Delhivery/BlueDart)",
          "Payment Gateway (Razorpay)",
          "Packaging Supplies",
        ],
        support: {
          foundu: [
            "Access to vetted Tech Talent",
            "Seed Funding Network",
            "Incubation Support",
            "Legal & Compliance tools",
          ],
          user: [
            "Product Vision",
            "Core Management",
            "Initial Operations",
            "Domain Expertise",
          ],
        },
        talent: [
          { name: "Rahul Sharma", role: "Sr. Full Stack Dev", score: 94 },
          { name: "Priya Patel", role: "Ops Specialist", score: 88 },
          { name: "Ankit Verma", role: "Marketing Lead", score: 91 },
        ],
      };
      setReportData(mockReport);
      setPhase("results");
      setLoading(false);
      toast.success("Venture Analysis Complete!");
    }, 3000);
  };
  const handleBack = () => {
    if (phase === "results") setPhase("start");
    else if (phase === "input" && qIdx > 0) setQIdx(qIdx - 1);
    else {
      setPhase("start");
      setMode(null);
    }
  };
  if (!isOpen)
    return (
      <div className="fab-idea" onClick={() => setIsOpen(true)}>
        <Lightbulb size={28} />
      </div>
    );
  return (
    <div className="venture-modal-overlay">
      <div className="venture-modal-container">
        {/* SIDEBAR */}
        <aside className="venture-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-mark">V</div>
              <div className="sidebar-name">VENTURE</div>
            </div>
          </div>
          <div className="sidebar-history">
            <div className="history-label">Idea History</div>
            {history.length > 0 ? (
              history.map((h) => (
                <div
                  key={h.id}
                  className="history-item"
                  onClick={() => handleRunAnalysis(h.description)}
                >
                  <History size={14} />
                  <span>{h.title}</span>
                </div>
              ))
            ) : (
              <div className="history-item empty">No previous brainstorms</div>
            )}
          </div>
        </aside>
        {/* MAIN AREA */}
        <main className="venture-main">
          <header className="venture-header">
            <div className="v-header-left">
              {phase !== "start" && (
                <button
                  className="back-btn"
                  onClick={handleBack}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--tx2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}
            </div>
            <button className="venture-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </header>
          <div className="venture-content">
            {phase === "start" && (
              <div className="venture-land">
                <h1 className="land-h1">
                  India ka <span>Smartest</span>
                  <br />
                  Business Tool
                </h1>
                <p className="land-sub">
                  5 AI Engines working together to build your vision.
                </p>
                <div className="mode-grid">
                  <div
                    className="mode-card"
                    onClick={() => {
                      setMode("discover");
                      setPhase("input");
                      setQIdx(0);
                    }}
                  >
                    <div className="mc-glyph">🧭</div>
                    <div
                      className="mc-label"
                      style={{
                        color: "var(--saffron)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Idea Nahi Hai?
                    </div>
                    <h3 className="mc-title">Idea Discovery</h3>
                    <p className="mc-desc">
                      Apne background ke hisab se top startup ideas generate
                      karein.
                    </p>
                  </div>
                  <div
                    className="mode-card alt"
                    onClick={() => {
                      setMode("validate");
                      setPhase("input");
                    }}
                  >
                    <div
                      className="mc-glyph"
                      style={{ background: "rgba(56,178,255,0.1)" }}
                    >
                      ⚡
                    </div>
                    <div
                      className="mc-label"
                      style={{
                        color: "var(--sky)",
                        fontSize: "10px",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      Idea Hai? Validate Karo
                    </div>
                    <h3 className="mc-title">Venture Validation</h3>
                    <p className="mc-desc">
                      Detailed market research, competitor mapping & cost
                      analysis.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {phase === "input" && (
              <div className="venture-flow">
                {mode === "discover" ? (
                  <div className="qcard">
                    <div className="q-badge">
                      STEP {qIdx + 1} OF {QUESTIONS.length}
                    </div>
                    <h2 className="q-text">{QUESTIONS[qIdx].q}</h2>
                    <div className="q-grid">
                      {QUESTIONS[qIdx].opts.map((o) => (
                        <button
                          key={o.v}
                          className={`q-opt ${answers[QUESTIONS[qIdx].id] === o.v ? "sel" : ""}`}
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              [QUESTIONS[qIdx].id]: o.v,
                            })
                          }
                        >
                          <span>{o.e}</span> {o.v}
                        </button>
                      ))}
                    </div>
                    <button
                      className="q-next"
                      onClick={() =>
                        qIdx < QUESTIONS.length - 1
                          ? setQIdx(qIdx + 1)
                          : handleRunAnalysis("Discovery based on profile")
                      }
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="qcard">
                    <div className="q-badge">VALIDATION ENGINE</div>
                    <h2 className="q-text">Describe your startup vision</h2>
                    <div className="input-group" style={{ marginTop: "20px" }}>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--tx3)",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                          display: "block",
                        }}
                      >
                        Idea Name
                      </label>
                      <input
                        type="text"
                        className="idea-in"
                        style={{
                          width: "100%",
                          background: "var(--ink3)",
                          border: "1px solid var(--bdr2)",
                          borderRadius: "10px",
                          padding: "12px",
                          color: "var(--tx)",
                          outline: "none",
                          marginBottom: "16px",
                        }}
                        placeholder="e.g. AgriChain India"
                        value={answers.tempTitle || ""}
                        onChange={(e) =>
                          setAnswers({ ...answers, tempTitle: e.target.value })
                        }
                      />
                      <label
                        style={{
                          fontSize: "11px",
                          color: "var(--tx3)",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                          display: "block",
                        }}
                      >
                        Idea Description
                      </label>
                      <textarea
                        className="idea-ta"
                        style={{
                          width: "100%",
                          minHeight: "120px",
                          background: "var(--ink3)",
                          border: "1px solid var(--bdr2)",
                          borderRadius: "10px",
                          padding: "12px",
                          color: "var(--tx)",
                          outline: "none",
                        }}
                        placeholder="Example: Ek platform jo India ke artisans ko direct global buyers se connect kare..."
                        value={ideaText}
                        onChange={(e) => setIdeaText(e.target.value)}
                      />
                    </div>
                    <button
                      className="q-next"
                      onClick={() =>
                        handleRunAnalysis(ideaText, answers.tempTitle)
                      }
                    >
                      Run Deep Analysis <Zap size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
            {phase === "loading" && (
              <div className="v-loader">
                <div className="loader-orb" />
                <h2 className="land-h1" style={{ fontSize: "24px" }}>
                  AI Engines Analysis...
                </h2>
                <p className="land-sub">
                  Running Market, Competition & Strategy Engines
                </p>
              </div>
            )}
            {phase === "results" && reportData && (
              <div className="results-container">
                <div className="verdict-hero">
                  <div className="verdict-badge">
                    PROCESSED BY VENTURE ENGINES
                  </div>
                  <h1
                    className="verdict-name"
                    style={{ color: "var(--primary)" }}
                  >
                    Optimization Report ✨
                  </h1>
                  <p
                    className="land-sub"
                    style={{ margin: "8px 0", fontSize: "14px" }}
                  >
                    FoundU AI has analyzed your pitch and generated a strategic
                    roadmap.
                  </p>
                </div>
                <div
                  className="results-sections"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {/* 1. REFINED IDEA */}
                  <section className="res-section">
                    <h4
                      style={{
                        color: "var(--secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Sparkles size={18} /> Refined Idea
                    </h4>
                    <div
                      style={{
                        background: "var(--ink2)",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid var(--bdr)",
                        fontSize: "15px",
                        lineHeight: "1.6",
                      }}
                    >
                      {reportData.refinedIdea}
                    </div>
                  </section>
                  {/* 2. ROADMAP */}
                  <section className="res-section">
                    <h4
                      style={{
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Target size={18} /> Phase-wised Roadmap
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {reportData.roadmap.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "var(--ink2)",
                            padding: "12px 16px",
                            borderRadius: "12px",
                            borderLeft: "4px solid var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span style={{ fontWeight: "800", opacity: 0.5 }}>
                            0{idx + 1}
                          </span>
                          <span style={{ fontSize: "14px" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                  {/* 3. TEAM & VENDORS */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <section className="res-section">
                      <h4
                        style={{
                          color: "var(--sky)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <Users size={18} /> Team Size & Roles
                      </h4>
                      <div
                        style={{
                          background: "var(--ink2)",
                          padding: "16px",
                          borderRadius: "16px",
                          border: "1px solid var(--bdr)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "18px",
                            fontWeight: "800",
                            marginBottom: "8px",
                          }}
                        >
                          {reportData.team.size}
                        </p>
                        <ul
                          style={{
                            paddingLeft: "16px",
                            fontSize: "13px",
                            color: "var(--tx2)",
                          }}
                        >
                          {reportData.team.roles.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </section>
                    <section className="res-section">
                      <h4
                        style={{
                          color: "var(--jade)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <Briefcase size={18} /> Required Vendors
                      </h4>
                      <div
                        style={{
                          background: "var(--ink2)",
                          padding: "16px",
                          borderRadius: "16px",
                          border: "1px solid var(--bdr)",
                        }}
                      >
                        <ul
                          style={{
                            paddingLeft: "16px",
                            fontSize: "13px",
                            color: "var(--tx2)",
                          }}
                        >
                          {reportData.vendors.map((v, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>
                  </div>
                  {/* 4. FOUNDU SUPPORT */}
                  <section className="res-section">
                    <h4
                      style={{
                        color: "var(--secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Shield size={18} /> How FoundU Helps You
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(52, 211, 153, 0.05)",
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid rgba(52, 211, 153, 0.2)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: "var(--secondary)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          What FoundU Provides
                        </p>
                        <ul
                          style={{
                            fontSize: "13px",
                            listStyle: "none",
                            padding: 0,
                          }}
                        >
                          {reportData.support.foundu.map((s, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                              ✅ {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid var(--bdr)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: "var(--tx2)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          What You Provide
                        </p>
                        <ul
                          style={{
                            fontSize: "13px",
                            listStyle: "none",
                            padding: 0,
                          }}
                        >
                          {reportData.support.user.map((s, i) => (
                            <li key={i} style={{ marginBottom: "4px" }}>
                              👤 {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>
                  {/* 5. SUGGESTED TALENT */}
                  <section
                    className="res-section"
                    style={{ marginBottom: "20px" }}
                  >
                    <h4
                      style={{
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <Users size={18} /> Suggested Talent Profiles
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {reportData.talent.map((t, i) => (
                        <div
                          key={i}
                          style={{
                            background: "var(--ink2)",
                            padding: "16px",
                            borderRadius: "16px",
                            border: "1px solid var(--bdr)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: "700", fontSize: "14px" }}>
                              {t.name}
                            </p>
                            <p
                              style={{ fontSize: "12px", color: "var(--tx2)" }}
                            >
                              {t.role}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p
                              style={{
                                fontSize: "10px",
                                color: "var(--secondary)",
                                fontWeight: "800",
                              }}
                            >
                              CREDIBILITY
                            </p>
                            <p style={{ fontSize: "16px", fontWeight: "900" }}>
                              {t.score}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <button
                  className="q-next"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    margin: "24px 0 40px",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  Save to Roadmap & Close
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default IdeaLabPopup;
