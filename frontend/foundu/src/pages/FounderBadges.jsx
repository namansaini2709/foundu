import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Award, Star, ShieldCheck, X } from 'lucide-react';

const gradientBlackToBlue = {
    background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
};

const FounderBadges = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        companyLinkedin: '',
        companySocial: '',
        dpiitNumber: ''
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
                    <span className="text-white">FOUNDER </span>
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
                                Get verified by linking your company details. Requires Company LinkedIn, Company Insta/Facebook, and DPIIT/Registration Number.
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
                            <h3 className="text-xl font-bold text-green-300 mb-2">Active Recruiter Badge</h3>
                            <p className="text-gray-300">
                                Automatically awarded when you have posted 3 or more jobs on the platform. show reliability to candidates.
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
                                <label className="block text-sm text-gray-400 mb-1">Company LinkedIn URL</label>
                                <input
                                    type="text"
                                    name="companyLinkedin"
                                    value={formData.companyLinkedin}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Company Instagram/Facebook URL</label>
                                <input
                                    type="text"
                                    name="companySocial"
                                    value={formData.companySocial}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">DPIIT / Registration Number</label>
                                <input
                                    type="text"
                                    name="dpiitNumber"
                                    value={formData.dpiitNumber}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Registration Number"
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

export default FounderBadges;
