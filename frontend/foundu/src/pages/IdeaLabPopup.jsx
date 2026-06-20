import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Plus,
  Check,
  Zap,
  Lightbulb,
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Target,
  Award,
} from "lucide-react";
import { getUserId } from "../utils/authUtils";
import "./IdeaLabPopup.css";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

const QUESTIONS = [
  {
    id: "bg",
    step: "Step 1 of 5",
    q: "Aapka professional background kya hai?",
    opts: [
      "Tech / Engineering",
      "Business / Finance",
      "Design / Creative",
      "Other",
    ],
  },
  {
    id: "skills",
    step: "Step 2 of 5",
    q: "Aapki core skills kya hain?",
    opts: [
      "Development / AI",
      "Marketing / Sales",
      "Operations / Logistics",
      "Product Management",
    ],
  },
  {
    id: "passions",
    step: "Step 3 of 5",
    q: "Aap kis sector mein passionate hain?",
    opts: [
      "FinTech / Crypto",
      "AgriTech / Sustainability",
      "HealthTech / Wellness",
      "EdTech / Learning",
    ],
  },
  {
    id: "capital",
    step: "Step 4 of 5",
    q: "Starting capital kitna hai?",
    opts: ["₹0–50K (Lean)", "₹50K–5L (Moderate)", "₹5L+ (Serious)"],
  },
  {
    id: "ambition",
    step: "Step 5 of 5",
    q: "Aapka primary goal kya hai?",
    opts: [
      "Lifestyle Business",
      "Hyper-Growth Scale",
      "Social Impact",
      "Side Hustle",
    ],
  },
];

