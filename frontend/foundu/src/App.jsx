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
import EventOnboarding from "./pages/EventOnboarding";
import AdminBadges from "./admin/pages/AdminBadges";
import AdminBroadcast from "./admin/pages/AdminBroadcast";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import AdminNotifications from "./admin/pages/AdminNotifications";
import AdminInfluencers from "./admin/pages/AdminInfluencers";
import AdminQueries from "./admin/pages/AdminQueries";
import AdminMeetings from "./admin/pages/AdminMeetings";
import AdminReferrals from "./admin/pages/AdminReferrals";
import AdminWhatsApp from "./admin/pages/AdminWhatsApp";
import AboutDetails from "./pages/AboutDetails";
import FreelancerReviews from "./pages/FreelancerReviews";
import LiveUserFeed from "./pages/LiveUserFeed";
import IdeaLabPopup from "./pages/IdeaLabPopup";
import IdeaLab from "./pages/IdeaLab";
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
import PitchDeckPurchase from "./pages/PitchDeckPurchase";
import EventPromotion from "./pages/EventPromotion";
import EventMarketplace from "./pages/EventMarketplace";
import EventDetail from "./pages/EventDetail";
import EventRegister from "./pages/EventRegister";
import AdminEvents from "./admin/pages/AdminEvents";
import StartupPortals from "./pages/StartupPortals";
import WhatsAppSubscription from "./pages/WhatsAppSubscription";
import WebDevelopment from "./pages/WebDevelopment";
import SmoothScroll from "./components/SmoothScroll";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthSyncSkeleton from "./components/AuthSyncSkeleton";
import InvestorConnect from "./pages/InvestorConnect";
import Agencies from "./pages/Agencies";
import SearchUsers from "./pages/SearchUsers";
import Profile from "./pages/Profile";

function NavbarWrapper({ setActivePopup }) {
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
  const [activePopup, setActivePopup] = useState(null);
  const [authState, setAuthState] = useState({
    userId: getUserId(),
    userRole: getUserType(),
    isLoggedIn: !!getUserId(),
    isSyncing: localStorage.getItem("auth_sync_pending") === "true",
  });

  // Listen for sync events from Navbar/LoginSignup
  useEffect(() => {
    const handleAuthChange = () => {
      setAuthState({
        userId: getUserId(),
        userRole: getUserType(),
        isLoggedIn: !!getUserId(),
        isSyncing: localStorage.getItem("auth_sync_pending") === "true",
      });
    };

    // Safety timeout: If syncing has been on for more than 5 seconds, clear it.
    let safetyTimeout;
    if (authState.isSyncing) {
      safetyTimeout = setTimeout(() => {
        console.warn("[Auth] Syncing timed out. Forcing app unlock.");
        localStorage.removeItem("auth_sync_pending");
        handleAuthChange();
      }, 5000);
    }

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      if (safetyTimeout) clearTimeout(safetyTimeout);
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [authState.isSyncing]);

  const { userId, userRole, isLoggedIn, isSyncing } = authState;

  if (isSyncing) {
    return <AuthSyncSkeleton />;
  }

  return (
    <Router>
      {/* ✅ GLOBAL TOAST CONTAINER - MOVED OUTSIDE SMOOTH SCROLL */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        limit={3}
      />

      <SmoothScroll>
        <NavbarWrapper />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/onboard-influencer"
            element={<InfluencerOnboarding />}
          />
          <Route
            path="/startup-dashboard"
            element={
              <ProtectedRoute allowedRole="founder">
                <StartupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-dashboard/founder/:jobId/:freelancerId"
            element={
              <ProtectedRoute allowedRole="founder">
                <JobDashboardFounder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-dashboard/freelancer/:jobId"
            element={
              <ProtectedRoute allowedRole="freelancer">
                <JobDashboardFreelancer />
              </ProtectedRoute>
            }
          />
          <Route path="/startup-services" element={<StartupServices />} />
          <Route
            path="/freelancer-profile"
            element={
              <ProtectedRoute>
                <FreelancerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cofounder-profile"
            element={
              <ProtectedRoute>
                <CoFounderProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/startup-profile"
            element={
              <ProtectedRoute>
                <StartupProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/cofounder-jobs" element={<CoFounderJobs />} />
          <Route path="/cofounder-jobs/:id" element={<CoFounderJobDetail />} />
          <Route
            path="/cofounder-dashboard"
            element={
              <ProtectedRoute allowedRole="cofounder">
                <CoFounderDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/freelancer-jobs" element={<FreelancerJobs />} />
          <Route path="/job-description" element={<FreelancerJobDetail />} />
          <Route
            path="/freelancer-dashboard"
            element={
              <ProtectedRoute allowedRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/event-onboarding" element={<EventOnboarding />} />
          <Route path="/privacy-policy" element={<PPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CPolicy />} />
          <Route
            path="/add-job"
            element={
              <ProtectedRoute allowedRole="founder">
                <AddJobs />
              </ProtectedRoute>
            }
          />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/freelancer-badges" element={<FreelancerBadges />} />
          <Route path="/cofounder-badges" element={<CoFounderBadges />} />
          <Route path="/founder-badges" element={<FounderBadges />} />
          <Route
            path="/chatbox"
            element={
              <ProtectedRoute>
                <Chatbox />
              </ProtectedRoute>
            }
          />
          <Route path="/jobposting" element={<ViewJobPosting />} />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <FreelancerReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live-feed"
            element={
              <ProtectedRoute>
                <LiveUserFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/broadcast" element={<AdminBroadcast />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/influencers" element={<AdminInfluencers />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/queries" element={<AdminQueries />} />
          <Route path="/admin/meetings" element={<AdminMeetings />} />
          <Route path="/admin/referrals" element={<AdminReferrals />} />
          <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route
            path="/idea-lab"
            element={
              <ProtectedRoute>
                <IdeaLabPopup userId={userId} />
              </ProtectedRoute>
            }
          />

          <Route path="/about-details" element={<AboutDetails />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="/startup-portals" element={<StartupPortals />} />
          <Route path="/web-development" element={<WebDevelopment />} />
          <Route
            path="/influencer-marketplace"
            element={<InfluencerMarketplace />}
          />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/buy-pitch-deck" element={<PitchDeckPurchase />} />
          <Route
            path="/whatsapp-subscription"
            element={<WhatsAppSubscription />}
          />
          <Route path="/promote-event" element={<EventPromotion />} />
          <Route path="/event-marketplace" element={<EventMarketplace />} />
          <Route path="/event-detail/:id" element={<EventDetail />} />
          <Route
            path="/event-register/:id"
            element={
              <ProtectedRoute>
                <EventRegister />
              </ProtectedRoute>
            }
          />
          <Route path="/investor-connect" element={<InvestorConnect />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/search" element={<SearchUsers />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isLoggedIn && <GlobalChatOverlay userId={userId} />}
        <SmartChatbot
          userRole={userRole}
          userId={userId}
          isLoggedIn={isLoggedIn}
          activePopup={activePopup}
          setActivePopup={setActivePopup}
        />
      </SmoothScroll>
    </Router>
  );
}

export default App;
