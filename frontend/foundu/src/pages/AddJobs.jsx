import { useEffect, useState } from "react";
import { getUserId } from "../utils/authUtils";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Rocket, 
  Users, 
  UserPlus, 
  Layers, 
  Briefcase, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Plus,
  Trash2
} from "lucide-react";

const ROLE_CATEGORIES = [
  "Engineering / Development",
  "Product / UX / UI Design",
  "Marketing / Growth",
  "Sales / Business Development",
  "Operations / Support",
  "Finance / Legal",
  "Data / AI / ML",
  "Other",
];

const DOMAINS = [
  "SaaS / B2B",
  "Fintech",
  "EdTech",
  "HealthTech",
  "Web3 / Blockchain",
  "E-commerce",
  "AI / ML",
  "Consumer Apps",
  "Agency / Services",
  "Other",
];

const initial = {
  hiringType: "freelancer",
  common: {
    roleCategories: [],
    domain: "SaaS / B2B",
    startupStage: "Idea stage",
  },
  freelancer: {
    workType: "Fixed task",
    duration: "1–4 weeks",
    budget: "",
    urgency: "Flexible",
    jobLevel: "",
    jobType: "",
    requirements: [""],
    jobTitle: "",
    jobDescription: "",
  },
  cofounder: {
    roleType: "Technical (CTO / Engineer)",
    compensation: "Equity only",
    commitment: "Full-time",
    priorities: [],
    jobLevel: "",
    jobType: "",
    requirements: [""],
    responsibilities: [""],
    jobTitle: "",
    jobDescription: "",
  },
};

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border transition-all duration-300 mr-2 mb-2 ${
        active
          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
          : "bg-white/5 text-gray-400 border-white/10 hover:border-blue-500/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export default function AddJobs() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem("addJobForm");
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        ...initial,
        ...parsed,
        common: {
          ...initial.common,
          ...(parsed.common || {}),
        },
        freelancer: {
          ...initial.freelancer,
          ...(parsed.freelancer || {}),
          requirements: Array.isArray(parsed?.freelancer?.requirements)
            ? parsed.freelancer.requirements
            : initial.freelancer.requirements,
        },
        cofounder: {
          ...initial.cofounder,
          ...(parsed.cofounder || {}),
          requirements: Array.isArray(parsed?.cofounder?.requirements)
            ? parsed.cofounder.requirements
            : initial.cofounder.requirements,
          responsibilities: Array.isArray(parsed?.cofounder?.responsibilities)
            ? parsed.cofounder.responsibilities
            : initial.cofounder.responsibilities,
        },
      };
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please log in to post a job");
      navigate("/login-signup");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("addJobForm", JSON.stringify(formData));
  }, [formData]);

  const hiringType = formData.hiringType;

  function toggleRoleCategory(cat) {
    setFormData((s) => {
      const exists = s.common.roleCategories.includes(cat);
      const next = exists
        ? s.common.roleCategories.filter((c) => c !== cat)
        : [...s.common.roleCategories, cat];
      return { ...s, common: { ...s.common, roleCategories: next } };
    });
  }

  function togglePriority(p) {
    setFormData((s) => {
      const exists = s.cofounder.priorities.includes(p);
      const next = exists
        ? s.cofounder.priorities.filter((x) => x !== p)
        : [...s.cofounder.priorities, p];
      return { ...s, cofounder: { ...s.cofounder, priorities: next } };
    });
  }

  const validateForm = () => {
    const errors = [];
    const { hiringType, common, freelancer, cofounder } = formData;
    if (!common.domain) errors.push("Please select a domain");
    if (hiringType === "freelancer" || hiringType === "both") {
      if (common.roleCategories.length === 0)
        errors.push("Please select at least one role category for freelancer");
      if (!freelancer.workType) errors.push("Please select work type");
      if (!freelancer.duration) errors.push("Please select duration");
      if (!freelancer.budget?.trim()) errors.push("Please enter a budget");
      if (!freelancer.urgency) errors.push("Please select urgency");
      if (!freelancer.jobLevel) errors.push("Please select job level");
      if (!freelancer.jobType) errors.push("Please select job type");
      if (
        !freelancer.requirements ||
        freelancer.requirements.filter((r) => r.trim() !== "").length === 0
      )
        errors.push("Please add at least one job requirement");
      if (!freelancer.jobTitle?.trim())
        errors.push("Please provide a job title for freelancer position");
      if (!freelancer.jobDescription?.trim())
        errors.push("Please provide a job description for freelancer position");
    }
    if (hiringType === "cofounder" || hiringType === "both") {
      if (!cofounder.roleType) errors.push("Please select role type for cofounder");
      if (!cofounder.compensation) errors.push("Please select compensation");
      if (!cofounder.commitment) errors.push("Please select commitment level");
      if (cofounder.priorities.length === 0)
        errors.push("Please select at least one priority factor for cofounder");
      if (!cofounder.jobLevel) errors.push("Please select job level for cofounder");
      if (!cofounder.jobType) errors.push("Please select job type for cofounder");
      if (
        !cofounder.requirements ||
        cofounder.requirements.filter((r) => r.trim() !== "").length === 0
      )
        errors.push("Please add at least one job requirement for cofounder");
      if (
        !cofounder.responsibilities ||
        cofounder.responsibilities.filter((r) => r.trim() !== "").length === 0
      )
        errors.push("Please add at least one responsibility for cofounder");
      if (!cofounder.jobTitle?.trim())
        errors.push("Please provide a job title for cofounder position");
      if (!cofounder.jobDescription?.trim())
        errors.push("Please provide a job description for cofounder position");
    }
    return errors;
  };

  async function handleSubmit() {
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }
    const userId = getUserId();
    if (!userId) {
      toast.error("User not logged in. Please log in again.");
      navigate("/login-signup");
      return;
    }
    setLoading(true);
    try {
      const { hiringType, common, freelancer, cofounder } = formData;
      if (hiringType === "freelancer" || hiringType === "both") {
        await api.post(`/api/jobs/freelancer`, {
          user_id: Number(userId),
          domain: common.domain,
          role_category: common.roleCategories.join(", "),
          work_type: freelancer.workType,
          duration: freelancer.duration,
          budget_range: freelancer.budget,
          urgency: freelancer.urgency,
          job_level: freelancer.jobLevel,
          job_type: freelancer.jobType,
          job_requirements: freelancer.requirements.filter((r) => r.trim() !== ""),
          job_title: freelancer.jobTitle,
          full_job_description: freelancer.jobDescription,
        });
        toast.success("Freelancer job posted successfully!");
      }
      if (hiringType === "cofounder" || hiringType === "both") {
        await api.post(`/api/jobs/cofounder`, {
          user_id: Number(userId),
          domain: common.domain,
          role_type: cofounder.roleType,
          compensation: cofounder.compensation,
          commitment: cofounder.commitment,
          priority_factors: cofounder.priorities,
          job_level: cofounder.jobLevel,
          job_location_type: cofounder.jobType,
          job_requirements: cofounder.requirements.filter((r) => r.trim() !== ""),
          responsibilities: cofounder.responsibilities.filter((r) => r.trim() !== ""),
          job_title: cofounder.jobTitle,
          full_job_description: cofounder.jobDescription,
        });
        toast.success("Cofounder job posted successfully!");
      }
      localStorage.removeItem("addJobForm");
      setTimeout(() => {
        navigate("/startup-dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error posting job:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to post job. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (currentStep === 2) {
      const errors = validateForm();
      if (errors.length > 0) {
        errors.forEach((e) => toast.error(e));
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const budgetValue = parseFloat(formData.freelancer.budget.replace(/[^0-9.]/g, "")) || 0;
  const gst = budgetValue * 0.18;
  const commission = budgetValue * 0.03;
  const totalAmount = budgetValue + gst + commission;

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-32 px-6 pb-20 max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">
          Create a new job<span className="text-blue-500">.</span>
        </h1>

        {/* Step 1: Hiring Type */}
        <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-6 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
              <span className="text-blue-500 italic">1 —</span> Hiring Type <span className="text-red-500 text-sm">*</span>
            </h2>
            {currentStep >= 0 && (
              <span className="text-green-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: "freelancer", title: "Hire Freelancer", subtitle: "Short-term paid work" },
              { key: "cofounder", title: "Hire Cofounder", subtitle: "Long-term strategic" },
              { key: "both", title: "Hire Both", subtitle: "Hybrid flow" },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setFormData((s) => ({ ...s, hiringType: c.key }))}
                className={`p-8 text-left rounded-[2rem] border transition-all duration-300 ${
                  formData.hiringType === c.key
                    ? "bg-blue-600/10 border-blue-500 text-white shadow-xl shadow-blue-500/10"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-400/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="font-black text-xl mb-1 tracking-tighter">{c.title}</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{c.subtitle}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Common Questions */}
        {currentStep >= 1 && (
          <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                <span className="text-blue-500 italic">2 —</span> Common Questions
              </h2>
              {currentStep > 1 && (
                <span className="text-green-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">
                Domain <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.common.domain}
                onChange={(e) =>
                  setFormData((s) => ({
                    ...s,
                    common: { ...s.common, domain: e.target.value },
                  }))
                }
                className="w-full bg-white/5 rounded-2xl p-5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all text-white font-bold cursor-pointer hover:bg-white/10"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-gray-900">{d}</option>
                ))}
              </select>
            </div>
          </section>
        )}

        {/* Step 3: Role Specific */}
        {currentStep >= 2 && (
          <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                <span className="text-blue-500 italic">3 —</span> Role Specific
              </h2>
              {currentStep > 2 && (
                <span className="text-green-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>

            {(hiringType === "freelancer" || hiringType === "both") && (
              <div className="mb-10 p-8 rounded-[2rem] border border-blue-500/20 bg-blue-500/5">
                <h3 className="font-black mb-8 text-xl tracking-tighter uppercase text-blue-400">Freelancer Job Details</h3>
                
                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">
                    Role Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap">
                    {ROLE_CATEGORIES.map((r) => (
                      <Chip key={r} label={r} active={formData.common.roleCategories.includes(r)} onClick={() => toggleRoleCategory(r)} />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">
                    Work Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[ "Fixed task", "Ongoing part-time", "Full-time contract", "One-time consultation" ].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, workType: w } }))}
                        className={`px-4 py-3 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all ${
                          formData.freelancer.workType === w ? "bg-blue-500 border-blue-500 text-white" : "bg-white/5 border-white/10 text-gray-500 hover:border-blue-500/30"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Duration <span className="text-red-500">*</span></label>
                    <select
                      value={formData.freelancer.duration}
                      onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, duration: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-blue-500 transition-all"
                    >
                      {["< 1 week", "1–4 weeks", "1–3 months", "3+ months", "Ongoing"].map((d) => <option key={d} className="bg-gray-900">{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Budget <span className="text-red-500">*</span></label>
                    <div className="relative">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
                       <input
                         type="text" value={formData.freelancer.budget}
                         onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, budget: e.target.value } }))}
                         className="w-full bg-white/5 p-4 pl-12 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-blue-500 transition-all"
                         placeholder="e.g. 50,000"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Urgency <span className="text-red-500">*</span></label>
                    <select
                      value={formData.freelancer.urgency}
                      onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, urgency: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-blue-500 transition-all"
                    >
                      {["ASAP (within 7 days)", "Within 1 month", "Flexible"].map((u) => <option key={u} className="bg-gray-900">{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Level <span className="text-red-500">*</span></label>
                    <select value={formData.freelancer.jobLevel} onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, jobLevel: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="" className="bg-gray-900">Select job level</option>
                      {["Low level", "Medium level", "High level"].map(l => <option key={l} className="bg-gray-900">{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Type <span className="text-red-500">*</span></label>
                    <select value={formData.freelancer.jobType} onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, jobType: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="" className="bg-gray-900">Select job type</option>
                      {["Work from home", "Hybrid", "In office"].map(t => <option key={t} className="bg-gray-900">{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.freelancer.jobTitle} onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, jobTitle: e.target.value } }))}
                    className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white font-bold focus:border-blue-500 outline-none hover:bg-white/10 transition-all"
                    placeholder="e.g. Senior Full Stack Developer"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Description <span className="text-red-500">*</span></label>
                  <textarea value={formData.freelancer.jobDescription} onChange={(e) => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, jobDescription: e.target.value } }))} rows="5"
                    className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 text-white font-medium focus:border-blue-500 outline-none resize-none hover:bg-white/10 transition-all"
                    placeholder="Describe responsibilities, expectations, tech stack, deliverables..."
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Requirements <span className="text-red-500">*</span></label>
                  {formData.freelancer.requirements.map((req, idx) => (
                    <div key={idx} className="flex gap-3 mb-3">
                       <input type="text" value={req} onChange={(e) => {
                         const updated = [...formData.freelancer.requirements]; updated[idx] = e.target.value;
                         setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, requirements: updated } }));
                       }} className="flex-grow bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold focus:border-blue-500 outline-none" placeholder={`Requirement ${idx + 1}`} />
                       <button onClick={() => {
                          const next = formData.freelancer.requirements.filter((_, i) => i !== idx);
                          setFormData(fd => ({ ...fd, freelancer: { ...fd.freelancer, requirements: next.length ? next : [""] } }));
                       }} className="p-4 text-red-500 bg-white/5 rounded-xl hover:bg-red-500/10"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFormData((fd) => ({ ...fd, freelancer: { ...fd.freelancer, requirements: [...fd.freelancer.requirements, ""], }, }))}
                    className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2 hover:text-blue-300 transition-colors"
                  >
                    + Add requirement
                  </button>
                </div>
              </div>
            )}

            {(hiringType === "cofounder" || hiringType === "both") && (
              <div className="mb-10 p-8 rounded-[2rem] border border-purple-500/20 bg-purple-500/5">
                <h3 className="font-black mb-8 text-xl tracking-tighter uppercase text-purple-400">Cofounder Position Details</h3>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Role Type <span className="text-red-500">*</span></label>
                    <select value={formData.cofounder.roleType} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, roleType: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-purple-500 transition-all"
                    >
                      {[ "Technical (CTO / Engineer)", "Business / Operations (COO)", "Marketing / Growth", "Sales / BD", "Product / Design", "Finance / Legal", ].map((r) => <option key={r} className="bg-gray-900">{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Compensation <span className="text-red-500">*</span></label>
                    <select value={formData.cofounder.compensation} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, compensation: e.target.value } }))}
                      className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-purple-500 transition-all"
                    >
                      {[ "Equity only", "Equity + stipend", "Equity + small salary", "Negotiable", ].map((c) => <option key={c} className="bg-gray-900">{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div>
                      <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Commitment <span className="text-red-500">*</span></label>
                      <select value={formData.cofounder.commitment} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, commitment: e.target.value } }))}
                        className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-purple-500 transition-all"
                      >
                        {["Full-time", "Part-time initially", "Flexible"].map(c => <option key={c} className="bg-gray-900">{c}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Level <span className="text-red-500">*</span></label>
                      <select value={formData.cofounder.jobLevel} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, jobLevel: e.target.value } }))}
                        className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="" className="bg-gray-900">Select level</option>
                        {["Low level", "Medium level", "High level"].map(l => <option key={l} className="bg-gray-900">{l}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Type <span className="text-red-500">*</span></label>
                      <select value={formData.cofounder.jobType} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, jobType: e.target.value } }))}
                        className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="" className="bg-gray-900">Select type</option>
                        {["Work from home", "Hybrid", "In office"].map(t => <option key={t} className="bg-gray-900">{t}</option>)}
                      </select>
                   </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Priority Factors <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap">
                    {[ "Technical skills", "Domain expertise", "Network / connections", "Fundraising ability", "Sales / GTM skills", "Cultural fit", ].map((p) => (
                      <button key={p} type="button" onClick={() => togglePriority(p)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all duration-300 mr-2 mb-2 ${
                           formData.cofounder.priorities.includes(p) ? "bg-purple-600 border-purple-500 text-white" : "bg-white/5 text-gray-500 border-white/10 hover:border-purple-500/30"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.cofounder.jobTitle} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, jobTitle: e.target.value } }))}
                    className="w-full bg-white/5 p-5 rounded-2xl border border-white/10 text-white font-bold focus:border-purple-500 outline-none hover:bg-white/10 transition-all"
                    placeholder="e.g. Co-Founder & CTO"
                  />
                </div>

                <div className="mb-10">
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Description <span className="text-red-500">*</span></label>
                  <textarea value={formData.cofounder.jobDescription} onChange={(e) => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, jobDescription: e.target.value } }))} rows="5"
                    className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 text-white font-medium focus:border-purple-500 outline-none resize-none hover:bg-white/10 transition-all"
                    placeholder="Describe the vision, equity split, company stage..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Job Requirements <span className="text-red-500">*</span></label>
                    {formData.cofounder.requirements.map((req, idx) => (
                      <input key={idx} type="text" value={req} onChange={(e) => {
                        const updated = [...formData.cofounder.requirements]; updated[idx] = e.target.value;
                        setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, requirements: updated }, }));
                      }} className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold focus:border-purple-500 outline-none mb-3" placeholder={`Req ${idx + 1}`} />
                    ))}
                    <button type="button" onClick={() => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, requirements: [...fd.cofounder.requirements, ""], }, }))}
                      className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-300 transition-colors"
                    > + Add requirement </button>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-4">Responsibilities <span className="text-red-500">*</span></label>
                    {formData.cofounder.responsibilities.map((resp, idx) => (
                      <input key={idx} type="text" value={resp} onChange={(e) => {
                        const updated = [...formData.cofounder.responsibilities]; updated[idx] = e.target.value;
                        setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, responsibilities: updated }, }));
                      }} className="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-white font-bold focus:border-purple-500 outline-none mb-3" placeholder={`Resp ${idx + 1}`} />
                    ))}
                    <button type="button" onClick={() => setFormData((fd) => ({ ...fd, cofounder: { ...fd.cofounder, responsibilities: [...fd.cofounder.responsibilities, ""], }, }))}
                      className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-300 transition-colors"
                    > + Add responsibility </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep >= 3 && (
          <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 mb-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5">
            <h2 className="text-2xl font-black tracking-tight uppercase mb-8">4 — Review & Submit</h2>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
              <div className="mb-6 flex gap-10">
                <div className="flex-1">
                  <strong className="text-blue-400 text-[10px] font-black tracking-widest uppercase block mb-1">Hiring Type</strong>
                  <div className="capitalize font-black text-xl tracking-tighter">{formData.hiringType}</div>
                </div>
                <div className="flex-1">
                  <strong className="text-blue-400 text-[10px] font-black tracking-widest uppercase block mb-1">Domain</strong>
                  <div className="font-black text-xl tracking-tighter">{formData.common.domain}</div>
                </div>
              </div>

              {(hiringType === "freelancer" || hiringType === "both") && (
                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-blue-500/20">
                  <h3 className="font-black mb-4 text-sm text-blue-400 uppercase tracking-widest">Freelancer Job Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Roles</span> {formData.common.roleCategories.join(", ") || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Work Type</span> {formData.freelancer.workType || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Duration</span> {formData.freelancer.duration || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Budget</span> {formData.freelancer.budget || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Urgency</span> {formData.freelancer.urgency || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Level</span> {formData.freelancer.jobLevel || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Type</span> {formData.freelancer.jobType || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Job Title</span> {formData.freelancer.jobTitle || "—"}</div>
                  </div>
                </div>
              )}

              {(hiringType === "cofounder" || hiringType === "both") && (
                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-purple-500/20">
                  <h3 className="font-black mb-4 text-sm text-purple-400 uppercase tracking-widest">Cofounder Position Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Role Type</span> {formData.cofounder.roleType || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Compensation</span> {formData.cofounder.compensation || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Commitment</span> {formData.cofounder.commitment || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Priorities</span> {formData.cofounder.priorities.join(", ") || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Level</span> {formData.cofounder.jobLevel || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Type</span> {formData.cofounder.jobType || "—"}</div>
                    <div><span className="text-gray-500 uppercase font-black text-[8px] block mb-1">Job Title</span> {formData.cofounder.jobTitle || "—"}</div>
                  </div>
                </div>
              )}

              {/* ── Bill Summary (Only for Freelancer) ── */}
              {hiringType !== "cofounder" && (
                <div className="mt-8 p-8 rounded-[2rem] border-2 border-green-500/30 bg-green-500/5">
                  <h3 className="font-black mb-6 text-xl text-green-400 tracking-tighter uppercase">Bill Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-400">Base Budget</span>
                      <span className="text-white">₹{budgetValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                      <span>GST (18%)</span>
                      <span>₹{gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                      <span>FoundU Commission (3%)</span>
                      <span>₹{commission.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 mt-6 pt-6 flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase pb-1">Total Amount</span>
                      <span className="text-4xl font-black text-white tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-6 mt-12">
          {currentStep > 0 ? (
            <button onClick={handleBack} className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          <div className="flex gap-4">
            {currentStep < 3 ? (
              <button onClick={handleNext} className="px-12 py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] tracking-widest uppercase transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-2 group">
                Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="px-14 py-5 rounded-3xl bg-green-600 hover:bg-green-500 text-white font-black text-[10px] tracking-widest uppercase transition-all shadow-2xl shadow-green-600/30 disabled:opacity-50 flex items-center gap-2 group">
                {loading ? "Processing..." : "Submit Job"} <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer theme="dark" position="bottom-right" />
      <style dangerouslySetInnerHTML={{ __html: `.animate-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }` }} />
    </div>
  );
}