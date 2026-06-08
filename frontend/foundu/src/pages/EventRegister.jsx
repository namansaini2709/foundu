import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    User, 
    Phone, 
    Mail, 
    Briefcase, 
    Layers, 
    Wallet, 
    ShieldCheck, 
    CreditCard 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axiosConfig';
import { fetchCurrentUser } from '../utils/authUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const EventRegister = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        phoneNumber: '',
        emailId: '',
        role: '',
        startupName: '',
        startupStage: ''
    });

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const res = await api.get(`/api/events/${id}`);
                if (res.data.success) {
                    setEvent(res.data.event);
                } else {
                    toast.error("Event not found.");
                    navigate('/event-marketplace');
                }
            } catch (error) {
                console.error("Failed to fetch event details:", error);
                toast.error("Could not load event information.");
                navigate('/event-marketplace');
            } finally {
                setLoadingEvent(false);
            }
        };

        const loadUserAndCheckReg = async () => {
            try {
                // Check if user is already registered first
                const regRes = await api.get(`/api/events/${id}/registration-status`);
                if (regRes.data.success && regRes.data.registered) {
                    toast.info("You are already registered for this event.");
                    navigate(`/event-detail/${id}`);
                    return;
                }

                // Prefill user data
                const user = await fetchCurrentUser();
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        userName: user.full_name || '',
                        emailId: user.email || '',
                        phoneNumber: user.whatsapp_number || ''
                    }));
                }
            } catch (err) {
                console.error("Auth status loading failed:", err);
            }
        };

        fetchEventDetails();
        loadUserAndCheckReg();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setFormData(prev => ({
            ...prev,
            role: selectedRole,
            // Reset startup fields if Investor is chosen
            startupName: selectedRole === 'investor' ? '' : prev.startupName,
            startupStage: selectedRole === 'investor' ? 'Not Applicable' : (prev.startupStage === 'Not Applicable' ? '' : prev.startupStage)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations
        if (!formData.userName.trim()) return toast.error("Full Name is required");
        if (!formData.phoneNumber.trim()) return toast.error("Phone Number is required");
        if (!formData.emailId.trim()) return toast.error("Email ID is required");
        if (!formData.role) return toast.error("Please select your Role");
        if (formData.role !== 'investor' && !formData.startupName.trim()) {
            return toast.error("Startup/Company Name is required");
        }
        if (formData.role !== 'investor' && !formData.startupStage) {
            return toast.error("Please select your Startup Stage");
        }

        setSubmitting(true);
        const loadToast = toast.loading('Confirming your registration...', { theme: 'dark' });

        try {
            // Call backend to save completed registration details directly (free of charge)
            const registerRes = await api.post('/api/events/register', {
                event_id: id,
                user_name: formData.userName,
                phone_number: formData.phoneNumber,
                email_id: formData.emailId,
                role: formData.role,
                startup_name: formData.role === 'investor' ? null : formData.startupName,
                startup_stage: formData.role === 'investor' ? 'Not Applicable' : formData.startupStage
            });

            if (registerRes.data.success) {
                toast.dismiss(loadToast);
                toast.success('🎉 Registration Confirmed! See you at the event.', { theme: 'dark', autoClose: 4000 });
                navigate(`/event-detail/${id}`);
            } else {
                throw new Error(registerRes.data.message || 'Registration failed');
            }

        } catch (error) {
            console.error("Registration error:", error);
            toast.dismiss(loadToast);
            toast.error(error.response?.data?.message || error.message || 'Failed to submit registration.', { theme: 'dark' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingEvent) {
        return (
            <div className="min-h-screen bg-[#020024] text-white flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center py-40">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading registration desk...</p>
                </div>
                <Footer />
            </div>
        );
    }

    const showStartupFields = formData.role && formData.role !== 'investor';

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col justify-between selection:bg-purple-500/30">
            <Navbar />

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 flex-grow w-full">
                
                {/* Back button */}
                <button 
                    onClick={() => navigate(`/event-detail/${id}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/30 text-xs font-bold uppercase tracking-widest transition-all mb-8 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4 text-purple-400" /> Back to Event
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
                >
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Event Ticket Checkout</span>
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                            Register for {event.event_name}
                        </h1>
                        <p className="text-xs text-gray-400 max-w-lg mx-auto">
                            Fill in your attendee information to secure your spot at the event.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Attendee details section */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-purple-400/80 mb-2">Attendee Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Attendee Name *</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                                        <input 
                                            type="text" 
                                            name="userName" 
                                            value={formData.userName} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm" 
                                            placeholder="Enter your full name" 
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone Number (WhatsApp) *</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                                        <input 
                                            type="tel" 
                                            name="phoneNumber" 
                                            value={formData.phoneNumber} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm" 
                                            placeholder="e.g. +91 9876543210" 
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Address *</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                                        <input 
                                            type="email" 
                                            name="emailId" 
                                            value={formData.emailId} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm" 
                                            placeholder="you@example.com" 
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional details section */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-purple-400/80 mb-2">Professional Role & Status</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Your Role *</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none transition-colors" />
                                        <select 
                                            name="role" 
                                            value={formData.role} 
                                            onChange={handleRoleChange} 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 pr-10 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="" disabled className="bg-[#020024]">Select your role...</option>
                                            <option value="founder" className="bg-[#020024]">Founder</option>
                                            <option value="cofounder" className="bg-[#020024]">Co-Founder</option>
                                            <option value="investor" className="bg-[#020024]">Investor</option>
                                            <option value="building something" className="bg-[#020024]">Building Something</option>
                                        </select>
                                    </div>
                                </div>

                                {showStartupFields && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Startup / Company Name *</label>
                                        <input 
                                            type="text" 
                                            name="startupName" 
                                            value={formData.startupName} 
                                            onChange={handleInputChange} 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm" 
                                            placeholder="Enter your startup/startup idea name" 
                                            required
                                        />
                                    </motion.div>
                                )}

                                {showStartupFields && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="md:col-span-2"
                                    >
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Startup Stage *</label>
                                        <div className="relative group">
                                            <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none transition-colors" />
                                            <select 
                                                name="startupStage" 
                                                value={formData.startupStage} 
                                                onChange={handleInputChange} 
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 pr-10 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm appearance-none cursor-pointer"
                                                required
                                            >
                                                <option value="" disabled className="bg-[#020024]">Select startup stage...</option>
                                                <option value="Ideation" className="bg-[#020024]">Ideation</option>
                                                <option value="MVP" className="bg-[#020024]">MVP</option>
                                                <option value="Early Traction" className="bg-[#020024]">Early Traction</option>
                                                <option value="Scaling" className="bg-[#020024]">Scaling</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Confirm Registration
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-500 uppercase font-black tracking-wider">
                                <ShieldCheck className="w-4 h-4 text-purple-500" /> FREE Entry Verified
                            </div>
                        </div>

                    </form>

                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default EventRegister;
