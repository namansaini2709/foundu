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
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function StartupServices() {
  const navigate = useNavigate();

  // First Section - Foundu Startup Dashboard
  const DashboardIntro = () => (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center justify-center">
          <div className="w-64 h-64 md:w-[500px] md:h-[500px] flex-shrink-0">
            <DotLottieReact
              src="https://lottie.host/7bbfa179-0d03-432c-b7fb-a3c77fc36581/JE6p5TAlXV.lottie"
              loop
              autoplay
            />
          </div>
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-blue-400 font-black tracking-[0.2em] text-[10px] mb-6 uppercase">
              <LayoutDashboard className="w-4 h-4" />
              Foundu Intelligence
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white uppercase italic">
              Startup{" "}
              <span className="text-blue-500 not-italic">Dashboard.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-6 font-medium leading-relaxed">
              Your AI-powered command center for startup intelligence. Get
              real-time insights, AI-driven recommendations, and actionable
              analytics to make informed decisions about hiring, partnerships,
              and scaling.
            </p>
            <p className="text-gray-400 text-lg mb-10 font-medium leading-relaxed">
              Track your startup's health, discover compatible co-founders, and
              execute with confidence using our comprehensive dashboard.
            </p>
            <button
              onClick={() => navigate("/startup-dashboard")}
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-widest uppercase rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-600/25 flex items-center gap-3 group"
            >
              Access Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
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
        description:
          "Instantly launch with ready-to-use business portals including Hiring & Talent, CRM, Helpdesk, Vendor Management, and more.",
        features: [
          "Hiring & Talent Portal",
          "CRM System",
          "Helpdesk Support",
          "Vendor Management",
          "Project Tracking",
        ],
        color: "yellow",
        btn: "View Portals",
      },
      {
        icon: <FileEdit className="w-8 h-8 text-blue-500" />,
        title: "Manual Jobs",
        description:
          "Create and manage job posts manually without AI assistance. Full control over your hiring process.",
        features: [
          "Custom Job Templates",
          "Applicant Screening",
          "Interview Scheduling",
          "Offer Management",
          "Onboarding Tools",
        ],
        color: "blue",
        btn: "Post a Job",
      },
      {
        icon: <Bot className="w-8 h-8 text-green-500" />,
        title: "AI Insights",
        description:
          "Advanced AI-powered analytics and recommendations to guide your startup decisions.",
        features: [
          "Founder-Founder Compatibility Score",
          "Founder Readiness Score",
          "Startup DNA Analysis",
          "Burn Reality Checker",
          "AI Founder Simulator",
        ],
        color: "green",
        btn: "Explore AI",
      },
      {
        icon: <BarChart3 className="w-8 h-8 text-purple-500" />,
        title: "Pitch Decks",
        description:
          "Create professional pitch decks using AI-recommended templates tailored to your startup stage and business model.",
        features: [
          "AI Template Selection",
          "Content Auto-Generation",
          "Visual Design Optimization",
          "Investor Insights",
          "Export & Sharing",
        ],
        color: "purple",
        btn: "Generate Deck",
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
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest max-w-[200px] leading-relaxed">
              Proprietary tools engineered for high-velocity execution.
            </p>
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
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                      i <= activeStep
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
                className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                  index === activeStep
                    ? "bg-white/10 border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/10"
                    : "bg-white/5 border-white/5 opacity-50 grayscale"
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${
                    index === activeStep
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

  return (
    <div className="min-h-screen bg-[#020024] selection:bg-blue-500/30">
      <DashboardIntro />
      <OurMVPs />
      <MatchingSteps />
      <WhyTrustFoundu />
      <Footer />
    </div>
  );
}
