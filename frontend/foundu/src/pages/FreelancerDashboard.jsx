import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbox from './Chatbox';

const API_URL = 'http://localhost:4000/api';

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState('chats');
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const userId = localStorage.getItem('user_id');

    const gradientBlackToBlue = {
        background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
    };

    // Tab config with icons
    const tabs = [
        { key: 'chats', label: 'Your Chats', icon: '💬' },
        { key: 'projects', label: 'Projects', icon: '📂' },
        { key: 'payments', label: 'Payments', icon: '💰' },
        { key: 'badges', label: 'Badges', icon: '🏅' },
    ];

    // Fetch applications when projects tab is active
    useEffect(() => {
        if (activeTab === 'projects' && userId) {
            fetchApplications();
        }
    }, [activeTab, userId]);

    const fetchApplications = async () => {
        setLoadingApps(true);
        try {
            const res = await axios.get(`${API_URL}/user/${userId}/applications`);
            setApplications(res.data);
        } catch (err) {
            console.error('Error fetching applications:', err);
        }
        setLoadingApps(false);
    };

    const filteredApplications = statusFilter === 'all'
        ? applications
        : applications.filter(app => app.status === statusFilter);

    // Dummy Data for payments (keeping as-is per requirements)
    const transactions = [
        { id: 1, description: 'Project Payment - E-commerce', amount: '+$500', date: '2023-10-02', type: 'Credit' },
        { id: 2, description: 'Withdrawal to Bank', amount: '-$200', date: '2023-09-25', type: 'Debit' },
        { id: 3, description: 'Project Payment - Portfolio', amount: '+$300', date: '2023-09-18', type: 'Credit' },
    ];

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
            case 'completed':
                return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
            case 'rejected':
                return 'bg-red-500/15 text-red-300 border border-red-500/30';
            default:
                return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
        }
    };

    return (
        <div className="min-h-screen text-white font-sans" style={gradientBlackToBlue}>
            <Navbar />

            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 mb-8 shadow-lg">
                    <h1 className="text-4xl font-bold text-white mb-2 text-center">Freelancer Dashboard</h1>
                    <p className="text-blue-200 text-lg text-center">Manage your chats, applications, earnings, and badges</p>

                    {/* ═══════════════════════════════════════════════
                        PREMIUM CENTER-ALIGNED TOGGLE BAR
                    ═══════════════════════════════════════════════ */}
                    <div className="flex justify-center mt-8">
                        <div className="inline-flex items-center bg-gray-900/60 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-2xl shadow-blue-900/20">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold
                                        transition-all duration-400 ease-out cursor-pointer
                                        ${activeTab === tab.key
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                    style={{
                                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className={`bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl shadow-xl ${activeTab === 'chats' ? 'p-0 overflow-hidden' : 'p-8'} min-h-[500px]`}>

                    {/* ═══════════ YOUR CHATS TAB ═══════════ */}
                    {activeTab === 'chats' && (
                        <div className="h-[600px]">
                            <Chatbox />
                        </div>
                    )}

                    {/* ═══════════ PROJECTS TAB ═══════════ */}
                    {activeTab === 'projects' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">My Applications</h2>
                                    <p className="text-gray-400 text-sm mt-1">Track your job applications & statuses</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 rounded-xl p-1 border border-white/10">
                                    {['all', 'pending', 'accepted', 'rejected'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setStatusFilter(f)}
                                            className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-300 cursor-pointer ${statusFilter === f
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loadingApps ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                    <p className="text-gray-400 text-sm">Loading applications...</p>
                                </div>
                            ) : filteredApplications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="text-6xl opacity-30">📋</div>
                                    <p className="text-gray-400 text-lg">No applications found</p>
                                    <p className="text-gray-500 text-sm">Your job applications will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredApplications.map((app, idx) => (
                                        <div
                                            key={`${app.job_id}-${idx}`}
                                            className="group p-5 rounded-xl bg-gray-900/40 border border-gray-700/40 hover:border-blue-500/40 transition-all duration-300 hover:bg-gray-900/60"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                        {app.job_title || 'Untitled Job'}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                            <span className="text-blue-400">🏢</span>
                                                            {app.startup_name || 'Unknown Startup'}
                                                        </span>
                                                        {app.domain && (
                                                            <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                                <span className="text-purple-400">•</span>
                                                                {app.domain}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                                            📅 {new Date(app.applied_on).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusStyle(app.status)}`}>
                                                    {app.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ PAYMENTS TAB ═══════════ */}
                    {activeTab === 'payments' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-8">My Payment</h2>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-700/30 border border-blue-500/30 p-6 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-6xl">💰</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">Total Earning</p>
                                    <p className="text-3xl font-bold text-white">$1,250.00</p>
                                </div>
                                <div className="bg-gray-700/30 border border-green-500/30 p-6 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-6xl">💳</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">Available Balance</p>
                                    <p className="text-3xl font-bold text-green-400">$450.00</p>
                                </div>
                                <div className="bg-gray-700/30 border border-purple-500/30 p-6 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-6xl">🏦</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-1">Total Withdrawn</p>
                                    <p className="text-3xl font-bold text-purple-400">$800.00</p>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-white">Transaction History</h3>
                                    <select className="bg-gray-700 text-white border-gray-600 rounded-lg text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                        <option>All Transactions</option>
                                        <option>Credits</option>
                                        <option>Debits</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors border border-gray-600/30">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${tx.type === 'Credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {tx.type === 'Credit' ? '↓' : '↑'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{tx.description}</p>
                                                    <p className="text-sm text-gray-400">{tx.date}</p>
                                                </div>
                                            </div>
                                            <p className={`font-bold text-lg ${tx.type === 'Credit' ? 'text-green-400' : 'text-white'}`}>
                                                {tx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════════ BADGES TAB ═══════════ */}
                    {activeTab === 'badges' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-8">Badges Achieved</h2>

                            {/* Verification Badges */}
                            <div className="mb-12">
                                <h3 className="text-lg font-semibold text-blue-300 mb-6 pl-3 border-l-4 border-blue-500">Verification Badge</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="flex flex-col items-center p-8 bg-gray-700/30 rounded-xl border border-blue-500/30 hover:border-blue-400 transition-all group">
                                        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                                            ✅
                                        </div>
                                        <p className="font-bold text-blue-400 text-lg">Identity Verified</p>
                                        <p className="text-sm text-gray-400 text-center mt-2">Blue Tick Check</p>
                                    </div>
                                    <div className="flex flex-col items-center p-8 bg-gray-700/30 rounded-xl border border-yellow-500/30 hover:border-yellow-400 transition-all group">
                                        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                                            ✨
                                        </div>
                                        <p className="font-bold text-yellow-400 text-lg">Skill Verified</p>
                                        <p className="text-sm text-gray-400 text-center mt-2">Golden Tick Check</p>
                                    </div>
                                    <div className="flex flex-col items-center p-8 bg-gray-700/30 rounded-xl border border-green-500/30 hover:border-green-400 transition-all group">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform">
                                            🛡️
                                        </div>
                                        <p className="font-bold text-green-400 text-lg">Payment Verified</p>
                                        <p className="text-sm text-gray-400 text-center mt-2">Green Tick Check</p>
                                    </div>
                                </div>
                            </div>

                            {/* Credibility Score Badges */}
                            <div>
                                <h3 className="text-lg font-semibold text-red-300 mb-6 pl-3 border-l-4 border-red-500">Credibility Score Badge</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-600 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-500 mb-2">90-95%</div>
                                        <p className="text-sm text-gray-300">Top Rated</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-600 h-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-400 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-400 mb-2">85-90%</div>
                                        <p className="text-sm text-gray-300">Highly Credible</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-400 h-2 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-300 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-300 mb-2">80-85%</div>
                                        <p className="text-sm text-gray-300">Credible</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-300 h-2 rounded-full shadow-[0_0_10px_rgba(252,165,165,0.5)]" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-200 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-200 mb-2">&lt; 80%</div>
                                        <p className="text-sm text-gray-300">Growing</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-200 h-2 rounded-full shadow-[0_0_10px_rgba(254,202,202,0.5)]" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FreelancerDashboard;
