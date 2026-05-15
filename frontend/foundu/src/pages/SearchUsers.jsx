import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axiosConfig";
import { Search, User, Shield, Zap, Award, ArrowRight, X, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SearchUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
    filterUsers(q, users);
  }, [searchParams, users]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
      filterUsers(query, res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (q, allUsers) => {
    if (!q) {
      setFilteredUsers(allUsers);
      return;
    }
    const lowerQ = q.toLowerCase();
    const filtered = allUsers.filter(u => 
      u.full_name?.toLowerCase().includes(lowerQ) ||
      u.professional_role?.toLowerCase().includes(lowerQ) ||
      u.user_type?.toLowerCase().includes(lowerQ)
    );
    setFilteredUsers(filtered);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams({ q: val });
  };

  const handleUserClick = (user) => {
    if (user.user_type === "founder") {
      navigate(`/startup-profile?id=${user.id}`);
    } else if (user.user_type === "freelancer") {
      navigate(`/freelancer-profile?id=${user.id}`);
    } else if (user.user_type === "cofounder") {
      navigate(`/cofounder-profile?id=${user.id}`);
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "founder": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "freelancer": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "cofounder": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">


      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
            Search the <span className="text-blue-500 not-italic">Ecosystem.</span>
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl group-focus-within:border-blue-500/50 transition-all">
              <Search className="w-6 h-6 ml-6 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, role, or talent type..."
                value={query}
                onChange={handleSearch}
                className="w-full bg-transparent px-6 py-6 text-lg focus:outline-none placeholder:text-gray-600"
              />
              {query && (
                <button onClick={() => { setQuery(""); setSearchParams({}); }} className="mr-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Accessing Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleUserClick(u)}
                  className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 cursor-pointer hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      {u.profile_picture_url ? (
                        <img
                          src={u.profile_picture_url.startsWith('http') ? u.profile_picture_url : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${u.profile_picture_url}`}
                          alt={u.full_name}
                          className="w-20 h-20 rounded-3xl object-cover border-2 border-white/10 group-hover:border-blue-500/50 transition-colors"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border-2 border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                          <User className="w-10 h-10 text-blue-400/50" />
                        </div>
                      )}
                      {(u.blue_tick_verified || u.golden_tick_verified) && (
                        <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/10 shadow-xl">
                          <Shield className={`w-5 h-5 ${u.golden_tick_verified ? 'text-yellow-400' : 'text-blue-400'}`} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getBadgeColor(u.user_type)}`}>
                      {u.user_type}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase group-hover:text-blue-400 transition-colors">
                    {u.full_name}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium mb-8 line-clamp-1 italic">
                    {u.professional_role || `Elite ${u.user_type}`}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Score: {u.credibility_score || 0}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                      View Profile <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">No users found</h3>
                <p className="text-gray-500 font-medium">Try searching with a different keyword or talent type.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
