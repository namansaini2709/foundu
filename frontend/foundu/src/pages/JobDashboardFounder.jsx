import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axiosConfig";
import {
    FileText,
    Calendar,
    Target,
    Upload,
    Star,
    Send,
    CheckCircle,
    Clock,
    AlertCircle,
    Download,
    ExternalLink,
    ChevronRight,
    MessageSquare
} from "lucide-react";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";

export default function JobDashboardFounder() {
    const { jobId, freelancerId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState(null);
    const [job, setJob] = useState(null);
    const [freelancer, setFreelancer] = useState(null);

    // Setup Form State
    const [setupData, setSetupData] = useState({
        instructions: "",
        expectations: "",
        deadline: "",
        files: []
    });

    // Review State
    const [reviewData, setReviewData] = useState({
        stars: 5,
        review_text: ""
    });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    useEffect(() => {
        fetchData();
    }, [jobId, freelancerId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Job
            const jobRes = await api.get(`/api/jobs/${jobId}`);
            setJob(jobRes.data);

            // 2. Fetch Freelancer
            const freeRes = await api.get(`/api/users/${freelancerId}`);
            setFreelancer(freeRes.data?.data || freeRes.data);

            // 3. Fetch current submission/tracking status
            try {
                const subRes = await api.get(`/api/submissions/${jobId}/${freelancerId}`);
                if (subRes.data) {
                    const parsedSub = {
                        ...subRes.data,
                        freelancer_work_links: Array.isArray(subRes.data.freelancer_work_links) ? subRes.data.freelancer_work_links : JSON.parse(subRes.data.freelancer_work_links || "[]"),
                        freelancer_work_files: Array.isArray(subRes.data.freelancer_work_files) ? subRes.data.freelancer_work_files : JSON.parse(subRes.data.freelancer_work_files || "[]")
                    };
                    setSubmission(parsedSub);
                    setSetupData({
                        instructions: subRes.data.instructions || "",
                        expectations: subRes.data.expectations || "",
                        deadline: subRes.data.deadline ? subRes.data.deadline.split('T')[0] : "",
                        files: Array.isArray(subRes.data.founder_files) ? subRes.data.founder_files : JSON.parse(subRes.data.founder_files || "[]")
                    });
                }
            } catch (e) {
                // No submission yet, that's fine
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            toast.error("Failed to load project dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSetup = async () => {
        try {
            await api.post("/api/submissions/setup", {
                job_id: jobId,
                freelancer_id: freelancerId,
                founder_id: localStorage.getItem("user_id"),
                ...setupData
            });
            toast.success("Project setup saved! Freelancer notified.");
            fetchData();
        } catch (err) {
            toast.error("Failed to save setup");
        }
    };

    const handleApprove = async () => {
        if (!window.confirm("Are you sure? This will release the payment to the freelancer's wallet.")) return;
        try {
            await api.put(`/api/submissions/${submission.id}/approve`);
            toast.success("Payment released! Project marked as completed.");
            fetchData();
        } catch (err) {
            toast.error("Failed to approve work");
        }
    };

    const handleRequestChanges = async () => {
        const feedback = window.prompt("Enter feedback for changes:");
        if (!feedback) return;
        try {
            await api.put(`/api/submissions/${submission.id}/request-changes`, { feedback });
            toast.success("Feedback sent to freelancer");
            fetchData();
        } catch (err) {
            toast.error("Failed to send feedback");
        }
    };

    const handleReviewSubmit = async () => {
        if (status !== 'completed') {
            return toast.warn("You can only submit a review after the project is completed.");
        }
        if (!reviewData.review_text) return toast.warn("Please write some feedback.");

        try {
            await api.post("/api/reviews", {
                user_id: freelancerId,
                reviewer_id: localStorage.getItem("user_id"),
                stars: reviewData.stars,
                review_text: reviewData.review_text
            });
            toast.success("Review submitted! Thank you.");
            setReviewSubmitted(true);
            // Recalculate credibility
            api.post("/api/reviews/recalculate-credibility", { user_id: freelancerId });
        } catch (err) {
            toast.error("Failed to submit review");
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Loading Founder Dashboard...</div>;

    const status = submission?.status || 'pending_setup';
    const progress = submission?.progress || 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="pt-24 pb-20 px-4 md:px-6 max-w-6xl mx-auto space-y-8 overflow-x-hidden">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900/50 border border-white/10 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-2xl">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-blue-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Active Project</span>
                            <span className="text-gray-500 font-mono text-xs">#{jobId}-{freelancerId}</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black">{job?.job_title}</h1>
                        <p className="text-gray-400 font-medium text-sm md:text-base">Working with <span className="text-blue-400">@{freelancer?.full_name}</span></p>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                        <div className="text-left md:text-right">
                            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Escrow Balance</p>
                            <p className="text-2xl md:text-3xl font-black text-green-400">{job?.budget_range || '₹10,000'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {submission?.deadline && (status !== 'completed') && (
                                <CountdownTimer deadline={submission.deadline} />
                            )}
                            <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border ${status === 'completed' ? 'bg-green-500/10 border-green-500 text-green-500' :
                                status === 'submitted' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' :
                                    'bg-blue-500/10 border-blue-500 text-blue-500'
                                }`}>
                                {status.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Project Progress</h3>
                        <span className="text-blue-400 font-black">{progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <span>Setup</span>
                        <span>In Progress</span>
                        <span>Review</span>
                        <span>Payout</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Setup Panel (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-5 md:p-8 space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <FileText className="text-blue-500" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Instructions & Setup</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Work Instructions</label>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none min-h-[150px] transition-all"
                                        placeholder="Describe the exact steps and workflow..."
                                        value={setupData.instructions}
                                        onChange={e => setSetupData({ ...setupData, instructions: e.target.value })}
                                        disabled={status === 'completed' || status === 'submitted'}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Final Expectations</label>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none min-h-[100px] transition-all"
                                        placeholder="Define the metrics for approval..."
                                        value={setupData.expectations}
                                        onChange={e => setSetupData({ ...setupData, expectations: e.target.value })}
                                        disabled={status === 'completed' || status === 'submitted'}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Hard Deadline</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                            <input
                                                type="date"
                                                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
                                                value={setupData.deadline}
                                                onChange={e => setSetupData({ ...setupData, deadline: e.target.value })}
                                                disabled={status === 'completed' || status === 'submitted'}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={handleSaveSetup}
                                            disabled={status === 'completed' || status === 'submitted'}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                                        >
                                            <Send size={16} /> Update Project Setup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Freelancer Submission View */}
                        {status === 'submitted' || status === 'completed' ? (
                            <div className="bg-gradient-to-br from-green-500/10 to-blue-500/5 border border-green-500/20 rounded-3xl p-5 md:p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="text-green-500" />
                                        <h2 className="text-xl font-black uppercase tracking-tight">Work Submitted</h2>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic font-mono">Timestamp: {new Date(submission?.updated_at).toLocaleString()}</span>
                                </div>

                                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 space-y-4">
                                    <p className="text-gray-300 text-sm italic font-medium leading-relaxed">
                                        "{submission?.freelancer_work_desc}"
                                    </p>

                                    {/* Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {Array.isArray(submission?.freelancer_work_links) && submission.freelancer_work_links.map((link, i) => (
                                            <a key={i} href={link} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all">
                                                <ExternalLink size={14} /> View Deliverable
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {status === 'submitted' && (
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-black font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 uppercase tracking-widest transition-all"
                                        >
                                            Accept & Pay {job?.budget_range}
                                        </button>
                                        <button
                                            onClick={handleRequestChanges}
                                            className="px-8 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl border border-white/10 uppercase tracking-widest transition-all"
                                        >
                                            Changes
                                        </button>
                                    </div>
                                )}

                                {status === 'completed' && (
                                    <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-6 text-center">
                                        <p className="text-green-400 font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            <CheckCircle size={18} /> Project Fully Completed & Paid
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* Freelancer Profile Card */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl border-2 border-blue-500/30 overflow-hidden">
                                <img src={freelancer?.profile_picture_url?.startsWith('http') ? freelancer.profile_picture_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${freelancer?.profile_picture_url}`} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-black text-lg">{freelancer?.full_name}</h3>
                            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-4">Contracted Freelancer</p>
                            <button className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-black py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 uppercase tracking-widest">
                                <MessageSquare size={14} /> Open Chat
                            </button>
                        </div>

                        {/* Deadlines & Alerts */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Timeline</h3>
                            <div className="flex items-center gap-3">
                                <Clock className="text-yellow-500 w-5 h-5" />
                                <div>
                                    <p className="text-xs font-black text-white">{setupData.deadline || 'Not Set'}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Project Deadline</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <AlertCircle className="text-blue-500 w-5 h-5" />
                                <div>
                                    <p className="text-xs font-black text-white">Funds in Escrow</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Verified & Secured</p>
                                </div>
                            </div>
                        </div>

                        {/* Review Panel */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Rate Performance</h3>
                            {reviewSubmitted ? (
                                <div className="text-center py-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                                    <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Review Sent ✅</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star
                                                key={s}
                                                size={20}
                                                className={`cursor-pointer transition-all ${s <= reviewData.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                onClick={() => setReviewData({ ...reviewData, stars: s })}
                                            />
                                        ))}
                                    </div>
                                    <textarea
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] focus:border-blue-500 outline-none min-h-[80px]"
                                        placeholder="Add a review for the freelancer..."
                                        value={reviewData.review_text}
                                        onChange={e => setReviewData({ ...reviewData, review_text: e.target.value })}
                                    />
                                    <button
                                        onClick={handleReviewSubmit}
                                        className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${status === 'completed' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Submit Review
                                    </button>
                                    {status !== 'completed' && <p className="text-[8px] text-gray-600 text-center uppercase tracking-widest font-bold">Unlocks after completion</p>}
                                </div>
                            )}
                        </div>

                        {/* File Upload Summary */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Founder Assets</h3>
                            <div className="space-y-2">
                                {/* Simulated file list */}
                                <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <FileText size={14} className="text-gray-500" />
                                        <span className="text-[10px] font-bold text-gray-400">brand_assets.pdf</span>
                                    </div>
                                    <Download size={14} className="text-gray-600 group-hover:text-blue-400 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
