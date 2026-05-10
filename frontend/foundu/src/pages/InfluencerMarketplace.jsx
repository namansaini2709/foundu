import React from 'react';
import {
    Users,
    Instagram,
    Eye,
    Mail,
    IndianRupee,
    TrendingUp,
    Search,
    Filter,
    Star,
    Zap
} from 'lucide-react';
import Footer from '../components/Footer';

import api from '../utils/axiosConfig';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserId } from '../utils/authUtils';
import { API_BASE } from '../utils/axiosConfig';

const InfluencerMarketplace = () => {
    const navigate = useNavigate();
    const [influencers, setInfluencers] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [loading, setLoading] = React.useState(true);

    const handleContact = async (influencerUserId) => {
        const currentUserId = getUserId();
        
        if (!currentUserId) {
            return toast.error("Please login first to contact influencers.", { theme: 'dark' });
        }

        if (!influencerUserId) {
            return toast.error("This influencer account is not fully setup for chat yet.", { theme: 'dark' });
        }

        if (parseInt(currentUserId) === parseInt(influencerUserId)) {
            return toast.error("You cannot chat with yourself!", { theme: 'dark' });
        }

        try {
            const res = await api.post('/api/chat/create', { 
                otherUserId: influencerUserId,
                userId: parseInt(currentUserId)
            });
            
            if (res.data.chat_id || res.data.chatId) {
                const chatId = res.data.chat_id || res.data.chatId;
                window.dispatchEvent(new CustomEvent("open_chat", { detail: { userId: influencerUserId } }));
            }
        } catch (err) {
            console.error("Error creating chat:", err);
            toast.error("Failed to start chat. Please try again later.", { theme: 'dark' });
        }
    };

    React.useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const res = await api.get('/api/influencers/marketplace');
                if (res.data.success) {
                    setInfluencers(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching influencers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfluencers();
    }, []);

    const getGradient = (category) => {
        const lower = category?.toLowerCase() || '';
        if (lower.includes('tech')) return "from-blue-500 to-cyan-400";
        if (lower.includes('life') || lower.includes('beaut')) return "from-purple-500 to-pink-500";
        if (lower.includes('fit') || lower.includes('health')) return "from-orange-500 to-red-500";
        if (lower.includes('food') || lower.includes('cook')) return "from-green-500 to-emerald-400";
        if (lower.includes('travel')) return "from-indigo-500 to-blue-600";
        return "from-slate-500 to-gray-600";
    };

    const filteredInfluencers = influencers.filter((inf) => {
        const query = searchTerm.toLowerCase();
        return (
            inf.full_name?.toLowerCase().includes(query) ||
            inf.category?.toLowerCase().includes(query) ||
            inf.instagram_url?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col font-sans">

            {/* Header Section */}
            <div className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 animate-pulse">
                        <Zap className="w-4 h-4" />
                        Platform Exclusive
                    </div> */}
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 px-4">
                        Influencer Marketplace
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
                        Connect with top-tier creators to skyrocket your brand's visibility and reach the right audience instantly.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="px-6 mb-12">
                <div className="max-w-7xl mx-auto py-5 px-6 md:px-8 rounded-2xl md:rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:flex-1">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, handle, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setSearchTerm("")}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            Reset
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-600/20">
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="px-6 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className="text-gray-400 font-bold">Loading influencers...</p>
                        </div>
                    ) : filteredInfluencers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-white/10">
                            <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">No influencers found</h3>
                            <p className="text-gray-400">Try adjusting your search or filters.</p>
                        </div>
                    ) : filteredInfluencers.map((inf) => (
                        <div
                            key={inf.id}
                            className="group relative rounded-3xl md:rounded-[2.5rem] bg-gray-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 backdrop-blur-sm"
                        >
                            {/* Card Header Banner/Gradient */}
                            <div className="h-32 relative overflow-hidden">
                                {inf.banner_url ? (
                                    <img
                                        src={inf.banner_url.startsWith('http') ? inf.banner_url : `${API_BASE}${inf.banner_url.startsWith('/') ? '' : '/'}${inf.banner_url}`}
                                        alt="Banner"
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${getGradient(inf.category)} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                                )}
                            </div>

                            {/* Avatar & Info */}
                            <div className="px-6 md:px-8 pb-6 md:pb-8 -mt-10 md:mt-12 relative z-10">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="w-24 h-24 rounded-3xl bg-gray-800 border-4 border-[#020024] p-1 overflow-hidden shadow-2xl">
                                        {inf.photo_url ? (
                                            <img
                                                src={inf.photo_url.startsWith('http') ? inf.photo_url : `${API_BASE}${inf.photo_url.startsWith('/') ? '' : '/'}${inf.photo_url}`}
                                                alt={inf.full_name}
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                        ) : (
                                            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${getGradient(inf.category)} flex items-center justify-center`}>
                                                <Users className="w-10 h-10 text-white/50" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                        {inf.category}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {inf.full_name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-pink-400 font-bold text-sm mb-6">
                                    <Instagram className="w-4 h-4" />
                                    {inf.instagram_url.split('/').filter(Boolean).pop()}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 font-bold">
                                            <Users className="w-3 h-3" />
                                            Followers
                                        </div>
                                        <div className="text-xl font-black text-white">{inf.followers_count}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 font-bold">
                                            <Eye className="w-3 h-3" />
                                            Reach
                                        </div>
                                        <div className="text-xl font-black text-white">{inf.last_month_reach}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Contact</span>
                                        <span className="text-white font-bold flex items-center gap-1">
                                            <Mail className="w-3 h-3 text-blue-400" />
                                            {inf.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-gray-500 font-medium">Barter Collab</span>
                                        <span className={`font-bold px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${inf.is_barter ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                                            {inf.is_barter ? 'Open' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-3 border-t border-white/5">
                                        <span className="text-gray-500 font-medium">Est. Budget</span>
                                        <span className="text-blue-400 font-black text-lg flex items-center gap-1">
                                            <IndianRupee className="w-4 h-4" />
                                            {inf.budget_range}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleContact(inf.user_id)}
                                    className="w-full mt-8 py-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    Contact Influencer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default InfluencerMarketplace;
