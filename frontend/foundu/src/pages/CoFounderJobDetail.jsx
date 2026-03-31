import { useState, useEffect, useCallback } from "react";
import { getUserId, getUserType } from "../utils/authUtils";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DollarSign,
  Briefcase,
  MapPin,
  CheckCircle,
  ArrowLeft,
  Zap,
  Clock,
  Calendar,
} from "lucide-react";
import Footer from "../components/Footer";
// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
function CoFounderJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  // Get user data from localStorage
  const getUserData = () => {
    try {
      const possibleKeys = ["user", "userData", "currentUser", "authUser"];
      for (const key of possibleKeys) {
        const userDataString = localStorage.getItem(key);
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            const userId = userData.user_id || userData.id || userData.userId;
            const userType = userData.user_type || userData.userType || userData.applicant_type || userData.type;
            if (userId && userType) {
              return { user_id: userId, user_type: userType };
            }
          } catch (parseError) {
            console.error(`Failed to parse ${key}:`, parseError);
          }
        }
      }
      const directUserId = getUserId();
      const directUserType = getUserType();
      if (directUserId && directUserType) {
        return { user_id: directUserId, user_type: directUserType };
      }
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
      if (!userData || !id) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs/${id}/applicants/${userData.user_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasApplied(true);
          setApplicationStatus(data.status);
        }
      } catch (error) {
        console.log("No existing application found");
      }
    };
    if (id) {
      checkApplicationStatus();
    }
  }, [id]);
  // Fetch job details and startup profile
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) {
        navigate("/cofounder-jobs");
        return;
      }
      try {
        setLoading(true);
        const jobResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs/${id}`);
        if (!jobResponse.ok) {
          toast.error("Failed to load job details");
          navigate("/cofounder-jobs");
          return;
        }
        const job = await jobResponse.json();
        setJobData(job);
        // Fetch startup profile using founder_id
        if (job.founder_id) {
          const profilesResponse = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`}/api/startup-profiles`);
          const profiles = await profilesResponse.json();
          const startupProfile = profiles.find((profile) => Number(profile.founder_id) === Number(job.founder_id));
          if (startupProfile) {
            setStartupData(startupProfile);
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
  }, [id, navigate]);
  const handleApplyNow = async () => {
    const userData = getUserData();
    if (!userData || !userData.user_id) {
      toast.error("Please login to apply");
      setTimeout(() => navigate("/login-signup"), 1500);
      return;
    }
    if (hasApplied) {
      toast.warning("You have already shown interest in this job");
      return;
    }
    setApplying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`}/api/jobs/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: parseInt(id),
          user_id: parseInt(userData.user_id),
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setHasApplied(true);
        setApplicationStatus("pending");
        toast.success("Interest submitted successfully! 🎉");
        setTimeout(() => navigate("/cofounder-dashboard"), 2000);
      } else {
        toast.error(data.message || "Failed to submit interest");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setApplying(false);
    }
  };
  const getApplyButtonConfig = () => {
    if (applying) return { text: "Submitting...", disabled: true, className: "bg-gray-500 cursor-not-allowed" };
    if (hasApplied) {
      const statusText = { pending: "Interest Pending", accepted: "Interest Accepted ✓", rejected: "Interest Rejected" };
      const statusClass = { pending: "bg-yellow-600 hover:bg-yellow-700", accepted: "bg-green-600 hover:bg-green-700", rejected: "bg-red-600 hover:bg-red-700" };
      return { text: statusText[applicationStatus] || "Already Applied", disabled: true, className: statusClass[applicationStatus] || "bg-gray-600 cursor-not-allowed" };
    }
    return { text: "Show Interest", disabled: false, className: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" };
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
            <button onClick={() => navigate("/cofounder-jobs")} className="text-blue-400 hover:text-blue-300">Back to Jobs</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  const buttonConfig = getApplyButtonConfig();
  const job = jobData; // For compatibility with existing JSX
  return (
    <div className="min-h-screen" style={gradientBlackToBlue}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>
      <section className="pt-32 pb-16 px-4 relative z-10">
        <div className="w-[85vw] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/cofounder-jobs")}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>
          {/* Main Content Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl relative">
            {/* Header Section */}
            <div className="flex items-start gap-6 mb-8 pb-8 border-b border-white/20">
              {startupData?.startup_logo_url ? (
                <div className="w-20 h-20 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 flex-shrink-0 overflow-hidden bg-white">
                  <img
                    src={startupData.startup_logo_url}
                    alt={job.job_title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 flex-shrink-0">
                  <span className="text-3xl font-bold text-blue-200">
                    {job.job_title?.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "CF"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {startupData?.startup_name || job.startup_name || "Unknown Startup"}
                </h1>
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-2 text-blue-300">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold text-lg">{job.budget_range || job.compensation || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300">
                    <Briefcase className="w-5 h-5" />
                    <span className="font-medium">{job.job_level || job.experienceLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{job.job_location_type || job.location}</span>
                  </div>
                  {job.urgency && (
                    <div className="flex items-center gap-2 text-blue-300">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium capitalize">{job.urgency}</span>
                    </div>
                  )}
                  {job.duration && (
                    <div className="flex items-center gap-2 text-blue-300">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{job.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Show Interest Button - Top Right */}
            <div className="absolute top-6 right-4">
              <button
                onClick={handleApplyNow}
                disabled={buttonConfig.disabled}
                className={`${buttonConfig.className} text-white px-8 py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2 ${buttonConfig.disabled ? 'opacity-80' : ''}`}
              >
                <Briefcase className="w-5 h-5" />
                {buttonConfig.text}
              </button>
            </div>
            {/* About Startup Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                About {startupData?.startup_name || job.startup_name || "Startup"}
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                  {startupData?.problem_solving || startupData?.startup_details || "No startup details available at the moment."}
                </p>
              </div>
            </div>
            {/* Job Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Job Description
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                  {job.full_job_description || "No job description available."}
                </p>
              </div>
            </div>
            {/* Responsibilities Section */}
            {job.responsibilities && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                  Responsibilities
                </h2>
                <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                  <ul className="space-y-3">
                    {(() => {
                      let resp = [];
                      try {
                        resp = typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities;
                      } catch (e) { resp = [job.responsibilities]; }
                      return resp.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 leading-relaxed">{item}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>
              </div>
            )}
            {/* Requirements Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                Requirements
              </h2>
              <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
                <ul className="space-y-3">
                  {(() => {
                    let reqs = [];
                    try {
                      if (job.job_requirements) {
                        reqs = typeof job.job_requirements === 'string' ? JSON.parse(job.job_requirements) : job.job_requirements;
                      } else if (job.requirements) {
                        reqs = typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements;
                      }
                    } catch (e) { reqs = [job.job_requirements || job.requirements]; }
                    if (!reqs || reqs.length === 0) return <p className="text-gray-400">No requirements specified.</p>;
                    return reqs.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 leading-relaxed">{requirement}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
export default CoFounderJobDetail;