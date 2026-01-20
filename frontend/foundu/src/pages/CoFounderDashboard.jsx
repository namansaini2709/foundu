import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaBuilding,
  FaAward,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar,
  FaShieldAlt,
  FaMedal,
} from "react-icons/fa";

const CoFounderDashboard = () => {
  const [activeTab, setActiveTab] = useState("applications");

  const gradientBlackToBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };

  // Dummy data for applications
  const applications = [
    {
      id: 1,
      logo: "🚀",
      name: "TechStart Innovations",
      aboutUs:
        "We are revolutionizing the tech industry with innovative solutions and cutting-edge technology. Our mission is to empower businesses through digital transformation.",
      aiMatch: 92,
      status: "accepted",
    },
    {
      id: 2,
      logo: "💼",
      name: "Marketing Pro Solutions",
      aboutUs:
        "A leading marketing agency focused on helping startups scale through strategic marketing campaigns and brand development. We specialize in digital marketing and growth strategies.",
      aiMatch: 85,
      status: "undergoing",
    },
    {
      id: 3,
      logo: "⚡",
      name: "CloudTech Systems",
      aboutUs:
        "Building the next generation of cloud infrastructure solutions for enterprises worldwide. Our platform enables seamless cloud migration and management.",
      aiMatch: 78,
      status: "rejected",
    },
    {
      id: 4,
      logo: "🌟",
      name: "InnovateLab",
      aboutUs:
        "A creative agency dedicated to helping startups bring their innovative ideas to life. We combine design thinking with technical expertise to create exceptional products.",
      aiMatch: 88,
      status: "accepted",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FaCheckCircle className="text-green-400" />;
      case "rejected":
        return <FaTimesCircle className="text-red-400" />;
      case "undergoing":
        return <FaClock className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "ACCEPTED";
      case "rejected":
        return "REJECTED";
      case "undergoing":
        return "UNDERGOING";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "undergoing":
        return "text-yellow-400";
      default:
        return "text-white";
    }
  };

  return (
    <div className="min-h-screen" style={gradientBlackToBlue}>
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-12 text-white">
            CO-FOUNDER DASHBOARD
          </h1>

          {/* Toggle Bar */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm border-2 border-white/30 rounded-xl p-2 inline-flex gap-2">
              <button
                onClick={() => setActiveTab("applications")}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  activeTab === "applications"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                My Applications
              </button>
              <button
                onClick={() => setActiveTab("badges")}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  activeTab === "badges"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                My Badges
              </button>
            </div>
          </div>

          {/* Content Section */}
          {activeTab === "applications" && (
            <div className="max-w-6xl mx-auto">
              {/* Main Container Box */}
              <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 md:p-8">
                {/* 4 Application Boxes Vertically */}
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-gray-900/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 relative"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        {/* Left Side - Logo, Name, and About */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Logo */}
                          <div className="text-5xl md:text-6xl flex-shrink-0">
                            {app.logo}
                          </div>

                          {/* Name and About */}
                          <div className="flex-1">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                              {app.name}
                            </h3>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                              {app.aboutUs}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - AI Match and Status */}
                        <div className="flex flex-col items-end justify-between gap-4 md:min-w-[150px]">
                          {/* AI Match Score - Top Right */}
                          <div className="text-right">
                            <p className="text-gray-400 text-xs mb-1">
                              AI Match Score
                            </p>
                            <p className="text-3xl md:text-4xl font-bold text-green-400">
                              {app.aiMatch}%
                            </p>
                          </div>

                          {/* Status - Bottom Right */}
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {getStatusIcon(app.status)}
                              <span
                                className={`text-lg md:text-xl font-bold ${getStatusColor(app.status)}`}
                              >
                                {getStatusText(app.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-12">
              {/* Badges You Have Obtained */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Badges You Have Obtained
                </h2>
                <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8">
                  <p className="text-gray-400 text-center py-8">
                    No badges obtained yet. Keep applying to earn your first
                    badge!
                  </p>
                </div>
              </div>

              {/* Badges You Can Claim */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Badges You Can Claim
                </h2>

                {/* Verification Badge Category */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                    Verification Badge
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {/* Blue Tech Badge */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-blue-500 rounded-xl p-6 flex items-center gap-4 min-w-[200px] hover:border-blue-400 transition-all duration-300">
                      <FaShieldAlt className="text-blue-500 text-4xl" />
                      <div>
                        <p className="text-white font-semibold text-lg">
                          Blue Tech
                        </p>
                        <p className="text-gray-400 text-sm">
                          Verification Badge
                        </p>
                      </div>
                    </div>

                    {/* Golden Tech Badge */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-yellow-500 rounded-xl p-6 flex items-center gap-4 min-w-[200px] hover:border-yellow-400 transition-all duration-300">
                      <FaMedal className="text-yellow-500 text-4xl" />
                      <div>
                        <p className="text-white font-semibold text-lg">
                          Golden Tech
                        </p>
                        <p className="text-gray-400 text-sm">
                          Verification Badge
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credibility Score Badge Category */}
                <div>
                  <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                    Credibility Score Badge
                  </h3>
                  <div className="space-y-4">
                    {/* 92-95 Range */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-red-600 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaAward className="text-red-600 text-3xl" />
                          <div>
                            <p className="text-white font-semibold text-lg">
                              92-95 Score Range
                            </p>
                            <p className="text-gray-400 text-sm">
                              Excellent Credibility
                            </p>
                          </div>
                        </div>
                        <div className="w-32 h-4 bg-red-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* 85-90 Range */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaAward className="text-red-500 text-3xl" />
                          <div>
                            <p className="text-white font-semibold text-lg">
                              85-90 Score Range
                            </p>
                            <p className="text-gray-400 text-sm">
                              Very Good Credibility
                            </p>
                          </div>
                        </div>
                        <div className="w-32 h-4 bg-red-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* 82-85 Range */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-red-400 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaAward className="text-red-400 text-3xl" />
                          <div>
                            <p className="text-white font-semibold text-lg">
                              82-85 Score Range
                            </p>
                            <p className="text-gray-400 text-sm">
                              Good Credibility
                            </p>
                          </div>
                        </div>
                        <div className="w-32 h-4 bg-red-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* 80 Below Range */}
                    <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-red-300 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FaAward className="text-red-300 text-3xl" />
                          <div>
                            <p className="text-white font-semibold text-lg">
                              80 Below Score Range
                            </p>
                            <p className="text-gray-400 text-sm">
                              Basic Credibility
                            </p>
                          </div>
                        </div>
                        <div className="w-32 h-4 bg-red-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoFounderDashboard;
