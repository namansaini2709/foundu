import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbox from "./Chatbox";
import {
  FaShieldAlt,
  FaMedal,
  FaAward,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api";

const CoFounderDashboard = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const userId = localStorage.getItem("user_id");

  const gradientBlackToBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };

  // Tab config with icons
  const tabs = [
    { key: "chats", label: "My Chats", icon: "💬" },
    { key: "applications", label: "Applications", icon: "📂" },
    { key: "badges", label: "My Badges", icon: "🏅" },
  ];

  // Fetch applications when applications tab is active
  useEffect(() => {
    if (activeTab === "applications" && userId) {
      fetchApplications();
    }
  }, [activeTab, userId]);

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await axios.get(`${API_URL}/user/${userId}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
    setLoadingApps(false);
  };

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
      case "completed":
        return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
      case "rejected":
        return "bg-red-500/15 text-red-300 border border-red-500/30";
      default:
        return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
    }
  };

  return (
    <div className="min-h-screen text-white font-sans" style={gradientBlackToBlue}>
      <Navbar />

      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            CO-FOUNDER DASHBOARD
          </h1>
          <p className="text-blue-200 text-lg text-center">
            Manage your chats, applications, and verified badges
          </p>

          {/* ═══════════════════════════════════════════════
              PREMIUM CENTER-ALIGNED TOGGLE BAR
          ═══════════════════════════════════════════════ */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-2xl shadow-blue-900/20">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold
                    transition-all duration-400 ease-out cursor-pointer
                    ${activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  style={{
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl shadow-xl ${activeTab === "chats" ? "p-0 overflow-hidden" : "p-8"
            } min-h-[500px]`}
        >
          {/* ═══════════ YOUR CHATS TAB ═══════════ */}
          {activeTab === "chats" && (
            <div className="h-[600px]">
              <Chatbox />
            </div>
          )}

          {/* ═══════════ APPLICATIONS TAB ═══════════ */}
          {activeTab === "applications" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    My Applications
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Track your co-founder job applications & statuses
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-900/50 rounded-xl p-1 border border-white/10">
                  {["all", "pending", "accepted", "rejected"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-300 cursor-pointer ${statusFilter === f
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loadingApps ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-gray-400 text-sm">
                    Loading applications...
                  </p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="text-6xl opacity-30">📋</div>
                  <p className="text-gray-400 text-lg">No applications found</p>
                  <p className="text-gray-500 text-sm">
                    Your co-founder job applications will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((app, idx) => (
                    <div
                      key={`${app.job_id}-${idx}`}
                      className="group p-5 rounded-xl bg-gray-900/40 border border-gray-700/40 hover:border-blue-500/40 transition-all duration-300 hover:bg-gray-900/60"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {app.job_title || "Untitled Job"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center gap-1.5 text-sm text-gray-400">
                              <span className="text-blue-400">🏢</span>
                              {app.startup_name || "Unknown Startup"}
                            </span>
                            {app.domain && (
                              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                <span className="text-purple-400">•</span>
                                {app.domain}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                              📅{" "}
                              {new Date(app.applied_on).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusStyle(
                            app.status
                          )}`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ BADGES TAB ═══════════ */}
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
