import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = 'http://localhost:4000/api';

const FreelancerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [credibility, setCredibility] = useState({ 
        credibility_score: 0, 
        badge: 'Growing', 
        avg_stars: '0.0', 
        review_count: 0,
        ai_summary: '',
        breakdown: { stars: 0, reviews: 0, badges: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);

    const userId = localStorage.getItem('user_id');

    const gradientBlackToBlue = {
        background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
    };

    useEffect(() => {
        if (userId) {
            fetchReviews();
            fetchCredibility();
        }
    }, [userId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_URL}/reviews/user/${userId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
        setLoading(false);
    };

    const fetchCredibility = async () => {
        try {
            const res = await axios.post(`${API_URL}/reviews/recalculate-credibility`, { user_id: parseInt(userId) });
            setCredibility(res.data);
        } catch (err) {
            console.error('Error fetching credibility:', err);
        }
    };

    const handleRecalculate = async () => {
        setRecalculating(true);
        await fetchCredibility();
        setTimeout(() => setRecalculating(false), 800);
    };

    // Group reviews by month
    const groupedReviews = reviews.reduce((acc, review) => {
        const date = new Date(review.created_at);
        const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(review);
        return acc;
    }, {});

    // Get badge color scheme
    const getBadgeColors = (badge) => {
        switch (badge) {
            case 'Exceptional': return { bg: 'from-purple-600 to-indigo-600', border: 'border-purple-500/50', text: 'text-purple-300', glow: 'shadow-purple-500/30' };
            case 'Excellent': return { bg: 'from-blue-600 to-cyan-600', border: 'border-blue-500/50', text: 'text-blue-300', glow: 'shadow-blue-500/30' };
            case 'Very Good': return { bg: 'from-emerald-600 to-teal-600', border: 'border-emerald-500/50', text: 'text-emerald-300', glow: 'shadow-emerald-500/30' };
            default: return { bg: 'from-gray-600 to-slate-600', border: 'border-gray-500/50', text: 'text-gray-300', glow: 'shadow-gray-500/30' };
        }
    };

    const badgeColors = getBadgeColors(credibility.badge);

    // Render filled/empty stars
    const renderStars = (count) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-5 h-5 ${star <= count ? 'text-yellow-400' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    // SVG Circular Gauge for credibility score
    const renderGauge = (score) => {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const progress = (score / 100) * circumference;
        const dashOffset = circumference - progress;

        return (
            <div className="relative w-52 h-52">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    {/* Progress circle */}
                    <circle
                        cx="100" cy="100" r={radius} fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white">{score}</span>
                    <span className="text-sm text-gray-400 mt-1">/ 100</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen text-white font-sans" style={gradientBlackToBlue}>
            <Navbar />

            <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">

                {/* ═══════════════════════════════════════
                    CREDIBILITY SCORE HERO SECTION
                ═══════════════════════════════════════ */}
                <div className="relative bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 md:p-12 mb-8 shadow-xl overflow-hidden">
                    {/* Decorative gradient orbs */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
                            <span className="text-white">Reviews & </span>
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Ratings</span>
                        </h1>
                        <p className="text-center text-gray-400 mb-10">Your reputation and credibility at a glance</p>

                        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                            {/* Gauge */}
                            <div className="flex flex-col items-center">
                                {renderGauge(credibility.credibility_score)}
                                <p className="text-gray-400 text-sm mt-4">Credibility Score</p>
                            </div>

                            {/* Score Details */}
                            <div className="flex flex-col items-center lg:items-start gap-6">
                                {/* Badge */}
                                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${badgeColors.bg} shadow-xl ${badgeColors.glow}`}>
                                    <span className="text-2xl">🏆</span>
                                    <div>
                                        <p className="text-xs text-white/70 uppercase tracking-wider font-medium">Credibility Badge</p>
                                        <p className="text-xl font-bold text-white">{credibility.badge}</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-10">
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-yellow-400">{credibility.avg_stars}</p>
                                        <p className="text-xs text-gray-400 mt-1">Avg Stars</p>
                                    </div>
                                    <div className="w-px bg-gray-700"></div>
                                    <div className="text-center lg:text-left">
                                        <p className="text-3xl font-bold text-blue-400">{credibility.review_count}</p>
                                        <p className="text-xs text-gray-400 mt-1">Total Reviews</p>
                                    </div>
                                    {credibility.ai_summary && (
                                        <>
                                            <div className="w-px bg-gray-700"></div>
                                            <div className="flex-1 max-w-[280px]">
                                                <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                    <span className="text-sm">✨</span> AI Reputation Insights
                                                </p>
                                                <p className="text-sm text-gray-300 italic leading-relaxed">
                                                    "{credibility.ai_summary}"
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Score Breakdown */}
                                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Stars (45%)</p>
                                        <p className="text-lg font-bold text-yellow-500">{credibility.breakdown?.stars || 0}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Reviews (45%)</p>
                                        <p className="text-lg font-bold text-blue-500">{credibility.breakdown?.reviews || 0}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-500 uppercase mb-1">Badges (10%)</p>
                                        <p className="text-lg font-bold text-emerald-500">{credibility.breakdown?.badges || 0}</p>
                                    </div>
                                </div>

                                {/* Recalculate Button */}
                                <button
                                    onClick={handleRecalculate}
                                    disabled={recalculating}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                                        transition-all duration-300 cursor-pointer
                                        ${recalculating
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    <svg className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {recalculating ? 'Recalculating...' : 'Recalculate Score'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════
                    REVIEWS SECTION — GROUPED BY MONTH
                ═══════════════════════════════════════ */}
                <div className="bg-gray-800/30 backdrop-blur-md border border-blue-700/30 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-8">All Reviews</h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm">Loading reviews...</p>
                        </div>
                    ) : Object.keys(groupedReviews).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="text-6xl opacity-30">⭐</div>
                            <p className="text-gray-400 text-lg">No reviews yet</p>
                            <p className="text-gray-500 text-sm">Reviews from startups and co-founders will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {Object.entries(groupedReviews).map(([month, monthReviews]) => (
                                <div key={month}>
                                    {/* Month Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <h3 className="text-lg font-semibold text-blue-300 whitespace-nowrap">{month}</h3>
                                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                                        <span className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                                            {monthReviews.length} review{monthReviews.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Reviews for this month */}
                                    <div className="space-y-4">
                                        {monthReviews.map((review) => (
                                            <div
                                                key={review.review_id}
                                                className="group p-6 rounded-xl bg-gray-900/40 border border-gray-700/40 hover:border-blue-500/30 transition-all duration-300"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Reviewer Avatar */}
                                                    <div className="flex-shrink-0">
                                                        {review.reviewer_photo ? (
                                                            <img
                                                                src={review.reviewer_photo}
                                                                alt={review.reviewer_name}
                                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500/50 transition-colors"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-700 group-hover:border-blue-500/50 transition-colors">
                                                                {review.reviewer_name?.charAt(0)?.toUpperCase() || '?'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Review Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-white">{review.reviewer_name || 'Anonymous'}</h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    {review.startup_name && (
                                                                        <span className="text-xs text-blue-400 flex items-center gap-1">
                                                                            🏢 {review.startup_name}
                                                                        </span>
                                                                    )}
                                                                    {review.reviewer_type && (
                                                                        <span className="text-xs text-gray-500 capitalize">
                                                                            • {review.reviewer_type}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {renderStars(review.stars)}
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Comment */}
                                                        <p className="text-gray-300 text-sm leading-relaxed mt-3">
                                                            "{review.review_text}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FreelancerReviews;
