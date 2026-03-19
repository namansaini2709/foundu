import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Heart,
  MessageCircle,
  Search,
  CheckCircle,
  Award,
  Play,
  Copy,
  X,
  Send,
  Bookmark,
  MoreHorizontal,
  Star,
  ShieldCheck,
  Briefcase,
  Zap,
  Check
} from "lucide-react";

// Enhanced Premium Dummy Data with Specific Badges
const EXPLORE_DATA = [
  {
    id: 1,
    user: "alex_tech",
    fullName: "Alex Rivera",
    userImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    likes: "1.2k",
    comments: "42",
    type: "Freelancer",
    bio: "Senior Architect specializing in scalable cloud infrastructures and high-concurrency systems.",
    score: 98,
    badges: [
      { type: "blue", label: "Identity Verified", icon: CheckCircle },
      { type: "green", label: "Project Expert", icon: ShieldCheck }
    ],
    skills: ["Cloud", "Rust", "DevOps"],
    size: "large"
  },
  {
    id: 2,
    user: "sara.design",
    fullName: "Sara Montel",
    userImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=600&fit=crop",
    likes: "856",
    comments: "18",
    type: "Freelancer",
    bio: "Product designer focused on creating minimalist, high-conversion interfaces for fintech startups.",
    score: 94,
    badges: [
      { type: "blue", label: "Identity Verified", icon: CheckCircle }
    ],
    skills: ["UI/UX", "Figma", "Fintech"]
  },
  {
    id: 3,
    user: "foundry_ai",
    fullName: "Foundry AI Labs",
    userImg: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1522071823991-b967d120cc50?w=600&h=600&fit=crop",
    likes: "3.4k",
    comments: "124",
    type: "Startup",
    bio: "Next-gen AI research lab building autonomous agentic architectures for enterprise scale.",
    score: 92,
    badges: [
      { type: "golden", label: "Tier-1 Partner", icon: Award }
    ],
    skills: ["AI/ML", "LLMs", "Scale"],
    isVideo: true
  },
  {
    id: 4,
    user: "growth_mx",
    fullName: "Marco Growth",
    userImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop",
    likes: "2.1k",
    comments: "89",
    type: "Freelancer",
    bio: "Growth strategist with a track record of driving 300% YoY increases for SaaS products.",
    score: 96,
    badges: [
      { type: "blue", label: "Identity Verified", icon: CheckCircle },
      { type: "green", label: "Performance Badge", icon: ShieldCheck }
    ],
    skills: ["Growth", "SaaS", "Data"]
  },
  {
    id: 5,
    user: "luna_labs",
    fullName: "Luna BioLabs",
    userImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=1000&fit=crop",
    likes: "5.6k",
    comments: "210",
    type: "Startup",
    bio: "Revolutionizing biotech through decentralized computational biology and open-source genomics.",
    score: 99,
    badges: [
      { type: "golden", label: "Tier-1 Startup", icon: Award },
      { type: "green", label: "Vetted Ecosystem", icon: ShieldCheck }
    ],
    skills: ["Biotech", "Web3", "Scale"],
    size: "tall"
  },
  {
    id: 6,
    user: "pixel_pro",
    fullName: "Jonah Pixel",
    userImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&fit=crop",
    likes: "945",
    comments: "34",
    type: "Freelancer",
    bio: "Digital artisan crafting immersive VR/AR experiences that push the boundaries of reality.",
    score: 91,
    badges: [
      { type: "blue", label: "Identity Verified", icon: CheckCircle }
    ],
    skills: ["Unity", "C#", "AR/VR"]
  },
  {
    id: 7,
    user: "nexus_co",
    fullName: "Nexus Systems",
    userImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=600&fit=crop",
    likes: "1.7k",
    comments: "67",
    type: "Startup",
    bio: "Building the global nervous system for cross-border talent acquisition and payments.",
    score: 95,
    badges: [
      { type: "golden", label: "Tier-1 Partner", icon: Award }
    ],
    skills: ["Payments", "Global", "Scale"],
    isVideo: true
  },
  {
    id: 8,
    user: "dev_curious",
    fullName: "Lena V.",
    userImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=600&h=600&fit=crop",
    likes: "3.1k",
    comments: "156",
    type: "Freelancer",
    bio: "Full-stack engineer and open-source contributor with 10+ years experience in distributed systems.",
    score: 97,
    badges: [
      { type: "blue", label: "Identity Verified", icon: CheckCircle },
      { type: "green", label: "Expert Badge", icon: ShieldCheck }
    ],
    skills: ["Go", "Kubernetes", "OS"]
  },
  {
    id: 9,
    user: "vision_crew",
    fullName: "Vision Collective",
    userImg: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    mainImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop",
    likes: "4.2k",
    comments: "182",
    type: "Startup",
    bio: "A decentralized collective of futurists and engineers building the new web.",
    score: 93,
    badges: [
      { type: "golden", label: "Tier-1 Member", icon: Award }
    ],
    skills: ["Web3", "Vision", "DAO"]
  }
];

