import React, { useState, useEffect } from "react";
import { getUserId } from "../utils/authUtils";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import {
  Lightbulb,
  Send,
  CheckCircle,
  Circle,
  Trash2,
  Rocket,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Footer from "../components/Footer";
import "./IdeaLab.css";
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
        // Update local state for immediate feedback
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
    <div className="idea-lab-container">
      <div className="idea-lab-main">
        <header className="idea-lab-header">
          <h1>Idea Lab</h1>
          <p>
            Fuel your entrepreneurial journey. Pitch your startup ideas and let our AI craft your roadmap to success.
          </p>
        </header>

        <div className="idea-content-grid">
          {/* LEFT: IDEA LIST & NEW IDEA FORM */}
          <aside className="idea-sidebar">
            <div className="new-idea-card">
              <h3>
                <Lightbulb className="text-blue-400" /> Pitch New Idea
              </h3>
              <form onSubmit={handleCreateIdea}>
                <input
                  type="text"
                  placeholder="What's your big idea?"
                  value={newIdea.title}
                  onChange={(e) =>
                    setNewIdea({ ...newIdea, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Describe the problem you're solving and your unique solution..."
                  rows="5"
                  value={newIdea.description}
                  onChange={(e) =>
                    setNewIdea({ ...newIdea, description: e.target.value })
                  }
                ></textarea>
                <button type="submit" disabled={loading}>
                  {loading ? (
                    "Analyzing Vision..."
                  ) : (
                    <>
                      <Rocket size={20} /> Launch Pitch
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="my-ideas-list">
              <h3>Your Portfolio</h3>
              {ideas.length === 0 ? (
                <p className="empty-text">Your lab is empty. Pitch an idea to start.</p>
              ) : (
                ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className={`idea-item ${selectedIdea?.id === idea.id ? "active" : ""}`}
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <div className="idea-item-info">
                      <h4>{idea.title}</h4>
                      <span className="stage-badge">{idea.stage}</span>
                    </div>
                    <button
                      className="del-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIdea(idea.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* RIGHT: SELECTED IDEA DETAILS & MILESTONES */}
          <main className="idea-details">
            {selectedIdea ? (
              <div className="idea-showcase">
                <div className="showcase-header">
                  <h2>{selectedIdea.title}</h2>
                  <div className="idea-status">
                    <span className="status-tag">{selectedIdea.status}</span>
                  </div>
                </div>
                
                <p className="idea-desc">{selectedIdea.description}</p>

                <div className="milestone-section">
                  <h3>
                    <Rocket className="text-emerald-400" /> AI Roadmap
                  </h3>
                  <div className="milestone-list">
                    {selectedIdea.milestones?.map((m) => (
                      <div
                        key={m.id}
                        className={`milestone-card ${m.is_completed ? "completed" : ""}`}
                        onClick={() =>
                          handleToggleMilestone(m.id, m.is_completed)
                        }
                      >
                        <div className="icon-wrapper">
                          {m.is_completed ? (
                            <CheckCircle className="icon check" />
                          ) : (
                            <Circle className="icon" />
                          )}
                        </div>
                        <span>{m.milestone_text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RESOURCES SECTION */}
                <div className="resources-section">
                  <h3>
                    <BookOpen className="text-blue-400" /> Growth Engine
                  </h3>
                  <div className="resource-links">
                    <div className="resource-card">
                      <div className="icon-wrapper">
                        <Rocket size={24} />
                      </div>
                      <div>
                        <h4>Tech Talent</h4>
                        <p>
                          Build your MVP with vetted developers who specialize in your tech stack.
                        </p>
                        <a href="/freelancer-jobs">
                          Find Developers <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                    <div className="resource-card">
                      <div className="icon-wrapper">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h4>Founder's Vault</h4>
                        <p>
                          Exclusive guides on fundraising, market fit, and scaling your startup.
                        </p>
                        <a href="#">
                          Explore Vault <ArrowRight size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <div className="icon-box">
                  <Lightbulb size={64} />
                </div>
                <h2>The Lab is Open</h2>
                <p>
                  Every unicorn started as a simple idea. Select an existing pitch or launch a new one to see your AI roadmap.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default IdeaLab;
