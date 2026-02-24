import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, DollarSign, Clock, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

function FreelancerJobs() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStipend, setSelectedStipend] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Matched Jobs (dummy data)
  const aiMatchedJobs = [
    {
      id: 1,
      logo: "FD",
      name: "Frontend Developer",
      info: "Build responsive web applications using React and Next.js",
      stipend: "$3,500",
      match: 95,
    },
    {
      id: 2,
      logo: "UX",
      name: "UI/UX Designer",
      info: "Create stunning user interfaces for mobile and web platforms",
      stipend: "$2,800",
      match: 88,
    },
    {
      id: 3,
      logo: "MA",
      name: "Mobile App Developer",
      info: "Develop cross-platform mobile apps using React Native",
      stipend: "$4,200",
      match: 92,
    },
    {
      id: 4,
      logo: "AI",
      name: "AI/ML Engineer",
      info: "Design and implement machine learning models for startups",
      stipend: "$5,500",
      match: 87,
    },
    {
      id: 5,
      logo: "DA",
      name: "Data Analyst",
      info: "Analyze business data and create insightful visualizations",
      stipend: "$2,500",
      match: 90,
    },
  ];

  // Fetch available jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch all jobs
        const jobsResponse = await fetch("http://localhost:4000/api/jobs");
        const jobsData = await jobsResponse.json();
        
        // Debug: Log the first job to see the structure
        if (jobsData.length > 0) {
          console.log("First job from API:", jobsData[0]);
        }

        // Fetch all startup profiles
        const profilesResponse = await fetch("http://localhost:4000/api/startup-profiles");
        const profilesData = await profilesResponse.json();

        // Create a map of founder_id to startup logo
        const founderLogoMap = {};
        profilesData.forEach((profile) => {
          founderLogoMap[profile.userId] = profile.startup_logo_url;
        });

        // Filter only freelancer jobs and map with startup logos
        const jobsWithLogos = jobsData
          .filter((job) => job.job_type === "freelancer")
          .map((job) => ({
            id: job.job_id, // Use job_id from API response
            name: job.job_title,
            info: job.full_job_description,
            stipend: job.budget_range,
            founderId: job.founder_id,
            logoUrl: founderLogoMap[job.founder_id] || null,
          }));

        setAvailableJobs(jobsWithLogos);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Job Card Component
  const JobCard = ({ job, showMatch = true, isApiJob = false }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-blue-700/50 rounded-2xl p-5 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-400/20 flex flex-col w-full h-full relative overflow-hidden group">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Top Row: Logo + Job Name + Match Percentage */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3 flex-1">
          {/* Logo - Top Left */}
          {isApiJob && job.logoUrl ? (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden">
              <img
                src={job.logoUrl}
                alt={job.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<span class="text-lg font-bold text-blue-200">${job.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}</span>`;
                  e.target.parentElement.classList.add(
                    "bg-gradient-to-br",
                    "from-blue-500/40",
                    "to-blue-600/40"
                  );
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <span className="text-lg font-bold text-blue-200">
                {isApiJob
                  ? job.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : job.logo}
              </span>
            </div>
          )}

          {/* Job Name - Next to Logo */}
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
            {job.name}
          </h3>
        </div>

        {/* Match Percentage - Top Right (Smaller) */}
        {showMatch && (
          <span className="text-xs font-bold text-green-400 flex-shrink-0">
            {job.match}%
          </span>
        )}
      </div>

      {/* One Liner Job Description */}
      <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow relative z-10 leading-relaxed">
        {job.info}
      </p>

      {/* Stipend (Optional - can be removed if not needed) */}
      <div className="flex items-center gap-2 mb-4 text-blue-300 relative z-10">
        <DollarSign className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs">{job.stipend}</span>
      </div>

      {/* Apply Now Button */}
      <button
        onClick={() => navigate(`/job-description?job_id=${job.id}`)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 mt-auto relative z-10 shadow-md hover:shadow-lg hover:shadow-blue-500/50"
      >
        Apply Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={gradientBlackToBlue}>
      <Navbar />
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* AI Matched Jobs Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="text-white">AI </span>
            <span className="text-blue-300">Matched Jobs</span>
          </h1>

          {/* AI Matched Jobs - 5 Columns */}
          <div className="relative mb-16">
            <div className="absolute top-0 left-0 -translate-y-1/2 bg-gray-900/70 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              AI Match: 92%
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
              {aiMatchedJobs.map((job) => (
                <div
                  key={job.id}
                  className="w-full"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <JobCard job={job} showMatch={true} isApiJob={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Filters Box */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Filter Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Keyword */}
              <div className="lg:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">
                  Search Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Search jobs..."
                  />
                </div>
              </div>

              {/* Job Category */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Job Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="writing">Writing</option>
                  <option value="data">Data Science</option>
                </select>
              </div>

              {/* Stipend */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Stipend
                </label>
                <select
                  value={selectedStipend}
                  onChange={(e) => setSelectedStipend(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">All Ranges</option>
                  <option value="0-1k">$0 - $1k</option>
                  <option value="1-3k">$1k - $3k</option>
                  <option value="3-5k">$3k - $5k</option>
                  <option value="5k+">$5k+</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Experience Level
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Job Type
                </label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="">All Types</option>
                  <option value="fulltime">Full Time</option>
                  <option value="parttime">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Available Jobs Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="text-white">Available </span>
            <span className="text-blue-300">Jobs</span>
          </h2>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : availableJobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No jobs available at the moment.</p>
            </div>
          ) : (
            /* Available Jobs Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableJobs.map((job) => (
                <div
                  key={job.id}
                  className="w-full"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <JobCard job={job} showMatch={false} isApiJob={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default FreelancerJobs;