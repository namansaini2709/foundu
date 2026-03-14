
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
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

  // Sample data for AI matched jobs (with percentage)
  const aiMatchedJobs = [
    {
      id: 1,
      logo: "TV",
      startupName: "TechVenture",
      aiMatch: 95,
      about:
        "We are building the next generation of AI-powered solutions for enterprise clients. Our platform helps businesses automate complex workflows and make data-driven decisions.",
      position: "CTO, CMO, CFO",
    },
    {
      id: 2,
      logo: "IL",
      startupName: "InnovateLab",
      aiMatch: 88,
      about:
        "Revolutionizing the healthcare industry with cutting-edge telemedicine solutions. We connect patients with doctors seamlessly through our innovative platform.",
      position: "CTO, COO",
    },
    {
      id: 3,
      logo: "DF",
      startupName: "DataFlow",
      aiMatch: 92,
      about:
        "Transforming how businesses handle big data with our cloud-native analytics platform. We make complex data analysis simple and accessible for everyone.",
      position: "CTO, CMO",
    },
    {
      id: 4,
      logo: "GT",
      startupName: "GreenTech Solutions",
      aiMatch: 85,
      about:
        "Leading the charge in sustainable technology solutions. We develop eco-friendly software and hardware products that help reduce carbon footprint.",
      position: "CTO, CFO, CMO",
    },
    {
      id: 5,
      logo: "FP",
      startupName: "FinTech Pro",
      aiMatch: 90,
      about:
        "Disrupting the financial services industry with blockchain technology and AI. Our platform enables secure, fast, and transparent financial transactions.",
      position: "CTO, COO",
    },
  ];

  // Sample data for regular jobs (without percentage)
  const regularJobs = [
    {
      id: 6,
      logo: "CS",
      startupName: "CloudSync",
      about:
        "Enterprise cloud solutions provider helping businesses migrate to the cloud seamlessly. We offer comprehensive cloud consulting and implementation services.",
      position: "CTO, CMO",
    },
    {
      id: 7,
      logo: "MH",
      startupName: "MarketPlace Hub",
      about:
        "Creating the largest B2B marketplace for small businesses. Our platform connects suppliers with buyers, making commerce easier and more efficient.",
      position: "CTO, CFO",
    },
    {
      id: 8,
      logo: "EI",
      startupName: "EduTech Innovations",
      about:
        "Transforming education through technology. We build learning platforms that make education accessible, engaging, and effective for students worldwide.",
      position: "CTO, COO, CMO",
    },
    {
      id: 9,
      logo: "HC",
      startupName: "HealthConnect",
      aiMatch: 87, // Kept this if it was here, though regular jobs usually don't show match so prominently in the list
      about:
        "Connecting healthcare providers with patients through innovative digital solutions. We streamline healthcare delivery and improve patient outcomes.",
      position: "CTO, CMO",
    },
    {
      id: 10,
      logo: "RM",
      startupName: "RetailMax",
      about:
        "Empowering retailers with AI-driven inventory management and customer analytics. We help retail businesses optimize operations and increase sales.",
      position: "CTO, CFO",
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

        // Fetch all startup profiles for logos
        const profilesResponse = await fetch("http://localhost:4000/api/startup-profiles");
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
    <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
      <Navbar />

      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            AI Matched Jobs
          </h1>

          {/* AI Matched Jobs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {aiMatchedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 relative"
              >
                {/* AI Match Percentage Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {job.aiMatch}% Match
                  </div>
                </div>

                {/* Logo and Startup Name */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl mr-3 border border-blue-500/30">
                    {job.logo}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {job.startupName}
                  </h2>
                </div>

                {/* About */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                  {job.about}
                </p>

                {/* Position */}
                <div className="mb-4">
                  <p className="text-blue-300 text-sm font-medium">
                    Positions: {job.position}
                  </p>
                </div>

                {/* Show Interest Button */}
                <button
                  onClick={() => handleShowInterest(job.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Show Interest
                </button>
              </div>
            ))}
          </div>

          {/* Filter Section */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-blue-700/30 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-end">
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