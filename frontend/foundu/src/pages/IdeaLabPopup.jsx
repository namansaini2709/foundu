import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import {
  History,
  TrendingUp,
  ArrowLeft,
  Target,
  Layers,
  MapPin,
} from "lucide-react";
import "./IdeaLabPopup.css";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

const IdeaLabPopup = ({ userId }) => {
  const [phase, setPhase] = useState("start"); // 'start', 'input', 'loading', 'results'
  const [mode, setMode] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ideaText, setIdeaText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

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
    if (userId) fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`${API_BASE}/ideas/user/${userId}`);
      if (res.data.success) setHistory(res.data.ideas);
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  const handleRunAnalysis = async (text, customTitle = null) => {
    setLoading(true);
    setPhase("loading");
    try {
      const response = await api.post(`${API_BASE}/ai/analyze-idea`, {
        mode,
        text,
        context: mode === "discover" ? answers : { title: customTitle },
      });
      if (response.data.success) {
        setReportData(response.data.data);
        setPhase("results");
        toast.success("Venture Analysis Complete!");
        await api.post(`${API_BASE}/ideas/create`, {
          user_id: userId,
          title: customTitle || "New Analysis",
          description: text,
          report: response.data.data,
        });
        fetchHistory();
      }
    } catch (error) {
      toast.error("Analysis failed. Try again.");
      setPhase("start");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (h) => {
    setReportData(h.report);
    setPhase("results");
  };

  const handleBack = () => {
    if (phase === "results") setPhase("start");
    else if (phase === "input" && qIdx > 0) setQIdx(qIdx - 1);
    else setPhase("start");
  };

  return (
    <div className="venture-page-layout">
      <div className="venture-modal-container standalone">
        <aside className="venture-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-mark">I</div>
              <span className="sidebar-name">Idea Lab</span>
            </div>
          </div>
          <div className="sidebar-history">
            <div className="history-label">Previous Ideas</div>
            {history.map((h) => (
              <div key={h.id} className="history-item" onClick={() => loadFromHistory(h)}>
                <History size={18} />
                <span>{h.title}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="venture-main">
          <header className="venture-header">
            {phase !== "start" && (
              <button className="back-btn" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
          </header>

          <div className="venture-content">
            {phase === "start" && (
              <div className="venture-land">
                <div className="verdict-badge">AI Venture Engine</div>
                <h1 className="land-h1">The Future <span>Starts</span> Here</h1>
                <p className="land-sub">Select your path to startup success.</p>
                <div className="mode-grid">
                  <div className="mode-card" onClick={() => { setMode("discover"); setPhase("input"); setQIdx(0); }}>
                    <div className="mc-glyph">🔮</div>
                    <h3 className="mc-title">Generate Ideas</h3>
                    <p className="mc-desc">Let AI find your perfect startup match based on your skills.</p>
                  </div>
                  <div className="mode-card" onClick={() => { setMode("validate"); setPhase("input"); }}>
                    <div className="mc-glyph">⚡</div>
                    <h3 className="mc-title">Validate Concept</h3>
                    <p className="mc-desc">Get a full feasibility report for your existing startup idea.</p>
                  </div>
                </div>
              </div>
            )}

            {phase === "input" && mode === "discover" && (
              <div className="qcard">
                <h2 className="q-text">{QUESTIONS[qIdx].q}</h2>
                {QUESTIONS[qIdx].opts.map((o) => (
                  <div key={o.v} className={`q-opt ${answers[QUESTIONS[qIdx].id] === o.v ? "sel" : ""}`} onClick={() => {
                    setAnswers({ ...answers, [QUESTIONS[qIdx].id]: o.v });
                    if (qIdx < QUESTIONS.length - 1) setQIdx(qIdx + 1);
                    else handleRunAnalysis("Discovery Mode");
                  }}>
                    {o.e} {o.v}
                  </div>
                ))}
              </div>
            )}

            {phase === "input" && mode === "validate" && (
              <div className="qcard">
                <h2 className="q-text">Describe your idea</h2>
                <textarea className="q-opt" style={{ width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.05)' }} 
                  placeholder="Explain your vision..." value={ideaText} onChange={(e) => setIdeaText(e.target.value)} />
                <button className="q-opt sel" style={{ width: '100%', marginTop: '20px' }} onClick={() => handleRunAnalysis(ideaText)}>
                  Analyze Now
                </button>
              </div>
            )}

            {phase === "loading" && (
              <div className="v-loader">
                <div className="loader-orb"></div>
                <h2 className="q-text" style={{ marginTop: '30px' }}>Analyzing your vision...</h2>
              </div>
            )}

            {phase === "results" && reportData && (
              <div className="results-container">
                <div className="verdict-hero">
                  <div className="verdict-badge">Analysis Complete</div>
                  <h1 className="verdict-name">{reportData.title || "Venture Report"}</h1>
                </div>
                <div className="results-sections">
                  <div className="res-card-big" style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '24px', marginBottom: '24px' }}>
                    <h4 className="res-h4" style={{ color: 'var(--accent)', fontWeight: '900', marginBottom: '16px' }}><Target /> Summary</h4>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}>{reportData.refinedIdea || reportData.summary}</p>
                  </div>
                  {/* Additional sections can be added here mapping from reportData */}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IdeaLabPopup;
