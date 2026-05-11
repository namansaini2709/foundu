import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import {
    Briefcase, X, Zap, Rocket, CheckCircle2,
    ArrowRight, Loader2, Edit3, Globe, Clock, IndianRupee,
    UserPlus, Users, Layout, MapPin, AlignLeft, ListChecks
} from "lucide-react";
import "./QuickJobPopup.css";

const QuickJobPopup = ({ userId, activePopup, setActivePopup, renderAsButton }) => {
    const navigate = useNavigate();
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
    const [isEditing, setIsEditing] = useState(false);

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
            // Relaxed validation: AI can guess if not provided
            setQStep(qStep + 1);
        } else {
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
            const response = await api.post(`/api/ai/enrich-job`, {
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
                            workType: aiData.work_type || inputs.workType || "Remote",
                            duration: aiData.duration || "1–3 months",
                            budget: aiData.budget_range || inputs.budget || "Competitive",
                            urgency: "ASAP (within 7 days)",
                            jobLevel: aiData.jobLevel || "Mid-Level",
                            jobType: aiData.jobType || inputs.jobType || "Work from home",
                            jobDescription: aiData.jobDescription,
                            requirements: aiData.requirements || ["Specific skills as per role"],
                            responsibilities: aiData.responsibilities || ["Core task management"]
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
            // Check for founder profile completion during submission
            const userType = localStorage.getItem("user_type");
            if (userType === "founder") {
                const res = await api.get(`/api/users/${userId}`);
                const user = res.data.success ? res.data.data : res.data;

                if (!user.is_profile_complete || String(user.is_profile_complete) === "0") {
                    toast.error("Complete your profile first!");
                    setTimeout(() => navigate("/startup-profile"), 1000);
                    setLoading(false);
                    return;
                }
            }
            const endpoint = hiringType === 'freelancer' ? '/jobs/freelancer' : '/jobs/cofounder';
            const payload = hiringType === 'freelancer' ? {
                user_id: Number(userId),
                domain: previewData.common.domain,
                role_category: previewData.common.roleCategories.join(", "),
                work_type: previewData.freelancer.workType,
                duration: previewData.freelancer.duration,
                budget_range: previewData.freelancer.budget,
                urgency: previewData.freelancer.urgency,
                job_requirements: previewData.freelancer.requirements,
                job_title: previewData.freelancer.jobTitle,
                full_job_description: previewData.freelancer.jobDescription,
                // New auto-filled fields
                job_level: previewData.freelancer.jobLevel || "Mid-Level",
                job_type: previewData.freelancer.jobType || "Remote",
                duration: previewData.freelancer.duration || "3 Months",
                budget_range: previewData.freelancer.budget || "Negotiable"
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

            await api.post(`/api${endpoint}`, payload);
            toast.success("🚀 Job Successfully Published!");
            setIsOpen(false);
            setActivePopup(null);
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

    if (!isOpen) {
        // Hide FAB/Button when another popup is open
        if (activePopup && activePopup !== "quickjob") return null;
        
        if (renderAsButton) {
            return (
                <button 
                    onClick={() => { setIsOpen(true); setActivePopup && setActivePopup("quickjob"); }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 border border-white/20"
                >
                    <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                    Write JD using AI
                </button>
            );
        }

        return (
            <div className="fab-quickjob" onClick={() => { setIsOpen(true); setActivePopup && setActivePopup("quickjob"); }}>
                <DotLottieReact
                    src="https://lottie.host/7dce804e-19dd-4362-a69b-4e3121ccf219/6f9O7SB0Qq.lottie"
                    loop
                    autoplay
                    style={{ width: "200px", height: "120px" }}
                />
            </div>
        );
    }

    return (
        <div className="quickjob-modal-overlay">
            <div className="quickjob-modal">
                <header className="qj-header">
                    <div className="qj-brand">
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                        <span>QUICK HIRE <strong>AI</strong></span>
                    </div>
                    <button className="qj-close" onClick={() => { setIsOpen(false); setActivePopup && setActivePopup(null); }}>
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
                                <div className="step-progress" style={{ width: `${((qStep + 1) / (hiringType === 'freelancer' ? 4 : 3)) * 100}%` }} />
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
                                                onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
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
                                                    <button key={t} className={`chip ${inputs.workType === t ? 'active' : ''}`} onClick={() => setInputs({ ...inputs, workType: t })}>{t}</button>
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
                                                    <button key={t} className={`chip ${inputs.jobType === t ? 'active' : ''}`} onClick={() => setInputs({ ...inputs, jobType: t })}>{t}</button>
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
                                                onChange={(e) => setInputs({ ...inputs, budget: e.target.value })}
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
                                                    <button key={t} className={`chip ${inputs.roleType === t ? 'active' : ''}`} onClick={() => setInputs({ ...inputs, roleType: t })}>{t}</button>
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
                                                onChange={(e) => setInputs({ ...inputs, compensation: e.target.value })}
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
                                                    <button key={t} className={`chip ${inputs.jobType === t ? 'active' : ''}`} onClick={() => setInputs({ ...inputs, jobType: t })}>{t}</button>
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
                                    <h2 className="qj-title">{isEditing ? "Edit Job Details" : "Review & Submit"}</h2>
                                    <p className="qj-sub">{isEditing ? "Modify the generated content as needed." : "AI has auto-filled all mandatory details for you."}</p>
                                </div>
                            </div>

                            <div className="preview-scroll">
                                <div className="p-section-main">
                                    <div className="ps-row"><strong>Hiring Type:</strong> <span className="cap">{previewData.hiringType}</span></div>
                                    <div className="ps-row">
                                        <strong>Domain:</strong> 
                                        {isEditing ? (
                                            <input 
                                                className="edit-input-inline" 
                                                value={previewData.common.domain} 
                                                onChange={(e) => setPreviewData({...previewData, common: {...previewData.common, domain: e.target.value}})} 
                                            />
                                        ) : (
                                            <span>{previewData.common.domain}</span>
                                        )}
                                    </div>

                                    {previewData.hiringType === 'freelancer' ? (
                                        <div className="ps-box">
                                            <h4 className="ps-title">
                                                <Briefcase size={16} /> 
                                                {isEditing ? (
                                                    <input 
                                                        className="edit-input-inline title-edit" 
                                                        value={previewData.freelancer.jobTitle} 
                                                        onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, jobTitle: e.target.value}})} 
                                                    />
                                                ) : previewData.freelancer.jobTitle}
                                            </h4>
                                            <div className="ps-grid">
                                                <div>
                                                    <strong>Category:</strong> 
                                                    {isEditing ? (
                                                        <input 
                                                            value={previewData.common.roleCategories.join(", ")} 
                                                            onChange={(e) => setPreviewData({...previewData, common: {...previewData.common, roleCategories: e.target.value.split(",").map(s => s.trim())}})} 
                                                        />
                                                    ) : previewData.common.roleCategories.join(", ")}
                                                </div>
                                                <div>
                                                    <strong>Work Type:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.freelancer.workType} onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, workType: e.target.value}})} />
                                                    ) : previewData.freelancer.workType}
                                                </div>
                                                <div>
                                                    <strong>Commitment:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.freelancer.jobType} onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, jobType: e.target.value}})} />
                                                    ) : previewData.freelancer.jobType}
                                                </div>
                                                <div>
                                                    <strong>Budget:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.freelancer.budget} onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, budget: e.target.value}})} />
                                                    ) : previewData.freelancer.budget}
                                                </div>
                                                <div>
                                                    <strong>Duration:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.freelancer.duration} onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, duration: e.target.value}})} />
                                                    ) : previewData.freelancer.duration}
                                                </div>
                                                <div>
                                                    <strong>Level:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.freelancer.jobLevel} onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, jobLevel: e.target.value}})} />
                                                    ) : previewData.freelancer.jobLevel}
                                                </div>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">DESCRIPTION</p>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="edit-textarea-inline" 
                                                        value={previewData.freelancer.jobDescription} 
                                                        onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, jobDescription: e.target.value}})} 
                                                    />
                                                ) : (
                                                    <p className="ps-txt">{previewData.freelancer.jobDescription}</p>
                                                )}
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">REQUIREMENTS (comma separated)</p>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="edit-textarea-inline" 
                                                        value={previewData.freelancer.requirements.join(", ")} 
                                                        onChange={(e) => setPreviewData({...previewData, freelancer: {...previewData.freelancer, requirements: e.target.value.split(",").map(s => s.trim())}})} 
                                                    />
                                                ) : (
                                                    <ul className="ps-list">
                                                        {previewData.freelancer.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="ps-box alt">
                                            <h4 className="ps-title">
                                                <UserPlus size={16} /> 
                                                {isEditing ? (
                                                    <input 
                                                        className="edit-input-inline title-edit" 
                                                        value={previewData.cofounder.jobTitle} 
                                                        onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, jobTitle: e.target.value}})} 
                                                    />
                                                ) : previewData.cofounder.jobTitle}
                                            </h4>
                                            <div className="ps-grid">
                                                <div>
                                                    <strong>Role Type:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.cofounder.roleType} onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, roleType: e.target.value}})} />
                                                    ) : previewData.cofounder.roleType}
                                                </div>
                                                <div>
                                                    <strong>Compensation:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.cofounder.compensation} onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, compensation: e.target.value}})} />
                                                    ) : previewData.cofounder.compensation}
                                                </div>
                                                <div>
                                                    <strong>Commitment:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.cofounder.commitment} onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, commitment: e.target.value}})} />
                                                    ) : previewData.cofounder.commitment}
                                                </div>
                                                <div>
                                                    <strong>Job Type:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.cofounder.jobType} onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, jobType: e.target.value}})} />
                                                    ) : previewData.cofounder.jobType}
                                                </div>
                                                <div>
                                                    <strong>Level:</strong> 
                                                    {isEditing ? (
                                                        <input value={previewData.cofounder.jobLevel} onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, jobLevel: e.target.value}})} />
                                                    ) : previewData.cofounder.jobLevel}
                                                </div>
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">JOB DESCRIPTION</p>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="edit-textarea-inline" 
                                                        value={previewData.cofounder.jobDescription} 
                                                        onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, jobDescription: e.target.value}})} 
                                                    />
                                                ) : (
                                                    <p className="ps-txt">{previewData.cofounder.jobDescription}</p>
                                                )}
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">REQUIREMENTS (comma separated)</p>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="edit-textarea-inline" 
                                                        value={previewData.cofounder.requirements.join(", ")} 
                                                        onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, requirements: e.target.value.split(",").map(s => s.trim())}})} 
                                                    />
                                                ) : (
                                                    <ul className="ps-list">
                                                        {previewData.cofounder.requirements.map((r, i) => <li key={i}>{r}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="ps-detail">
                                                <p className="ps-lbl">RESPONSIBILITIES (comma separated)</p>
                                                {isEditing ? (
                                                    <textarea 
                                                        className="edit-textarea-inline" 
                                                        value={previewData.cofounder.responsibilities.join(", ")} 
                                                        onChange={(e) => setPreviewData({...previewData, cofounder: {...previewData.cofounder, responsibilities: e.target.value.split(",").map(s => s.trim())}})} 
                                                    />
                                                ) : (
                                                    <ul className="ps-list">
                                                        {previewData.cofounder.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="qj-actions">
                                <button className={`qj-sec-btn ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? <><CheckCircle2 size={16} /> Done Editing</> : <><Edit3 size={16} /> Edit Details</>}
                                </button>
                                {!isEditing && (
                                    <button className="qj-publish-btn" onClick={handleSubmit} disabled={loading}>
                                        {loading ? "Publishing..." : <>Submit Job <Rocket size={18} /></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickJobPopup;
