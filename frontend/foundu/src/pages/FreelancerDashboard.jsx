import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FreelancerDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');

    // Gradient style matching HomePage
    const gradientBlackToBlue = {
        background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
    };

    // Dummy Data
    const projects = [
        { id: 1, title: 'E-commerce Website', status: 'Accepted', date: '2023-10-01' },
        { id: 2, title: 'Personal Portfolio', status: 'Completed', date: '2023-09-15' },
        { id: 3, title: 'Mobile App Design', status: 'Pending', date: '2023-10-05' },
        { id: 4, title: 'SEO Optimization', status: 'Rejected', date: '2023-09-20' },
        { id: 5, title: 'Blog Writing', status: 'Applied', date: '2023-10-08' },
    ];

    const transactions = [
        { id: 1, description: 'Project Payment - E-commerce', amount: '+$500', date: '2023-10-02', type: 'Credit' },
        { id: 2, description: 'Withdrawal to Bank', amount: '-$200', date: '2023-09-25', type: 'Debit' },
        { id: 3, description: 'Project Payment - Portfolio', amount: '+$300', date: '2023-09-18', type: 'Credit' },
    ];

    const billingHistory = [
        { id: 1, invoiceId: 'INV-2023-001', date: '2023-10-01', amount: '$15.00', status: 'Paid', plan: 'Pro Plan' },
        { id: 2, invoiceId: 'INV-2023-002', date: '2023-09-01', amount: '$15.00', status: 'Paid', plan: 'Pro Plan' },
    ];

    return (
        <div className="min-h-screen text-white font-sans" style={gradientBlackToBlue}>
            <Navbar />

            {/* Main Content Padding for Fixed Navbar */}
            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 mb-8 shadow-lg">
                    <h1 className="text-4xl font-bold text-white mb-2">Freelancer Dashboard</h1>
                    <p className="text-blue-200 text-lg">Manage your application, savings, and subscription</p>

                    {/* Toggle Bar / Tabs */}
                    <div className="flex space-x-2 mt-8 overflow-x-auto pb-2">
                        {['projects', 'payments', 'badges', 'billing'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${activeTab === tab
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 shadow-xl min-h-[500px]">

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white">My Projects and Applications</h2>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                {['Applications', 'All Projects', 'Accepted', 'Completed', 'Pending', 'Rejected'].map((filter) => (
                                    <button key={filter} className="px-4 py-2 rounded-lg bg-gray-700/50 border border-blue-500/30 text-sm font-medium text-blue-100 hover:bg-blue-600/20 hover:border-blue-400 transition-all">
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Dummy Data List */}
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="p-5 rounded-xl bg-gray-700/30 border border-gray-600/50 hover:border-blue-500/50 transition-all flex justify-between items-center group">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">{project.title}</h3>
                                            <p className="text-sm text-gray-400">Applied on {project.date}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${project.status === 'Completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                                project.status === 'Accepted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                    project.status === 'Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                        'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                            }`}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payments Tab */}
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

                    {/* Badges Tab */}
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
                                    {/* 90-95 Red */}
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-600 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-500 mb-2">90-95%</div>
                                        <p className="text-sm text-gray-300">Top Rated</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-600 h-2 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    {/* 85-90 Less Red */}
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-400 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-400 mb-2">85-90%</div>
                                        <p className="text-sm text-gray-300">Highly Credible</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-400 h-2 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)]" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>
                                    {/* 80-85 Even More Less */}
                                    <div className="bg-gray-700/30 p-6 rounded-xl border-t-4 border-red-300 text-center hover:bg-gray-700/50 transition-colors">
                                        <div className="text-3xl font-bold text-red-300 mb-2">80-85%</div>
                                        <p className="text-sm text-gray-300">Credible</p>
                                        <div className="mt-4 w-full bg-gray-600 rounded-full h-2">
                                            <div className="bg-red-300 h-2 rounded-full shadow-[0_0_10px_rgba(252,165,165,0.5)]" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>
                                    {/* Below 80 Dull Red */}
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

                    {/* Billing Tab */}
                    {activeTab === 'billing' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-8">Billing and Invoices</h2>
                            <div className="bg-gray-700/30 rounded-xl overflow-hidden border border-gray-600/30 shadow-lg">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-800/50 border-b border-gray-600/50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Invoice ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Plan</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-blue-300 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-600/30">
                                        {billingHistory.map((bill) => (
                                            <tr key={bill.id} className="hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-white">{bill.invoiceId}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{bill.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-300">{bill.plan}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-white">{bill.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                                        {bill.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-blue-400 hover:text-blue-300 cursor-pointer font-semibold">
                                                    Download
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
