import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { X, Loader2, Building2, Star, CheckCircle } from 'lucide-react';
import blueBadge from '../assets/blue-badge.jpg';
import greenBadge from '../assets/green-badge.jpg';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api`;
const gradientBlackToBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
};
const BlueTickStatusBadge = ({ status, verified }) => {
    if (verified) return (
        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/50 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            <img src={blueBadge} alt="Blue Check" className="w-3 h-3 rounded-full" /> Blue Tick Verified 
        </span>
    );
    if (status === 'pending') return (
        <span className="inline-flex items-center gap-1.5 bg-yellow-500/15 border border-yellow-400/40 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full">
            <Loader2 size={12} className="animate-spin" /> Under Review — Pending
        </span>
    );
    if (status === 'rejected') return (
        <span className="inline-flex items-center gap-1.5 bg-red-500/15 border border-red-400/40 text-red-300 text-xs font-bold px-3 py-1 rounded-full">
            <X size={12} /> Rejected — Resubmit
        </span>
    );
    return null;
};
const FounderBadges = () => {
    const [isModalOpen, setIsModalOpen]       = useState(false);
    const [submitting, setSubmitting]         = useState(false);
    const [blueTickStatus, setBlueTickStatus] = useState(null);
    const [blueTickVerified, setBlueTickVerified] = useState(false);
    const [greenTickVerified, setGreenTickVerified] = useState(false);
    // Founder-specific fields
    const [formData, setFormData] = useState({
        companyLinkedin: '',
        companySocial:   '',
        dpiitNumber:     '',
        profilePhoto:    null
    });
    const userId = localStorage.getItem('user_id');
    /* Load existing status on mount */
    useEffect(() => {
        if (!userId) return;
        axios.get(`${API}/user-socials/${userId}`, { withCredentials: true })
            .then(res => {
                const d = res.data.data;
                if (d) {
                    setFormData({
                        companyLinkedin: d.company_linkedin_url         || '',
                        companySocial:   d.company_social_url           || '',
                        dpiitNumber:     d.company_registration_number  || '',
                        profilePhoto:    d.profile_picture_url          || null
                    });
                    setBlueTickStatus(d.blue_tick_status);
                    setBlueTickVerified(!!d.blue_tick_verified);
                    setGreenTickVerified(!!d.green_tick_verified);
                }
            })
            .catch(() => {});
    }, [userId]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };
    const handleSave = async () => {
        if (!formData.companyLinkedin) return toast.error('Company LinkedIn URL is required', { theme: 'dark' });
        if (!formData.dpiitNumber)     return toast.error('DPIIT / Registration Number is required', { theme: 'dark' });
        if (!userId)                   return toast.error('You must be logged in', { theme: 'dark' });
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append('user_id', userId);
            data.append('company_linkedin_url', formData.companyLinkedin);
            data.append('company_social_url', formData.companySocial);
            data.append('company_registration_number', formData.dpiitNumber);
            if (formData.profilePhoto instanceof File) {
                data.append('profile_picture', formData.profilePhoto);
            } else if (formData.profilePhoto) {
                data.append('profile_picture_url', formData.profilePhoto);
            }
            // Save company social details to users_socials
            await axios.post(`${API}/user-socials`, data, { 
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Apply for Blue Tick
            await axios.post(`${API}/badges/apply/blue`, { user_id: userId }, { withCredentials: true });
            setBlueTickStatus('pending');
            setIsModalOpen(false);
            toast.success('Verification submitted! Under review by admin.', { theme: 'dark' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed', { theme: 'dark' });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen text-white flex flex-col" style={gradientBlackToBlue}>
            <div className="flex-grow pt-24 px-4 pb-12 max-w-7xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    <span className="text-white">FOUNDER </span>
                    <span className="text-blue-300">BADGES</span>
                </h1>
                <div className="flex flex-col gap-6 mb-16">
                    {/* Blue Tick Badge */}
                    <div className="bg-gray-800/40 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-blue-400 transition-all">
                        <div className="flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 ${blueTickVerified ? 'bg-blue-500 shadow-blue-500/50 border-blue-400' : 'bg-gray-700 shadow-gray-700/30 border-gray-600'}`}>
                                <img src={blueBadge} alt="Blue Badge" className={`w-full h-full object-cover ${!blueTickVerified && 'opacity-40 grayscale'}`} />
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                                <h3 className="text-xl font-bold text-blue-300">Verification Badge</h3>
                                <BlueTickStatusBadge status={blueTickStatus} verified={blueTickVerified} />
                            </div>
                            <p className="text-gray-300 text-sm">
                                Verify your company by linking your Company LinkedIn and providing your DPIIT / Company Registration Number.
                            </p>
                            {blueTickStatus === 'pending'  && <p className="text-yellow-400/80 text-xs mt-1">⏳ Your submission is under manual review.</p>}
                            {blueTickStatus === 'rejected' && <p className="text-red-400/80 text-xs mt-1">❌ Rejected. Please update your details and resubmit.</p>}
                            {blueTickVerified              && <p className="text-blue-400/80 text-xs mt-1">🎉 Your company is Blue Tick verified.</p>}
                        </div>
                        <div className="flex-shrink-0">
                            {blueTickVerified ? (
                                <button disabled className="bg-blue-500/30 border border-blue-400/30 text-blue-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed">✅ Verified</button>
                            ) : blueTickStatus === 'pending' ? (
                                <button disabled className="bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Pending
                                </button>
                            ) : (
                                <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                                    {blueTickStatus === 'rejected' ? 'Resubmit' : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Green Tick Badge */}
                    <div className="bg-gray-800/40 backdrop-blur-md border border-green-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-green-400 transition-all">
                        <div className="flex-shrink-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 ${greenTickVerified ? 'bg-green-500 shadow-green-500/50 border-green-400' : 'bg-gray-700 shadow-gray-700/30 border-gray-600'}`}>
                                <img src={greenBadge} alt="Green Badge" className={`w-full h-full object-cover ${!greenTickVerified && 'opacity-40 grayscale'}`} />
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-xl font-bold text-green-300 mb-2">Active Recruiter Badge</h3>
                            <p className="text-gray-300">Automatically awarded when you have posted 3 or more jobs on the platform. Shows reliability to candidates.</p>
                        </div>
                        <div className="flex-shrink-0">
                            {greenTickVerified ? (
                                <button disabled className="bg-green-500/30 border border-green-400/30 text-green-300 px-8 py-3 rounded-lg font-semibold cursor-not-allowed">
                                    ✅ Awarded
                                </button>
                            ) : (
                                <button disabled className="bg-green-500/20 border border-green-500/30 text-green-400 px-8 py-3 rounded-lg font-semibold cursor-not-allowed text-sm">
                                    🤖 Auto-Awarded
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Credibility Score */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        <span className="text-white">CREDIBILITY </span><span className="text-blue-300">SCORE</span>
                    </h2>
                    <div className="flex flex-col gap-6">
                        {[
                            { range: '90-95', label: 'Exceptional', color: 'text-purple-400', bgColor: 'bg-purple-500', border: 'border-purple-500/50', criteria: '4.9+ Stars & 50+ Reviews', perks: 'Top 1% Search Ranking' },
                            { range: '85-90', label: 'Excellent',   color: 'text-blue-400',   bgColor: 'bg-blue-500',   border: 'border-blue-500/50',   criteria: '4.7+ Stars & 30+ Reviews', perks: 'Highlighted Profile' },
                            { range: '80-85', label: 'Very Good',   color: 'text-green-400',  bgColor: 'bg-green-500',  border: 'border-green-500/50',  criteria: '4.5+ Stars & 15+ Reviews', perks: 'Verified Status' },
                            { range: 'Below 80', label: 'Good',     color: 'text-gray-400',   bgColor: 'bg-gray-500',   border: 'border-gray-500/50',   criteria: '4.0+ Stars & 5+ Reviews',  perks: 'Standard Access' }
                        ].map((item, index) => (
                            <div key={index} className={`bg-gray-800/40 backdrop-blur-md border ${item.border} rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.01] transition-all duration-300`}>
                                <div className="flex-shrink-0">
                                    <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center`}><Star size={32} className="text-white" /></div>
                                </div>
                                <div className="flex-grow flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                                    <div className="text-center md:text-left min-w-[140px]">
                                        <h3 className={`text-2xl font-bold ${item.color} mb-1`}>{item.range}</h3>
                                        <p className="text-white font-semibold">{item.label}</p>
                                    </div>
                                    <div className="hidden md:block h-12 w-px bg-gray-700/50" />
                                    <div className="text-center md:text-left flex-1">
                                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Criteria</div>
                                        <div className="text-gray-300 text-sm font-medium">{item.criteria}</div>
                                    </div>
                                    <div className="hidden md:block h-12 w-px bg-gray-700/50" />
                                    <div className="text-center md:text-left flex-1">
                                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Benefits</div>
                                        <div className="text-gray-300 text-sm font-medium">{item.perks}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
            {/* Modal — Founder specific fields */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)} />
                    <div className="bg-gray-900 border border-blue-500/50 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl shadow-blue-900/50">
                        <button onClick={() => !submitting && setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            <Building2 className="text-blue-500" /> Verify Company
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">Submit your company details for manual review by the FoundU team.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Company LinkedIn URL <span className="text-red-400">*</span></label>
                                <input type="url" name="companyLinkedin" value={formData.companyLinkedin} onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    placeholder="https://linkedin.com/company/your-startup" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Company Instagram / Facebook URL</label>
                                <input type="url" name="companySocial" value={formData.companySocial} onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    placeholder="https://instagram.com/your-startup" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">DPIIT / Company Registration Number <span className="text-red-400">*</span></label>
                                <input type="text" name="dpiitNumber" value={formData.dpiitNumber} onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    placeholder="e.g. DIPP12345 or CIN number" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Founder Profile Photo</label>
                                <div className="flex items-center gap-3">
                                    <input type="file" name="profilePhoto" accept="image/*" onChange={handleFileChange}
                                        className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white" />
                                    {formData.profilePhoto && (
                                        <div className="w-10 h-10 rounded-full border border-gray-600 overflow-hidden shrink-0">
                                            <img src={formData.profilePhoto instanceof File ? URL.createObjectURL(formData.profilePhoto) : `${API.replace('/api', '')}${formData.profilePhoto}`} 
                                                alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3">
                            <button onClick={() => !submitting && setIsModalOpen(false)} disabled={submitting}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={submitting}
                                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Save & Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="top-right" theme="dark" />
        </div>
    );
};
export default FounderBadges;
