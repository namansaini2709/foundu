import { useState } from "react";
import { getUserId } from "../../utils/authUtils";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { Megaphone, Users, Mail, Bell, Send, AlertTriangle, CheckCircle } from "lucide-react";
import AdminLayout from "../AdminLayout";

const API = `/api`;

export default function AdminBroadcast() {
  const [targetType, setTargetType] = useState("freelancer");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [broadcastStats, setBroadcastStats] = useState(null);
  const adminId = getUserId();

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please provide both a title and a message");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`${API}/admin/broadcast`, {
        targetType,
        title,
        message
      });

      if (res.data.success) {
        setBroadcastStats(res.data.results);
        setShowSuccess(true);
        setTitle("");
        setMessage("");
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Broadcast error:", error);
      toast.error(error.response?.data?.message || "Failed to send broadcast");
    } finally {
      setLoading(false);
    }
  };

  const targets = [
    { id: "freelancer", label: "All Freelancers", icon: "👨‍💻", color: "blue" },
    { id: "cofounder", label: "All Co-founders", icon: "🤝", color: "purple" },
    { id: "founder", label: "All Founders", icon: "🚀", color: "indigo" },
    { id: "all", label: "Everyone", icon: "🌍", color: "green" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 p-6 rounded-3xl border border-blue-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Bulk Broadcast</h1>
              <p className="text-blue-400/70 text-sm font-medium">Send mass notifications and emails to your community</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Composer Section ─────────────────────────── */}
          <div className="bg-gray-900/40 rounded-[2.5rem] border border-blue-900/20 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Select Recipients</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {targets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTargetType(t.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 group
                    ${targetType === t.id 
                      ? "bg-blue-600/20 border-blue-500/50 text-white ring-2 ring-blue-500/20" 
                      : "bg-gray-800/20 border-white/5 text-gray-400 hover:border-white/10"
                    }
                  `}
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform">{t.icon}</div>
                  <span className="font-semibold text-sm">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Message Title</label>
                <input
                  type="text"
                  placeholder="e.g., Important Platform Update"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-800/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Broadcast Message</label>
                <textarea
                  placeholder="Compose your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-gray-800/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!title.trim() || !message.trim() || loading}
              className="w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-lg shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Broadcast
                </>
              )}
            </button>
          </div>

          {/* ── Preview Section ──────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-gray-900/40 rounded-[2.5rem] border border-blue-900/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Notification Preview</h2>
              </div>
              
              <div className="bg-gray-800/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                 </div>
                 <div className="flex gap-4">
                   <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 flex-shrink-0">
                     📣
                   </div>
                   <div className="flex-1">
                     <h3 className="text-white font-bold mb-1">{title || "Your Broadcast Title"}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                       {message || "The preview of your message will appear here as you type. This is exactly how users will see it in their notification panel..."}
                     </p>
                     <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                       Just now • FoundU Official
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="bg-gray-900/40 rounded-[2.5rem] border border-blue-900/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Email Preview</h2>
              </div>
              
              <div className="bg-white rounded-2xl overflow-hidden text-[#333] shadow-2xl">
                <div className="bg-[#020024] p-4 text-center">
                  <span className="text-blue-400 font-black tracking-widest text-xl">FOUND<span className="text-white">U</span></span>
                </div>
                <div className="p-8">
                  <p className="text-sm text-gray-500 mb-4">Hi [User Name],</p>
                  <h3 className="text-xl font-bold mb-3">{title || "Subject Line Here"}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                    {message || "This is a preview of the email content that will be sent to the selected category of users. It will be wrapped in a professional FoundU branded template."}
                  </p>
                  <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm">
                    View Dashboard
                  </div>
                </div>
                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">© 2026 FoundU. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Confirmation Modal ───────────────────────── */}
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020024]/80 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-6 border border-yellow-500/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white text-center mb-2">Final Confirmation</h3>
              <p className="text-gray-400 text-center text-sm leading-relaxed mb-8">
                You are about to send this broadcast to <span className="text-white font-bold underline">all {targetType}s</span>. This action cannot be undone once started. Are you sure?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 px-6 py-4 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 shadow-lg shadow-blue-900/30 transition-all"
                >
                  Yes, Send All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Success Modal ───────────────────────────── */}
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020024]/80 backdrop-blur-md">
            <div className="bg-gray-900 w-full max-w-md rounded-[2.5rem] border border-green-500/20 p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6 border border-green-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white text-center mb-2">Broadcast Complete</h3>
              <p className="text-gray-400 text-center text-sm leading-relaxed mb-6">
                Your message has been delivered to your community successfully.
              </p>

              <div className="bg-gray-800/40 rounded-2xl p-4 mb-8 border border-white/5 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Reach</p>
                  <p className="text-xl font-black text-white">{broadcastStats?.total || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Delivered</p>
                  <p className="text-xl font-black text-green-400">{broadcastStats?.success || 0}</p>
                </div>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full h-14 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
