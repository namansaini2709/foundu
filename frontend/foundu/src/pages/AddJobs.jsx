import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

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
  },
  cofounder: {
    roleType: "Technical (CTO / Engineer)",
    compensation: "Equity only",
    commitment: "Full-time",
    priorities: [],
  },
  aiPreferences: { trustSignals: [], riskPreference: "Mix of both" },
  hybrid: { hiringOrder: "Freelancer first", conversionPlan: "Maybe" },
  vendors: { usesVendors: false, vendorCategories: [], vendorTriggers: [] },
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
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem("addJobForm");
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem("addJobForm", JSON.stringify(formData));
  }, [formData]);

  const hiringType = formData.hiringType;

  const progress = useMemo(() => {
    // simple progress percentage based on step count (0..5)
    const max = 6;
    return Math.round(((step + 1) / max) * 100);
  }, [step]);

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

  function handleSubmit() {
    // For MVP simply log and navigate to dashboard or show a success message.
    console.log("Submitting formData:", formData);
    localStorage.removeItem("addJobForm");
    navigate("/startup-dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="pt-28 pb-12 w-full max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Create a new job</h1>
        <div className="mb-6">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-blue-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Progress: {progress}%
          </div>
        </div>

        {/* Stepper / Sections */}
        <section className="bg-gray-900/40 p-6 rounded-2xl mb-6">
          {step === 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">1 — Hiring Type</h2>
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
                    className={`p-5 text-left rounded-xl border transition-colors ${formData.hiringType === c.key ? "bg-blue-500 border-blue-500 text-white" : "bg-gray-800 border-gray-700 text-gray-200"}`}
                  >
                    <div className="font-semibold text-lg">{c.title}</div>
                    <div className="text-sm text-gray-300">{c.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                2 — Common Questions
              </h2>
              {/* Role Category moved to Freelancer section to keep it freelancer-specific */}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Domain</label>
                <select
                  value={formData.common.domain}
                  onChange={(e) =>
                    setFormData((s) => ({
                      ...s,
                      common: { ...s.common, domain: e.target.value },
                    }))
                  }
                  className="w-full bg-gray-800 rounded-md p-2 border border-gray-700"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Startup Stage
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  {[
                    "Idea stage",
                    "MVP building",
                    "Launched with users",
                    "Revenue generating",
                    "Scaling",
                  ].map((s) => (
                    <label
                      key={s}
                      className={`px-3 py-2 rounded-md border ${formData.common.startupStage === s ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
                    >
                      <input
                        className="hidden"
                        type="radio"
                        name="stage"
                        checked={formData.common.startupStage === s}
                        onChange={() =>
                          setFormData((fd) => ({
                            ...fd,
                            common: { ...fd.common, startupStage: s },
                          }))
                        }
                      />
                      <div className="text-sm">{s}</div>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          {step === 2 && ( // Freelancer or Cofounder sections depending on type
            <div>
              <h2 className="text-xl font-semibold mb-4">3 — Role Specific</h2>
              {(hiringType === "freelancer" || hiringType === "both") && (
                <div className="mb-6 p-4 rounded-lg border bg-gray-800">
                  <h3 className="font-semibold mb-3">Freelancer</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Role Category
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
                    <label className="block text-sm mb-1">Work Type</label>
                    <div className="flex gap-3">
                      {[
                        "Fixed task",
                        "Ongoing part-time",
                        "Full-time contract",
                        "One-time consultation",
                      ].map((w) => (
                        <label
                          key={w}
                          className={`px-3 py-2 rounded-md border ${formData.freelancer.workType === w ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
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
                      <label className="block text-sm mb-1">Duration</label>
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
                        className="w-full bg-gray-800 p-2 rounded-md border border-gray-700"
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
                      <label className="block text-sm mb-1">Budget Range</label>
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
                        className="w-full bg-gray-800 p-2 rounded-md border border-gray-700"
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
                      <label className="block text-sm mb-1">Urgency</label>
                      <div className="flex gap-2">
                        {[
                          "ASAP (within 7 days)",
                          "Within 1 month",
                          "Flexible",
                        ].map((u) => (
                          <button
                            key={u}
                            type="button"
                            className={`px-3 py-1 rounded-md border ${formData.freelancer.urgency === u ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
                            onClick={() =>
                              setFormData((fd) => ({
                                ...fd,
                                freelancer: { ...fd.freelancer, urgency: u },
                              }))
                            }
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(hiringType === "cofounder" || hiringType === "both") && (
                <div className="mb-6 p-4 rounded-lg border bg-gray-800">
                  <h3 className="font-semibold mb-3">Cofounder</h3>
                  <div className="mb-3">
                    <label className="block text-sm mb-1">Role Type</label>
                    <div className="flex flex-wrap gap-3">
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
                          className={`px-3 py-2 rounded-md border ${formData.cofounder.roleType === r ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
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

                  <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Compensation</label>
                      {[
                        "Equity only",
                        "Equity + stipend",
                        "Salary later (after funding)",
                        "Not decided",
                      ].map((c) => (
                        <label
                          key={c}
                          className={`block px-3 py-2 rounded-md border mb-2 ${formData.cofounder.compensation === c ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
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
                      <label className="block text-sm mb-1">Commitment</label>
                      {[
                        "Full-time",
                        "Part-time (10–20 hrs/week)",
                        "Advisor / Mentor",
                      ].map((c) => (
                        <label
                          key={c}
                          className={`block px-3 py-2 rounded-md border mb-2 ${formData.cofounder.commitment === c ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
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
                    <div>
                      <label className="block text-sm mb-1">
                        Priority Factors
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
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                4 — AI Preferences & Vendors
              </h2>
              <div className="mb-4 p-4 rounded-lg border bg-gradient-to-r from-purple-700 to-indigo-700/40">
                <h3 className="font-semibold mb-2">AI Preferences</h3>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Trust Signals</label>
                  <div className="flex flex-wrap">
                    {[
                      "Verified past projects",
                      "Trial sprint",
                      "Peer reviews",
                      "AI credibility score",
                      "Founder references",
                    ].map((t) => (
                      <label
                        key={t}
                        className={`px-3 py-1 rounded-md border mr-2 mb-2 ${formData.aiPreferences.trustSignals.includes(t) ? "bg-white text-black border-white" : "bg-gray-800 border-gray-700"}`}
                      >
                        <input
                          className="hidden"
                          type="checkbox"
                          checked={formData.aiPreferences.trustSignals.includes(
                            t,
                          )}
                          onChange={() =>
                            setFormData((fd) => ({
                              ...fd,
                              aiPreferences: {
                                ...fd.aiPreferences,
                                trustSignals:
                                  fd.aiPreferences.trustSignals.includes(t)
                                    ? fd.aiPreferences.trustSignals.filter(
                                        (x) => x !== t,
                                      )
                                    : [...fd.aiPreferences.trustSignals, t],
                              },
                            }))
                          }
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Risk Preference</label>
                  <div className="flex gap-3">
                    {[
                      "Experienced but expensive",
                      "Junior but fast learner",
                      "Mix of both",
                      "Speed matters more than experience",
                    ].map((r) => (
                      <label
                        key={r}
                        className={`px-3 py-2 rounded-md border ${formData.aiPreferences.riskPreference === r ? "bg-white text-black border-white" : "bg-gray-800 border-gray-700"}`}
                      >
                        <input
                          className="hidden"
                          type="radio"
                          name="risk"
                          checked={formData.aiPreferences.riskPreference === r}
                          onChange={() =>
                            setFormData((fd) => ({
                              ...fd,
                              aiPreferences: {
                                ...fd.aiPreferences,
                                riskPreference: r,
                              },
                            }))
                          }
                        />
                        {r}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 rounded-lg border bg-gray-800">
                <h3 className="font-semibold mb-2">Vendors</h3>
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm">Do you use vendors?</label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.vendors.usesVendors}
                      onChange={(e) =>
                        setFormData((fd) => ({
                          ...fd,
                          vendors: {
                            ...fd.vendors,
                            usesVendors: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span
                      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${formData.vendors.usesVendors ? "bg-blue-500" : "bg-gray-700"}`}
                    >
                      <span
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform ${formData.vendors.usesVendors ? "translate-x-6" : ""}`}
                      />
                    </span>
                  </label>
                </div>

                {formData.vendors.usesVendors && (
                  <div>
                    <label className="block text-sm mb-2">
                      Vendor Categories
                    </label>
                    <div className="flex flex-wrap">
                      {[
                        "Product development agency",
                        "UI/UX design studio",
                        "Marketing / Growth agency",
                        "Legal / Compliance",
                        "Accounting / Finance",
                        "Cloud / DevOps",
                        "Customer support outsourcing",
                        "Other",
                      ].map((v) => (
                        <label
                          key={v}
                          className={`px-3 py-1 rounded-md border mr-2 mb-2 ${formData.vendors.vendorCategories.includes(v) ? "bg-blue-500 border-blue-500" : "bg-gray-800 border-gray-700"}`}
                          onClick={() =>
                            setFormData((fd) => ({
                              ...fd,
                              vendors: {
                                ...fd.vendors,
                                vendorCategories:
                                  fd.vendors.vendorCategories.includes(v)
                                    ? fd.vendors.vendorCategories.filter(
                                        (x) => x !== v,
                                      )
                                    : [...fd.vendors.vendorCategories, v],
                              },
                            }))
                          }
                        >
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                4 — Review & Submit
              </h2>
              <div className="bg-gray-900 p-4 rounded-lg border">
                <div className="mb-3">
                  <strong>Hiring Type:</strong> {formData.hiringType}
                </div>
                <div className="mb-3">
                  <strong>Roles:</strong>{" "}
                  {formData.common.roleCategories.join(", ") || "—"}
                </div>
                <div className="mb-3">
                  <strong>Domain:</strong> {formData.common.domain}
                </div>
                <div className="mb-3">
                  <strong>Budget / Compensation:</strong>{" "}
                  {hiringType === "freelancer"
                    ? formData.freelancer.budget
                    : formData.cofounder.compensation}
                </div>
                <div className="mb-3">
                  <strong>Urgency:</strong> {formData.freelancer.urgency || "—"}
                </div>
                <div className="mb-3">
                  <strong>Vendors:</strong>{" "}
                  {formData.vendors.usesVendors
                    ? formData.vendors.vendorCategories.join(", ") || "Yes"
                    : "No"}
                </div>
              </div>
            </div>
          )}
        </section>

        <div className="flex items-center justify-between gap-4">
          <div>
            {step > 0 && (
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 mr-2"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                localStorage.setItem("addJobForm", JSON.stringify(formData));
                alert("Progress saved locally.");
              }}
              className="px-4 py-2 rounded-md bg-gray-700 border"
            >
              Save for later
            </button>
            {step === 4 && (
              <button
                onClick={handleSubmit}
                className="ml-3 px-4 py-2 rounded-md bg-green-500 hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
