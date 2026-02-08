import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Award, Star, ShieldCheck, X } from 'lucide-react';

const gradientBlackToBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
};

const CoFounderBadges = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        linkedin: '',
        portfolio: '',
        certificate: '',
        profilePhoto: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log('Saved Data:', formData);
        setIsModalOpen(false);
        // Implement save logic here
    };

    return (
        <div className="min-h-screen text-white flex flex-col" style={gradientBlackToBlue}>
            <Navbar />

            <div className="flex-grow pt-24 px-4 pb-12 max-w-7xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
                    <span className="text-white">CO-FOUNDER </span>
                    <span className="text-blue-300">BADGES</span>
                </h1>

                {/* Verification Badges Section */}
                <div className="flex flex-col gap-6 mb-16">
                    {/* Blue Tick Badge */}
                    <div className="bg-gray-800/40 backdrop-blur-md border border-blue-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-blue-400 transition-all">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <CheckCircle size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-xl font-bold text-blue-300 mb-2">Verification Badge</h3>
                            <p className="text-gray-300">
                                Get verified by linking your professional profiles. Requires LinkedIn URL, Portfolio, or any Past Work Ex Certificate.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Green Tick Badge */}
                    <div className="bg-gray-800/40 backdrop-blur-md border border-green-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-green-400 transition-all">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                                <ShieldCheck size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-xl font-bold text-green-300 mb-2">Connection Badge</h3>
                            <p className="text-gray-300">
                                Automatically awarded when you have successfully connected with 3+ startups from our platform.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Golden Tick Badge */}
                    <div className="bg-gray-800/40 backdrop-blur-md border border-yellow-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-yellow-400 transition-all">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                <Award size={32} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-xl font-bold text-yellow-300 mb-2">Top Co-founder Badge</h3>
                            <p className="text-gray-300">
                                Exclusive badge for active users. Requires Verification Badge + 20 distinct logins in the current month.
                                <br />
                                <span className="text-yellow-500/80 text-sm">* Monthly variable status</span>
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Credibility Score Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        <span className="text-white">CREDIBILITY </span>
                        <span className="text-blue-300">SCORE</span>
                    </h2>

                    <div className="flex flex-col gap-6">
                        {[
                            {
                                range: '90-95',
                                label: 'Exceptional',
                                color: 'text-purple-400',
                                bgColor: 'bg-purple-500',
                                border: 'border-purple-500/50',
                                criteria: '4.9+ Stars & 50+ Reviews',
                                perks: 'Top 1% Search Ranking'
                            },
                            {
                                range: '85-90',
                                label: 'Excellent',
                                color: 'text-blue-400',
                                bgColor: 'bg-blue-500',
                                border: 'border-blue-500/50',
                                criteria: '4.7+ Stars & 30+ Reviews',
                                perks: 'Highlighted Profile'
                            },
                            {
                                range: '80-85',
                                label: 'Very Good',
                                color: 'text-green-400',
                                bgColor: 'bg-green-500',
                                border: 'border-green-500/50',
                                criteria: '4.5+ Stars & 15+ Reviews',
                                perks: 'Verified Status'
                            },
                            {
                                range: 'Below 80',
                                label: 'Good',
                                color: 'text-gray-400',
                                bgColor: 'bg-gray-500',
                                border: 'border-gray-500/50',
                                criteria: '4.0+ Stars & 5+ Reviews',
                                perks: 'Standard Access'
                            }
                        ].map((item, index) => (
                            <div key={index} className={`bg-gray-800/40 backdrop-blur-md border ${item.border} rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-${item.color.split('-')[1]}-500/10`}>
                                <div className="flex-shrink-0">
                                    <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center shadow-lg shadow-${item.color.split('-')[1]}-500/50`}>
                                        <Star size={32} className="text-white" />
                                    </div>
                                </div>

                                <div className="flex-grow flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                                    <div className="text-center md:text-left min-w-[140px]">
                                        <h3 className={`text-2xl font-bold ${item.color} mb-1`}>{item.range}</h3>
                                        <p className="text-white font-semibold">{item.label}</p>
                                    </div>

                                    <div className="hidden md:block h-12 w-px bg-gray-700/50"></div>
                                    <div className="md:hidden w-full h-px bg-gray-700/50"></div>

                                    <div className="text-center md:text-left flex-1">
                                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Criteria</div>
                                        <div className="text-gray-300 text-sm font-medium">{item.criteria}</div>
                                    </div>

                                    <div className="hidden md:block h-12 w-px bg-gray-700/50"></div>
                                    <div className="md:hidden w-full h-px bg-gray-700/50"></div>

                                    <div className="text-center md:text-left flex-1">
                                        <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Benefits</div>
                                        <div className="text-gray-300 text-sm font-medium">{item.perks}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <Footer />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-gray-900 border border-blue-500/50 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl shadow-blue-900/50">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <CheckCircle className="text-blue-500" />
                            Verify Profile
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Portfolio Link/Website</label>
                                <input
                                    type="text"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Past Work Experience Certificate URL</label>
                                <input
                                    type="text"
                                    name="certificate"
                                    value={formData.certificate}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Profile Photo URL</label>
                                <input
                                    type="text"
                                    name="profilePhoto"
                                    value={formData.profilePhoto}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://content.linkedin.com/..."
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all font-semibold"
                            >
                                Save Verification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoFounderBadges;
