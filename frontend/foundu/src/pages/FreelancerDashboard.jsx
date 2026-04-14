import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../utils/authUtils";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { ArrowLeft, Briefcase } from "lucide-react";
import Footer from "../components/Footer";
import blueBadge from "../assets/bluebadge.png";
import greenBadge from "../assets/greenbadge.png";
import goldenBadge from "../assets/goldenbadge.png";
import red1 from "../assets/9095.png";
import red2 from "../assets/8590.png";
import red3 from "../assets/8085.png";
import red4 from "../assets/below80.png";
const API_URL = `/api`;
const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [badgeData, setBadgeData] = useState(null);
  const [credibilityData, setCredibilityData] = useState(null);

  const [walletBalance, setWalletBalance] = useState(0);
  const [realTransactions, setRealTransactions] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);

  const userId = getUserId();
  const gradientBlackToBlue = {
    background:
      "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
  };
  // Tab config with icons
  const tabs = [
    { key: "projects", label: "Projects", icon: "📂" },
    { key: "payments", label: "Payments", icon: "💰" },
    { key: "badges", label: "Badges", icon: "🏅" },
  ];
  // Fetch applications when projects tab is active
  useEffect(() => {
    if (activeTab === "projects" && userId) {
      fetchApplications();
    }
    if (activeTab === "payments" && userId) {
      fetchWalletData();
    }
  }, [activeTab, userId]);
  // Fetch badge statuses and credibility score
  useEffect(() => {
    if (userId) {
      api
        .get(`${API_URL}/user-socials/${userId}`)
        .then((res) => setBadgeData(res.data.data))
        .catch((err) => console.error("Error fetching badges:", err));
      api
        .get(`${API_URL}/reviews/credibility/${userId}`)
        .then((res) => setCredibilityData(res.data))
        .catch((err) => console.error("Error fetching credibility:", err));
    }
  }, [userId]);

  const fetchWalletData = async () => {
    setLoadingPayments(true);
    try {
      const balanceRes = await api.get(`${API_URL}/payments/wallet/${userId}`);
      setWalletBalance(balanceRes.data.balance);

      const transRes = await api.get(
        `${API_URL}/payments/transactions/${userId}`,
      );
      setRealTransactions(transRes.data);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
    setLoadingPayments(false);
  };

  // Step 1: Validate and show the summary modal
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }
    // Show summary modal — actual payment happens on Continue
    setShowWithdrawModal(true);
  };

  // Step 2: User clicks Continue → open Razorpay → on success call backend
  const handleConfirmWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const platformFee = amount * 0.05;
    const netPayout = amount - platformFee;

    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh and try again.");
      return;
    }

    setWithdrawProcessing(true);
    try {
      // Create a Razorpay order for the NET payout amount
      const orderRes = await api.post(`${API_URL}/payments/create-order`, {
        amount: netPayout,
        receipt: `withdraw_${userId}_${Date.now()}`,
      });

      const { order_id, amount: orderAmount } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency: "INR",
        name: "FoundU Withdrawal",
        description: `Withdraw ₹${netPayout.toLocaleString()} (after 5% platform fee)`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Payment successful — record withdrawal on backend
            await api.post(`${API_URL}/payments/withdraw`, {
              user_id: userId,
              amount,
            });
            toast.success(
              `₹${netPayout.toLocaleString()} credited to your account! 🎉`,
            );
            setShowWithdrawModal(false);
            setWithdrawAmount("");
            fetchWalletData();
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Withdrawal recording failed",
            );
          } finally {
            setWithdrawProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setWithdrawProcessing(false);
            toast.info("Withdrawal cancelled.");
          },
        },
        prefill: {
          name: localStorage.getItem("user_name") || "",
          email: localStorage.getItem("user_email") || "",
        },
        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Withdrawal initiation error:", err);
      toast.error("Failed to initiate withdrawal. Please try again.");
      setWithdrawProcessing(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get(`${API_URL}/user/${userId}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
    setLoadingApps(false);
  };
  const refreshBadges = async () => {
    try {
      await api.post(`${API_URL}/badges/recalculate`, { user_id: userId });
      // Refetch badge data
      const res = await api.get(`${API_URL}/user-socials/${userId}`);
      setBadgeData(res.data.data);
      toast.success("Badges refreshed successfully!");
    } catch (err) {
      console.error("Error refreshing badges:", err);
      toast.error("Failed to refresh badges");
    }
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
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={gradientBlackToBlue}
    >
      <div className="w-[95vw] md:w-[85vw] mx-auto pt-24 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/freelancer-jobs")}
          className="flex items-center gap-2 text-blue-300 hover:text-blue-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Jobs</span>
        </button>
        {/* Header Section */}
        <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter text-center mb-2">
            DASHBOARD<span className="text-blue-500">.</span>
          </h1>
          <p className="text-blue-200 text-sm md:text-lg text-center">
            Manage your chats, applications, earnings, and badges
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
                                        ${
                                          activeTab === tab.key
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
        <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl shadow-xl p-5 md:p-8 min-h-[500px]">
          {activeTab === "projects" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    My Applications
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Track your job applications & statuses
                  </p>
                </div>
                <div className="flex flex-nowrap items-center gap-1 bg-gray-900/50 rounded-xl p-1 border border-white/10 overflow-x-auto no-scrollbar">
                  {["all", "pending", "accepted", "rejected"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-300 cursor-pointer ${
                        statusFilter === f
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
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Briefcase className="text-gray-500" size={32} />
                  </div>
                  <p className="text-gray-400 text-lg">No applications found</p>
                  <p className="text-gray-500 text-sm">
                    Your job applications will appear here
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
                                },
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {app.status === "accepted" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/job-dashboard/freelancer/${app.job_id}`,
                                );
                              }}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-900/20"
                            >
                              Go to Tracking
                            </button>
                          )}
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusStyle(app.status)}`}
                          >
                            {app.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {/* ═══════════ PAYMENTS TAB ═══════════ */}
          {activeTab === "payments" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    FoundU Virtual Wallet
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Manage your earnings & withdrawals
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-32"
                  />
                  <button
                    onClick={handleWithdraw}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-900/20"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700/20 border border-white/10 p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl md:text-8xl">💳</span>
                  </div>
                  <p className="text-blue-300 font-semibold mb-2 uppercase tracking-wider text-[10px] md:text-xs">
                    Available Balance
                  </p>
                  <p className="text-3xl md:text-5xl font-black text-white">
                    ₹{(walletBalance || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-700/20 border border-white/10 p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                  <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="text-6xl md:text-8xl">📈</span>
                  </div>
                  <p className="text-purple-300 font-semibold mb-2 uppercase tracking-wider text-[10px] md:text-xs">
                    Total Transactions
                  </p>
                  <p className="text-3xl md:text-5xl font-black text-white">
                    {realTransactions.length}
                  </p>
                </div>
              </div>

              {/* Transaction History */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-blue-500 text-2xl">⚡</span>
                  Transaction History
                </h3>

                {loadingPayments ? (
                  <div className="flex justify-center py-10 text-gray-500">
                    Loading history...
                  </div>
                ) : realTransactions.length === 0 ? (
                  <div className="bg-gray-900/20 border border-dashed border-gray-700 rounded-2xl p-12 text-center">
                    <p className="text-gray-500">
                      No transactions recorded yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {realTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-gray-900/40 rounded-xl hover:bg-gray-900/60 transition-all border border-white/5 hover:border-blue-500/30 gap-4"
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg flex-shrink-0 ${
                              tx.transaction_type === "credit"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {tx.transaction_type === "credit" ? "↓" : "↑"}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base md:text-lg">
                              {tx.description}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-tighter">
                              {new Date(tx.created_at).toLocaleString()} •{" "}
                              {tx.status}
                            </p>
                          </div>
                        </div>
                        <p
                          className={`font-black text-lg md:text-xl self-end sm:self-center ${tx.transaction_type === "credit" ? "text-green-400" : "text-red-400"}`}
                        >
                          {tx.transaction_type === "credit" ? "+" : "-"}₹
                          {tx.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ═══════════ BADGES TAB ═══════════ */}
          {activeTab === "badges" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Badges Achieved
                </h2>
                <button
                  onClick={refreshBadges}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  Refresh Badges
                </button>
              </div>
              {/* Verification Badges */}
              {(badgeData?.blue_tick_verified === 1 ||
                badgeData?.blue_tick_verified === true ||
                badgeData?.golden_tick_verified === 1 ||
                badgeData?.golden_tick_verified === true ||
                badgeData?.green_tick_verified === 1 ||
                badgeData?.green_tick_verified === true) && (
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-blue-300 mb-6 pl-3 border-l-4 border-blue-500">
                    Verification Badge
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(badgeData?.blue_tick_verified === 1 ||
                      badgeData?.blue_tick_verified === true) && (
                      <div className="flex flex-col items-center p-6 md:p-8 bg-gray-700/30 rounded-xl border border-blue-500/30 hover:border-blue-400 transition-all group">
                        <img
                          src={blueBadge}
                          alt="Blue Badge"
                          className=" object-cover w-16 h-16 md:w-20 md:h-20 mb-2"
                        />
                        <p className="font-bold text-blue-400 text-base md:text-lg">
                          Identity Verified
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 text-center mt-2">
                          Blue Tick Check
                        </p>
                      </div>
                    )}
                    {(badgeData?.golden_tick_verified === 1 ||
                      badgeData?.golden_tick_verified === true) && (
                      <div className="flex flex-col items-center p-6 md:p-8 bg-gray-700/30 rounded-xl border border-yellow-500/30 hover:border-yellow-400 transition-all group">
                        <img
                          src={goldenBadge}
                          alt="Golden Badge"
                          className=" object-cover w-16 h-16 md:w-20 md:h-20 mb-2"
                        />
                        <p className="font-bold text-yellow-400 text-base md:text-lg">
                          Skill Verified
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 text-center mt-2">
                          Golden Tick Check
                        </p>
                      </div>
                    )}
                    {(badgeData?.green_tick_verified === 1 ||
                      badgeData?.green_tick_verified === true) && (
                      <div className="flex flex-col items-center p-6 md:p-8 bg-gray-700/30 rounded-xl border border-green-500/30 hover:border-green-400 transition-all group">
                        <img
                          src={greenBadge}
                          alt="Green Badge"
                          className=" object-cover w-16 h-16 md:w-20 md:h-20 mb-2"
                        />
                        <p className="font-bold text-green-400 text-base md:text-lg">
                          Payment Verified
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 text-center mt-2">
                          Green Tick Check
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Credibility Score Badges */}
              {(credibilityData || badgeData?.credibility_badge) && (
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-6 pl-3 border-l-4 border-red-500">
                    Credibility Score Badge
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {(credibilityData?.badge === "90-95" ||
                      badgeData?.credibility_badge === "90-95") && (
                      <div className="bg-gray-700/30 p-8 rounded-xl border-t-4 border-red-600 text-center hover:bg-gray-700/50 transition-all group">
                        <img
                          src={red1}
                          alt="Exceptional Badge"
                          className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-red-500 shadow-lg shadow-red-500/20"
                        />
                        <p className="text-xl font-bold text-red-500">90-95</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Top Rated (Exceptional)
                        </p>
                      </div>
                    )}
                    {(credibilityData?.badge === "85-90" ||
                      badgeData?.credibility_badge === "85-90") && (
                      <div className="bg-gray-700/30 p-8 rounded-xl border-t-4 border-red-400 text-center hover:bg-gray-700/50 transition-all group">
                        <img
                          src={red2}
                          alt="Excellent Badge"
                          className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-red-400 shadow-lg shadow-red-400/20"
                        />
                        <p className="text-xl font-bold text-red-400">85-90</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Highly Credible (Excellent)
                        </p>
                      </div>
                    )}
                    {(credibilityData?.badge === "80-85" ||
                      badgeData?.credibility_badge === "80-85") && (
                      <div className="bg-gray-700/30 p-8 rounded-xl border-t-4 border-red-300 text-center hover:bg-gray-700/50 transition-all group">
                        <img
                          src={red3}
                          alt="Very Good Badge"
                          className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-red-300 shadow-lg shadow-red-300/20"
                        />
                        <p className="text-xl font-bold text-red-300">80-85</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Credible (Very Good)
                        </p>
                      </div>
                    )}
                    {(credibilityData?.badge === "below-80" ||
                      badgeData?.credibility_badge === "below-80") && (
                      <div className="bg-gray-700/30 p-8 rounded-xl border-t-4 border-red-200 text-center hover:bg-gray-700/50 transition-all group">
                        <img
                          src={red4}
                          alt="Growing Badge"
                          className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-red-200 shadow-lg shadow-red-200/20"
                        />
                        <p className="text-xl font-bold text-red-200">
                          Below 80
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          Growing (Good)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* ═══════════ WITHDRAWAL SUMMARY MODAL ═══════════ */}
      {showWithdrawModal &&
        (() => {
          const amount = parseFloat(withdrawAmount) || 0;
          const fee = amount * 0.05;
          const netPayout = amount - fee;
          return (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                if (!withdrawProcessing) setShowWithdrawModal(false);
              }}
            >
              <div
                className="relative bg-gray-900 border-2 border-green-500 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-green-500/20"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: "fadeInScale 0.25s ease" }}
              >
                {/* Receipt header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💸</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    Withdrawal Summary
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Review your payout details before confirming
                  </p>
                </div>

                {/* Receipt lines */}
                <div className="bg-gray-800/60 border border-green-500/20 rounded-xl p-5 space-y-4 mb-6">
                  <div className="border-t border-dashed border-gray-600 pt-1" />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Requested Amount
                    </span>
                    <span className="text-white font-bold text-lg">
                      ₹{amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Platform Fee{" "}
                      <span className="text-red-400 font-semibold">(5%)</span>
                    </span>
                    <span className="text-red-400 font-bold">
                      - ₹{fee.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-600" />

                  <div className="flex justify-between items-center">
                    <span className="text-green-300 font-black text-base uppercase tracking-wider">
                      You Receive
                    </span>
                    <span className="text-green-400 font-black text-2xl">
                      ₹{netPayout.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-600" />
                </div>

                <p className="text-gray-500 text-xs text-center mb-6">
                  Funds will be transferred to your registered bank account via
                  Razorpay.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    disabled={withdrawProcessing}
                    className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmWithdraw}
                    disabled={withdrawProcessing}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-black font-black text-sm hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {withdrawProcessing ? "Processing..." : "Continue →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
export default FreelancerDashboard;
