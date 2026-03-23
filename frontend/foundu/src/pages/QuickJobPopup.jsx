import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
    Briefcase, X, Zap, Rocket, CheckCircle2, 
    ArrowRight, Loader2, Edit3, Globe, Clock, IndianRupee,
    UserPlus, Users, Layout, MapPin, AlignLeft, ListChecks
} from "lucide-react";
import "./QuickJobPopup.css";

const QuickJobPopup = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [phase, setPhase] = useState("selection"); // selection, questions, loading, preview
    const [hiringType, setHiringType] = useState(null); // freelancer, cofounder
    const [qStep, setQStep] = useState(0); 
    
    const [inputs, setInputs] = useState({
        budget: "",        // Freelancer
        workType: "",      // Freelancer (Work Type)
        jobType: "Work from home", // Both
        description: "",   // Freelancer (JD)
        roleType: "Technical (CTO / Engineer)", // Cofounder
        compensation: ""   // Cofounder
    });

    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);

    const WORK_TYPES = ["Fixed task", "Ongoing part-time", "Full-time contract", "One-time consultation"];
    const COMMITMENTS = ["Full-time", "Part-time initially", "Flexible"];
    const JOB_TYPES = ["Work from home", "Hybrid", "In office"];
    const COFOUNDER_ROLES = ["Technical (CTO / Engineer)", "Marketing / Growth", "Operations / COO", "Product / Design", "Sales / BD"];

    const handleSelectType = (type) => {
        setHiringType(type);
        setInputs(prev => ({
            ...prev,
            workType: type === 'freelancer' ? WORK_TYPES[0] : COMMITMENTS[0],
            roleType: COFOUNDER_ROLES[0]
        }));
        setPhase("questions");
        setQStep(0);
    };

    const handleNextQ = () => {
        const maxStep = hiringType === 'freelancer' ? 3 : 2;

        if (qStep < maxStep) {
            // Validation
            if (hiringType === 'freelancer') {
                if (qStep === 0 && !inputs.description) { toast.warning("Please describe the job vision"); return; }
            } else {
                if (qStep === 1 && !inputs.compensation) { toast.warning("Please provide compensation details"); return; }
            }
            setQStep(qStep + 1);
        } else {
            // Final step validation
            if (hiringType === 'freelancer') {
                if (!inputs.budget) { toast.warning("Please provide a budget/price range"); return; }
            }
            runAISummary();
        }
    };

    const handlePrevQ = () => {
        if (qStep > 0) {
            setQStep(qStep - 1);
        } else {
            setPhase("selection");
        }
    };

    const runAISummary = async () => {
        setLoading(true);
        setPhase("loading");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`}/api/ai/enrich-job`, {
                role: hiringType,
                inputs: inputs
            });

            if (response.data.success) {
                const aiData = response.data.data;
                
                if (hiringType === 'freelancer') {
                    setPreviewData({
                        hiringType: 'freelancer',
                        common: {
                            domain: aiData.sector || "Tech / General",
                            roleCategories: [aiData.jobLevel || "Mid-Level"]
                        },
                        freelancer: {
                            jobTitle: aiData.jobTitle,
                            workType: inputs.workType,
                            duration: "1–3 months",
                            budget: inputs.budget,
                            urgency: "ASAP (within 7 days)",
                            jobLevel: aiData.jobLevel,
                            jobType: inputs.jobType,
                            jobDescription: inputs.description,
                            requirements: Array.isArray(aiData.requirements) ? aiData.requirements : [aiData.requirements],
                            responsibilities: Array.isArray(aiData.responsibilities) ? aiData.responsibilities : [aiData.responsibilities]
                        }
                    });
                } else {
                    setPreviewData({
                        hiringType: 'cofounder',
                        common: { domain: aiData.sector || "General Startup" },
                        cofounder: {
                            jobTitle: aiData.jobTitle,
                            roleType: inputs.roleType,
                            compensation: inputs.compensation,
                            commitment: aiData.commitment,
                            priorities: Array.isArray(aiData.priorities) ? aiData.priorities : [aiData.priorities],
                            jobLevel: aiData.jobLevel,
                            jobType: inputs.jobType,
                            urgency: "ASAP (within 7 days)",
                            jobDescription: aiData.jobDescription,
                            requirements: Array.isArray(aiData.requirements) ? aiData.requirements : [aiData.requirements],
                            responsibilities: Array.isArray(aiData.responsibilities) ? aiData.responsibilities : [aiData.responsibilities]
                        }
                    });
                }
                toast.success("AI Generation Complete! ✨");
            } else {
                throw new Error("API responded with failure");
            }
        } catch (error) {
            console.error("AI Enrichment Error:", error);
            toast.error("AI calculation failed. Using fallback preview.");
            
            // Minimal Fallback
            const fallbackData = {
                jobTitle: inputs.description?.substring(0, 30) + " Role",
                sector: "Tech / Strategy",
                jobLevel: "Mid-Level",
                jobDescription: inputs.description || "Exciting role at a growing startup.",
                requirements: ["Relevant Experience"],
                responsibilities: ["Lead key initiatives"]
            };

            if (hiringType === 'freelancer') {
                setPreviewData({
                    hiringType: 'freelancer',
                    common: { domain: fallbackData.sector, roleCategories: [fallbackData.jobLevel] },
                    freelancer: {
                        jobTitle: fallbackData.jobTitle,
                        workType: inputs.workType,
                        duration: "Flexible",
                        budget: inputs.budget,
                        urgency: "Immediate",
                        jobLevel: fallbackData.jobLevel,
                        jobType: inputs.jobType,
                        jobDescription: fallbackData.jobDescription,
                        requirements: fallbackData.requirements
                    }
                });
            } else {
                setPreviewData({
                    hiringType: 'cofounder',
                    common: { domain: fallbackData.sector },
                    cofounder: {
                        jobTitle: fallbackData.jobTitle,
                        roleType: inputs.roleType,
                        compensation: inputs.compensation,
                        commitment: "Full-time",
                        priorities: ["Growth", "Innovation"],
                        jobLevel: fallbackData.jobLevel,
                        jobType: inputs.jobType,
                        urgency: "Immediate",
                        jobDescription: fallbackData.jobDescription,
                        requirements: fallbackData.requirements,
                        responsibilities: fallbackData.responsibilities
                    }
                });
            }
        } finally {
            setPhase("preview");
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const endpoint = hiringType === 'freelancer' ? '/jobs/freelancer' : '/jobs/cofounder';
            const payload = hiringType === 'freelancer' ? {
                user_id: Number(userId),
                domain: previewData.common.domain,
                role_category: previewData.common.roleCategories.join(", "),
                work_type: previewData.freelancer.workType,
                duration: previewData.freelancer.duration,
                budget_range: previewData.freelancer.budget,
                urgency: previewData.freelancer.urgency,
                job_level: previewData.freelancer.jobLevel,
                job_type: previewData.freelancer.jobType,
                job_requirements: previewData.freelancer.requirements,
                job_title: previewData.freelancer.jobTitle,
                full_job_description: previewData.freelancer.jobDescription
            } : {
                user_id: Number(userId),
                domain: previewData.common.domain,
                role_type: previewData.cofounder.roleType,
                compensation: previewData.cofounder.compensation,
                commitment: previewData.cofounder.commitment,
                priority_factors: previewData.cofounder.priorities,
                job_level: previewData.cofounder.jobLevel,
                job_location_type: previewData.cofounder.jobType,
                job_requirements: previewData.cofounder.requirements,
                responsibilities: previewData.cofounder.responsibilities,
                job_title: previewData.cofounder.jobTitle,
                full_job_description: previewData.cofounder.jobDescription
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api${endpoint}`, payload);
            toast.success("🚀 Job Successfully Published!");
            setIsOpen(false);
            setPhase("selection");
        } catch (err) {
            console.error(err);
            toast.error("Process failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setPhase("selection");
        setHiringType(null);
        setInputs({ budget: "", workType: "", jobType: "Work from home", description: "", roleType: "Technical (CTO / Engineer)", compensation: "" });
    };

    if (!isOpen) return (
        <div className="fab-quickjob" onClick={() => setIsOpen(true)}>
            <Briefcase size={28} />
            <div className="fab-badge">AI</div>
        </div>
    );

    return (
        <div className="quickjob-modal-overlay">
            <div className="quickjob-modal">
                <header className="qj-header">
                    <div className="qj-brand">
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                        <span>QUICK HIRE <strong>AI</strong></span>
                    </div>
                    <button className="qj-close" onClick={() => setIsOpen(false)}>
                        <X size={18} />
                    </button>
                </header>

                <div className="qj-content">
                    
                    {/* PHASE 1: SELECTION */}
                    {phase === "selection" && (
                        <div className="qj-selection">
                            <h2 className="qj-title">Pick Hiring Type</h2>
                            <p className="qj-sub">Choose how you want to build your team.</p>
                            <div className="selection-grid">
                                <div className="sel-card" onClick={() => handleSelectType('freelancer')}>
                                    <div className="sel-icon"><Users size={24} /></div>
                                    <div className="sel-info">
                                        <h3>Hire Freelancer</h3>
                                        <p>Short-term paid work</p>
                                    </div>
                                    <ArrowRight size={18} className="sel-arrow" />
                                </div>
                                <div className="sel-card alt" onClick={() => handleSelectType('cofounder')}>
                                    <div className="sel-icon"><UserPlus size={24} /></div>
                                    <div className="sel-info">
                                        <h3>Hire Cofounder</h3>
                                        <p>Long-term strategic partner</p>
                                    </div>
                                    <ArrowRight size={18} className="sel-arrow" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PHASE 2: QUESTIONS */}
                    {phase === "questions" && (
                        <div className="qj-questions">
                            <div className="step-bar">
                                <div className="step-progress" style={{ width: `${((qStep+1)/(hiringType === 'freelancer' ? 4 : 3))*100}%` }} />
                            </div>
                            
                            {/* FREELANCER FLOW */}
                            {hiringType === 'freelancer' ? (
                                <>
                                    {qStep === 0 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Job Vision</h3>
                                            <p className="q-hint">Describe the role in your words...</p>
                                            <textarea 
                                                className="q-textarea" 
                                                placeholder="Example: I need a developer who can build a simple landing page for my edtech startup..."
                                                value={inputs.description}
                                                onChange={(e) => setInputs({...inputs, description: e.target.value})}
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                    {qStep === 1 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Work Type</h3>
                                            <p className="q-hint">Preferred work arrangement?</p>
                                            <div className="chip-grid">
                                                {WORK_TYPES.map(t => (
                                                    <button key={t} className={`chip ${inputs.workType === t ? 'active' : ''}`} onClick={() => setInputs({...inputs, workType: t})}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {qStep === 2 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Job Type</h3>
                                            <p className="q-hint">Preferred working environment?</p>
                                            <div className="chip-grid">
                                                {JOB_TYPES.map(t => (
                                                    <button key={t} className={`chip ${inputs.jobType === t ? 'active' : ''}`} onClick={() => setInputs({...inputs, jobType: t})}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {qStep === 3 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Budget / Price Range</h3>
                                            <p className="q-hint">Kaisa budget range aap plan kar rahe hain?</p>
                                            <input 
                                                type="text" 
                                                className="q-input" 
                                                placeholder="e.g. ₹50k - 1L, Negotiable..."
                                                value={inputs.budget}
                                                onChange={(e) => setInputs({...inputs, budget: e.target.value})}
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* COFOUNDER FLOW */
                                <>
                                    {qStep === 0 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Role Type</h3>
                                            <p className="q-hint">What kind of co-founder are you looking for?</p>
                                            <div className="chip-grid">
                                                {COFOUNDER_ROLES.map(t => (
                                                    <button key={t} className={`chip ${inputs.roleType === t ? 'active' : ''}`} onClick={() => setInputs({...inputs, roleType: t})}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {qStep === 1 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Compensation</h3>
                                            <p className="q-hint">Kaisa compensation plan kar rahe hain?</p>
                                            <input 
                                                type="text" 
                                                className="q-input" 
                                                placeholder="e.g. Equity only, Equity + Stipend, Negotiable..."
                                                value={inputs.compensation}
                                                onChange={(e) => setInputs({...inputs, compensation: e.target.value})}
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                    {qStep === 2 && (
                                        <div className="q-wrap">
                                            <h3 className="q-label">Job Type</h3>
                                            <p className="q-hint">Preferred working environment?</p>
                                            <div className="chip-grid">
                                                {JOB_TYPES.map(t => (
                                                    <button key={t} className={`chip ${inputs.jobType === t ? 'active' : ''}`} onClick={() => setInputs({...inputs, jobType: t})}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="qj-q-actions">
                                <button className="qj-back-btn" onClick={handlePrevQ}>Back</button>
                                <button className="qj-next-btn" onClick={handleNextQ}>
                                    {qStep < (hiringType === 'freelancer' ? 3 : 2) ? "Next Question" : "Generate Deep Preview"} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PHASE 3: LOADING */}
                    {phase === "loading" && (
                        <div className="qj-loader">
                            <div className="loader-ring" />
                            <h3>AI Analysis In Progress...</h3>
                            <p>Mapping inputs to all mandatory fields & generating requirements.</p>
                        </div>
                    )}

                    {/* PHASE 4: PREVIEW */}
                    {phase === "preview" && previewData && (
                        <div className="qj-preview">
                            <div className="p-header-flex">
                                <div>
                                    <h2 className="qj-title">Review & Submit</h2>
                                    <p className="qj-sub">AI has auto-filled all mandatory details for you.</p>
                                </div>
                            </div>

                            <div className="preview-scroll">
                                <div className="p-section-main">
                                    <div className="ps-row"><strong>Hiring Type:</strong> <span className="cap">{previewData.hiringType}</span></div>
                                    <div className="ps-row"><strong>Domain:</strong> <span>{previewData.common.domain}</span></div>
                                    
                                    {previewData.hiringType === 'freelancer' ? (
                                        <div className="ps-box">
                                            <h4 className="ps-title"><Briefcase size={16}/> {previewData.freelancer.jobTitle}</h4>
                                            <div className="ps-grid">
                                                <div><strong>Category:</strong> {previewData.common.roleCategories.join(", ")}</div>
                                                <div><strong>Work Type:</strong> {previewData.freelancer.workType}</div>
                                                <div><strong>Job Type:</strong> {previewData.freelancer.jobType}</div>
                                                <div><strong>Budget:</strong> {previewData.freelancer.budget}</div>
                                                <div><strong>Duration:</strong> {previewData.freelancer.duration}</div>
                                                <div><strong>Level:</strong> {previewData.freelancer.jobLevel}</div>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">DESCRIPTION</p>
                                                <p className="ps-txt">{previewData.freelancer.jobDescription}</p>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">REQUIREMENTS</p>
                                                <ul className="ps-list">
                                                    {previewData.freelancer.requirements.map((r,i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="ps-box alt">
                                            <h4 className="ps-title"><UserPlus size={16}/> {previewData.cofounder.jobTitle}</h4>
                                            <div className="ps-grid">
                                                <div><strong>Role Type:</strong> {previewData.cofounder.roleType}</div>
                                                <div><strong>Compensation:</strong> {previewData.cofounder.compensation}</div>
                                                <div><strong>Commitment:</strong> {previewData.cofounder.commitment}</div>
                                                <div><strong>Job Type:</strong> {previewData.cofounder.jobType}</div>
                                                <div><strong>Level:</strong> {previewData.cofounder.jobLevel}</div>
                                                <div><strong>Sector:</strong> {previewData.common.domain}</div>
                                                <div className="full-row"><strong>Priorities:</strong> {previewData.cofounder.priorities.join(", ")}</div>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">JOB DESCRIPTION</p>
                                                <p className="ps-txt">{previewData.cofounder.jobDescription}</p>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">REQUIREMENTS</p>
                                                <ul className="ps-list">
                                                    {previewData.cofounder.requirements.map((r,i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">RESPONSIBILITIES</p>
                                                <ul className="ps-list">
                                                    {previewData.cofounder.responsibilities.map((r,i) => <li key={i}>{r}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="qj-actions">
                                <button className="qj-sec-btn" onClick={() => setPhase("questions")}><Edit3 size={16}/> Edit</button>
                                <button className="qj-publish-btn" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Publishing..." : <>Submit Job <Rocket size={18} /></>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickJobPopup;
