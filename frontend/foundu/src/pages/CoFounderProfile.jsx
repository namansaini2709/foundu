import { useState, useEffect } from "react";
import { getUserId } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import ProfilePreview from "../components/ProfilePreview";
/**
 * Co-Founder Profile Page Component
 * Multi-step profile completion page for co-founders
 */
const CoFounderProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("edit"); // "edit" or "view"
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userBasicInfo, setUserBasicInfo] = useState(null);
  const gradientBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };
  // Form state management
  const [formData, setFormData] = useState({
    // Step 1: The Trust & Reputation Layer
    fullLegalName: "",
    linkedin: "",
    githubBehance: "",
    referenceContact: "",
    primaryIdentity: "",
    primaryIdentityOther: "",
    currentOccupationalStatus: "",
    pedigreeScore: "",
    // Step 2: Deep Competency & Intelligence
    superpower1: "",
    superpower2: "",
    superpower3: "",
    tool1: "",
    tool2: "",
    tool3: "",
    tool4: "",
    tool5: "",
    domainIQ: "",
    antiPortfolio: "",
    quantifiableImpact: "",
    // Step 3: The Financial & Time "Stress Test"
    drySpellRunway: "",
    currentBurnRequirement: "",
    bandwidthReality: "",
    moonlightPolicy: "",
    // Step 4: The Ego & Psychology Match
    decisionHierarchy: "",
    conflictSimulation: "",
    feedbackLoop: "",
    workEnvironment: "",
    riskAppetite: "",
    // Step 5: Ethics & Value Alignment
    exitVision: "",
    redLine: "",
    diversityOfThought: "",
    // Step 6: Targeted Requirement Filters
    missingHalfProfile: "",
    industrySpecificity: [],
    equityMinimum: "",
    vibeKeywords: "",
  });
  // Get user data and fetch existing profile
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }
    fetchUserData(userId);
    fetchProfile(userId);
    fetchReviews(userId);
  }, [navigate]);
  const fetchReviews = async (userId) => {
    try {
      const res = await api.get(`/api/reviews/user/${userId}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  // Fetch user data to populate name
  const fetchUserData = async (userId) => {
    try {
      const response = await api.get(
        `/api/users/${userId}`
      );
      const user = response.data.success ? response.data.data : response.data;
      setUserBasicInfo(user);
      // Only pre-fill if formData is currently empty to avoid overwriting existing profile data
      setFormData((prev) => ({
        ...prev,
        fullLegalName: prev.fullLegalName || user.full_name || "",
        email: prev.email || user.email || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Fetch profile by user ID
  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(
        `/api/cofounder-profiles/user/${userId}`
      );
      const profile = response.data;
      // Map database fields to form fields
      setFormData({
        fullLegalName: profile.full_legal_name || "",
        linkedin: profile.linkedin || "",
        githubBehance: profile.github_behance || "",
        referenceContact: profile.reference_contact || "",
        primaryIdentity: profile.primary_identity || "",
        primaryIdentityOther: profile.primary_identity_other || "",
        currentOccupationalStatus: profile.current_occupational_status || "",
        pedigreeScore: profile.pedigree_score || "",
        superpower1: profile.superpower1 || "",
        superpower2: profile.superpower2 || "",
        superpower3: profile.superpower3 || "",
        tool1: profile.tool1 || "",
        tool2: profile.tool2 || "",
        tool3: profile.tool3 || "",
        tool4: profile.tool4 || "",
        tool5: profile.tool5 || "",
        domainIQ: profile.domain_iq || "",
        antiPortfolio: profile.anti_portfolio || "",
        quantifiableImpact: profile.quantifiable_impact || "",
        drySpellRunway: profile.dry_spell_runway || "",
        currentBurnRequirement: profile.current_burn_requirement || "",
        bandwidthReality: profile.bandwidth_reality || "",
        moonlightPolicy: profile.moonlight_policy || "",
        decisionHierarchy: profile.decision_hierarchy || "",
        conflictSimulation: profile.conflict_simulation || "",
        feedbackLoop: profile.feedback_loop || "",
        workEnvironment: profile.work_environment || "",
        riskAppetite: profile.risk_appetite || "",
        exitVision: profile.exit_vision || "",
        redLine: profile.red_line || "",
        diversityOfThought: profile.diversity_of_thought || "",
        missingHalfProfile: profile.missing_half_profile || "",
        industrySpecificity: profile.industry_specificity || [],
        equityMinimum: profile.equity_minimum || "",
        vibeKeywords: profile.vibe_keywords || "",
      });
      setProfileData(profile);
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
  /**
   * Handle checkbox changes for industry specificity
   */
  const handleIndustryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      industrySpecificity: prev.industrySpecificity.includes(value)
        ? prev.industrySpecificity.filter((item) => item !== value)
        : prev.industrySpecificity.length < 3
          ? [...prev.industrySpecificity, value]
          : prev.industrySpecificity,
    }));
  };
  /**
   * Validate fields for the current step only
   */
  const validateCurrentStep = () => {
    const errors = [];
    switch (currentStep) {
      case 1: // The Trust & Reputation Layer
        if (!formData.fullLegalName?.trim())
          errors.push("Full Legal Name is required");
        if (!formData.linkedin?.trim())
          errors.push("LinkedIn Profile is required");
        if (!formData.primaryIdentity?.trim())
          errors.push("Primary Identity is required");
        if (
          formData.primaryIdentity === "other" &&
          !formData.primaryIdentityOther?.trim()
        ) {
          errors.push("Please specify your primary identity");
        }
        if (!formData.currentOccupationalStatus?.trim())
          errors.push("Current Occupational Status is required");
        if (!formData.pedigreeScore?.trim())
          errors.push("Pedigree Score is required");
        break;
      case 2: // Deep Competency & Intelligence
        if (!formData.superpower1?.trim())
          errors.push("Superpower 1 is required");
        if (!formData.superpower2?.trim())
          errors.push("Superpower 2 is required");
        if (!formData.superpower3?.trim())
          errors.push("Superpower 3 is required");
        if (!formData.tool1?.trim())
          errors.push("Tool/Framework 1 is required");
        if (!formData.tool2?.trim())
          errors.push("Tool/Framework 2 is required");
        if (!formData.tool3?.trim())
          errors.push("Tool/Framework 3 is required");
        if (!formData.tool4?.trim())
          errors.push("Tool/Framework 4 is required");
        if (!formData.tool5?.trim())
          errors.push("Tool/Framework 5 is required");
        if (!formData.domainIQ?.trim()) errors.push("Domain IQ is required");
        if (!formData.antiPortfolio?.trim())
          errors.push("Anti-Portfolio is required");
        if (!formData.quantifiableImpact?.trim())
          errors.push("Quantifiable Impact is required");
        break;
      case 3: // The Financial & Time "Stress Test"
        if (!formData.drySpellRunway?.trim())
          errors.push("Dry Spell Runway is required");
        if (!formData.currentBurnRequirement?.trim())
          errors.push("Current Burn Requirement is required");
        if (!formData.bandwidthReality?.trim())
          errors.push("Bandwidth Reality is required");
        if (!formData.moonlightPolicy?.trim())
          errors.push("Moonlight Policy is required");
        break;
      case 4: // The Ego & Psychology Match
        if (!formData.decisionHierarchy?.trim())
          errors.push("Decision Hierarchy is required");
        if (!formData.conflictSimulation?.trim())
          errors.push("Conflict Simulation is required");
        if (!formData.feedbackLoop?.trim())
          errors.push("Feedback Loop is required");
        if (!formData.workEnvironment?.trim())
          errors.push("Work Environment is required");
        if (!formData.riskAppetite?.trim())
          errors.push("Risk Appetite is required");
        break;
      case 5: // Ethics & Value Alignment
        if (!formData.exitVision?.trim()) errors.push("Exit Vision is required");
        if (!formData.redLine?.trim()) errors.push("Red Line is required");
        if (!formData.diversityOfThought?.trim())
          errors.push("Diversity of Thought is required");
        break;
      case 6: // Targeted Requirement Filters
        if (!formData.missingHalfProfile?.trim())
          errors.push("Missing Half Profile is required");
        if (!formData.equityMinimum?.trim())
          errors.push("Equity Minimum is required");
        if (!formData.vibeKeywords?.trim())
          errors.push("Vibe Keywords is required");
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
    if (currentStep < 6) {
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
    // Safety check – submit only on step 6
    if (currentStep !== 6) {
      toast.error("Please complete all steps before submitting");
      return;
    }
    // Validate current step (step 6)
    const errors = validateCurrentStep();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }
    const userId = getUserId();
    if (!userId) {
      toast.error("User not logged in. Please log in again.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        `/api/cofounder-profiles`,
        {
          user_id: Number(userId),
          fullLegalName: formData.fullLegalName,
          linkedin: formData.linkedin,
          githubBehance: formData.githubBehance,
          referenceContact: formData.referenceContact,
          primaryIdentity: formData.primaryIdentity,
          primaryIdentityOther: formData.primaryIdentityOther,
          currentOccupationalStatus: formData.currentOccupationalStatus,
          pedigreeScore: formData.pedigreeScore,
          superpower1: formData.superpower1,
          superpower2: formData.superpower2,
          superpower3: formData.superpower3,
          tool1: formData.tool1,
          tool2: formData.tool2,
          tool3: formData.tool3,
          tool4: formData.tool4,
          tool5: formData.tool5,
          domainIQ: formData.domainIQ,
          antiPortfolio: formData.antiPortfolio,
          quantifiableImpact: formData.quantifiableImpact,
          drySpellRunway: formData.drySpellRunway,
          currentBurnRequirement: formData.currentBurnRequirement,
          bandwidthReality: formData.bandwidthReality,
          moonlightPolicy: formData.moonlightPolicy,
          decisionHierarchy: formData.decisionHierarchy,
          conflictSimulation: formData.conflictSimulation,
          feedbackLoop: formData.feedbackLoop,
          workEnvironment: formData.workEnvironment,
          riskAppetite: formData.riskAppetite
            ? parseInt(formData.riskAppetite)
            : null,
          exitVision: formData.exitVision,
          redLine: formData.redLine,
          diversityOfThought: formData.diversityOfThought,
          missingHalfProfile: formData.missingHalfProfile,
          industrySpecificity: formData.industrySpecificity,
          equityMinimum: formData.equityMinimum,
          vibeKeywords: formData.vibeKeywords,
        }
      );
      console.log("Profile created:", response.data);
      toast.success("Profile created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
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
      {/* Navigation */}
      {/* Main Content */}
      <div className="pt-24 pb-8 flex flex-col items-center">
        {/* View/Edit Toggle Bar */}
        <div className="w-[85%] max-w-7xl mb-8">
          <div className="flex bg-gray-800/50 backdrop-blur-md p-1 rounded-2xl border border-white/10 w-fit mx-auto shadow-xl">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${viewMode === 'edit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-white/40 hover:text-white'}`}
            >
              EDIT PROFILE
            </button>
            <button
              onClick={() => setViewMode("view")}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${viewMode === 'view' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-white/40 hover:text-white'}`}
            >
              VIEW PROFILE
            </button>
          </div>
        </div>
        {viewMode === "view" ? (
          <ProfilePreview
            user={{
              ...userBasicInfo,
              role: profileData?.primary_identity === 'other' ? profileData?.primary_identity_other : profileData?.primary_identity,
              description: profileData ? `${profileData.superpower1}, ${profileData.superpower2}, ${profileData.superpower3}. ${profileData.vibe_keywords}` : "",
              avg_stars: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length).toFixed(1) : 0,
              review_count: reviews.length,
              isOpenToWork: true // Default to true
            }}
            reviews={reviews}
            type="cofounder"
          />
        ) : (
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/50 text-gray-400"
                        }`}
                    >
                      {step}
                    </div>
                    {step < 6 && (
                      <div
                        className={`w-8 h-1 ${currentStep > step ? "bg-blue-500" : "bg-gray-700/50"
                          }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
                Complete Your Co-Founder Profile
              </h1>
              <p className="text-blue-200 text-sm text-center">
                Step {currentStep} of 6 - Fill in your details to find the perfect
                co-founder
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: The Trust & Reputation Layer */}
              {currentStep === 1 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          The Trust & Reputation Layer
                        </h2>
                        <div>
                          <label
                            htmlFor="fullLegalName"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Full Legal Name (Verified against Government ID){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="fullLegalName"
                            name="fullLegalName"
                            value={formData.fullLegalName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter your full legal name"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="linkedin"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            LinkedIn Profile <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="githubBehance"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            GitHub/Behance Profile
                          </label>
                          <input
                            type="url"
                            id="githubBehance"
                            name="githubBehance"
                            value={formData.githubBehance}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="https://github.com/username or https://behance.net/username"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="referenceContact"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Reference Contact (Past colleague or mentor)
                          </label>
                          <input
                            type="text"
                            id="referenceContact"
                            name="referenceContact"
                            value={formData.referenceContact}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Name and contact information"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="primaryIdentity"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Primary Identity (Domain Expertise){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="primaryIdentity"
                            name="primaryIdentity"
                            value={formData.primaryIdentity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                          >
                            <option value="">Select primary identity</option>
                            <option value="technical">
                              Technical: Engineering, AI, Hardware, Architecture
                            </option>
                            <option value="operations">
                              Operations: Supply Chain, Manufacturing, Logistics,
                              Process
                            </option>
                            <option value="growth">
                              Growth: Marketing, Performance Sales, Viral Loops, PR
                            </option>
                            <option value="product-design">
                              Product/Design: UI/UX, Service Design, Industrial
                              Design
                            </option>
                            <option value="strategy-finance">
                              Strategy/Finance: Fundraising, M&A, Legal, Compliance
                            </option>
                            <option value="other">Other</option>
                          </select>
                          {formData.primaryIdentity === "other" && (
                            <input
                              type="text"
                              id="primaryIdentityOther"
                              name="primaryIdentityOther"
                              value={formData.primaryIdentityOther}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mt-3"
                              placeholder="Specify your primary identity"
                            />
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="currentOccupationalStatus"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Current Occupational Status{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="currentOccupationalStatus"
                            name="currentOccupationalStatus"
                            value={formData.currentOccupationalStatus}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                          >
                            <option value="">Select status</option>
                            <option value="full-time-employee">
                              Full-time Employee
                            </option>
                            <option value="student">Student</option>
                            <option value="freelancer">Freelancer</option>
                            <option value="full-time-builder">
                              Full-time Builder
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="pedigreeScore"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The Pedigree Score <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="pedigreeScore"
                            name="pedigreeScore"
                            value={formData.pedigreeScore}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                          >
                            <option value="">Select pedigree score</option>
                            <option value="ex-founder">Ex-Founder</option>
                            <option value="tier1-alumni">Tier-1 Alumni</option>
                            <option value="industry-veteran">
                              Industry Veteran
                            </option>
                            <option value="domain-specialist">
                              Domain Specialist
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 2: Deep Competency & Intelligence */}
              {currentStep === 2 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Deep Competency & Intelligence
                        </h2>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            The "Superpower" Hierarchy: List 3 skills where you are
                            in the top 1% globally{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="superpower1"
                            value={formData.superpower1}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Superpower 1"
                          />
                          <input
                            type="text"
                            name="superpower2"
                            value={formData.superpower2}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Superpower 2"
                          />
                          <input
                            type="text"
                            name="superpower3"
                            value={formData.superpower3}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Superpower 3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Multi-Domain Toolkit: List 5 tools/frameworks you master{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="tool1"
                            value={formData.tool1}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Tool/Framework 1 (e.g., Python, SAP, Figma)"
                          />
                          <input
                            type="text"
                            name="tool2"
                            value={formData.tool2}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Tool/Framework 2"
                          />
                          <input
                            type="text"
                            name="tool3"
                            value={formData.tool3}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Tool/Framework 3"
                          />
                          <input
                            type="text"
                            name="tool4"
                            value={formData.tool4}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400 mb-2"
                            placeholder="Tool/Framework 4"
                          />
                          <input
                            type="text"
                            name="tool5"
                            value={formData.tool5}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Tool/Framework 5"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="domainIQ"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Domain IQ: How do you stay updated in your field?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="domainIQ"
                            name="domainIQ"
                            value={formData.domainIQ}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="e.g., Specific newsletters, Peer groups, Research papers"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="antiPortfolio"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The Anti-Portfolio (Crucial): Describe one professional
                            failure and the specific technical/business lesson you
                            extracted from it <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="antiPortfolio"
                            name="antiPortfolio"
                            value={formData.antiPortfolio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Describe your failure and the lesson learned"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="quantifiableImpact"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Quantifiable Impact: "In my best project, I specifically
                            generated [X amount of revenue / Y number of users / Z%
                            efficiency increase]"{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="quantifiableImpact"
                            name="quantifiableImpact"
                            value={formData.quantifiableImpact}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Describe your quantifiable impact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 3: The Financial & Time "Stress Test" */}
              {currentStep === 3 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          The Financial & Time "Stress Test"
                        </h2>
                        <div>
                          <label
                            htmlFor="drySpellRunway"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The "Dry Spell" Runway: How many months can you work for
                            ₹0 salary if the startup hits a funding delay?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="drySpellRunway"
                            name="drySpellRunway"
                            value={formData.drySpellRunway}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="e.g., 3 months, 6 months, 12 months+"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="currentBurnRequirement"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Current Burn Requirement: What is the absolute minimum
                            monthly survival stipend you need?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="currentBurnRequirement"
                            name="currentBurnRequirement"
                            value={formData.currentBurnRequirement}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter minimum monthly stipend"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">
                            Bandwidth Reality <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="bandwidthReality"
                                value="side-hustle"
                                checked={
                                  formData.bandwidthReality === "side-hustle"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                "Side-hustle" (10-20 hrs/week)
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="bandwidthReality"
                                value="transitioning"
                                checked={
                                  formData.bandwidthReality === "transitioning"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                "Transitioning" (Looking to quit current job in
                                30-60 days)
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="bandwidthReality"
                                value="all-in"
                                checked={formData.bandwidthReality === "all-in"}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                "All-In" (Ready to start 80 hrs/week tomorrow)
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="moonlightPolicy"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The "Moonlight" Policy: Will you be working on any other
                            side-projects or consulting gigs simultaneously?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="moonlightPolicy"
                            name="moonlightPolicy"
                            value={formData.moonlightPolicy}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Transparency for trust - describe any side projects or consulting work"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 4: The Ego & Psychology Match */}
              {currentStep === 4 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          The Ego & Psychology Match (The Oracle's Core)
                        </h2>
                        <div>
                          <label
                            htmlFor="decisionHierarchy"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Decision Hierarchy: In a 50/50 split, who has the final
                            say on [Product Design] vs [Business Strategy]?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="decisionHierarchy"
                            name="decisionHierarchy"
                            value={formData.decisionHierarchy}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Explain your decision-making approach"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="conflictSimulation"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Conflict Simulation: "We have 1 month of runway left and
                            no investors. Do we pivot, take a loan, or shut down?"{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="conflictSimulation"
                            name="conflictSimulation"
                            value={formData.conflictSimulation}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Describe how you would handle this situation"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="feedbackLoop"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The Feedback Loop: How do you prefer to receive
                            criticism? <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="feedbackLoop"
                            name="feedbackLoop"
                            value={formData.feedbackLoop}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                          >
                            <option value="">Select preference</option>
                            <option value="direct-blunt">Direct/Blunt</option>
                            <option value="private-constructive">
                              Private/Constructive
                            </option>
                            <option value="data-led">Data-led only</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">
                            Work Environment <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="workEnvironment"
                                value="high-pressure-office"
                                checked={
                                  formData.workEnvironment ===
                                  "high-pressure-office"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                High-Pressure Office (Face-to-face)
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="workEnvironment"
                                value="deep-work-remote"
                                checked={
                                  formData.workEnvironment === "deep-work-remote"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                Deep-Work Remote (Asynchronous)
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="workEnvironment"
                                value="hybrid"
                                checked={formData.workEnvironment === "hybrid"}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                Hybrid (Flexibility is key)
                              </span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="riskAppetite"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Risk Appetite: On a scale of 1-10, how comfortable are
                            you with "breaking things to move fast"?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="riskAppetite"
                            name="riskAppetite"
                            value={formData.riskAppetite}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter a number between 1-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 5: Ethics & Value Alignment */}
              {currentStep === 5 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Ethics & Value Alignment
                        </h2>
                        <div>
                          <label
                            htmlFor="exitVision"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Exit Vision: What is the "Win" for you?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="exitVision"
                            name="exitVision"
                            value={formData.exitVision}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                          >
                            <option value="">Select exit vision</option>
                            <option value="build-to-sell">
                              Build to sell in 2 years
                            </option>
                            <option value="ipo-10-years">IPO in 10 years</option>
                            <option value="lifestyle-business">
                              Build a profitable Lifestyle business
                            </option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="redLine"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The Red Line: What is one industry or business practice
                            you would NEVER work on for ethical reasons?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="redLine"
                            name="redLine"
                            value={formData.redLine}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="Describe your ethical red line"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">
                            Diversity of Thought: Do you prefer a partner who thinks
                            exactly like you, or someone who constantly challenges
                            your logic? <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="diversityOfThought"
                                value="thinks-like-me"
                                checked={
                                  formData.diversityOfThought === "thinks-like-me"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                Prefers partner who thinks exactly like me
                              </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="diversityOfThought"
                                value="challenges-me"
                                checked={
                                  formData.diversityOfThought === "challenges-me"
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">
                                Prefers partner who constantly challenges my logic
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Step 6: Targeted Requirement Filters */}
              {currentStep === 6 && (
                <div className="flex justify-center">
                  <div className="w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Targeted Requirement Filters
                        </h2>
                        <div>
                          <label
                            htmlFor="missingHalfProfile"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The "Missing Half" Profile: "I am looking for a Founder
                            who is [Skillset] because I am [Skillset]"{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="missingHalfProfile"
                            name="missingHalfProfile"
                            value={formData.missingHalfProfile}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                            placeholder="e.g., I am looking for a Founder who is a Sales machine because I am a shy Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-3">
                            Industry Specificity (Select up to 3)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                              "FinTech",
                              "D2C",
                              "AgriTech",
                              "SaaS",
                              "DeepTech",
                              "EdTech",
                              "HealthTech",
                              "PropTech",
                              "FoodTech",
                            ].map((industry) => (
                              <label
                                key={industry}
                                className="flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.industrySpecificity.includes(
                                    industry.toLowerCase(),
                                  )}
                                  onChange={() =>
                                    handleIndustryChange(industry.toLowerCase())
                                  }
                                  disabled={
                                    formData.industrySpecificity.length >= 3 &&
                                    !formData.industrySpecificity.includes(
                                      industry.toLowerCase(),
                                    )
                                  }
                                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                                />
                                <span className="ml-2 text-sm text-white">
                                  {industry}
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-gray-300 mt-2">
                            Selected: {formData.industrySpecificity.length}/3
                          </p>
                        </div>
                        <div>
                          <label
                            htmlFor="equityMinimum"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            Equity Minimum: What is the lowest equity % you would
                            accept for your "Dream Project"?{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="equityMinimum"
                            name="equityMinimum"
                            value={formData.equityMinimum}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="e.g., 20%, 30%, 50%"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="vibeKeywords"
                            className="block text-sm font-medium text-white mb-2"
                          >
                            The Vibe Keywords{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="vibeKeywords"
                            name="vibeKeywords"
                            value={formData.vibeKeywords}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="e.g., Radical Transparency, Hustle, Intellectual, Chill, Professional"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg font-semibold text-lg border-2 border-blue-500 text-blue-300 hover:bg-blue-500 hover:text-white transition-all duration-200"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1"></div>
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="text-white px-12 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] bg-blue-500 hover:bg-blue-600"
                  >
                    Save and Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-white px-12 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600"
                  >
                    {loading ? "Saving..." : "Save Details"}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
export default CoFounderProfile;