import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, IndianRupee, Clock, MapPin } from "lucide-react";
import Footer from "../components/Footer";

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

function FreelancerJobs() {
  const navigate = useNavigate();

  // Current input states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStipend, setSelectedStipend] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");

  // Applied filter states
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: "",
    category: "",
    stipend: "",
    experience: "",
    jobType: "",
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/jobs`,
        );
        const jobsData = await jobsResponse.json();

        const profilesResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/startup-profiles`,
        );
        const profilesData = await profilesResponse.json();

        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:4000";

        // Create a map of founder_id to startup logo
        const founderLogoMap = {};
        profilesData.forEach((profile) => {
          let logoUrl = profile.startup_logo_url;
          if (logoUrl && logoUrl.startsWith("/")) {
            logoUrl = `${API_BASE_URL}${logoUrl}`;
          }
          // Mapping by founder_id as that's what's stored in the jobs table
          founderLogoMap[profile.founder_id] = logoUrl;
        });

        // Filter only freelancer jobs and map with startup logos
        const jobsWithLogos = jobsData
          .filter((job) => job.job_type === "freelancer")
          .map((job) => ({
            id: job.job_id,
            name: job.job_title,
            info: job.full_job_description,
            stipend: job.budget_range,
            founderId: job.founder_id,
            logoUrl: founderLogoMap[job.founder_id] || null,
            domain: job.domain || "",
            roleCategory: job.role_category || "",
            jobLevel: job.job_level || "",
            workType: job.work_type || "",
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

  // Function to apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({
      keyword: searchKeyword,
      category: selectedCategory,
      stipend: selectedStipend,
      experience: selectedExperience,
      jobType: selectedJobType,
    });
  };

  // Filtered list based on APPLIED states
  const filteredJobs = useMemo(() => {
    return availableJobs.filter((job) => {
      const matchesSearch =
        !appliedFilters.keyword ||
        job.name
          ?.toLowerCase()
          .includes(appliedFilters.keyword.toLowerCase()) ||
        job.info?.toLowerCase().includes(appliedFilters.keyword.toLowerCase());

      const matchesCategory =
        !appliedFilters.category ||
        job.domain
          ?.toLowerCase()
          .includes(appliedFilters.category.toLowerCase()) ||
        job.roleCategory
          ?.toLowerCase()
          .includes(appliedFilters.category.toLowerCase());

      const matchesExperience =
        !appliedFilters.experience ||
        job.jobLevel === appliedFilters.experience;

      const matchesJobType =
        !appliedFilters.jobType || job.workType === appliedFilters.jobType;

      let matchesStipend = true;
      if (appliedFilters.stipend) {
        const budget =
          parseInt(String(job.stipend).replace(/[^0-9]/g, "")) || 0;
        if (appliedFilters.stipend === "0-1k") matchesStipend = budget <= 1000;
        else if (appliedFilters.stipend === "1-3k")
          matchesStipend = budget > 1000 && budget <= 3000;
        else if (appliedFilters.stipend === "3-5k")
          matchesStipend = budget > 3000 && budget <= 5000;
        else if (appliedFilters.stipend === "5k+")
          matchesStipend = budget > 5000;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesExperience &&
        matchesJobType &&
        matchesStipend
      );
    });
  }, [availableJobs, appliedFilters]);

  // Job Card Component
  const JobCard = ({ job, showMatch = true, isApiJob = false }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-blue-700/50 rounded-2xl p-5 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-400/20 flex flex-col w-full h-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3 flex-1">
          {job.logoUrl ? (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 overflow-hidden">
              <img
                src={job.logoUrl}
                alt={job.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<span class="text-lg font-bold text-blue-200">${job.name[0]}</span>`;
                }}
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <span className="text-lg font-bold text-blue-200">
                {job.name ? job.name.substring(0, 2).toUpperCase() : "JO"}
              </span>
            </div>
          )}
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight">
            {job.name}
          </h3>
        </div>
      </div>
      <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow relative z-10 leading-relaxed">
        {job.info}
      </p>
      <div className="flex items-center gap-2 mb-4 text-blue-300 relative z-10">
        <IndianRupee className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs">
          {typeof job.stipend === "string"
            ? job.stipend.replace(/₹/g, "").trim()
            : job.stipend}
        </span>
      </div>
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
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <center>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="text-white">Available </span>
              <span className="text-blue-300">Jobs</span>
            </h2>
          </center>

          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 md:p-8 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Filter Jobs</h2>
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
              >
                Apply Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <option value="Engineering / Development">
                    Engineering / Development
                  </option>
                  <option value="Product / UX / UI Design">
                    Product / UX / UI Design
                  </option>
                  <option value="Marketing / Growth">Marketing / Growth</option>
                  <option value="Sales / Business Development">
                    Sales / Business Development
                  </option>
                  <option value="Operations / Support">
                    Operations / Support
                  </option>
                  <option value="Finance / Legal">Finance / Legal</option>
                  <option value="Data / AI / ML">Data / AI / ML</option>
                  <option value="Other">Other</option>
                </select>
              </div>
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
                  <option value="0-1k">₹0 - ₹1k</option>
                  <option value="1-3k">₹1k - ₹3k</option>
                  <option value="3-5k">₹3k - ₹5k</option>
                  <option value="5k+">₹5k+</option>
                </select>
              </div>
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
                  <option value="Low level">Low level</option>
                  <option value="Medium level">Medium level</option>
                  <option value="High level">High level</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                No jobs match your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="w-full flex">
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
