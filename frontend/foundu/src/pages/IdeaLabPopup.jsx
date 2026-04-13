import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import api from "../utils/axiosConfig";
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
const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;
const IdeaLabPopup = ({ userId, activePopup, setActivePopup }) => {
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
      const res = await api.get(`${API_BASE}/ideas/user/${userId}`);
      if (res.data.success) setHistory(res.data.ideas);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };
  const loadFromHistory = (h) => {
    if (h.report) {
      setReportData(h.report);
      setPhase("results");
    } else {
      // Re-run for legacy records without a report
      handleRunAnalysis(h.description, h.title);
    }
  };
  const handleRunAnalysis = async (text, customTitle = null) => {
    setLoading(true);
    setPhase("loading");

    try {
      const response = await api.post(`${API_BASE}/ai/analyze-idea`, {
        mode: mode,
        text: text,
        context: mode === "discover" ? answers : { title: customTitle },
      });

      if (response.data.success) {
        const aiData = response.data.data;

        const formattedReport = {
          title:
            customTitle ||
            (text.length > 30 ? text.substring(0, 30) + "..." : text),
          refinedIdea: aiData.refinedIdea,
          marketAnalysis: aiData.marketAnalysis || null,
          competition: aiData.competition || [],
          revenueModel: aiData.revenueModel || null,
          roadmap: aiData.roadmap || [],
          team: {
            size: aiData.team?.size || "Not specified",
            roles: aiData.team?.roles || [],
          },
          vendors: aiData.vendors || [],
          risks: aiData.risks || [],
          support: {
            foundu: aiData.support?.foundu || [],
            user: aiData.support?.user || [],
          },
          talentRoles: aiData.talentRoles || [],
          realTalent: aiData.realTalent || [],
        };

        setReportData(formattedReport);
        setPhase("results");
        toast.success("Venture Analysis Complete!");

        // Save to DB with full report
        try {
          await api.post(`${API_BASE}/ideas/create`, {
            user_id: userId,
            title: formattedReport.title,
            description: text,
            report: formattedReport,
          });
          fetchHistory();
        } catch (saveErr) {
          console.error("Save to DB failed:", saveErr);
        }
      } else {
        throw new Error("AI analysis failed");
      }
    } catch (error) {
      console.error("Idea Lab AI Error:", error);
      toast.error("AI Analysis failed. Showing sample data.");

      setReportData({
        title: "Analysis Unavailable",
        refinedIdea:
          "We couldn't reach the AI engine right now. Please try again later.",
        marketAnalysis: null,
        competition: [],
        revenueModel: null,
        roadmap: ["Step 1: Reconnect", "Step 2: Retry"],
        team: { size: "?", roles: [] },
        vendors: [],
        risks: [],
        support: { foundu: [], user: [] },
        talentRoles: [],
        realTalent: [],
      });
      setPhase("results");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (phase === "results") setPhase("start");
    else if (phase === "input" && qIdx > 0) setQIdx(qIdx - 1);
    else {
      setPhase("start");
      setMode(null);
    }
  };
  if (!isOpen) {
    // Hide FAB when another popup is open
    if (activePopup && activePopup !== "idealab") return null;
    return (
      <div
        className="fab-idea"
        onClick={() => {
          setIsOpen(true);
          setActivePopup("idealab");
        }}
      >
        <DotLottieReact
          src="https://lottie.host/8c864797-eeb7-4343-b267-f6025eac61c4/yAkSQSiKsv.lottie"
          loop
          autoplay
          style={{ width: "200px", height: "120px" }}
        />
      </div>
    );
  }
  return (
    <div className="venture-modal-overlay">
      <div className="venture-modal-container">
        {/* SIDEBAR */}
        <aside className="venture-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-mark">I</div>
              <span className="sidebar-name">Idea Lab</span>
            </div>
          </div>
          <div className="sidebar-history">
            <div className="history-label">Idea History</div>
            {history.length > 0 ? (
              history.map((h) => (
                <div
                  key={h.id}
                  className="history-item"
                  onClick={() => loadFromHistory(h)}
                >
                  <History size={14} />
                  <span>{h.title}</span>
                  <ChevronRight size={12} className="h-arrow" />
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
                <button className="back-btn" onClick={handleBack}>
                  <ArrowLeft size={18} /> Back
                </button>
              )}
            </div>
            <button
              className="venture-close"
              onClick={() => {
                setIsOpen(false);
                setActivePopup(null);
              }}
            >
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
                      Step {qIdx + 1} of {QUESTIONS.length}
                    </div>
                    <h2 className="q-text">{QUESTIONS[qIdx].q}</h2>
                    <div className="q-grid">
                      {QUESTIONS[qIdx].opts.map((o) => (
                        <button
                          key={o.v}
                          className={`q-opt ${answers[QUESTIONS[qIdx].id] === o.v ? "sel" : ""
                            }`}
                          onClick={() =>
                            setAnswers({
                              ...answers,
                              [QUESTIONS[qIdx].id]: o.v,
                            })
                          }
                        >
                          <span className="q-emoji">{o.e}</span> {o.v}
                        </button>
                      ))}
                    </div>
                    <button
                      className="q-next"
                      onClick={() =>
                        qIdx < QUESTIONS.length - 1
                          ? setQIdx(qIdx + 1)
                          : handleRunAnalysis(
                            `Analyze discovery profile: ${JSON.stringify(answers)}`,
                            "New Venture Discovery",
                          )
                      }
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="qcard">
                    <div className="q-badge">VALIDATION ENGINE</div>
                    <h2 className="q-text">Describe your startup vision</h2>
                    <div className="v-form">
                      <label className="v-label">Idea Name</label>
                      <input
                        type="text"
                        className="v-input"
                        placeholder="e.g. AgriChain India"
                        value={answers.tempTitle || ""}
                        onChange={(e) =>
                          setAnswers({ ...answers, tempTitle: e.target.value })
                        }
                      />
                      <label className="v-label">Idea Description</label>
                      <textarea
                        className="v-textarea"
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
                <h2 className="land-h1-mini">AI Engines Analysis...</h2>
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
                  <h1 className="verdict-name">
                    {reportData.title || "Venture Report"}
                  </h1>
                  <p className="verdict-sub">
                    FoundU AI has analyzed your pitch with market research,
                    competition mapping, and strategic planning.
                  </p>
                </div>
                <div className="results-sections">
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

                  {/* 2. MARKET ANALYSIS */}
                  {reportData.marketAnalysis && (
                    <section className="res-section">
                      <h4 className="res-h4 sky">
                        <BarChart3 size={18} /> Market Analysis
                      </h4>
                      <div className="res-grid-3">
                        {[
                          {
                            label: "TAM",
                            value: reportData.marketAnalysis.tam,
                            color: "#3b82f6",
                          },
                          {
                            label: "SAM",
                            value: reportData.marketAnalysis.sam,
                            color: "#8b5cf6",
                          },
                          {
                            label: "SOM",
                            value: reportData.marketAnalysis.som,
                            color: "#22c55e",
                          },
                        ].map((m, i) => (
                          <div key={i} className="res-card-mini center">
                            <p
                              className="res-mini-label"
                              style={{ color: m.color }}
                            >
                              {m.label}
                            </p>
                            <p className="res-mini-value">{m.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="res-grid-2 mt-12">
                        <div className="res-card-mini">
                          <p className="res-mini-label">Target Audience</p>
                          <p className="res-text-small">
                            {reportData.marketAnalysis.targetAudience}
                          </p>
                        </div>
                        <div className="res-card-mini">
                          <p className="res-mini-label">Growth Rate</p>
                          <p className="res-text-small">
                            {reportData.marketAnalysis.growthRate}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* 3. COMPETITION */}
                  {reportData.competition.length > 0 && (
                    <section className="res-section">
                      <h4
                        style={{
                          color: "#f59e0b",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <Target size={18} /> Competitive Landscape
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {reportData.competition.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              background: "var(--ink2)",
                              padding: "16px",
                              borderRadius: "12px",
                              border: "1px solid var(--bdr)",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "800",
                                fontSize: "15px",
                                marginBottom: "8px",
                                color: "#f59e0b",
                              }}
                            >
                              {c.name}
                            </p>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "8px",
                                fontSize: "12px",
                              }}
                            >
                              <div>
                                <p
                                  style={{
                                    fontWeight: "700",
                                    color: "#22c55e",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Strength
                                </p>
                                <p style={{ color: "var(--tx2)" }}>
                                  {c.strength}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontWeight: "700",
                                    color: "#ef4444",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Weakness
                                </p>
                                <p style={{ color: "var(--tx2)" }}>
                                  {c.weakness}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontWeight: "700",
                                    color: "#3b82f6",
                                    marginBottom: "2px",
                                  }}
                                >
                                  Your Edge
                                </p>
                                <p style={{ color: "var(--tx2)" }}>
                                  {c.yourEdge}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 4. REVENUE MODEL */}
                  {reportData.revenueModel && (
                    <section className="res-section">
                      <h4
                        style={{
                          color: "#22c55e",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <IndianRupee size={18} /> Revenue Model
                      </h4>
                      <div
                        style={{
                          background: "var(--ink2)",
                          padding: "16px",
                          borderRadius: "16px",
                          border: "1px solid var(--bdr)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                color: "var(--tx3)",
                                textTransform: "uppercase",
                                marginBottom: "4px",
                              }}
                            >
                              Primary Model
                            </p>
                            <p style={{ fontSize: "14px", fontWeight: "700" }}>
                              {reportData.revenueModel.primaryModel}
                            </p>
                          </div>
                          <div>
                            <p
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                color: "var(--tx3)",
                                textTransform: "uppercase",
                                marginBottom: "4px",
                              }}
                            >
                              12-Month Projection
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#22c55e",
                              }}
                            >
                              {reportData.revenueModel.monthlyProjection}
                            </p>
                          </div>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                          <p
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              color: "var(--tx3)",
                              textTransform: "uppercase",
                              marginBottom: "4px",
                            }}
                          >
                            Pricing Strategy
                          </p>
                          <p style={{ fontSize: "13px", color: "var(--tx2)" }}>
                            {reportData.revenueModel.pricingStrategy}
                          </p>
                        </div>
                        {reportData.revenueModel.additionalStreams && (
                          <div>
                            <p
                              style={{
                                fontSize: "10px",
                                fontWeight: "800",
                                color: "var(--tx3)",
                                textTransform: "uppercase",
                                marginBottom: "4px",
                              }}
                            >
                              Additional Revenue Streams
                            </p>
                            <ul
                              style={{
                                paddingLeft: "16px",
                                fontSize: "13px",
                                color: "var(--tx2)",
                              }}
                            >
                              {reportData.revenueModel.additionalStreams.map(
                                (s, i) => (
                                  <li key={i}>{s}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* 5. ROADMAP */}
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
                      <Rocket size={18} /> Phase-wise Roadmap
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

                  {/* 6. RISKS */}
                  {reportData.risks.length > 0 && (
                    <section className="res-section">
                      <h4
                        style={{
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <Shield size={18} /> Risks & Mitigation
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {reportData.risks.map((r, i) => (
                          <div
                            key={i}
                            style={{
                              background: "var(--ink2)",
                              padding: "14px 16px",
                              borderRadius: "12px",
                              border: "1px solid rgba(239,68,68,0.2)",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "700",
                                fontSize: "13px",
                                color: "#ef4444",
                                marginBottom: "4px",
                              }}
                            >
                              {r.risk}
                            </p>
                            <p
                              style={{ fontSize: "12px", color: "var(--tx2)" }}
                            >
                              {r.mitigation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 7. TEAM & VENDORS */}
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
                        <Briefcase size={18} /> Required Tools & Vendors
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

                  {/* 8. FOUNDU SUPPORT */}
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
                              {s}
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
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* 9. REAL TALENT FROM FOUNDUU */}
                  {reportData.realTalent &&
                    reportData.realTalent.length > 0 && (
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
                          <Users size={18} /> Real Talent on FoundU
                        </h4>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--tx3)",
                            marginBottom: "12px",
                          }}
                        >
                          These are actual verified professionals from the
                          FoundU platform who could help build this venture.
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {reportData.realTalent.map((t, i) => (
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
                                <p
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "14px",
                                  }}
                                >
                                  {t.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--tx2)",
                                  }}
                                >
                                  {t.role}
                                </p>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "var(--tx3)",
                                    marginTop: "2px",
                                  }}
                                >
                                  {t.experience}
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
                                <p
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "900",
                                  }}
                                >
                                  {t.credibility}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* 10. AI-SUGGESTED ROLES */}
                  {reportData.talentRoles &&
                    reportData.talentRoles.length > 0 && (
                      <section
                        className="res-section"
                        style={{ marginBottom: "20px" }}
                      >
                        <h4
                          style={{
                            color: "#a855f7",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <Briefcase size={18} /> Key Roles to Hire
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {reportData.talentRoles.map((role, i) => (
                            <div
                              key={i}
                              style={{
                                background: "var(--ink2)",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                borderLeft: "4px solid #a855f7",
                                fontSize: "13px",
                              }}
                            >
                              {role}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                </div>
                <button
                  className="q-next"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    margin: "24px 0 40px",
                  }}
                  onClick={() => {
                    setIsOpen(false);
                    setActivePopup(null);
                  }}
                >
                  Close Report
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
