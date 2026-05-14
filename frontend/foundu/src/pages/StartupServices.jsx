import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Rocket,
  ShoppingCart,
  FileEdit,
  Bot,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  LineChart,
  Users,
  Lightbulb,
  LayoutDashboard,
  PlusSquare,
  Sparkles,
  Brain,
  Cpu,
  Megaphone,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function StartupServices() {
  const navigate = useNavigate();

  // First Section - Foundu Startup Dashboard
  const DashboardIntro = () => (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center justify-center">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] -z-10"></div>

      <div className="max-w-4xl mx-auto w-full text-center relative z-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-blue-400 font-black tracking-[0.3em] text-[10px] md:text-xs mb-8 uppercase">
            <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
            Foundu Intelligence
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-10 leading-[0.85] tracking-tighter text-white uppercase italic">
            Everything For{" "}
            <span className="text-blue-500 not-italic block md:inline mt-2 md:mt-0">Founders.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl mb-8 font-medium leading-relaxed max-w-2xl mx-auto">
            Your AI-powered command center for startup intelligence. Get
            real-time insights, AI-driven recommendations, and actionable
            analytics to make informed decisions about hiring, partnerships,
            and scaling.
          </p>
          <p className="text-gray-500 text-sm md:text-lg mb-12 font-medium leading-relaxed max-w-xl mx-auto">
            Track your startup's health, discover compatible co-founders, and
            execute with confidence using our comprehensive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <button
              onClick={() => navigate("/startup-dashboard")}
              className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-widest uppercase rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 group"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Marketplaces Section
  const Marketplaces = () => (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-blue-400 font-black tracking-[0.2em] text-[10px] mb-4 uppercase">
            Ecosystem Hubs
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-6">
            The <span className="text-blue-500 not-italic">Marketplaces.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Influencer Marketplace Card */}
          <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 hover:border-pink-500/50 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Users className="w-64 h-64 text-pink-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Influencer Marketplace</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                Connect with verified creators and influencers to scale your brand reach instantly.
              </p>
              <button
                onClick={() => navigate("/influencer-marketplace")}
                className="px-10 py-5 bg-pink-600 hover:bg-pink-500 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-pink-600/30 flex items-center gap-3 group"
              >
                Access Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Event Marketplace Card */}
          <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <Megaphone className="w-64 h-64 text-purple-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Megaphone className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Event Marketplace</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                Discover and promote high-impact startup events across the entire ecosystem.
              </p>
              <button
                onClick={() => navigate("/event-marketplace")}
                className="px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-xl shadow-purple-600/30 flex items-center gap-3 group"
              >
                Access Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Second Section - Our MVPs
  const OurMVPs = () => {
    const categories = [
      {
        icon: <ShoppingCart className="w-8 h-8 text-yellow-500" />,
        title: "Buy Portals",
        tag: "PREMIUM",
        description: "Instantly launch with ready-to-use business portals including Hiring & Talent, CRM, Helpdesk, Vendor Management, and more.",
        features: ["Hiring & Talent Portal", "CRM System", "Helpdesk Support", "Vendor Management", "Project Tracking"],
        color: "yellow",
        btn: "View Portals",
        onClick: () => navigate("/startup-portals")
      },
      {
        icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
        title: "Pitch Decks",
        description: "Create professional pitch decks using AI-recommended templates tailored to your startup stage and business model.",
        features: ["AI Template Selection", "Content Auto-Generation", "Visual Design Optimization", "Investor Insights", "Export & Sharing"],
        color: "blue",
        btn: "Generate Deck",
        onClick: () => navigate("/buy-pitch-deck")
      },
      {
        icon: <Bot className="w-8 h-8 text-green-500" />,
        title: "Website & App Builder",
        description: "Build custom web and mobile solutions with our elite engineering team to scale your product.",
        features: ["Custom UI/UX Design", "Scalable Architecture", "API Integration", "Mobile & Web Apps", "Post-Launch Support"],
        color: "green",
        btn: "Start Building",
        onClick: () => navigate("/web-development")
      },
      {
        icon: <PlusSquare className="w-8 h-8 text-purple-500" />,
        title: "Add Job",
        description: "Create and manage job posts manually or with AI assistance. Full control over your hiring process.",
        features: ["Custom Job Templates", "Applicant Screening", "Interview Scheduling", "Offer Management", "Onboarding Tools"],
        color: "purple",
        btn: "Post a Job",
        onClick: () => navigate("/add-job")
      },
      {
        icon: <Megaphone className="w-8 h-8 text-pink-500" />,
        title: "Event Promotion",
        tag: "NEW",
        description: "Massive marketing engine for your events. Reach thousands via live feed, notifications, email, and WhatsApp.",
        features: ["Live Feed Promotion", "Global Site Alerts", "AI Email Blasts", "Direct WhatsApp", "Event Partnership"],
        color: "pink",
        btn: "Promote Now",
        onClick: () => navigate("/promote-event")
      },
    ];

    return (
      <section className="py-24 px-6 relative">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
            <div>
              <div className="text-blue-400 font-black tracking-[0.2em] text-[10px] mb-4 uppercase">
                Operational Assets
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
                Our <span className="text-blue-500 not-italic">MVPs.</span>
              </h2>
            </div>
            {/* <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest max-w-[200px] leading-relaxed">
              Proprietary tools engineered for high-velocity execution.
            </p> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 hover:border-${cat.color}-500/50 transition-all duration-500`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={`p-5 rounded-3xl bg-${cat.color}-500/10 border border-${cat.color}-500/20 group-hover:scale-110 transition-transform duration-500`}
                  >
                    {cat.icon}
                  </div>
                  {cat.tag && (
                    <span className="bg-yellow-500 text-black text-[9px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full">
                      {cat.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
                  {cat.title}
                </h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                  {cat.description}
                </p>

                <div className="grid grid-cols-1 gap-4 mb-10">
                  {cat.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${cat.color}-500`}
                      ></div>
                      <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={cat.onClick}
                  className={`w-full py-5 rounded-2xl bg-${cat.color}-500/10 hover:bg-${cat.color}-500 border border-${cat.color}-500/20 hover:border-${cat.color}-500 text-${cat.color}-500 hover:text-white font-black text-[10px] tracking-widest uppercase transition-all duration-300`}
                >
                  {cat.btn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Third Section - 4 Simple Steps of Matching
  const MatchingSteps = () => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
      {
        number: "01",
        title: "Create Profile",
        description: "Build your startup profile with vision, needs, and goals",
        icon: <Users className="w-5 h-5" />,
      },
      {
        number: "02",
        title: "AI Analysis",
        description: "Get AI-powered compatibility and readiness scores",
        icon: <Zap className="w-5 h-5" />,
      },
      {
        number: "03",
        title: "Get Matches",
        description:
          "Receive curated recommendations for freelancers and co-founders",
        icon: <CheckCircle2 className="w-5 h-5" />,
      },
      {
        number: "04",
        title: "Connect & Execute",
        description: "Connect with matches and start building your dream team",
        icon: <Rocket className="w-5 h-5" />,
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 4000);
      return () => clearInterval(interval);
    }, []);

    return (
      <section className="py-24 px-6 relative bg-white/2 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -skew-y-3 transform origin-right"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="text-blue-400 font-black tracking-[0.2em] text-[10px] mb-4 uppercase">
              Success Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-8">
              4 Steps of{" "}
              <span className="text-blue-500 not-italic">Matching.</span>
            </h2>

            {/* Progression Line */}
            <div className="hidden lg:block relative max-w-4xl mx-auto mt-16 mb-24">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-blue-600 to-indigo-600 -translate-y-1/2 transition-all duration-1000 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
              <div className="flex justify-between items-center relative">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${i <= activeStep
                        ? "bg-blue-600 border-blue-500 scale-125 shadow-lg shadow-blue-500/20"
                        : "bg-gray-900 border-white/10"
                      }`}
                  >
                    <div className="text-[10px] font-black">
                      {steps[i].number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 ${index === activeStep
                    ? "bg-white/10 border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/10"
                    : "bg-white/5 border-white/5 opacity-50 grayscale"
                  }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${index === activeStep
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-500"
                    }`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tighter uppercase">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs font-bold leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Fourth Section - Why Users Trust Foundu
  const WhyTrustFoundu = () => {
    const trustPoints = [
      {
        icon: <Zap className="w-8 h-8 text-blue-500" />,
        title: "AI-Powered Matching",
        description:
          "Advanced algorithms ensure compatibility and success rates",
      },
      {
        icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
        title: "Secure & Trusted",
        description:
          "Verified profiles and secure transactions for peace of mind",
      },
      {
        icon: <Star className="w-8 h-8 text-blue-400" />,
        title: "Fast Execution",
        description:
          "Get matched and start collaborating within days, not months",
      },
      {
        icon: <LineChart className="w-8 h-8 text-indigo-400" />,
        title: "Proven Results",
        description: "1500+ successful startups trust Foundu for their growth",
      },
      {
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: "Expert Support",
        description: "Dedicated team to help you navigate your startup journey",
      },
      {
        icon: <Lightbulb className="w-8 h-8 text-indigo-600" />,
        title: "Innovation First",
        description: "Cutting-edge AI and tools designed for modern startups",
      },
    ];

    return (
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-blue-400 font-black tracking-[0.2em] text-[10px] mb-4 uppercase">
              Verification & Reliability
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-6">
              Why Trust{" "}
              <span className="text-blue-500 not-italic">Foundu.</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
              Join thousands of startups that rely on Foundu for intelligent
              matching and growth acceleration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                  {point.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tighter uppercase">
                  {point.title}
                </h3>
                <p className="text-gray-400 text-xs font-bold leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // New Section - AI Ecosystem
  const AIEcosystem = () => {
    const ais = [
      {
        name: "G.E.N.I.E AI",
        tagline: "THE MASTER MATCHER",
        description: "Our core AI engine that powers the ecosystem. It analyzes credibility scores and badge verifications to find the perfect match for Founders, Co-founders, and Freelancers alike.",
        help: "How it helps: Ensures you only connect with high-quality, verified talent that matches your specific startup culture and technical requirements.",
        color: "cyan",
        icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
        locationDesc: "Located in your Dashboard under 'AI Recommendations'.",
        tags: ["MATCHING", "VERIFICATION", "INSIGHTS"]
      },
      {
        name: "F.R.I.D.A.Y AI",
        tagline: "INCUBATION ON AUTOPILOT",
        description: "Pitch your raw startup concepts and watch our AI polish them into viable business models. Generates detailed roadmaps and milestones for Founders and Co-founders.",
        help: "How it helps: Turns abstract ideas into structured execution plans. It helps you prioritize tasks and visualize your startup journey from MVP to scale.",
        color: "pink",
        icon: <Brain className="w-8 h-8 text-pink-400" />,
        locationDesc: "Located in the 'Idea Lab' section of your navigation bar.",
        tags: ["STRATEGY", "INCUBATION", "ROADMAPS"]
      },
      {
        name: "J.D AI",
        tagline: "HIRE IN 60 SECONDS",
        description: "Just provide a budget and a one-liner about your needs. Our AI instantly drafts a professional JD and publishes it across the network. Built for rapid scaling.",
        help: "How it helps: Saves hours of tedious writing. It creates SEO-optimized job descriptions that attract the right talent instantly.",
        color: "green",
        icon: <Cpu className="w-8 h-8 text-green-400" />,
        locationDesc: "Located in the 'Post a Job' page when you toggle 'AI Assist'.",
        tags: ["JD GENERATION", "FAST HIRE", "EFFICIENCY"]
      }
    ];

    return (
      <section className="py-24 px-6 relative bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="text-blue-400 font-black tracking-[0.2em] text-[10px] mb-4 uppercase">
              The Intelligence Layer
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic mb-8">
              Founder <span className="text-blue-500 not-italic">AI Ecosystem.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {ais.map((ai, i) => (
              <div key={i} className="group relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col hover:border-blue-500/30 transition-all duration-500">
                <div className={`w-20 h-20 rounded-2xl bg-${ai.color}-400/10 border border-${ai.color}-400/20 flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform duration-500`}>
                  {ai.icon}
                </div>

                <h3 className="text-3xl font-black text-white text-center mb-1 tracking-tighter uppercase">
                  {ai.name}
                </h3>
                <div className={`text-${ai.color}-400 font-black tracking-[0.2em] text-[10px] mb-8 text-center uppercase`}>
                  {ai.tagline}
                </div>

                <p className="text-gray-400 text-sm font-medium leading-relaxed text-center mb-6">
                  {ai.description}
                </p>

                <p className="text-blue-300 text-xs font-bold leading-relaxed text-center mb-8 border-t border-white/5 pt-6">
                  {ai.help}
                </p>

                {/* Action Section - Centered */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                    {i === 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="w-40 h-40 flex items-center justify-center">
                          <DotLottieReact
                            src="https://lottie.host/7d07affa-7420-4fa7-b118-0834ce127b1b/M1WQe2EcHa.lottie"
                            loop
                            autoplay
                          />
                        </div>
                        <div className="px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-lg mt-2">
                          <span className="text-[8px] text-red-400 font-black uppercase tracking-widest animate-pulse">
                            Caution: This is in the right bottom of our page
                          </span>
                        </div>
                      </div>
                    ) : i === 1 ? (
                      <div className="w-full">
                        <button 
                          onClick={() => navigate("/idea-lab")}
                          className="w-full py-4 bg-pink-500 hover:bg-pink-400 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-lg shadow-pink-500/20 transform hover:scale-105"
                        >
                          Open Idea Lab
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button 
                          onClick={() => navigate("/add-job")}
                          className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black text-[10px] tracking-widest uppercase rounded-2xl transition-all shadow-lg shadow-green-500/20 transform hover:scale-105"
                        >
                          Create JD Now
                        </button>
                      </div>
                    )}
                  <p className="text-[10px] text-gray-500 text-center font-black uppercase tracking-widest italic mt-4">
                    {ai.locationDesc}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {ai.tags.map((tag, idx) => (
                    <span key={idx} className="bg-white/5 text-gray-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#020024] selection:bg-blue-500/30">
      <DashboardIntro />
      <AIEcosystem />
      <Marketplaces />
      <OurMVPs />
      <MatchingSteps />
      <WhyTrustFoundu />
      <Footer />
    </div>
  );
}
