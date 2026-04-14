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
  Activity
} from "lucide-react";
import Footer from "../components/Footer";

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
    selectedJobs: 0
  });

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      fetchUserJobs();
      fetchDashboardStats();
    }
  }, [userId]);

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

  const fetchUserJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await api.get(`/api/jobs/user/${userId}`);
      setUserJobs(res.data);
    } catch (err) {
      console.error("Error fetching user jobs:", err);
    }
    setLoadingJobs(false);
  };

  // Stats Data
  const stats = [
    {
      title: "Total Jobs Posted",
      value: dashboardStats.totalJobsPosted.toString().padStart(2, '0'),
      subtitle: "Active Opportunities",
      icon: <Target className="w-6 h-6" />,
      color: "blue",
      btnText: "Post Job",
      onClick: () => navigate("/add-job")
    },
    {
      title: "Active Freelancers",
      value: dashboardStats.activeFreelancers.toString().padStart(2, '0'),
      subtitle: "Ongoing Collaborations",
      icon: <Users className="w-6 h-6" />,
      color: "green"
    },
    {
      title: "Capital Invested",
      value: `₹${(dashboardStats.capitalInvested || 0).toLocaleString()}`,
      subtitle: "All Time",
      icon: <IndianRupee className="w-6 h-6" />,
      color: "yellow"
    },
    {
      title: "Active Proposals",
      value: dashboardStats.activeProposals.toString().padStart(2, '0'),
      subtitle: "Total Applicants",
      icon: <Handshake className="w-6 h-6" />,
      color: "purple",
      btnText: "View All",
      onClick: () => navigate("/jobposting")
    }
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
                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-gray-500 text-[10px] font-black tracking-widest uppercase">Live Engagement</div>
              </div>
              <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 font-medium mb-6 uppercase text-xs tracking-wider">{stat.title}</div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold">{stat.subtitle}</span>
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
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Now</span>
                <span className="text-xl font-black text-blue-400">{dashboardStats.liveJobs.toString().padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Selected Applicants</span>
                <span className="text-xl font-black text-green-400">{dashboardStats.selectedJobs.toString().padStart(2, "0")}</span>
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
            <div className="text-center py-20 text-gray-500">Retrieving job records...</div>
          ) : userJobs.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2rem]">
              <p className="text-gray-500 mb-4">No jobs posted yet.</p>
              <button onClick={() => navigate("/add-job")} className="text-blue-400 font-bold hover:underline">Start your first listing →</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userJobs.map((job) => (
                <div key={job.job_id} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all group overflow-hidden relative">
                  <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black tracking-widest uppercase rounded-bl-2xl ${job.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {job.payment_status === 'paid' ? '● Payment Verified' : '○ Payment Pending'}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{job.job_title}</h3>
                  <div className="flex gap-4 mb-6">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Type: {job.job_type}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Budget: {job.budget_range}</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-black mb-1">Total Bill Paid</span>
                      <span className="text-lg font-black text-white">₹{(job.total_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${job.is_completed ? 'bg-blue-500' : 'bg-green-500 animate-pulse'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {job.is_completed ? 'Job Completed' : 'Active Listing'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              <div className="absolute top-6 right-6 bg-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest z-10">PREMIUM</div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Startup Portals</h3>
                <p className="text-gray-300 text-base mb-10 max-w-md font-light">Deploy specialized business hubs instantly to manage hiring, leads, and vendors.</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {["Hiring & Talent Hub", "CRM Lead Manager", "Support Desk", "Vendor Portal"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white text-sm font-bold bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px] text-yellow-400">✓</div>
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
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Pitch Deck Pro</h3>
                <p className="text-gray-300 text-base mb-10 max-w-sm font-light italic">Generate investor-ready slides and refine your narrative with our proprietary AI engine.</p>
                <div className="mt-auto">
                  <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all hover:scale-[1.03] shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs">
                    LAUNCH DECK BUILDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{
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
      `}} />
    </div>
  );
};

export default StartupDashboard;
