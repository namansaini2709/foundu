import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Rocket, Search, Users, Handshake, Sparkles, Target, Zap, ArrowRight } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";

// Gradient styles - alternating
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
const gradientBlueToBlack = {
  background:
    "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};

function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(false);

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowNavbar(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Navbar Component
  // const Navbar = () => (

  // )

  // Hero Section (Black to Blue)
  const Hero = () => (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
      style={gradientBlackToBlue}
    >
      <div className="text-center max-w-5xl mx-auto relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="text-white">CONNECT</span>{" "}
          <span className="text-blue-300">STARTUPS</span>{" "}
          <span className="text-white">& FREELANCERS</span>
        </h1>
        <p className="text-blue-200 text-xl md:text-2xl mb-4 mt-8">
          Effortlessly connect with top-notch talent and co-founders with our
          AI-powered matching platform.
        </p>
        <p className="text-blue-100 text-lg md:text-xl mb-12">
          Try for free, No credit card required & easy to use
        </p>
        <button className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
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
  const TrustedBy = () => {

    const logos = [
      { name: "Google", logo: "G" },
      { name: "Microsoft", logo: "M" },
      { name: "Amazon", logo: "A" },
      { name: "Apple", logo: "🍎" },
      { name: "Meta", logo: "M" },
      { name: "Netflix", logo: "N" },
    ];

    return (
      <section
        className="py-20 px-4 overflow-hidden relative"
        style={gradientBlueToBlack}
      >
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-12 relative z-10">
          <span className="text-white">Trusted by </span>
          <span className="text-blue-300">2+ Global Startups</span>
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
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {company.logo}
                    </div>
                    <div className="text-gray-300 text-sm">{company.name}</div>
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
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {company.logo}
                    </div>
                    <div className="text-gray-300 text-sm">{company.name}</div>
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
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {company.logo}
                      </div>
                      <div className="text-gray-300 text-sm">{company.name}</div>
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
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {company.logo}
                      </div>
                      <div className="text-gray-300 text-sm">{company.name}</div>
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
  const UsersWeCater = () => {
    const navigate = useNavigate();
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
      <section className="py-40 px-4 relative overflow-hidden" style={gradientBlackToBlue}>
        {/* Background Ambient Effects */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-20">
            <h2 className="text-center text-4xl md:text-7xl font-bold mb-6">
              <span className="text-white">TYPES OF USERS </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">WE CATER</span>
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {userTypes.map((type, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-b ${type.bgColor} backdrop-blur-xl border ${type.borderColor} ${type.hoverBorder} rounded-3xl p-10 h-full transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl ${type.shadowColor} flex flex-col items-start`}
              >
                {/* Icon Circle */}
                <div className={`w-16 h-16 rounded-2xl ${type.iconContainer} flex items-center justify-center mb-8 border group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  {type.icon}
                </div>

                <h3 className={`text-3xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${type.titleGradient} transition-all duration-300`}>
                  {type.title}
                </h3>

                <p className="text-gray-300 text-lg leading-relaxed mb-10 flex-grow font-light">
                  {type.description}
                </p>

                <button
                  onClick={() => navigate(type.route)}
                  className={`${type.btnColor} text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 group/btn w-full justify-center overflow-hidden relative`}
                >
                  <span className="relative z-10">{type.buttonText}</span>
                  <Zap className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                
                {/* Decorative Elements */}
                <div className={`absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl ${type.glowColor} transition-all duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };


  // Steps Section (Blue to Black - alternating from previous)
  const StepsSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
      {
        number: "01",
        title: "Create Your Profile",
        description:
          "Build your startup profile with details about your vision, needs, and goals. Our AI analyzes your requirements.",
      },
      {
        number: "02",
        title: "AI Matching",
        description:
          "Get AI-powered recommendations for freelancers and co-founders that match your startup's unique needs.",
      },
      {
        number: "03",
        title: "Connect & Collaborate",
        description:
          "Reach out to matched talent, discuss projects, and start building your dream team with confidence.",
      },
      {
        number: "04",
        title: "Scale Your Business",
        description:
          "Grow your startup with the right team members. Track progress and expand your network seamlessly.",
      },
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    return (
      <section className="py-32 px-4 relative" style={gradientBlueToBlack}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-16">
          <span className="text-white">STEPS TO </span>
          <span className="text-blue-300">USE THE APP</span>
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

  // What is Foundu Section
  const WhatIsFoundu = () => {
    const navigate = useNavigate();
    return (
      <section
        className="py-32 px-4 relative min-h-screen flex items-center overflow-hidden"
        style={gradientBlueToBlack}
      >
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual placeholder */}
            <div className="hidden lg:block">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/15 transition-all duration-700"></div>
                <div className="w-full h-96 bg-gradient-to-br from-blue-900/40 to-gray-800/40 rounded-xl flex items-center justify-center relative z-10 border border-white/5 shadow-2xl">
                  <div className="relative">
                    <div className="absolute -inset-8 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
                    <Rocket className="w-32 h-32 text-blue-300 relative z-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="relative">
              <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-tight">
                <span className="text-white">WHAT IS </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">FOUNDU</span>
                <span className="text-white">?</span>
              </h2>
              
              <div className="space-y-6 mb-12">
                <p className="text-gray-200 text-xl md:text-2xl leading-relaxed font-light">
                  Foundu is the premier AI-driven ecosystem where innovation meets execution.
                </p>
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light">
                  We bridge the gap between ambitious startups and elite talent, using advanced matching technology to build teams that win.
                </p>
              </div>

              <button 
                onClick={() => navigate('/about-details')}
                className="group relative px-10 py-5 bg-blue-600 rounded-2xl font-bold text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:bg-blue-500 shadow-2xl shadow-blue-500/30 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3 text-lg">
                  Learn More
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Numbers Section (Black to Blue)
  const NumbersSection = () => {
    const stats = [
      { number: 1506, suffix: "+", label: "Startups" },
      { number: 9692, suffix: "+", label: "Freelancers" },
      { number: 245, suffix: "+", label: "Co-Founders" },
      { number: 98, suffix: "%", label: "Match Accuracy" },
    ];

    return (
      <section className="py-32 px-4 relative" style={gradientBlackToBlue}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-4 relative z-10">
          <span className="text-white">OUR </span>
          <span className="text-blue-300">ACHIEVEMENT</span>
        </h2>
        <p className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto relative z-10">
          From our first creator upload to thousands of successful
          collaborations — here's what we've achieved so far.
        </p>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-blue-400 rounded-2xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold mb-3 text-blue-300">
                    <CountUp
                      end={stat.number}
                      duration={2000}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-blue-300 text-lg font-semibold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Testimonials Section (Blue to Black)
  const Testimonials = () => {

    const testimonials = [
      {
        name: "Krish",
        affiliation: "GGSIPU",
        rating: 5,
        review: "Amazing platform for finding the right co-founders!",
        tagline: "Future belongs to builders 🚀",
      },
      {
        name: "Sarah",
        affiliation: "MIT",
        rating: 5,
        review: "Found the perfect co-founder here!",
        tagline: "Building the future 💡",
      },
      {
        name: "Alex",
        affiliation: "Stanford",
        rating: 5,
        review: "Best freelance matching platform.",
        tagline: "Innovation starts here ⚡",
      },
      {
        name: "Priya",
        affiliation: "IIT Delhi",
        rating: 5,
        review: "AI recommendations are spot on!",
        tagline: "Dreams come true 🌟",
      },
    ];

    return (
      <section
        className="py-32 px-4 overflow-hidden relative"
        style={gradientBlackToBlue}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-6xl font-bold mb-4 relative z-10">
            <span className="text-white">What our </span>
            <span className="text-blue-300">users are saying</span>
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto relative z-10">
            Hear from startups and freelancers who have accelerated their growth
            through our AI-powered matching platform.
          </p>

          <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused]">
            <div className="flex shrink-0 gap-6 pr-6">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 w-80 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {testimonial.affiliation}
                      </div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-white mb-3">{testimonial.review}</p>
                  <p className="text-blue-300 text-sm">{testimonial.tagline}</p>
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex shrink-0 gap-6 pr-6">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 w-80 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {testimonial.affiliation}
                      </div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-white mb-3">{testimonial.review}</p>
                  <p className="text-blue-300 text-sm">{testimonial.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WhatIsFoundu />
      <UsersWeCater />
      <StepsSection />
      <NumbersSection />
      <TrustedBy />
      <Testimonials />
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default HomePage;
