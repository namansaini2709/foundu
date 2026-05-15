import React, { useState, useEffect } from "react";
import { getUserId } from "../utils/authUtils";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import {
  Lightbulb,
  CheckCircle,
  Circle,
  Trash2,
  Rocket,
  ArrowRight,
  BookOpen,
  Loader2
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const API_BASE = `/api`;

const IdeaLab = () => {
  const userId = getUserId();
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get(`${API_BASE}/ideas/user/${userId}`);
      if (res.data.success) {
        setIdeas(res.data.ideas);
        if (res.data.ideas.length > 0 && !selectedIdea) {
          setSelectedIdea(res.data.ideas[0]);
        }
      }
    } catch (err) {
      console.error("Fetch ideas error:", err);
    }
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    if (!newIdea.title || !newIdea.description) {
      return toast.warning("Please fill all fields");
    }
    setLoading(true);
    try {
      const res = await api.post(`${API_BASE}/ideas/create`, {
        user_id: userId,
        ...newIdea,
      });
      if (res.data.success) {
        toast.success("Idea Pitch Received! AI is analyzing...");
        setNewIdea({ title: "", description: "" });
        fetchIdeas();
      }
    } catch (err) {
      toast.error("Error creating idea");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = async (mId, currentStatus) => {
    try {
      const res = await api.put(`${API_BASE}/ideas/milestone/${mId}`, {
        is_completed: !currentStatus,
      });
      if (res.data.success) {
        const updatedIdeas = ideas.map((idea) => ({
          ...idea,
          milestones: idea.milestones.map((m) =>
            m.id === mId ? { ...m, is_completed: !currentStatus } : m,
          ),
        }));
        setIdeas(updatedIdeas);
        if (selectedIdea) {
          setSelectedIdea(updatedIdeas.find((i) => i.id === selectedIdea.id));
        }
      }
    } catch (err) {
      toast.error("Error updating milestone");
    }
  };

  const handleDeleteIdea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      const res = await api.delete(`${API_BASE}/ideas/${id}`);
      if (res.data.success) {
        toast.info("Idea deleted");
        const filtered = ideas.filter((i) => i.id !== id);
        setIdeas(filtered);
        setSelectedIdea(filtered[0] || null);
      }
    } catch (err) {
      toast.error("Error deleting idea");
    }
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      <Navbar />

      {/* Ambient Animated Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* HEADER */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Lightbulb size={14} />
            The Founder's Lab
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            Transform Ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Reality</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Pitch your startup concept and let our AI architect a customized, step-by-step roadmap to get you from zero to launch.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28">
            
            {/* New Idea Card */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <h3 className="text-xl font-extrabold flex items-center gap-2 text-white mb-6">
                <Rocket className="text-blue-400" size={22} /> Pitch New Idea
              </h3>
              <form onSubmit={handleCreateIdea} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name your big idea..."
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-500"
                />
                <textarea
                  placeholder="Describe the problem you're solving and your unique solution..."
                  rows="4"
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-500 resize-none"
                ></textarea>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><Rocket size={18} /> Launch AI Pitch</>}
                </button>
              </form>
            </div>

            {/* Portfolio List */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Your Portfolio</h3>
              
              {ideas.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">Your lab is empty. Pitch an idea to start.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea)}
                      className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        selectedIdea?.id === idea.id 
                          ? "bg-blue-500/10 border-blue-500/30" 
                          : "bg-white/[0.02] border-transparent hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="overflow-hidden pr-2">
                        <h4 className="text-sm font-bold text-gray-100 truncate mb-1">{idea.title}</h4>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          selectedIdea?.id === idea.id ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-gray-400"
                        }`}>
                          {idea.stage}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteIdea(idea.id); }}
                        className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT: MAIN SHOWCASE */}
          <section className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl min-h-[700px]">
            {selectedIdea ? (
              <div className="animate-fade-in-up">
                
                {/* Showcase Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight flex-1">
                    {selectedIdea.title}
                  </h2>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-full whitespace-nowrap">
                    {selectedIdea.status}
                  </span>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed bg-black/20 p-6 rounded-2xl border-l-4 border-blue-500 mb-12">
                  {selectedIdea.description}
                </p>

                {/* AI Roadmap (Timeline) */}
                <div className="mb-14">
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-3 mb-8">
                    <Rocket className="text-blue-400" size={24} /> AI Roadmap
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIdea.milestones?.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(m.id, m.is_completed)}
                        className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          m.is_completed 
                            ? "bg-emerald-500/5 border-emerald-500/20 opacity-70" 
                            : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-blue-500/30 hover:-translate-y-1"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {m.is_completed ? (
                            <CheckCircle size={22} className="text-emerald-500" />
                          ) : (
                            <Circle size={22} className="text-gray-500 group-hover:text-blue-400" />
                          )}
                        </div>
                        <span className={`text-[15px] leading-relaxed font-medium ${
                          m.is_completed ? "text-gray-500 line-through" : "text-gray-200"
                        }`}>
                          {m.milestone_text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RESOURCES */}
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-3 mb-6">
                    <BookOpen className="text-blue-400" size={24} /> Growth Engine
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="group bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-5">
                        <Rocket size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Tech Talent</h4>
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed">Build your MVP with vetted developers who specialize in your tech stack.</p>
                      <a href="/freelancer-jobs" className="text-blue-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Find Developers <ArrowRight size={16} />
                      </a>
                    </div>

                    <div className="group bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-5">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Founder's Vault</h4>
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed">Exclusive guides on fundraising, market fit, and scaling your startup.</p>
                      <a href="#" className="text-purple-400 text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Explore Vault <ArrowRight size={16} />
                      </a>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-blue-400 mb-8">
                  <Lightbulb size={48} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">The Lab is Open</h2>
                <p className="text-gray-400 text-lg max-w-md">
                  Every unicorn started as a simple idea. Select an existing pitch or launch a new one to see your AI roadmap.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IdeaLab;
