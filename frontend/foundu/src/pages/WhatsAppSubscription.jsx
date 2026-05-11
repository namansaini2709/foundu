import { useState, useEffect } from "react";
import {
  MessageCircle, CheckCircle2, Tag, ArrowRight,
  Loader2, AlertCircle, Lock, ShieldCheck, Bell,
  Users, Star, Zap
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PLANS = [
  { id: "monthly",   label: "Monthly",   days: 30,  price: 49,  save: null },
  { id: "quarterly", label: "Quarterly", days: 90,  price: 139, save: "5%" },
  { id: "6months",   label: "6 Months",  days: 180, price: 249, save: "15%" },
  { id: "yearly",    label: "Yearly",    days: 365, price: 449, save: "24%" },
];

const FEATURES = [
  "Automatic Best Match Alerts sent to you daily.",
  "Personalized for Founders, Co-founders, and Freelancers.",
  "Curated by FoundU AI based on your profile & requirements.",
  "Zero clutter—just high-impact opportunities on the go.",
];

const WhatsAppSubscription = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const plan = PLANS.find(p => p.id === selectedPlan);
  const isActive = subStatus?.whatsapp_subscription === 1;
  const profileIncomplete = subStatus &&
    (!subStatus.is_profile_complete || String(subStatus.is_profile_complete) === "0");

  useEffect(() => {
    if (!userId) { setStatusLoading(false); return; }
    api.get(`/api/whatsapp/status/${userId}`)
      .then(res => { if (res.data.success) setSubStatus(res.data.data); })
      .catch(e => console.error("WA status fetch error:", e))
      .finally(() => setStatusLoading(false));
  }, [userId]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Please enter a coupon code."); return; }
    if (!userId) { toast.error("Please login first."); navigate("/login-signup"); return; }
    setCouponLoading(true);
    try {
      const res = await api.post("/api/whatsapp/apply-coupon", {
        user_id: Number(userId),
        coupon_code: couponCode.trim().toUpperCase()
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const statusRes = await api.get(`/api/whatsapp/status/${userId}`);
        if (statusRes.data.success) setSubStatus(statusRes.data.data);
        setCouponCode("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleBuySubscription = () => {
    if (!userId) { navigate("/login-signup"); return; }
    if (isActive) { toast.info("You already have an active subscription!"); return; }
    if (profileIncomplete) {
      toast.warning("Please complete your profile first!");
      navigate("/profile");
      return;
    }
    toast.info("💳 Online payment is coming soon! Use a coupon code for free access.", {
      autoClose: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      <Navbar />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-green-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-700/7 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* ── HEADER ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-600/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase mb-6">
            <MessageCircle size={14} />
            WhatsApp AI Alerts
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-4">
            Never Miss an{" "}
            <span className="text-[#25d366]">Opportunity</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Get AI-curated job matches delivered directly to your WhatsApp every day.
          </p>
        </div>

        {/* ── ACTIVE BANNER ── */}
        {!statusLoading && isActive && (
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/25 rounded-2xl px-6 py-4 mb-8">
            <ShieldCheck size={22} className="text-green-400 shrink-0" />
            <div>
              <div className="font-bold text-green-400 mb-1">✅ WhatsApp Alerts Active!</div>
              <div className="text-sm text-green-300/80">
                Plan: <strong>{subStatus.whatsapp_plan}</strong> ·
                Via: <strong>{subStatus.whatsapp_activated_via}</strong> ·
                Expires: <strong>{subStatus.whatsapp_expires_at
                  ? new Date(subStatus.whatsapp_expires_at).toLocaleDateString("en-IN")
                  : "N/A"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE INCOMPLETE WARNING ── */}
        {!statusLoading && profileIncomplete && !isActive && (
          <div className="flex items-start gap-4 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl px-6 py-4 mb-8 text-yellow-300">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="text-sm">
              <strong>Profile Incomplete!</strong> Complete your profile first to activate WhatsApp alerts.{" "}
              <button onClick={() => navigate("/profile")} className="underline font-bold">
                Complete Profile →
              </button>
            </div>
          </div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* LEFT */}
          <div>
            {/* WhatsApp Demo Chat */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
              <div className="flex gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-[#25d366]/50" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="self-start max-w-[88%] bg-[#25d366]/10 border border-[#25d366]/20 text-green-100 text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed">
                  👋 Hi! Here are today's top opportunities from FoundU AI:
                </div>
                <div className="self-start max-w-[88%] bg-[#25d366]/10 border border-[#25d366]/20 text-green-100 text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed">
                  1. <strong>React Developer</strong> @ Fintech Startup<br />
                  💡 Matches your Full Stack skills.<br /><br />
                  2. <strong>Marketing Co-founder</strong> @ EdTech<br />
                  💡 Perfect for your growth background.
                </div>
                <div className="self-start max-w-[88%] bg-[#25d366]/10 border border-[#25d366]/20 text-green-100 text-sm px-4 py-3 rounded-2xl rounded-tl-sm">
                  🔗 View all: <strong>foundu.in/jobs</strong>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 mb-8">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-[15px]">
                  <CheckCircle2 size={18} className="text-[#25d366] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Users size={18} />, val: "500+",  label: "Subscribers" },
                { icon: <Bell size={18} />,  val: "Daily", label: "Alerts" },
                { icon: <Star size={18} />,  val: "4.9★",  label: "User Rating" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-xl text-[#25d366]">
                  {s.icon}
                  <div>
                    <div className="text-white font-extrabold text-base leading-none">{s.val}</div>
                    <div className="text-gray-500 text-xs font-semibold mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRICING CARD */}
          <aside className="lg:sticky lg:top-28">
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

              <h3 className="text-xl font-extrabold mb-6">Choose Your Plan</h3>

              {/* Plan Pills */}
              <div className="grid grid-cols-2 gap-3 mb-7">
                {PLANS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`flex flex-col items-center gap-1 py-3.5 px-3 rounded-2xl border text-sm font-bold transition-all duration-200
                      ${selectedPlan === p.id
                        ? "bg-[#25d366]/12 border-[#25d366] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-[#25d366]/50 hover:text-white"
                      }`}
                  >
                    <span>{p.label}</span>
                    {p.save && (
                      <span className="text-[10px] font-extrabold bg-green-700 text-white px-2 py-0.5 rounded-full">
                        Save {p.save}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-white/10 pt-5 mb-6">
                <div className="flex items-baseline gap-2">
                  {isActive ? (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{plan.price}</span>
                      <span className="text-4xl font-black text-[#25d366]">₹0</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-white">₹{plan.price}</span>
                  )}
                  <span className="text-sm text-gray-500 font-semibold">
                    {isActive ? " / Free for you" : `/ ${plan.label.toLowerCase()}`}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuySubscription}
                className="w-full py-4 rounded-2xl font-extrabold text-[15px] flex items-center justify-center gap-2.5 mb-6 transition-all duration-200 bg-gradient-to-r from-[#25d366] to-[#16a34a] text-white hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
              >
                Buy Subscription <ArrowRight size={18} />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-gray-600 text-xs font-bold mb-5">
                <div className="flex-1 h-px bg-white/8" />
                OR
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Coupon Code */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                  <Tag size={14} />
                  Have a Coupon Code?
                </label>
                <div className="flex gap-2 relative z-20">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                    placeholder="e.g. FOUNDU2025"
                    className="flex-1 bg-white/[0.08] border border-white/20 rounded-xl px-4 py-3 text-white text-sm font-bold tracking-wider outline-none focus:border-[#25d366] transition-all placeholder:text-gray-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-[#25d366] hover:bg-[#16a34a] disabled:opacity-50 text-white px-5 py-3 rounded-xl font-extrabold text-sm transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    {couponLoading ? <Loader2 size={15} className="animate-spin" /> : "Apply"}
                  </button>
                </div>

                {isActive && (
                  <p className="text-xs text-green-500 mt-2">✅ Your subscription is already active!</p>
                )}
                {profileIncomplete && !isActive && (
                  <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1.5">
                    <Lock size={11} /> Complete your profile first to use a coupon.
                  </p>
                )}
              </div>

              <p className="text-[11px] text-gray-600 text-center font-semibold leading-relaxed">
                🔒 Secure · Daily WhatsApp alerts · Cancel via dashboard
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhatsAppSubscription;
