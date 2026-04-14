import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Image as ImageIcon,
  Instagram,
  Mail,
  Users,
  Target,
  Zap,
  ArrowRight,
  TrendingUp,
  IndianRupee,
  Heart,
  Globe,
  Utensils,
  Dumbbell,
  Laptop,
  DollarSign,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE =
  (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

const InfluencerOnboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    other_category: "",
    full_name: "",
    instagram_url: "",
    followers_count: "",
    last_month_reach: "",
    email: "",
    phone_number: "",
    budget_range: "",
    reel_url: "",
    is_barter: "no",
  });
  const [photos, setPhotos] = useState({
    photo: null,
    banner: null,
  });

  const categories = [
    { id: "tech", label: "Tech", icon: <Laptop className="w-4 h-4" /> },
    {
      id: "lifestyle",
      label: "Lifestyle",
      icon: <Heart className="w-4 h-4" />,
    },
    { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
    { id: "travel", label: "Travel", icon: <Globe className="w-4 h-4" /> },
    { id: "beauty", label: "Beauty", icon: <Camera className="w-4 h-4" /> },
    { id: "other", label: "Other", icon: <Zap className="w-4 h-4" /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPhotos((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (!form.category) {
      toast.error("Please select a category.");
      setLoading(false);
      return;
    }
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (photos.photo) formData.append("photo", photos.photo);
    if (photos.banner) formData.append("banner", photos.banner);

    try {
      const res = await axios.post(`${API_BASE}/influencers/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (err) {
      console.error("Application error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit application.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 100%)",
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
            Influencer Marketplace
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight">
            ONBOARD AS AN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              INFLUENCER
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            We are building a zero-commission marketplace for micro-influencers.
            Help startups grow, showcase your reach, and keep 100% of your
            earnings.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/about-details"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Know more about FoundU <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-3xl bg-black border border-white/10 hover:border-blue-500/30 transition-all">
              <TrendingUp className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-black mb-4">FOR STARTUPS</h3>
              <p className="text-gray-400 leading-relaxed">
                FoundU helps early-stage startups find affordable, high-impact
                micro-influencers to kickstart their growth journey.
              </p>
            </div>
            <div className="p-10 rounded-3xl bg-black border border-white/10 hover:border-purple-500/30 transition-all">
              <DollarSign className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-black mb-4">NO COMMISSION</h3>
              <p className="text-gray-400 leading-relaxed">
                Unlike other platforms, we don't take a cut. FoundU facilitates
                the connection, and you handle the business directly.
              </p>
            </div>
            <div className="p-10 rounded-3xl bg-black border border-white/10 hover:border-indigo-500/30 transition-all">
              <Zap className="w-12 h-12 text-indigo-400 mb-6" />
              <h3 className="text-2xl font-black mb-4">FAST ONBOARDING</h3>
              <p className="text-gray-400 leading-relaxed">
                Post a reel about FoundU, submit your details, and get listed in
                our marketplace once reviewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 relative" id="apply">
        <div className="max-w-6xl w-[75%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              SUBMIT YOUR REEL
            </h2>
            <p className="text-gray-400 text-lg font-medium">
              Join our exclusive network of creators. Fill out the details
              below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, category: cat.id }))
                      }
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                        form.category === cat.id
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="category"
                  value={form.category}
                  required
                />
                {form.category === "other" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      name="other_category"
                      value={form.other_category}
                      onChange={handleInputChange}
                      required={form.category === "other"}
                      placeholder="Specify your category"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your complete name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Instagram URL
                </label>
                <div className="relative">
                  <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="url"
                    name="instagram_url"
                    value={form.instagram_url}
                    onChange={handleInputChange}
                    required
                    placeholder="instagram.com/yourid"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Phone Number It won’t be shown on your public profile, we
                  respect your privacy ;
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number "
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Follower Count
                </label>
                <div className="relative">
                  <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="followers_count"
                    value={form.followers_count}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 15k+"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Last Month Reach
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    name="last_month_reach"
                    value={form.last_month_reach}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. 50k+"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    placeholder="contact@yourdomain.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Est. Budget Range
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                    ₹
                  </span>
                  <input
                    type="text"
                    name="budget_range"
                    value={form.budget_range}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. ₹5,000 - ₹15,000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Open for Barter Collab?
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_barter: "yes" }))}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border ${form.is_barter === "yes" ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, is_barter: "no" }))}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border ${form.is_barter === "no" ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  FoundU Promotion Reel Link
                </label>
                <div className="relative">
                  <InstaLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="url"
                    name="reel_url"
                    value={form.reel_url}
                    onChange={handleInputChange}
                    required
                    placeholder="Link to the reel you posted"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Profile Photo
                </label>
                <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all group flex flex-col items-center justify-center bg-white/[0.02]">
                  <input
                    type="file"
                    name="photo"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {photos.photo ? (
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-green-400 mx-auto mb-2" />
                      <p className="text-xs text-green-400 font-bold">
                        {photos.photo.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Upload Photo
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-blue-400 pl-2">
                  Marketplace Banner
                </label>
                <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all group flex flex-col items-center justify-center bg-white/[0.02]">
                  <input
                    type="file"
                    name="banner"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {photos.banner ? (
                    <div className="text-center">
                      <ImageIcon className="w-10 h-10 text-green-400 mx-auto mb-2" />
                      <p className="text-xs text-green-400 font-bold">
                        {photos.banner.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                        Upload Banner
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest transition-all ${
                loading
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:shadow-blue-600/30 hover:scale-[1.02]"
              }`}
            >
              {loading ? "Submitting..." : "Send Application"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const InstaLink = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default InfluencerOnboarding;
