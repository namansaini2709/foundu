import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getUserId, getUserType } from "../utils/authUtils";
import {
  X,
  Briefcase,
  Users,
  Target,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Github,
  Linkedin,
  ExternalLink,
  Star,
  CheckCircle,
  User,
  Send,
} from "lucide-react";
import Footer from "../components/Footer";
export default function JobApplicationsDashboard() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showMoreAI, setShowMoreAI] = useState(false);
  // Real data states
  const [jobs, setJobs] = useState([]);
  const [manualApplicants, setManualApplicants] = useState([]);
  const [aiMatchedApplicants, setAiMatchedApplicants] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    aiMatched: 0,
  });
  // Get user data from localStorage (Same logic as FreelancerJobDetail)
  const getUserData = useCallback(() => {
    try {
      const directUserId = getUserId();
      const directUserType = getUserType();
      if (directUserId && directUserType) {
        return { user_id: directUserId, user_type: directUserType };
      }
      return null;
    } catch (e) {
      console.error("Error getting user data:", e);
      return null;
    }
  }, []);
  // Fetch jobs posted by this founder
  const fetchJobs = useCallback(async () => {
    const userData = getUserData();
    if (!userData || !userData.user_id) {
      toast.error("Please login to view your dashboard");
      navigate("/login-signup");
      return;
    }
    try {
      setLoading(true);
      const response = await api.get("/api/jobs");
      const allJobs = response.data;
      
      const targetUserId = Number(userData.user_id);
      
      // Filter jobs by current user
      const filteredJobs = allJobs.filter(job => {
        const jobUserId = Number(job.user_id);
        const jobFounderId = Number(job.founder_id);
        return jobUserId === targetUserId || jobFounderId === targetUserId;
      });

      const mappedJobs = filteredJobs.map(job => {
        let previewText = "";
        try {
          previewText = job.job_requirements ? JSON.parse(job.job_requirements).join(", ") : job.full_job_description;
        } catch (e) {
          previewText = job.job_requirements || job.full_job_description;
        }
        return {
          id: job.job_id,
          title: job.job_title,
          preview: previewText.substring(0, 50) + (previewText.length > 50 ? "..." : ""),
          applicants: 0,
          status: "Open"
        };
      });
      setJobs(mappedJobs);
      setStats(prev => ({ ...prev, activeJobs: mappedJobs.length }));
      
      const jobsWithCounts = await Promise.all(mappedJobs.map(async (job) => {
        try {
          const appRes = await api.get(`/api/jobs/${job.id}/applicants`);
          if (appRes.status === 200) {
            const apps = appRes.data;
            return { ...job, applicants: apps.length };
          }
        } catch (e) { }
        return job;
      }));
      setJobs(jobsWithCounts);
      const totalApps = jobsWithCounts.reduce((sum, job) => sum + job.applicants, 0);
      setStats(prev => ({ ...prev, totalApplicants: totalApps }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error loading dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [getUserData, navigate]);

  useEffect(() => {
    if (!selectedJob) return;
    const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");

    const fetchApplicants = async () => {
      try {
        const response = await api.get(`/api/jobs/${selectedJob}/applicants`);
        const apps = response.data;
        const mappedApps = apps.map(app => {
          const isFreelancer = app.user_type === "freelancer";
          const skills = isFreelancer
            ? app.skills_description || "N/A"
            : [app.superpower1, app.superpower2, app.superpower3].filter(Boolean).join(", ") || "N/A";
          
          let profileImg = app.profile_picture_url;
          if (profileImg && !profileImg.startsWith('http')) {
            profileImg = `${BASE_URL}${profileImg}`;
          }

          return {
            id: app.user_id,
            name: app.full_name,
            role: isFreelancer ? "Freelancer" : "Cofounder",
            match: null,
            status: app.status || "pending",
            rawStatus: app.status || "pending",
            image: profileImg,
            badges: ["verified"],
            details: {
              experience: app.experience || (isFreelancer ? "N/A" : "Expert"),
              skills: skills,
              availability: "Immediate",
              workPref: isFreelancer ? app.working_environment || "Remote" : "Co-founder",
              email: app.email,
              phone: (isFreelancer ? app.phone_number : app.reference_contact) || "N/A",
              location: "Remote",
              applied: new Date(app.created_at).toLocaleDateString(),
              github: isFreelancer ? app.github : app.github_behance,
              linkedin: app.linkedin
            }
          };
        });
        setManualApplicants(mappedApps);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();

    const fetchAIMatches = async () => {
      setAiLoading(true);
      try {
        const res = await api.get(`/api/jobs/${selectedJob}/ai-matches`);
        if (res.status === 200) {
          const data = res.data;
          const mapped = data.map(a => {
            let profileImg = a.profile_picture_url;
            if (profileImg && !profileImg.startsWith('http')) {
              profileImg = `${BASE_URL}${profileImg}`;
            }

            return {
              id: a.user_id,
              name: a.full_name,
              role: a.user_type === 'freelancer' ? (a.freelancer_type || 'Freelancer') : (a.primary_identity || 'Cofounder'),
              match: a.match_score,
              isAI: true,
              ai_reason: a.ai_reason,
              status: a.status || 'pending',
              rawStatus: a.status || 'pending',
              image: profileImg,
              badges: [],
              details: {
                experience: a.experience || 'N/A',
                skills: a.skills_description || [a.superpower1, a.superpower2, a.superpower3].filter(Boolean).join(', ') || 'N/A',
                availability: 'Immediate',
                workPref: a.working_environment || 'Remote',
                email: a.email,
                phone: a.phone_number || a.reference_contact || 'N/A',
                location: 'Remote',
                applied: 'AI Match',
                github: a.github || a.github_behance,
                linkedin: a.linkedin || a.cp_linkedin
              }
            };
          });
          setAiMatchedApplicants(mapped);
          setStats(prev => ({ ...prev, aiMatched: mapped.length }));
        }
      } catch (err) {
        console.error('Error fetching AI matches:', err);
      } finally {
        setAiLoading(false);
      }
    };
    fetchAIMatches();
  }, [selectedJob]);
  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  const getBadgeColor = (badge) => {
    const colors = {
      verified: "bg-blue-500",
      trial: "bg-green-500",
      top: "bg-yellow-500",
      responsive: "bg-purple-500",
      founder: "bg-red-500",
      execution: "bg-cyan-500",
    };
    return colors[badge] || "bg-gray-500";
  };
  const getBadgeName = (badge) => {
    const names = {
      verified: "Verified",
      trial: "Trial Complete",
      top: "Top Performer",
      responsive: "Highly Responsive",
      founder: "Founder Preferred",
      execution: "Strong Execution",
    };
    return names[badge] || badge;
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'Shortlisted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'New';
      default: return status || 'New';
    }
  };
  const ApplicantCard = ({ applicant, onClick }) => (
    <div
      onClick={onClick}
      className="bg-gray-900/80 border border-white/5 rounded-2xl p-4 hover:border-blue-500/40 hover:bg-gray-800/80 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          {applicant.image && applicant.image.length > 5 ? (
            <img src={applicant.image} alt={applicant.name} className="w-full h-full rounded-xl object-cover border-2 border-blue-500/20 shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-400">
              <User className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">
            {applicant.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{applicant.role}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {applicant.match != null && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-black font-black px-3 py-1 rounded-full text-sm shadow-lg shadow-green-500/20">
              {applicant.match}%
            </div>
          )}
          {applicant.status && (
            <div
              className={`${getStatusColor(applicant.status)} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}
            >
              {getStatusLabel(applicant.status)}
            </div>
          )}
          {applicant.isAI && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              AI Match
            </div>
          )}
        </div>
      </div>
      {applicant.ai_reason && (
        <p className="text-gray-500 text-xs mt-2 italic pl-15 line-clamp-1">{applicant.ai_reason}</p>
      )}
    </div>
  );
  // ── Action Handlers ──
  const handleUpdateStatus = async (applicantId, newStatus) => {
    if (!selectedJob) return;
    console.log(`[FRONTEND] Updating status: job=${selectedJob}, applicant=${applicantId}, status=${newStatus}`);
    try {
      const response = await api.put(
        `/api/jobs/${selectedJob}/applicants/${applicantId}/status`,
        { status: newStatus }
      );
      console.log('[FRONTEND] Update response:', response.data);
      toast.success(`Applicant ${newStatus === 'accepted' ? 'shortlisted' : 'rejected'} successfully!`, { theme: 'dark' });
      // Refresh the applicant list so the status updates in real-time
      const refreshRes = await api.get(`/api/jobs/${selectedJob}/applicants`);
      if (refreshRes.status === 200) {
        const apps = refreshRes.data;
        const mappedApps = apps.map(app => {
          const isFreelancer = app.user_type === 'freelancer';
          const skills = isFreelancer
            ? app.skills_description || 'N/A'
            : [app.superpower1, app.superpower2, app.superpower3].filter(Boolean).join(', ') || 'N/A';
          const githubLink = isFreelancer ? app.github : app.github_behance;
          const linkedinLink = app.linkedin;
          const phoneNum = isFreelancer ? app.phone_number : app.reference_contact;
          return {
            id: app.user_id,
            name: app.full_name,
            role: isFreelancer ? 'Freelancer' : 'Cofounder',
            match: null,
            status: app.status || 'pending',
            rawStatus: app.status || 'pending',
            image: app.profile_picture_url 
              ? (app.profile_picture_url.startsWith('http') ? app.profile_picture_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${app.profile_picture_url}`)
              : "👤",
            badges: ['verified'],
            details: {
              experience: app.experience || (isFreelancer ? 'N/A' : 'Expert'),
              skills,
              availability: 'Immediate',
              workPref: isFreelancer ? app.working_environment || 'Remote' : 'Co-founder',
              email: app.email,
              phone: phoneNum || 'N/A',
              location: 'Remote',
              applied: new Date(app.created_at).toLocaleDateString(),
              github: githubLink,
              linkedin: linkedinLink
            }
          };
        });
        setManualApplicants(mappedApps);
        // Also update the selected applicant so status refreshes in modal
        const updated = mappedApps.find(a => a.id === applicantId);
        if (updated) setSelectedApplicant(updated);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update applicant status', { theme: 'dark' });
    }
  };
  const handleContact = async (applicantId) => {
    try {
      const res = await api.post(`/api/chat/create`, {
        otherUserId: applicantId,
        userId: parseInt(getUserId())
      });
      toast.success('Redirecting to chat...', { theme: 'dark', autoClose: 1000 });
      setTimeout(() => {
        navigate('/chatbox');
      }, 1000);
    } catch (err) {
      console.error('Error creating chat:', err);
      toast.error('Failed to start chat. Make sure you are logged in.', { theme: 'dark' });
    }
  };
  const ApplicantModal = ({ applicant, onClose }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const details = applicant.details || {};
    const currentStatus = applicant.rawStatus || applicant.status || 'pending';
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/api/users/${applicant.id}`);
          // getUserById returns { success: true, data: {...} }
          setUserDetails(res.data?.data || res.data);
        } catch (err) {
          console.error('Error fetching user details:', err);
        } finally {
          setLoadingDetails(false);
        }
      };
      const fetchPosts = async () => {
        try {
          const res = await api.get(`/api/posts/user/${applicant.id}`);
          setUserPosts(Array.isArray(res.data) ? res.data : (res.data?.data || []));
        } catch (err) {
          console.error('Error fetching user posts:', err);
        }
      };
      fetchUser();
      fetchPosts();
    }, [applicant.id]);
    const ud = userDetails || {};
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-gray-950 border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Close button */}
          <div className="sticky top-0 z-10 flex justify-end p-4">
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>
          <div className="px-8 pb-8 -mt-4 space-y-6">
            {/* Avatar + Name */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {applicant.image && applicant.image.length > 5 ? (
                  <img src={applicant.image} alt={applicant.name} className="w-full h-full rounded-2xl object-cover border-2 border-blue-500/30 shadow-xl" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/20 flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-400" />
                  </div>
                )}
                {ud.blue_tick_verified === 1 && (
                  <div className="absolute -right-2 -bottom-2 p-1.5 bg-blue-500 rounded-xl border-4 border-gray-950">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-black text-white mb-1">{applicant.name}</h2>
              {/* Role type */}
              <div className="text-blue-400 font-bold text-sm uppercase tracking-[0.3em] mb-2">
                {ud.professional_role || applicant.role || 'Professional'}
              </div>
              {/* Badges Row */}
              {(ud.blue_tick_verified === 1 || ud.golden_tick_verified === 1 || ud.green_tick_verified === 1) && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  {ud.blue_tick_verified === 1 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-blue-400 text-[9px] font-black uppercase tracking-wider">Blue</span>
                    </div>
                  )}
                  {ud.golden_tick_verified === 1 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]"></div>
                      <span className="text-yellow-400 text-[9px] font-black uppercase tracking-wider">Gold</span>
                    </div>
                  )}
                  {ud.green_tick_verified === 1 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
                      <span className="text-emerald-400 text-[9px] font-black uppercase tracking-wider">Green</span>
                    </div>
                  )}
                </div>
              )}
              {/* Type + Score + Status */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {ud.user_type || applicant.role}
                </span>
                {ud.credibility_score != null && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {ud.credibility_score}/100
                  </div>
                )}
                {applicant.match != null && (
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/20 text-green-400 text-[10px] font-black uppercase">
                    {applicant.match}% Match
                  </div>
                )}
                <div className={`${getStatusColor(currentStatus)} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider`}>
                  {getStatusLabel(currentStatus)}
                </div>
              </div>
            </div>
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center transition-all hover:bg-white/10">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Jobs Completed</div>
                <div className="text-2xl font-black text-white">{ud.jobs_completed || 0}</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center transition-all hover:bg-white/10">
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Applied</div>
                <div className="text-lg font-black text-white">{details.applied || 'N/A'}</div>
              </div>
            </div>
            {/* AI Reason (if AI matched) */}
            {applicant.ai_reason && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">AI Match Reason</h4>
                <div className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{applicant.ai_reason}</p>
                </div>
              </div>
            )}
            {/* Job Role Section — shows freelancer_type / professional_role */}
            {(ud.professional_role || ud.job_profile) && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Job Role</h4>
                <div className="flex items-center gap-3 p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{ud.professional_role || ud.job_profile}</div>
                    {ud.job_profile && ud.professional_role && ud.job_profile !== ud.professional_role && (
                      <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{ud.job_profile}</div>
                    )}
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Current Role</div>
                  </div>
                </div>
              </div>
            )}
            {/* Professional Bio */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Professional Bio</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
                {ud.professional_bio || details.skills || "No bio available."}
              </p>
            </div>
            {/* Experience Section */}
            {(ud.experience || details.experience) && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-green-400">Experience</h4>
                <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-2xl border border-green-500/10">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{ud.experience || details.experience}</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Professional Experience</div>
                  </div>
                </div>
              </div>
            )}
            {/* Contact Information */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Contact Information</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  {ud.contact_phone || details.phone || 'Not listed'}
                </div>
                <a
                  href={ud.contact_linkedin || details.linkedin || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  LinkedIn Profile
                </a>
                <a
                  href={ud.contact_github || details.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-gray-600 group-hover:text-white transition-all">
                    <Github className="w-5 h-5" />
                  </div>
                  GitHub Profile
                </a>
              </div>
            </div>
            {/* User Posts */}
            {userPosts.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Posts ({userPosts.length})</h4>
                <div className="grid grid-cols-3 gap-2">
                  {userPosts.map((post, i) => (
                    <div key={post.id || i} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                      {post.image_url ? (
                        <img
                          src={post.image_url.startsWith('http') ? post.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${post.image_url}`}
                          alt={post.caption || 'Post'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">
                          {post.caption || 'No image'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-white/5">
              <button
                onClick={() => handleUpdateStatus(applicant.id, 'accepted')}
                disabled={currentStatus === 'accepted'}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${currentStatus === 'accepted'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-400 text-black hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02]'
                }`}
              >
                {currentStatus === 'accepted' ? '✓ Shortlisted' : 'Shortlist'}
              </button>
              <button
                onClick={() => handleContact(applicant.id)}
                className="flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Contact
              </button>
              <button
                onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                disabled={currentStatus === 'rejected'}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer ${currentStatus === 'rejected'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-rose-400 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02]'
                }`}
              >
                {currentStatus === 'rejected' ? '✗ Rejected' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)" }}>
        <div className="text-white text-2xl font-bold animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
      }}
    >
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Job Applications
            </h1>
            <p className="text-gray-400 mb-4">
              Review all applicants for your posted jobs — manually and with
              AI-assisted recommendations.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-blue-500 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-blue-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Active Jobs</p>
                    <p className="text-white text-2xl font-bold">
                      {stats.activeJobs}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="text-green-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Total Applicants</p>
                    <p className="text-white text-2xl font-bold">
                      {stats.totalApplicants}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-yellow-500 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Target className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">AI-Matched</p>
                    <p className="text-white text-2xl font-bold">
                      {stats.aiMatched}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Your Job Postings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`bg-gray-900 border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedJob === job.id
                    ? "border-blue-500 shadow-lg shadow-blue-500/50"
                    : "border-gray-800 hover:border-gray-700"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm">
                      {job.title}
                    </h3>
                    <div className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      {job.applicants} Apps
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{job.preview}</p>
                  <div
                    className={`inline-block text-xs px-2 py-1 rounded ${job.status === "Open"
                      ? "bg-green-500 text-black"
                      : "bg-gray-700 text-gray-300"
                      }`}
                  >
                    {job.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedJob && (
            <>
              {/* <div className="bg-gray-900 border border-purple-500 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Target className="text-purple-500" />
                    AI Recommended — Top Matches for This Job
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Based on role requirements, platform signals, and historical
                    success patterns.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {topRecommended.slice(0, 5).map((applicant) => (
                  <div
                    key={applicant.id}
                    onClick={() => setSelectedApplicant(applicant)}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-purple-500 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{applicant.image}</div>
                      <h4 className="text-white font-semibold text-sm truncate group-hover:text-purple-400">
                        {applicant.name}
                      </h4>
                      <div className="bg-green-500 text-black font-bold px-2 py-1 rounded-full text-xs mt-2 inline-block">
                        {applicant.match}%
                      </div>
                      <div
                        className={`mt-2 text-xs px-2 py-1 rounded ${
                          applicant.source === "Applied"
                            ? "bg-blue-500 text-white"
                            : "bg-purple-500 text-white"
                        }`}
                      >
                        {applicant.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!showMoreAI && topRecommended.length > 5 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowMoreAI(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  >
                    View More
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
              {showMoreAI && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
                  {topRecommended.slice(5, 10).map((applicant) => (
                    <div
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-purple-500 transition-all cursor-pointer group"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-2">{applicant.image}</div>
                        <h4 className="text-white font-semibold text-sm truncate group-hover:text-purple-400">
                          {applicant.name}
                        </h4>
                        <div className="bg-green-500 text-black font-bold px-2 py-1 rounded-full text-xs mt-2 inline-block">
                          {applicant.match}%
                        </div>
                        <div
                          className={`mt-2 text-xs px-2 py-1 rounded ${
                            applicant.source === "Applied"
                              ? "bg-blue-500 text-white"
                              : "bg-purple-500 text-white"
                          }`}
                        >
                          {applicant.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  All Applicants
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                      <Users size={20} />
                      Manually Applied Applicants
                    </h3>
                    <div className="space-y-3">
                      {manualApplicants.map((applicant, idx) => (
                        <ApplicantCard
                          key={applicant.id ?? `manual-${idx}`}
                          applicant={applicant}
                          onClick={() => setSelectedApplicant(applicant)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center gap-2">
                      <Target size={20} />
                      AI-Matched Applicants
                      <span className="text-xs text-gray-500 font-normal ml-2">(Top 3 by Gemini)</span>
                    </h3>
                    <div className="space-y-3">
                      {aiLoading ? (
                        <div className="bg-gray-900/80 border border-purple-500/20 rounded-2xl p-8 text-center">
                          <div className="animate-pulse text-purple-400 font-bold text-sm">
                            🤖 Gemini AI is analyzing applicants...
                          </div>
                          <p className="text-gray-500 text-xs mt-2">This may take a few seconds</p>
                        </div>
                      ) : aiMatchedApplicants.length > 0 ? (
                        aiMatchedApplicants.map((applicant, idx) => (
                          <ApplicantCard
                            key={applicant.id ?? `ai-${idx}`}
                            applicant={applicant}
                            onClick={() => setSelectedApplicant(applicant)}
                          />
                        ))
                      ) : (
                        <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 text-center">
                          <p className="text-gray-500 text-sm">No AI matches available yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {!selectedJob && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <Briefcase className="text-gray-600 mx-auto mb-4" size={48} />
              {jobs.length > 0 ? (
                <p className="text-gray-400 text-lg">
                  Select a job posting to view applicants
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-yellow-500 text-lg font-semibold">
                    No job postings found for this account.
                  </p>
                  <div className="text-gray-400 text-sm bg-gray-800/50 p-4 rounded-lg inline-block text-left">
                    <p>Current Account: <span className="text-white font-mono">{getUserData()?.user_type}</span></p>
                    <p>Note: Jobs are only visible to the Founder who posted them.</p>
                    <p className="mt-2 text-blue-400 italic">Try logging in with your Founder account (User ID: 24) to see the jobs you created.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      {selectedApplicant && (
        <ApplicantModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
    </div>
  );
}