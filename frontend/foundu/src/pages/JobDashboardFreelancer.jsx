import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/axiosConfig";
import {
    FileText,
    Calendar,
    Target,
    Upload,
    Send,
    CheckCircle,
    Clock,
    AlertCircle,
    Download,
    ExternalLink,
    ChevronRight,
    MessageSquare,
    Link as LinkIcon,
    Plus,
    X
} from "lucide-react";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";

export default function JobDashboardFreelancer() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState(null);
    const [job, setJob] = useState(null);
    const [founder, setFounder] = useState(null);

    // Submission Form State
    const [workData, setWorkData] = useState({
        freelancer_work_desc: "",
        freelancer_work_links: [],
        freelancer_work_files: []
    });
    const [newLink, setNewLink] = useState("");
    const [isDeadlineExceeded, setIsDeadlineExceeded] = useState(false);

    useEffect(() => {
        fetchData();
    }, [jobId, userId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Job
            const jobRes = await api.get(`/api/jobs/${jobId}`);
            setJob(jobRes.data);

            // 2. Fetch current submission/tracking status
            const subRes = await api.get(`/api/submissions/${jobId}/${userId}`);
            if (subRes.data) {
                setSubmission(subRes.data);
                setWorkData({
                    freelancer_work_desc: subRes.data.freelancer_work_desc || "",
                    freelancer_work_links: Array.isArray(subRes.data.freelancer_work_links) ? subRes.data.freelancer_work_links : JSON.parse(subRes.data.freelancer_work_links || "[]"),
                    freelancer_work_files: Array.isArray(subRes.data.freelancer_work_files) ? subRes.data.freelancer_work_files : JSON.parse(subRes.data.freelancer_work_files || "[]")
                });

                // 3. Fetch Founder
                const fRes = await api.get(`/api/users/${subRes.data.founder_id}`);
                setFounder(fRes.data?.data || fRes.data);
            }
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            toast.error("Founder hasn't set up the project details yet.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptProject = async () => {
        try {
            await api.put(`/api/submissions/${submission.id}/start`);
            toast.success("Project Started! Progress at 50%.");
            fetchData();
        } catch (err) {
            toast.error("Failed to start project");
        }
    };

    const handleSubmitWork = async () => {
        if (!workData.freelancer_work_desc) return toast.warn("Please add a description of your work.");

        // Auto-add any current link in the input box
        let finalWorkData = { ...workData };
        if (newLink) {
            finalWorkData.freelancer_work_links = [...workData.freelancer_work_links, newLink];
        }

        try {
            await api.put(`/api/submissions/${submission.id}/submit`, finalWorkData);
            toast.success("Work submitted for review!");
            setNewLink("");
            fetchData();
        } catch (err) {
            toast.error("Failed to submit work");
        }
    };

    const addLink = () => {
        if (!newLink) return;
        setWorkData({ ...workData, freelancer_work_links: [...workData.freelancer_work_links, newLink] });
        setNewLink("");
    };

    const removeLink = (index) => {
        const updated = workData.freelancer_work_links.filter((_, i) => i !== index);
        setWorkData({ ...workData, freelancer_work_links: updated });
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Loading Freelancer Dashboard...</div>;

    const status = submission?.status || 'pending_setup';
    const progress = submission?.progress || 0;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="pt-24 pb-20 px-4 md:px-6 max-w-6xl mx-auto space-y-8 overflow-x-hidden">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-900/50 border border-white/10 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-2xl">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Ongoing Gig</span>
                            <span className="text-gray-500 font-mono text-xs">#{jobId}</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black">{job?.job_title}</h1>
                        <p className="text-gray-400 font-medium text-sm md:text-base">Hired by <span className="text-yellow-400">@{founder?.full_name}</span></p>
                    </div>

                    <div className="flex flex-col md:items-end gap-2 md:text-right">
                        <div>
                            <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">Expected Payout</p>
                            <p className="text-2xl md:text-3xl font-black text-green-400">{job?.budget_range || '₹10,000'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {submission?.deadline && (status !== 'completed') && (
                                <CountdownTimer
                                    deadline={submission.deadline}
                                    onExpire={() => setIsDeadlineExceeded(true)}
                                />
                            )}
                            <div className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border ${status === 'completed' ? 'bg-green-500/10 border-green-500 text-green-500' :
                                status === 'submitted' ? 'bg-blue-500/10 border-blue-500 text-blue-500' :
                                    status === 'changes_requested' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                        'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                                }`}>
                                {status.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-900/30 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">My Progress</h3>
                        <span className="text-yellow-300 font-black">{progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-600 to-orange-400 transition-all duration-1000 shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* View Setup (Left Sidebar for Freelancer) */}
                    <div className="space-y-6">
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 space-y-6">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <Clock className="text-yellow-500" />
                                <h2 className="text-sm font-black uppercase tracking-tight">Project Timeline</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hard Deadline</p>
                                    <p className="text-sm font-black text-white">{submission?.deadline ? new Date(submission.deadline).toLocaleDateString() : 'TBD'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status Updates</p>
                                    <p className="text-xs text-gray-400 font-medium italic">"{status === 'changes_requested' ? 'Founder requested revisions' : 'Ready to work'}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Founder Files */}
                        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Brief & Assets</h3>
                            <div className="space-y-3">
                                {Array.isArray(submission?.founder_files) && submission.founder_files.length > 0 ? (
                                    submission.founder_files.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-blue-400" />
                                                <span className="text-[10px] truncate max-w-[120px] font-bold">Asset #{i + 1}</span>
                                            </div>
                                            <a href={file} target="_blank"><Download size={14} className="text-gray-500 hover:text-white" /></a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[10px] text-gray-600 italic">No files attached by founder.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Work Submission Panel (Main) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Request Changes Feedback */}
                        {status === 'changes_requested' && submission?.feedback && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 md:p-8 space-y-4 animate-pulse">
                                <div className="flex items-center gap-3 text-red-500">
                                    <AlertCircle size={20} />
                                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Changes Requested</h2>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 md:p-6">
                                    <p className="text-gray-300 text-sm italic font-medium leading-relaxed">
                                        "{submission.feedback}"
                                    </p>
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Please update your work and resubmit below</p>
                            </div>
                        )}

                        {/* Founder's Instructions Display */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-white/10 rounded-3xl p-5 md:p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <Target className="text-blue-400" />
                                <h2 className="text-xl font-black uppercase tracking-tight">Instructions</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Project Brief</p>
                                    <p className="text-gray-300 text-sm leading-relaxed">{submission?.instructions || "Waiting for founder's brief..."}</p>
                                </div>
                                <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 text-center">Deliverable Expectations</p>
                                    <p className="text-gray-400 text-xs italic text-center leading-relaxed">"{submission?.expectations || "Not specified."}"</p>
                                </div>
                            </div>

                            {status === 'pending_setup' && (
                                <button
                                    onClick={handleAcceptProject}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
                                >
                                    Accept Brief & Start Project
                                </button>
                            )}
                        </div>

                        {/* Freelancer Work Submission Form */}
                        {(status === 'in_progress' || status === 'submitted' || status === 'changes_requested' || status === 'completed') && (
                            <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-5 md:p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Upload className="text-yellow-500" />
                                    <h2 className="text-xl font-black uppercase tracking-tight">Upload Your Work</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Work Description</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-yellow-500 outline-none min-h-[120px] transition-all"
                                            placeholder="What have you completed? Provide a summary of your work..."
                                            value={workData.freelancer_work_desc}
                                            onChange={e => setWorkData({ ...workData, freelancer_work_desc: e.target.value })}
                                            disabled={status === 'completed' || status === 'submitted'}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Links (Live Demos, GitHub, Drive)</label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-yellow-500 outline-none"
                                                placeholder="https://..."
                                                value={newLink}
                                                onChange={e => setNewLink(e.target.value)}
                                                disabled={status === 'completed' || status === 'submitted'}
                                            />
                                            <button
                                                onClick={addLink}
                                                disabled={status === 'completed' || status === 'submitted'}
                                                className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-2 rounded-xl hover:bg-yellow-500/20"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {workData.freelancer_work_links.map((link, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                                                    <span className="text-[10px] text-blue-400 truncate max-w-[200px]">{link}</span>
                                                    <button onClick={() => removeLink(i)} className="text-gray-500 hover:text-red-400"><X size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {status !== 'completed' && status !== 'submitted' ? (
                                        <div className="space-y-3">
                                            {isDeadlineExceeded && (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">
                                                    Submission Locked: Deadline Exceeded
                                                </div>
                                            )}
                                            <button
                                                onClick={handleSubmitWork}
                                                disabled={isDeadlineExceeded}
                                                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:grayscale text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-500/20 uppercase tracking-widest text-xs transition-all"
                                            >
                                                Submit Work for Founder Review
                                            </button>
                                        </div>
                                    ) : status === 'submitted' ? (
                                        <div className="bg-blue-500/20 border border-blue-500/40 rounded-2xl p-6 text-center">
                                            <p className="text-blue-400 font-black uppercase tracking-widest flex items-center justify-center gap-2 text-xs">
                                                <CheckCircle size={16} /> Work Under Review by Founder
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
