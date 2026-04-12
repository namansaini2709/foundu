import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'
import Footer from '../components/Footer'
import api from '../utils/axiosConfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AnimatedCardVisual from '../components/ui/AnimatedCardVisual'
const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
function LoginSignup() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [userType, setUserType] = useState('') // Start empty to force selection
  const authStatus = searchParams.get('auth')
  const [isLogin, setIsLogin] = useState(true)

  // 🚨 SUCCESS REDIRECT: Immediate redirect if success is in URL
  if (authStatus === 'success') {
    const t = searchParams.get('redirect') || '/';
    console.log("[Auth] Google Success! Redirecting to:", t);
    localStorage.setItem('auth_sync_pending', 'true');
    window.location.href = t; // Use .href for more reliable bounce
    return null;
  }

  // 🚨 ALREADY LOGGED IN: If user is already authenticated, don't show the login page
  const loggedInUserId = localStorage.getItem('user_id');
  const loggedInUserType = localStorage.getItem('user_type');
  if (loggedInUserId && loggedInUserType && !authStatus) {
    const isComplete = localStorage.getItem('is_profile_complete') === '1';
    let target = '/';
    if (!isComplete) {
      if (loggedInUserType === 'freelancer') target = '/freelancer-profile';
      else if (loggedInUserType === 'cofounder') target = '/cofounder-profile';
      else if (loggedInUserType === 'founder') target = '/startup-profile';
    } else {
      if (loggedInUserType === 'freelancer') target = '/freelancer-dashboard';
      else if (loggedInUserType === 'cofounder') target = '/cofounder-dashboard';
      else if (loggedInUserType === 'founder') target = '/startup-dashboard';
      else if (loggedInUserType === 'influencer') target = '/influencer-marketplace';
    }
    window.location.replace(target);
    return null;
  }

  // Handle incoming auth status from Social Redirects (Errors & No Account)
  useEffect(() => {
    if (authStatus === 'no_account') {
      toast.error('No account found for this Google email. Please Sign Up first!', {
        theme: 'dark'
      });
      setIsLogin(false);
      // Clean URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('auth');
      setSearchParams(newParams);
    } else if (authStatus === 'error') {
      // Only show error if we aren't actually logged in
      if (!localStorage.getItem('user_id')) {
        toast.error('Authentication failed. Please try again.', { theme: 'dark' });
      }
    }
  }, [authStatus]);

  // 🚨 AUTO-EXIT GUARD: If we detect login data arrival while on this page, GET OUT!
  useEffect(() => {
    const checkAndExit = () => {
      const uid = localStorage.getItem('user_id');
      const utype = localStorage.getItem('user_type');
      
      if (uid && utype && !authStatus) {
        console.log("[Auth] Already logged in detect, redirecting...");
        const isComplete = localStorage.getItem('is_profile_complete') === '1';
        let target = '/';
        if (!isComplete) {
          if (utype === 'freelancer') target = '/freelancer-profile';
          else if (utype === 'cofounder') target = '/cofounder-profile';
          else if (utype === 'founder') target = '/startup-profile';
        } else {
          if (utype === 'freelancer') target = '/freelancer-dashboard';
          else if (utype === 'cofounder') target = '/cofounder-dashboard';
          else if (utype === 'founder') target = '/startup-dashboard';
          else if (utype === 'influencer') target = '/influencer-marketplace';
        }
        window.location.href = target;
      }
    };

    checkAndExit();
    // Also check on interval for a few seconds just in case of race conditions
    const interval = setInterval(checkAndExit, 500);
    return () => clearInterval(interval);
  }, [authStatus]);
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const userTypeNames = {
    cofounder: 'Co-founder',
    freelancer: 'Freelancer',
    founder: 'Founder'
  }
  const userTypeName = userTypeNames[userType] || 'User'
  const isValidEmail = (email) => email.includes('@') && email.includes('.')
  const redirectByTypeOnSignup = (type) => {
    const userTypeLower = type.toLowerCase()
    if (userTypeLower === 'freelancer') navigate('/freelancer-profile')
    else if (userTypeLower === 'cofounder') navigate('/cofounder-profile')
    else if (userTypeLower === 'founder') navigate('/startup-profile')
    else if (userTypeLower === 'influencer') navigate('/influencer-marketplace')
    else navigate('/')
  }
  const redirectByTypeOnLogin = (type) => {
    const userTypeLower = type.toLowerCase()
    if (userTypeLower === 'freelancer') navigate('/freelancer-jobs')
    else if (userTypeLower === 'cofounder') navigate('/cofounder-jobs')
    else if (userTypeLower === 'founder') navigate('/startup-services')
    else if (userTypeLower === 'influencer') navigate('/influencer-marketplace')
    else navigate('/')
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
        // ── ADMIN LOGIN ────────────────────────────────────
        if (email === 'admin@gmail.com') {
          try {
            const adminRes = await api.post(`/api/admin/login`, { email, password });
            if (adminRes.data.success) {
              localStorage.setItem('is_admin', 'true');
              localStorage.setItem('admin_name', adminRes.data.admin?.name || 'Admin');
              if (adminRes.data.token) localStorage.setItem('token', adminRes.data.token);

              toast.success('Welcome, Admin!', { theme: 'dark' });
              setTimeout(() => {
                window.location.href = '/admin/dashboard';
              }, 1000);
              return;
            }
          } catch (adminErr) {
            // If it's not a valid admin, fall through to normal login
            console.log("Not an admin or admin login failed, trying normal login...");
          }
        }

        // ── NORMAL LOGIN ────────────────────────────────────
        const res = await api.post(`/api/login`, {
          email,
          password
        })

        const userData = res.data.user;
        if (!userData || !userData.id) throw new Error("Invalid response");

        // Use the unified sync guard to show the loader and prevent toasts
        localStorage.setItem('auth_sync_pending', 'true');
        localStorage.removeItem('token');

        // Store basic data synchronously for the bridge
        localStorage.setItem('user_id', String(userData.id));
        localStorage.setItem('user_type', userData.user_type);
        if (userData.token) localStorage.setItem('token', userData.token);

        toast.success(res.data.message || 'Login successful', { theme: 'dark' })

        // Login always goes to Dashboard (unless profile is critically incomplete)
        const type = userData.user_type.toLowerCase();
        let target = '/';
        
        if (type === 'freelancer') target = '/freelancer-dashboard';
        else if (type === 'cofounder') target = '/cofounder-dashboard';
        else if (type === 'founder') target = '/startup-dashboard';
        else if (type === 'influencer') target = '/influencer-marketplace';

        // Full reload to target to ensure clean state and trigger sync
        window.location.href = target;
      } else {
        // ... Signup Block ...
        if (!userType) {
          return toast.error('Please select your role (Freelancer, Founder, etc.)', { theme: 'dark' });
        }

        const validUserType = ['freelancer', 'founder', 'cofounder', 'influencer'].includes(userType)
          ? userType
          : 'freelancer'

        await api.post(`/api/signup`, {
          full_name: fullName,
          email,
          password,
          user_type: validUserType
        })

        // Auto-login after signup
        const loginRes = await api.post(`/api/login`, {
          email,
          password
        })

        const userData = loginRes.data.user;
        if (!userData) throw new Error("Auto-login failed");

        localStorage.setItem('auth_sync_pending', 'true');
        localStorage.setItem('user_id', String(userData.id));
        localStorage.setItem('user_type', userData.user_type);
        if (loginRes.data.token) localStorage.setItem('token', loginRes.data.token);

        toast.success('Signup successful', { theme: 'dark' })

        // New users always go to profile completion
        const type = userData.user_type.toLowerCase();
        let target = '/';
        if (type === 'freelancer') target = '/freelancer-profile';
        else if (type === 'cofounder') target = '/cofounder-profile';
        else if (type === 'founder') target = '/startup-profile';

        window.location.href = target;
      }
    } catch (err) {
      console.error('Login/Signup error:', err)
      toast.error(err.response?.data?.message || 'Something went wrong', {
        theme: 'dark'
      })
    }
  }
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      return toast.error('Email is required', { theme: 'dark' })
    }
    if (!isValidEmail(resetEmail)) {
      return toast.error('Invalid email format', { theme: 'dark' })
    }
    try {
      await api.post(`/api/forgot-password`, {
        email: resetEmail
      })
      toast.success('Password reset link sent to your email', { theme: 'dark' })
      setResetEmail('')
      setTimeout(() => {
        setIsForgotPassword(false)
        setIsLogin(true)
      }, 2000)
    } catch (err) {
      console.error('Forgot password error:', err)
      toast.error(err.response?.data?.message || 'Something went wrong', {
        theme: 'dark'
      })
    }
  }
  const handleGoogleLogin = () => {
    // Redirect the entire window to the backend auth route
    // STRICT MODE: We pass the mode (login or signup) to avoid accidental account creation
    const mode = isLogin ? 'login' : 'signup';
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    window.location.href = `${backendUrl}/api/auth/google?type=${userType}&mode=${mode}`;
  };

  return (
    <div className="min-h-screen" >
      <section className="min-h-screen flex items-center justify-center p-4 pt-20 pb-20">
        <div className="w-full max-w-6xl bg-transparent rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-800">
          {/* Left Column - Animated Visual */}
          <div className="hidden md:block w-1/2 relative">
            <AnimatedCardVisual />
          </div>
          {/* Right Column - Login Form */}
          <div className="w-full md:w-1/2 bg-transparent flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
            <div className="max-w-md w-full mx-auto">
              {/* Forgot Password View */}
              {isForgotPassword ? (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Reset Password
                    </h1>
                    <p className="text-gray-400 text-sm">
                      Enter your email to receive a password reset link
                    </p>
                  </div>
                  <form className="space-y-6" onSubmit={handleForgotPassword}>
                    <div>
                      <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="email"
                          className="w-full px-4 py-3.5 pl-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                    >
                      Send Reset Link
                    </button>
                  </form>
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false)
                        setIsLogin(true)
                        setResetEmail('')
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm"
                    >
                      Back to Login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Login/Signup View */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      {isLogin
                        ? 'Sign in to continue to Foundu'
                        : `Sign up as ${userTypeName} to get started with Foundu`}
                    </p>
                  </div>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {!isLogin && (
                      <div>
                        <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3.5 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="email"
                          className="w-full px-4 py-3.5 pl-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                          placeholder={isLogin ? "Enter your password" : "Min 6 characters"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    {!isLogin && (
                      <div>
                        <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3.5 pl-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    {!isLogin && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                          I am a...
                        </label>
                        <div className="relative group">
                          <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                            className="w-full px-4 py-3.5 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select your role...</option>
                            <option value="freelancer">Freelancer - Looking for exciting projects</option>
                            <option value="founder">Startup / Founder - Looking for talent</option>
                            <option value="cofounder">Co-founder - Looking for a business partner</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    )}
                    {isLogin && (
                      <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            Remember me
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true)
                            setEmail('')
                            setPassword('')
                          }}
                          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98] mt-6"
                    >
                      {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                  </form>
                  <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                      {isLogin ? 'New user? ' : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin)
                          setFullName('')
                          setEmail('')
                          setPassword('')
                          setConfirmPassword('')
                        }}
                        className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1"
                      >
                        {isLogin ? 'Create account' : 'Sign in'}
                      </button>
                    </p>
                  </div>
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-transparent text-gray-500 font-medium">Or continue with</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1A1F2C] border border-gray-700/50 text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 group font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1A1F2C] border border-gray-700/50 text-white hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 group font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </div>
  )
}
export default LoginSignup