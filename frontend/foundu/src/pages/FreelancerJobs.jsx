import { useState } from "react";
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

  // Available Jobs (dummy data)
  const availableJobs = [
    {
      id: 6,
      logo: "FS",
      name: "Full Stack Developer",
      info: "Build end-to-end web solutions with modern tech stack",
      stipend: "$4,000",
      match: 82,
    },
    {
      id: 7,
      logo: "VE",
      name: "Video Editor",
      info: "Edit engaging video content for social media and marketing",
      stipend: "$2,200",
      match: 75,
    },
    {
      id: 8,
      logo: "CW",
      name: "Content Writer",
      info: "Create compelling blog posts and marketing copy",
      stipend: "$1,800",
      match: 78,
    },
    {
      id: 9,
      logo: "DM",
      name: "Digital Marketing Specialist",
      info: "Manage social media campaigns and SEO strategies",
      stipend: "$3,000",
      match: 85,
    },
    {
      id: 10,
      logo: "CS",
      name: "Cybersecurity Expert",
      info: "Secure applications and infrastructure for growing companies",
      stipend: "$5,000",
      match: 80,
    },
    {
      id: 11,
      logo: "CA",
      name: "Cloud Architect",
      info: "Design scalable cloud infrastructure solutions",
      stipend: "$4,800",
      match: 83,
    },
    {
      id: 12,
      logo: "PM",
      name: "Product Manager",
      info: "Lead product development and strategy initiatives",
      stipend: "$4,500",
      match: 77,
    },
    {
      id: 13,
      logo: "QA",
      name: "QA Tester",
      info: "Ensure software quality through comprehensive testing",
      stipend: "$2,000",
      match: 74,
    },
  ];
Navbar
  // Navbar Component
  // const Navbar = () => (

  // Footer Component
  // const Footer = () => (
  //   <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
  //     <div className="max-w-7xl mx-auto">
  //       <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
  //         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
  //           <div className="md:col-span-1">
  //             <div className="flex items-center mb-4">
  //               <span className="text-3xl font-bold text-white">F</span>
  //               <span className="text-white text-2xl font-bold ml-2">OUNDU</span>
  //             </div>
  //             <p className="text-gray-300 text-sm leading-relaxed mb-4">
  //               The central platform for startups to discover, connect, and collaborate with skilled freelancers and co-founders. AI-powered matching, instant connections.
  //             </p>
  //             <div className="flex gap-4">
  //               <a href="#" className="text-white/80 hover:text-white transition-colors">
  //                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
  //                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  //                 </svg>
  //               </a>
  //               <a href="#" className="text-white/80 hover:text-white transition-colors">
  //                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
  //                   <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  //                 </svg>
  //               </a>
  //               <a href="#" className="text-white/80 hover:text-white transition-colors">
  //                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
  //                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  //                 </svg>
  //               </a>
  //             </div>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
  //             <ul className="space-y-3">
  //               <li className="flex items-center text-white/80 text-sm">
  //                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  //                 </svg>
  //                 foundu@example.com
  //               </li>
  //               <li className="flex items-center text-white/80 text-sm">
  //                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  //                 </svg>
  //                 +1 (555) 123-4567
  //               </li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
  //             <ul className="space-y-2">
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About Us</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Our Team</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">FAQ</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</a></li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">For Startups</h3>
  //             <ul className="space-y-2">
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Browse Talent</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Create Profile</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Post Gig</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Explore Community</a></li>
  //               <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Partner With Us</a></li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="text-center">
  //         <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">FOUNDU</div>
  //         <div className="flex justify-center gap-8 mb-6">
  //           <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
  //           <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
  //           <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</a>
  //         </div>
  //         <div className="text-white/60 text-sm">
  //           © 2025 Foundu, All rights reserved.
  //         </div>
  //       </div>
  //     </div>
  //   </footer>
  // )

  // Job Card Component
  const JobCard = ({ job, showMatch = true }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-blue-700/50 rounded-2xl p-5 hover:border-blue-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-400/20 flex flex-col w-full h-full relative overflow-hidden group">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Top Row: Logo + Job Name + Match Percentage */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3 flex-1">
          {/* Logo - Top Left */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl flex items-center justify-center border-2 border-blue-400/60 shadow-lg shadow-blue-400/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <span className="text-lg font-bold text-blue-200">{job.logo}</span>
          </div>

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
        onClick={() => navigate(`/job-description?id=${job.id}`)}
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
                  <JobCard job={job} showMatch={true} />
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

          {/* Available Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableJobs.map((job) => (
              <div
                key={job.id}
                className="w-full"
                style={{ aspectRatio: "1 / 1" }}
              >
                <JobCard job={job} showMatch={false} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default FreelancerJobs;
