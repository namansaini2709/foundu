import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Tag } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'react-toastify';

const gradientBlueToBlack = {
    background: "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", formData);
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen flex flex-col" style={gradientBlueToBlack}>
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Column: Form */}
                            <div className="p-8 md:p-12 lg:p-16">
                                <div className="mb-8">
                                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                                    <p className="text-blue-300 text-lg">We are keen to hear from you :)</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <label className="text-gray-400 text-sm mb-2 block font-medium">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your Name"
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="text-gray-400 text-sm mb-2 block font-medium">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+1 (555) 123-4567"
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <label className="text-gray-400 text-sm mb-2 block font-medium">Email *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="example@email.com"
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="text-gray-400 text-sm mb-2 block font-medium">Subject *</label>
                                            <div className="relative">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    required
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="What can we help with?"
                                                    className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label className="text-gray-400 text-sm mb-2 block font-medium">Your message *</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                            <textarea
                                                name="message"
                                                required
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                placeholder="Tell us about your project or inquiry..."
                                                className="w-full bg-gray-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Submit
                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </button>
                                </form>
                            </div>

                            {/* Right Column: Visual/Illustration */}
                            <div className="hidden lg:flex items-center justify-center p-12 bg-blue-500/5 backdrop-blur-sm border-l border-white/5 relative overflow-hidden group">
                                {/* Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all duration-700"></div>

                                <div className="w-full h-full max-w-md relative z-10 flex flex-col items-center justify-center">
                                    <DotLottieReact
                                        src="https://lottie.host/b770bd13-7b25-428c-ae62-4470485c1d11/NqVTgNMisf.lottie"
                                        loop
                                        autoplay
                                        className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="mt-8 space-y-4 w-full">
                                        <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Email Us</p>
                                                <p className="text-white font-medium">info@foundu.in</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-gray-800/30 p-4 rounded-2xl border border-white/5 hover:border-blue-300/30 transition-all">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Call Us</p>
                                                <p className="text-white font-medium">+91 9311293521</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUs;
