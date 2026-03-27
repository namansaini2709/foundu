import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Linkedin, Mail } from 'lucide-react';

const gradientBlackToBlue = {
    background: "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

const teamMembers = [
    {
        name: "Rajesh Kumar",
        role: "Founder & CEO",
        description: "Visionary leader with 10+ years of experience in the startup ecosystem. Passionate about connecting talent with opportunity.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        linkedin: "#"
    },
    {
        name: "Priya Sharma",
        role: "Co-Founder & CTO",
        description: "Tech innovator and former software architect at top Silicon Valley firms. Driving the AI-powered matching engine at Foundu.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        linkedin: "#"
    },
    {
        name: "Amit Patel",
        role: "Lead Developer",
        description: "Full-stack wizard with a knack for building scalable architecture and smooth user experiences.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
        linkedin: "#"
    },
    {
        name: "Sneha Reddy",
        role: "Design Lead",
        description: "Transforming complex workflows into elegant, intuitive designs. Sneha ensures Foundu is as beautiful as it is functional.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        linkedin: "#"
    },
    {
        name: "Vikram Singh",
        role: "Marketing Manager",
        description: "Growth hacker and community builder. Vikram is the voice of Foundu, sharing our mission with the world.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        linkedin: "#"
    },
    {
        name: "Ananya Rao",
        role: "Operations Lead",
        description: "Ensuring everything runs like clockwork. Ananya manages partnerships and internal operations with precision.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
        linkedin: "#"
    }
];

const OurTeam = () => {
    return (
        <div className="min-h-screen flex flex-col" style={gradientBlackToBlue}>
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 px-4">
                        <h1 className="text-4xl md:text-7xl font-bold mb-6">
                            <span className="text-white">Our </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Team</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                            Meet the passionate individuals building the future of technical collaboration and startup growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-4 md:px-0">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="group bg-gray-800/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                            >
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blue-400/30 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 bg-gray-700/50">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                                {member.name}
                                            </h3>
                                            <p className="text-blue-400 font-medium">{member.role}</p>
                                        </div>
                                        <a
                                            href={member.linkedin}
                                            className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all self-center sm:self-start"
                                            title="LinkedIn"
                                        >
                                            <Linkedin size={20} />
                                        </a>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OurTeam;
