import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
const gradientBlueToBlack = {
  background: 'linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)'
}

function LoginSignup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userType = searchParams.get('type') || 'user'
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const userTypeNames = {
    cofounder: 'Co-founder',
    freelancer: 'Freelancer',
    startup: 'Startup'
  }

  const userTypeName = userTypeNames[userType] || 'User'

  // Navbar Component
  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 opacity-100" style={gradientBlackToBlue}>
      <div className="bg-black/20 backdrop-blur-md border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white ml-1">OUNDU</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Hire Freelancer</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">Find Best Match</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">For Startups</a>
            <a href="/" className="text-white hover:text-blue-300 transition-colors text-sm font-medium">About Us</a>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
          >
            Home
          </button>
        </div>
      </div>
    </nav>
  )

  // Footer Component
  const Footer = () => (
    <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
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
      <section className="pt-24 pb-32 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Translucent Box Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-0 max-w-6xl mx-auto relative min-h-[600px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[600px]">
              {/* Left Side - Empty (50% of translucent box) */}
              <div className="hidden lg:block"></div>

              {/* Right Side - Login/Signup Form (50% of translucent box) */}
              <div className="bg-gray-900/40 backdrop-blur-sm border-l border-gray-700/50 rounded-r-2xl p-10 w-full h-full flex flex-col justify-center">
                {/* Heading */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isLogin ? 'Sign in to continue to Foundu' : 'Sign up to get started with Foundu'}
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-5">
                  {!isLogin && (
                    <div>
                      <input
                        type="text"
                        className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  )}
                  
                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 pl-12 pr-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2 w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500" />
                        <span className="text-gray-300 text-sm">Remember me</span>
                      </label>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">Forgot password?</a>
                    </div>
                  )}

                  {/* Login/Sign Up Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isLogin ? 'Login' : 'Sign Up'}
                  </button>
                </form>

                {/* New User / Already have account */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {isLogin ? 'New user? ' : 'Already have an account? '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      {isLogin ? 'Create new account' : 'Login'}
                    </button>
                  </p>
                </div>

                {/* Social Login */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900/40 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm font-medium">GitHub</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default LoginSignup

