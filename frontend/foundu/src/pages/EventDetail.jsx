import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Calendar, 
    MapPin, 
    Clock,
    User, 
    Mail, 
    Phone, 
    ArrowLeft, 
    ExternalLink, 
    Tag,
    Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axiosConfig';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020024] text-white flex flex-col justify-between">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center py-40">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Event Intel...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!event) return null;

    // Parse target audience
    let audienceTags = [];
    try {
        const aud = typeof event.target_audience === 'string' 
            ? JSON.parse(event.target_audience) 
            : event.target_audience;
        if (Array.isArray(aud)) {
            audienceTags = aud;
        } else if (aud) {
            audienceTags = [aud];
        }
    } catch(e) {
        console.error("Error parsing target audience:", e);
    }

    // Format Date
    const d = new Date(event.event_date);
    const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Format deadline
    const dl = event.registration_deadline ? new Date(event.registration_deadline) : null;
    const formattedDeadline = dl ? dl.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col justify-between">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 flex-grow w-full">
                
                {/* Back button */}
                <button 
                    onClick={() => navigate('/event-marketplace')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/30 text-xs font-bold uppercase tracking-widest transition-all mb-12 hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4 text-purple-400" /> Back to Marketplace
                </button>

                {/* Split grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Flyer image */}
                    <div className="lg:col-span-5 w-full">
                        <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl p-3">
                            {event.flyer_url ? (
                                <img 
                                    src={getImageUrl(event.flyer_url)} 
                                    alt={event.event_name} 
                                    className="w-full h-auto object-contain rounded-2xl max-h-[80vh] mx-auto shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" 
                                />
                            ) : (
                                <div className="w-full aspect-[4/5] bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center rounded-2xl">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">No flyer uploaded</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Event info */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
                            
                            {/* Header details */}
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
                                    {event.event_name}
                                </h1>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {audienceTags.map((tag) => (
                                        <span 
                                            key={tag} 
                                            className="bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => window.open(event.registration_link, '_blank')}
                                    className="px-8 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3 w-full sm:w-auto hover:scale-[1.01] duration-300"
                                >
                                    Register Now <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>

                            {/* About the Event */}
                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-purple-400">
                                    About The Event
                                </h3>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                                    {event.brief}
                                </p>
                            </div>

                            {/* Schedule & Venue Details */}
                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-purple-400">
                                    Schedule & Venue
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                        <Calendar className="w-5 h-5 text-purple-500 shrink-0" />
                                        <div>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block">Date</span>
                                            <span className="text-xs md:text-sm font-bold text-gray-200">{formattedDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                        <Clock className="w-5 h-5 text-purple-500 shrink-0" />
                                        <div>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block">Time</span>
                                            <span className="text-xs md:text-sm font-bold text-gray-200">{event.event_time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl md:col-span-2">
                                        <MapPin className="w-5 h-5 text-purple-500 shrink-0" />
                                        <div>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block">Location / Venue</span>
                                            <span className="text-xs md:text-sm font-bold text-gray-200">{event.location}</span>
                                        </div>
                                    </div>
                                    {formattedDeadline && (
                                        <div className="flex items-center gap-3.5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl md:col-span-2">
                                            <Zap className="w-5 h-5 text-purple-500 shrink-0" />
                                            <div>
                                                <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block">Registration Deadline</span>
                                                <span className="text-xs md:text-sm font-bold text-gray-200">{formattedDeadline}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            {(event.organizer_name || event.organizer_email || event.organizer_number) && (
                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-purple-400">
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        {event.organizer_name && (
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-300">
                                                <User className="w-4.5 h-4.5 text-purple-500 shrink-0" />
                                                <span>{event.organizer_name}</span>
                                            </div>
                                        )}
                                        {event.organizer_email && (
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-300">
                                                <Mail className="w-4.5 h-4.5 text-purple-500 shrink-0" />
                                                <span className="break-all">{event.organizer_email}</span>
                                            </div>
                                        )}
                                        {event.organizer_number && (
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-gray-300">
                                                <Phone className="w-4.5 h-4.5 text-purple-500 shrink-0" />
                                                <span>{event.organizer_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;
