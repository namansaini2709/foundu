
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Footer from "../components/Footer";
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
const CoFounderJobs = () => {
  const navigate = useNavigate();
  const [industryFilter, setIndustryFilter] = useState("All Industry");
  const [stageFilter, setStageFilter] = useState("All Stage");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch available jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch all jobs
        const jobsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/jobs`);
        const jobsData = await jobsResponse.json();
        // Fetch all startup profiles for logos
        const profilesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/startup-profiles`);
        const profilesData = await profilesResponse.json();
        // Create a map of founder_id to startup logo and name
        const startupMap = {};
        profilesData.forEach((profile) => {
          startupMap[profile.founder_id] = {
            logo: profile.startup_logo_url,
            name: profile.startup_name
          };
        });
        // Filter for co-founder jobs
        const filteredJobs = jobsData
          .filter((job) => job.job_type === "cofounder")
          .map((job) => ({
            id: job.job_id,
            logo: startupMap[job.founder_id]?.logo || null,
            startupName: startupMap[job.founder_id]?.name || job.startup_name || "Unknown Startup",
            about: job.full_job_description,
            position: job.job_title,
          }));
        setAvailableJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching co-founder jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  const handleShowInterest = (id) => {
    navigate(`/cofounder-jobs/${id}`);
  };
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={gradientBlackToBlue}>
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-blue-700/30 mb-12">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              {/* Industry Filter */}
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="All Industry" className="bg-gray-800">
                    All Industry
                  </option>
                  <option value="FinTech" className="bg-gray-800">
                    FinTech
                  </option>
                  <option value="HealthTech" className="bg-gray-800">
                    HealthTech
                  </option>
                  <option value="EdTech" className="bg-gray-800">
                    EdTech
                  </option>
                  <option value="SaaS" className="bg-gray-800">
                    SaaS
                  </option>
                  <option value="E-commerce" className="bg-gray-800">
                    E-commerce
                  </option>
                </select>
              </div>
              {/* Stage Filter */}
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">
                  Stage
                </label>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-white/30 bg-gray-800/50 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="All Stage" className="bg-gray-800">
                    All Stage
                  </option>
                  <option value="Idea" className="bg-gray-800">
                    Idea
                  </option>
                  <option value="MVP" className="bg-gray-800">
                    MVP
                  </option>
                  <option value="Early Traction" className="bg-gray-800">
                    Early Traction
                  </option>
                  <option value="Scaling" className="bg-gray-800">
                    Scaling
                  </option>
                </select>
              </div>
              {/* Apply Filter Button */}
              <div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
          {/* Available Jobs Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="text-white">Available </span>
            <span className="text-blue-300">Jobs</span>
          </h2>
          {/* Regular Jobs Cards (without AI percentage) */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : availableJobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No co-founder jobs available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Logo and Startup Name */}
                  <div className="flex items-center mb-4">
                    {job.logo ? (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 border border-blue-500/30 overflow-hidden bg-white">
                        <img src={job.logo} alt={job.startupName} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl mr-3 border border-blue-500/30">
                        {job.startupName.substring(0, 1)}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-white truncate">
                      {job.startupName}
                    </h2>
                  </div>
                  {/* About */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {job.about}
                  </p>
                  {/* Position */}
                  <div className="mb-4">
                    <p className="text-blue-300 text-sm font-medium">
                      Position: {job.position}
                    </p>
                  </div>
                  {/* Show Interest Button */}
                  <button
                    onClick={() => handleShowInterest(job.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-auto"
                  >
                    Show Interest
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default CoFounderJobs;