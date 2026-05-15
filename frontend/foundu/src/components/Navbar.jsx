import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import {
  Bell,
  PlusSquare,
  MessageSquare,
  ChevronDown,
  Users,
  Megaphone,
  ShoppingCart,
  Award,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../socket";
import { getUserId, getUserType, logout } from "../utils/authUtils";
import logo from "../assets/whitelogo.png";

const SearchBar = ({ navigate }) => {
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/search?q=${q}`);
      }}
      className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-blue-500/50 transition-all group"
    >
      <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-400" />
      <input
        type="text"
        placeholder="Search users..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="bg-transparent border-none outline-none text-xs text-white px-2 w-32 focus:w-44 transition-all placeholder:text-gray-600"
      />
    </form>
  );
};

// Default links for non-logged-in users
const defaultNavLinks = [
  { label: "Hire Freelancer", to: "/freelancer-jobs" },
  { label: "Onboard Influencer", to: "/onboard-influencer" },
  { label: "Find Best Match", to: "/login-signup" },
  { label: "For Startups", to: "/startup-services" },
  { label: "About Us", to: "/about-details" },
];

// Links based on user type
const userTypeLinks = {
  founder: [
    { label: "Dashboard", to: "/startup-dashboard" },
    { label: "Our Services", to: "/startup-services" },
    { label: "Add a New Job", to: "/add-job" },
    { label: "Idea Lab", to: "/idea-lab" },
    { label: "Live Feed", to: "/live-feed" },
    { label: "Agencies", to: "/agencies" },
  ],
  freelancer: [
    { label: "View Jobs", to: "/freelancer-jobs" },
    { label: "Dashboard", to: "/freelancer-dashboard" },
    { label: "Live Feed", to: "/live-feed" },
    { label: "Badges", to: "/freelancer-badges" },
    { label: "Agencies", to: "/agencies" },
    { label: "Reviews & Ratings", to: "/reviews" },
  ],
  cofounder: [
    { label: "Dashboard", to: "/cofounder-dashboard" },
    { label: "View Jobs", to: "/cofounder-jobs" },
    // { label: "Idea Lab", to: "/idea-lab" },
    { label: "Live Feed", to: "/live-feed" },
    { label: "Badges", to: "/cofounder-badges" },
    { label: "Agencies", to: "/agencies" },
    { label: "Reviews & Ratings", to: "/reviews" },
  ],
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const marketplaceRef = useRef(null);
  // Fetch user data if logged in
  useEffect(() => {
    const isPending =
      localStorage.getItem("auth_sync_pending") === "true" ||
      sessionStorage.getItem("auth_sync_pending") === "true";

    const fetchUserProfile = async () => {
      try {
        // Special case: Admin user
        const isUserAdmin = String(localStorage.getItem("is_admin")) === "true";
        if (isUserAdmin) {
          const adminName = localStorage.getItem("admin_name") || "Admin";
          setUser({ full_name: adminName, isAdmin: true, user_type: "admin" });
          setLoading(false);
          return;
        }

        // Check if we are already logged in via localStorage
        let userId = getUserId();

        // If we are pending an auth sync, WE MUST fetch /api/me to bridge the cookie session
        if (!userId || isPending) {
          try {
            const meRes = await api.get("/api/me");
            if (meRes.data.success && meRes.data.data) {
              const u = meRes.data.data;
              userId = String(u.id);
              setUser(u);

              localStorage.setItem("user_id", userId);
              localStorage.setItem("user_type", u.user_type);
              if (u.full_name) localStorage.setItem("user_name", u.full_name);
            }
          } catch (e) {
            console.warn("[Auth] /api/me failed or no cookie present.");
          }
        }

        if (isPending) {
          localStorage.removeItem("auth_sync_pending");
          sessionStorage.removeItem("auth_sync_pending");
          window.dispatchEvent(new Event("auth-change"));
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        // If we don't have user data yet (got userId from localStorage), fetch it
        if (!user) {
          const response = await api.get(`/api/users/${userId}`);
          const userData = response.data.success
            ? response.data.data
            : response.data;
          setUser(userData);
        }

        // Connect Socket for notifications
        socket.connect();
        socket.emit("register", userId);

        // Get initial unread count (Notifications)
        const notifRes = await api.get(`/api/notifications`);
        if (notifRes.data.success && Array.isArray(notifRes.data.data)) {
          setUnreadCount(notifRes.data.data.filter((n) => !n.is_read).length);
        }

        // Get initial unread count (Messages)
        try {
          const chatRes = await api.get(`/api/chat/total-unread`);
          setUnreadMessagesCount(chatRes.data.total || 0);
        } catch (e) {
          console.warn("[Chat] Could not fetch unread count.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          setUser(null);
        }
      }

      setLoading(false);
    };

    fetchUserProfile();

    // Listen for live socket notifications
    const handleNewNotification = (notification) => {
      setUnreadCount((prev) => prev + 1);
      toast.info(`🔔 ${notification.title}`, { theme: "dark" });
    };

    socket.on("new_notification", handleNewNotification);

    // Also listen for new messages via socket to update global count
    const handleNewMessage = () => {
      setUnreadMessagesCount((prev) => prev + 1);
    };
    socket.on("new_message_global", handleNewMessage);

    // Listen for read events from Notifications page
    const handleRead = () => {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };
    window.addEventListener("notification_read", handleRead);

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("new_message_global", handleNewMessage);
      window.removeEventListener("notification_read", handleRead);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  // Handle outside clicks for Marketplaces dropdown
  useEffect(() => {
    const handleMarketplaceClickOutside = (e) => {
      if (
        marketplaceRef.current &&
        !marketplaceRef.current.contains(e.target)
      ) {
        setIsMarketplaceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMarketplaceClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleMarketplaceClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      toast.info("Logging out...", { theme: "dark" });
      await api.post(`/api/logout`);
      logout();
      setUser(null);
      setUnreadCount(0);
      socket.disconnect();
      toast.success("Logged out successfully!", { theme: "dark" });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Error logging out:", error);
      logout();
      setUser(null);
      toast.success("Logged out successfully!", { theme: "dark" });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);

    try {
      toast.info("Deleting account...", { theme: "dark" });
      const userId = getUserId();
      await api.delete(`/api/users/${userId}`);
      logout();
      setUser(null);

      toast.success("Account deleted successfully!", { theme: "dark" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.", {
        theme: "dark",
      });
    }
  };

  const getProfileRoute = () => {
    const userType = getUserType();
    if (!userType) return "/";

    switch (userType.toLowerCase()) {
      case "freelancer":
        return "/freelancer-profile";
      case "founder":
        return "/startup-profile";
      case "cofounder":
        return "/cofounder-profile";
      default:
        return "/";
    }
  };

  const getDashboardRoute = () => {
    const userType = getUserType();
    if (!userType) return "/";

    switch (userType.toLowerCase()) {
      case "freelancer":
        return "/freelancer-dashboard";
      case "founder":
        return "/startup-dashboard";
      case "cofounder":
        return "/cofounder-dashboard";
      default:
        return "/";
    }
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.full_name || user.name || user.email || "User";
  };

  const isLoggedIn = () => !!getUserId();

  const handleProfileNavigation = () => {
    const route = getProfileRoute();
    const userType = getUserType();
    const userTypeDisplay =
      userType === "founder"
        ? "Startup"
        : userType
          ? userType.charAt(0).toUpperCase() + userType.slice(1)
          : "Guest";

    toast.info(`Redirecting to ${userTypeDisplay} Profile...`, {
      theme: "dark",
      autoClose: 1000,
    });

    setTimeout(() => {
      navigate(route);
    }, 1000);
  };

  const handleDashboardNavigation = () => {
    const route = getDashboardRoute();
    const userType = getUserType();
    const userTypeDisplay =
      userType === "founder"
        ? "Startup"
        : userType
          ? userType.charAt(0).toUpperCase() + userType.slice(1)
          : "Guest";

    toast.info(`Redirecting to ${userTypeDisplay} Dashboard...`, {
      theme: "dark",
      autoClose: 1000,
    });

    setTimeout(() => {
      navigate(route);
    }, 1000);
  };

  // Get navigation links based on user type
  const getNavLinks = () => {
    const userType = (getUserType() || "").toLowerCase();

    if (!userType || !isLoggedIn()) {
      return defaultNavLinks;
    }

    return userTypeLinks[userType] || defaultNavLinks;
  };

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="transition-all duration-300 bg-transparent border-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 animate-pulse bg-blue-500/20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`transition-all duration-500 ${
          scrolled || isOpen
            ? "bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-transparent border-transparent"
        } hover:bg-white/[0.08] hover:backdrop-blur-2xl transition-all duration-500`}
      >
        <div className="w-full px-2 sm:px-4 lg:px-6 py-0 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Navigation links shifted to the right */}
          <div className="hidden md:flex items-center gap-5 ml-auto">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-blue-300"
                    : "text-white hover:text-blue-300"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Marketplace Dropdown for All User Types */}
            {isLoggedIn() && (
              <div className="relative" ref={marketplaceRef}>
                <button
                  onMouseEnter={() => setIsMarketplaceOpen(true)}
                  className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                    isMarketplaceOpen ||
                    location.pathname.includes("marketplace")
                      ? "text-blue-400"
                      : "text-white hover:text-blue-400"
                  }`}
                >
                  Marketplaces
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isMarketplaceOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMarketplaceOpen && (
                  <div
                    onMouseLeave={() => setIsMarketplaceOpen(false)}
                    className="absolute top-full right-0 mt-4 w-64 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/influencer-marketplace"
                        onClick={() => setIsMarketplaceOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-tighter">
                          Influencers
                        </span>
                      </Link>

                      <Link
                        to="/event-marketplace"
                        onClick={() => setIsMarketplaceOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/10 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                          <Megaphone className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-tighter">
                          Events
                        </span>
                      </Link>

                      <div className="relative group/blocked">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 opacity-40 cursor-not-allowed">
                          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center text-gray-500">
                            <ShoppingCart className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                            Vendors
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/blocked:opacity-100 transition-opacity">
                          <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User profile or login buttons */}
          <div className="flex items-center gap-4 ml-8">
            {(isLoggedIn() || user) && getUserType() !== "founder" && (
              <SearchBar navigate={navigate} />
            )}

            {(isLoggedIn() || user) && (
              <Link
                to="/notifications"
                className="relative p-2 text-gray-400 hover:text-white transition-all duration-300 group"
              >
                <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-black">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {(isLoggedIn() || user) && (
              <Link
                to="/create-post"
                className="p-2 text-gray-400 hover:text-white transition-all duration-300 group"
                title="Create Post"
              >
                <PlusSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Link>
            )}

            {isLoggedIn() || user ? (
              // Logged in user - show profile dropdown
              <div className="relative profile-dropdown">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 bg-blue-500/20 border border-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-all duration-300"
                >
                  {user &&
                  user.blue_tick_verified &&
                  user.profile_picture_url ? (
                    <img
                      src={
                        user.profile_picture_url.startsWith("http")
                          ? user.profile_picture_url
                          : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}${user.profile_picture_url}`
                      }
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-400/50 flex items-center justify-center overflow-hidden">
                      <svg
                        className="w-5 h-5 text-blue-300 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  <span className="hidden sm:inline max-w-[150px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-blue-700/30 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleProfileNavigation}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-blue-600/20 transition-colors w-full text-left"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        User Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/live-feed?view=my-posts")}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-blue-600/20 transition-colors w-full text-left"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        View all post
                      </button>

                      <button
                        type="button"
                        onClick={handleDashboardNavigation}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-blue-600/20 transition-colors w-full text-left"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        Dashboard
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-blue-600/20 transition-colors text-left"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>

                      {getUserType() === "founder" && (
                        <button
                          type="button"
                          onClick={() => navigate("/founder-badges")}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-blue-400 font-bold hover:bg-blue-600/20 transition-colors w-full text-left border-t border-blue-700/10"
                        >
                          <Award className="w-5 h-5" />
                          Founder Badges
                        </button>
                      )}

                      {/* <div className="border-t border-blue-700/30">
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-600/20 transition-colors text-left"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Account
                        </button>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - show login/signup buttons
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login-signup")}
                  className="hidden sm:inline-flex bg-transparent border border-blue-400 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/20 transition-all duration-300"
                >
                  Log in
                </button>
              </>
            )}

            {/* Mobile hamburger menu */}
            <button
              type="button"
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-blue-700/30 bg-black/70 backdrop-blur-md">
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium ${
                    location.pathname === link.to
                      ? "text-blue-300"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn() || user ? (
                // Mobile - Logged in user menu
                <>
                  <div className="border-t border-blue-700/30 pt-3 mt-2">
                    <div className="text-xs text-blue-300 mb-2">
                      {getUserDisplayName()}
                    </div>
                    <button
                      type="button"
                      onClick={handleProfileNavigation}
                      className="flex items-center gap-3 py-2 text-sm text-white w-full text-left"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      User Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleDashboardNavigation}
                      className="flex items-center gap-3 py-2 text-sm text-white w-full text-left"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-2 text-sm text-white w-full text-left"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-3 py-2 text-sm text-red-400 w-full text-left"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Account
                    </button> */}
                  </div>
                </>
              ) : (
                // Mobile - Not logged in
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/login-signup")}
                    className="flex-1 bg-transparent border border-blue-400 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/20 transition-all duration-300"
                  >
                    Log in
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-red-500/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-3">
              Delete Account
            </h3>

            <p className="text-gray-300 text-center mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container removed - now global in App.jsx */}
    </nav>
  );
}

export default Navbar;
