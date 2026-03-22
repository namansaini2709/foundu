import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api";

const navItems = [
  { label: "Dashboard",   icon: "📊", path: "/admin/dashboard" },
  { label: "Broadcast",   icon: "📣", path: "/admin/broadcast" },
  { label: "Blue Tick",   icon: "✅", path: "/admin/badges",   badge: true },
  { label: "Users",       icon: "👥", path: "/admin/users",    soon: true },
  { label: "Jobs",        icon: "💼", path: "/admin/jobs",     soon: true },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const adminName = localStorage.getItem("admin_name") || "Admin";
  const isAdmin   = localStorage.getItem("is_admin") === "true";
  const [pendingCount, setPendingCount] = useState(0);

  // Guard — redirect non-admins away
  useEffect(() => {
    if (!isAdmin) navigate("/login-signup");
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    axios
      .get(`${API}/admin/dashboard/stats`, { withCredentials: true })
      .then((r) => setPendingCount(r.data.stats?.pendingBlueTickRequests || 0))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("is_admin");
    localStorage.removeItem("admin_name");
    navigate("/login-signup");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(180deg,rgba(2,0,36,1) 0%,rgba(9,9,121,0.85) 100%)" }}
    >
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 flex flex-col bg-gray-900/50 border-r border-blue-900/40 backdrop-blur-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-blue-900/30">
          <div className="text-2xl font-black text-white tracking-widest">
            FOUND<span className="text-blue-400">U</span>
          </div>
          <p className="text-blue-400/70 text-xs font-semibold tracking-widest uppercase mt-0.5">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.soon ? "#" : item.path}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                    : "text-gray-400 hover:bg-blue-900/20 hover:text-white"
                  }
                  ${item.soon ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <span className="flex items-center gap-2.5">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge && pendingCount > 0 && (
                  <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
                {item.soon && (
                  <span className="text-xs text-gray-600 font-normal">Soon</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div className="px-4 py-4 border-t border-blue-900/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {adminName[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">{adminName}</p>
              <p className="text-gray-500 text-xs mt-0.5">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-2 px-1 transition-colors"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="px-8 py-4 border-b border-blue-900/30 bg-gray-900/20 backdrop-blur-sm flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold">System Online</span>
          </div>
        </header>

        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
