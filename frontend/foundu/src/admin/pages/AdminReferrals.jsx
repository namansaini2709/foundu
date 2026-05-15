import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { CheckCircle, XCircle, Users, Copy, Plus } from "lucide-react";
import AdminLayout from "../AdminLayout";
import "react-toastify/dist/ReactToastify.css";

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState("");
  const [couponType, setCouponType] = useState("referral"); // 'referral' or 'whatsapp'
  const [waPlan, setWaPlan] = useState("monthly");
  const [waDuration, setWaDuration] = useState(30);
  const [waMaxUses, setWaMaxUses] = useState(100);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [referralUsers, setReferralUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await api.get("/api/referrals");
      // Also fetch WhatsApp coupons to show in the list if you want unified view
      // For now, let's focus on creating them
      if (res.data.success) {
        setReferrals(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return toast.warning("Code is required");

    try {
      let res;
      if (couponType === "whatsapp") {
        res = await api.post("/api/whatsapp/admin/create-coupon", {
          code: newCode.trim().toUpperCase(),
          plan: waPlan,
          duration_days: Number(waDuration),
          max_uses: Number(waMaxUses)
        });
      } else {
        res = await api.post("/api/referrals", { code: newCode.trim() });
      }

      if (res.data.success) {
        toast.success(res.data.message || "Code created successfully!");
        setNewCode("");
        fetchReferrals();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating code");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.put(`/api/referrals/${id}`, { is_active: !currentStatus });
      if (res.data.success) {
        toast.success(`Code is now ${!currentStatus ? 'Live' : 'Offline'}`);
        setReferrals(referrals.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
      }
    } catch (error) {
      toast.error("Error toggling status");
    }
  };

  const handleViewUsers = async (code) => {
    setSelectedReferral(code);
    setUsersLoading(true);
    setReferralUsers([]);

    try {
      const res = await api.get(`/api/referrals/users/${code}`);
      if (res.data.success) {
        setReferralUsers(res.data.data);
      }
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="bottom-right" theme="dark" />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Referrals & Coupons</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage referral codes and WhatsApp alert coupons
        </p>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Generate New Code</h2>
          <div className="flex bg-gray-900/50 p-1 rounded-lg border border-gray-700">
            <button 
              onClick={() => setCouponType("referral")}
              className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${couponType === 'referral' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              REFERRAL
            </button>
            <button 
              onClick={() => setCouponType("whatsapp")}
              className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${couponType === 'whatsapp' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              WHATSAPP
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateReferral} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                {couponType === 'whatsapp' ? 'WhatsApp Coupon Code' : 'Referral Code'}
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder={couponType === 'whatsapp' ? "e.g. WA_FREE_30" : "e.g. FOUNDU100"}
                className="bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 w-full outline-none focus:border-blue-500 transition-colors"
                maxLength={50}
              />
            </div>

            {couponType === 'whatsapp' && (
              <>
                <div className="w-full sm:w-32">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Plan</label>
                  <select 
                    value={waPlan}
                    onChange={(e) => setWaPlan(e.target.value)}
                    className="bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 w-full outline-none focus:border-green-500 text-xs font-bold"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="w-full sm:w-24">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Days</label>
                  <input 
                    type="number"
                    value={waDuration}
                    onChange={(e) => setWaDuration(e.target.value)}
                    className="bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 w-full outline-none focus:border-green-500 text-xs font-bold"
                  />
                </div>
                <div className="w-full sm:w-24">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Limit</label>
                  <input 
                    type="number"
                    value={waMaxUses}
                    onChange={(e) => setWaMaxUses(e.target.value)}
                    className="bg-gray-900/50 border border-gray-600 text-white rounded-lg px-4 py-2.5 w-full outline-none focus:border-green-500 text-xs font-bold"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className={`${couponType === 'whatsapp' ? 'bg-green-600 hover:bg-green-500 shadow-green-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'} text-white px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all w-full sm:w-auto active:scale-95 shadow-lg`}
            >
              <Plus size={18} /> {couponType === 'whatsapp' ? 'Generate Coupon' : 'Generate Code'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900/50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-blue-300 animate-pulse">Loading referral data...</td></tr>
              ) : referrals.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-gray-500">No referral codes found. Start by generating one above!</td></tr>
              ) : (
                referrals.map((ref) => (
                  <tr key={ref.id} className="border-t border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-black text-white bg-gray-900/50 px-3 py-1 rounded border border-gray-700">
                        {ref.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 w-fit ${ref.is_active ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ref.is_active ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                        {ref.is_active ? 'Live' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(ref.created_at).toLocaleDateString("en-IN", {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewUsers(ref.code)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-black text-xs bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all hover:scale-105"
                      >
                        <Users size={14} /> {ref.usage_count} Users
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(ref.id, ref.is_active)}
                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded transition-all active:scale-95 ${ref.is_active
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-green-400 hover:text-green-300'
                          }`}
                      >
                        {ref.is_active ? 'Stop' : 'Launch'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReferral(null)}></div>
          <div className="bg-gray-800 border border-blue-900/30 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900/30">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Users className="text-blue-400" />
                  Referral Usage: <span className="text-blue-400">{selectedReferral}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">List of users who registered using this code</p>
              </div>
              <button
                onClick={() => setSelectedReferral(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {usersLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="text-gray-400 mt-4 text-sm">Loading user list...</p>
                </div>
              ) : referralUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 italic">No users have used this code yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-900/50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Profile</th>
                        <th className="px-4 py-3 text-right">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {referralUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">{user.full_name}</span>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-900/50 text-gray-300 border border-gray-700">
                              {user.user_type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${user.is_profile_complete ? 'text-green-400' : 'text-yellow-400'}`}>
                              {user.is_profile_complete ? 'Complete' : 'Incomplete'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReferrals;
