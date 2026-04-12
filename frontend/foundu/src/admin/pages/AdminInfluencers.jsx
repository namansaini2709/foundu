import { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { Check, X, Camera, Instagram, Mail, Phone, ExternalLink, User, Zap, Users } from "lucide-react";
import AdminLayout from "../AdminLayout";

const AdminInfluencers = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get("/api/influencers");
            if (res.data.success) {
                setApplications(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching influencer applications:", err);
            toast.error("Failed to load applications.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await api.patch(`/api/influencers/${id}/status`, { status });
            if (res.data.success) {
                toast.success(`Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}!`);
                setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
            }
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Failed to update status.");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-2 tracking-tight text-white uppercase">Influencer Applications</h1>
                    <p className="text-blue-200/60 font-medium text-lg">Review and manage micro-influencer onboarding requests.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {applications.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center backdrop-blur-md">
                            <User className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No applications found</p>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="bg-white/10 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl group hover:border-blue-500/40 transition-all duration-500 shadow-2xl">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    {/* Visuals Preview */}
                                    <div className="lg:col-span-3 h-64 lg:h-full relative overflow-hidden bg-gray-900">
                                        <img
                                            src={app.photo_url ? `${import.meta.env.VITE_API_URL}${app.photo_url}` : "https://img.icons8.com/plasticine/400/user.png"}
                                            alt={app.full_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://img.icons8.com/plasticine/400/user.png";
                                            }}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                                            <span className={`w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'accepted' ? 'bg-green-500 shadow-lg shadow-green-500/30' :
                                                app.status === 'rejected' ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-blue-600 shadow-lg shadow-blue-600/30'
                                                } text-white`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Core Info */}
                                    <div className="lg:col-span-6 p-8 md:p-10 relative">
                                        {/* Banner Overlay Preview (Optional) */}
                                        {app.banner_url && (
                                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <div className="w-20 h-10 rounded-lg overflow-hidden border border-white/10">
                                                    <img src={`${import.meta.env.VITE_API_URL}${app.banner_url}`} className="w-full h-full object-cover" alt="Banner" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <h3 className="text-3xl font-black tracking-tight text-white">{app.full_name}</h3>
                                            <span className="px-4 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-widest">
                                                {app.category}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                            <div className="flex items-center gap-3 text-blue-100/70 text-sm font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                                    <Instagram className="w-4 h-4 text-pink-500" />
                                                </div>
                                                <a href={app.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                    Instagram <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-3 text-blue-100/70 text-sm font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span>{app.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-blue-100/70 text-sm font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-green-400" />
                                                </div>
                                                <span>{app.phone_number || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-blue-100/70 text-sm font-medium">
                                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                                    <Zap className="w-4 h-4 text-yellow-500" />
                                                </div>
                                                <span>Reach: {app.last_month_reach || "0"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-blue-100/70 text-sm font-medium">
                                                <div className={`w-8 h-8 rounded-lg ${app.is_barter ? 'bg-purple-500/10' : 'bg-gray-500/10'} flex items-center justify-center`}>
                                                    <Users className={`w-4 h-4 ${app.is_barter ? 'text-purple-400' : 'text-gray-400'}`} />
                                                </div>
                                                <span className={app.is_barter ? 'text-purple-400 font-black' : 'text-gray-500'}>
                                                    Barter: {app.is_barter ? "YES" : "NO"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-8 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest">Followers</p>
                                                <p className="text-2xl font-black text-white">{app.followers_count || "0"}</p>
                                            </div>
                                            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest">Budget</p>
                                                <p className="text-2xl font-black text-white">{app.budget_range}</p>
                                            </div>
                                            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest">Promo Reel</p>
                                                <a href={app.reel_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-black flex items-center gap-1.5 text-sm underline decoration-2 underline-offset-8">
                                                    VIEW REEL <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:col-span-3 p-8 md:p-10 bg-white/5 border-l border-white/5 flex flex-col justify-center gap-5">
                                        {app.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                                    className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-green-500/40 hover:scale-[1.05] transition-all flex items-center justify-center gap-3 text-sm"
                                                >
                                                    <Check className="w-6 h-6" /> ACCEPT
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                    className="w-full py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-red-100 font-black uppercase tracking-widest hover:bg-red-500 hover:border-red-500 hover:text-white transition-all flex items-center justify-center gap-3 text-sm shadow-xl"
                                                >
                                                    <X className="w-6 h-6" /> REJECT
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-6 rounded-3xl bg-black/20 border border-white/5">
                                                <p className="text-[10px] font-black text-blue-300/50 uppercase tracking-widest mb-3 italic">Processed On</p>
                                                <p className="text-sm font-black text-white">{new Date(app.created_at).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-white/40 mt-1 font-bold">FOUNDU ADMIN</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminInfluencers;
