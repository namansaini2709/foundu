import React from 'react';
import { Star, MessageCircle, ShieldCheck, Mail, MapPin, Briefcase, Linkedin, Github } from 'lucide-react';

/** 
 * ==========================================
 * DUMMY PROFILE DATA (EDIT THIS FREELY)
 * ==========================================
 * This data is shown when real user data is not available.
 * You can change any of these fields to see how the profile looks.
 */
const DUMMY_USER = {
    full_name: "Krish Tech",
    user_type: "freelancer", // change to "cofounder" to see cofounder view
    role: "Full Stack Developer & AI Enthusiast",
    description: "I am a passionate developer who loves building innovative solutions. With expertise in React, Node.js, and modern UI/UX design, I create premium digital experiences that stand out. Always open to collaborating on exciting projects!",
    profile_picture_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Krish",
    blue_tick_verified: true,
    green_tick_verified: true,
    golden_tick_verified: true,
    credibility_score: 98,
    avg_stars: 4.9,
    review_count: 24,
    isOpenToWork: true,
    email: "krish.tech@example.com",
};

const DUMMY_REVIEWS = [
    {
        reviewer_name: "Aditya Sharma",
        stars: 5,
        review_text: "Krish is an exceptional developer. His attention to detail and design sense is top-notch. Highly recommended for any high-end web project!",
        created_at: "2024-03-15"
    },
    {
        reviewer_name: "Sneha Kapoor",
        stars: 4,
        review_text: "Very professional and delivered ahead of schedule. The UI animations are especially impressive.",
        created_at: "2024-02-28"
    },
    {
        reviewer_name: "Rohan Varma",
        stars: 5,
        review_text: "Great communication and excellent technical skills. A pleasure to work with!",
        created_at: "2024-03-01"
    }
];

const ProfilePreview = ({ user, reviews, type }) => {
    // Use real data if provided, otherwise fallback to dummy data
    // Logic: if user object exists and has a full_name, we consider it "real data"
    const data = (user && user.full_name) ? user : { ...DUMMY_USER, user_type: type || DUMMY_USER.user_type };
    const reviewsData = (reviews && reviews.length > 0) ? reviews : DUMMY_REVIEWS;

    const Badge = ({ color, label, icon: Icon }) => (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
            <Icon className="w-3 h-3" />
            {label}
        </div>
    );

    return (
        <div className="flex justify-center w-full py-8">
            <div className="w-[85%] bg-gray-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

                {/* Top Indicator */}
                <div className="bg-blue-600/20 px-6 py-2 border-b border-white/10 flex justify-between items-center">
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                        {data.user_type === 'freelancer' ? 'Freelancer Profile' : 'Co-founder Profile'}
                    </span>
                    {data.isOpenToWork && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            OPEN TO WORK
                        </div>
                    )}
                </div>

                {/* Header Section */}
                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start relative">

                    {/* Profile Photo */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-blue-500/30 group-hover:border-blue-500 transition-all duration-300 shadow-xl">
                            <img
                                src={data.profile_picture_url ? (data.profile_picture_url.startsWith('http') ? data.profile_picture_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${data.profile_picture_url}`) : "https://api.dicebear.com/7.x/initials/svg?seed=" + data.full_name}
                                alt={data.full_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                {data.full_name}
                            </h1>
                            <span className="hidden md:block text-3xl font-light text-white/20">||</span>
                            <p className="text-xl md:text-2xl font-medium text-blue-400">
                                {data.role || (data.user_type === 'cofounder' ? "Cofounder" : "Freelancer")}
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {data.blue_tick_verified && <Badge color="bg-blue-500/20 text-blue-400 border border-blue-500/30" label="Verified" icon={ShieldCheck} />}
                            {data.green_tick_verified && <Badge color="bg-green-500/20 text-green-400 border border-green-500/30" label="Expert" icon={ShieldCheck} />}
                            {data.golden_tick_verified && <Badge color="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" label="Premium" icon={ShieldCheck} />}
                            <Badge color="bg-purple-500/20 text-purple-400 border border-purple-500/30" label={`Credibility: ${data.credibility_score}`} icon={ShieldCheck} />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(data.avg_stars) ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'}`} />
                                    ))}
                                </div>
                                <span className="text-white font-bold">{data.avg_stars}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm">{data.review_count} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="px-8 md:px-12 pb-8">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">About Me</h3>
                        <p className="text-white/80 leading-relaxed text-lg italic">
                            "{data.description}"
                        </p>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="px-8 md:px-12 pb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Community Reviews</h3>
                        <div className="h-[1px] flex-1 bg-white/10 ml-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewsData.length > 0 ? reviewsData.map((review, idx) => (
                            <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:translate-y-[-4px] transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-white font-bold">{review.reviewer_name}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`w-3 h-3 ${s <= review.stars ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {review.review_text}
                                </p>
                                <div className="mt-4 text-[10px] text-white/20 uppercase font-bold tracking-widest">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        )) : (
                            <p className="text-white/40 italic">No reviews yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePreview;
