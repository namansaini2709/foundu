import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import {
  Plus,
  Target,
  TrendingUp,
  IndianRupee,
  Users,
  Handshake,
  Zap,
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Layout,
  PieChart,
  Workflow,
  Sparkles,
  Rocket,
  MessageSquare,
  BarChart,
  Lightbulb,
  Search,
  FileCheck,
  ChevronRight,
  Activity,
  Award,
  Shield,
  CheckCircle,
} from "lucide-react";
import Footer from "../components/Footer";
import blueBadge from "../assets/bluebadge.png";
import greenBadge from "../assets/greenbadge.png";
// Move Data Outside Component to prevent recreation
// const FEATURES = [
//   {
//     name: "Founder Compatibility",
//     fullName: "Founder–Founder Compatibility Score",
//     description: "Analyzes mindset, risk tolerance, vision alignment, and working style between you and potential co-founders.",
//     detailedDescription: "Resumes don't build unicorns. Synergistic minds do. Our AI analyzes the 'soul' of your collaboration, identifying potential friction points in decision-making and vision alignment before you sign the paperwork. We simulate years of partnership stress in minutes.",
//     whenToUse: "Before onboarding a co-founder or discussing equity splits.",
//     icon: <BrainCircuit className="w-5 h-5" />,
//     accent: "blue",
//     recommended: true,
//     metrics: ["Vision Alignment: 92%", "Risk Tolerance Sync: 84%", "Communication Style: Fluid"]
//   },
//   {
//     name: "Founder Readiness",
//     fullName: "Founder Readiness Score",
//     description: "Evaluates whether you are prepared to hire, partner, or scale based on clarity and capacity.",
//     detailedDescription: "Are you truly ready to lead? Scaling too early is the #1 startup killer. This score evaluates your operational maturity, personal bandwidth, and execution capacity to ensure you're not building on a shaky foundation.",
//     whenToUse: "Before hiring your first employee or seeking external partners.",
//     icon: <FileCheck className="w-5 h-5" />,
//     accent: "green",
//     metrics: ["Execution Capacity: 78%", "Clarity of Mission: High", "Resource Stability: Mid"]
//   },
//   {
//     name: "Founder Simulator",
//     fullName: "AI Founder Simulator",
//     description: "Simulates co-founder conversations and challenges your decisions like a partner.",
//     detailedDescription: "Practice the hard conversations before they happen. Our AI acts as a seasoned co-founder, questioning your assumptions, challenging your pivot ideas, and preparing you for the reality of high-stakes startup life.",
//     whenToUse: "When validating major decisions or feeling uncertain about a pivot.",
//     icon: <MessageSquare className="w-5 h-5" />,
//     accent: "purple",
//   },
//   {
//     name: "Startup DNA Score",
//     fullName: "Startup DNA Score",
//     description: "Defines your internal execution speed, risk appetite, and style.",
//     detailedDescription: "Every startup has a unique code. Our DNA analysis identifies your team's natural tempo—whether you're a blitzscaling rocket or a calculated, product-first lab. Finding talent that matches this DNA is the secret to 10x growth.",
//     whenToUse: "To find people who truly fit your startup culture.",
//     icon: <Workflow className="w-5 h-5" />,
//     accent: "blue",
//   },
//   {
//     name: "Burn Reality Checker",
//     fullName: "Burn Reality Checker",
//     description: "Analyze burn rate, hiring speed, and runway sustainability with AI.",
//     detailedDescription: "The runway is shorter than you think. Our AI looks beyond your spreadsheet to analyze your actual hiring patterns and execution speed, giving you a realistic 'impact burn' assessment.",
//     whenToUse: "Before making hiring or major vendor decisions.",
//     icon: <TrendingUp className="w-5 h-5" />,
//     accent: "yellow",
//   },
//   {
//     name: "Trial Sprint Gen",
//     fullName: "Trial Sprint Generator",
//     description: "Creates short testing cycles before you commit to long-term hires.",
//     detailedDescription: "Stop guessing. Start testing. This generator creates custom, 2-week performance benchmarks tailored to the role you're hiring, allowing you to see actual output before signing a contract.",
//     whenToUse: "Before finalizing any high-impact hire or partner.",
//     icon: <Zap className="w-5 h-5" />,
//     accent: "orange",
//   },
//   {
//     name: "AI Idea Generator",
//     fullName: "AI Idea Generator & Stress-Tester",
//     description: "Refines and stress-tests your startup idea based on execution feasibility.",
//     detailedDescription: "Ideas are easy; execution is everything. This tool rips your idea apart and helps you rebuild it stronger, identifying market gaps and technical hurdles you might have overlooked.",
//     whenToUse: "During early ideation or when considering a product expansion.",
//     icon: <Lightbulb className="w-5 h-5" />,
//     accent: "blue",
//   },
//   {
//     name: "Role Identification",
//     fullName: '"Who Do You Really Need?" AI',
//     description: "Identifies the exact role or capability your startup needs right now.",
//     detailedDescription: "Don't hire a CTO when you need a Lead Architect. Don't hire a CMO when you need a Growth Hacker. Our AI analyzes your backlog and current velocity to identify the specific gap in your armor.",
//     whenToUse: "When unsure whether to hire, partner, or outsource.",
//     icon: <Target className="w-5 h-5" />,
//     accent: "purple",
//     recommended: true,
//   },
//   {
//     name: "Pitch Deck Templates",
//     fullName: "AI-Recommended Pitch Deck Templates",
//     description: "Deck structures tailored to your startup stage and model.",
//     detailedDescription: "Investors see thousands of decks. We ensure yours hits the exact notes they are looking for, based on successful raises in your specific niche and stage.",
//     whenToUse: "Before investor outreach or major demo days.",
//     icon: <BarChart className="w-5 h-5" />,
//     accent: "blue",
//   },
//   {
//     name: "Talent Recs",
//     fullName: "AI People & Talent Recommendations",
//     description: "AI-curated recommendations based on DNA and execution style.",
//     detailedDescription: "The final step in your journey. We suggest specific individuals from the Foundu network who don't just have the skills, but the exact DNA match for your startup's current trajectory.",
//     whenToUse: "After reviewing insights and setting your readiness scores.",
//     icon: <Search className="w-5 h-5" />,
//     accent: "green",
//   }
// ];
const StartupDashboard = () => {
  const navigate = useNavigate();
  const [userJobs, setUserJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalJobsPosted: 0,
    activeFreelancers: 0,
    capitalInvested: 0,
    activeProposals: 0,
    liveJobs: 0,
    selectedJobs: 0,
  });
  const [badges, setBadges] = useState({
    blue: false,
    green: false,
    loading: true
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      fetchUserJobs(true);
      fetchDashboardStats();
      fetchBadges();

      const intervalId = setInterval(() => {
        fetchUserJobs(false);
        fetchDashboardStats();
        fetchBadges();
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const fetchBadges = async () => {
    try {
      // 1. Check verified status from socials
      const socialRes = await api.get(`/api/user-socials/${userId}`);
      const socialData = socialRes.data.data;
      
      // 2. Check jobs for green badge
      const jobsRes = await api.get(`/api/jobs/user/${userId}`);
      const jobCount = jobsRes.data.length;

      setBadges({
        blue: !!(socialData?.blue_tick_verified),
        green: !!(socialData?.green_tick_verified || jobCount >= 3),
        loading: false
      });
    } catch (err) {
      console.error("Error fetching badges:", err);
      setBadges(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get(`/api/jobs/dashboard-stats/${userId}`);
      if (res.data.success) {
        setDashboardStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchUserJobs = async (showLoading = true) => {
    if (showLoading) setLoadingJobs(true);
    try {
      const res = await api.get(`/api/jobs/user/${userId}`);
      setUserJobs(res.data);
    } catch (err) {
      console.error("Error fetching user jobs:", err);
    }
    if (showLoading) setLoadingJobs(false);
  };

  // Stats Data
  const stats = [
    {
      title: "Total Jobs Posted",
      value: dashboardStats.totalJobsPosted.toString().padStart(2, "0"),
      subtitle: "Active Opportunities",
      icon: <Target className="w-6 h-6" />,
      color: "blue",
      btnText: "Post Job",
      onClick: () => navigate("/add-job"),
    },
    {
      title: "Active Freelancers",
      value: dashboardStats.activeFreelancers.toString().padStart(2, "0"),
      subtitle: "Ongoing Collaborations",
      icon: <Users className="w-6 h-6" />,
      color: "green",
    },
    {
      title: "Capital Invested",
      value: `₹${(dashboardStats.capitalInvested || 0).toLocaleString()}`,
      subtitle: "All Time",
      icon: <IndianRupee className="w-6 h-6" />,
      color: "yellow",
    },
    {
      title: "Active Proposals",
      value: dashboardStats.activeProposals.toString().padStart(2, "0"),
      subtitle: "Total Applicants",
      icon: <Handshake className="w-6 h-6" />,
      color: "purple",
      btnText: "View All",
      onClick: () => navigate("/jobposting"),
    },
  ];

  const getStatBorder = (color) => {
    const map = {
      blue: "border-blue-400/20 hover:border-blue-400/50",
      green: "border-green-400/20 hover:border-green-400/50",
      yellow: "border-yellow-400/20 hover:border-yellow-400/50",
      purple: "border-purple-400/20 hover:border-purple-400/50",
    };
    return map[color] || map.blue;
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-24 md:pt-32 px-4 md:px-6 pb-20 max-w-[1400px] mx-auto overflow-x-hidden">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-white/5 pb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-[0.2em] text-xs mb-4 uppercase">
              <Rocket className="w-4 h-4" />
              Startup Command Center
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter">
              DASHBOARD<span className="text-blue-500">.</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/add-job")}
            className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 group"
          >
            POST NEW JOB
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </header>

        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 ${getStatBorder(stat.color)}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <div className="text-gray-500 text-[10px] font-black tracking-widest uppercase">
                  Live Engagement
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 font-medium mb-6 uppercase text-xs tracking-wider">
                {stat.title}
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold">
                  {stat.subtitle}
                </span>
                {stat.btnText && (
                  <button
                    onClick={stat.onClick}
                    className="text-blue-400 text-xs font-black flex items-center gap-1 hover:text-blue-300 transition-colors"
                  >
                    {stat.btnText} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── NEW: MY JOB LISTINGS ── */}
        <section className="mb-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
              My Job Listings
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Live Now
                </span>
                <span className="text-xl font-black text-blue-400">
                  {dashboardStats.liveJobs.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Selected Applicants
                </span>
                <span className="text-xl font-black text-green-400">
                  {dashboardStats.selectedJobs.toString().padStart(2, "0")}
                </span>
              </div>
              <button
                onClick={() => navigate("/jobposting")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Job Portal
              </button>
            </div>
          </div>

          {loadingJobs ? (
            <div className="text-center py-20 text-gray-500">
              Retrieving job records...
            </div>
          ) : userJobs.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2rem]">
              <p className="text-gray-500 mb-4">No jobs posted yet.</p>
              <button
                onClick={() => navigate("/add-job")}
                className="text-blue-400 font-bold hover:underline"
              >
                Start your first listing →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userJobs.map((job) => (
                <div
                  key={job.job_id}
                  className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all group overflow-hidden relative"
                >
                  <div
                    className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black tracking-widest uppercase rounded-bl-2xl ${
                      job.payment_status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {job.payment_status === "paid"
                      ? "● Payment Verified"
                      : "○ Payment Pending"}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {job.job_title}
                  </h3>
                  <div className="flex gap-4 mb-6">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                      Type: {job.job_type}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                      Budget: {job.budget_range}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-black mb-1">
                        Total Bill Paid
                      </span>
                      <span className="text-lg font-black text-white">
                        ₹{(job.total_amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${job.is_completed ? "bg-blue-500" : "bg-green-500 animate-pulse"}`}
                      ></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {job.is_completed ? "Job Completed" : "Active Listing"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* ── NEW: YOUR BADGES ── */}
        <section className="mb-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <Award className="w-8 h-8 text-blue-400 group-hover:rotate-12 transition-transform" />
              Your Badges
            </h2>
            <button 
              onClick={() => navigate('/founder-badges')}
              className="px-6 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-blue-400"
            >
              Manage Badges
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blue Tick Badge */}
            <div className={`relative overflow-hidden bg-white/5 border rounded-3xl p-6 transition-all duration-300 ${badges.blue ? 'border-blue-500/30' : 'border-white/5 opacity-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${badges.blue ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-gray-800 border-gray-700'}`}>
                  <img src={blueBadge} alt="Blue Badge" className={`w-12 h-12 object-contain ${!badges.blue && 'grayscale opacity-40'}`} />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tight">Verification</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {badges.blue ? 'Verified Founder' : 'Not Verified'}
                  </p>
                </div>
              </div>
              {badges.blue && <div className="absolute top-4 right-4"><CheckCircle className="w-4 h-4 text-blue-400" /></div>}
            </div>

            {/* Green Tick Badge */}
            <div className={`relative overflow-hidden bg-white/5 border rounded-3xl p-6 transition-all duration-300 ${badges.green ? 'border-green-500/30' : 'border-white/5 opacity-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${badges.green ? 'bg-green-500/20 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-gray-800 border-gray-700'}`}>
                  <img src={greenBadge} alt="Green Badge" className={`w-12 h-12 object-contain ${!badges.green && 'grayscale opacity-40'}`} />
                </div>
                <div>
                  <h3 className="font-black text-white uppercase tracking-tight">Active Recruiter</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {badges.green ? 'Certified Recruiter' : 'Unlock at 3 Jobs'}
                  </p>
                </div>
              </div>
              {badges.green && <div className="absolute top-4 right-4"><CheckCircle className="w-4 h-4 text-green-400" /></div>}
            </div>

            {/* Placeholder for more badges */}
            <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-6 flex items-center justify-center group cursor-pointer hover:bg-white/[0.08] transition-all" onClick={() => navigate('/founder-badges')}>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Earn More Badges</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW: FOUNDER ADD-ONS ── */}
        <section className="mt-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <Rocket className="w-8 h-8 text-blue-500 animate-bounce" />
              Founder Add-ons
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Startup Portals / Next Actions */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-6 right-6 bg-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest z-10">
                PREMIUM
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Startup Portals
                </h3>
                <p className="text-gray-300 text-base mb-10 max-w-md font-light">
                  Deploy specialized business hubs instantly to manage hiring,
                  leads, and vendors.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {[
                    "Hiring & Talent Hub",
                    "CRM Lead Manager",
                    "Support Desk",
                    "Vendor Portal",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-white text-sm font-bold bg-white/5 p-3 rounded-xl border border-white/5"
                    >
                      <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px] text-yellow-400">
                        ✓
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="px-10 py-5 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-2xl transition-all hover:scale-[1.03] shadow-xl shadow-yellow-600/20 uppercase tracking-widest text-xs">
                  VIEW ACTION PORTALS
                </button>
              </div>
            </div>

            {/* Pitch Deck Pro */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-2 border-blue-500/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 w-fit mb-6">
                  <BarChart className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Pitch Deck Pro
                </h3>
                <p className="text-gray-300 text-base mb-10 max-w-sm font-light italic">
                  Generate investor-ready slides and refine your narrative with
                  our proprietary AI engine.
                </p>
                <div className="mt-auto">
                  <button 
                    onClick={() => navigate('/buy-pitch-deck')}
                    className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all hover:scale-[1.03] shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
                  >
                    LAUNCH DECK BUILDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        body {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `,
        }}
      />
    </div>
  );
};

export default StartupDashboard;
