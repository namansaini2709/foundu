import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import api from "../../utils/axiosConfig";
import AdminLayout from "../AdminLayout";
import { getImageUrl } from "../../utils/imageUtils";

const API = `/api`;

const STATUS_COLORS = {
  pending:  "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  approved: "bg-green-500/15  text-green-300  border-green-500/30",
  rejected: "bg-red-500/15    text-red-300    border-red-500/30",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${STATUS_COLORS[status] || "text-gray-400"}`}>
    {status || "none"}
  </span>
);

const LinkCell = ({ href, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 text-xs break-all">
      {label}
    </a>
  ) : (
    <span className="text-gray-600 text-xs">—</span>
  );

export default function AdminBadges() {
  const [requests, setRequests]   = useState([]);
  const [filter, setFilter]       = useState("pending");
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null); // user_id being processed

  const fetchRequests = (status = filter) => {
    setLoading(true);
    api
      .get(`${API}/admin/badges/all?status=${status}`)
      .then((r) => setRequests(r.data.requests || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests(filter);
  }, [filter]);

  const handleApprove = async (user_id) => {
    const adminId = getUserId();
    if (!window.confirm("Approve Blue Tick for this user?")) return;
    setActionId(user_id);
    try {
      await api.post(`${API}/admin/badges/approve`, { user_id, adminId });
      fetchRequests(filter);
    } catch (err) {
      alert(err.response?.data?.message || "Error approving");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (user_id) => {
    if (!window.confirm("Reject Blue Tick for this user?")) return;
    setActionId(user_id);
    try {
      await api.post(`${API}/admin/badges/reject`, { user_id });
      fetchRequests(filter);
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting");
    } finally {
      setActionId(null);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">✅ Blue Tick Verification</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review user-submitted social links and grant or reject Blue Tick verification.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg border border-blue-900/30 self-start sm:self-auto">
          {["pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all ${
                filter === s
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-blue-300 text-sm animate-pulse py-8 text-center">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-3">🎉</div>
          <p className="font-semibold text-gray-400">No {filter} requests</p>
          <p className="text-sm mt-1">All caught up!</p>
        </div>
      ) : (
        <div className="bg-gray-800/30 border border-blue-900/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900/50 border-b border-blue-900/30">
                  {["User", "Type", "LinkedIn", "GitHub", "Portfolio", "Photo", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-blue-300 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {requests.map((req) => (
                  <tr key={req.user_id} className="hover:bg-blue-900/10 transition-colors">
                    {/* User */}
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold">{req.full_name}</p>
                      <p className="text-gray-500 text-xs">{req.email}</p>
                    </td>

                    {/* User type */}
                    <td className="px-4 py-3">
                      <span className="bg-blue-900/30 border border-blue-700/40 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                        {req.user_type}
                      </span>
                    </td>

                    {/* LinkedIn */}
                    <td className="px-4 py-3 max-w-[140px]">
                      <LinkCell href={req.linkedin_url} label="LinkedIn ↗" />
                    </td>

                    {/* GitHub */}
                    <td className="px-4 py-3 max-w-[140px]">
                      <LinkCell href={req.github_url} label="GitHub ↗" />
                    </td>

                    {/* Portfolio */}
                    <td className="px-4 py-3 max-w-[140px]">
                      <LinkCell href={req.portfolio_url} label="Portfolio ↗" />
                    </td>

                    {/* Profile photo */}
                    <td className="px-4 py-3">
                      {req.profile_picture_url ? (
                        <img
                          src={getImageUrl(req.profile_picture_url)}
                          alt={req.full_name}
                          className="w-8 h-8 rounded-full border border-blue-700/40 object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>


                    {/* Status */}
                    <td className="px-4 py-3">
                      <StatusBadge status={req.blue_tick_status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {req.blue_tick_status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(req.user_id)}
                            disabled={actionId === req.user_id}
                            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {actionId === req.user_id ? "..." : "✅ Accept"}
                          </button>
                          <button
                            onClick={() => handleReject(req.user_id)}
                            disabled={actionId === req.user_id}
                            className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {actionId === req.user_id ? "..." : "❌ Reject"}
                          </button>
                        </div>
                      )}
                      {req.blue_tick_status === "approved" && (
                        <button
                          onClick={() => handleReject(req.user_id)}
                          className="bg-gray-700 hover:bg-red-600/50 text-gray-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                      {req.blue_tick_status === "rejected" && (
                        <button
                          onClick={() => handleApprove(req.user_id)}
                          className="bg-gray-700 hover:bg-green-600/50 text-gray-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Re-approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-4 py-3 border-t border-blue-900/20 bg-gray-900/20">
            <p className="text-gray-500 text-xs">
              Showing <span className="text-blue-300 font-semibold">{requests.length}</span> {filter} request{requests.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
