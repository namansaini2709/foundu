import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}

function LoginSignup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userType = searchParams.get('type') || 'user'
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const userTypeNames = {
    cofounder: 'Co-founder',
    freelancer: 'Freelancer',
    startup: 'Startup'
  }

  const userTypeName = userTypeNames[userType] || 'User'

  const isValidEmail = (email) => email.includes('@') && email.includes('.')

  const redirectByType = (type) => {
    if (type === 'freelancer') navigate('/freelancer-profile')
    if (type === 'cofounder') navigate('/cofounder-profile')
    if (type === 'startup') navigate('/startup-profile')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password || (!isLogin && (!fullName || !confirmPassword))) {
      return toast.error('All fields are required', { theme: 'dark' })
    }

    if (!isValidEmail(email)) {
      return toast.error('Invalid email format', { theme: 'dark' })
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters', { theme: 'dark' })
    }

    if (!isLogin && password !== confirmPassword) {
      return toast.error('Passwords do not match', { theme: 'dark' })
    }

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:4000/api/login', {
          email,
          password
        })

        localStorage.setItem('user_id', res.data.user.id)
        toast.success('Login successful', { theme: 'dark' })
        redirectByType(res.data.user.user_type)
      } else {
        await axios.post('http://localhost:4000/api/signup', {
          full_name: fullName,
          email,
          password,
          user_type: userType
        })

        const loginRes = await axios.post('http://localhost:4000/api/login', {
          email,
          password
        })

        localStorage.setItem('user_id', loginRes.data.user.id)
        toast.success('Signup successful', { theme: 'dark' })
        redirectByType(userType)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', {
        theme: 'dark'
      })
    }
  }

  return (
    <div className="min-h-screen" style={gradientBlackToBlue}>
      <Navbar />
      <section className="pt-24 pb-32 px-4 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-0 max-w-6xl mx-auto relative min-h-[600px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full min-h-[600px]">
              <div className="hidden lg:block"></div>

              <div className="bg-gray-900/40 backdrop-blur-sm border-l border-gray-700/50 rounded-r-2xl p-10 w-full h-full flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    {isLogin ? 'Sign in to continue to Foundu' : 'Sign up to get started with Foundu'}
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div>
                      <input
                        type="text"
                        className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 pl-12 pr-12 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isLogin ? 'Login' : 'Sign Up'}
                  </button>
                </form>

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
                    <button type="button" className="flex items-center justify-center px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 transition-colors">
                      Google
                    </button>
                    <button type="button" className="flex items-center justify-center px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white hover:bg-gray-700/50 transition-colors">
                      GitHub
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ToastContainer theme="dark" />
    </div>
  )
}

export default LoginSignup
