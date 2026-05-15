import React, { useState, useEffect } from "react";
import { getUserId, getUserType } from "../utils/authUtils";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import { 
  Shield, Zap, Award, Star, MessageSquare, 
  Briefcase, Calendar, MapPin, Link as LinkIcon,
  Twitter, Linkedin, Github, ExternalLink, 
  Plus, Edit3, Grid, List, Heart, MessageCircle
} from "lucide-react";
import Footer from "../components/Footer";
import logo from "../assets/whitelogo.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get("id");
  const currentUserId = getUserId();
  const userId = targetId || currentUserId;
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ projects: 0, jobs: 0 });

  useEffect(() => {
    if (!userId) {
      navigate("/login-signup");
      return;
    }
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch User Basic Info
      const userRes = await api.get(`/api/users/${userId}`);
      const userData = userRes.data.success ? userRes.data.data : userRes.data;
      setUser(userData);

      // Fetch Role-Specific Profile
      const role = userData.user_type;
      let profileRes;
      if (role === "freelancer") {
        profileRes = await api.get(`/api/freelancer-profiles/user/${userId}`);
      } else if (role === "cofounder") {
        profileRes = await api.get(`/api/cofounder-profiles/user/${userId}`);
      } else if (role === "founder") {
        profileRes = await api.get(`/api/startup-profiles/user/${userId}`);
      }
      setProfileData(profileRes?.data || {});

      // Fetch Posts
      const postsRes = await api.get(`/api/posts/user/${userId}`);
      setPosts(postsRes.data || []);

      // Fetch Reviews
      const reviewsRes = await api.get(`/api/reviews/user/${userId}`);
      setReviews(reviewsRes.data || []);

      // Mock Stats for now
      setStats({
        projects: Math.floor(Math.random() * 20) + 5,
        jobs: Math.floor(Math.random() * 10) + 2
      });

    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020024] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isFounder = user?.user_type === "founder";
  const profilePic = isFounder ? (profileData?.startup_logo_url || user?.profile_picture_url) : user?.profile_picture_url;

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30">
      {/* Banner / Flyer */}
      <div className="relative h-64 md:h-80 w-full bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <img src={logo} alt="FoundU" className="w-96 grayscale brightness-200" />
        </div>
        {/* Logo in top left as requested */}
        <div className="absolute top-8 left-8 z-10">
          <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
              
              {/* Profile Photo */}
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-[#020024] overflow-hidden bg-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  {profilePic ? (
                    <img 
                      src={profilePic.startsWith('http') ? profilePic : `${API_BASE}${profilePic}`} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500/10">
                      <User className="w-16 h-16 text-blue-400/30" />
                    </div>
                  )}
                </div>
                {userId === currentUserId && (
                  <button className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-2xl border-4 border-[#020024] shadow-xl hover:bg-blue-500 transition-colors">
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>

              {/* Name & Category */}
              <div className="mb-6">
                <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white mb-1">
                  {user?.full_name}
                </h1>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    {user?.user_type === "founder" ? "Founder" : user?.user_type === "cofounder" ? "Co-Founder" : "Freelancer"}
                  </span>
                </div>
              </div>

              {/* Badges Section */}
              <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Elite Badges</p>
                <div className="flex flex-wrap gap-3">
                  {user?.blue_tick_verified ? (
                    <div className="group/badge relative">
                      <Shield className="w-10 h-10 text-blue-500" fill="currentColor" />
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black px-3 py-1 rounded-full opacity-0 group-hover/badge:opacity-100 transition-opacity uppercase tracking-tighter whitespace-nowrap">Verified Elite</div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center opacity-40">
                      <Shield className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Score & Credibility */}
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] shadow-lg shadow-blue-900/20">
                <div>
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Credibility Score</p>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter">
                    {user?.credibility_score || 850}
                  </h2>
                </div>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Star className="w-8 h-8 text-white" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Projects</p>
                <h3 className="text-3xl font-black text-white">{isFounder ? stats.jobs : stats.projects}</h3>
                <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold">{isFounder ? 'Jobs Posted' : 'Completed'}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Rating</p>
                <h3 className="text-3xl font-black text-yellow-500 flex items-center justify-center gap-1">
                  4.9 <Star className="w-5 h-5 fill-yellow-500" />
                </h3>
                <p className="text-[8px] text-gray-400 mt-1 uppercase font-bold">{reviews.length} Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            
            {/* Bio Section */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic text-blue-400 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" /> Professional Brief
                </h2>
                {userId === currentUserId && (
                  <button className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <Edit3 className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed text-lg font-medium italic">
                "{profileData?.skillsDescription || profileData?.whyBuilding || profileData?.domainIQ || "I'm a visionary looking to disrupt the status quo. Building the future of ecosystem collaboration with FoundU."}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-white">New Delhi, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Availability</p>
                    <p className="text-sm font-bold text-green-400 uppercase tracking-tighter">Open to Work</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3">
                  <Grid className="w-6 h-6 text-blue-500" /> My Feed
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-600 rounded-xl"><Grid className="w-4 h-4" /></button>
                  <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><List className="w-4 h-4" /></button>
                </div>
              </div>

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="relative group aspect-square rounded-3xl overflow-hidden bg-gray-900 border border-white/5">
                      <img 
                        src={`${API_BASE}${post.image_url}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt="Post" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-xs font-bold"><Heart className="w-4 h-4 fill-red-500 text-red-500" /> {post.likes_count}</span>
                          <span className="flex items-center gap-1 text-xs font-bold"><MessageCircle className="w-4 h-4" /> 24</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                  <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No posts shared yet</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
               <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-yellow-500" /> Wall of Love
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30"></div>
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-tighter italic">Reviewer Name</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-2.5 h-2.5 ${i < review.stars ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed italic">
                        "{review.review_text}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                  <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No reviews yet</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
