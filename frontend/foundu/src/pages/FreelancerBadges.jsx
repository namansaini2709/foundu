import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { X, Loader2, TrendingUp, Star, CheckCircle } from "lucide-react";
import blueBadge from "../assets/bluebadge.png";
import greenBadge from "../assets/greenbadge.png";
import goldenBadge from "../assets/goldenbadge.png";
import red1 from "../assets/9095.png";
import red2 from "../assets/8590.png";
import red3 from "../assets/8085.png";
import red4 from "../assets/below80.png";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:4000/api";

const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

/* ── Blue Tick status badge component ─────────────────────── */
const BlueTickStatusBadge = ({ status, verified }) => {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/50 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
        <img
          src={blueBadge}
          alt="Blue Check"
          className="w-3 h-3 rounded-full"
        />{" "}
        Blue Tick Verified
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-400/40 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
        <Loader2 size={12} className="animate-spin" /> Under Review — Pending
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-400/40 text-red-300 text-xs font-bold px-3 py-1 rounded-full">
        <X size={12} /> Rejected — Resubmit
      </span>
    );
  }
  return null;
};

const FreelancerBadges = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blueTickStatus, setBlueTickStatus] = useState(null); // null | 'pending' | 'approved' | 'rejected'
  const [blueTickVerified, setBlueTickVerified] = useState(false);
  const [greenTickVerified, setGreenTickVerified] = useState(false);
  const [goldenData, setGoldenData] = useState(null);

  const [formData, setFormData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    profilePhoto: "",
  });

  const userId = localStorage.getItem("user_id");

  /* ── Load existing social data + blue tick status on mount ── */
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API}/user-socials/${userId}`, { withCredentials: true })
      .then((res) => {
        const d = res.data.data;
        if (d) {
          setFormData({
            linkedin: d.linkedin_url || "",
            github: d.github_url || "",
            portfolio: d.portfolio_url || "",
            profilePhoto: d.profile_picture_url || "",
          });
          setBlueTickStatus(d.blue_tick_status);
          setBlueTickVerified(!!d.blue_tick_verified);
          setGreenTickVerified(!!d.green_tick_verified);
        }
      })
      .catch(() => {});

    // Load golden tick progress
    axios
      .get(`${API}/badges/golden-status/${userId}`, { withCredentials: true })
      .then((res) => setGoldenData(res.data.data))
      .catch(() => {});
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Save & Submit ────────────────────────────────────────── */
  const handleSave = async () => {
    if (!formData.linkedin) {
      return toast.error("LinkedIn URL is required", { theme: "dark" });
    }
    if (!formData.github && !formData.portfolio) {
      return toast.error("At least GitHub or Portfolio URL is required", {
        theme: "dark",
      });
    }
    if (!userId) {
      return toast.error("You must be logged in", { theme: "dark" });
    }

    setSubmitting(true);
    try {
      // Step 1 — Save social URLs to users_socials table
      await axios.post(
        `${API}/user-socials`,
        {
          user_id: userId,
          linkedin_url: formData.linkedin,
          github_url: formData.github,
          portfolio_url: formData.portfolio,
          profile_picture_url: formData.profilePhoto,
        },
        { withCredentials: true },
      );

      // Step 2 — Apply for Blue Tick (sets blue_tick_status = 'pending')
      await axios.post(
        `${API}/badges/apply/blue`,
        {
          user_id: userId,
        },
        { withCredentials: true },
      );

      setBlueTickStatus("pending");
      setIsModalOpen(false);
      toast.success(" Verification submitted! Under review by admin.", {
        theme: "dark",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed", {
        theme: "dark",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Can they apply? ─────────────────────────────────────── */
  const canApply = !blueTickVerified && blueTickStatus !== "pending";

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={gradientBlackToBlue}
    >
      <Navbar />

      <div className="flex-grow pt-24 px-4 pb-12 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          <span className="text-white">FREELANCER </span>
          <span className="text-blue-300">BADGES</span>
        </h1>

        {/* Verification Badges */}
        <div className="flex flex-col gap-6 mb-16">
          {/* ── Blue Tick Badge ─────────────────────────────── */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-blue-400 transition-all">
            <div className="flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 ${blueTickVerified ? "bg-blue-500 shadow-blue-500/50 border-blue-400" : "bg-gray-700 shadow-gray-700/30 border-gray-600"}`}
              >
                <img
                  src={blueBadge}
                  alt="Blue Badge"
                  className={`w-full h-full object-cover ${!blueTickVerified && "opacity-40 grayscale"}`}
                />
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="text-xl font-bold text-blue-300">
                  Verification Badge
                </h3>
                <BlueTickStatusBadge
                  status={blueTickStatus}
                  verified={blueTickVerified}
                />
              </div>
              <p className="text-gray-300 text-sm">
                Get verified by linking your professional profiles. Requires
                LinkedIn URL, GitHub URL, and/or Portfolio Link.
              </p>
              {blueTickStatus === "pending" && (
                <p className="text-yellow-400/80 text-xs mt-1">
                  ⏳ Your submission is under manual review. We'll update your
                  status soon.
                </p>
              )}
              {blueTickStatus === "rejected" && (
                <p className="text-red-400/80 text-xs mt-1">
                  Your previous submission was rejected. Please update your URLs
                  and resubmit.
                </p>
              )}
              {blueTickVerified && (
                <p className="text-blue-400/80 text-xs mt-1">
                  Congratulations! Your profile is Blue Tick verified.
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {blueTickVerified ? (
                <button
                  disabled
                  className="bg-blue-500/30 border border-blue-400/30 text-blue-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Verified
                </button>
              ) : blueTickStatus === "pending" ? (
                <button
                  disabled
                  className="bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
                >
                  <Loader2 size={16} className="animate-spin" /> Pending
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                >
                  {blueTickStatus === "rejected" ? "Resubmit" : "Apply Now"}
                </button>
              )}
            </div>
          </div>

          {/* ── Green Tick Badge ─────────────────────────────── */}
          <div className="bg-gray-800/40 backdrop-blur-md border border-green-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-green-400 transition-all">
            <div className="flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 ${greenTickVerified ? "bg-green-500 shadow-green-500/50 border-green-400" : "bg-gray-700 shadow-gray-700/30 border-gray-600"}`}
              >
                <img
                  src={greenBadge}
                  alt="Green Badge"
                  className={`w-full h-full object-cover ${!greenTickVerified && "opacity-40 grayscale"}`}
                />
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-xl font-bold text-green-300 mb-2">
                Project Completion Badge
              </h3>
              <p className="text-gray-300">
                Automatically awarded upon completing 3 projects on Foundu.
                Showcases your reliability and experience.
              </p>
            </div>
            <div className="flex-shrink-0">
              {greenTickVerified ? (
                <button
                  disabled
                  className="bg-green-500/30 border border-green-400/30 text-green-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Awarded
                </button>
              ) : (
                <button
                  disabled
                  className="bg-green-500/20 border border-green-500/30 text-green-400 px-8 py-3 rounded-lg font-semibold cursor-not-allowed text-sm"
                >
                  Auto-Awarded
                </button>
              )}
            </div>
          </div>

          {/* ── Golden Tick Badge ─────────────────────────────── */}
          <div
            className={`bg-gray-800/40 backdrop-blur-md border rounded-xl p-6 hover:scale-[1.01] transition-all duration-300 ${
              goldenData?.golden_tick_active
                ? "border-yellow-400/60 shadow-lg shadow-yellow-500/20"
                : "border-yellow-500/30"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all overflow-hidden border-2 ${
                    goldenData?.golden_tick_active
                      ? "bg-yellow-400 shadow-yellow-400/50 border-yellow-300"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <img
                    src={goldenBadge}
                    alt="Golden Badge"
                    className={`w-full h-full object-cover ${!goldenData?.golden_tick_active && "opacity-40 grayscale"}`}
                  />
                </div>
              </div>
              <div className="flex-grow w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-yellow-300">
                    Top Freelancer Badge
                  </h3>
                  {goldenData?.golden_tick_active && (
                    <span className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold px-3 py-0.5 rounded-full">
                      🏆 Active — {goldenData.current_month}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Exclusive badge for active users. Requires Blue Tick + 20
                  distinct login days in the current month.
                  <span className="text-yellow-500/80 text-xs ml-1">
                    * Resets monthly
                  </span>
                </p>

                {/* Progress Section */}
                {goldenData ? (
                  <div className="space-y-2">
                    {/* Blue tick prerequisite */}
                    <div className="flex items-center gap-2 text-xs">
                      {goldenData.has_blue_tick ? (
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          <CheckCircle size={12} /> Blue Tick — Verified
                        </span>
                      ) : (
                        <span className="text-red-400 font-semibold flex items-center gap-1">
                          <X size={12} /> Blue Tick — Required first
                        </span>
                      )}
                    </div>

                    {/* Login day progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          Login Days (this month)
                        </span>
                        <span
                          className={`font-bold ${
                            goldenData.golden_tick_active
                              ? "text-yellow-400"
                              : "text-white"
                          }`}
                        >
                          {goldenData.login_days_this_month} /{" "}
                          {goldenData.required_login_days}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700/60 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-700 ${
                            goldenData.golden_tick_active
                              ? "bg-gradient-to-r from-yellow-400 to-amber-400"
                              : "bg-gradient-to-r from-blue-500 to-yellow-500"
                          }`}
                          style={{ width: `${goldenData.progress_percent}%` }}
                        />
                      </div>
                      {!goldenData.golden_tick_active && (
                        <p className="text-gray-500 text-xs mt-1">
                          {goldenData.has_blue_tick
                            ? goldenData.days_remaining > 0
                              ? `${goldenData.days_remaining} more login day${goldenData.days_remaining > 1 ? "s" : ""} needed this month`
                              : "Eligible! Will be awarded on next login."
                            : "Complete Blue Tick verification first to be eligible."}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-2.5 bg-gray-700/40 rounded-full w-full animate-pulse" />
                )}
              </div>
              <div className="flex-shrink-0">
                {goldenData?.golden_tick_active ? (
                  <button
                    disabled
                    className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-6 py-3 rounded-lg font-semibold cursor-not-allowed text-sm"
                  >
                    🏆 Earned
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-700/40 border border-gray-600/40 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed text-sm"
                  >
                    {" "}
                    Auto-Awarded
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Credibility Score Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-white">CREDIBILITY </span>
            <span className="text-blue-300">SCORE</span>
          </h2>

          <div className="flex flex-col gap-6">
            {[
              {
                range: "90-95",
                label: "Exceptional",
                color: "text-red-300",
                bgGradient: "bg-red-500/15",
                border: "border-red-400/40",
                criteria:
                  "Maintains an exceptional 4.9+ average rating across 50+ thoroughly verified client reviews on FoundU.",
                perks: "Top 1% Search Ranking",
                icon: red1,
                iconBorder: "border-red-300",
              },
              {
                range: "85-90",
                label: "Excellent",
                color: "text-red-400",
                bgGradient: "bg-red-600/15",
                border: "border-red-500/40",
                criteria:
                  "Maintains an excellent 4.7+ average rating across 30+ verified client reviews on FoundU.",
                perks: "Highlighted Profile",
                icon: red2,
                iconBorder: "border-red-400",
              },
              {
                range: "80-85",
                label: "Very Good",
                color: "text-red-500",
                bgGradient: "bg-red-700/15",
                border: "border-red-600/40",
                criteria:
                  "Maintains a very good 4.5+ average rating across 15+ verified client reviews on FoundU.",
                perks: "Verified Status",
                icon: red3,
                iconBorder: "border-red-500",
              },
              {
                range: "Below 80",
                label: "Good",
                color: "text-red-600",
                bgGradient: "bg-red-800/15",
                border: "border-red-700/40",
                criteria:
                  "Maintains a solid 4.0+ average rating across 5+ verified client reviews on FoundU.",
                perks: "Standard Access",
                icon: red4,
                iconBorder: "border-red-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`backdrop-blur-md border ${item.border} ${item.bgGradient} rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.01] transition-all duration-300 shadow-lg`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 ${item.iconBorder}`}
                  >
                    <img
                      src={item.icon}
                      alt="Credibility Red Badge"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-grow flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                  <div className="text-center md:text-left min-w-[140px]">
                    <h3 className={`text-2xl font-bold ${item.color} mb-1`}>
                      {item.range}
                    </h3>
                    <p className="text-white font-semibold">{item.label}</p>
                  </div>
                  <div className="hidden md:block h-12 w-px bg-gray-700/50" />
                  <div className="md:hidden w-full h-px bg-gray-700/50" />
                  <div className="text-center md:text-left flex-1">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Criteria
                    </div>
                    <div className="text-gray-300 text-sm font-medium">
                      {item.criteria}
                    </div>
                  </div>
                  <div className="hidden md:block h-12 w-px bg-gray-700/50" />
                  <div className="md:hidden w-full h-px bg-gray-700/50" />
                  <div className="text-center md:text-left flex-1">
                    <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                      Benefits
                    </div>
                    <div className="text-gray-300 text-sm font-medium">
                      {item.perks}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-4 md:mt-0">
                  <button
                    disabled
                    className="bg-gray-700/40 border border-gray-600/40 text-gray-400 px-6 py-3 rounded-lg font-semibold cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    Auto-Awarded
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Modal ─────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="bg-gray-900 border border-blue-500/50 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl shadow-blue-900/50">
            <button
              onClick={() => !submitting && setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <CheckCircle className="text-blue-500" />
              Verify Profile
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              After submitting, your links will be reviewed manually by the
              FoundU team.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  LinkedIn URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  GitHub URL{" "}
                  <span className="text-gray-500">(or Portfolio)</span>
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  placeholder="https://github.com/your-username"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => !submitting && setIsModalOpen(false)}
                disabled={submitting}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={submitting}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  "Save & Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default FreelancerBadges;
