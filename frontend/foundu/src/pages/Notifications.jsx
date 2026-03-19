import React, { useState } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Job Application",
            message: "A new freelancer has applied for your 'React Developer' position.",
            time: "2 hours ago",
            type: "info",
            isRead: false
        },
        {
            id: 2,
            title: "Application Accepted!",
            message: "Your application for 'UI/UX Designer' at TechFlow has been accepted.",
            time: "5 hours ago",
            type: "success",
            isRead: false
        },
        {
            id: 3,
            title: "Profile View",
            message: "5 people viewed your profile in the last 24 hours.",
            time: "1 day ago",
            type: "info",
            isRead: true
        },
        {
            id: 4,
            title: "Security Alert",
            message: "A new login was detected from a new device.",
            time: "2 days ago",
            type: "warning",
            isRead: true
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
        toast.success("Marked as read", { theme: "dark", autoClose: 1000 });
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.info("Notification deleted", { theme: "dark", autoClose: 1000 });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
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

                    <div className="space-y-4">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`group relative p-6 rounded-2xl border transition-all duration-300 ${n.isRead
                                            ? 'bg-gray-900/40 border-white/5 opacity-70'
                                            : 'bg-blue-600/5 border-blue-500/20 shadow-lg shadow-blue-900/10'
                                        } hover:border-blue-500/40 hover:bg-gray-800/60`}
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-bold text-lg ${n.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                    {n.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                                                    <Clock className="w-3 h-3" />
                                                    {n.time}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 mt-1 leading-relaxed">
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {!n.isRead && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                title="Mark as Read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(n.id)}
                                            className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-900/20 rounded-3xl border border-white/5">
                                <Bell className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
                                <p className="text-gray-500 text-lg">No notifications yet.</p>
                                <p className="text-gray-600 text-sm">We'll notify you when something important happens.</p>
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
