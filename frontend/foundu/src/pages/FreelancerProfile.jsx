import { useState, useEffect } from "react";
import { getUserId } from "../utils/authUtils";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import ProfilePreview from "../components/ProfilePreview";

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("id");
  const currentUserId = getUserId();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(targetUserId && targetUserId !== currentUserId ? "view" : "edit"); 
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userBasicInfo, setUserBasicInfo] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    degreeType: "",
    educationLevel: "",
    graduationYear: "",
    college: "",
    university: "",
    freelancerType: "",
    freelancerTypeOther: "",
    skillsDescription: "",
    describeBest: "",
    experience: "",
    jobProfile: "",
    workingEnvironment: "",
    stipendExpectations: "",
    stipendOther: "",
    linkedin: "",
    github: "",
    otherLinks: "",
  });

  useEffect(() => {
    const userId = targetUserId || currentUserId;
    if (!userId) {
      if (localStorage.getItem("auth_sync_pending") === "true") return;
      toast.error("User not logged in");
      navigate("/login-signup");
      return;
    }
    fetchUser(userId);
    fetchProfile(userId);
    fetchReviews(userId);
  }, [navigate, targetUserId, currentUserId]);
  const fetchReviews = async (userId) => {
    try {
      const res = await api.get(`/api/reviews/user/${userId}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const fetchUser = async (userId) => {
    try {
      const res = await api.get(`/api/users/${userId}`);
      const user = res.data.success ? res.data.data : res.data;
      setUserBasicInfo(user);
      const name = user.full_name?.split(" ") || [];
      // Only pre-fill if formData is currently empty to avoid overwriting existing profile data
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || name[0] || "",
        lastName: prev.lastName || name.slice(1).join(" ") || "",
        email: prev.email || user.email || "",
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const fetchProfile = async (userId) => {
    try {
      const res = await api.get(
        `/api/freelancer-profiles/user/${userId}`
      );
      const p = res.data;
      setProfileData(p);
      setFormData({
        firstName: p.first_name || "",
        lastName: p.last_name || "",
        email: p.email || "",
        phoneNumber: p.phone_number || "",
        degreeType: p.degree_type || "",
        educationLevel: p.education_level || "",
        graduationYear: p.graduation_year || "",
        college: p.college || "",
        university: p.university || "",
        freelancerType: p.freelancer_type || "",
        freelancerTypeOther: p.freelancer_type_other || "",
        skillsDescription: p.skills_description || "",
        describeBest: p.describe_best || "",
        experience: p.experience || "",
        jobProfile: p.job_profile || "",
        workingEnvironment: p.working_environment || "",
        stipendExpectations: p.stipend_expectations || "",
        stipendOther: p.stipend_other || "",
        linkedin: p.linkedin || "",
        github: p.github || "",
        otherLinks: p.other_links || "",
      });
      toast.success("Profile loaded successfully");
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  // Validate fields for the current step only
  const validateCurrentStep = () => {
    const errors = [];
    switch (currentStep) {
      case 1: // Personal Details
        if (!formData.firstName?.trim()) {
          errors.push("First Name is required");
        }
        if (!formData.lastName?.trim()) {
          errors.push("Last Name is required");
        }
        if (!formData.email?.trim()) {
          errors.push("Email is required");
        }
        if (!formData.phoneNumber?.trim()) {
          errors.push("Phone Number is required");
        }
        break;
      case 2: // Education Details
        if (!formData.degreeType?.trim()) {
          errors.push("Degree Type is required");
        }
        if (!formData.educationLevel?.trim()) {
          errors.push("Education Level is required");
        }
        if (formData.educationLevel === "Post graduate" && !formData.graduationYear?.trim()) {
          errors.push("Graduation Year is required for Post graduate");
        }
        if (!formData.college?.trim()) {
          errors.push("College is required");
        }
        if (!formData.university?.trim()) {
          errors.push("University is required");
        }
        break;
      case 3: // Type of Freelancer
        if (!formData.freelancerType?.trim()) {
          errors.push("Freelancer Type is required");
        }
        if (formData.freelancerType === "Other" && !formData.freelancerTypeOther?.trim()) {
          errors.push("Please specify your freelancer type");
        }
        break;
      case 4: // Skills
        if (!formData.skillsDescription?.trim()) {
          errors.push("Skills Description is required");
        }
        if (!formData.describeBest?.trim()) {
          errors.push("Self Description is required");
        }
        break;
      case 5: // Experience
        if (!formData.experience?.trim()) {
          errors.push("Experience is required");
        }
        break;
      case 6: // Role
        if (!formData.jobProfile?.trim()) {
          errors.push("Job Profile is required");
        }
        if (!formData.workingEnvironment?.trim()) {
          errors.push("Working Environment is required");
        }
        if (!formData.stipendExpectations?.trim()) {
          errors.push("Stipend Expectations is required");
        }
        if (formData.stipendExpectations === "Other" && !formData.stipendOther?.trim()) {
          errors.push("Please specify your stipend expectation");
        }
        break;
      case 7: // Important Links
        if (!formData.linkedin?.trim()) {
          errors.push("LinkedIn profile is required");
        }
        if (!formData.github?.trim()) {
          errors.push("GitHub profile is required");
        }
        if (!formData.otherLinks?.trim()) {
          errors.push("Portfolio or other link is required");
        }
        break;
      default:
        break;
    }
    return errors;
  };
  // Handle Next button click
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
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };
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
      const response = await api.post(
        `/api/freelancer-profiles`,
        {
          user_id: Number(userId),
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          degree_type: formData.degreeType,
          education_level: formData.educationLevel,
          graduation_year: formData.graduationYear,
          college: formData.college,
          university: formData.university,
          freelancer_type: formData.freelancerType,
          freelancer_type_other: formData.freelancerTypeOther,
          skills_description: formData.skillsDescription,
          describe_best: formData.describeBest,
          experience: formData.experience,
          job_profile: formData.jobProfile,
          working_environment: formData.workingEnvironment,
          stipend_expectations: formData.stipendExpectations,
          stipend_other: formData.stipendOther,
          linkedin: formData.linkedin,
          github: formData.github,
          other_links: formData.otherLinks,
        }
      );
      console.log("Profile created:", response.data);
      toast.success("Profile created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const gradient = {
    background:
      "linear-gradient(180deg, rgba(2,0,36,1) 16%, rgba(9,9,121,1) 100%)",
  };
  const gradientBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };
  return (
    <div className="min-h-screen flex flex-col" style={gradient}>
      {/* Navigation */}
      {/* Main Content */}
      <div className="pt-24 pb-8 flex flex-col items-center">
        {/* View/Edit Toggle Bar */}
        {(!targetUserId || targetUserId === currentUserId) && (
          <div className="w-full md:w-[85%] max-w-7xl mb-8 px-4">
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
        )}
        {viewMode === "view" ? (
          <ProfilePreview
            user={{
              ...userBasicInfo,
              role: profileData?.job_profile,
              description: profileData?.describe_best,
              avg_stars: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length).toFixed(1) : 0,
              review_count: reviews.length,
              isOpenToWork: true // Default to true as LinkedIn style
            }}
            reviews={reviews}
            type="freelancer"
          />
        ) : (
          <div className="max-w-6xl w-full md:w-[75%] px-4 sm:px-6 lg:px-8">
            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep >= step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700/50 text-gray-400"
                        }`}
                    >
                      {step}
                    </div>
                    {step < 7 && (
                      <div
                        className={`w-8 h-1 ${currentStep > step ? "bg-blue-500" : "bg-gray-700/50"
                          }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 text-center">
                Complete Your Profile
              </h1>
              <p className="text-blue-200 text-sm text-center">
                Step {currentStep} of 7 - Fill in your details to get started as a
                freelancer
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="flex justify-center">
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Personal Details
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              First Name <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Last Name <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Email ID <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Phone Number <span className="text-red-500">*</span>
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Education Details
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="degreeType"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Type of Degree <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="educationLevel"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Education Level <span className="text-red-500">*</span>
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
                          {formData.educationLevel === "Post graduate" && (
                            <div>
                              <label
                                htmlFor="graduationYear"
                                className="block text-sm font-medium text-white mb-1"
                              >
                                Year of Graduation <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="college"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              College <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="university"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              University <span className="text-red-500">*</span>
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Type of Freelancer
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="freelancerType"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Select Your Type <span className="text-red-500">*</span>
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
                          {formData.freelancerType === "Other" && (
                            <div>
                              <label
                                htmlFor="freelancerTypeOther"
                                className="block text-sm font-medium text-white mb-1"
                              >
                                Specify Other Type <span className="text-red-500">*</span>
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Skills
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="skillsDescription"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Explain your skills (200 words) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="skillsDescription"
                              name="skillsDescription"
                              value={formData.skillsDescription}
                              onChange={handleChange}
                              rows="4"
                              maxLength="200"
                              className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                              placeholder="Describe your skills and expertise..."
                            />
                            <p className="text-sm text-gray-300 mt-1">
                              {formData.skillsDescription.length}/200 characters
                            </p>
                          </div>
                          <div>
                            <label
                              htmlFor="describeBest"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              What describes you best? (50 words) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="describeBest"
                              name="describeBest"
                              value={formData.describeBest}
                              onChange={handleChange}
                              rows="3"
                              maxLength="50"
                              className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
                              placeholder="Brief description about yourself..."
                            />
                            <p className="text-sm text-gray-300 mt-1">
                              {formData.describeBest.length}/50 characters
                            </p>
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Experience
                        </h2>
                        <div>
                          <label
                            htmlFor="experience"
                            className="block text-sm font-medium text-white mb-1"
                          >
                            Describe your experience <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none text-sm placeholder-gray-400"
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Role
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="jobProfile"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Job Profile <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="workingEnvironment"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Working Environment <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="stipendExpectations"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Stipend Expectations <span className="text-red-500">*</span>
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
                          {formData.stipendExpectations === "Other" && (
                            <div>
                              <label
                                htmlFor="stipendOther"
                                className="block text-sm font-medium text-white mb-1"
                              >
                                Specify Stipend Amount <span className="text-red-500">*</span>
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
                  <div className="w-full md:w-[85%]">
                    <div
                      className="rounded-lg p-[2px] transition-all duration-300"
                      style={gradientBlue}
                    >
                      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 md:p-12 space-y-6 border border-blue-700/30">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-300">
                          Important Links
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="linkedin"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              LinkedIn <span className="text-red-500">*</span>
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
                              htmlFor="github"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              GitHub <span className="text-red-500">*</span>
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
                            <label
                              htmlFor="otherLinks"
                              className="block text-sm font-medium text-white mb-1"
                            >
                              Any Other Important Links <span className="text-gray-400 text-xs">(write null if you don't have any)</span> <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="otherLinks"
                              name="otherLinks"
                              value={formData.otherLinks}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder-gray-400"
                              placeholder="https://yourportfolio.com or null"
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
                <div className="flex-1" />
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
export default FreelancerProfile;