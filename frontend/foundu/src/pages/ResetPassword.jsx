import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Footer from '../components/Footer'
import api from '../utils/axiosConfig'
import { toast } from 'react-toastify'
import AnimatedCardVisual from '../components/ui/AnimatedCardVisual'
function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newPassword || !confirmPassword) {
            return toast.error('All fields are required', { theme: 'dark' })
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters', { theme: 'dark' })
        }
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match', { theme: 'dark' })
        }
        setLoading(true)
        try {
            const res = await api.post(`/api/reset-password`, {
                token,
                newPassword
            })
            if (res.data.success) {
                toast.success(res.data.message || 'Password reset successful', { theme: 'dark' })
                setTimeout(() => {
                    navigate('/login-signup')
                }, 3000)
            } else {
                toast.error(res.data.message || 'Failed to reset password', { theme: 'dark' })
            }
        } catch (err) {
            console.error('Reset password error:', err)
            toast.error(err.response?.data?.message || 'Something went wrong', {
                theme: 'dark'
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen">
            <section className="min-h-screen flex items-center justify-center p-4 pt-20 pb-20">
                <div className="w-full max-w-6xl bg-transparent rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-800">
                    {/* Left Column - Animated Visual */}
                    <div className="hidden md:block w-1/2 relative">
                        <AnimatedCardVisual />
                    </div>
                    {/* Right Column - Reset Form */}
                    <div className="w-full md:w-1/2 bg-transparent flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
                        <div className="max-w-md w-full mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Create New Password
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Please enter your new password below.
                                </p>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                            placeholder="Min 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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
                                <div>
                                    <label className="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wider">
                                        Confirm New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-3.5 pl-12 rounded-xl bg-[#1A1F2C] border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
export default ResetPassword