const LiveUserFeed = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const ExploreCard = ({ post }) => (
    <div 
      onClick={() => setSelectedPost(post)}
      className={`relative group cursor-pointer overflow-hidden rounded-xl bg-white/5 border border-white/5 shadow-lg
        ${post.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
        ${post.size === 'tall' ? 'md:row-span-2' : ''}
      `}
    >
      <img 
        src={post.mainImg} 
        alt="Post" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Type Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-20 group-hover:translate-x-1 transition-transform">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10
          ${post.type === 'Freelancer' ? 'text-blue-400' : 'text-purple-400'}
        `}>
          {post.type}
        </span>
      </div>

      {post.isVideo && (
        <div className="absolute top-4 right-4 text-white drop-shadow-lg z-20">
          <Play className="w-4 h-4 fill-current opacity-80" />
        </div>
      )}

      {/* ENHANCED HOVER OVERLAY (POPUP EFFECT) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-between">
        
        {/* Top Info: User & Badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            <div className="relative">
              <img src={post.userImg} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-2xl" alt={post.user} />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                <Check className="w-2 h-2 text-white" strokeWidth={4} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white">{post.user}</span>
                <span className="text-[10px] text-blue-400 font-bold tracking-tighter bg-blue-400/10 px-1 rounded">Score {post.score}</span>
              </div>
              <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{post.fullName}</div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-2 rounded-lg flex flex-col items-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400/20 mb-1" />
            <span className="text-[8px] font-black text-white uppercase tracking-tighter">Pro</span>
          </div>
        </div>

        {/* Middle Info: THE BADGES ROW */}
        <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Earned Badges</div>
          <div className="flex flex-col gap-2 mb-4">
            {post.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${
                  badge.type === 'blue' ? 'bg-blue-500/20 text-blue-400' : 
                  badge.type === 'golden' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-400'
                }`}>
                  <badge.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-white/90">{badge.label}</span>
              </div>
            ))}
          </div>
          
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Expertise</div>
          <div className="flex flex-wrap gap-1.5">
            {post.skills.map(skill => (
              <span key={skill} className="text-[9px] bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Info: Engagement Stats */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-xs font-black text-white">{post.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-white fill-white" />
              <span className="text-xs font-black text-white">{post.comments}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer group/link">
            <span className="text-[10px] font-black uppercase text-blue-400 group-hover/link:text-white transition-colors tracking-widest">Explore</span>
            <div className="w-4 h-4 rounded-full bg-blue-400/10 flex items-center justify-center group-hover/link:bg-blue-400 transition-colors">
              <Play className="w-2 h-2 text-white fill-current" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PostModal = ({ post, onClose }) => {
    if (!post) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-[#020024] border border-white/10 rounded-2xl w-full max-w-[1200px] max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
          {/* Image Section */}
          <div className="md:w-3/5 bg-black flex items-center justify-center relative group">
            <img 
              src={post.mainImg} 
              className="max-w-full max-h-full object-contain" 
              alt="Detailed View" 
            />
            {post.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <Play className="w-12 h-12 text-white fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="md:w-2/5 flex flex-col bg-[#020024]">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.userImg} className="w-9 h-9 rounded-full object-cover border border-white/10" alt={post.user} />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black text-white hover:text-blue-400 cursor-pointer">{post.user}</span>
                  {post.badges.some(b => b.type === 'blue') && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  <span className="text-gray-500 text-xs font-bold font-mono">• Follow</span>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar text-white">
              <div className="flex gap-3 mb-6">
                <img src={post.userImg} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt={post.user} />
                <div className="text-sm leading-relaxed">
                  <span className="font-black mr-2">{post.user}</span>
                  <span className="text-gray-300 font-light">{post.caption}</span>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <span>14h</span>
                    <span>{post.likes} likes</span>
                    <span>Reply</span>
                  </div>
                </div>
              </div>

              {/* Dummy Comments */}
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 mb-6 opacity-60">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-black mr-2">early_adopter_{i}</span>
                    <span className="text-gray-300">This is exactly what the ecosystem needs! 🚀</span>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                      <span>2h</span>
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Heart className="w-6 h-6 text-white hover:text-red-500 cursor-pointer transition-colors" />
                  <MessageCircle className="w-6 h-6 text-white hover:text-blue-400 cursor-pointer transition-colors" />
                  <Send className="w-6 h-6 text-white hover:text-blue-400 cursor-pointer transition-colors" />
                </div>
                <Bookmark className="w-6 h-6 text-white hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
              <div className="text-sm font-black text-white mb-1">{post.likes} likes</div>
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">March 18, 2026</div>
            </div>

            {/* Post Comment */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="bg-transparent text-sm w-full outline-none text-white placeholder:text-gray-600 font-medium" 
              />
              <button className="text-blue-400 text-sm font-black opacity-40 hover:opacity-100 transition-opacity ml-2">Post</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Page Content */}
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-[950px] mx-auto">
        
        {/* Search & Tabs Header */}
        <header className="mb-10 flex flex-col items-center gap-8">
          <div className="relative w-full max-w-[600px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users, startups, or expertise..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium placeholder:text-gray-600"
            />
          </div>
          
          {/* <nav className="flex items-center gap-10">
            {['For You', 'Trending', 'Startups', 'Talent', 'Vetted'].map((tab, i) => (
              <button 
                key={tab} 
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors py-2 border-b-2 
                  ${i === 0 ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-white'}
                `}
              >
                {tab}
              </button>
            ))}
          </nav> */}
        </header>

        {/* Explore Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-7 grid-flow-dense">
          {EXPLORE_DATA.map(post => (
            <ExploreCard key={post.id} post={post} />
          ))}
        </div>

        {/* Dynamic Loading Placeholder */}
        <div className="mt-20 flex justify-center">
           <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />

      <style dangerouslySetInnerHTML={{ __html: `
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
