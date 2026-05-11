import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { 
  Plus, Ticket, Send, Users, 
  Activity, XCircle, CheckCircle2, 
  Trash2, Loader2, AlertTriangle,
  Calendar, Clock, ExternalLink,
  ChevronRight, ShieldCheck
} from "lucide-react";

const AdminWhatsApp = () => {
  const [stats, setStats] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // Modal State
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponUsers, setCouponUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    plan: "monthly",
    duration_days: 30,
    max_uses: 100,
    expires_at: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/whatsapp/admin/stats");
      if (res.data.success) {
        setStats(res.data.stats);
        setCoupons(res.data.stats.coupons || []);
      }
    } catch (err) {
      toast.error("Failed to fetch WhatsApp admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code) return toast.error("Coupon code is required!");
    setBtnLoading(true);
    try {
      const res = await api.post("/api/whatsapp/admin/create-coupon", newCoupon);
      if (res.data.success) {
        toast.success(res.data.message);
        setNewCoupon({ code: "", plan: "monthly", duration_days: 30, max_uses: 100, expires_at: "" });
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeactivate = async (code) => {
    if (!window.confirm(`Deactivate coupon ${code}?`)) return;
    try {
      const res = await api.post("/api/whatsapp/admin/deactivate-coupon", { code });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to deactivate coupon.");
    }
  };

  const handleViewUsers = async (code) => {
    setSelectedCoupon(code);
    setUsersLoading(true);
    setCouponUsers([]);
    try {
      const res = await api.get(`/api/whatsapp/admin/coupon-users/${code}`);
      if (res.data.success) {
        setCouponUsers(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Error fetching users for this coupon.");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTriggerBroadcast = async () => {
    if (!window.confirm("⚠️ This will send REAL WhatsApp messages to ALL eligible subscribers. Proceed?")) return;
    setBtnLoading(true);
    const toastId = toast.loading("📡 Sending WhatsApp Broadcast...");
    try {
      const res = await api.post("/api/whatsapp/admin/send-alerts");
      if (res.data.success) {
        toast.update(toastId, {
          render: `✅ Done! Sent to ${res.data.results.sent} users.`,
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
      }
    } catch (err) {
      toast.update(toastId, {
        render: `❌ Broadcast Failed: ${err.response?.data?.error || "Error"}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* HEADER & BROADCAST */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="p-2 bg-[#25d366]/20 rounded-xl text-[#25d366]">
              <Activity size={28} />
            </span>
            WhatsApp Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage alerts, coupons, and see who is subscribing.</p>
        </div>
        <button
          onClick={handleTriggerBroadcast}
          disabled={btnLoading}
          className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-xl shadow-green-500/20 active:scale-95 disabled:opacity-50"
        >
          {btnLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          TRIGGER DAILY BROADCAST
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-green-500" size={40} />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Users size={20} />, label: "Subscribers", val: stats?.totalSubscribers, color: "text-blue-400" },
              { icon: <ShieldCheck size={20} />, label: "Eligible (Profile OK)", val: stats?.eligibleForAlerts, color: "text-green-400" },
              { icon: <Ticket size={20} />, label: "Via Coupon", val: stats?.viaCoupon, color: "text-purple-400" },
              { icon: <Activity size={20} />, label: "Paid via Stripe", val: stats?.viaPaid, color: "text-orange-400" },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                <div className={`mb-3 ${s.color}`}>{s.icon}</div>
                <div className="text-3xl font-black text-white">{s.val || 0}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
            
            {/* COUPON MANAGEMENT TABLE */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                <h2 className="font-black text-white flex items-center gap-2 text-lg">
                  <Ticket size={20} className="text-purple-400" />
                  Subscription Coupons
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/20 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <th className="px-6 py-4 text-center">#</th>
                      <th className="px-6 py-4">Coupon Info</th>
                      <th className="px-6 py-4">Usage Status</th>
                      <th className="px-6 py-4">Expiry</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {coupons.map((c, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-gray-600 font-bold text-xs text-center">{i+1}</td>
                        <td className="px-6 py-4">
                          <div className="font-black text-white tracking-wider flex items-center gap-2">
                            {c.code}
                            {c.is_active === 0 && (
                              <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-black uppercase">Offline</span>
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                            {c.plan} · {c.duration_days} Days
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleViewUsers(c.code)}
                            className="flex items-center gap-1.5 text-xs font-black text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Users size={14} /> {c.used_count} / {c.max_uses} Users
                          </button>
                          <div className="w-24 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${Math.min(100, (c.used_count/c.max_uses) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-500">
                          {c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "No Limit"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleViewUsers(c.code)}
                              className="p-2 bg-blue-500/10 text-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white"
                              title="View Users"
                            >
                              <ChevronRight size={18} />
                            </button>
                            {c.is_active === 1 && (
                              <button 
                                onClick={() => handleDeactivate(c.code)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                title="Deactivate"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-600 font-bold italic">
                          No coupons found. Create your first one on the right.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GENERATOR FORM */}
            <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 lg:sticky lg:top-28 shadow-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Plus size={24} className="text-green-400" />
                Create Coupon
              </h3>
              
              <form onSubmit={handleCreateCoupon} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Coupon Code</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. WHATSAPP_FREE"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white font-black text-lg focus:border-[#25d366] outline-none transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Plan Type</label>
                    <select 
                      value={newCoupon.plan}
                      onChange={(e) => setNewCoupon({...newCoupon, plan: e.target.value})}
                      className="w-full bg-[#020024] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold outline-none cursor-pointer focus:border-[#25d366]"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="6months">6 Months</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Duration (Days)</label>
                    <input 
                      type="number"
                      value={newCoupon.duration_days}
                      onChange={(e) => setNewCoupon({...newCoupon, duration_days: e.target.value})}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white font-black outline-none focus:border-[#25d366]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Max Usage</label>
                    <input 
                      type="number"
                      value={newCoupon.max_uses}
                      onChange={(e) => setNewCoupon({...newCoupon, max_uses: e.target.value})}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white font-black outline-none focus:border-[#25d366]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3">Expiry Date</label>
                    <input 
                      type="date"
                      value={newCoupon.expires_at}
                      onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-[#25d366]"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={btnLoading}
                  className="w-full bg-white text-black py-5 rounded-2xl font-black text-[15px] hover:bg-gray-200 transition-all flex items-center justify-center gap-3 mt-6 shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  {btnLoading ? <Loader2 className="animate-spin" size={20} /> : <Ticket size={20} />}
                  GENERATE COUPON CODE
                </button>
              </form>
            </div>

          </div>

          {/* BROADCAST LOGS / INFO */}
          <div className="bg-[#25d366]/5 border border-[#25d366]/20 p-6 rounded-[24px] flex items-start gap-4">
            <AlertTriangle className="text-[#25d366] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#25d366] font-black uppercase text-xs tracking-widest mb-1.5">Meta API Broadcaster</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                The broadcast button uses the official <strong>Meta Cloud API</strong> to deliver personalized job alerts. 
                Ensure your credentials are active in the <code>.env</code> file. Alerts are sent to users who have a 
                <strong> Connected</strong> status and <strong>Complete Profile</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* USER LIST MODAL */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
          <div 
            className="absolute inset-0 bg-[#020024]/80" 
            onClick={() => setSelectedCoupon(null)} 
          />
          <div className="bg-gray-900 border border-white/10 rounded-[32px] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Users className="text-blue-400" />
                  Redemptions: <span className="text-blue-400">{selectedCoupon}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest">List of users who used this code</p>
              </div>
              <button 
                onClick={() => setSelectedCoupon(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              {usersLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-gray-500 font-bold text-sm">Fetching users...</p>
                </div>
              ) : couponUsers.length === 0 ? (
                <div className="text-center py-20 text-gray-600 font-bold italic">
                  No one has used this code yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] border-b border-white/5">
                      <tr>
                        <th className="pb-4 pr-4">User Details</th>
                        <th className="pb-4 px-4">Role</th>
                        <th className="pb-4 px-4">Profile</th>
                        <th className="pb-4 pl-4 text-right">Redeemed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {couponUsers.map(user => (
                        <tr key={user.id} className="group">
                          <td className="py-5 pr-4">
                            <div className="flex flex-col">
                              <span className="font-black text-white text-[15px]">{user.full_name}</span>
                              <span className="text-xs text-gray-500 font-semibold">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-5 px-4 capitalize">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                              {user.user_type}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            {user.is_profile_complete ? (
                              <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                                <CheckCircle2 size={12} /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-yellow-500 text-[10px] font-black uppercase">
                                <AlertTriangle size={12} /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-5 pl-4 text-right text-[11px] font-bold text-gray-500">
                            {new Date(user.redeemed_at).toLocaleString("en-IN", {
                              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/10 flex justify-end">
               <button 
                onClick={() => setSelectedCoupon(null)}
                className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs hover:bg-gray-200 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWhatsApp;
