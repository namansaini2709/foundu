import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
// Gradient styles
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
const gradientBlueToBlack = {
  background:
    "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};
function StartupServices() {
  const navigate = useNavigate();
  // First Section - Foundu Startup Dashboard
  const DashboardIntro = () => (
    <section className="py-32 px-4 relative" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Placeholder Image */}
          <div className="hidden lg:block">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-700/50">
              <div className="w-full h-96 bg-gradient-to-br from-blue-900/50 to-gray-800/50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-white text-xl font-semibold">
                    Dashboard Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right - Text Content */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Foundu Startup </span>
              <span className="text-blue-300">Dashboard</span>
            </h1>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              Your AI-powered command center for startup intelligence. Get
              real-time insights, AI-driven recommendations, and actionable
              analytics to make informed decisions about hiring, partnerships,
              and scaling.
            </p>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Track your startup's health, discover compatible co-founders, and
              execute with confidence using our comprehensive dashboard.
            </p>
            <button
              onClick={() => navigate("/startup-dashboard")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Go to Foundu Dashboard →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
  // Second Section - Our MVPs
  const OurMVPs = () => {
    const aiFeatures = [
      "Founder-Founder Compatibility Score",
      "Founder Readiness Score",
      "Startup DNA Analysis",
      "Burn Reality Checker",
      "AI Founder Simulator",
    ];
    const buyPortalFeatures = [
      "Hiring & Talent Portal",
      "CRM System",
      "Helpdesk Support",
      "Vendor Management",
      "Project Tracking",
    ];
    const manualFeatures = [
      "Custom Job Templates",
      "Applicant Screening",
      "Interview Scheduling",
      "Offer Management",
      "Onboarding Tools",
    ];
    const pitchFeatures = [
      "AI Template Selection",
      "Content Auto-Generation",
      "Visual Design Optimization",
      "Investor Insights",
      "Export & Sharing",
    ];
    return (
      <section className="py-32 px-4 relative" style={gradientBlueToBlack}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-16">
          <span className="text-white">OUR </span>
          <span className="text-blue-300">MVPs</span>
        </h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buy Portal Card */}
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">🛒</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Buy Portals</h3>
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    PREMIUM
                  </span>
                </div>
              </div>
              <p className="text-gray-200 text-sm mb-6">
                Instantly launch with ready-to-use business portals including
                Hiring & Talent, CRM, Helpdesk, Vendor Management, and more.
              </p>
              <div className="space-y-3">
                {buyPortalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-4">
                View Portals
              </button>
            </div>
            {/* Manual Job Card */}
            <div className="bg-gray-800/40 backdrop-blur-sm border-2 border-blue-400 rounded-xl p-8 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">📝</div>
                <h3 className="text-2xl font-bold text-white">
                  Manual Job Posting
                </h3>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Create and manage job posts manually without AI assistance. Full
                control over your hiring process.
              </p>
              <div className="space-y-3">
                {manualFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 mt-4">
                Post a Job
              </button>
            </div>
            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-2 border-green-400 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">🤖</div>
                <h3 className="text-2xl font-bold text-white">AI Insights</h3>
              </div>
              <p className="text-gray-200 text-sm mb-4">
                Advanced AI-powered analytics and recommendations to guide your
                startup decisions.
              </p>
              <div className="space-y-3">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 mt-4">
                Explore AI Features
              </button>
            </div>
            {/* Pitch Deck Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">📊</div>
                <h3 className="text-2xl font-bold text-white">
                  Pitch Deck Generator
                </h3>
              </div>
              <p className="text-gray-200 text-sm mb-6">
                Create professional pitch decks using AI-recommended templates
                tailored to your startup stage and business model.
              </p>
              <div className="space-y-3">
                {pitchFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 mt-4">
                Generate Pitch Deck
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  // Third Section - 4 Simple Steps of Matching (with roadmap animation)
  const MatchingSteps = () => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
      {
        number: "01",
        title: "Create Profile",
        description: "Build your startup profile with vision, needs, and goals",
      },
      {
        number: "02",
        title: "AI Analysis",
        description: "Get AI-powered compatibility and readiness scores",
      },
      {
        number: "03",
        title: "Get Matches",
        description:
          "Receive curated recommendations for freelancers and co-founders",
      },
      {
        number: "04",
        title: "Connect & Execute",
        description: "Connect with matches and start building your dream team",
      },
    ];
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
    return (
      <section className="py-32 px-4 relative" style={gradientBlackToBlue}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-16">
          <span className="text-white">4 SIMPLE STEPS OF </span>
          <span className="text-blue-300">MATCHING</span>
        </h2>
        <div className="max-w-7xl mx-auto">
          {/* Roadmap Line */}
          <div className="relative mb-12">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-700/50 z-0" />
            <div
              className="hidden lg:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 z-10 transition-all duration-1000"
              style={{
                width: `${((activeStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative z-20 transition-all duration-500 ${
                  index <= activeStep ? "scale-105" : "scale-100 opacity-60"
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div
                  className={`bg-gray-800/40 backdrop-blur-sm border-2 rounded-xl p-6 h-full transition-all duration-300 ${
                    index <= activeStep
                      ? "border-blue-400 shadow-lg shadow-blue-400/50"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-2xl font-bold ${index <= activeStep ? "text-blue-300" : "text-gray-500"}`}
                    >
                      {step.number}
                    </span>
                    {index <= activeStep && (
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
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
        icon: "🎯",
        title: "AI-Powered Matching",
        description:
          "Advanced algorithms ensure compatibility and success rates",
      },
      {
        icon: "🔒",
        title: "Secure & Trusted",
        description:
          "Verified profiles and secure transactions for peace of mind",
      },
      {
        icon: "⚡",
        title: "Fast Execution",
        description:
          "Get matched and start collaborating within days, not months",
      },
      {
        icon: "📈",
        title: "Proven Results",
        description: "1500+ successful startups trust Foundu for their growth",
      },
      {
        icon: "🤝",
        title: "Expert Support",
        description: "Dedicated team to help you navigate your startup journey",
      },
      {
        icon: "💡",
        title: "Innovation First",
        description: "Cutting-edge AI and tools designed for modern startups",
      },
    ];
    return (
      <section className="py-32 px-4 relative" style={gradientBlueToBlack}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-4">
          <span className="text-white">WHY USERS </span>
          <span className="text-blue-300">TRUST FOUNDU</span>
        </h2>
        <p className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto">
          Join thousands of startups that rely on Foundu for intelligent
          matching and growth acceleration.
        </p>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustPoints.map((point, index) => (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-8 hover:border-blue-400 hover:scale-105 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{point.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {point.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  // Footer (same as homepage)
  const Footer = () => (
    <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">F</span>
                <span className="text-white text-2xl font-bold ml-2">
                  OUNDU
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The central platform for startups to discover, connect, and
                collaborate with skilled freelancers and co-founders.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80 text-sm">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  foundu@example.com
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                For Startups
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Browse Talent
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Create Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Post Gig
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Explore Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    Partner With Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">
            FOUNDU
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Cookie Policy
            </a>
          </div>
          <div className="text-white/60 text-sm">
            © 2025 Foundu, All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
  return (
    <div className="min-h-screen">
      <DashboardIntro />
      <OurMVPs />
      <MatchingSteps />
      <WhyTrustFoundu />
      <Footer />
    </div>
  );
}
export default StartupServices;
