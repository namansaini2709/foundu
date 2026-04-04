import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Rocket, Search, Users, Handshake, Sparkles, Target, Zap, ArrowRight, Lightbulb, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ConsentBanner from "../components/ConsentBanner";
// Gradient styles - alternating
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
const gradientBlueToBlack = {
  background:
    "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};

const API_BASE = "http://localhost:4000/api";

function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);
  const [publicStats, setPublicStats] = useState({ freelancers: 0, founders: 0, cofounders: 0, totalJobs: 0 });
  const [startups, setStartups] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);

  // Fetch public stats and startup profiles
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-back'
    });

    fetch(`${API_BASE}/public-stats`)
      .then(res => res.json())
      .then(data => { if (data.success) setPublicStats(data.stats); })
      .catch(err => console.error("Stats fetch error:", err));

    fetch(`${API_BASE}/startup-profiles`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStartups(data); })
      .catch(err => console.error("Startups fetch error:", err));

    fetch(`${API_BASE}/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.testimonials.length > 0) {
          setTestimonialsList(data.testimonials);
        }
      })
      .catch(err => console.error("Testimonials fetch error:", err));
  }, []);

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowNavbar(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero navigate={navigate} />
      <WhatIsFoundu navigate={navigate} />
      <FoundUAIs />
      <UsersWeCater navigate={navigate} />
      <CategorySteps />
      <NumbersSection publicStats={publicStats} />
      <TrustedBy startups={startups} />
      <Testimonials testimonialsList={testimonialsList} />
      <Footer />
      <ConsentBanner />
    </div>
  );
}

// --- SHARED COMPONENTS MOVING OUTSIDE ---

// CountUp component for numbers section
function CountUp({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const progress = Math.min(
              (currentTime - startTime) / duration,
              1,
            );

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="inline-block">
      {count}
      {suffix}
    </span>
  );
}

// Hero Section (Black to Blue)
const Hero = ({ navigate }) => (
  <section
    className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
    style={gradientBlackToBlue}
  >
    {/* Grid Background Effect - High Visibility */}
    <div
      className="absolute inset-0 z-0 opacity-80 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(to bottom, transparent, black 50%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 50%, transparent)'
      }}
    ></div>
    <div className="text-center max-w-5xl mx-auto relative z-10 px-4">
      <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 md:mb-6 leading-tight">
        <span className="text-white">CONNECT</span>{" "}
        <span className="text-blue-300">STARTUPS</span>{" "}
        <span className="text-white">& FREELANCERS</span>
      </h1>
      <p className="text-blue-200 text-lg sm:text-xl md:text-2xl mb-4 mt-4 md:mt-8">
        Effortlessly connect with top-notch talent and co-founders with our
        AI-powered matching platform.
      </p>
      <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 md:mb-12">
        Try for free, No credit card required & easy to use
      </p>
      <button
        onClick={() => navigate("/login-signup")}
        className="bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
        Get started for free
      </button>
    </div>
    <div className="mt-16 flex flex-col items-center text-blue-300 animate-bounce relative z-10">
      <span className="text-sm mb-2">SCROLL DOWN</span>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>
);

// Trusted By Section (Blue to Black)
const TrustedBy = ({ startups }) => {
  const logos = startups.map(s => ({
    name: s.startup_name || "Startup",
    logo: s.startup_logo_url
      ? `http://localhost:4000${s.startup_logo_url}`
      : null,
    initial: (s.startup_name || "S").charAt(0).toUpperCase()
  }));

  if (!logos.length) return null;

  return (
    <section
      className="py-20 px-4 overflow-hidden relative"
      style={gradientBlackToBlue}
    >
      <h2 className="text-center text-4xl md:text-5xl font-bold mb-12 relative z-10">
        <span className="text-white">Trusted by </span>
        <span className="text-blue-300">{logos.length}+ Startups</span>
      </h2>

      <div className="relative">
        {/* Row 1 - Left to Right */}
        <div className="flex w-max mb-4 animate-scroll-right hover:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-8 pr-8">
            {logos.map((company, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center flex flex-col items-center">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded-lg mb-2" />
                  ) : (
                    <div className="text-4xl font-bold text-white mb-2">{company.initial}</div>
                  )}
                  <div className="text-gray-300 text-sm truncate w-full">{company.name}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 gap-8 pr-8">
            {logos.map((company, idx) => (
              <div
                key={`row1-dup-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center flex flex-col items-center">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded-lg mb-2" />
                  ) : (
                    <div className="text-4xl font-bold text-white mb-2">{company.initial}</div>
                  )}
                  <div className="text-gray-300 text-sm truncate w-full">{company.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-8 pr-8">
            {logos
              .slice()
              .reverse()
              .map((company, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
                >
                  <div className="text-center flex flex-col items-center">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded-lg mb-2" />
                    ) : (
                      <div className="text-4xl font-bold text-white mb-2">{company.initial}</div>
                    )}
                    <div className="text-gray-300 text-sm truncate w-full">{company.name}</div>
                  </div>
                </div>
              ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex shrink-0 gap-8 pr-8">
            {logos
              .slice()
              .reverse()
              .map((company, idx) => (
                <div
                  key={`row2-dup-${idx}`}
                  className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
                >
                  <div className="text-center flex flex-col items-center">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded-lg mb-2" />
                    ) : (
                      <div className="text-4xl font-bold text-white mb-2">{company.initial}</div>
                    )}
                    <div className="text-gray-300 text-sm truncate w-full">{company.name}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Users We Cater Section (Blue to Black)
const UsersWeCater = ({ navigate }) => {
  const userTypes = [
    {
      title: "Startups",
      description: "Find the perfect co-founders and freelancers to bring your vision to life with AI-driven talent acquisition.",
      icon: <Rocket className="w-8 h-8" />,
      accentClass: "blue",
      bgColor: "from-blue-600/20 to-blue-900/10",
      borderColor: "border-blue-500/30",
      hoverBorder: "hover:border-blue-400",
      btnColor: "bg-blue-600 hover:bg-blue-500",
      shadowColor: "group-hover:shadow-blue-500/20",
      iconContainer: "bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-blue-500/10",
      titleGradient: "group-hover:from-white group-hover:to-blue-200",
      glowColor: "group-hover:bg-blue-500/20",
      buttonText: "Add a New Job",
      route: "/login-signup"
    },
    {
      title: "Freelancers",
      description: "Discover exciting projects and collaborate with innovative startups on projects that matter.",
      icon: <Search className="w-8 h-8" />,
      accentClass: "indigo",
      bgColor: "from-indigo-600/20 to-indigo-900/10",
      borderColor: "border-indigo-500/30",
      hoverBorder: "hover:border-indigo-400",
      btnColor: "bg-indigo-600 hover:bg-indigo-500",
      shadowColor: "group-hover:shadow-indigo-500/20",
      iconContainer: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-indigo-500/10",
      titleGradient: "group-hover:from-white group-hover:to-indigo-200",
      glowColor: "group-hover:bg-indigo-500/20",
      buttonText: "View Jobs",
      route: "/freelancer-jobs"
    },
    {
      title: "Co-founders",
      description: "Connect with startups looking for your unique skills and shared passion to build something great.",
      icon: <Handshake className="w-8 h-8" />,
      accentClass: "purple",
      bgColor: "from-purple-600/20 to-purple-900/10",
      borderColor: "border-purple-500/30",
      hoverBorder: "hover:border-purple-400",
      btnColor: "bg-purple-600 hover:bg-purple-500",
      shadowColor: "group-hover:shadow-purple-500/20",
      iconContainer: "bg-purple-500/20 text-purple-300 border-purple-500/30 shadow-purple-500/10",
      titleGradient: "group-hover:from-white group-hover:to-purple-200",
      glowColor: "group-hover:bg-purple-500/20",
      buttonText: "View Jobs",
      route: "/cofounder-jobs"
    },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative" style={gradientBlueToBlack}>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-12 md:mb-20">
          <h2 className="text-center text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
            <span className="text-white">TYPES OF USERS </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">WE CATER</span>
          </h2>
          <div className="h-1 w-16 md:h-1.5 md:w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {userTypes.map((type, index) => (
            <motion.div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              whileHover={{ scale: 1.05, translateY: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`group relative bg-gradient-to-b ${type.bgColor} backdrop-blur-xl border ${type.borderColor} ${type.hoverBorder} rounded-3xl p-6 md:p-10 h-full transition-all duration-500 hover:shadow-2xl ${type.shadowColor} flex flex-col items-start`}
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${type.iconContainer} flex items-center justify-center mb-6 md:mb-8 border group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                {type.icon}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 transition-all duration-300">
                {type.title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 md:mb-10 flex-grow font-light">
                {type.description}
              </p>
              <button
                onClick={() => navigate(type.route)}
                className={`${type.btnColor} text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 group/btn w-full justify-center overflow-hidden relative`}
              >
                <span className="relative z-10">{type.buttonText}</span>
                <Zap className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Category Steps Section (Ladder Layout)
const CategorySteps = () => {
  const categories = [
    {
      type: "Freelancer",
      description: "Your journey from expert to verified professional.",
      alignment: "left",
      steps: [
        "Create your verified expert profile",
        "Showcase best visual highlights in the feed",
        "Earn credibility badges via successful jobs",
        "Get AI-matched with top funded startups"
      ]
    },
    {
      type: "Co-founder",
      description: "Partner with visionaries to build the next unicorn.",
      alignment: "right",
      steps: [
        "Pitch your skills to the AI Genie",
        "Discover startups looking for partners",
        "Collaborate & validate idea-market fit",
        "Secure equity & build your legacy"
      ]
    },
    {
      type: "Founder",
      description: "Scale your startup with elite talent on demand.",
      alignment: "left",
      steps: [
        "Draft JDs in seconds with Quick Hire AI",
        "Browse AI-ranked talent and co-founders",
        "Analyze credibility via verified badges",
        "Hire, manage & scale your dream team"
      ]
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-[#020024] relative overflow-hidden" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-28">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">THE ROADMAP</h2>
          <div className="h-1.5 w-24 bg-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-xs">Clear steps for every role</p>
        </div>

        <div className="space-y-40 md:space-y-60">
          {categories.map((cat, idx) => (
            <div key={idx} className={`flex flex-col ${cat.alignment === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 relative`}>
              {/* Heading Side */}
              <div
                data-aos={cat.alignment === 'left' ? 'fade-right' : 'fade-left'}
                className={`w-full md:w-1/2 ${cat.alignment === 'left' ? 'text-left' : 'text-right'}`}
              >
                <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  Category Profile
                </div>
                <h3 className={`text-6xl md:text-9xl font-black text-white/5 mb-[-0.5em] uppercase leading-none select-none ${cat.alignment === 'left' ? 'text-left' : 'text-right'}`}>{cat.type}</h3>
                <h4 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">{cat.type} Journey</h4>
                <p className="text-gray-400 text-lg md:text-2xl font-light max-w-xl italic leading-relaxed">"{cat.description}"</p>
              </div>

              {/* Ladder Steps Side */}
              <div className="w-full md:w-1/2 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent -translate-x-1/2 hidden md:block"></div>
                <div className="space-y-8 relative z-10">
                  {cat.steps.map((step, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, x: cat.alignment === 'left' ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                      className={`flex items-center gap-6 group`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center text-white/20 font-black text-2xl shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500 transform group-hover:scale-110">
                        {sIdx + 1}
                      </div>
                      <div className="bg-white/5 backdrop-blur-md border border-white/5 p-6 md:p-8 rounded-[2.5rem] w-full group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500 hover:translate-x-4 shadow-xl">
                        <p className="text-white font-bold text-base md:text-xl leading-relaxed">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FoundU AIs Section (Neon Theme)
const FoundUAIs = () => {
  const aiModels = [
    {
      title: "FoundU Genie",
      subtitle: "The Master Matcher",
      description: "Our core AI engine that powers the ecosystem. It analyzes credibility scores and badge verifications to find the perfect match for Founders, Co-founders, and Freelancers alike.",
      icon: <Sparkles className="w-10 h-10 text-cyan-400" />,
      glow: "shadow-cyan-500/20",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      tags: ["Matching", "Verification", "Insights"]
    },
    {
      title: "Idea Lab",
      subtitle: "Incubation on Autopilot",
      description: "Pitch your raw startup concepts and watch our AI polish them into viable business models. Generates detailed roadmaps and milestones for Founders and Co-founders.",
      icon: <Lightbulb className="w-10 h-10 text-pink-400" />,
      glow: "shadow-pink-500/20",
      border: "border-pink-500/30",
      text: "text-pink-400",
      bg: "bg-pink-500/10",
      tags: ["Strategy", "Incubation", "Roadmaps"]
    },
    {
      title: "Quick Job Posting",
      subtitle: "Hire in 60 Seconds",
      description: "Just provide a budget and a one-liner about your needs. Our AI instantly drafts a professional JD and publishes it across the network. Built for rapid scaling.",
      icon: <Zap className="w-10 h-10 text-lime-400" />,
      glow: "shadow-lime-500/20",
      border: "border-lime-500/30",
      text: "text-lime-400",
      bg: "bg-lime-500/10",
      tags: ["JD Generation", "Fast Hire", "Efficiency"]
    }
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative bg-[#020024] overflow-hidden" style={gradientBlackToBlue}>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-8xl font-black mb-6 uppercase tracking-tighter">
            <span className="text-white">POWERED BY </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-lime-400 animate-gradient">FOUNDU AI</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-2xl font-light max-w-3xl mx-auto italic">
            "Leveraging world-class artificial intelligence to bridge the gap between vision and execution."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aiModels.map((ai, idx) => (
            <motion.div
              key={idx}
              data-aos="zoom-in-up"
              data-aos-delay={idx * 150}
              whileHover={{ scale: 1.05, translateY: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative h-full"
            >
              <div className={`absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700`}></div>
              <div className="relative h-full bg-gray-950/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[3rem] flex flex-col items-center text-center hover:bg-black/60 transition-all duration-500 shadow-2xl">
                <div className={`w-24 h-24 rounded-3xl ${ai.bg} border ${ai.border} flex items-center justify-center mb-10 ${ai.glow} group-hover:scale-110 transition-transform duration-500`}>
                  {ai.icon}
                </div>
                <div className="mb-6">
                  <h3 className="text-3xl font-black text-white mb-2">{ai.title}</h3>
                  <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${ai.text}`}>{ai.subtitle}</p>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed mb-10 flex-grow font-medium">
                  {ai.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-6 border-t border-white/5 w-full">
                  {ai.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold uppercase px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// What is Foundu Section
const WhatIsFoundu = ({ navigate }) => (
  <section className="py-32 px-4 relative min-h-screen flex items-center overflow-hidden" style={gradientBlueToBlack}>
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="max-w-7xl mx-auto w-full relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:block">
          {/* <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-6 border border-blue-700/30 shadow-2xl relative overflow-hidden group"> */}
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
          <div className="w-full h-[450px] relative z-10 flex items-center justify-center">
            <DotLottieReact
              src="https://lottie.host/b770bd13-7b25-428c-ae62-4470485c1d11/NqVTgNMisf.lottie"
              loop
              autoplay
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* </div> */}
        </div>
        <div className="relative">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-10 leading-tight text-center lg:text-left">
            <span className="text-white">WHAT IS </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">FOUNDU</span>
            <span className="text-white">?</span>
          </h2>
          <div className="space-y-4 md:space-y-6 mb-8 md:mb-12 text-center lg:text-left">
            <p className="text-gray-200 text-lg sm:text-xl md:text-2xl leading-relaxed font-light">Foundu is the premier AI-driven ecosystem where innovation meets execution.</p>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed font-light">We bridge the gap between ambitious startups and elite talent, using advanced matching technology to build teams that win.</p>
          </div>
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={() => navigate('/about-details')}
              className="group relative px-8 py-4 md:px-10 md:py-5 bg-blue-600 rounded-2xl font-bold text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-blue-500 shadow-2xl shadow-blue-500/30 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-3 text-base md:text-lg">
                Learn More
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Numbers Section (Black to Blue)
const NumbersSection = ({ publicStats }) => {
  const stats = [
    { number: publicStats.founders, suffix: "+", label: "Startups" },
    { number: publicStats.freelancers, suffix: "+", label: "Freelancers" },
    { number: publicStats.cofounders, suffix: "+", label: "Co-Founders" },
    { number: publicStats.totalJobs, suffix: "+", label: "Jobs Posted" },
  ];

  return (
    <section className="py-20 md:py-32 px-4 relative" style={gradientBlueToBlack}>
      <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 relative z-10">
        <span className="text-white">OUR </span>
        <span className="text-blue-300">ACHIEVEMENT</span>
      </h2>
      <p className="text-center text-gray-300 text-base md:text-lg mb-10 md:mb-16 max-w-3xl mx-auto relative z-10">
        From our first creator upload to thousands of successful collaborations — here's what we've achieved so far.
      </p>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-blue-400 rounded-2xl p-6 md:p-12 shadow-2xl shadow-blue-500/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-3 text-blue-300">
                  <CountUp end={stat.number} duration={2000} suffix={stat.suffix} />
                </div>
                <div className="text-blue-300 text-lg font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section (Blue to Black)
const Testimonials = ({ testimonialsList }) => {
  const staticTestimonials = [
    { name: "Krish", affiliation: "GGSIPU", rating: 5, review: "Amazing platform for finding the right co-founders!", tagline: "Future belongs to builders 🚀" },
    { name: "Sarah", affiliation: "MIT", rating: 5, review: "Found the perfect co-founder here!", tagline: "Building the future 💡" },
    { name: "Alex", affiliation: "Stanford", rating: 5, review: "Best freelance matching platform.", tagline: "Innovation starts here ⚡" },
    { name: "Priya", affiliation: "IIT Delhi", rating: 5, review: "AI recommendations are spot on!", tagline: "Dreams come true 🌟" },
  ];
  const displayList = testimonialsList && testimonialsList.length > 0 ? testimonialsList : staticTestimonials;

  return (
    <section className="py-20 md:py-32 px-4 overflow-hidden relative" style={gradientBlueToBlack}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 relative z-10">
          <span className="text-white">What our </span>
          <span className="text-blue-300">users are saying</span>
        </h2>
        <p className="text-center text-gray-300 text-base md:text-lg mb-10 md:mb-16 max-w-3xl mx-auto relative z-10">
          Hear from startups and freelancers who have accelerated their growth through our AI-powered matching platform.
        </p>
        <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-6 pr-6">
            {displayList.map((testimonial, idx) => (
              <div key={idx} className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 w-80 hover:border-blue-400 transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 border border-blue-400/30 group-hover:scale-110 transition-transform">{testimonial.name.charAt(0)}</div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-300 text-sm">{testimonial.affiliation}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-white mb-3 text-sm italic">"{testimonial.review}"</p>
                <p className="text-blue-300 text-xs font-semibold">{testimonial.tagline}</p>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-6 pr-6">
            {displayList.map((testimonial, idx) => (
              <div key={`dup-${idx}`} className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 w-80 hover:border-blue-400 transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 border border-blue-400/30 group-hover:scale-110 transition-transform">{testimonial.name.charAt(0)}</div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-300 text-sm">{testimonial.affiliation}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                </div>
                <p className="text-white mb-3 text-sm italic">"{testimonial.review}"</p>
                <p className="text-blue-300 text-xs font-semibold">{testimonial.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
