import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { getUserId, getUserType } from "./utils/authUtils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./pages/HomePage";
import InfluencerOnboarding from "./pages/InfluencerOnboarding";
import StartupDashboard from "./pages/StartupDashboard";
import JobDashboardFounder from "./pages/JobDashboardFounder";
import JobDashboardFreelancer from "./pages/JobDashboardFreelancer";
import StartupServices from "./pages/StartupServices";
import CoFounderProfile from "./pages/CoFounderProfile";
import FreelancerProfile from "./pages/FreelancerProfile";
import StartupProfile from "./pages/StartupProfile";
import FreelancerJobDetail from "./pages/FreelancerJobDetail";
import CoFounderJobs from "./pages/CoFounderJobs";
import CoFounderJobDetail from "./pages/CoFounderJobDetail";
import CoFounderDashboard from "./pages/CoFounderDashboard";
import LoginSignup from "./pages/LoginSignup";
import FreelancerJobs from "./pages/FreelancerJobs";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import PPolicy from "./pages/PPolicy";
import TermsOfService from "./pages/TermsOfService";
import CPolicy from "./pages/CPolicy";
import AddJobs from "./pages/AddJobs";
import ScrollToTop from "./components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import FreelancerBadges from "./pages/FreelancerBadges";
import CoFounderBadges from "./pages/CoFounderBadges";
import FounderBadges from "./pages/FounderBadges";
import Chatbox from "./pages/Chatbox";
import ViewJobPosting from "./pages/viewJobposting";
import SmartChatbot from "./pages/SmartChatbot";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminBadges from "./admin/pages/AdminBadges";
import AdminBroadcast from "./admin/pages/AdminBroadcast";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import AdminNotifications from "./admin/pages/AdminNotifications";
import AdminInfluencers from "./admin/pages/AdminInfluencers";
import AdminQueries from "./admin/pages/AdminQueries";
import AboutDetails from "./pages/AboutDetails";
import FreelancerReviews from "./pages/FreelancerReviews";
import LiveUserFeed from "./pages/LiveUserFeed";
import IdeaLabPopup from "./pages/IdeaLabPopup";

// import IdeaLab from "./pages/IdeaLab";
import QuickJobPopup from "./pages/QuickJobPopup";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";
import GlobalChatOverlay from "./pages/GlobalChatOverlay";
import InfluencerMarketplace from "./pages/InfluencerMarketplace";
import OurTeam from "./pages/OurTeam";
import ContactUs from "./pages/ContactUs";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";

function NavbarWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/admin/dashboard",
    "/admin/badges",
    "/admin/broadcast",
  ];
  // Note: /chatbox or others can be added here if needed to hide Navbar there
  if (
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }
  return <Navbar />;
}

function App() {
  const [authState, setAuthState] = useState({
    userId: getUserId(),
    userRole: getUserType(),
    isLoggedIn: !!getUserId(),
    isSyncing: localStorage.getItem('auth_sync_pending') === 'true'
  });

  // Listen for sync events from Navbar/LoginSignup
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        userId: getUserId(),
        userRole: getUserType(),
        isLoggedIn: !!getUserId(),
        isSyncing: localStorage.getItem('auth_sync_pending') === 'true'
      });
    };

    // Safety timeout: If syncing has been on for more than 5 seconds, clear it.
    let safetyTimeout;
    if (authState.isSyncing) {
      safetyTimeout = setTimeout(() => {
        console.warn("[Auth] Syncing timed out. Forcing app unlock.");
        localStorage.removeItem('auth_sync_pending');
        handleAuthChange();
      }, 5000);
    }

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      if (safetyTimeout) clearTimeout(safetyTimeout);
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [authState.isSyncing]);

  const { userId, userRole, isLoggedIn, isSyncing } = authState;
  const [activePopup, setActivePopup] = useState(null);

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-[#020024] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-blue-400 font-bold tracking-[0.2em] text-xs uppercase animate-pulse">
            Synchronizing Auth State...
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>

      <ScrollToTop />
      <NavbarWrapper />

      {/* ✅ GLOBAL TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboard-influencer" element={<InfluencerOnboarding />} />
        <Route path="/startup-dashboard" element={<StartupDashboard />} />
        <Route path="/job-dashboard/founder/:jobId/:freelancerId" element={<JobDashboardFounder />} />
        <Route path="/job-dashboard/freelancer/:jobId" element={<JobDashboardFreelancer />} />
        <Route path="/startup-services" element={<StartupServices />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/cofounder-profile" element={<CoFounderProfile />} />
        <Route path="/startup-profile" element={<StartupProfile />} />
        <Route path="/cofounder-jobs" element={<CoFounderJobs />} />
        <Route path="/cofounder-jobs/:id" element={<CoFounderJobDetail />} />
        <Route path="/cofounder-dashboard" element={<CoFounderDashboard />} />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/freelancer-jobs" element={<FreelancerJobs />} />
        <Route path="/job-description" element={<FreelancerJobDetail />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/privacy-policy" element={<PPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CPolicy />} />
        <Route path="/add-job" element={<AddJobs />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/freelancer-badges" element={<FreelancerBadges />} />
        <Route path="/cofounder-badges" element={<CoFounderBadges />} />
        <Route path="/founder-badges" element={<FounderBadges />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/jobposting" element={<ViewJobPosting />} />
        <Route path="/reviews" element={<FreelancerReviews />} />
        <Route path="/live-feed" element={<LiveUserFeed />} />
        <Route path="/create-post" element={<CreatePost />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/badges" element={<AdminBadges />} />
        <Route path="/admin/broadcast" element={<AdminBroadcast />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/influencers" element={<AdminInfluencers />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/queries" element={<AdminQueries />} />
        {/* <Route path="/idea-lab"        element={<IdeaLab />} /> */}

        <Route path="/about-details" element={<AboutDetails />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route
          path="/influencer-marketplace"
          element={<InfluencerMarketplace />}
        />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isLoggedIn && (
        <>
          <GlobalChatOverlay userId={userId} />
          <SmartChatbot userRole={userRole} userId={userId} activePopup={activePopup} setActivePopup={setActivePopup} />
          {(userRole === "founder" || userRole === "cofounder") && <IdeaLabPopup userId={userId} activePopup={activePopup} setActivePopup={setActivePopup} />}
          {userRole === "founder" && <QuickJobPopup userId={userId} activePopup={activePopup} setActivePopup={setActivePopup} />}
        </>
      )}
    </Router>
  );
}

export default App;
