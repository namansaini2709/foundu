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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/startup-dashboard" element={<StartupDashboard />} />
        <Route path="/startup-services" element={<StartupServices />} />
        <Route path="/freelancer-profile" element={<FreelancerProfile />} />
        <Route path="/cofounder-profile" element={<CoFounderProfile />} />
        <Route path="/startup-profile" element={<StartupProfile />} />
        <Route path="/cofounder-jobs" element={<CoFounderJobs />} />
        <Route path="/cofounder-jobs/:id" element={<CoFounderJobDetail />} />
        <Route path="/cofounderDashboard" element={<CoFounderDashboard />} />
        <Route path="/signup" element={<UserTypeSelection />} />
        <Route path="/login-signup" element={<LoginSignup />} />
        <Route path="/freelancer-jobs" element={<FreelancerJobs />} />
        <Route path="/job-description" element={<FreelancerJobDetail />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />

      </Routes>
    </Router>
  )
}

export default App
   