const IdeaLabPopup = ({ userId }) => {
  const currentUserId = userId || getUserId();
  const [phase, setPhase] = useState("start"); // 'start' | 'input' | 'loading' | 'results'
  const [mode, setMode] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ideaText, setIdeaText] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (currentUserId) fetchHistory();
  }, [userId, currentUserId]);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`${API_BASE}/ideas/user/${currentUserId}`);
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
          user_id: currentUserId,
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
    if (phase === "results" || phase === "input") {
      setPhase("start");
      setQIdx(0);
      setAnswers({});
    }
  };

  const handleNewAnalysis = () => {
    setPhase("start");
    setQIdx(0);
    setAnswers({});
    setIdeaText("");
    setReportData(null);
  };

  const handleOptionSelect = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      handleRunAnalysis("Discovery Mode");
    }
  };

  const progressPct = Math.round((qIdx / QUESTIONS.length) * 100);

  return (
    <div className="il-page">
      <div className="il-wrap">
        {/* SIDEBAR */}
        <aside className="il-sidebar">
          <div className="il-brand">
            <div className="il-brand-mark">
              <Lightbulb size={20} />
            </div>
            <span className="il-brand-name">Idea Lab</span>
          </div>
          <button className="il-new-btn" onClick={handleNewAnalysis}>
            <Plus size={14} /> New Analysis
          </button>
          <div className="il-hist-label">Previous Ideas</div>
          {history.map((h) => (
            <div
              key={h.id}
              className={`il-hist-item ${reportData && h.report === reportData ? "active" : ""}`}
              onClick={() => loadFromHistory(h)}
            >
              <div className="il-hist-dot" />
              <span>{h.title}</span>
            </div>
          ))}
        </aside>

        {/* MAIN */}
        <main className="il-main">
          <div className="il-topbar">
            {phase !== "start" && (
              <button className="il-back-btn" onClick={handleBack}>
                <ArrowLeft size={13} /> Back
              </button>
            )}
            <span className="il-phase-label">
              {phase === "start" && "AI Venture Engine"}
              {phase === "input" && mode === "discover" && "Generate Ideas"}
              {phase === "input" && mode === "validate" && "Validate Concept"}
              {phase === "loading" && "Analyzing..."}
              {phase === "results" && "Analysis Complete"}
            </span>
          </div>

          <div className="il-content">
            {/* START */}
            {phase === "start" && (
              <div className="il-start">
                {/* <div className="il-badge">Powered by Claude</div> */}
                <h1 className="il-h1">
                  The Future
                  <br />
                  <span>Starts</span> Here
                </h1>
                <p className="il-sub">Select your path to startup success.</p>
                <div className="il-mode-grid">
                  <div
                    className="il-mode-card"
                    onClick={() => {
                      setMode("discover");
                      setPhase("input");
                      setQIdx(0);
                    }}
                  >
                    <div className="il-mc-arrow">→</div>
                    <div className="il-mc-icon">
                      <Lightbulb size={20} />
                    </div>
                    <div className="il-mc-title">Generate Ideas</div>
                    <div className="il-mc-desc">
                      Let AI find your perfect startup match based on your
                      skills.
                    </div>
                  </div>
                  <div
                    className="il-mode-card"
                    onClick={() => {
                      setMode("validate");
                      setPhase("input");
                    }}
                  >
                    <div className="il-mc-arrow">→</div>
                    <div className="il-mc-icon">
                      <Zap size={20} />
                    </div>
                    <div className="il-mc-title">Validate Concept</div>
                    <div className="il-mc-desc">
                      Get a full feasibility report for your existing startup
                      idea.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DISCOVER QUESTIONS */}
            {phase === "input" && mode === "discover" && (
              <div className="il-questions">
                <div className="il-progress">
                  <div
                    className="il-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Answered questions */}
                {QUESTIONS.slice(0, qIdx).map((q) => (
                  <div key={q.id} className="il-q-answered">
                    <div className="il-q-text-sm">{q.q}</div>
                    <div className="il-q-answer-chip">
                      <Check size={11} /> {answers[q.id]}
                    </div>
                  </div>
                ))}

                {/* Current question */}
                {qIdx < QUESTIONS.length && (
                  <div>
                    <div className="il-q-step">{QUESTIONS[qIdx].step}</div>
                    <div className="il-q-main-text">{QUESTIONS[qIdx].q}</div>
                    <div className="il-options-grid">
                      {QUESTIONS[qIdx].opts.map((o) => (
                        <button
                          key={o}
                          className="il-option"
                          onClick={() =>
                            handleOptionSelect(QUESTIONS[qIdx].id, o)
                          }
                        >
                          <span>{o}</span>
                          <div className="il-option-check" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VALIDATE INPUT */}
            {phase === "input" && mode === "validate" && (
              <div className="il-questions">
                <div className="il-q-main-text">Describe your idea</div>
                <p className="il-validate-hint">
                  Explain your vision in detail — the problem, the customer, and
                  how you plan to monetize.
                </p>
                <textarea
                  className="il-textarea"
                  placeholder="Explain your vision..."
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                />
                <button
                  className="il-submit-btn"
                  onClick={() => handleRunAnalysis(ideaText)}
                >
                  Analyze Now
                </button>
              </div>
            )}

            {/* LOADING */}
            {phase === "loading" && (
              <div className="il-loader">
                <div className="il-loader-orb" />
                <div className="il-q-main-text" style={{ marginTop: 28 }}>
                  Analyzing your vision...
                </div>
              </div>
            )}

            {/* RESULTS */}
            {phase === "results" && reportData && (
              <div className="il-results-container space-y-8 pb-12">
                <div className="il-result-hero text-center md:text-left">
                  <div className="il-badge">Venture Analysis Report</div>
                  <h1 className="il-result-title text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-2">
                    {reportData.title || "Venture Concept"}
                  </h1>
                </div>

                {/* 1. Refined Concept */}
                {(reportData.refinedIdea || reportData.summary) && (
                  <div className="il-result-card border-l-4 border-indigo-500 bg-slate-900/30 p-6 rounded-xl border border-white/5">
                    <div className="il-result-card-label flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs mb-3">
                      <Lightbulb size={16} /> Refined Concept
                    </div>
                    <div className="il-result-text text-base leading-relaxed text-slate-100">
                      {reportData.refinedIdea || reportData.summary}
                    </div>
                  </div>
                )}

                {/* 2. Market Opportunity */}
                {reportData.marketAnalysis &&
                typeof reportData.marketAnalysis === "object" ? (
                  <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                    <div className="il-result-card-label flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-3">
                      <Target size={16} /> Market Analysis
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                          TAM
                        </span>
                        <span className="text-xl font-extrabold text-white block mt-1">
                          {reportData.marketAnalysis.tam || "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Total Addressable Market
                        </span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                          SAM
                        </span>
                        <span className="text-xl font-extrabold text-white block mt-1">
                          {reportData.marketAnalysis.sam || "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Serviceable Addressable Market
                        </span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
                          SOM
                        </span>
                        <span className="text-xl font-extrabold text-white block mt-1">
                          {reportData.marketAnalysis.som || "N/A"}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Serviceable Obtainable Market
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Target Audience
                        </span>
                        <span className="text-xs font-medium text-slate-200 block mt-1">
                          {reportData.marketAnalysis.targetAudience || "N/A"}
                        </span>
                      </div>
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Growth Rate
                        </span>
                        <span className="text-base font-bold text-emerald-400 block mt-1 flex items-center gap-1">
                          <TrendingUp size={14} />{" "}
                          {reportData.marketAnalysis.growthRate || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  reportData.market && (
                    <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                      <div className="il-result-card-label flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <Target size={16} /> Market Opportunity
                      </div>
                      <div className="il-result-text text-sm text-slate-300 leading-relaxed">
                        {reportData.market}
                      </div>
                    </div>
                  )
                )}

                {/* 3. Competition Analysis */}
                {Array.isArray(reportData.competition) &&
                  reportData.competition.length > 0 && (
                    <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                      <div className="il-result-card-label flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <Users size={16} /> Competitive Landscape
                      </div>
                      <div className="grid grid-cols-1 gap-4 mt-3">
                        {reportData.competition.map((comp, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200"
                          >
                            <span className="text-sm font-bold text-white block mb-2">
                              {comp.name}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                              <div className="bg-emerald-950/10 p-3 rounded-lg border border-emerald-900/20">
                                <span className="block font-bold text-emerald-400 uppercase tracking-wider text-[9px] mb-1">
                                  Strength
                                </span>
                                <p className="text-slate-300 leading-relaxed">
                                  {comp.strength}
                                </p>
                              </div>
                              <div className="bg-rose-950/10 p-3 rounded-lg border border-rose-900/20">
                                <span className="block font-bold text-rose-400 uppercase tracking-wider text-[9px] mb-1">
                                  Weakness
                                </span>
                                <p className="text-slate-300 leading-relaxed">
                                  {comp.weakness}
                                </p>
                              </div>
                              <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-900/30">
                                <span className="block font-bold text-indigo-300 uppercase tracking-wider text-[9px] mb-1">
                                  Your Edge ✨
                                </span>
                                <p className="text-indigo-200 font-medium leading-relaxed">
                                  {comp.yourEdge}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* 4. Revenue Model */}
                {reportData.revenueModel &&
                  typeof reportData.revenueModel === "object" && (
                    <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                      <div className="il-result-card-label flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <DollarSign size={16} /> Revenue Model & Monetization
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Primary Model
                          </span>
                          <span className="text-sm font-bold text-white block mt-1">
                            {reportData.revenueModel.primaryModel || "N/A"}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Pricing Strategy
                          </span>
                          <span className="text-xs font-medium text-slate-200 block mt-1">
                            {reportData.revenueModel.pricingStrategy || "N/A"}
                          </span>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Year 1 Projection
                          </span>
                          <span className="text-sm font-bold text-emerald-400 block mt-1">
                            {reportData.revenueModel.monthlyProjection || "N/A"}
                          </span>
                        </div>
                      </div>
                      {Array.isArray(
                        reportData.revenueModel.additionalStreams,
                      ) &&
                        reportData.revenueModel.additionalStreams.length >
                          0 && (
                          <div className="mt-4 bg-slate-950/30 p-4 rounded-xl border border-white/5">
                            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                              Secondary Revenue Streams
                            </span>
                            <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                              {reportData.revenueModel.additionalStreams.map(
                                (stream, idx) => (
                                  <li key={idx}>{stream}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}

                {/* 5. Launch Roadmap */}
                {Array.isArray(reportData.roadmap) &&
                  reportData.roadmap.length > 0 && (
                    <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                      <div className="il-result-card-label flex items-center gap-2 text-violet-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <Calendar size={16} /> 12-Month Launch Roadmap
                      </div>
                      <div className="space-y-4 mt-4">
                        {reportData.roadmap.map((phase, idx) => {
                          const [phaseTitle, ...phaseDesc] = phase.split(":");
                          return (
                            <div key={idx} className="flex gap-4 relative">
                              {idx < reportData.roadmap.length - 1 && (
                                <div className="absolute left-[11px] top-6 bottom-[-20px] w-[2px] bg-slate-800" />
                              )}
                              <div className="w-6 h-6 rounded-full bg-violet-950 border-2 border-violet-500 flex items-center justify-center text-[10px] font-bold text-violet-300 flex-shrink-0 z-10">
                                {idx + 1}
                              </div>
                              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex-1">
                                <span className="font-bold text-white text-xs block">
                                  {phaseTitle}
                                </span>
                                {phaseDesc.length > 0 && (
                                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    {phaseDesc.join(":")}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* 6. Risks & Mitigations (FIXES CRASH) */}
                {reportData.risks && (
                  <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                    <div className="il-result-card-label flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs mb-3">
                      <Shield size={16} /> Risks & Mitigations
                    </div>
                    <div className="space-y-3 mt-3">
                      {Array.isArray(reportData.risks) ? (
                        reportData.risks.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/50 p-4 rounded-xl border border-white/5"
                          >
                            <div className="flex items-start gap-2 text-xs font-semibold mb-2">
                              <AlertTriangle
                                size={14}
                                className="text-amber-400 flex-shrink-0 mt-0.5"
                              />
                              <div>
                                <span className="uppercase text-[9px] tracking-wider font-bold block text-slate-400">
                                  Risk {idx + 1}
                                </span>
                                <span className="text-slate-200 mt-0.5 block leading-relaxed">
                                  {item.risk}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs font-semibold border-t border-white/5 pt-2 mt-2">
                              <Shield
                                size={14}
                                className="text-emerald-400 flex-shrink-0 mt-0.5"
                              />
                              <div>
                                <span className="uppercase text-[9px] tracking-wider font-bold block text-slate-400">
                                  Mitigation
                                </span>
                                <span className="text-slate-300 mt-0.5 block leading-relaxed">
                                  {item.mitigation}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="il-result-text text-sm text-slate-300 leading-relaxed">
                          {String(reportData.risks)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 7. Recommended Talent from FoundU */}
                {Array.isArray(reportData.realTalent) &&
                  reportData.realTalent.length > 0 && (
                    <div className="il-result-card bg-slate-900/30 p-6 rounded-xl border border-white/5">
                      <div className="il-result-card-label flex items-center gap-2 text-teal-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <Award size={16} /> Matchmade Talent on FoundU
                      </div>
                      <p className="text-xs text-slate-400 mb-4">
                        We matched your concept with verified founders and
                        builders in our database. Reach out to collaborate!
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reportData.realTalent.map((talent, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950/80 p-4 rounded-xl border border-white/5 hover:border-teal-500/20 transition-all duration-200 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">
                                  {talent.name}
                                </span>
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                                    talent.userType === "freelancer"
                                      ? "bg-blue-950 text-blue-300 border border-blue-900/50"
                                      : "bg-teal-950 text-teal-300 border border-teal-900/50"
                                  }`}
                                >
                                  {talent.userType}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic leading-relaxed">
                                "{talent.role}"
                              </p>
                              <span className="text-[10px] text-slate-400 block mt-2">
                                Experience:{" "}
                                <strong className="text-slate-200">
                                  {talent.experience}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                              <span className="text-[10px] text-yellow-400 font-extrabold flex items-center gap-1">
                                Credibility: {talent.credibility}
                              </span>
                              <a
                                href={`/profile?id=${talent.id}`}
                                className="text-xs font-bold text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1"
                              >
                                View Profile →
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IdeaLabPopup;
