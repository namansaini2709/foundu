import { useState, useEffect, useRef } from "react";
import { getUserId } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
/**
 * Startup Profile Page Component
 * Multi-step profile completion page for startups
 */
const StartupProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userBasicInfo, setUserBasicInfo] = useState(null);
  const gradientBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };
  // Form state management
  const [formData, setFormData] = useState({
    // Step 1: Founder DNA
    startupName: "",
    ownerPhone: "+91",
    startupLogo: null, // Now holds File or URL string
    founderType: "",
    whyBuilding: "",
    superpower: "",
    superpowerOther: "",
    weaknesses: [],
    hoursPerWeek: "",
    cofounderType: [],
    // Step 2: Startup DNA
    problemSolving: "",
    whoHasProblem: "",
    problemImpact: "",
    solutionBuilding: "",
    monetization: "",
    unfairAdvantage: "",
    // Step 3: Burn Reality
    monthlyInvestment: "",
    survivalWithoutRevenue: "",
    biggestRisk: "",
    // Step 4: Hiring & Execution
    currentNeed: "",
    outcome30Days: "",
    executionFailures: "",
    trustFactors: [],
    // Step 5: Vendor Intelligence
    useVendors: "",
    vendorCategories: [],
    vendorPreference: [],
    // Step 6: AI Idea & Strategy Engine
    currentStage: "",
    growthBlocker: "",
    magicFix: "",
    // Step 7: Dashboard Intelligence
    dashboards: [],
    currentTools: "",
  });

  const hasFetched = useRef(false);

  // Get user data and fetch existing profile
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login-signup");
      return;
    }
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUserData(userId);
      fetchProfile(userId);
    }
  }, [navigate]);
  // Fetch user registration info for auto-fill
  const fetchUserData = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      const user = response.data.success ? response.data.data : response.data;
      setUserBasicInfo(user);
      // Auto-fill startupName if it's currently empty
      setFormData((prev) => ({
        ...prev,
        startupName: prev.startupName || user.full_name || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Fetch profile by user ID
  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(`/api/startup-profiles/user/${userId}`);
      const profile = response.data;
      // Helper to parse JSON safely
      const safeParse = (data) => {
        if (!data) return [];
        if (typeof data === "string") {
          try {
            return JSON.parse(data);
          } catch (e) {
            return [];
          }
        }
        return Array.isArray(data) ? data : [];
      };

      // Map database fields to form state
      setFormData({
        startupName: profile.startup_name || "",
        ownerPhone: profile.owner_phone || "+91",
        startupLogo: profile.startup_logo_url || null,
        founderType: profile.founder_type || "",
        whyBuilding: profile.why_building || "",
        superpower: profile.superpower || "",
        superpowerOther: profile.superpower_other || "",
        weaknesses: safeParse(profile.weaknesses),
        hoursPerWeek: profile.hours_per_week || "",
        cofounderType: safeParse(profile.cofounder_type),
        problemSolving: profile.problem_solving || "",
        whoHasProblem: profile.who_has_problem || "",
        problemImpact: profile.problem_impact || "",
        solutionBuilding: profile.solution_building || "",
        monetization: profile.monetization || "",
        unfairAdvantage: profile.unfair_advantage || "",
        monthlyInvestment: profile.monthly_investment || "",
        survivalWithoutRevenue: profile.survival_without_revenue || "",
        biggestRisk: profile.biggest_risk || "",
        currentNeed: profile.current_need || "",
        outcome30Days: profile.outcome_30_days || "",
        executionFailures: profile.execution_failures || "",
        trustFactors: safeParse(profile.trust_factors),
        useVendors: profile.use_vendors || "",
        vendorCategories: safeParse(profile.vendor_categories),
        vendorPreference: safeParse(profile.vendor_preference),
        currentStage: profile.current_stage || "",
        growthBlocker: profile.growth_blocker || "",
        magicFix: profile.magic_fix || "",
        dashboards: safeParse(profile.dashboards),
        currentTools: profile.current_tools || "",
      });

      toast.success("Profile loaded successfully");
    } catch (err) {
      // Profile doesn't exist yet, which is fine
      if (err.response?.status !== 404) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      }
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };
  /**
   * Handle checkbox/array changes
   */
  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };
  /**
   * Validate fields for the current step only
   */
  const validateCurrentStep = () => {
    const errors = [];
    switch (currentStep) {
      case 1: // Founder DNA
        if (!formData.startupName?.trim())
          errors.push("Startup Name is required");
        if (!formData.founderType?.trim())
          errors.push("Founder type is required");
        if (!formData.ownerPhone?.trim() || formData.ownerPhone === "+91")
          errors.push("Owner Phone Number is required");
        if (!formData.whyBuilding?.trim())
          errors.push("Why are you building a startup is required");
        if (!formData.superpower?.trim()) errors.push("Superpower is required");
        if (
          formData.superpower === "Other" &&
          !formData.superpowerOther?.trim()
        ) {
          errors.push("Please specify your superpower");
        }
        if (formData.weaknesses.length === 0)
          errors.push("At least one weakness is required");
        if (!formData.hoursPerWeek?.trim())
          errors.push("Hours per week is required");
        if (formData.cofounderType.length === 0)
          errors.push("At least one co-founder type is required");
        break;
      case 2: // Startup DNA
        if (!formData.problemSolving?.trim())
          errors.push("Problem solving is required");
        if (!formData.whoHasProblem?.trim())
          errors.push("Who has the problem is required");
        if (!formData.problemImpact?.trim())
          errors.push("Problem impact is required");
        if (!formData.solutionBuilding?.trim())
          errors.push("Solution building is required");
        if (!formData.monetization?.trim())
          errors.push("Monetization is required");
        if (!formData.unfairAdvantage?.trim())
          errors.push("Unfair advantage is required");
        break;
      case 3: // Burn Reality
        if (!formData.monthlyInvestment?.trim())
          errors.push("Monthly investment is required");
        if (!formData.survivalWithoutRevenue?.trim())
          errors.push("Survival without revenue is required");
        if (!formData.biggestRisk?.trim())
          errors.push("Biggest risk is required");
        break;
      case 4: // Hiring & Execution
        if (!formData.currentNeed?.trim())
          errors.push("Current need is required");
        if (!formData.outcome30Days?.trim())
          errors.push("30-day outcome is required");
        if (!formData.executionFailures?.trim())
          errors.push("Execution failures is required");
        if (formData.trustFactors.length === 0)
          errors.push("At least one trust factor is required");
        break;
      case 5: // Vendor Intelligence
        if (!formData.useVendors?.trim())
          errors.push("Vendor usage is required");
        break;
      case 6: // AI Idea & Strategy Engine
        if (!formData.currentStage?.trim())
          errors.push("Current stage is required");
        if (!formData.growthBlocker?.trim())
          errors.push("Growth blocker is required");
        if (!formData.magicFix?.trim()) errors.push("Magic fix is required");
        break;
      case 7: // Dashboard Intelligence
        if (formData.dashboards.length === 0)
          errors.push("At least one dashboard is required");
        if (!formData.currentTools?.trim())
          errors.push("Current tools is required");
        break;
      default:
        break;
    }
    return errors;
  };
  /**
   * Handle Next button click
   */
  const handleNext = () => {
    const errors = validateCurrentStep();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }
    if (currentStep < 7) {
      setCurrentStep((s) => s + 1);
      toast.success(`Step ${currentStep} completed!`);
    }
  };
  /**
   * Handle Back button
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };
  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Safety check – submit only on step 7
    if (currentStep !== 7) {
      toast.error("Please complete all steps before submitting");
      return;
    }
    // Validate current step (step 7)
    const errors = validateCurrentStep();
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
      const data = new FormData();
      data.append("user_id", Number(userId));
      data.append("startup_name", formData.startupName);
      data.append("owner_phone", formData.ownerPhone);
      if (formData.startupLogo instanceof File) {
        data.append("startup_logo", formData.startupLogo);
      } else if (formData.startupLogo) {
        data.append("startup_logo_url", formData.startupLogo);
      }
      data.append("founderType", formData.founderType);
      data.append("whyBuilding", formData.whyBuilding);
      data.append("superpower", formData.superpower);
      data.append("superpowerOther", formData.superpowerOther);
      data.append("weaknesses", JSON.stringify(formData.weaknesses));
      data.append("hoursPerWeek", formData.hoursPerWeek);
      data.append("cofounderType", JSON.stringify(formData.cofounderType));
      data.append("problemSolving", formData.problemSolving);
      data.append("whoHasProblem", formData.whoHasProblem);
      data.append("problemImpact", formData.problemImpact);
      data.append("solutionBuilding", formData.solutionBuilding);
      data.append("monetization", formData.monetization);
      data.append("unfairAdvantage", formData.unfairAdvantage);
      data.append("monthlyInvestment", formData.monthlyInvestment);
      data.append("survivalWithoutRevenue", formData.survivalWithoutRevenue);
      data.append("biggestRisk", formData.biggestRisk);
      data.append("currentNeed", formData.currentNeed);
      data.append("outcome30Days", formData.outcome30Days);
      data.append("executionFailures", formData.executionFailures);
      data.append("trustFactors", JSON.stringify(formData.trustFactors));
      data.append("useVendors", formData.useVendors);
      data.append(
        "vendorCategories",
        JSON.stringify(formData.vendorCategories),
      );
      data.append(
        "vendorPreference",
        JSON.stringify(formData.vendorPreference),
      );
      data.append("currentStage", formData.currentStage);
      data.append("growthBlocker", formData.growthBlocker);
      data.append("magicFix", formData.magicFix);
      data.append("dashboards", JSON.stringify(formData.dashboards));
      data.append("currentTools", formData.currentTools);
      const response = await api.post(`/api/startup-profiles`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Profile created:", response.data);
      toast.success("Profile created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/startup-dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const gradientBlackToBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };
  return (
    <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
      <div className="pt-20 md:pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-6 flex-wrap gap-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs ${
                      currentStep >= step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/50 text-gray-400"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 7 && (
                    <div
                      className={`w-4 sm:w-8 h-1 ${
                        currentStep > step ? "bg-blue-500" : "bg-gray-700/50"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
              Complete Your Startup Profile
            </h1>
            <p className="text-blue-200 text-sm text-center">
              Step {currentStep} of 7 - Fill in your details to connect with the
              right talent
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Founder DNA */}
            {currentStep === 1 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                       STEP 1-Founder DNA
                      </h2>
                      <div>
                        <label
                          htmlFor="startupName"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Startup Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="startupName"
                          name="startupName"
                          value={formData.startupName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                          placeholder="Enter your startup name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ownerPhone"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Owner Phone (Your Phone Number) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="ownerPhone"
                            name="ownerPhone"
                            value={formData.ownerPhone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="startupLogo"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Startup Logo{" "}
                          <span className="text-blue-300 font-normal">
                            (Upload File)
                          </span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                          <div className="flex-grow relative">
                            <input
                              type="file"
                              id="startupLogo"
                              name="startupLogo"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-xs sm:text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] sm:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                          </div>
                          {formData.startupLogo && (
                            <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-lg border border-blue-500/30 overflow-hidden shrink-0 bg-gray-900 flex items-center justify-center self-center sm:self-auto">
                              <img
                                src={
                                  formData.startupLogo instanceof File
                                    ? URL.createObjectURL(formData.startupLogo)
                                    : formData.startupLogo?.startsWith("http")
                                      ? formData.startupLogo
                                      : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}${formData.startupLogo}`
                                }
                                alt="Logo Preview"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          1. What best describes you right now?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            "Solo founder",
                            "Co-founder team",
                            "Aspiring founder (idea stage)",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="founderType"
                                value={option}
                                checked={formData.founderType === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="whyBuilding"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          2. Why are you building a startup?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="whyBuilding"
                          name="whyBuilding"
                          value={formData.whyBuilding}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Explain your motivation..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          3. What is your superpower?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Tech",
                            "Business",
                            "Product",
                            "Marketing",
                            "Operations",
                            "Sales",
                            "Other",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="superpower"
                                value={option}
                                checked={formData.superpower === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                        {formData.superpower === "Other" && (
                          <input
                            type="text"
                            name="superpowerOther"
                            value={formData.superpowerOther}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mt-3"
                            placeholder="Specify your superpower"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          4. What are you weak at?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Tech",
                            "Business",
                            "Product",
                            "Marketing",
                            "Operations",
                            "Sales",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.weaknesses.includes(option)}
                                onChange={() =>
                                  handleArrayChange("weaknesses", option)
                                }
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          5. How many hours can you realistically commit per
                          week? <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {["<10", "10–30", "30–60", "60+"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="hoursPerWeek"
                                value={option}
                                checked={formData.hoursPerWeek === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          6. What type of co-founder would you work best with?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Visionary",
                            "Executor",
                            "Operator",
                            "Growth hacker",
                            "Tech architect",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.cofounderType.includes(
                                  option,
                                )}
                                onChange={() =>
                                  handleArrayChange("cofounderType", option)
                                }
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 2: Startup DNA */}
            {currentStep === 2 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                         STEP 2 – Startup DNA 
                      </h2>
                      <div>
                        <label
                          htmlFor="problemSolving"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          7. What problem are you solving?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="problemSolving"
                          name="problemSolving"
                          value={formData.problemSolving}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe the problem..."
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="whoHasProblem"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          8. Who exactly has this problem?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="whoHasProblem"
                          name="whoHasProblem"
                          value={formData.whoHasProblem}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe the target audience..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          9. What happens if this problem is not solved?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            "Mild inconvenience",
                            "Serious pain",
                            "Business critical",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="problemImpact"
                                value={option}
                                checked={formData.problemImpact === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="solutionBuilding"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          10. What solution are you building?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="solutionBuilding"
                          name="solutionBuilding"
                          value={formData.solutionBuilding}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe your solution..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          11. How will you make money?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="monetization"
                          value={formData.monetization}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 cursor-pointer text-sm"
                        >
                          <option value="">Select monetization model</option>
                          <option value="Subscription">Subscription</option>
                          <option value="One-time">One-time</option>
                          <option value="Commission">Commission</option>
                          <option value="Enterprise">Enterprise</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="unfairAdvantage"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          12. What is your unfair advantage?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="unfairAdvantage"
                          name="unfairAdvantage"
                          value={formData.unfairAdvantage}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe your unfair advantage..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 3: Burn Reality */}
            {currentStep === 3 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                         STEP 3 – Burn Reality 
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          13. How much can you invest per month?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {["₹0", "₹10k–50k", "₹50k–2L", "₹2L+"].map(
                            (option) => (
                              <label
                                key={option}
                                className="flex items-center cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="monthlyInvestment"
                                  value={option}
                                  checked={
                                    formData.monthlyInvestment === option
                                  }
                                  onChange={handleChange}
                                  className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-white">
                                  {option}
                                </span>
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          14. How long can you survive without revenue?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            "1–3 months",
                            "3–6 months",
                            "6–12 months",
                            "12+ months",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="survivalWithoutRevenue"
                                value={option}
                                checked={
                                  formData.survivalWithoutRevenue === option
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          15. What is your biggest risk right now?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Tech execution",
                            "Hiring",
                            "Market",
                            "Money",
                            "Speed",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="biggestRisk"
                                value={option}
                                checked={formData.biggestRisk === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 4: Hiring & Execution */}
            {currentStep === 4 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        STEP 4 – Hiring & Execution
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          16. What do you need right now?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Co-founder",
                            "Freelancer",
                            "Full-time hire",
                            "Vendor",
                            "Not sure",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="currentNeed"
                                value={option}
                                checked={formData.currentNeed === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="outcome30Days"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          17. What outcome must be achieved in the next 30 days?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="outcome30Days"
                          name="outcome30Days"
                          value={formData.outcome30Days}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe the required outcome..."
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="executionFailures"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          18. What usually goes wrong when you try to execute?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="executionFailures"
                          name="executionFailures"
                          value={formData.executionFailures}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe common execution issues..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          19. What would make you trust an AI-recommended person
                          or vendor? <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "Proof of work",
                            "Trial sprint",
                            "Credibility score",
                            "Peer reviews",
                            "Clear milestones",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.trustFactors.includes(option)}
                                onChange={() =>
                                  handleArrayChange("trustFactors", option)
                                }
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 5: Vendor Intelligence */}
            {currentStep === 5 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                         STEP 5 – Vendor Intelligence
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          20. Do you use vendors today?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {["Yes", "No"].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="useVendors"
                                value={option}
                                checked={formData.useVendors === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {formData.useVendors === "Yes" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              21. If yes, which categories? (Multi-select)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {[
                                "Product dev",
                                "UI/UX",
                                "Marketing",
                                "Legal",
                                "Finance",
                                "DevOps",
                                "Support",
                              ].map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.vendorCategories.includes(
                                      option,
                                    )}
                                    onChange={() =>
                                      handleArrayChange(
                                        "vendorCategories",
                                        option,
                                      )
                                    }
                                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-white">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              22. When do you prefer a vendor over hiring?
                              (Multi-select)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {[
                                "Urgent",
                                "Fixed scope",
                                "Lack expertise",
                                "Accountability",
                                "Cost control",
                              ].map((option) => (
                                <label
                                  key={option}
                                  className="flex items-center cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.vendorPreference.includes(
                                      option,
                                    )}
                                    onChange={() =>
                                      handleArrayChange(
                                        "vendorPreference",
                                        option,
                                      )
                                    }
                                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-white">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 6: AI Idea & Strategy Engine */}
            {currentStep === 6 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                         STEP 6 – AI Idea & Strategy Engine
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          23. What stage are you at?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="currentStage"
                          value={formData.currentStage}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 cursor-pointer text-sm"
                        >
                          <option value="">Select stage</option>
                          <option value="Idea">Idea</option>
                          <option value="MVP">MVP</option>
                          <option value="Early traction">Early traction</option>
                          <option value="Scaling">Scaling</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="growthBlocker"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          24. What is blocking your growth today?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="growthBlocker"
                          name="growthBlocker"
                          value={formData.growthBlocker}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe growth blockers..."
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="magicFix"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          25. If you could magically fix ONE thing today, what
                          would it be? <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="magicFix"
                          name="magicFix"
                          value={formData.magicFix}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="Describe your priority fix..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Step 7: Dashboard Intelligence */}
            {currentStep === 7 && (
              <div className="flex justify-center">
                <div className="w-full md:w-[85%] lg:w-[75%]">
                  <div
                    className="rounded-xl p-[1px] md:p-[2px] transition-all duration-300"
                    style={gradientBlue}
                  >
                    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 border border-white/10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                         STEP 7 – Dashboard Intelligence
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          26. Which dashboards would you use weekly?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            "CRM",
                            "Hiring",
                            "Support",
                            "Execution",
                            "Business Health",
                          ].map((option) => (
                            <label
                              key={option}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={formData.dashboards.includes(option)}
                                onChange={() =>
                                  handleArrayChange("dashboards", option)
                                }
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="currentTools"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          27. What tools do you currently use?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="currentTools"
                          name="currentTools"
                          value={formData.currentTools}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                          placeholder="List your current tools..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between pt-6 gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-4 rounded-xl font-bold text-base border-2 border-blue-500/50 text-blue-300 hover:bg-blue-500 hover:text-white transition-all duration-200 order-2 sm:order-1"
                >
                  Back
                </button>
              )}
              <div className="hidden sm:block flex-1"></div>
              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-white px-10 py-4 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] bg-blue-600 hover:bg-blue-500 order-1 sm:order-2"
                >
                  Save and Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="text-white px-10 py-4 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-500 order-1 sm:order-2"
                >
                  {loading ? "Saving..." : "Save Details"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default StartupProfile;
