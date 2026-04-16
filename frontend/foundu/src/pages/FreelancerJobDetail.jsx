import { useState, useEffect, useCallback } from "react";
import { getUserId, getUserType } from "../utils/authUtils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IndianRupee,
  Clock,
  MapPin,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Zap,
  Calendar,
} from "lucide-react";
import Footer from "../components/Footer";
// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
function FreelancerJobDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");
  const [jobData, setJobData] = useState(null);
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userId = getUserId();
      const userType = getUserType();
      if (userId && userType) {
        console.log("✅ Found user data:", { userId, userType });
        return {
          user_id: userId,
          user_type: userType,
        };
      }
      console.error("❌ No user data found in localStorage");
      console.log("Available localStorage keys:", Object.keys(localStorage));
      return null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  };
  // Check if user has already applied
  useEffect(() => {
    const checkApplicationStatus = async () => {
      const userData = getUserData();
      if (!userData || !jobId) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs/${jobId}/applicants/${userData.user_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasApplied(true);
          setApplicationStatus(data.status);
          console.log("User has already applied. Status:", data.status);
        }
      } catch (error) {
        // User hasn't applied yet or error occurred
        console.log("No existing application found");
      }
    };
    if (jobId) {
      checkApplicationStatus();
    }
  }, [jobId]);
  // Handle Apply Now button click
  const handleApplyNow = async () => {
    console.log("=== APPLY NOW CLICKED ===");
    const userData = getUserData();
    console.log("User data retrieved:", userData);
    // Check if user is logged in
    if (!userData || !userData.user_id) {
      toast.error("Please login to apply for this job");
      setTimeout(() => {
        navigate("/login-signup");
      }, 1500);
      return;
    }
    // Check if user is freelancer or cofounder
    if (!["freelancer", "cofounder"].includes(userData.user_type.toLowerCase())) {
      toast.error("Only freelancers or cofounders can apply for jobs");
      return;
    }
    // Prevent multiple applications
    if (hasApplied) {
      toast.warning("You have already applied for this job");
      return;
    }
    setApplying(true);
    try {
      console.log("Sending application request with:", {
        job_id: parseInt(jobId),
        user_id: parseInt(userData.user_id),
      });
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: parseInt(jobId),
          user_id: parseInt(userData.user_id),
        }),
      });
      const data = await response.json();
      console.log("Application response:", data);
      if (response.ok && data.success) {
        setHasApplied(true);
        setApplicationStatus("pending");
        toast.success("Application submitted successfully! 🎉");
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          const dashboardRoute = userData.user_type.toLowerCase() === "freelancer"
            ? "/freelancer-dashboard"
            : "/cofounder-dashboard";
          console.log("Redirecting to:", dashboardRoute);
          navigate(dashboardRoute);
        }, 2000);
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error("An error occurred while submitting your application. Please try again.");
    } finally {
      setApplying(false);
    }
  };
  // Fetch job details and startup profile
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        navigate("/freelancer-jobs");
        return;
      }
      try {
        setLoading(true);
        // Fetch specific job by ID
        const jobResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs/${jobId}`);
        if (!jobResponse.ok) {
          console.error(`Failed to fetch job. Status: ${jobResponse.status}`);
          toast.error("Failed to load job details");
          navigate("/freelancer-jobs");
          return;
        }
        const job = await jobResponse.json();
        console.log("=== JOB DATA ===");
        console.log("Full job object:", job);
        console.log("founder_id:", job.founder_id);
        if (!job) {
          navigate("/freelancer-jobs");
          return;
        }
        setJobData(job);
        // Fetch startup profile using founder_id
        if (job.founder_id) {
          const profilesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/startup-profiles`);
          const profiles = await profilesResponse.json();
          console.log("=== STARTUP PROFILES ===");
          console.log("Total profiles:", profiles.length);
          console.log("All profiles:", profiles);
          console.log("Looking for founder_id:", job.founder_id);
          // Check all possible field variations
          const startupProfile = profiles.find((profile) => {
            console.log("Checking profile:", {
              user_id: profile.user_id,
              founder_id: profile.founder_id,
              job_founder_id: job.founder_id,
              matches: Number(profile.founder_id) === Number(job.founder_id)
            });
            return Number(profile.founder_id) === Number(job.founder_id);
          });
          console.log("=== MATCHED PROFILE ===");
          console.log("Found startup profile:", startupProfile);
          if (startupProfile) {
            console.log("Startup logo URL:", startupProfile.startup_logo_url);
            console.log("Problem solving:", startupProfile.problem_solving);
            setStartupData(startupProfile);
          } else {
            console.error("No matching profile found for founder_id:", job.founder_id);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, navigate]);
  // Get button text and style based on application status
  const getApplyButtonConfig = () => {
    if (applying) {
      return {
        text: "Applying...",
        disabled: true,
        className: "bg-gray-500 cursor-not-allowed"
      };
    }
    if (hasApplied) {
      const statusText = {
        pending: "Application Pending",
        accepted: "Application Accepted ✓",
        rejected: "Application Rejected"
      };
      const statusClass = {
        pending: "bg-yellow-600 hover:bg-yellow-700",
        accepted: "bg-green-600 hover:bg-green-700",
        rejected: "bg-red-600 hover:bg-red-700"
      };
      return {
        text: statusText[applicationStatus] || "Already Applied",
        disabled: true,
        className: statusClass[applicationStatus] || "bg-gray-600 cursor-not-allowed"
      };
    }
    return {
      text: "Apply Now",
      disabled: false,
      className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    };
  };
  if (loading) {
    return (
      <div className="min-h-screen" style={gradientBlackToBlue}>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
        </div>
        <Footer />
      </div>
    );
  }
  if (!jobData) {
    return (
      <div className="min-h-screen" style={gradientBlackToBlue}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-gray-400 text-xl mb-4">Job not found</p>
            <button
              onClick={() => navigate("/freelancer-jobs")}
              className="text-blue-400 hover:text-blue-300"
            >
              Back to Jobs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  console.log("=== RENDERING ===");
  console.log("startupData:", startupData);
  console.log("startup_logo_url:", startupData?.startup_logo_url);
  const buttonConfig = getApplyButtonConfig();
  return (
    <div className="min-h-screen overflow-x-hidden" style={gradientBlackToBlue}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="w-[95vw] md:w-[85vw] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/freelancer-jobs")}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>
          {/* Main Content Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-6 md:p-12 shadow-2xl relative">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8 pb-8 border-b border-white/20">
              {/* Startup Logo */}
              {startupData?.startup_logo_url ? (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 flex-shrink-0 overflow-hidden bg-white">
                  <img
                    src={startupData.startup_logo_url}
                    alt={jobData.job_title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error("Image failed to load:", startupData.startup_logo_url);
                      // hide broken image
                      e.currentTarget.style.display = "none";
                      // SAFETY: parentElement may be null after re-render
                      const parent = e.currentTarget.parentElement;
                      if (!parent) return;
                      parent.classList.remove("bg-white");
                      parent.classList.add(
                        "bg-gradient-to-br",
                        "from-blue-500/40",
                        "to-blue-600/40"
                      );
                      parent.innerHTML = `<span class="text-3xl font-bold text-blue-200">
    ${jobData.job_title
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
  </span>`;
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 flex-shrink-0">
                  <span className="text-3xl font-bold text-blue-200">
                    {jobData.job_title
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  {jobData.job_title}
                </h1>
                {/* Job Details Row */}
                <div className="flex flex-wrap gap-6 items-center">
                  {/* Budget Range */}
                  <div className="flex items-center gap-3 bg-gray-900/40 border border-white/5 rounded-2xl p-4 group hover:border-blue-500/30 transition-all">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black">Stipend Range</p>
                      <p className="text-white font-bold">{jobData?.budget_range || "Contact Founder"}</p>
                    </div>
                  </div>
                  {/* Urgency */}
                  {jobData.urgency && (
                    <div className="flex items-center gap-2 text-blue-300">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium capitalize">
                        {jobData.urgency}
                      </span>
                    </div>
                  )}
                  {/* Duration */}
                  {jobData.duration && (
                    <div className="flex items-center gap-2 text-blue-300">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{jobData.duration}</span>
                    </div>
                  )}
                  {/* Work Type */}
                  <div className="flex items-center gap-2 text-blue-300">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{jobData.job_location_type}</span>
                  </div>
                  {/* Job Level - Placeholder */}
                  <div className="flex items-center gap-2 text-blue-300">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{jobData.job_level}</span>
                  </div>
                  {/* Working Type - Placeholder */}
                  {jobData.work_type && (
                    <div className="flex items-center gap-2 text-blue-300">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium capitalize">
                        {jobData.work_type}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Now Button - Responsive Placement */}
              <div className="mt-8 md:absolute md:top-6 md:right-6">
                <button
                  onClick={handleApplyNow}
                  disabled={buttonConfig.disabled}
                  className={`${buttonConfig.className} w-full md:w-auto text-white px-8 py-4 md:py-3 rounded-xl md:rounded-lg font-bold text-base transition-all duration-300 transform md:hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-2 ${buttonConfig.disabled ? 'opacity-80' : ''
                    }`}
                >
                  <Briefcase className="w-5 h-5" />
                  {buttonConfig.text}
                </button>
              </div>
            </div>
            {/* About Startup Section */}
            {startupData && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                  About Startup
                </h2>
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                  <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                    {startupData.problem_solving ||
                      startupData.startup_details ||
                      "No startup details available at the moment."}
                  </p>
                </div>
              </div>
            )}
            {/* Job Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Job Description
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                  {jobData.full_job_description ||
                    "No job description available."}
                </p>
              </div>
            </div>
            {/* Requirements Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Requirements
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                {(() => {
                  let requirements = [];
                  try {
                    if (jobData.job_requirements) {
                      requirements = JSON.parse(jobData.job_requirements);
                    }
                  } catch (err) {
                    console.error("Failed to parse job_requirements:", err);
                  }
                  if (!requirements || requirements.length === 0) {
                    return (
                      <p className="text-gray-400">
                        No requirements specified for this job.
                      </p>
                    );
                  }
                  return (
                    <ul className="space-y-3">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 leading-relaxed">
                            {requirement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
export default FreelancerJobDetail;