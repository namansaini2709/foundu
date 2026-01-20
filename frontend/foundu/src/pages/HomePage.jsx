import { useState, useEffect, useRef } from 'react'

// Gradient styles - alternating
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
const gradientBlueToBlack = {
  background: 'linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)'
}

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [showNavbar, setShowNavbar] = useState(false)

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowNavbar(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // CountUp component for numbers section
  function CountUp({ end, duration = 2000, suffix = '' }) {
    const [count, setCount] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            let startTime = null
            const animate = (currentTime) => {
              if (startTime === null) startTime = currentTime
              const progress = Math.min((currentTime - startTime) / duration, 1)
              
              const easeOutQuart = 1 - Math.pow(1 - progress, 4)
              setCount(Math.floor(easeOutQuart * end))

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setCount(end)
              }
            }
            requestAnimationFrame(animate)
          }
        },
        { threshold: 0.5 }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }, [end, duration, hasAnimated])

    return (
      <span ref={ref} className="inline-block">
        {count}{suffix}
      </span>
    )
  }

  // Navbar Component
  const Navbar = () => (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
      style={gradientBlackToBlue}
    >
      <div className="bg-black/20 backdrop-blur-md border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white ml-1">OUNDU</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Hire Freelancer</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Find Best Match</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">For Startups</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">About Us</a>
          </div>

          {/* Sign Up Button */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )

  // Hero Section (Black to Blue)
  const Hero = () => (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative" style={gradientBlackToBlue}>
      <div className="text-center max-w-5xl mx-auto relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="text-white">CONNECT</span>{' '}
          <span className="text-blue-300">STARTUPS</span>{' '}
          <span className="text-white">& FREELANCERS</span>
        </h1>
        <p className="text-blue-200 text-xl md:text-2xl mb-4 mt-8">
          Effortlessly connect with top-notch talent and co-founders with our AI-powered matching platform.
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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )

  // Trusted By Section (Blue to Black)
  const TrustedBy = () => {
    const [hoveredRow1, setHoveredRow1] = useState(false)
    const [hoveredRow2, setHoveredRow2] = useState(false)
    
    const logos = [
      { name: 'Google', logo: 'G' },
      { name: 'Microsoft', logo: 'M' },
      { name: 'Amazon', logo: 'A' },
      { name: 'Apple', logo: '🍎' },
      { name: 'Meta', logo: 'M' },
      { name: 'Netflix', logo: 'N' },
    ]

    return (
      <section className="py-20 px-4 overflow-hidden relative" style={gradientBlueToBlack}>
        <h2 className="text-center text-4xl md:text-5xl font-bold mb-12 relative z-10">
          <span className="text-white">Trusted by </span>
          <span className="text-blue-300">2+ Global Startups</span>
        </h2>
        
        <div className="relative">
          {/* Row 1 - Left to Right */}
          <div 
            className={`flex gap-8 mb-4 ${hoveredRow1 ? 'animate-none' : 'animate-scroll-right'}`}
            onMouseEnter={() => setHoveredRow1(true)}
            onMouseLeave={() => setHoveredRow1(false)}
          >
            {logos.map((company, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{company.logo}</div>
                  <div className="text-gray-300 text-sm">{company.name}</div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {logos.map((company, idx) => (
              <div
                key={`row1-dup-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{company.logo}</div>
                  <div className="text-gray-300 text-sm">{company.name}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Right to Left */}
          <div 
            className={`flex gap-8 ${hoveredRow2 ? 'animate-none' : 'animate-scroll-left'}`}
            onMouseEnter={() => setHoveredRow2(true)}
            onMouseLeave={() => setHoveredRow2(false)}
          >
            {logos.slice().reverse().map((company, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{company.logo}</div>
                  <div className="text-gray-300 text-sm">{company.name}</div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {logos.slice().reverse().map((company, idx) => (
              <div
                key={`row2-dup-${idx}`}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-lg p-6 w-32 h-32 flex items-center justify-center hover:border-blue-400 transition-all"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{company.logo}</div>
                  <div className="text-gray-300 text-sm">{company.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Users We Cater Section (Black to Blue)
  const UsersWeCater = () => {
    const userTypes = [
      {
        title: 'Startups',
        description: 'Find the perfect co-founders and freelancers to bring your vision to life',
        bgColor: 'bg-blue-600/20',
        borderColor: 'border-blue-400',
        textColor: 'text-blue-300',
      },
      {
        title: 'Freelancers',
        description: 'Discover exciting projects and collaborate with innovative startups',
        bgColor: 'bg-indigo-600/20',
        borderColor: 'border-indigo-400',
        textColor: 'text-indigo-300',
      },
      {
        title: 'Co-founders',
        description: 'Connect with startups looking for your skills and expertise to grow',
        bgColor: 'bg-purple-600/20',
        borderColor: 'border-purple-400',
        textColor: 'text-purple-300',
      },
    ]

    return (
      <section className="py-32 px-4 relative" style={gradientBlackToBlue}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-16 relative z-10">
          <span className="text-white">TYPES OF USERS </span>
          <span className="text-blue-300">WE CATER</span>
        </h2>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <div
                key={index}
                className={`${userType.bgColor} backdrop-blur-sm border-2 ${userType.borderColor} rounded-xl p-8 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <h3 className={`text-3xl font-bold mb-4 ${userType.textColor}`}>
                  {userType.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {userType.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Steps Section (Blue to Black - alternating from previous)
  const StepsSection = () => {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
      {
        number: '01',
        title: 'Create Your Profile',
        description: 'Build your startup profile with details about your vision, needs, and goals. Our AI analyzes your requirements.',
      },
      {
        number: '02',
        title: 'AI Matching',
        description: 'Get AI-powered recommendations for freelancers and co-founders that match your startup\'s unique needs.',
      },
      {
        number: '03',
        title: 'Connect & Collaborate',
        description: 'Reach out to matched talent, discuss projects, and start building your dream team with confidence.',
      },
      {
        number: '04',
        title: 'Scale Your Business',
        description: 'Grow your startup with the right team members. Track progress and expand your network seamlessly.',
      },
    ]

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length)
      }, 3000)
      return () => clearInterval(interval)
    }, [])

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
                width: `${((activeStep + 1) / steps.length) * 100}%`
              }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative z-20 transition-all duration-500 ${
                  index <= activeStep ? 'scale-105' : 'scale-100 opacity-60'
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div
                  className={`bg-gray-800/40 backdrop-blur-sm border-2 rounded-xl p-6 h-full transition-all duration-300 ${
                    index <= activeStep
                      ? 'border-blue-400 shadow-lg shadow-blue-400/50'
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-bold ${index <= activeStep ? 'text-blue-300' : 'text-gray-500'}`}>
                      {step.number}
                    </span>
                    {index <= activeStep && (
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // What You Are Looking For Section (Blue to Black) - Before Numbers
  const WhatYouLookingFor = () => {
    const topics = [
      { text: 'AI content', highlighted: false },
      { text: 'Video editing', highlighted: false },
      { text: 'AI product ads', highlighted: true },
      { text: 'Designing', highlighted: false },
      { text: 'Content', highlighted: true },
      { text: 'AI agents', highlighted: false },
      { text: 'And Many More', highlighted: true },
    ]

    return (
      <section className="py-32 px-4 relative min-h-screen flex items-center" style={gradientBlackToBlue}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image placeholder */}
            <div className="hidden lg:block">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/50">
                <div className="w-full h-96 bg-gradient-to-br from-blue-900/50 to-gray-800/50 rounded-xl flex items-center justify-center">
                  <span className="text-6xl">👨‍💻</span>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-12 leading-tight">
                <span className="text-white">WHAT YOU ARE </span>
                <span className="text-blue-300">LOOKING FOR</span>
                <span className="text-white"> ?</span>
              </h2>

              {/* Topic Bubbles */}
              <div className="relative">
                <div className="flex flex-wrap gap-4 items-center">
                  {topics.map((topic, index) => (
                    <button
                      key={index}
                      className={`px-6 py-3 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-110 ${
                        topic.highlighted
                          ? 'bg-blue-400 text-white shadow-lg shadow-blue-400/50'
                          : 'bg-gray-800/50 text-gray-300 border border-blue-700/50 hover:border-blue-400'
                      }`}
                    >
                      {topic.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Numbers Section (Black to Blue)
  const NumbersSection = () => {
    const stats = [
      { number: 1506, suffix: '+', label: 'Startups' },
      { number: 9692, suffix: '+', label: 'Freelancers' },
      { number: 245, suffix: '+', label: 'Gigs Published' },
      { number: 98, suffix: '%', label: 'Match Accuracy' },
    ]

    return (
      <section className="py-32 px-4 relative" style={gradientBlueToBlack}>
        <h2 className="text-center text-4xl md:text-6xl font-bold mb-4 relative z-10">
          <span className="text-white">OUR </span>
          <span className="text-blue-300">ACHIEVEMENT</span>
        </h2>
        <p className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto relative z-10">
          From our first creator upload to thousands of successful collaborations — here's what we've achieved so far.
        </p>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-blue-400 rounded-2xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    )
  }

  // Testimonials Section (Blue to Black)
  const Testimonials = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [isAnyHovered, setIsAnyHovered] = useState(false)

    const testimonials = [
      {
        name: 'Krish',
        affiliation: 'GGSIPU',
        rating: 5,
        review: 'Amazing platform for finding the right co-founders!',
        tagline: 'Future belongs to builders 🚀',
      },
      {
        name: 'Sarah',
        affiliation: 'MIT',
        rating: 5,
        review: 'Found the perfect co-founder here!',
        tagline: 'Building the future 💡',
      },
      {
        name: 'Alex',
        affiliation: 'Stanford',
        rating: 5,
        review: 'Best freelance matching platform.',
        tagline: 'Innovation starts here ⚡',
      },
      {
        name: 'Priya',
        affiliation: 'IIT Delhi',
        rating: 5,
        review: 'AI recommendations are spot on!',
        tagline: 'Dreams come true 🌟',
      },
    ]

    return (
      <section className="py-32 px-4 overflow-hidden relative" style={gradientBlackToBlue}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-6xl font-bold mb-4 relative z-10">
            <span className="text-white">What our </span>
            <span className="text-blue-300">users are saying</span>
          </h2>
          <p className="text-center text-gray-300 text-lg mb-16 max-w-3xl mx-auto relative z-10">
            Hear from startups and freelancers who have accelerated their growth through our AI-powered matching platform.
          </p>

          <div
            className={`flex gap-6 ${isAnyHovered ? 'animate-none' : 'animate-scroll-right'}`}
            onMouseLeave={() => {
              setIsAnyHovered(false)
              setHoveredIndex(null)
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 w-80 hover:border-blue-400 transition-all"
                onMouseEnter={() => {
                  setIsAnyHovered(true)
                  setHoveredIndex(idx)
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-300 text-sm">{testimonial.affiliation}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-white mb-3">{testimonial.review}</p>
                <p className="text-blue-300 text-sm">{testimonial.tagline}</p>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
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
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-300 text-sm">{testimonial.affiliation}</div>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-white mb-3">{testimonial.review}</p>
                <p className="text-blue-300 text-sm">{testimonial.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Footer (Black to Blue) with white touches
  const Footer = () => (
    <footer className="relative py-16 px-4" style={gradientBlueToBlack}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content - White border */}
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">F</span>
                <span className="text-white text-2xl font-bold ml-2">OUNDU</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The central platform for startups to discover, connect, and collaborate with skilled freelancers and co-founders. AI-powered matching, instant connections.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  foundu@example.com
                </li>
                <li className="flex items-center text-white/80 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Our Team</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            {/* For Startups */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">For Startups</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Browse Talent</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Create Profile</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Post Gig</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Explore Community</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Partner With Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">FOUNDU</div>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
          <div className="text-white/60 text-sm">
            © 2025 Foundu, All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <UsersWeCater />
      <StepsSection />
      <WhatYouLookingFor />
      <NumbersSection />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default HomePage
