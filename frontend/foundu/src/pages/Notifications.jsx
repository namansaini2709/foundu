import React, { useState, useEffect } from 'react';
import { getUserId } from "../utils/authUtils";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import api from '../utils/axiosConfig';
import { socket } from '../socket';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

const NotificationItem = ({ n, markAsRead, deleteNotification, getIcon, resetSignal }) => {
    const x = useMotionValue(0);

    useEffect(() => {
        if (resetSignal) {
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
        }
    }, [resetSignal, x]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative overflow-hidden bg-transparent border-b border-white/10 last:border-b-0"
        >
            {/* Action Layer (Underneath) */}
            <div className="absolute inset-0 bg-[#000000] flex items-center justify-end px-6 gap-3">
                {!n.is_read && (
                    <button
                        onClick={(e) => { e.stopPropagation(); markAsRead(n.id); animate(x, 0); }}
                        className="w-11 h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-green-500/20"
                    >
                        <Check className="w-6 h-6" />
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(n.id, !n.is_read); }}
                    className="w-11 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-red-500/20"
                >
                    <Trash2 className="w-6 h-6" />
                </button>
            </div>

            {/* Content Layer */}
            <motion.div
                style={{ x }}
                drag="x"
                dragConstraints={{ left: -150, right: 0 }}
                dragElastic={0.05}
                onDragEnd={(_, info) => {
                    if (info.offset.x < -40) {
                        animate(x, -150, { type: 'spring', stiffness: 300, damping: 30 });
                    } else {
                        animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
                    }
                }}
                className={`relative z-10 p-6 sm:p-8 bg-[#000000] flex flex-col sm:flex-row gap-5 items-start sm:items-center cursor-grab active:cursor-grabbing transition-colors`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex-shrink-0 relative ${n.is_read ? 'opacity-40 grayscale' : ''}`}>
                    {getIcon(n.type)}
                    {!n.is_read && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className={`font-black text-base sm:text-lg tracking-tight truncate ${n.is_read ? 'text-gray-500 opacity-60' : 'text-white'}`}>
                            {n.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-black text-gray-700 tracking-wider">
                            <Clock className="w-3 h-3" />
                            {new Date(n.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <p className={`text-[13px] sm:text-sm leading-relaxed line-clamp-2 ${n.is_read ? 'text-gray-600 opacity-60' : 'text-gray-400'}`}>
                        {n.message}
                    </p>
                </div>

                {/* Swipe Hint */}
                <div className="absolute right-3 bottom-3 opacity-20 flex gap-1 items-center animate-pulse">
                    <span className="text-[9px] font-black uppercase tracking-tighter">Swipe Left</span>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resetSignal, setResetSignal] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get(`/api/notifications`);
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

        const handleLiveNotif = (notif) => {
            setNotifications(prev => [notif, ...prev]);
        };

        if (!socket.connected) socket.connect();
        const userId = getUserId();
        if (userId) socket.emit("register", userId);
        socket.on("new_notification", handleLiveNotif);
        return () => socket.off("new_notification", handleLiveNotif);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/api/notifications/${id}/read`);
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
            await api.delete(`/api/notifications/${id}`);
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
        payment: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', glow: 'shadow-green-500/20' },
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

    // Global click handler to reset all swiped items
    useEffect(() => {
        const handleClickOutside = () => {
            setResetSignal(true);
            setTimeout(() => setResetSignal(false), 100);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col">
            <div className="flex-1 pt-28 pb-12 flex justify-center px-4">
                <div className="w-full md:w-[85%] max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4 md:px-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                                <Bell className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                                    Notifications
                                </h1>
                                {/* <p className="text-blue-400/50 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1 italic">Updates • Activity • Alerts</p> */}
                            </div>
                        </div>
                    </div>

                    {/* Single Glass Container Covering All Notifications */}
                    <div 
                        className="bg-black border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
                        
                        <div className="flex flex-col">
                            <AnimatePresence mode="popLayout">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <NotificationItem
                                            key={n.id}
                                            n={n}
                                            markAsRead={markAsRead}
                                            deleteNotification={deleteNotification}
                                            getIcon={getIcon}
                                            resetSignal={resetSignal}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-24"
                                    >
                                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                                            <Bell className="w-10 h-10 text-blue-500 opacity-20" />
                                        </div>
                                        <h2 className="text-2xl font-black text-white/30">Inbox Zen</h2>
                                        <p className="text-gray-600 text-sm max-w-xs mx-auto">
                                            All caught up! No new notifications at the moment.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Notifications;
