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
 * Freelancer Profile Page Component
 * Profile completion page for freelancers
 * Opens after signup or Google signup
 */
const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form state management
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    
    // Education Details
    degreeType: '',
    educationLevel: '',
    graduationYear: '',
    college: '',
    university: '',
    
    // Type of Freelancer
    freelancerType: '',
    freelancerTypeOther: '',
    
    // Skills
    skillsDescription: '',
    describeBest: '',
    
    // Experience
    experience: '',
    
    // Role
    jobProfile: '',
    workingEnvironment: '',
    stipendExpectations: '',
    stipendOther: '',
    
    // Important Links
    linkedin: '',
    github: '',
    otherLinks: '',
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
          email: data.email || '',
          firstName: data.fullName?.split(' ')[0] || '',
          lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
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
        const nameParts = user.full_name.split(' ');
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || prev.email,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          email: user.email || prev.email,
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
        `http://localhost:5000/api/freelancer-profiles/user/${userId}`,
        { withCredentials: true }
      );
      const profile = response.data;
      
      // Map database fields to form fields
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        phoneNumber: profile.phone_number || '',
        degreeType: profile.degree_type || '',
        educationLevel: profile.education_level || '',
        graduationYear: profile.graduation_year || '',
        college: profile.college || '',
        university: profile.university || '',
        freelancerType: profile.freelancer_type || '',
        freelancerTypeOther: profile.freelancer_type_other || '',
        skillsDescription: profile.skills_description || '',
        describeBest: profile.describe_best || '',
        experience: profile.experience || '',
        jobProfile: profile.job_profile || '',
        workingEnvironment: profile.working_environment || '',
        stipendExpectations: profile.stipend_expectations || '',
        stipendOther: profile.stipend_other || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        otherLinks: profile.other_links || '',
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
   * Validate all form fields
   */
  const validateForm = () => {
    const errors = [];

    // Personal Details
    if (!formData.firstName?.trim()) errors.push('First Name is required');
    if (!formData.lastName?.trim()) errors.push('Last Name is required');
    if (!formData.email?.trim()) errors.push('Email ID is required');
    if (!formData.phoneNumber?.trim()) errors.push('Phone Number is required');

    // Education Details
    if (!formData.degreeType?.trim()) errors.push('Degree Type is required');
    if (!formData.educationLevel?.trim()) errors.push('Education Level is required');
    if (formData.educationLevel === 'Post graduate' && !formData.graduationYear?.trim()) {
      errors.push('Graduation Year is required when Education Level is Post graduate');
    }
    if (!formData.college?.trim()) errors.push('College is required');
    if (!formData.university?.trim()) errors.push('University is required');

    // Type of Freelancer
    if (!formData.freelancerType?.trim()) errors.push('Freelancer Type is required');
    if (formData.freelancerType === 'Other' && !formData.freelancerTypeOther?.trim()) {
      errors.push('Please specify your freelancer type');
    }

    // Skills
    if (!formData.skillsDescription?.trim()) errors.push('Skills Description is required');
    if (!formData.describeBest?.trim()) errors.push('What describes you best is required');

    // Experience
    if (!formData.experience?.trim()) errors.push('Experience is required');

    // Role
    if (!formData.jobProfile?.trim()) errors.push('Job Profile is required');
    if (!formData.workingEnvironment?.trim()) errors.push('Working Environment is required');
    if (!formData.stipendExpectations?.trim()) errors.push('Stipend Expectations is required');
    if (formData.stipendExpectations === 'Other' && !formData.stipendOther?.trim()) {
      errors.push('Please specify your stipend amount');
    }

    // Important Links
    if (!formData.linkedin?.trim()) errors.push('LinkedIn link is required');
    if (!formData.github?.trim()) errors.push('GitHub link is required');
    if (!formData.otherLinks?.trim()) errors.push('Other Links is required');

    return errors;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Final step - validate all fields
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
          `http://localhost:5000/api/freelancer-profiles/user/${userId}`,
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        degreeType: formData.degreeType,
        educationLevel: formData.educationLevel,
        graduationYear: formData.graduationYear,
        college: formData.college,
        university: formData.university,
        freelancerType: formData.freelancerType,
        freelancerTypeOther: formData.freelancerTypeOther,
        skillsDescription: formData.skillsDescription,
        describeBest: formData.describeBest,
        experience: formData.experience,
        jobProfile: formData.jobProfile,
        workingEnvironment: formData.workingEnvironment,
        stipendExpectations: formData.stipendExpectations,
        stipendOther: formData.stipendOther,
        linkedin: formData.linkedin,
        github: formData.github,
        otherLinks: formData.otherLinks,
      };

      let response;
      if (existingProfile) {
        // Update existing profile
        response = await axios.put(
          `http://localhost:5000/api/freelancer-profiles/${existingProfile.id}`,
          profileData,
          { withCredentials: true }
        );
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        response = await axios.post(
          'http://localhost:5000/api/freelancer-profiles',
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
  };

  const gradientBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
  };

  const gradientBlackToBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
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

  return (
    <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
      {/* Navigation */}
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

      {/* Main Content */}
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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">Complete Your Profile</h1>
            <p className="text-blue-200 text-sm text-center">Step {currentStep} of 7 - Fill in your details to get started as a freelancer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Personal Details</h2>
                      <div className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                        Email ID
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/30 text-gray-300 text-sm"
                        placeholder="Enter your email"
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-white mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="Enter your phone number"
                      />
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Education Details */}
            {currentStep === 2 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Education Details</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="degreeType" className="block text-sm font-medium text-white mb-1">
                        Type of Degree
                      </label>
                      <input
                        type="text"
                        id="degreeType"
                        name="degreeType"
                        value={formData.degreeType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                          placeholder="e.g., B.Tech, B.A., M.Sc."
                        />
                        </div>
                        <div>
                          <label htmlFor="educationLevel" className="block text-sm font-medium text-white mb-1">
                        Education Level
                      </label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                      >
                        <option value="">Select education level</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Post graduate">Post graduate</option>
                          <option value="Others">Others</option>
                        </select>
                        </div>
                        {formData.educationLevel === 'Post graduate' && (
                          <div>
                            <label htmlFor="graduationYear" className="block text-sm font-medium text-white mb-1">
                          Year of Graduation
                        </label>
                        <input
                          type="text"
                          id="graduationYear"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="e.g., 2023"
                          />
                          </div>
                        )}
                        <div>
                          <label htmlFor="college" className="block text-sm font-medium text-white mb-1">
                        College
                      </label>
                      <input
                        type="text"
                        id="college"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                          placeholder="Enter your college name"
                        />
                        </div>
                        <div>
                          <label htmlFor="university" className="block text-sm font-medium text-white mb-1">
                            University
                          </label>
                          <input
                            type="text"
                            id="university"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="Enter your university name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Type of Freelancer */}
            {currentStep === 3 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Type of Freelancer</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="freelancerType" className="block text-sm font-medium text-white mb-1">
                        Select Your Type
                      </label>
                      <select
                        id="freelancerType"
                        name="freelancerType"
                        value={formData.freelancerType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                      >
                        <option value="">Select type</option>
                        <option value="Web developer">Web developer</option>
                        <option value="App developer">App developer</option>
                        <option value="UI/UX designer">UI/UX designer</option>
                        <option value="Script writing">Script writing</option>
                        <option value="Video editors">Video editors</option>
                        <option value="Other">Other</option>
                      </select>
                        </div>
                        {formData.freelancerType === 'Other' && (
                          <div>
                            <label htmlFor="freelancerTypeOther" className="block text-sm font-medium text-white mb-1">
                              Specify Other Type
                            </label>
                            <input
                              type="text"
                              id="freelancerTypeOther"
                              name="freelancerTypeOther"
                              value={formData.freelancerTypeOther}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                              placeholder="Enter your freelancer type"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Skills</h2>
                      <div className="space-y-4">
                    <div>
                      <label htmlFor="skillsDescription" className="block text-sm font-medium text-white mb-1">
                        Explain your skills (200 words)
                      </label>
                      <textarea
                        id="skillsDescription"
                        name="skillsDescription"
                        value={formData.skillsDescription}
                        onChange={handleChange}
                        rows="4"
                        maxLength="200"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                        placeholder="Describe your skills and expertise..."
                      />
                      <p className="text-sm text-gray-300 mt-1">{formData.skillsDescription.length}/200 words</p>
                    </div>
                    <div>
                      <label htmlFor="describeBest" className="block text-sm font-medium text-white mb-1">
                        What describes you best? (50 words)
                      </label>
                      <textarea
                        id="describeBest"
                        name="describeBest"
                        value={formData.describeBest}
                        onChange={handleChange}
                        rows="3"
                        maxLength="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                        placeholder="Brief description about yourself..."
                      />
                        <p className="text-sm text-gray-300 mt-1">{formData.describeBest.length}/50 words</p>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Experience */}
            {currentStep === 5 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Experience</h2>
                      <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-white mb-1">
                      Describe your experience
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm"
                        placeholder="Share your professional experience, projects, and achievements..."
                      />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Role */}
            {currentStep === 6 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Role</h2>
                      <div className="space-y-4">
                    <div>
                      <label htmlFor="jobProfile" className="block text-sm font-medium text-white mb-1">
                        Job Profile
                      </label>
                      <input
                        type="text"
                        id="jobProfile"
                        name="jobProfile"
                        value={formData.jobProfile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                        placeholder="e.g., Senior Developer, Creative Designer"
                      />
                    </div>
                    <div>
                      <label htmlFor="workingEnvironment" className="block text-sm font-medium text-white mb-1">
                        Working Environment
                      </label>
                      <select
                        id="workingEnvironment"
                        name="workingEnvironment"
                        value={formData.workingEnvironment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                      >
                        <option value="">Select working environment</option>
                        <option value="WFH">WFH</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="stipendExpectations" className="block text-sm font-medium text-white mb-1">
                        Stipend Expectations
                      </label>
                      <select
                        id="stipendExpectations"
                        name="stipendExpectations"
                        value={formData.stipendExpectations}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-800/50 text-white cursor-pointer text-sm"
                      >
                        <option value="">Select stipend range</option>
                        <option value="0-1000">0-1000</option>
                        <option value="1000-2000">1000-2000</option>
                        <option value="2000-3000">2000-3000</option>
                        <option value="3000-5000">3000-5000</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {formData.stipendExpectations === 'Other' && (
                      <div>
                        <label htmlFor="stipendOther" className="block text-sm font-medium text-white mb-1">
                          Specify Stipend Amount
                        </label>
                        <input
                          type="text"
                          id="stipendOther"
                          name="stipendOther"
                          value={formData.stipendOther}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                          placeholder="Enter your stipend expectation"
                        />
                      </div>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Important Links */}
            {currentStep === 7 && (
              <div className="flex justify-center">
                <div className="w-[85%]">
                  <div className="rounded-lg p-[2px] transition-all duration-300" style={gradientBlue}>
                    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">Important Links</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="linkedin" className="block text-sm font-medium text-white mb-1">
                            LinkedIn
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
                          <label htmlFor="github" className="block text-sm font-medium text-white mb-1">
                            GitHub
                          </label>
                          <input
                            type="url"
                            id="github"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                        <div>
                          <label htmlFor="otherLinks" className="block text-sm font-medium text-white mb-1">
                            Any Other Important Links
                          </label>
                          <input
                            type="url"
                            id="otherLinks"
                            name="otherLinks"
                            value={formData.otherLinks}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
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
                  {loading ? 'Saving...' : 'Save Details'}
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

export default FreelancerProfile;

