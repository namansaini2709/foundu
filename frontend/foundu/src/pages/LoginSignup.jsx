import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
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

