import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    MapPin,
    Tag,
    Zap,
    Search,
    Filter,
    ArrowRight,
    Star,
    Globe,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserId } from '../utils/authUtils';

const EventMarketplace = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Global Tech Summit 2026",
            organizer: "NextGen Ventures",
            date: "Oct 24, 2026",
            location: "Bangalore, India",
            attendees: "5000+",
            category: "Technology",
            description: "The largest tech gathering of the year focusing on AI and deep tech.",
            color: "blue"
        },
        {
            id: 2,
            title: "SaaS Founders Meetup",
            organizer: "FoundU Ecosystem",
            date: "Nov 12, 2026",
            location: "Online / Virtual",
            attendees: "1200",
            category: "Networking",
            description: "Join fellow SaaS founders for a day of networking and growth hacks.",
            color: "purple"
        },
        {
            id: 3,
            title: "AgriTech Expo",
            organizer: "Green Earth Org",
            date: "Dec 05, 2026",
            location: "Delhi, India",
            attendees: "3500",
            category: "Agriculture",
            description: "Showcasing the future of sustainable farming and food technology.",
            color: "green"
        }
    ]);

    useEffect(() => {
        // Mocking API delay
        setTimeout(() => setLoading(false), 800);
    }, []);

    const filteredEvents = events.filter((ev) =>
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-8"
                    >
                        <Zap className="w-4 h-4 fill-purple-400" />
                        Community Hub
                    </motion.div> */}
                    <h1 className="text-4xl md:text-8xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 uppercase italic">
                        Event Marketplace
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Discover and promote high-impact startup events. From local meetups to global summits, find your next big opportunity.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 mb-12">
                <div className="max-w-7xl mx-auto py-6 px-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by event name, city, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold tracking-tight"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/promote-event")}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-500/20 flex items-center gap-3 whitespace-nowrap"
                    >
                        List My Event <Calendar className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="px-6 pb-24 flex-grow">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Scanning Ecosystem...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-white mb-2 uppercase">No events found</h3>
                            <p className="text-gray-400 font-medium">Be the first to list an event in this category!</p>
                        </div>
                    ) : filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="group bg-white/5 border border-white/5 rounded-[3rem] p-10 hover:border-purple-500/30 transition-all duration-500 hover:bg-white/[0.07] flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`p-4 rounded-2xl bg-purple-500/10 text-purple-400`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    {event.category}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                                {event.title}
                            </h3>

                            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 flex-grow">
                                {event.description}
                            </p>

                            <div className="space-y-4 mb-10 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                    <MapPin className="w-4 h-4 text-purple-500" />
                                    {event.location}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-300">
                                        <Users className="w-4 h-4 text-purple-500" />
                                        {event.attendees} Expected
                                    </div>
                                    <span className="text-[10px] font-black text-purple-400 tracking-widest uppercase">
                                        {event.date}
                                    </span>
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] tracking-widest uppercase group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 flex items-center justify-center gap-2">
                                Event Details <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Required for motion since it's used in the template style
import { motion } from 'framer-motion';

export default EventMarketplace;
