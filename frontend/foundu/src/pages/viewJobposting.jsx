import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JobApplicationsDashboard() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showMoreAI, setShowMoreAI] = useState(false);

  // Real data states
  const [jobs, setJobs] = useState([]);
  const [manualApplicants, setManualApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    aiMatched: 48, // Keep dummy
  });

  // Get user data from localStorage (Same logic as FreelancerJobDetail)
  const getUserData = useCallback(() => {
    try {
      const possibleKeys = ["user", "userData", "currentUser", "authUser"];
      for (const key of possibleKeys) {
        const userDataString = localStorage.getItem(key);
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            const userId = userData.user_id || userData.id || userData.userId;
            const userType = userData.user_type || userData.userType || userData.applicant_type || userData.type;
            const founderId = userData.founder_id || userData.founderId;
            const freelancerId = userData.freelancer_id || userData.freelancerId;
            const cofounderId = userData.cofounder_id || userData.cofounderId;

            if (userId && userType) {
              console.log("Found user data:", { userId, founderId, userType });
              return {
                user_id: userId,
                user_type: userType,
                founder_id: founderId,
                freelancer_id: freelancerId,
                cofounder_id: cofounderId
              };
            }
          } catch (e) { }
        }
      }
      const directUserId = localStorage.getItem("user_id");
      const directUserType = localStorage.getItem("user_type");
      if (directUserId && directUserType) {
        return { user_id: directUserId, user_type: directUserType };
      }
      return null;
    } catch (error) {
      console.error("Error in getUserData:", error);
      return null;
    }
  }, []);

  // Fetch jobs posted by this founder
  const fetchJobs = useCallback(async () => {
    const userData = getUserData();
    if (!userData || !userData.user_id) {
      toast.error("Please login to view your dashboard");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const allJobs = await response.json();
      console.log("Total jobs fetched from API:", allJobs.length);
      console.log("Debug - userData:", userData);
      if (allJobs.length > 0) {
        console.log("Debug - First job from API:", {
          job_id: allJobs[0].job_id,
          user_id: allJobs[0].user_id,
          founder_id: allJobs[0].founder_id
        });
      }

      // Filter jobs by current user
      const filteredJobs = allJobs.filter(job => {
        const jobUserId = Number(job.user_id);
        const jobFounderId = Number(job.founder_id);
        const targetUserId = Number(userData.user_id);
        const targetFounderId = Number(userData.founder_id);

        const isMatch = (
          jobUserId === targetUserId ||
          (targetFounderId && jobFounderId === targetFounderId) ||
          (targetFounderId && jobUserId === targetFounderId) ||
          (targetUserId && jobFounderId === targetUserId)
        );

        return isMatch;
      });

      console.log("Filtered jobs for this user:", filteredJobs.length);

      // FALLBACK FOR DEVELOPMENT: If no jobs for this user, but jobs exist in DB, log a warning
      if (filteredJobs.length === 0 && allJobs.length > 0) {
        console.warn("⚠️ No jobs matched the logged-in user. Jobs in DB belong to other users.");
      }

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

      // Fetch applicant counts for each job
      const jobsWithCounts = await Promise.all(mappedJobs.map(async (job) => {
        try {
          const appRes = await fetch(`http://localhost:4000/api/jobs/${job.id}/applicants`);
          if (appRes.ok) {
            const apps = await appRes.json();
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
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  }, [getUserData, navigate]);

  // Fetch applicants for selected job
  useEffect(() => {
    if (!selectedJob) return;

    const fetchApplicants = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/jobs/${selectedJob}/applicants`);
        if (!response.ok) throw new Error("Failed to fetch applicants");

        const apps = await response.json();
        const mappedApps = apps.map(app => {
          const isFreelancer = app.user_type === "freelancer";
          const skills = isFreelancer
            ? app.skills_description || "N/A"
            : [app.superpower1, app.superpower2, app.superpower3].filter(Boolean).join(", ") || "N/A";

          const githubLink = isFreelancer ? app.github : app.github_behance;
          const linkedinLink = app.linkedin;
          const phoneNum = isFreelancer ? app.phone_number : app.reference_contact;

          return {
            id: app.user_id,
            name: app.full_name,
            role: isFreelancer ? "Freelancer" : "Cofounder",
            match: 85, // Dummy match
            status: app.status || "pending",
            rawStatus: app.status || "pending",
            image: app.profile_picture_url 
              ? (app.profile_picture_url.startsWith('http') ? app.profile_picture_url : `http://localhost:4000${app.profile_picture_url}`)
              : "👤",
            badges: ["verified"],
            details: {
              experience: app.experience || (isFreelancer ? "N/A" : "Expert"),
              skills: skills,
              availability: "Immediate",
              workPref: isFreelancer ? app.working_environment || "Remote" : "Co-founder",
              email: app.email,
              phone: phoneNum || "N/A",
              location: "Remote",
              applied: new Date(app.created_at).toLocaleDateString(),
              github: githubLink,
              linkedin: linkedinLink
            }
          };
        });
        setManualApplicants(mappedApps);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [selectedJob, jobs]);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const aiMatched = [
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Senior Full Stack Engineer",
      match: 95,
      isAI: true,
      image: "👩‍💻",
      badges: ["verified", "trial", "execution"],
    },
    {
      id: 5,
      name: "David Kim",
      role: "Senior Full Stack Engineer",
      match: 91,
      isAI: true,
      image: "👨‍💻",
      badges: ["verified", "top", "responsive"],
    },
    {
      id: 6,
      name: "Lisa Anderson",
      role: "Senior Full Stack Engineer",
      match: 87,
      isAI: true,
      image: "👩‍💼",
      badges: ["verified", "founder"],
    },
  ];

  const topRecommended = [
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Senior Full Stack Engineer",
      match: 95,
      source: "AI Suggested",
      image: "👩‍💻",
      badges: ["verified", "trial"],
    },
    {
      id: 1,
      name: "Alex Thompson",
      role: "Senior Full Stack Engineer",
      match: 92,
      source: "Applied",
      image: "👨‍💻",
      badges: ["verified", "top"],
    },
    {
      id: 5,
      name: "David Kim",
      role: "Senior Full Stack Engineer",
      match: 91,
      source: "AI Suggested",
      image: "👨‍💻",
      badges: ["verified", "responsive"],
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Senior Full Stack Engineer",
      match: 88,
      source: "Applied",
      image: "👩‍💻",
      badges: ["verified", "trial"],
    },
    {
      id: 6,
      name: "Lisa Anderson",
      role: "Senior Full Stack Engineer",
      match: 87,
      source: "AI Suggested",
      image: "👩‍💼",
      badges: ["verified", "founder"],
    },
    {
      id: 7,
      name: "James Park",
      role: "Senior Full Stack Engineer",
      match: 84,
      source: "AI Suggested",
      image: "👨‍💼",
      badges: ["verified", "execution"],
    },
    {
      id: 8,
      name: "Nina Patel",
      role: "Senior Full Stack Engineer",
      match: 82,
      source: "Applied",
      image: "👩‍💻",
      badges: ["verified", "top"],
    },
    {
      id: 9,
      name: "Chris Taylor",
      role: "Senior Full Stack Engineer",
      match: 80,
      source: "AI Suggested",
      image: "👨‍💻",
      badges: ["verified", "responsive"],
    },
    {
      id: 10,
      name: "Rachel Green",
      role: "Senior Full Stack Engineer",
      match: 78,
      source: "Applied",
      image: "👩‍💼",
      badges: ["verified", "trial"],
    },
    {
      id: 11,
      name: "Tom Wilson",
      role: "Senior Full Stack Engineer",
      match: 76,
      source: "AI Suggested",
      image: "👨‍💻",
      badges: ["verified", "founder"],
    },
  ];

  const applicantDetails = {
    1: {
      experience: "7 years",
      skills: "React, Node.js, AWS, PostgreSQL",
      availability: "Immediate",
      workPref: "Remote",
      email: "alex@email.com",
      phone: "+1 234 567 8900",
      location: "San Francisco, CA",
      applied: "2 days ago",
    },
    2: {
      experience: "6 years",
      skills: "React, Vue, TypeScript, MongoDB",
      availability: "2 weeks",
      workPref: "Hybrid",
      email: "sarah@email.com",
      phone: "+1 234 567 8901",
      location: "New York, NY",
      applied: "5 days ago",
    },
    4: {
      experience: "8 years",
      skills: "Full Stack, Microservices, DevOps, React",
      availability: "Immediate",
      workPref: "Remote",
      email: "emily@email.com",
      phone: "+1 234 567 8902",
      location: "Austin, TX",
      applied: "AI Match",
    },
    5: {
      experience: "7 years",
      skills: "React, Angular, Node.js, GraphQL",
      availability: "1 week",
      workPref: "Remote",
      email: "david@email.com",
      phone: "+1 234 567 8903",
      location: "Seattle, WA",
      applied: "AI Match",
    },
  };

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
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-500 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          {applicant.image.length > 5 ? (
            <img src={applicant.image} alt={applicant.name} className="w-full h-full rounded-full object-cover border border-gray-700" />
          ) : (
            <div className="text-4xl">{applicant.image}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">
            {applicant.name}
          </h3>
          <p className="text-gray-400 text-sm truncate">{applicant.role}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {applicant.badges.slice(0, 3).map((badge, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${getBadgeColor(badge)}`}
                title={getBadgeName(badge)}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="bg-green-500 text-black font-bold px-3 py-1 rounded-full text-sm">
            {applicant.match}%
          </div>
          {applicant.status && (
            <div
              className={`${getStatusColor(applicant.status)} text-white text-xs px-2 py-1 rounded`}
            >
              {getStatusLabel(applicant.status)}
            </div>
          )}
          {applicant.isAI && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded">
              AI Suggested
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── Action Handlers ──
  const handleUpdateStatus = async (applicantId, newStatus) => {
    if (!selectedJob) return;
    console.log(`[FRONTEND] Updating status: job=${selectedJob}, applicant=${applicantId}, status=${newStatus}`);
    try {
      const response = await axios.put(
        `http://localhost:4000/api/jobs/${selectedJob}/applicants/${applicantId}/status`,
        { status: newStatus }
      );
      console.log('[FRONTEND] Update response:', response.data);
      toast.success(`Applicant ${newStatus === 'accepted' ? 'shortlisted' : 'rejected'} successfully!`, { theme: 'dark' });

      // Refresh the applicant list so the status updates in real-time
      const refreshRes = await fetch(`http://localhost:4000/api/jobs/${selectedJob}/applicants`);
      if (refreshRes.ok) {
        const apps = await refreshRes.json();
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
            match: 85,
            status: app.status || 'pending',
            rawStatus: app.status || 'pending',
            image: app.profile_picture_url 
              ? (app.profile_picture_url.startsWith('http') ? app.profile_picture_url : `http://localhost:4000${app.profile_picture_url}`)
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
      const res = await axios.post(
        'http://localhost:4000/api/chat/create',
        { otherUserId: applicantId, userId: parseInt(localStorage.getItem('user_id')) },
        { withCredentials: true }
      );
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
    const details = applicant.details || applicantDetails[applicant.id] || {};
    const currentStatus = applicant.rawStatus || applicant.status || 'pending';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-start justify-between">
            <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              {applicant.image.length > 5 ? (
                <img src={applicant.image} alt={applicant.name} className="w-full h-full rounded-full object-cover border-2 border-blue-500/30 shadow-lg" />
              ) : (
                <div className="text-6xl">{applicant.image}</div>
              )}
            </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {applicant.name}
                </h2>
                <p className="text-gray-400">{applicant.role}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="bg-green-500 text-black font-bold px-4 py-2 rounded-full text-lg">
                    {applicant.match}% Match
                  </div>
                  <div className={`${getStatusColor(currentStatus)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {getStatusLabel(currentStatus)}
                  </div>
                  {applicant.isAI && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                      AI Suggested
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Platform Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={`${getBadgeColor(badge)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {getBadgeName(badge)}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Briefcase size={16} />
                  <span className="text-sm font-medium">Experience</span>
                </div>
                <p className="text-white">{details.experience}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Availability</span>
                </div>
                <p className="text-white">{details.availability}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-white">{details.location}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <Target size={16} />
                  <span className="text-sm font-medium">Work Preference</span>
                </div>
                <p className="text-white">{details.workPref}</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">
                Skills & Expertise
              </h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-gray-300">{details.skills}</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={16} className="text-blue-400" />
                  <span>{details.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={16} className="text-green-400" />
                  <span>{details.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">
                Portfolio & Links
              </h3>
              <div className="flex gap-3">
                {details.github && (
                  <a
                    href={details.github.startsWith("http") ? details.github : `https://${details.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {details.linkedin && (
                  <a
                    href={details.linkedin.startsWith("http") ? details.linkedin : `https://${details.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                    <ExternalLink size={14} />
                  </a>
                )}
                {!details.github && !details.linkedin && (
                  <p className="text-gray-500 italic text-sm">No links provided</p>
                )}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">
                Application Details
              </h3>
              <p className="text-gray-400 text-sm">
                Applied: {details.applied}
              </p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => handleUpdateStatus(applicant.id, 'accepted')}
                disabled={currentStatus === 'accepted'}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${currentStatus === 'accepted'
                  ? 'bg-green-800 text-green-300 cursor-not-allowed opacity-60'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                {currentStatus === 'accepted' ? '✓ Shortlisted' : 'Shortlist'}
              </button>
              <button
                disabled
                className="flex-1 bg-gray-700 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50"
                title="Coming soon"
              >
                Trial Sprint
              </button>
              <button
                onClick={() => handleContact(applicant.id)}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Contact
              </button>
              <button
                onClick={() => handleUpdateStatus(applicant.id, 'rejected')}
                disabled={currentStatus === 'rejected'}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${currentStatus === 'rejected'
                  ? 'bg-red-900 text-red-300 cursor-not-allowed opacity-60'
                  : 'bg-red-600 hover:bg-red-700 text-white'
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
      <Navbar />
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
                    </h3>
                    <div className="space-y-3">
                      {aiMatched.map((applicant, idx) => (
                        <ApplicantCard
                          key={applicant.id ?? `ai-${idx}`}
                          applicant={applicant}
                          onClick={() => setSelectedApplicant(applicant)}
                        />
                      ))}
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