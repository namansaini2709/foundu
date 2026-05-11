import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { Calendar, Clock, User, Mail, Phone, Briefcase, Globe, Layout, Smartphone, Code, Trash2 } from "lucide-react";

const AdminMeetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const res = await api.get("/api/meetings/all");
            if (res.data.success) {
                setMeetings(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching meetings:", error);
            toast.error("Failed to load meetings.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this meeting booking?")) return;
        
        try {
            const res = await api.delete(`/api/meetings/${id}`);
            if (res.data.success) {
                toast.success("Meeting deleted.");
                setMeetings(meetings.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error("Error deleting meeting:", error);
            toast.error("Failed to delete meeting.");
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Pitch Deck': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Startup Portal': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Web Development': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            Meeting <span className="text-blue-500 not-italic">Bookings.</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">Manage strategy sessions and technical consultations</p>
                    </div>
                    <button
                        onClick={fetchMeetings}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                    >
                        Refresh Data
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-20 text-center border border-white/10">
                        <Calendar size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest">No meeting bookings found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Session / Date</th>
                                    <th className="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">User Details</th>
                                    <th className="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Requirement Matrix</th>
                                    <th className="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Explanation</th>
                                    <th className="p-6 text-[10px] font-black text-blue-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {meetings.map((m) => (
                                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6 align-top">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border mb-3 ${getTypeColor(m.meeting_type)}`}>
                                                {m.meeting_type}
                                            </div>
                                            <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                                                <Calendar size={14} className="text-blue-500" />
                                                {new Date(m.selected_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                                <Clock size={14} />
                                                {m.selected_time}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-black shadow-inner">
                                                    {m.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-black tracking-tight">{m.user_name}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{m.user_type}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Mail size={12} className="text-blue-500/50" />
                                                    {m.user_email}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Phone size={12} className="text-blue-500/50" />
                                                    {m.user_phone || 'No Phone Linked'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="space-y-3">
                                                {m.meeting_type === 'Pitch Deck' && (
                                                    <div className="flex items-center gap-2">
                                                        <Globe size={14} className="text-blue-400" />
                                                        <span className="text-xs text-gray-300 font-medium truncate max-w-[200px]">
                                                            {m.website_link || 'No Website'}
                                                        </span>
                                                    </div>
                                                )}
                                                {m.meeting_type === 'Startup Portal' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <Layout size={14} className="text-yellow-400" />
                                                            <span className="text-xs text-white font-bold">{m.portal_type}</span>
                                                        </div>
                                                        {m.other_portal_type && (
                                                            <div className="text-[10px] text-gray-500 italic ml-6">({m.other_portal_type})</div>
                                                        )}
                                                    </>
                                                )}
                                                {m.meeting_type === 'Web Development' && (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <Briefcase size={14} className="text-green-400" />
                                                            <span className="text-xs text-white font-bold">{m.business_type}</span>
                                                        </div>
                                                        <div className="flex gap-2 ml-6">
                                                            {m.is_web === 1 && <span className="bg-green-500/10 text-green-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-green-500/20">Web</span>}
                                                            {m.is_app === 1 && <span className="bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-500/20">App</span>}
                                                        </div>
                                                    </>
                                                )}
                                                {m.budget && (
                                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Budget:</span>
                                                        <span className="text-xs text-green-400 font-black">₹{m.budget}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top max-w-xs">
                                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:bg-white/[0.08] transition-colors h-full">
                                                <p className="text-gray-400 text-xs leading-relaxed italic">
                                                    "{m.explanation || 'No explanation provided.'}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-6 align-top">
                                            <button 
                                                onClick={() => handleDelete(m.id)}
                                                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20"
                                                title="Delete Booking"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminMeetings;
