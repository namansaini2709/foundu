import React from 'react';
import { 
    Users, 
    Instagram, 
    Eye, 
    Mail, 
    DollarSign, 
    TrendingUp, 
    Search, 
    Filter,
    Star,
    Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const InfluencerMarketplace = () => {
    const influencers = [
        {
            id: 1,
            name: "Aarav Sharma",
            handle: "@aarav_tech_vlogs",
            followers: "150K",
            reach: "1.2M",
            contact: "collab.aarav@gmail.com",
            budget: "₹25K - ₹40K",
            category: "Technology",
            color: "from-blue-500 to-cyan-400"
        },
        {
            id: 2,
            name: "Priya Patel",
            handle: "@priya_lifestyle",
            followers: "280K",
            reach: "2.5M",
            contact: "priya.lifestyle@inf.com",
            budget: "₹50K - ₹80K",
            category: "Lifestyle",
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            name: "Vikram Singh",
            handle: "@viky_fitness_official",
            followers: "95K",
            reach: "850K",
            contact: "vikram.fit@outlook.com",
            budget: "₹15K - ₹25K",
            category: "Fitness",
            color: "from-orange-500 to-red-500"
        },
        {
            id: 4,
            name: "Ananya Iyer",
            handle: "@ananya_cooks",
            followers: "420K",
            reach: "4.1M",
            contact: "mgmt@ananyaiyer.in",
            budget: "₹75K - ₹1.2L",
            category: "Food",
            color: "from-green-500 to-emerald-400"
        },
        {
            id: 5,
            name: "Rohan Das",
            handle: "@rohan_travels",
            followers: "110K",
            reach: "900K",
            contact: "rohan.exp@gmail.com",
            budget: "₹20K - ₹35K",
            category: "Travel",
            color: "from-indigo-500 to-blue-600"
        },
        {
            id: 6,
            name: "Ishani Gupta",
            handle: "@ishani_makeover",
            followers: "310K",
            reach: "2.8M",
            contact: "ishani.beauty@gmail.com",
            budget: "₹45K - ₹70K",
            category: "Beauty",
            color: "from-rose-500 to-pink-600"
        }
    ];

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col font-sans">
            <Navbar />

            {/* Header Section */}
            <div className="pt-32 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 animate-pulse">
                        <Zap className="w-4 h-4" />
                        Platform Exclusive
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Influencer Marketplace
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Connect with top-tier creators to skyrocket your brand's visibility and reach the right audience instantly.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="px-6 mb-12">
                <div className="max-w-7xl mx-auto py-6 px-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Search by name, handle, or category..." 
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-600/20">
                            Apply for Listing
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="px-6 pb-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {influencers.map((inf) => (
                        <div 
                            key={inf.id} 
                            className="group relative rounded-[2.5rem] bg-gray-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 backdrop-blur-sm"
                        >
                            {/* Card Header Gradient */}
                            <div className={`h-32 bg-gradient-to-br ${inf.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                            
                            {/* Avatar & Info */}
                            <div className="px-8 pb-8 -mt-12 relative z-10">
                                <div className="flex justify-between items-end mb-6">
                                    <div className="w-24 h-24 rounded-3xl bg-gray-800 border-4 border-[#020024] p-1 overflow-hidden shadow-2xl">
                                        <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${inf.color} flex items-center justify-center`}>
                                            <Users className="w-10 h-10 text-white/50" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                        {inf.category}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {inf.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-pink-400 font-bold text-sm mb-6">
                                    <Instagram className="w-4 h-4" />
                                    {inf.handle}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 font-bold">
                                            <Users className="w-3 h-3" />
                                            Followers
                                        </div>
                                        <div className="text-xl font-black text-white">{inf.followers}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1 font-bold">
                                            <Eye className="w-3 h-3" />
                                            Reach
                                        </div>
                                        <div className="text-xl font-black text-white">{inf.reach}</div>
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Contact</span>
                                        <span className="text-white font-bold flex items-center gap-1">
                                            <Mail className="w-3 h-3 text-blue-400" />
                                            {inf.contact}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-3 border-t border-white/5">
                                        <span className="text-gray-500 font-medium">Est. Budget</span>
                                        <span className="text-blue-400 font-black text-lg">
                                            {inf.budget}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white hover:text-[#020024] transition-all duration-300 transform active:scale-95">
                                    Hire Influencer
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
