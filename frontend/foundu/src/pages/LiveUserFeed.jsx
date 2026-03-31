import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import {
  Heart,
  MessageCircle,
  Search,
  CheckCircle,
  Award,
  Play,
  Bookmark,
  MoreHorizontal,
  Zap,
  Check,
  X,
  Send,
  User,
  Star,
  MapPin,
  Calendar,
  Phone,
  Linkedin,
  Github
} from "lucide-react";

const LiveUserFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewMode = queryParams.get("view");
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchPosts();
  }, [viewMode]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts`);
      if (response.data.success) {
        let allPosts = response.data.data;
        if (viewMode === "my-posts" && currentUserId) {
          allPosts = allPosts.filter(p => p.user_id.toString() === currentUserId.toString());
        }
        setPosts(allPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    // Fetch full profile details
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/users/${post.user_id}`);
      if (res.data.success) {
        setUserDetails(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const ExploreCard = ({ post }) => (
    <div
      onClick={() => handlePostClick(post)}
      className="relative group cursor-pointer overflow-hidden rounded-[2rem] bg-gray-900/40 border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-blue-500/30 aspect-square"
    >
      <img
        src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${post.image_url}`}
        alt="Post"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-between backdrop-blur-[2px]">
        <div className="flex items-center gap-3 translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-500">
          <div className="relative">
            {post.profile_picture_url ? (
              <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${post.profile_picture_url}`} className="w-12 h-12 rounded-2xl border-2 border-blue-500/50 object-cover shadow-xl" alt={post.full_name} />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center text-blue-400">
                <User className="w-6 h-6" />
              </div>
            )}
            {post.blue_tick_verified === 1 && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                <Check className="w-2 h-2 text-white" strokeWidth={4} />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-black text-white">{post.full_name}</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{post.user_type}</div>
          </div>
        </div>
        <div className="translate-y-[10px] group-hover:translate-y-0 transition-transform duration-500 text-center">
          <p className="text-sm text-gray-200 font-medium line-clamp-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            {post.caption || "No caption provided"}
          </p>
        </div>
      </div>
    </div>
  );

  const PostModal = ({ post, onClose }) => {
    const [modalReviews, setModalReviews] = useState([]);
    const [modalCredibility, setModalCredibility] = useState(null);
    const [newReviewText, setNewReviewText] = useState("");
    const [newReviewStars, setNewReviewStars] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const reviewerId = localStorage.getItem("user_id");

    useEffect(() => {
      if (post && post.user_id) {
        fetchReviews(post.user_id);
        fetchCredibility(post.user_id);
      }
    }, [post]);

    const fetchReviews = async (userId) => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/reviews/user/${userId}`);
        setModalReviews(res.data);
      } catch (err) {
        console.error("Error fetching modal reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    const fetchCredibility = async (userId) => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/reviews/credibility/${userId}`);
        setModalCredibility(res.data);
      } catch (err) {
        console.error("Error fetching modal credibility:", err);
      }
    };

    const handleReviewSubmit = async (e) => {
      e.preventDefault();
      if (!reviewerId) {
        alert("Please login to post a review");
        return;
      }
      if (!newReviewText.trim()) return;

      setIsSubmittingReview(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/reviews`, {
          user_id: post.user_id,
          reviewer_id: reviewerId,
          review_text: newReviewText,
          stars: newReviewStars
        });

        if (res.data.success) {
          setNewReviewText("");
          setNewReviewStars(5);
          await fetchReviews(post.user_id);
          await fetchCredibility(post.user_id);
          await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/reviews/recalculate-credibility`, { user_id: post.user_id });
        }
      } catch (err) {
        console.error("Error submitting review:", err);
        alert(err.response?.data?.message || "Error submitting review");
      } finally {
        setIsSubmittingReview(false);
      }
    };

    if (!post) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={() => { onClose(); setUserDetails(null); }}
          className="absolute top-8 right-8 p-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all shadow-2xl z-[110]"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-gray-950 border border-white/10 rounded-[3rem] w-full max-w-[1300px] h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] ring-1 ring-white/10">

          {/* Image Section (Keep Original 65%) */}
          <div className="md:w-[65%] bg-black flex items-center justify-center relative border-r border-white/5">
            <img
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${post.image_url}`}
              className="w-full h-full object-contain"
              alt="Detailed View"
            />
          </div>

          {/* User Profile Section (Keep Original 35% with all details + Reviews) */}
          <div className="md:w-[35%] flex flex-col bg-gray-950 overflow-y-auto custom-scrollbar p-10">
            {userDetails ? (
              <div className="space-y-8 pb-20">
                {/* User Header */}
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    {userDetails.profile_picture_url ? (
                      <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${userDetails.profile_picture_url}`} className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-500/30 object-cover shadow-2xl mx-auto" alt={userDetails.full_name} />
                    ) : (
                      <div className="w-32 h-32 rounded-[2.5rem] bg-blue-500/10 border-4 border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                    {userDetails.blue_tick_verified === 1 && (
                      <div className="absolute -right-2 -bottom-2 p-2 bg-blue-500 rounded-2xl border-4 border-gray-950 shadow-xl">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">{userDetails.full_name}</h2>

                  {/* REPUTATION STARS (ADD ON TOP OF HEADER) */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(modalCredibility?.avg_stars || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`}
                      />
                    ))}
                    <span className="text-[10px] text-gray-500 font-black ml-2 uppercase tracking-widest">{modalCredibility?.avg_stars || "0.0"} ({modalCredibility?.review_count || 0})</span>
                  </div>

                  <div className="text-blue-400 font-bold text-sm uppercase tracking-[0.3em] mb-2">
                    {userDetails.professional_role || 'Innovative Professional'}
                  </div>

                  {(userDetails.blue_tick_verified === 1 || userDetails.golden_tick_verified === 1 || userDetails.green_tick_verified === 1) && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {userDetails.blue_tick_verified === 1 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20" title="Blue Tick Verified">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"></div>
                          <span className="text-blue-400 text-[9px] font-black uppercase tracking-wider">Blue</span>
                        </div>
                      )}
                      {userDetails.golden_tick_verified === 1 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20" title="Golden Tick Verified">
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]"></div>
                          <span className="text-yellow-400 text-[9px] font-black uppercase tracking-wider">Gold</span>
                        </div>
                      )}
                      {userDetails.green_tick_verified === 1 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20" title="Green Tick Verified">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-emerald-400 text-[9px] font-black uppercase tracking-wider">Green</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      {userDetails.user_type}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {userDetails.credibility_score}/100
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center transition-all hover:bg-white/10">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Posts</div>
                    <div className="text-2xl font-black text-white">{posts.filter(p => p.user_id === post.user_id).length}</div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center transition-all hover:bg-white/10">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Jobs Completed</div>
                    <div className="text-2xl font-black text-white">{userDetails.jobs_completed || 0}</div>
                  </div>
                </div>

                {userDetails.job_profile && (
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">Job Role</h4>
                    <div className="flex items-center gap-3 p-3 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{userDetails.job_profile}</div>
                        <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Current Role</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio Section */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Professional Bio</h4>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
                    {userDetails.professional_bio || "Experienced specialist focusing on high-impact solutions."}
                  </p>
                </div>

                {/* Experience Section */}
                {userDetails.experience && (
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-green-400">Experience</h4>
                    <div className="flex items-center gap-3 p-3 bg-green-500/5 rounded-2xl border border-green-500/10">
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">{userDetails.experience}</div>
                        <div className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Professional Experience</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Contact Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      {userDetails.contact_phone || 'Contact not listed'}
                    </div>
                    <a
                      href={userDetails.contact_linkedin || '#'}
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
                      href={userDetails.contact_github || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                        <Github className="w-5 h-5" />
                      </div>
                      GitHub Repository
                    </a>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <button
                    onClick={() => window.location.href = `/chatbox?userId=${userDetails.id}`}
                    className="w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-2xl shadow-blue-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                  >
                    Send Message
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* REVIEWS SECTION (APPEND AT THE END) */}
                <div className="space-y-8 pt-10 border-t border-white/10">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center justify-between">
                    User Reviews
                    <span className="text-[10px] text-gray-600">{modalReviews.length} Feedbacks</span>
                  </h4>

                  {/* Review List */}
                  {loadingReviews ? (
                    <div className="text-center py-10 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Loading Reviews...</div>
                  ) : modalReviews.length > 0 ? (
                    <div className="space-y-4">
                      {modalReviews.map((review) => (
                        <div key={review.review_id} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">
                                {review.reviewer_name?.charAt(0)}
                              </div>
                              <div className="text-[10px] font-bold text-white uppercase tracking-wider">{review.reviewer_name}</div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-2.5 h-2.5 ${s <= review.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-400 text-[12px] leading-relaxed italic">"{review.review_text}"</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-white/5 border border-dashed border-white/10 rounded-3xl text-gray-500 text-[10px] uppercase tracking-widest font-bold">No reviews yet</div>
                  )}

                  {/* Post a Review Form */}
                  <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Post a Experience</h5>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewStars(s)}
                            className="hover:scale-125 transition-transform"
                          >
                            <Star className={`w-5 h-5 ${s <= newReviewStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none h-24"
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmittingReview || !newReviewText.trim()}
                        className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-sm font-bold uppercase tracking-widest">Loading Profile...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <main className="pt-40 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
        <header className="mb-20 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10"></div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Zap className="w-4 h-4" />
            Live Ecosystem Feed
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            {viewMode === "my-posts" ? "My Collection" : "The Live Feed"}
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            {viewMode === "my-posts"
              ? "Your history of shared insights and visual highlights."
              : "A real-time visual stream of what's happening in the FoundU community."
            }
          </p>
        </header>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-2xl shadow-blue-500/20"></div>
            <span className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">Syncing Visuals...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map(post => (
              <ExploreCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 border border-white/5 rounded-[4rem] border-dashed border-white/20">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-4xl font-black text-white/40 mb-4">No content found</h3>
            <p className="text-gray-600 font-bold mb-10">Be the first to share something amazing with the network.</p>
            <button
              onClick={() => window.location.href = '/create-post'}
              className="px-10 py-5 bg-white text-[#020024] font-black text-lg rounded-3xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95"
            >
              Create First Post
            </button>
          </div>
        )}
      </main>
      <Footer />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}} />
    </div>
  );
};

export default LiveUserFeed;
