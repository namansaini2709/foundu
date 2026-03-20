import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { socket } from '../socket';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get("http://localhost:4000/api/notifications", {
                    withCredentials: true
                });
                if (res.data.success) {
                    setNotifications(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        // Listen for new ones live while on this page
        const handleLiveNotif = (notif) => {
            console.log("Live notification received on page:", notif);
            setNotifications(prev => [notif, ...prev]);
        };

        if (!socket.connected) socket.connect();
        const userId = localStorage.getItem("user_id");
        if (userId) socket.emit("register", userId);

        socket.on("new_notification", handleLiveNotif);
        return () => socket.off("new_notification", handleLiveNotif);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:4000/api/notifications/${id}/read`, {}, { withCredentials: true });
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, is_read: 1 } : n
            ));
            window.dispatchEvent(new Event("notification_read"));
            toast.success("Marked as read", { theme: "dark", autoClose: 1000 });
        } catch (err) {
            toast.error("Failed to mark as read");
        }
    };

    const deleteNotification = async (id, isUnread) => {
        try {
            await axios.delete(`http://localhost:4000/api/notifications/${id}`, { withCredentials: true });
            setNotifications(notifications.filter(n => n.id !== id));
            if (isUnread) {
                window.dispatchEvent(new Event("notification_read"));
            }
            toast.info("Notification deleted", { theme: "dark", autoClose: 1000 });
        } catch (err) {
            toast.error("Failed to delete notification");
        }
    };

    const typeConfigs = {
        success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', glow: 'shadow-green-500/20' },
        warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', glow: 'shadow-yellow-500/20' },
        review: { icon: Bell, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
        application: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' },
        badge: { icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
        default: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' }
    };

    const getIcon = (type) => {
        const config = typeConfigs[type] || typeConfigs.default;
        const IconComponent = config.icon;
        return (
            <div className={`p-2.5 rounded-xl ${config.bg} ${config.border} border shadow-lg ${config.glow}`}>
                <IconComponent className={`w-5 h-5 ${config.color}`} />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col">
            <Navbar />

            <div className="flex-1 pt-28 pb-12 flex justify-center px-4">
                <div className="w-full md:w-[75%] max-w-5xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                            <Bell className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-gray-400 text-sm">Stay updated with your latest activities</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`group relative p-5 rounded-[2rem] border transition-all duration-500 backdrop-blur-xl ${n.is_read
                                            ? 'bg-gray-900/40 border-white/5 opacity-60 grayscale-[0.3]'
                                            : 'bg-gradient-to-br from-blue-600/10 to-purple-600/5 border-blue-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                                        } hover:scale-[1.01] hover:border-blue-500/60 hover:bg-gray-800/40`}
                                >
                                    <div className="flex gap-5">
                                        <div className="relative">
                                            {getIcon(n.type)}
                                            {!n.is_read && (
                                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`font-bold text-lg tracking-tight ${n.is_read ? 'text-gray-400' : 'text-white'}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em] shadow-inner">
                                                    <Clock className="w-3 h-3 text-blue-400/50" />
                                                    {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${n.is_read ? 'text-gray-500' : 'text-gray-300'}`}>
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-1/2 -translate-y-1/2 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        {!n.is_read && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="p-2.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all duration-300 transform shadow-xl border border-green-500/20 group/btn"
                                                title="Mark as Read"
                                            >
                                                <Check className="w-5 h-5 group-hover/btn:scale-110" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.id, !n.is_read)}
                                            className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 transform shadow-xl border border-red-500/20 group/btn"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/btn:scale-110" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 bg-gray-900/30 rounded-[3rem] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                                        <Bell className="w-10 h-10 text-blue-500 opactiy-50" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Inbox Zen</h2>
                                    <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                                        All caught up! We'll notify you here when the magic happens.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Notifications;
