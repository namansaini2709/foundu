import { useState, useEffect, useRef } from "react";
import { getUserId } from "../utils/authUtils";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import Footer from "../components/Footer";
import {
  Heart, Search, Zap, Check, X, Send, User,
  ChevronDown, ChevronUp, Star, CheckCircle,
  Phone, Linkedin, Github, MessageCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const getAspectStyle = (postId) => {
  const patterns = [
    { paddingTop: "100%" },
    { paddingTop: "133%" },
    { paddingTop: "75%" },
    { paddingTop: "177%" },
    { paddingTop: "56%" },
    { paddingTop: "120%" },
    { paddingTop: "85%" },
    { paddingTop: "150%" },
  ];
  return patterns[postId % patterns.length];
};

// ─── Full right-side profile panel (same content as the original PostModal) ──
const ProfilePanel = ({ post, currentUserId, allPosts }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [credibility, setCredibility] = useState(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewStars, setNewReviewStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoadingReviews(true);
      try {
        const [userRes, reviewsRes, credRes] = await Promise.all([
          api.get(`/api/users/${post.user_id}`),
          api.get(`/api/reviews/user/${post.user_id}`),
          api.get(`/api/reviews/credibility/${post.user_id}`),
        ]);
        if (cancelled) return;
        if (userRes.data.success) setUserDetails(userRes.data.data);
        setReviews(reviewsRes.data || []);
        setCredibility(credRes.data);
      } catch (e) { console.error("Profile fetch error:", e); }
      finally { if (!cancelled) setLoadingReviews(false); }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [post.user_id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId || !newReviewText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/api/reviews`, {
        user_id: post.user_id,
        reviewer_id: currentUserId,
        review_text: newReviewText,
        stars: newReviewStars,
      });
      setNewReviewText(""); setNewReviewStars(5);
      await api.post(`/api/reviews/recalculate-credibility`, { user_id: post.user_id });
      const [r, c] = await Promise.all([
        api.get(`/api/reviews/user/${post.user_id}`),
        api.get(`/api/reviews/credibility/${post.user_id}`),
      ]);
      setReviews(r.data || []); setCredibility(c.data);
    } catch (e) { console.error("Review error:", e); }
    finally { setSubmitting(false); }
  };

  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* User Header */}
      <div className="text-center">
        <div className="relative inline-block mb-6">
          {userDetails.profile_picture_url ? (
            <img src={`${API_BASE}${userDetails.profile_picture_url}`} className="w-32 h-32 rounded-[2.5rem] border-4 border-blue-500/30 object-cover shadow-2xl mx-auto" alt={userDetails.full_name} />
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

        {/* Reputation Stars */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={`w-4 h-4 ${s <= Math.round(credibility?.avg_stars || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
          ))}
          <span className="text-[10px] text-gray-500 font-black ml-2 uppercase tracking-widest">
            {credibility?.avg_stars || "0.0"} ({credibility?.review_count || 0})
          </span>
        </div>

        <div className="text-blue-400 font-bold text-sm uppercase tracking-[0.3em] mb-2">
          {userDetails.professional_role || "Innovative Professional"}
        </div>

        {/* Tick Badges */}
        {(userDetails.blue_tick_verified === 1 || userDetails.golden_tick_verified === 1 || userDetails.green_tick_verified === 1) && (
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            {userDetails.blue_tick_verified === 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                <span className="text-blue-400 text-[9px] font-black uppercase tracking-wider">Blue</span>
              </div>
            )}
            {userDetails.golden_tick_verified === 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
                <span className="text-yellow-400 text-[9px] font-black uppercase tracking-wider">Gold</span>
              </div>
            )}
            {userDetails.green_tick_verified === 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
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
            <Star className="w-3 h-3 fill-current" /> {userDetails.credibility_score}/100
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center hover:bg-white/10 transition-all">
          <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Posts</div>
          <div className="text-2xl font-black text-white">{allPosts.filter(p => p.user_id === post.user_id).length}</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-3xl p-5 text-center hover:bg-white/10 transition-all">
          <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Jobs Completed</div>
          <div className="text-2xl font-black text-white">{userDetails.jobs_completed || 0}</div>
        </div>
      </div>

      {/* Job Profile */}
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

      {/* Bio */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Professional Bio</h4>
        <p className="text-gray-400 text-sm leading-relaxed font-medium italic">
          {userDetails.professional_bio || "Experienced specialist focusing on high-impact solutions."}
        </p>
      </div>

      {/* Experience */}
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

      {/* Contact */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Contact Information</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            {userDetails.contact_phone || "Contact not listed"}
          </div>
          <a href={userDetails.contact_linkedin || "#"} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </div>
            LinkedIn Profile
          </a>
          <a href={userDetails.contact_github || "#"} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-300 font-bold p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-black transition-all">
              <Github className="w-5 h-5" />
            </div>
            GitHub Repository
          </a>
        </div>
      </div>

      {/* Message Button */}
      <div className="pt-8 border-t border-white/5">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open_chat", { detail: { userId: userDetails.id } }))}
          className="w-full py-5 rounded-3xl bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-2xl shadow-blue-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
        >
          Send Message <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Reviews */}
      <div className="space-y-8 pt-10 border-t border-white/10">
        <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center justify-between">
          User Reviews
          <span className="text-[10px] text-gray-600">{reviews.length} Feedbacks</span>
        </h4>
        {loadingReviews ? (
          <div className="text-center py-10 text-gray-500 font-bold text-[10px] uppercase tracking-widest">Loading Reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.review_id} className="p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">
                      {review.reviewer_name?.charAt(0)}
                    </div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">{review.reviewer_name}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-2.5 h-2.5 ${s <= review.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
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

        {/* Post a Review */}
        <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Post a Experience</h5>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setNewReviewStars(s)} className="hover:scale-125 transition-transform">
                  <Star className={`w-5 h-5 ${s <= newReviewStars ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
                </button>
              ))}
            </div>
            <textarea
              value={newReviewText}
              onChange={e => setNewReviewText(e.target.value)}
              placeholder="Write your review here..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all resize-none h-24"
            />
            <button
              type="submit"
              disabled={submitting || !newReviewText.trim()}
              className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const LiveUserFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [reelMode, setReelMode] = useState(false);
  const [reelStartIndex, setReelStartIndex] = useState(0);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewMode = queryParams.get("view");
  const currentUserId = getUserId();
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const reelContainerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => { fetchPosts(); }, [viewMode]);

  // Lock body scroll in reel mode
  useEffect(() => {
    document.body.style.overflow = reelMode ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [reelMode]);

  // Scroll to correct post when reel opens
  useEffect(() => {
    if (!reelMode) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`reel-item-${reelStartIndex}`);
      if (el) el.scrollIntoView({ behavior: "instant" });
      setActiveReelIndex(reelStartIndex);
    }, 60);
    return () => clearTimeout(timer);
  }, [reelMode, reelStartIndex]);

  // Track active slide via scroll position
  useEffect(() => {
    if (!reelMode) return;
    const container = reelContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const itemH = container.clientHeight;
      if (itemH === 0) return;
      const idx = Math.round(container.scrollTop / itemH);
      setActiveReelIndex(Math.max(0, Math.min(idx, posts.length - 1)));
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [reelMode, posts.length]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/posts`);
      if (response.data.success) {
        let allPosts = response.data.data;
        if (viewMode === "my-posts" && currentUserId) {
          allPosts = allPosts.filter(p => p.user_id.toString() === currentUserId.toString());
        }
        setPosts(allPosts);
        const initialMap = {};
        allPosts.forEach(p => { initialMap[p.id] = { liked: false, likes_count: p.likes_count || 0 }; });
        setLikedMap(initialMap);
        if (currentUserId) {
          allPosts.forEach(async (p) => {
            try {
              const r = await api.get(`/api/posts/${p.id}/like-status?user_id=${currentUserId}`);
              setLikedMap(prev => ({ ...prev, [p.id]: { ...prev[p.id], liked: r.data.liked } }));
            } catch { }
          });
        }
      }
    } catch (e) { console.error("Fetch posts:", e); }
    finally { setLoading(false); }
  };

  const handleLike = async (e, postId) => {
    e?.stopPropagation();
    if (!currentUserId) return;
    setLikedMap(prev => ({
      ...prev,
      [postId]: {
        liked: !prev[postId]?.liked,
        likes_count: prev[postId]?.liked
          ? Math.max((prev[postId]?.likes_count || 0) - 1, 0)
          : (prev[postId]?.likes_count || 0) + 1
      }
    }));
    try {
      const res = await api.post(`/api/posts/${postId}/like`, { user_id: currentUserId });
      setLikedMap(prev => ({ ...prev, [postId]: { liked: res.data.liked, likes_count: res.data.likes_count } }));
    } catch {
      setLikedMap(prev => ({
        ...prev,
        [postId]: {
          liked: !prev[postId]?.liked,
          likes_count: prev[postId]?.liked
            ? (prev[postId]?.likes_count || 0) + 1
            : Math.max((prev[postId]?.likes_count || 0) - 1, 0)
        }
      }));
    }
  };

  const openReel = (post) => {
    const idx = posts.findIndex(p => p.id === post.id);
    setReelStartIndex(idx >= 0 ? idx : 0);
    setReelMode(true);
  };

  const goTo = (idx) => {
    const el = document.getElementById(`reel-item-${idx}`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Post Card (masonry grid) ─────────────────────────────────────────────
  const PostCard = ({ post }) => {
    const isLiked = likedMap[post.id]?.liked || false;
    const likesCount = likedMap[post.id]?.likes_count ?? (post.likes_count || 0);
    return (
      <div className="break-inside-avoid mb-3 group">
        <div
          className="relative w-full overflow-hidden rounded-2xl cursor-pointer"
          style={{ paddingTop: getAspectStyle(post.id).paddingTop }}
          onClick={() => openReel(post)}
        >
          <img
            src={`${API_BASE}${post.image_url}`}
            alt={post.caption || "Post"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <div className="flex items-center gap-2">
              {post.profile_picture_url ? (
                <img src={`${API_BASE}${post.profile_picture_url}`} className="w-7 h-7 rounded-xl border border-white/30 object-cover" alt={post.full_name} />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-blue-500/40 flex items-center justify-center"><User className="w-3.5 h-3.5 text-white" /></div>
              )}
              <span className="text-xs font-bold text-white truncate">{post.full_name}</span>
              {post.blue_tick_verified === 1 && (
                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-2 h-2 text-white" strokeWidth={4} />
                </div>
              )}
            </div>
            {post.caption && <p className="text-[11px] text-gray-300 mt-1 line-clamp-2">{post.caption}</p>}
          </div>
        </div>
        <div className="px-1 mt-1.5 flex items-center justify-between">
          <button
            onClick={(e) => handleLike(e, post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-200 ${isLiked ? "bg-red-500/20 border border-red-500/40 text-red-400" : "bg-white/5 border border-white/5 text-gray-500 hover:text-red-400 hover:border-red-500/20"
              }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? "fill-red-400 scale-125" : ""}`} />
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">{post.user_type}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* ─── REEL VIEWER ─────────────────────────────────────────────────── */}
      {reelMode && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
          {/* Close */}
          <div className="absolute top-5 left-5 z-[210] flex gap-2">
            <button
              onClick={() => setReelMode(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all font-bold flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          {/* Desktop nav arrows */}
          {activeReelIndex > 0 && (
            <button onClick={() => goTo(activeReelIndex - 1)} className="absolute top-1/2 -translate-y-1/2 left-4 z-[210] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hidden md:flex">
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
          {activeReelIndex < posts.length - 1 && (
            <button onClick={() => goTo(activeReelIndex + 1)} className="absolute top-1/2 -translate-y-1/2 right-[395px] z-[210] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 hidden md:flex">
              <ChevronDown className="w-5 h-5" />
            </button>
          )}

          {/* Snap scroll container */}
          <div
            ref={reelContainerRef}
            className="flex-1 overflow-y-scroll"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {posts.map((post, i) => {
              const isLiked = likedMap[post.id]?.liked || false;
              const likesCount = likedMap[post.id]?.likes_count ?? (post.likes_count || 0);
              return (
                <div
                  key={post.id}
                  id={`reel-item-${i}`}
                  className="w-full flex flex-col md:flex-row overflow-hidden"
                  style={{ height: "100dvh", scrollSnapAlign: "start", scrollSnapStop: "always" }}
                >
                  {/* LEFT: Image — scroll bubbles to snap container */}
                  <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={`${API_BASE}${post.image_url}`}
                      alt={post.caption}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>

                  {/* RIGHT: Full profile panel with internal scroll (desktop) */}
                  <div
                    className="hidden md:flex flex-col w-[380px] shrink-0 bg-gray-950 border-l border-white/5 overflow-y-auto"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    {/* Like bar at top of right panel */}
                    <div className="sticky top-0 z-10 bg-gray-950/90 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {post.profile_picture_url ? (
                          <img src={`${API_BASE}${post.profile_picture_url}`} className="w-8 h-8 rounded-xl border border-blue-500/30 object-cover" alt={post.full_name} />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center"><User className="w-4 h-4 text-blue-400" /></div>
                        )}
                        <div>
                          <div className="text-white font-black text-xs">{post.full_name}</div>
                          <div className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">{post.user_type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLike(null, post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isLiked ? "bg-red-500/20 border-red-500/40 text-red-400" : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30"
                          }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-400" : ""}`} /> {likesCount}
                      </button>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                      <div className="px-6 py-4 border-b border-white/5">
                        <p className="text-gray-300 text-sm leading-relaxed">{post.caption}</p>
                      </div>
                    )}

                    {/* Full profile panel — only renders when active (within 1) */}
                    <div className="px-6 py-6 flex-1 overflow-y-auto custom-scrollbar" style={{ overscrollBehavior: "contain" }}>
                      {Math.abs(activeReelIndex - i) <= 1 ? (
                        <ProfilePanel post={post} currentUserId={currentUserId} allPosts={posts} />
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-700 text-xs font-bold uppercase tracking-widest">
                          Scroll into view to load
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-16 bg-gradient-to-t from-black/90 to-transparent md:hidden pointer-events-none">
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex-1 min-w-0 pointer-events-none">
                        <div className="flex items-center gap-2 mb-1">
                          {post.profile_picture_url ? (
                            <img src={`${API_BASE}${post.profile_picture_url}`} className="w-8 h-8 rounded-xl border border-white/30 object-cover" alt={post.full_name} />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                          )}
                          <span className="text-white font-black text-sm">{post.full_name}</span>
                        </div>
                        {post.caption && <p className="text-gray-300 text-xs line-clamp-2">{post.caption}</p>}
                        <button 
                          onClick={() => setShowMobileProfile(true)}
                          className="mt-3 py-2 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-white pointer-events-auto"
                        >
                          View Profile & Reviews
                        </button>
                      </div>
                      <button
                        onClick={() => handleLike(null, post.id)}
                        className={`flex flex-col items-center gap-0.5 pointer-events-auto ${isLiked ? "text-red-400" : "text-white"}`}
                      >
                        <Heart className={`w-7 h-7 ${isLiked ? "fill-red-400" : ""}`} />
                        <span className="text-xs font-bold">{likesCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Mobile Profile Overlay */}
          {showMobileProfile && (
            <div className="fixed inset-0 z-[250] bg-black/95 flex flex-col md:hidden animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Profile Details</span>
                <button onClick={() => setShowMobileProfile(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8">
                 <ProfilePanel post={posts[activeReelIndex]} currentUserId={currentUserId} allPosts={posts} />
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {/* ─── MASONRY GRID ────────────────────────────────────────────────── */}
      <main className="pt-36 pb-20 px-4 md:px-10 max-w-[1600px] mx-auto">
        <header className="mb-14 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 blur-[120px] -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-5">
            <Zap className="w-3.5 h-3.5" /> Live Ecosystem Feed
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30 px-4">
            {viewMode === "my-posts" ? "My Collection" : "The Live Feed"}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-medium">
            {viewMode === "my-posts"
              ? "Your history of shared insights and visual highlights."
              : "A real-time visual stream of what's happening in the FoundU community."}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-14 h-14 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-2xl shadow-blue-500/20" />
            <span className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] animate-pulse">Syncing Visuals...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 border border-dashed border-white/10 rounded-[4rem]">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-3xl font-black text-white/40 mb-3">No content found</h3>
            <p className="text-gray-600 font-bold mb-8">Be the first to share something amazing.</p>
            <button
              onClick={() => navigate("/create-post")}
              className="px-8 py-4 bg-white text-[#020024] font-black text-base rounded-3xl hover:bg-blue-500 hover:text-white transition-all"
            >
              Create First Post
            </button>
          </div>
        )}
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}} />
    </div>
  );
};

export default LiveUserFeed;
