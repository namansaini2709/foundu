import { useState, useEffect } from "react";
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
// Move Data Outside Component to prevent recreation
const FEATURES = [
  {
    name: "Founder Compatibility",
    fullName: "Founder–Founder Compatibility Score",
    description: "Analyzes mindset, risk tolerance, vision alignment, and working style between you and potential co-founders.",
    detailedDescription: "Resumes don't build unicorns. Synergistic minds do. Our AI analyzes the 'soul' of your collaboration, identifying potential friction points in decision-making and vision alignment before you sign the paperwork. We simulate years of partnership stress in minutes.",
    whenToUse: "Before onboarding a co-founder or discussing equity splits.",
    icon: <BrainCircuit className="w-5 h-5" />,
    accent: "blue",
    recommended: true,
    metrics: ["Vision Alignment: 92%", "Risk Tolerance Sync: 84%", "Communication Style: Fluid"]
  },
  {
    name: "Founder Readiness",
    fullName: "Founder Readiness Score",
    description: "Evaluates whether you are prepared to hire, partner, or scale based on clarity and capacity.",
    detailedDescription: "Are you truly ready to lead? Scaling too early is the #1 startup killer. This score evaluates your operational maturity, personal bandwidth, and execution capacity to ensure you're not building on a shaky foundation.",
    whenToUse: "Before hiring your first employee or seeking external partners.",
    icon: <FileCheck className="w-5 h-5" />,
    accent: "green",
    metrics: ["Execution Capacity: 78%", "Clarity of Mission: High", "Resource Stability: Mid"]
  },
  {
    name: "Founder Simulator",
    fullName: "AI Founder Simulator",
    description: "Simulates co-founder conversations and challenges your decisions like a partner.",
    detailedDescription: "Practice the hard conversations before they happen. Our AI acts as a seasoned co-founder, questioning your assumptions, challenging your pivot ideas, and preparing you for the reality of high-stakes startup life.",
    whenToUse: "When validating major decisions or feeling uncertain about a pivot.",
    icon: <MessageSquare className="w-5 h-5" />,
    accent: "purple",
  },
  {
    name: "Startup DNA Score",
    fullName: "Startup DNA Score",
    description: "Defines your internal execution speed, risk appetite, and style.",
    detailedDescription: "Every startup has a unique code. Our DNA analysis identifies your team's natural tempo—whether you're a blitzscaling rocket or a calculated, product-first lab. Finding talent that matches this DNA is the secret to 10x growth.",
    whenToUse: "To find people who truly fit your startup culture.",
    icon: <Workflow className="w-5 h-5" />,
    accent: "blue",
  },
  {
    name: "Burn Reality Checker",
    fullName: "Burn Reality Checker",
    description: "Analyze burn rate, hiring speed, and runway sustainability with AI.",
    detailedDescription: "The runway is shorter than you think. Our AI looks beyond your spreadsheet to analyze your actual hiring patterns and execution speed, giving you a realistic 'impact burn' assessment.",
    whenToUse: "Before making hiring or major vendor decisions.",
    icon: <TrendingUp className="w-5 h-5" />,
    accent: "yellow",
  },
  {
    name: "Trial Sprint Gen",
    fullName: "Trial Sprint Generator",
    description: "Creates short testing cycles before you commit to long-term hires.",
    detailedDescription: "Stop guessing. Start testing. This generator creates custom, 2-week performance benchmarks tailored to the role you're hiring, allowing you to see actual output before signing a contract.",
    whenToUse: "Before finalizing any high-impact hire or partner.",
    icon: <Zap className="w-5 h-5" />,
    accent: "orange",
  },
  {
    name: "AI Idea Generator",
    fullName: "AI Idea Generator & Stress-Tester",
    description: "Refines and stress-tests your startup idea based on execution feasibility.",
    detailedDescription: "Ideas are easy; execution is everything. This tool rips your idea apart and helps you rebuild it stronger, identifying market gaps and technical hurdles you might have overlooked.",
    whenToUse: "During early ideation or when considering a product expansion.",
    icon: <Lightbulb className="w-5 h-5" />,
    accent: "blue",
  },
  {
    name: "Role Identification",
    fullName: '"Who Do You Really Need?" AI',
    description: "Identifies the exact role or capability your startup needs right now.",
    detailedDescription: "Don't hire a CTO when you need a Lead Architect. Don't hire a CMO when you need a Growth Hacker. Our AI analyzes your backlog and current velocity to identify the specific gap in your armor.",
    whenToUse: "When unsure whether to hire, partner, or outsource.",
    icon: <Target className="w-5 h-5" />,
    accent: "purple",
    recommended: true,
  },
  {
    name: "Pitch Deck Templates",
    fullName: "AI-Recommended Pitch Deck Templates",
    description: "Deck structures tailored to your startup stage and model.",
    detailedDescription: "Investors see thousands of decks. We ensure yours hits the exact notes they are looking for, based on successful raises in your specific niche and stage.",
    whenToUse: "Before investor outreach or major demo days.",
    icon: <BarChart className="w-5 h-5" />,
    accent: "blue",
  },
  {
    name: "Talent Recs",
    fullName: "AI People & Talent Recommendations",
    description: "AI-curated recommendations based on DNA and execution style.",
    detailedDescription: "The final step in your journey. We suggest specific individuals from the Foundu network who don't just have the skills, but the exact DNA match for your startup's current trajectory.",
    whenToUse: "After reviewing insights and setting your readiness scores.",
    icon: <Search className="w-5 h-5" />,
    accent: "green",
  }
];
const StartupDashboard = () => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [userJobs, setUserJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      fetchUserJobs();
    }
  }, [userId]);

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
      value: userJobs.length.toString().padStart(2, '0'),
      subtitle: "Active Opportunities",
      icon: <Target className="w-6 h-6" />,
      color: "blue",
      btnText: "Post Job"
    },
    {
      title: "Active Freelancers",
      value: "05", // Placeholder or fetch real matches
      subtitle: "Ongoing Collaborations",
      icon: <Users className="w-6 h-6" />,
      color: "green"
    },
    {
      title: "Capital Invested",
      value: `₹${userJobs.reduce((acc, job) => acc + (job.total_amount || 0), 0).toLocaleString()}`,
      subtitle: "All Time",
      icon: <IndianRupee className="w-6 h-6" />,
      color: "yellow"
    },
    {
      title: "Active Proposals",
      value: "15",
      subtitle: "New Applications",
      icon: <Handshake className="w-6 h-6" />,
      color: "purple",
      btnText: "View All"
    }
  ];
  // Helper for accent classes to avoid Tailwind purge
  const getAccentColor = (accent) => {
    const map = {
      blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      green: "text-green-400 border-green-500/20 bg-green-500/10",
      purple: "text-purple-400 border-purple-500/20 bg-purple-500/10",
      indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
      yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
      orange: "text-orange-400 border-orange-500/20 bg-orange-500/10",
    };
    return map[accent] || map.blue;
  };
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
          <button className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 group">
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
                  <button className="text-blue-400 text-xs font-black flex items-center gap-1 hover:text-blue-300 transition-colors">
                    {stat.btnText} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── NEW: MY JOB LISTINGS ── */}
        <section className="mb-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
              My Job Listings
            </h2>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {userJobs.length} Positions Active
            </div>
          </div>

          {loadingJobs ? (
            <div className="text-center py-20 text-gray-500">Retrieving job records...</div>
          ) : userJobs.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2rem]">
              <p className="text-gray-500 mb-4">No jobs posted yet.</p>
              <button className="text-blue-400 font-bold hover:underline">Start your first listing →</button>
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
        {/* Main Content Layout */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* LEFT SIDEBAR - Features List */}
          <aside className="xl:w-1/5">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden sticky top-32">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-white font-black text-xs tracking-widest uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  AI Intelligence
                </h3>
              </div>
              <div className="p-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {FEATURES.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeatureIndex(index)}
                    className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] transition-all duration-300 group mb-2 ${activeFeatureIndex === index
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-[1.02]'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <div className={`p-2.5 rounded-xl ${activeFeatureIndex === index ? 'bg-white/20' : 'bg-white/5'}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-grow text-left">
                      <div className="text-sm font-black truncate">{feature.name}</div>
                      {feature.recommended && (
                        <div className={`text-[8px] font-black uppercase tracking-tighter ${activeFeatureIndex === index ? 'text-blue-100' : 'text-blue-400'}`}>
                          Top Recommended
                        </div>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all ${activeFeatureIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </button>
                ))}
              </div>
            </div>
          </aside>
          {/* CENTER - Feature Analysis View */}
          <div className="xl:w-[55%]">
            {FEATURES[activeFeatureIndex] && (
              <section className="min-h-[700px] flex flex-col bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden relative group">
                {/* Decorative bar */}
                <div className="h-3 w-full flex">
                  <div className="bg-blue-500 w-1/3"></div>
                  <div className="bg-indigo-500/50 w-1/3"></div>
                  <div className="bg-purple-500/20 w-1/3"></div>
                </div>
                <div className="p-6 md:p-12 flex-grow flex flex-col">
                  {/* Analysis Info */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-16">
                    <div className="flex-grow">
                      <div className="flex items-center gap-6 mb-8">
                        <div className={`p-6 rounded-[2rem] border-2 shadow-2xl transition-transform group-hover:scale-110 ${getAccentColor(FEATURES[activeFeatureIndex].accent)}`}>
                          {FEATURES[activeFeatureIndex].icon}
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3">
                            {FEATURES[activeFeatureIndex].fullName}
                          </h2>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-blue-400 text-[10px] font-black tracking-widest uppercase">Deep Neural Engine active</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed border-l-4 border-blue-500/30 pl-6 md:pl-10">
                        {FEATURES[activeFeatureIndex].detailedDescription}
                      </p>
                    </div>
                    <div className="w-full md:w-72 space-y-6">
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
                        <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase block mb-3">Analysis Precision</span>
                        <div className="text-5xl font-black text-white">96%</div>
                      </div>
                      {FEATURES[activeFeatureIndex].recommended && (
                        <div className="bg-blue-600 rounded-3xl p-8 text-center shadow-2xl shadow-blue-600/20">
                          <span className="text-blue-100 text-[10px] font-black tracking-widest uppercase block mb-3">Priority Action</span>
                          <div className="text-white text-sm font-black italic">Strategic High Impact</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                      <h4 className="text-white font-black text-lg mb-8 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-blue-400" />
                        KEY INSIGHTS
                      </h4>
                      <div className="space-y-6">
                        {(FEATURES[activeFeatureIndex].metrics || ["Strategic Growth: +24%", "Market Penetration: High", "Execution Risk: Minimal"]).map((m, i) => (
                          <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                            <span className="text-gray-400 font-light">{m.split(':')[0]}</span>
                            <span className="text-white font-black">{m.split(':')[1] || "Analyzed"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                      <h4 className="text-indigo-400 font-black text-lg mb-8 flex items-center gap-3">
                        <Handshake className="w-6 h-6" />
                        OPPORTUNITY WINDOW
                      </h4>
                      <p className="text-gray-300 text-lg leading-relaxed mb-auto border-l-2 border-indigo-500/20 pl-6 italic font-light">
                        {FEATURES[activeFeatureIndex].whenToUse}
                      </p>
                    </div>
                  </div>
                  <button className="mt-auto relative w-full py-10 bg-blue-600 hover:bg-blue-500 transition-all rounded-[2.5rem] overflow-hidden group/btn shadow-2xl shadow-blue-700/40">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 md:gap-6 px-4">
                      <span className="text-lg md:text-2xl font-black tracking-tight text-white uppercase text-center">Initialize Deep Analysis Center</span>
                      <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-4 transition-transform" />
                    </div>
                  </button>
                </div>
              </section>
            )}
          </div>
          {/* RIGHT PANEL - Portals & Deck */}
          <aside className="xl:w-1/4">
            <div className="space-y-8">
              {/* Ready Portals */}
              <div className="bg-gray-800/40 backdrop-blur-xl border border-blue-700/50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tighter uppercase">Next Actions</h2>
                <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 rounded-3xl p-8 mb-8 relative overflow-hidden group/p">
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest">PREMIUM</div>
                  <h3 className="text-2xl font-black text-white mb-3">Startup Portals</h3>
                  <p className="text-gray-300 text-sm mb-8 leading-relaxed font-light">Deploy pre-built specialized business hubs instantly.</p>
                  <ul className="space-y-4 mb-10">
                    {["Hiring & Talent Hub", "CRM Lead Manager", "Support Desk", "Vendor Portal"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
                        <div className="w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px] text-yellow-400">✓</div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-5 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-2xl transition-all hover:scale-[1.03]">
                    VIEW PORTALS
                  </button>
                </div>
                <div className="bg-gray-700/30 border border-blue-700/20 rounded-3xl p-8">
                  <h4 className="text-white font-black mb-2 text-lg">Pitch Deck Pro</h4>
                  <p className="text-gray-500 text-xs mb-6 italic">Generate investor-ready slides with AI.</p>
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs tracking-widest uppercase transition-all">
                    LAUNCH BUILDER
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
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
