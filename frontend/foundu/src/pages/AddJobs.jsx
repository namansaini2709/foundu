import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    budget: "$500–$2,000",
    urgency: "Flexible",
    jobTitle: "",
    jobDescription: "",
  },
  cofounder: {
    roleType: "Technical (CTO / Engineer)",
    compensation: "Equity only",
    commitment: "Full-time",
    priorities: [],
    jobTitle: "",
    jobDescription: "",
  },
};

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border transition-all mr-2 mb-2 ${
        active
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-gray-800 text-gray-200 border-gray-700"
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
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
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
      if (!freelancer.budget) errors.push("Please select budget range");
      if (!freelancer.urgency) errors.push("Please select urgency");
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

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User not logged in. Please log in again.");
      navigate("/login-signup");
      return;
    }

    setLoading(true);

    try {
      const { hiringType, common, freelancer, cofounder } = formData;

      if (hiringType === "freelancer" || hiringType === "both") {
        await axios.post("http://localhost:4000/api/jobs/freelancer", {
          user_id: Number(userId),
          domain: common.domain,
          role_category: common.roleCategories.join(", "),
          work_type: freelancer.workType,
          duration: freelancer.duration,
          budget_range: freelancer.budget,
          urgency: freelancer.urgency,
          job_title: freelancer.jobTitle,
          full_job_description: freelancer.jobDescription,
        });
        toast.success("Freelancer job posted successfully!");
      }

      if (hiringType === "cofounder" || hiringType === "both") {
        await axios.post("http://localhost:4000/api/jobs/cofounder", {
          user_id: Number(userId),
          domain: common.domain,
          role_type: cofounder.roleType,
          compensation: cofounder.compensation,
          commitment: cofounder.commitment,
          priority_factors: cofounder.priorities,
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
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="pt-28 pb-12 w-full max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Create a new job</h1>

        {/* Step 1: Hiring Type */}
        <section className="bg-gray-900/40 p-6 rounded-2xl mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              1 — Hiring Type <span className="text-red-500">*</span>
            </h2>
            {currentStep >= 0 && (
              <span className="text-green-500 text-sm">✓ Completed</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                key: "freelancer",
                title: "Hire Freelancer",
                subtitle: "Short-term paid work",
              },
              {
                key: "cofounder",
                title: "Hire Cofounder",
                subtitle: "Long-term strategic",
              },
              { key: "both", title: "Hire Both", subtitle: "Hybrid flow" },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() =>
                  setFormData((s) => ({ ...s, hiringType: c.key }))
                }
                className={`p-5 text-left rounded-xl border transition-colors ${
                  formData.hiringType === c.key
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-200 hover:border-blue-400"
                }`}
              >
                <div className="font-semibold text-lg">{c.title}</div>
                <div className="text-sm text-gray-300">{c.subtitle}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Common Questions */}
        {currentStep >= 1 && (
          <section className="bg-gray-900/40 p-6 rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">2 — Common Questions</h2>
              {currentStep > 1 && (
                <span className="text-green-500 text-sm">✓ Completed</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
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
                className="w-full bg-gray-800 rounded-md p-3 border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors text-white"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </section>
        )}

        {/* Step 3: Role Specific */}
        {currentStep >= 2 && (
          <section className="bg-gray-900/40 p-6 rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">3 — Role Specific</h2>
              {currentStep > 2 && (
                <span className="text-green-500 text-sm">✓ Completed</span>
              )}
            </div>

            {(hiringType === "freelancer" || hiringType === "both") && (
              <div className="mb-6 p-4 rounded-lg border border-blue-500/30 bg-gray-800">
                <h3 className="font-semibold mb-3 text-lg">
                  Freelancer Job Details
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Role Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap">
                    {ROLE_CATEGORIES.map((r) => (
                      <Chip
                        key={r}
                        label={r}
                        active={formData.common.roleCategories.includes(r)}
                        onClick={() => toggleRoleCategory(r)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Work Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "Fixed task",
                      "Ongoing part-time",
                      "Full-time contract",
                      "One-time consultation",
                    ].map((w) => (
                      <label
                        key={w}
                        className={`px-3 py-2 rounded-md border cursor-pointer transition-colors text-center ${
                          formData.freelancer.workType === w
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-800 border-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <input
                          className="hidden"
                          type="radio"
                          name="workType"
                          checked={formData.freelancer.workType === w}
                          onChange={() =>
                            setFormData((fd) => ({
                              ...fd,
                              freelancer: { ...fd.freelancer, workType: w },
                            }))
                          }
                        />
                        {w}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.freelancer.duration}
                      onChange={(e) =>
                        setFormData((fd) => ({
                          ...fd,
                          freelancer: {
                            ...fd.freelancer,
                            duration: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-gray-800 p-2 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                    >
                      {[
                        "< 1 week",
                        "1–4 weeks",
                        "1–3 months",
                        "3+ months",
                        "Ongoing",
                      ].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.freelancer.budget}
                      onChange={(e) =>
                        setFormData((fd) => ({
                          ...fd,
                          freelancer: {
                            ...fd.freelancer,
                            budget: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-gray-800 p-2 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                    >
                      {[
                        "<$500",
                        "$500–$2,000",
                        "$2,000–$10,000",
                        "$10,000+",
                        "Not decided",
                      ].map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Urgency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.freelancer.urgency}
                      onChange={(e) =>
                        setFormData((fd) => ({
                          ...fd,
                          freelancer: {
                            ...fd.freelancer,
                            urgency: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-gray-800 p-2 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                    >
                      {[
                        "ASAP (within 7 days)",
                        "Within 1 month",
                        "Flexible",
                      ].map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.freelancer.jobTitle}
                    onChange={(e) =>
                      setFormData((fd) => ({
                        ...fd,
                        freelancer: {
                          ...fd.freelancer,
                          jobTitle: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-800 p-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400"
                    placeholder="e.g., Full Stack Developer, UI/UX Designer"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.freelancer.jobDescription}
                    onChange={(e) =>
                      setFormData((fd) => ({
                        ...fd,
                        freelancer: {
                          ...fd.freelancer,
                          jobDescription: e.target.value,
                        },
                      }))
                    }
                    rows="5"
                    className="w-full bg-gray-800 p-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-white placeholder-gray-400"
                    placeholder="Describe the job requirements, responsibilities, and qualifications..."
                  />
                </div>
              </div>
            )}

            {(hiringType === "cofounder" || hiringType === "both") && (
              <div className="mb-6 p-4 rounded-lg border border-purple-500/30 bg-gray-800">
                <h3 className="font-semibold mb-3 text-lg">
                  Cofounder Requirements
                </h3>
                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Role Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Technical (CTO / Engineer)",
                      "Product / Design",
                      "Growth / Marketing",
                      "Business / Sales",
                      "Operations / Finance",
                      "Generalist",
                    ].map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`px-3 py-2 rounded-md border transition-colors ${
                          formData.cofounder.roleType === r
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-800 border-gray-700 hover:border-blue-400"
                        }`}
                        onClick={() =>
                          setFormData((fd) => ({
                            ...fd,
                            cofounder: { ...fd.cofounder, roleType: r },
                          }))
                        }
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Compensation <span className="text-red-500">*</span>
                    </label>
                    {[
                      "Equity only",
                      "Equity + stipend",
                      "Salary later (after funding)",
                      "Not decided",
                    ].map((c) => (
                      <label
                        key={c}
                        className={`block px-3 py-2 rounded-md border mb-2 cursor-pointer transition-colors ${
                          formData.cofounder.compensation === c
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-800 border-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <input
                          className="hidden"
                          type="radio"
                          name="comp"
                          checked={formData.cofounder.compensation === c}
                          onChange={() =>
                            setFormData((fd) => ({
                              ...fd,
                              cofounder: { ...fd.cofounder, compensation: c },
                            }))
                          }
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Commitment <span className="text-red-500">*</span>
                    </label>
                    {[
                      "Full-time",
                      "Part-time (10–20 hrs/week)",
                      "Advisor / Mentor",
                    ].map((c) => (
                      <label
                        key={c}
                        className={`block px-3 py-2 rounded-md border mb-2 cursor-pointer transition-colors ${
                          formData.cofounder.commitment === c
                            ? "bg-blue-500 border-blue-500"
                            : "bg-gray-800 border-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <input
                          className="hidden"
                          type="radio"
                          name="commit"
                          checked={formData.cofounder.commitment === c}
                          onChange={() =>
                            setFormData((fd) => ({
                              ...fd,
                              cofounder: { ...fd.cofounder, commitment: c },
                            }))
                          }
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Priority Factors <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap">
                    {[
                      "Vision / mindset alignment",
                      "Technical skill depth",
                      "Past startup experience",
                      "Network & connections",
                      "Execution speed",
                      "Culture fit",
                    ].map((p) => (
                      <Chip
                        key={p}
                        label={p}
                        active={formData.cofounder.priorities.includes(p)}
                        onClick={() => togglePriority(p)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cofounder.jobTitle}
                    onChange={(e) =>
                      setFormData((fd) => ({
                        ...fd,
                        cofounder: {
                          ...fd.cofounder,
                          jobTitle: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-800 p-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400"
                    placeholder="e.g., Technical Co-founder, CTO, Head of Growth"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm mb-2 font-medium">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.cofounder.jobDescription}
                    onChange={(e) =>
                      setFormData((fd) => ({
                        ...fd,
                        cofounder: {
                          ...fd.cofounder,
                          jobDescription: e.target.value,
                        },
                      }))
                    }
                    rows="5"
                    className="w-full bg-gray-800 p-3 rounded-md border border-gray-700 focus:border-blue-500 focus:outline-none resize-none text-white placeholder-gray-400"
                    placeholder="Describe what you're looking for in a co-founder, the vision, and expectations..."
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep >= 3 && (
          <section className="bg-gray-900/40 p-6 rounded-2xl mb-4">
            <h2 className="text-xl font-semibold mb-4">4 — Review & Submit</h2>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <div className="mb-4">
                <strong className="text-blue-400">Hiring Type:</strong>{" "}
                <span className="capitalize">{formData.hiringType}</span>
              </div>

              <div className="mb-4">
                <strong className="text-blue-400">Domain:</strong>{" "}
                {formData.common.domain}
              </div>

              {(hiringType === "freelancer" || hiringType === "both") && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">Freelancer Job</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Roles:</strong>{" "}
                      {formData.common.roleCategories.join(", ") || "—"}
                    </div>
                    <div>
                      <strong>Work Type:</strong> {formData.freelancer.workType}
                    </div>
                    <div>
                      <strong>Duration:</strong> {formData.freelancer.duration}
                    </div>
                    <div>
                      <strong>Budget:</strong> {formData.freelancer.budget}
                    </div>
                    <div>
                      <strong>Urgency:</strong> {formData.freelancer.urgency}
                    </div>
                    <div>
                      <strong>Job Title:</strong>{" "}
                      {formData.freelancer.jobTitle || "—"}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {formData.freelancer.jobDescription || "—"}
                    </div>
                  </div>
                </div>
              )}

              {(hiringType === "cofounder" || hiringType === "both") && (
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2 text-lg">
                    Cofounder Position
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Role Type:</strong> {formData.cofounder.roleType}
                    </div>
                    <div>
                      <strong>Compensation:</strong>{" "}
                      {formData.cofounder.compensation}
                    </div>
                    <div>
                      <strong>Commitment:</strong>{" "}
                      {formData.cofounder.commitment}
                    </div>
                    <div>
                      <strong>Priorities:</strong>{" "}
                      {formData.cofounder.priorities.join(", ") || "—"}
                    </div>
                    <div>
                      <strong>Job Title:</strong>{" "}
                      {formData.cofounder.jobTitle || "—"}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {formData.cofounder.jobDescription || "—"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.setItem("addJobForm", JSON.stringify(formData));
                toast.success("Progress saved!");
              }}
              className="px-6 py-2 rounded-md bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors"
            >
              Save for later
            </button>
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 rounded-md bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Job"}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer theme="dark" />
    </div>
  );
}