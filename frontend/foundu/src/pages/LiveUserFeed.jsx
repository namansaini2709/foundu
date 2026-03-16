import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import {
    Github,
    Linkedin,
    Twitter,
    Instagram,
    Star,
    ExternalLink,
    ShieldCheck,
    CheckCircle,
    Award,
    Users,
    Briefcase,
    Globe,
    MessageSquare,
    X
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const gradientBlackToBlue = {
    background: "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

const LiveUserFeed = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/live-feed");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching live feed:", err);
                toast.error("Failed to load user feed");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const UserCard = ({ user }) => {
        // Random height for masonry effect
        const heights = ['h-auto', 'min-h-[300px]', 'min-h-[400px]', 'min-h-[350px]'];
        const randomHeight = heights[user.id % heights.length];

        return (
            <div
                onClick={() => setSelectedUser(user)}
                className={`group relative break-inside-avoid mb-6 bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 ${randomHeight}`}
            >
                {/* Profile Image container */}
                <div className="relative aspect-video sm:aspect-square overflow-hidden">
                    <img
                        src={user.profile_picture_url || "https://premium-avatars.s3.amazonaws.com/default-avatar.png"}
                        alt={user.full_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name) + "&background=0D8ABC&color=fff&size=512";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>

                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {user.blue_tick_verified === 1 && (
                            <div className="bg-blue-500/80 backdrop-blur-md p-1.5 rounded-full" title="Blue Tick Verified">
                                <CheckCircle size={14} className="text-white" />
                            </div>
                        )}
                        {user.golden_tick_verified === 1 && (
                            <div className="bg-yellow-500/80 backdrop-blur-md p-1.5 rounded-full" title="Golden Tick Professional">
                                <Award size={14} className="text-white" />
                            </div>
                        )}
                        {user.green_tick_verified === 1 && (
                            <div className="bg-green-500/80 backdrop-blur-md p-1.5 rounded-full" title="Green Tick Vetted">
                                <ShieldCheck size={14} className="text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                            {user.full_name}
                        </h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${user.user_type === 'freelancer' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                            {user.user_type}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    className={i < Math.round(user.avg_stars || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-400">({user.review_count || 0})</span>
                    </div>

                    {/* Skills/Superpowers Preview */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {(user.user_type === 'freelancer' ? user.skills_description?.split(',').slice(0, 3) : [user.superpower1, user.superpower2].filter(Boolean))?.map((skill, i) => (
                            <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-md">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>

                    {/* Socials hover reveal */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} className="text-gray-400 hover:text-blue-400" /></a>}
                        {user.github && <a href={user.github} target="_blank" rel="noreferrer"><Github size={16} className="text-gray-400 hover:text-white" /></a>}
                        {user.portfolio && <a href={user.portfolio} target="_blank" rel="noreferrer"><Globe size={16} className="text-gray-400 hover:text-blue-300" /></a>}
                    </div>
                </div>
            </div>
        );
    };

    const UserModal = ({ user, onClose }) => {
        if (!user) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className="bg-gray-900 border border-blue-700/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-blue-500/20">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-1/3">
                                <img
                                    src={user.profile_picture_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.full_name) + "&background=0D8ABC&color=fff&size=512"}
                                    alt={user.full_name}
                                    className="w-full aspect-square object-cover rounded-2xl border-2 border-blue-500/30 shadow-xl"
                                />
                                <div className="flex justify-center gap-6 mt-6">
                                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer"><Linkedin size={24} className="text-blue-400 hover:text-white transition-colors" /></a>}
                                    {user.github && <a href={user.github} target="_blank" rel="noreferrer"><Github size={24} className="text-gray-400 hover:text-white transition-colors" /></a>}
                                    {user.portfolio && <a href={user.portfolio} target="_blank" rel="noreferrer"><Globe size={24} className="text-blue-300 hover:text-white transition-colors" /></a>}
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-4xl font-bold text-white">{user.full_name}</h2>
                                    <div className="flex gap-1">
                                        {user.blue_tick_verified === 1 && <CheckCircle size={20} className="text-blue-500" />}
                                        {user.golden_tick_verified === 1 && <Award size={20} className="text-yellow-500" />}
                                    </div>
                                </div>

                                <p className="text-blue-400 font-semibold mb-6 uppercase tracking-widest text-sm">
                                    {user.user_type} • {user.experience || 'Professional'}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                        <p className="text-gray-400 text-xs uppercase mb-1">Score</p>
                                        <p className="text-2xl font-bold text-white">{user.credibility_score || 0}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                        <p className="text-gray-400 text-xs uppercase mb-1">Reviews</p>
                                        <p className="text-2xl font-bold text-white">{user.review_count || 0}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                        <p className="text-gray-400 text-xs uppercase mb-1">Rating</p>
                                        <p className="text-2xl font-bold text-yellow-400 flex justify-center items-center gap-1">
                                            {parseFloat(user.avg_stars || 0).toFixed(1)} <Star size={16} className="fill-yellow-400" />
                                        </p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                        <p className="text-gray-400 text-xs uppercase mb-1">Vetted</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {user.green_tick_verified ? 'Yes' : 'No'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                        <Briefcase size={20} className="text-blue-400" />
                                        {user.user_type === 'freelancer' ? 'Skills & Expertise' : 'Superpowers'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(user.user_type === 'freelancer' ? user.skills_description?.split(',') : [user.superpower1, user.superpower2, user.superpower3].filter(Boolean))?.map((skill, i) => (
                                            <span key={i} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-lg text-sm">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                                    <Link
                                        to="/chatbox"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        <MessageSquare size={20} />
                                        Message {user.full_name.split(' ')[0]}
                                    </Link>
                                    <a
                                        href={user.portfolio || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all ${!user.portfolio && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        View Portfolio <ExternalLink size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-6 flex items-center justify-center" style={gradientBlackToBlue}>
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-300 font-medium animate-pulse">Scanning the ecosystem...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6" style={gradientBlackToBlue}>
             <Navbar />
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">Live Discovery</p>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-4">
                        User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Feed</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Discover the most active and highly vetted co-founders and freelancers in the ecosystem.
                        Powered by real-time credibility scores and peer proof.
                    </p>
                </header>

                {/* Masonry Layout */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                    {users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Users size={64} className="text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No users found</h3>
                        <p className="text-gray-400">Be the first to join the live feed!</p>
                    </div>
                )}
            </div>

            <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
                <Footer />
                
        </div>
        
    );
};

export default LiveUserFeed;
