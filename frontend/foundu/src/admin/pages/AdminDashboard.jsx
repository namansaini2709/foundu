import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import api from "../../utils/axiosConfig";
import AdminLayout from "../AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = `/api`;

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className={`bg-gray-800/40 backdrop-blur-sm border rounded-xl p-5 hover:scale-[1.02] transition-all duration-200 ${color}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{icon}</span>
      <span className={`text-3xl font-black ${color.includes("yellow") ? "text-yellow-300" : color.includes("green") ? "text-green-300" : color.includes("blue") ? "text-blue-300" : "text-purple-300"}`}>
        {value ?? "—"}
      </span>
    </div>
    <p className="text-white font-semibold text-sm">{label}</p>
    {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
  </div>
);

export default function AdminDashboard() {
  const adminId = getUserId();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [notifiedHistory, setNotifiedHistory] = useState([]);

  useEffect(() => {
    api
      .get(`${API}/admin/dashboard/stats`)
      .then((r) => setStats(r.data.stats))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const triggerMatchmaker = async () => {
    if (!window.confirm("⚠️ This will run the AI engine for all users and send notifications. Proceed?")) return;

    setAiLoading(true);
    const toastId = toast.loading("🤖 AI Engine warming up... please wait (takes ~15s)");

    try {
      const res = await api.get(`${API}/ai/trigger-matchmaker`);

      // Update history list
      if (res.data.notifiedUsers) {
        setNotifiedHistory(res.data.notifiedUsers);
      }

      toast.update(toastId, {
        render: `✅ Success! AI alerted ${res.data.totalNotify} users.`,
        type: "success",
        isLoading: false,
        autoClose: 5000
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: `❌ Matchmaker Failed: ${err.response?.data?.details || "Unknown Error"}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setAiLoading(false);
    }
  };

  const getRoleBadge = (type) => {
    switch (type) {
      case 'founder': return "bg-blue-900/30 text-blue-300 border-blue-500/30";
      case 'cofounder': return "bg-green-900/30 text-green-300 border-green-500/30";
      case 'freelancer': return "bg-purple-900/30 text-purple-300 border-purple-500/30";
      default: return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" theme="dark" />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Overview of FoundU platform activity
        </p>
      </div>

      {loading ? (
        <div className="text-blue-300 text-sm animate-pulse">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="⏳" label="Pending Blue Tick" value={stats?.pendingBlueTickRequests} color="border-yellow-500/40" sub="Awaiting manual review" />
          <StatCard icon="✅" label="Approved Verifications" value={stats?.approvedBlueTick} color="border-green-500/40" sub="Blue tick granted" />
          <StatCard icon="👥" label="Total Users" value={stats?.totalUsers} color="border-blue-500/40" sub="All roles combined" />
          <StatCard icon="⭐" label="Testimonials" value={stats?.totalTestimonials} color="border-orange-500/40" sub="Homepage reviews" />
          <StatCard icon="💼" label="Total Jobs Posted" value={stats?.totalJobs} color="border-purple-500/40" sub="Active & closed" />
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-gray-800/30 border border-blue-900/30 rounded-xl p-5 mb-6">
        <h2 className="text-white font-bold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/badges"
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            ✅ Review Blue Tick Requests
            {stats?.pendingBlueTickRequests > 0 && (
              <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded-full">
                {stats.pendingBlueTickRequests}
              </span>
            )}
          </a>

          <button
            onClick={triggerMatchmaker}
            disabled={aiLoading}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${aiLoading
                ? "bg-purple-900/50 text-purple-300 cursor-not-allowed border border-purple-500/30"
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20"
              }`}
          >
            {aiLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI Thinking...
              </>
            ) : (
              <>🤖 Run AI Matchmaker</>
            )}
          </button>

          <a
            href="/admin/testimonials"
            className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            ⭐ Manage Testimonials
          </a>

          <a
            href="/admin/influencers"
            className="bg-pink-600 hover:bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            🔥 Influencer Requests
          </a>
        </div>
      </div>

      {/* AI Notification Logs Table */}
      {notifiedHistory.length > 0 && (
        <div className="bg-gray-800/30 border border-purple-900/40 rounded-xl overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 border-b border-purple-900/30 bg-purple-900/10 flex justify-between items-center">
            <h2 className="text-white font-bold flex items-center gap-2">
              📊 Latest AI Match Logs
              <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Newest First</span>
            </h2>
            <button onClick={() => setNotifiedHistory([])} className="text-gray-400 hover:text-white text-xs hover:underline">Clear Logs</button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">User Name</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Email</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Matches</th>
                  <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {notifiedHistory.map((user, i) => (
                  <tr key={i} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-white">{user.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getRoleBadge(user.user_type)}`}>
                        {user.user_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-black text-purple-400">{user.match_count}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-green-500 text-[10px] font-black uppercase flex items-center justify-end gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Notified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-blue-200 text-sm font-semibold mb-1">ℹ️ About this panel</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          This is the FoundU Admin Panel. Currently supports AI Matchmaking, Blue Tick verification and Testimonials.
          More features (user management, job moderation, analytics) will be added progressively.
        </p>
      </div>
    </AdminLayout>
  );
}
