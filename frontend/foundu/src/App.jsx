import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./pages/HomePage";
import StartupDashboard from "./pages/StartupDashboard";
import StartupServices from "./pages/StartupServices";
import CoFounderProfile from "./pages/CoFounderProfile";
import FreelancerProfile from "./pages/FreelancerProfile";
import StartupProfile from "./pages/StartupProfile";
import FreelancerJobDetail from "./pages/FreelancerJobDetail";
import CoFounderJobs from "./pages/CoFounderJobs";
import CoFounderJobDetail from "./pages/CoFounderJobDetail";
import CoFounderDashboard from "./pages/CoFounderDashboard";
import UserTypeSelection from "./pages/UserTypeSelection";
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
<<<<<<< HEAD
import JobApplicationsDashboard from "./pages/viewJobposting";
import SmartChatbot from "./pages/SmartChatbot";
=======
import ViewJobPosting from "./pages/ViewJobPosting";
import SmartChatbot from "./pages/SmartChatbot";

>>>>>>> origin

function App() {
  const userRole   = localStorage.getItem("user_type") || null;
  const userId     = localStorage.getItem("user_id")   || null;
  const isLoggedIn = !!userId;
<<<<<<< HEAD

=======
>>>>>>> origin
  return (
    <Router>
      <ScrollToTop />

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
        <Route path="/startup-dashboard" element={<StartupDashboard />} />
        <Route path="/startup-services" element={<StartupServices />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/cofounder-profile" element={<CoFounderProfile />} />
        <Route path="/startup-profile" element={<StartupProfile />} />
        <Route path="/cofounder-jobs" element={<CoFounderJobs />} />
        <Route path="/cofounder-jobs/:id" element={<CoFounderJobDetail />} />
        <Route path="/cofounder-dashboard" element={<CoFounderDashboard />} />
        <Route path="/signup" element={<UserTypeSelection />} />
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
<<<<<<< HEAD
        <Route path="/jobposting" element={<JobApplicationsDashboard />} />
      </Routes>

      {/* ✅ SMART AI CHATBOT — global, appears on all authenticated pages */}
      {isLoggedIn && (
        <SmartChatbot userRole={userRole} userId={userId} />
      )}
=======
        <Route path="/jobposting" element={<ViewJobPosting />} />
        
      </Routes>
        {isLoggedIn && (
        <SmartChatbot userRole={userRole} userId={userId} />
      )}

>>>>>>> origin
    </Router>
  );
}

export default App;
