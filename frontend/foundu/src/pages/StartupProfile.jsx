import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Placeholder for getUserId - replace with actual import when utils/auth is available
const getUserId = () => {
  try {
    const { getUserId: getUserIdFunc } = require('../utils/auth');
    return getUserIdFunc();
  } catch {
    return localStorage.getItem('userId') || null;
  }
};

/**
 * Startup Profile Page Component
 * Multi-step profile completion page for startups
 */
const StartupProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const gradientBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
  };

  // Form state management
  const [formData, setFormData] = useState({
    // Step 1: Founder DNA
    founderType: '',
    whyBuilding: '',
    superpower: '',
    superpowerOther: '',
    weaknesses: [],
    hoursPerWeek: '',
    cofounderType: [],
    
    // Step 2: Startup DNA
    problemSolving: '',
    whoHasProblem: '',
    problemImpact: '',
    solutionBuilding: '',
    monetization: '',
    unfairAdvantage: '',
    
    // Step 3: Burn Reality
    monthlyInvestment: '',
    survivalWithoutRevenue: '',
    biggestRisk: '',
    
    // Step 4: Hiring & Execution
    currentNeed: '',
    outcome30Days: '',
    executionFailures: '',
    trustFactors: [],
    
    // Step 5: Vendor Intelligence
    useVendors: '',
    vendorCategories: [],
    vendorPreference: [],
    
    // Step 6: AI Idea & Strategy Engine
    currentStage: '',
    growthBlocker: '',
    magicFix: '',
    
    // Step 7: Dashboard Intelligence
    dashboards: [],
    currentTools: '',
  });

  // Get user data and fetch existing profile
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchProfile(userId);
    }
  }, []);

  // Fetch profile by user ID
  const fetchProfile = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/startup-profiles/user/${userId}`,
        { withCredentials: true }
      );
      const profile = response.data;
      
      // Map database fields to form fields
      setFormData({
        founderType: profile.founder_type || '',
        whyBuilding: profile.why_building || '',
        superpower: profile.superpower || '',
        superpowerOther: profile.superpower_other || '',
        weaknesses: profile.weaknesses || [],
        hoursPerWeek: profile.hours_per_week || '',
        cofounderType: profile.cofounder_type || [],
        problemSolving: profile.problem_solving || '',
        whoHasProblem: profile.who_has_problem || '',
        problemImpact: profile.problem_impact || '',
        solutionBuilding: profile.solution_building || '',
        monetization: profile.monetization || '',
        unfairAdvantage: profile.unfair_advantage || '',
        monthlyInvestment: profile.monthly_investment || '',
        survivalWithoutRevenue: profile.survival_without_revenue || '',
        biggestRisk: profile.biggest_risk || '',
        currentNeed: profile.current_need || '',
        outcome30Days: profile.outcome_30_days || '',
        executionFailures: profile.execution_failures || '',
        trustFactors: profile.trust_factors || [],
        useVendors: profile.use_vendors || '',
        vendorCategories: profile.vendor_categories || [],
        vendorPreference: profile.vendor_preference || [],
        currentStage: profile.current_stage || '',
        growthBlocker: profile.growth_blocker || '',
        magicFix: profile.magic_fix || '',
        dashboards: profile.dashboards || [],
        currentTools: profile.current_tools || '',
      });
    } catch (error) {
      // Profile doesn't exist yet, which is fine
      if (error.response?.status !== 404) {
        console.error('Error fetching profile:', error);
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
   * Validate all form fields
   */
  const validateForm = () => {
    const errors = [];

    // Step 1: Founder DNA
    if (!formData.founderType?.trim()) errors.push('Founder type is required');
    if (!formData.whyBuilding?.trim()) errors.push('Why are you building a startup is required');
    if (!formData.superpower?.trim()) errors.push('Superpower is required');
    if (formData.superpower === 'Other' && !formData.superpowerOther?.trim()) {
      errors.push('Please specify your superpower');
    }
    if (formData.weaknesses.length === 0) errors.push('At least one weakness is required');
    if (!formData.hoursPerWeek?.trim()) errors.push('Hours per week is required');
    if (formData.cofounderType.length === 0) errors.push('At least one co-founder type is required');

    // Step 2: Startup DNA
    if (!formData.problemSolving?.trim()) errors.push('Problem solving is required');
    if (!formData.whoHasProblem?.trim()) errors.push('Who has the problem is required');
    if (!formData.problemImpact?.trim()) errors.push('Problem impact is required');
    if (!formData.solutionBuilding?.trim()) errors.push('Solution building is required');
    if (!formData.monetization?.trim()) errors.push('Monetization is required');
    if (!formData.unfairAdvantage?.trim()) errors.push('Unfair advantage is required');

    // Step 3: Burn Reality
    if (!formData.monthlyInvestment?.trim()) errors.push('Monthly investment is required');
    if (!formData.survivalWithoutRevenue?.trim()) errors.push('Survival without revenue is required');
    if (!formData.biggestRisk?.trim()) errors.push('Biggest risk is required');

    // Step 4: Hiring & Execution
    if (!formData.currentNeed?.trim()) errors.push('Current need is required');
    if (!formData.outcome30Days?.trim()) errors.push('30-day outcome is required');
    if (!formData.executionFailures?.trim()) errors.push('Execution failures is required');
    if (formData.trustFactors.length === 0) errors.push('At least one trust factor is required');

    // Step 5: Vendor Intelligence
    if (!formData.useVendors?.trim()) errors.push('Vendor usage is required');

    // Step 6: AI Idea & Strategy Engine
    if (!formData.currentStage?.trim()) errors.push('Current stage is required');
    if (!formData.growthBlocker?.trim()) errors.push('Growth blocker is required');
    if (!formData.magicFix?.trim()) errors.push('Magic fix is required');

    // Step 7: Dashboard Intelligence
    if (formData.dashboards.length === 0) errors.push('At least one dashboard is required');
    if (!formData.currentTools?.trim()) errors.push('Current tools is required');

    return errors;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      const errors = validateForm();
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      const userId = getUserId();
      if (!userId) {
        toast.error('User ID not found. Please login again.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        let existingProfile = null;
        try {
          const checkResponse = await axios.get(
            `http://localhost:5000/api/startup-profiles/user/${userId}`,
            { withCredentials: true }
          );
          existingProfile = checkResponse.data;
        } catch (checkError) {
          if (checkError.response?.status !== 404) {
            console.error('Error checking existing profile:', checkError);
          }
        }

        const profileData = {
          userId: parseInt(userId),
          ...formData,
        };

        if (existingProfile) {
          await axios.put(
            `http://localhost:5000/api/startup-profiles/${existingProfile.id}`,
            profileData,
            { withCredentials: true }
          );
          toast.success('Profile updated successfully!');
        } else {
          await axios.post(
            'http://localhost:5000/api/startup-profiles',
            profileData,
            { withCredentials: true }
          );
          toast.success('Profile created successfully!');
        }
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        console.error('Profile submission error:', error);
        toast.error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Failed to save profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const gradientBlackToBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
  };

  return (
    <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
      <nav 
      className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300'}
      style={gradientBlackToBlue}
    >
      <div className="bg-black/20 backdrop-blur-md border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white ml-1">OUNDU</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Hire Freelancer</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Find Best Match</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">For Startups</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">About Us</a>
          </div>

          {/* Sign Up Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
            Sign Up
          </button>
        </div>
      </div>
    </nav>

      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-700/50 text-gray-400'}`}>
                    {step}
                  </div>
                  {step < 7 && <div className={`w-8 h-1 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-700/50'}`}></div>}
                </div>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">Complete Your Startup Profile</h1>
            <p className="text-blue-200 text-sm text-center">Step {currentStep} of 7</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Founder DNA */}
            {currentStep === 1 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🧠 STEP 1 – Founder DNA (Founder Readiness + Compatibility Engine)
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          1. What best describes you right now?
                        </label>
                        <div className="space-y-2">
                          {['Solo founder', 'Co-founder team', 'Aspiring founder (idea stage)'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="founderType"
                                value={option}
                                checked={formData.founderType === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="whyBuilding" className="block text-sm font-medium text-white mb-2">
                          2. Why are you building a startup? (Short answer)
                        </label>
                        <textarea
                          id="whyBuilding"
                          name="whyBuilding"
                          value={formData.whyBuilding}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Explain your motivation..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          3. What is your superpower?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Tech', 'Business', 'Product', 'Marketing', 'Operations', 'Sales', 'Other'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="superpower"
                                value={option}
                                checked={formData.superpower === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                        {formData.superpower === 'Other' && (
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
                          4. What are you weak at? (Multi-select)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Tech', 'Business', 'Product', 'Marketing', 'Operations', 'Sales'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.weaknesses.includes(option)}
                                onChange={() => handleArrayChange('weaknesses', option)}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          5. How many hours can you realistically commit per week?
                        </label>
                        <div className="space-y-2">
                          {['<10', '10–30', '30–60', '60+'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="hoursPerWeek"
                                value={option}
                                checked={formData.hoursPerWeek === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          6. What type of co-founder would you work best with? (Multi-select)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Visionary', 'Executor', 'Operator', 'Growth hacker', 'Tech architect'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.cofounderType.includes(option)}
                                onChange={() => handleArrayChange('cofounderType', option)}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🧬 STEP 2 – Startup DNA (Startup DNA Score + AI Simulator)
                      </h2>
                      
                      <div>
                        <label htmlFor="problemSolving" className="block text-sm font-medium text-white mb-2">
                          7. What problem are you solving? (Short answer)
                        </label>
                        <textarea
                          id="problemSolving"
                          name="problemSolving"
                          value={formData.problemSolving}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe the problem..."
                        />
                      </div>

                      <div>
                        <label htmlFor="whoHasProblem" className="block text-sm font-medium text-white mb-2">
                          8. Who exactly has this problem? (Short answer)
                        </label>
                        <textarea
                          id="whoHasProblem"
                          name="whoHasProblem"
                          value={formData.whoHasProblem}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe the target audience..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          9. What happens if this problem is not solved?
                        </label>
                        <div className="space-y-2">
                          {['Mild inconvenience', 'Serious pain', 'Business critical'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="problemImpact"
                                value={option}
                                checked={formData.problemImpact === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="solutionBuilding" className="block text-sm font-medium text-white mb-2">
                          10. What solution are you building? (Short answer)
                        </label>
                        <textarea
                          id="solutionBuilding"
                          name="solutionBuilding"
                          value={formData.solutionBuilding}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe your solution..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          11. How will you make money?
                        </label>
                        <select
                          name="monetization"
                          value={formData.monetization}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
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
                        <label htmlFor="unfairAdvantage" className="block text-sm font-medium text-white mb-2">
                          12. What is your unfair advantage? (Short answer)
                        </label>
                        <textarea
                          id="unfairAdvantage"
                          name="unfairAdvantage"
                          value={formData.unfairAdvantage}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🔥 STEP 3 – Burn Reality (Burn Reality Checker + Readiness Score)
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          13. How much can you invest per month?
                        </label>
                        <div className="space-y-2">
                          {['₹0', '₹10k–50k', '₹50k–2L', '₹2L+'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="monthlyInvestment"
                                value={option}
                                checked={formData.monthlyInvestment === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          14. How long can you survive without revenue?
                        </label>
                        <div className="space-y-2">
                          {['1–3 months', '3–6 months', '6–12 months', '12+ months'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="survivalWithoutRevenue"
                                value={option}
                                checked={formData.survivalWithoutRevenue === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          15. What is your biggest risk right now?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Tech execution', 'Hiring', 'Market', 'Money', 'Speed'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="biggestRisk"
                                value={option}
                                checked={formData.biggestRisk === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🚀 STEP 4 – Hiring & Execution (AI Matching + Trial Sprint Generator)
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          16. What do you need right now?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Co-founder', 'Freelancer', 'Full-time hire', 'Vendor', 'Not sure'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="currentNeed"
                                value={option}
                                checked={formData.currentNeed === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="outcome30Days" className="block text-sm font-medium text-white mb-2">
                          17. What outcome must be achieved in the next 30 days? (Short answer)
                        </label>
                        <textarea
                          id="outcome30Days"
                          name="outcome30Days"
                          value={formData.outcome30Days}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe the required outcome..."
                        />
                      </div>

                      <div>
                        <label htmlFor="executionFailures" className="block text-sm font-medium text-white mb-2">
                          18. What usually goes wrong when you try to execute? (Short answer)
                        </label>
                        <textarea
                          id="executionFailures"
                          name="executionFailures"
                          value={formData.executionFailures}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe common execution issues..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          19. What would make you trust an AI-recommended person or vendor? (Multi-select)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Proof of work', 'Trial sprint', 'Credibility score', 'Peer reviews', 'Clear milestones'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.trustFactors.includes(option)}
                                onChange={() => handleArrayChange('trustFactors', option)}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🧩 STEP 5 – Vendor Intelligence
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          20. Do you use vendors today?
                        </label>
                        <div className="space-y-2">
                          {['Yes', 'No'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="useVendors"
                                value={option}
                                checked={formData.useVendors === option}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.useVendors === 'Yes' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              21. If yes, which categories? (Multi-select)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {['Product dev', 'UI/UX', 'Marketing', 'Legal', 'Finance', 'DevOps', 'Support'].map((option) => (
                                <label key={option} className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.vendorCategories.includes(option)}
                                    onChange={() => handleArrayChange('vendorCategories', option)}
                                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-white">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              22. When do you prefer a vendor over hiring? (Multi-select)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {['Urgent', 'Fixed scope', 'Lack expertise', 'Accountability', 'Cost control'].map((option) => (
                                <label key={option} className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={formData.vendorPreference.includes(option)}
                                    onChange={() => handleArrayChange('vendorPreference', option)}
                                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-white">{option}</span>
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        🧠 STEP 6 – AI Idea & Strategy Engine
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          23. What stage are you at?
                        </label>
                        <select
                          name="currentStage"
                          value={formData.currentStage}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                        >
                          <option value="">Select stage</option>
                          <option value="Idea">Idea</option>
                          <option value="MVP">MVP</option>
                          <option value="Early traction">Early traction</option>
                          <option value="Scaling">Scaling</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="growthBlocker" className="block text-sm font-medium text-white mb-2">
                          24. What is blocking your growth today? (Short answer)
                        </label>
                        <textarea
                          id="growthBlocker"
                          name="growthBlocker"
                          value={formData.growthBlocker}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe growth blockers..."
                        />
                      </div>

                      <div>
                        <label htmlFor="magicFix" className="block text-sm font-medium text-white mb-2">
                          25. If you could magically fix ONE thing today, what would it be? (Short answer)
                        </label>
                        <textarea
                          id="magicFix"
                          name="magicFix"
                          value={formData.magicFix}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
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
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        📊 STEP 7 – Dashboard Intelligence
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          26. Which dashboards would you use weekly? (Multi-select)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['CRM', 'Hiring', 'Support', 'Execution', 'Business Health'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.dashboards.includes(option)}
                                onChange={() => handleArrayChange('dashboards', option)}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-white">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="currentTools" className="block text-sm font-medium text-white mb-2">
                          27. What tools do you currently use? (Short answer)
                        </label>
                        <textarea
                          id="currentTools"
                          name="currentTools"
                          value={formData.currentTools}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="List your current tools..."
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
                  className="px-8 py-3 rounded-lg font-semibold text-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  Back
                </button>
              )}
              <div className="flex-1"></div>
              {currentStep < 7 ? (
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
                  {loading ? 'Saving...' : 'Save and Next'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content - White border */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">F</span>
                <span className="text-white text-2xl font-bold ml-2">OUNDU</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The central platform for startups to discover, connect, and collaborate with skilled freelancers and co-founders. AI-powered matching, instant connections.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  foundu@example.com
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Our Team</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            {/* For Startups */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">For Startups</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Browse Talent</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Create Profile</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Post Gig</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Explore Community</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Partner With Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">FOUNDU</div>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
          <div className="text-white/60 text-sm">
            © 2025 Foundu, All rights reserved.
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default StartupProfile;

