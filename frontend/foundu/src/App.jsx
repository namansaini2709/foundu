import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import StartupDashboard from './pages/StartupDashboard'
import StartupServices from './pages/StartupServices'
import CoFounderProfile from './pages/CoFounderProfile'
import FreelancerProfile from './pages/FreelancerProfile'
import StartupProfile from './pages/StartupProfile'
import FreelancerJobDetail from './pages/FreelancerJobDetail'
import CoFounderJobs from './pages/CoFounderJobs'
import CoFounderJobDetail from './pages/CoFounderJobDetail'
import CoFounderDashboard from './pages/CoFounderDashboard'
import UserTypeSelection from './pages/UserTypeSelection'
import LoginSignup from './pages/LoginSignup'
import FreelancerJobs from './pages/FreelancerJobs'
import FreelancerDashboard from './pages/FreelancerDashboard'
import PPolicy from './pages/PPolicy'
import TermsOfService from './pages/TermsOfService'
import CPolicy from './pages/CPolicy'
import AddJobs from './pages/AddJobs'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
    <ScrollToTop />

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



      </Routes>
    </Router>
  )
}

export default App
   