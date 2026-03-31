import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import api from "../../utils/axiosConfig";
import AdminLayout from "../AdminLayout";

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

  useEffect(() => {
    api
      .get(`${API}/admin/dashboard/stats`)
      .then((r) => setStats(r.data.stats))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
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
      <div className="bg-gray-800/30 border border-blue-900/30 rounded-xl p-5">
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
          <a
            href="/admin/testimonials"
            className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            ⭐ Manage Testimonials
          </a>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-blue-200 text-sm font-semibold mb-1">ℹ️ About this panel</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          This is the FoundU Admin Panel. Currently supports Blue Tick verification review.
          More features (user management, job moderation, analytics) will be added progressively.
        </p>
      </div>
    </AdminLayout>
  );
}
