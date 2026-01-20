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
 * Co-Founder Profile Page Component
 * Multi-step profile completion page for co-founders
 */
const CoFounderProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const gradientBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
  };

  // Form state management
  const [formData, setFormData] = useState({
    // Step 1: The Trust & Reputation Layer
    fullLegalName: '',
    linkedin: '',
    githubBehance: '',
    referenceContact: '',
    primaryIdentity: '',
    primaryIdentityOther: '',
    currentOccupationalStatus: '',
    pedigreeScore: '',
    
    // Step 2: Deep Competency & Intelligence
    superpower1: '',
    superpower2: '',
    superpower3: '',
    tool1: '',
    tool2: '',
    tool3: '',
    tool4: '',
    tool5: '',
    domainIQ: '',
    antiPortfolio: '',
    quantifiableImpact: '',
    
    // Step 3: The Financial & Time "Stress Test"
    drySpellRunway: '',
    currentBurnRequirement: '',
    bandwidthReality: '',
    moonlightPolicy: '',
    
    // Step 4: The Ego & Psychology Match
    decisionHierarchy: '',
    conflictSimulation: '',
    feedbackLoop: '',
    workEnvironment: '',
    riskAppetite: '',
    
    // Step 5: Ethics & Value Alignment
    exitVision: '',
    redLine: '',
    diversityOfThought: '',
    
    // Step 6: Targeted Requirement Filters
    missingHalfProfile: '',
    industrySpecificity: [],
    equityMinimum: '',
    vibeKeywords: '',
  });

  // Get user data and fetch existing profile
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchUserData(userId);
      fetchProfile(userId);
    } else {
      // Fallback to localStorage signup data
      const signupData = localStorage.getItem('signupData');
      if (signupData) {
        const data = JSON.parse(signupData);
        setFormData((prev) => ({
          ...prev,
          fullLegalName: data.fullName || prev.fullLegalName,
        }));
      }
    }
  }, []);

  // Fetch user data to populate name and email
  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        { withCredentials: true }
      );
      const user = response.data;
      
      if (user.full_name) {
        setFormData((prev) => ({
          ...prev,
          fullLegalName: user.full_name || prev.fullLegalName,
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch profile by user ID
  const fetchProfile = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cofounder-profiles/user/${userId}`,
        { withCredentials: true }
      );
      const profile = response.data;
      
      // Map database fields to form fields
      setFormData({
        fullLegalName: profile.full_legal_name || '',
        linkedin: profile.linkedin || '',
        githubBehance: profile.github_behance || '',
        referenceContact: profile.reference_contact || '',
        primaryIdentity: profile.primary_identity || '',
        primaryIdentityOther: profile.primary_identity_other || '',
        currentOccupationalStatus: profile.current_occupational_status || '',
        pedigreeScore: profile.pedigree_score || '',
        superpower1: profile.superpower1 || '',
        superpower2: profile.superpower2 || '',
        superpower3: profile.superpower3 || '',
        tool1: profile.tool1 || '',
        tool2: profile.tool2 || '',
        tool3: profile.tool3 || '',
        tool4: profile.tool4 || '',
        tool5: profile.tool5 || '',
        domainIQ: profile.domain_iq || '',
        antiPortfolio: profile.anti_portfolio || '',
        quantifiableImpact: profile.quantifiable_impact || '',
        drySpellRunway: profile.dry_spell_runway || '',
        currentBurnRequirement: profile.current_burn_requirement || '',
        bandwidthReality: profile.bandwidth_reality || '',
        moonlightPolicy: profile.moonlight_policy || '',
        decisionHierarchy: profile.decision_hierarchy || '',
        conflictSimulation: profile.conflict_simulation || '',
        feedbackLoop: profile.feedback_loop || '',
        workEnvironment: profile.work_environment || '',
        riskAppetite: profile.risk_appetite || '',
        exitVision: profile.exit_vision || '',
        redLine: profile.red_line || '',
        diversityOfThought: profile.diversity_of_thought || '',
        missingHalfProfile: profile.missing_half_profile || '',
        industrySpecificity: profile.industry_specificity || [],
        equityMinimum: profile.equity_minimum || '',
        vibeKeywords: profile.vibe_keywords || '',
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
   * Validate all form fields
   */
  const validateForm = () => {
    const errors = [];

    // Step 1: The Trust & Reputation Layer
    if (!formData.fullLegalName?.trim()) errors.push('Full Legal Name is required');
    if (!formData.linkedin?.trim()) errors.push('LinkedIn Profile is required');
    if (!formData.primaryIdentity?.trim()) errors.push('Primary Identity is required');
    if (formData.primaryIdentity === 'other' && !formData.primaryIdentityOther?.trim()) {
      errors.push('Please specify your primary identity');
    }
    if (!formData.currentOccupationalStatus?.trim()) errors.push('Current Occupational Status is required');
    if (!formData.pedigreeScore?.trim()) errors.push('Pedigree Score is required');

    // Step 2: Deep Competency & Intelligence
    if (!formData.superpower1?.trim()) errors.push('Superpower 1 is required');
    if (!formData.superpower2?.trim()) errors.push('Superpower 2 is required');
    if (!formData.superpower3?.trim()) errors.push('Superpower 3 is required');
    if (!formData.tool1?.trim()) errors.push('Tool/Framework 1 is required');
    if (!formData.tool2?.trim()) errors.push('Tool/Framework 2 is required');
    if (!formData.tool3?.trim()) errors.push('Tool/Framework 3 is required');
    if (!formData.tool4?.trim()) errors.push('Tool/Framework 4 is required');
    if (!formData.tool5?.trim()) errors.push('Tool/Framework 5 is required');
    if (!formData.domainIQ?.trim()) errors.push('Domain IQ is required');
    if (!formData.antiPortfolio?.trim()) errors.push('Anti-Portfolio is required');
    if (!formData.quantifiableImpact?.trim()) errors.push('Quantifiable Impact is required');

    // Step 3: The Financial & Time "Stress Test"
    if (!formData.drySpellRunway?.trim()) errors.push('Dry Spell Runway is required');
    if (!formData.currentBurnRequirement?.trim()) errors.push('Current Burn Requirement is required');
    if (!formData.bandwidthReality?.trim()) errors.push('Bandwidth Reality is required');
    if (!formData.moonlightPolicy?.trim()) errors.push('Moonlight Policy is required');

    // Step 4: The Ego & Psychology Match
    if (!formData.decisionHierarchy?.trim()) errors.push('Decision Hierarchy is required');
    if (!formData.conflictSimulation?.trim()) errors.push('Conflict Simulation is required');
    if (!formData.feedbackLoop?.trim()) errors.push('Feedback Loop is required');
    if (!formData.workEnvironment?.trim()) errors.push('Work Environment is required');
    if (!formData.riskAppetite) errors.push('Risk Appetite is required');

    // Step 5: Ethics & Value Alignment
    if (!formData.exitVision?.trim()) errors.push('Exit Vision is required');
    if (!formData.redLine?.trim()) errors.push('Red Line is required');
    if (!formData.diversityOfThought?.trim()) errors.push('Diversity of Thought is required');

    // Step 6: Targeted Requirement Filters
    if (!formData.missingHalfProfile?.trim()) errors.push('Missing Half Profile is required');
    if (!formData.equityMinimum?.trim()) errors.push('Equity Minimum is required');
    if (!formData.vibeKeywords?.trim()) errors.push('Vibe Keywords is required');

    return errors;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      // Validate all fields
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
        // Check if profile already exists
        let existingProfile = null;
        try {
          const checkResponse = await axios.get(
            `http://localhost:5000/api/cofounder-profiles/user/${userId}`,
            { withCredentials: true }
          );
          existingProfile = checkResponse.data;
        } catch (checkError) {
          // Profile doesn't exist yet, which is fine
          if (checkError.response?.status !== 404) {
            console.error('Error checking existing profile:', checkError);
          }
        }

        const profileData = {
          userId: parseInt(userId),
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
          riskAppetite: formData.riskAppetite ? parseInt(formData.riskAppetite) : null,
          exitVision: formData.exitVision,
          redLine: formData.redLine,
          diversityOfThought: formData.diversityOfThought,
          missingHalfProfile: formData.missingHalfProfile,
          industrySpecificity: formData.industrySpecificity,
          equityMinimum: formData.equityMinimum,
          vibeKeywords: formData.vibeKeywords,
        };

        let response;
        if (existingProfile) {
          // Update existing profile
          response = await axios.put(
            `http://localhost:5000/api/cofounder-profiles/${existingProfile.id}`,
            profileData,
            { withCredentials: true }
          );
          toast.success('Profile updated successfully!');
        } else {
          // Create new profile
          response = await axios.post(
            'http://localhost:5000/api/cofounder-profiles',
            profileData,
            { withCredentials: true }
          );
          toast.success('Profile created successfully!');
        }
        
        // Redirect to home page after successful submission
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

  /**
   * Handle Next button
   */
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Handle Back button
   */
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
      {/* Navigation */}
      <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
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

      {/* Main Content */}
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-700/50 text-gray-400'}`}>
                    {step}
                  </div>
                  {step < 6 && <div className={`w-8 h-1 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-700/50'}`}></div>}
                </div>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">Complete Your Co-Founder Profile</h1>
            <p className="text-blue-200 text-sm text-center">Step {currentStep} of 6</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: The Trust & Reputation Layer */}
            {currentStep === 1 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        The Trust & Reputation Layer
                      </h2>
                      
                      <div>
                        <label htmlFor="fullLegalName" className="block text-sm font-medium text-white mb-2">
                          Full Legal Name (Verified against Government ID)
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
                        <label htmlFor="linkedin" className="block text-sm font-medium text-white mb-2">
                          LinkedIn Profile
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
                        <label htmlFor="githubBehance" className="block text-sm font-medium text-white mb-2">
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
                        <label htmlFor="referenceContact" className="block text-sm font-medium text-white mb-2">
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
                        <label htmlFor="primaryIdentity" className="block text-sm font-medium text-white mb-2">
                          Primary Identity (Domain Expertise)
                        </label>
                        <select
                          id="primaryIdentity"
                          name="primaryIdentity"
                          value={formData.primaryIdentity}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                        >
                          <option value="">Select primary identity</option>
                          <option value="technical">Technical: Engineering, AI, Hardware, Architecture</option>
                          <option value="operations">Operations: Supply Chain, Manufacturing, Logistics, Process</option>
                          <option value="growth">Growth: Marketing, Performance Sales, Viral Loops, PR</option>
                          <option value="product-design">Product/Design: UI/UX, Service Design, Industrial Design</option>
                          <option value="strategy-finance">Strategy/Finance: Fundraising, M&A, Legal, Compliance</option>
                          <option value="other">Other</option>
                        </select>
                        {formData.primaryIdentity === 'other' && (
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
                        <label htmlFor="currentOccupationalStatus" className="block text-sm font-medium text-white mb-2">
                          Current Occupational Status
                        </label>
                        <select
                          id="currentOccupationalStatus"
                          name="currentOccupationalStatus"
                          value={formData.currentOccupationalStatus}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                        >
                          <option value="">Select status</option>
                          <option value="full-time-employee">Full-time Employee</option>
                          <option value="student">Student</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="full-time-builder">Full-time Builder</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="pedigreeScore" className="block text-sm font-medium text-white mb-2">
                          The Pedigree Score
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
                          <option value="industry-veteran">Industry Veteran</option>
                          <option value="domain-specialist">Domain Specialist</option>
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
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        Deep Competency & Intelligence
                      </h2>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          The "Superpower" Hierarchy: List 3 skills where you are in the top 1% globally
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
                          Multi-Domain Toolkit: List 5 tools/frameworks you master
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
                        <label htmlFor="domainIQ" className="block text-sm font-medium text-white mb-2">
                          Domain IQ: How do you stay updated in your field?
                        </label>
                        <textarea
                          id="domainIQ"
                          name="domainIQ"
                          value={formData.domainIQ}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="e.g., Specific newsletters, Peer groups, Research papers"
                        />
                      </div>

                      <div>
                        <label htmlFor="antiPortfolio" className="block text-sm font-medium text-white mb-2">
                          The Anti-Portfolio (Crucial): Describe one professional failure and the specific technical/business lesson you extracted from it
                        </label>
                        <textarea
                          id="antiPortfolio"
                          name="antiPortfolio"
                          value={formData.antiPortfolio}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe your failure and the lesson learned"
                        />
                      </div>

                      <div>
                        <label htmlFor="quantifiableImpact" className="block text-sm font-medium text-white mb-2">
                          Quantifiable Impact: "In my best project, I specifically generated [X amount of revenue / Y number of users / Z% efficiency increase]"
                        </label>
                        <textarea
                          id="quantifiableImpact"
                          name="quantifiableImpact"
                          value={formData.quantifiableImpact}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
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
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        The Financial & Time "Stress Test"
                      </h2>
                      
                      <div>
                        <label htmlFor="drySpellRunway" className="block text-sm font-medium text-white mb-2">
                          The "Dry Spell" Runway: How many months can you work for ₹0 salary if the startup hits a funding delay?
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
                        <label htmlFor="currentBurnRequirement" className="block text-sm font-medium text-white mb-2">
                          Current Burn Requirement: What is the absolute minimum monthly survival stipend you need?
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
                          Bandwidth Reality
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="bandwidthReality"
                              value="side-hustle"
                              checked={formData.bandwidthReality === 'side-hustle'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">"Side-hustle" (10-20 hrs/week)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="bandwidthReality"
                              value="transitioning"
                              checked={formData.bandwidthReality === 'transitioning'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">"Transitioning" (Looking to quit current job in 30-60 days)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="bandwidthReality"
                              value="all-in"
                              checked={formData.bandwidthReality === 'all-in'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">"All-In" (Ready to start 80 hrs/week tomorrow)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="moonlightPolicy" className="block text-sm font-medium text-white mb-2">
                          The "Moonlight" Policy: Will you be working on any other side-projects or consulting gigs simultaneously?
                        </label>
                        <textarea
                          id="moonlightPolicy"
                          name="moonlightPolicy"
                          value={formData.moonlightPolicy}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
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
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        The Ego & Psychology Match (The Oracle's Core)
                      </h2>
                      
                      <div>
                        <label htmlFor="decisionHierarchy" className="block text-sm font-medium text-white mb-2">
                          Decision Hierarchy: In a 50/50 split, who has the final say on [Product Design] vs [Business Strategy]?
                        </label>
                        <textarea
                          id="decisionHierarchy"
                          name="decisionHierarchy"
                          value={formData.decisionHierarchy}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Explain your decision-making approach"
                        />
                      </div>

                      <div>
                        <label htmlFor="conflictSimulation" className="block text-sm font-medium text-white mb-2">
                          Conflict Simulation: "We have 1 month of runway left and no investors. Do we pivot, take a loan, or shut down?"
                        </label>
                        <textarea
                          id="conflictSimulation"
                          name="conflictSimulation"
                          value={formData.conflictSimulation}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe how you would handle this situation"
                        />
                      </div>

                      <div>
                        <label htmlFor="feedbackLoop" className="block text-sm font-medium text-white mb-2">
                          The Feedback Loop: How do you prefer to receive criticism?
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
                          <option value="private-constructive">Private/Constructive</option>
                          <option value="data-led">Data-led only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Work Environment
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="workEnvironment"
                              value="high-pressure-office"
                              checked={formData.workEnvironment === 'high-pressure-office'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">High-Pressure Office (Face-to-face)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="workEnvironment"
                              value="deep-work-remote"
                              checked={formData.workEnvironment === 'deep-work-remote'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">Deep-Work Remote (Asynchronous)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="workEnvironment"
                              value="hybrid"
                              checked={formData.workEnvironment === 'hybrid'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">Hybrid (Flexibility is key)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="riskAppetite" className="block text-sm font-medium text-white mb-2">
                          Risk Appetite: On a scale of 1-10, how comfortable are you with "breaking things to move fast"?
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
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        Ethics & Value Alignment
                      </h2>
                      
                      <div>
                        <label htmlFor="exitVision" className="block text-sm font-medium text-white mb-2">
                          Exit Vision: What is the "Win" for you?
                        </label>
                        <select
                          id="exitVision"
                          name="exitVision"
                          value={formData.exitVision}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                        >
                          <option value="">Select exit vision</option>
                          <option value="build-to-sell">Build to sell in 2 years</option>
                          <option value="ipo-10-years">IPO in 10 years</option>
                          <option value="lifestyle-business">Build a profitable Lifestyle business</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="redLine" className="block text-sm font-medium text-white mb-2">
                          The Red Line: What is one industry or business practice you would NEVER work on for ethical reasons?
                        </label>
                        <textarea
                          id="redLine"
                          name="redLine"
                          value={formData.redLine}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="Describe your ethical red line"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Diversity of Thought: Do you prefer a partner who thinks exactly like you, or someone who constantly challenges your logic?
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="diversityOfThought"
                              value="thinks-like-me"
                              checked={formData.diversityOfThought === 'thinks-like-me'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">Prefers partner who thinks exactly like me</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="diversityOfThought"
                              value="challenges-me"
                              checked={formData.diversityOfThought === 'challenges-me'}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-white">Prefers partner who constantly challenges my logic</span>
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
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                        Targeted Requirement Filters
                      </h2>
                      
                      <div>
                        <label htmlFor="missingHalfProfile" className="block text-sm font-medium text-white mb-2">
                          The "Missing Half" Profile: "I am looking for a Founder who is [Skillset] because I am [Skillset]"
                        </label>
                        <textarea
                          id="missingHalfProfile"
                          name="missingHalfProfile"
                          value={formData.missingHalfProfile}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                          placeholder="e.g., I am looking for a Founder who is a Sales machine because I am a shy Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Industry Specificity (Select up to 3)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['FinTech', 'D2C', 'AgriTech', 'SaaS', 'DeepTech', 'EdTech', 'HealthTech', 'PropTech', 'FoodTech'].map((industry) => (
                            <label key={industry} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.industrySpecificity.includes(industry.toLowerCase())}
                                onChange={() => handleIndustryChange(industry.toLowerCase())}
                                disabled={formData.industrySpecificity.length >= 3 && !formData.industrySpecificity.includes(industry.toLowerCase())}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-gray-300 disabled:opacity-50"
                              />
                              <span className="ml-2 text-sm text-white">{industry}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-300 mt-2">Selected: {formData.industrySpecificity.length}/3</p>
                      </div>

                      <div>
                        <label htmlFor="equityMinimum" className="block text-sm font-medium text-white mb-2">
                          Equity Minimum: What is the lowest equity % you would accept for your "Dream Project"?
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
                        <label htmlFor="vibeKeywords" className="block text-sm font-medium text-white mb-2">
                          The Vibe Keywords
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
                  className="px-8 py-3 rounded-lg font-semibold text-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
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
                  {loading ? 'Saving...' : 'Save and Next'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
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

export default CoFounderProfile;

