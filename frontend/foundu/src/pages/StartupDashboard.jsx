import { useState, useEffect } from 'react'

// Gradient styles
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
const gradientBlueToBlack = {
  background: 'linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)'
}

function StartupDashboard() {
  const [showNavbar, setShowNavbar] = useState(false)

  // Navbar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navbar Component (same as homepage)
  const Navbar = () => (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={gradientBlackToBlue}
    >
      <div className="bg-black/20 backdrop-blur-md border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white ml-1">OUNDU</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Hire Freelancer</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Find Best Match</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">For Startups</a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">About Us</a>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )

  // Dashboard Stats Section
  const DashboardStats = () => {
    const stats = [
      {
        title: 'Total Jobs Posted',
        value: '12',
        subtitle: 'Post a New Job',
        color: 'blue',
        action: 'Post Job'
      },
      {
        title: 'Total Matches Made',
        value: '8',
        subtitle: 'Successful Connections',
        color: 'green',
        action: null
      },
      {
        title: 'Total Money Spent',
        value: '$2,450',
        subtitle: 'This Month',
        color: 'yellow',
        action: null
      },
      {
        title: 'Vendors/Service Providers',
        value: '15',
        subtitle: 'Active Matches',
        color: 'purple',
        action: 'View More Vendors'
      }
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const borderClass = stat.color === 'blue' ? 'border-blue-400/50 hover:border-blue-400' :
                             stat.color === 'green' ? 'border-green-400/50 hover:border-green-400' :
                             stat.color === 'yellow' ? 'border-yellow-400/50 hover:border-yellow-400' :
                             'border-purple-400/50 hover:border-purple-400';
          const textClass = stat.color === 'blue' ? 'text-blue-400' :
                           stat.color === 'green' ? 'text-green-400' :
                           stat.color === 'yellow' ? 'text-yellow-400' :
                           'text-purple-400';
          const valueClass = stat.color === 'blue' ? 'text-blue-300' :
                            stat.color === 'green' ? 'text-green-300' :
                            stat.color === 'yellow' ? 'text-yellow-300' :
                            'text-purple-300';
          const buttonClass = stat.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                             stat.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                             stat.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
                             'bg-purple-500 hover:bg-purple-600';

          return (
            <div
              key={index}
              className={`bg-gray-800/40 backdrop-blur-sm border-2 rounded-xl p-6 hover:scale-105 transition-all duration-300 ${borderClass}`}
            >
              <div className={`${textClass} text-sm font-semibold mb-2`}>{stat.title}</div>
              <div className={`${valueClass} text-4xl font-bold mb-2`}>{stat.value}</div>
              <div className="text-gray-300 text-sm mb-4">{stat.subtitle}</div>
              {stat.action && (
                <button className={`w-full ${buttonClass} text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm`}>
                  {stat.action}
                </button>
              )}
            </div>
          );
        })}
      </div>
    )
  }

  // Founder Snapshot Panel
  const FounderSnapshot = () => {
    const metrics = {
      readinessScore: 78,
      readinessLabel: 'Ready to Scale',
      dnaStatus: 'Balanced',
      hiringRisk: 'Medium',
      burnReality: 'Stable',
      nextStep: 'Review Founder-Founder Compatibility before onboarding a new co-founder'
    }

    return (
      <div className="bg-gray-800/40 backdrop-blur-sm border-2 border-blue-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">AI Briefing</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
            <div className="text-green-400 text-sm font-semibold mb-1">Founder Readiness</div>
            <div className="text-3xl font-bold text-green-300">{metrics.readinessScore}%</div>
            <div className="text-green-200 text-xs mt-1">{metrics.readinessLabel}</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-semibold mb-1">Startup DNA</div>
            <div className="text-2xl font-bold text-blue-300">{metrics.dnaStatus}</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
            <div className="text-yellow-400 text-sm font-semibold mb-1">Hiring Risk</div>
            <div className="text-2xl font-bold text-yellow-300">{metrics.hiringRisk}</div>
          </div>
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
            <div className="text-green-400 text-sm font-semibold mb-1">Burn Reality</div>
            <div className="text-2xl font-bold text-green-300">{metrics.burnReality}</div>
          </div>
          <div className="bg-blue-600/30 border border-blue-500 rounded-lg p-4">
            <div className="text-blue-300 text-sm font-semibold mb-1">AI Recommended</div>
            <div className="text-xs text-gray-300 leading-relaxed">{metrics.nextStep}</div>
          </div>
        </div>
      </div>
    )
  }

  // AI Feature Cards
  const AIFeatures = () => {
    const features = [
      {
        name: 'Founder–Founder Compatibility Score',
        description: 'Analyzes mindset, risk tolerance, vision alignment, and working style between you and potential co-founders.',
        whenToUse: 'Before onboarding a co-founder or discussing equity.',
        aiRecommended: true
      },
      {
        name: 'Founder Readiness Score',
        description: 'Evaluates whether you are currently prepared to hire, partner, or scale based on clarity, commitment, and execution capacity.',
        whenToUse: 'Before hiring or seeking partners.',
        aiRecommended: false
      },
      {
        name: 'AI Founder Simulator',
        description: 'Simulates real co-founder conversations and challenges your decisions like an experienced startup partner.',
        whenToUse: 'When validating decisions or feeling uncertain.',
        aiRecommended: false
      },
      {
        name: 'Startup DNA Score',
        description: 'Defines your startup\'s execution style, speed, risk appetite, and long-term orientation.',
        whenToUse: 'To find people who truly fit your startup culture.',
        aiRecommended: false
      },
      {
        name: 'Burn Reality Checker',
        description: 'Analyzes your burn rate, hiring plans, and execution speed to flag financial risk early.',
        whenToUse: 'Before making hiring or vendor decisions.',
        aiRecommended: false
      },
      {
        name: 'Trial Sprint Generator',
        description: 'Creates short trial sprints to test freelancers or co-founders before committing long-term.',
        whenToUse: 'Before finalizing any hire or partner.',
        aiRecommended: false
      },
      {
        name: 'AI Idea Generator',
        description: 'Refines, stress-tests, and improves your startup idea based on execution feasibility.',
        whenToUse: 'During ideation or when pivoting.',
        aiRecommended: false
      },
      {
        name: '"Who Do You Really Need?" AI',
        description: 'Identifies the exact role or capability your startup needs right now instead of generic titles.',
        whenToUse: 'When unsure whether to hire, partner, or outsource.',
        aiRecommended: true
      },
      {
        name: 'FoundU Recommended Pitch Deck Templates',
        description: 'AI-recommended pitch deck structures tailored to your startup stage and model.',
        whenToUse: 'Before investor outreach or demo days.',
        aiRecommended: false
      },
      {
        name: 'Freelancer / Co-founder Recommendations',
        description: 'AI-curated people recommendations based on startup DNA, execution style, and trust signals.',
        whenToUse: 'After reviewing insights and readiness scores.',
        aiRecommended: false
      }
    ]

    return (
      <div className="pr-4">
        <h2 className="text-3xl font-bold text-white mb-6">AI Insights for Your Startup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/40 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 hover:border-blue-400 transition-all"
            >
              {feature.aiRecommended && (
                <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                  AI RECOMMENDED
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-3">{feature.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 mb-4">
                <p className="text-blue-200 text-xs font-semibold mb-1">When to use:</p>
                <p className="text-gray-300 text-xs">{feature.whenToUse}</p>
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Open Analysis
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Execution Panel
  const ExecutionPanel = () => {
    const portals = [
      'Hiring & Talent Portal',
      'CRM / Lead Management Portal',
      'Helpdesk / Support Portal',
      'Vendor Management Portal',
      'Internal Task / Execution Portal'
    ]

    return (
      <div className="bg-gray-800/40 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Next Actions</h2>

        {/* Primary Highlight - Buy Portals */}
        <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400 rounded-xl p-6 mb-6 shadow-lg shadow-yellow-500/20">
          <div className="flex items-center mb-3">
            <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">🔥 PREMIUM</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Buy Ready-to-Use Startup Portals</h3>
          <p className="text-gray-300 text-sm mb-4">Instantly launch with pre-built business portals.</p>
          <ul className="space-y-2 mb-4">
            {portals.map((portal, index) => (
              <li key={index} className="text-gray-200 text-sm flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                {portal}
              </li>
            ))}
          </ul>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
            View & Buy Portals
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-4">
         

          

          <div className="bg-gray-700/30 border border-blue-700/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Generate Pitch Deck</h4>
            <p className="text-gray-400 text-xs mb-3">Create a pitch deck using AI templates.</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
              Generate Deck
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Footer (same as homepage)
  const Footer = () => (
    <footer className="relative py-16 px-4 mt-12" style={gradientBlueToBlack}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-white">F</span>
                <span className="text-white text-2xl font-bold ml-2">OUNDU</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The central platform for startups to discover, connect, and collaborate with skilled freelancers and co-founders.
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
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Our Team</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
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
    <div className="min-h-screen" style={gradientBlackToBlue}>
      <Navbar />
      <div className="pt-24 px-6 pb-8">
        <div className="max-w-[1920px] mx-auto">
          {/* Top Section - Founder Snapshot */}
          <FounderSnapshot />

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Main Content - 75/25 Split */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - 75% */}
            <div className="lg:w-3/4">
              <AIFeatures />
            </div>

            {/* Right Section - 25% */}
            <div className="lg:w-1/4">
              <ExecutionPanel />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default StartupDashboard
