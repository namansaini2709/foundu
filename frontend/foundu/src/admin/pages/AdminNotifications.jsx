import { useState } from "react";
import AdminLayout from "../AdminLayout";

const inAppNotifications = [
  { title: "Welcome to FoundU! 🎉", trigger: "User signs up on the platform", triggerFile: "userController.js", type: "success", sentTo: "New User" },
  { title: "Profile Complete!", trigger: "Freelancer completes their profile", triggerFile: "freelancerProfileController.js", type: "success", sentTo: "Freelancer" },
  { title: "Profile Complete!", trigger: "Co-Founder completes their profile", triggerFile: "cofounderProfileController.js", type: "success", sentTo: "Co-Founder" },
  { title: "Profile Updated", trigger: "User uploads a profile picture", triggerFile: "usersSocialsController.js", type: "general", sentTo: "Any User" },
  { title: "Job Posted Successfully", trigger: "Founder posts a freelancer job", triggerFile: "jobController.js", type: "success", sentTo: "Founder" },
  { title: "Cofounder Request Posted", trigger: "Founder posts a co-founder role", triggerFile: "jobController.js", type: "job", sentTo: "Founder" },
  { title: "New Job Applicant", trigger: "Someone applies to a founder's job", triggerFile: "jobApplicantsController.js", type: "application", sentTo: "Job Owner (Founder)" },
  { title: "Application Submitted! 🚀", trigger: "Confirmation after applying to a job", triggerFile: "jobApplicantsController.js", type: "success", sentTo: "Applicant" },
  { title: "Application Updated", trigger: "Applicant status changed (accepted/rejected)", triggerFile: "jobApplicantsController.js", type: "application", sentTo: "Applicant" },
  { title: "Payment Successful! 💳", trigger: "Razorpay payment is verified", triggerFile: "paymentController.js", type: "success", sentTo: "Founder" },
  { title: "Payment Received! 💰", trigger: "Job completed, wallet credited to freelancer", triggerFile: "jobApplicantsController.js", type: "success", sentTo: "Freelancer" },
  { title: "New Review!", trigger: "Someone submits a review for you", triggerFile: "reviewController.js", type: "general", sentTo: "Reviewed User" },
  { title: "Blue Tick Earned! 🔵", trigger: "User identity is verified by admin", triggerFile: "badgeService.js", type: "badge", sentTo: "Verified User" },
  { title: "Gold Badge Earned! 🟡", trigger: "User reaches top performer status", triggerFile: "badgeService.js", type: "badge", sentTo: "Top Performer" },
  { title: "Green Badge Earned! 🟢", trigger: "User completes 3 jobs on FoundU", triggerFile: "badgeService.js", type: "badge", sentTo: "Reliable User" },
  { title: "Complete Your Profile", trigger: "Onboarding reminder if profile is incomplete", triggerFile: "onboardingReminderService.js", type: "reminder", sentTo: "Incomplete Profile Users" },
  { title: "Admin Broadcast", trigger: "Admin sends a custom broadcast message", triggerFile: "adminController.js", type: "broadcast", sentTo: "All / Selected Users" },
  { title: "Work Submitted", trigger: "Freelancer submits work for a sprint", triggerFile: "submissionController.js", type: "submission", sentTo: "Founder" },
  { title: "Submission Approved/Rejected", trigger: "Founder reviews a sprint submission", triggerFile: "submissionController.js", type: "submission", sentTo: "Freelancer" },
  { title: "New AI Matches Found", trigger: "AI matchmaker finds relevant job matches", triggerFile: "aiController.js", type: "ai", sentTo: "Freelancer / CoFounder" },
  { title: "Account Verified ✅", trigger: "Admin verifies a user account", triggerFile: "adminController.js", type: "admin", sentTo: "Verified User" },
  { title: "Account Rejected ❌", trigger: "Admin rejects a user verification", triggerFile: "adminController.js", type: "admin", sentTo: "Rejected User" },
  { title: "New Message 💬", trigger: "Someone sends you a message in the chatbox", triggerFile: "chatController.js", type: "message", sentTo: "Message Receiver" },
  { title: "Application Received 📥", trigger: "Influencer submits an application", triggerFile: "influencerController.js", type: "application", sentTo: "Admin" },
];

const emailNotifications = [
  { title: "Welcome to FoundU! 🎉", trigger: "User signs up on the platform", triggerFile: "userController.js", sentTo: "New User" },
  { title: "Your Job is Live! 🚀", trigger: "Founder posts a freelancer job", triggerFile: "jobController.js", sentTo: "Founder" },
  { title: "New Candidate Applied! 👤", trigger: "Someone applies to a founder's job", triggerFile: "jobApplicantsController.js", sentTo: "Job Owner (Founder)" },
  { title: "Application Received 🤝", trigger: "Confirmation email after applying", triggerFile: "jobApplicantsController.js", sentTo: "Applicant" },
  { title: "Application Status Update 📢", trigger: "Applicant status changed (accepted/rejected)", triggerFile: "jobApplicantsController.js", sentTo: "Applicant" },
  { title: "You Got a Review! ⭐", trigger: "Someone submits a review for you", triggerFile: "reviewController.js", sentTo: "Reviewed User" },
  { title: "Blue Tick Verified! 🔵", trigger: "User earns the Blue Tick badge", triggerFile: "badgeService.js", sentTo: "Verified User" },
  { title: "Gold Badge Earned! 🟡", trigger: "User earns the Gold Badge", triggerFile: "badgeService.js", sentTo: "Top Performer" },
  { title: "Green Badge Earned! 🟢", trigger: "User earns the Green Badge", triggerFile: "badgeService.js", sentTo: "Reliable User" },
  { title: "Complete Your Profile", trigger: "Onboarding reminder if profile incomplete", triggerFile: "onboardingReminderService.js", sentTo: "Incomplete Profile Users" },
  { title: "New AI Matches Found", trigger: "AI matchmaker finds matches for user", triggerFile: "aiMatchmakerJob.js", sentTo: "Freelancer / CoFounder" },
  { title: "Account Verified ✅", trigger: "Admin verifies a user account", triggerFile: "adminController.js", sentTo: "Verified User" },
  { title: "Account Rejected ❌", trigger: "Admin rejects a user verification", triggerFile: "adminController.js", sentTo: "Rejected User" },
  { title: "Admin Broadcast", trigger: "Admin sends a custom broadcast", triggerFile: "adminController.js", sentTo: "All / Selected Users" },
  { title: "You Have a New Message 💬", trigger: "Someone sends you a message in the chatbox", triggerFile: "chatController.js", sentTo: "Message Receiver" },
  { title: "Welcome to Influencer Marketplace! 🚀", trigger: "Admin accepts influencer application", triggerFile: "influencerController.js", sentTo: "Accepted Influencer" },
  { title: "Influencer Application Update 📢", trigger: "Admin rejects influencer application", triggerFile: "influencerController.js", sentTo: "Rejected Influencer" },
  { title: "You Have Unread Messages 💬", trigger: "User has 5+ unread messages (checked every 30 min)", triggerFile: "unreadMessageService.js", sentTo: "Users with 5+ Unread" },
];

const whatsappNotifications = [
  { title: "AI Match Alert 🤖", trigger: "AI matchmaker cron job finds new matches for a user", triggerFile: "aiMatchmakerJob.js", sentTo: "Users with WhatsApp number", message: "Hi {name}, we found {count} new matches for you on FoundU!" },
];

const ChannelBadge = ({ channel }) => {
  const config = {
    "in-app": { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30", icon: "🔔", label: "In-App" },
    email: { bg: "bg-green-500/20", text: "text-green-300", border: "border-green-500/30", icon: "📧", label: "Email" },
    whatsapp: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30", icon: "📱", label: "WhatsApp" },
  };
  const c = config[channel];
  return (
    <span className={`${c.bg} ${c.text} border ${c.border} px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit`}>
      {c.icon} {c.label}
    </span>
  );
};

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState("in-app");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "in-app", label: "In-App", icon: "🔔", count: inAppNotifications.length, color: "blue" },
    { id: "email", label: "Email", icon: "📧", count: emailNotifications.length, color: "green" },
    { id: "whatsapp", label: "WhatsApp", icon: "📱", count: whatsappNotifications.length, color: "emerald" },
  ];

  const getActiveData = () => {
    let data;
    switch (activeTab) {
      case "email": data = emailNotifications; break;
      case "whatsapp": data = whatsappNotifications; break;
      default: data = inAppNotifications;
    }
    if (searchTerm) {
      return data.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.sentTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return data;
  };

  const filteredData = getActiveData();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Notification Catalog</h1>
        <p className="text-gray-400 text-sm mt-1">
          Complete reference of all notifications, emails, and WhatsApp messages sent by FoundU.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/40 backdrop-blur-sm border border-blue-500/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">🔔</span>
            <span className="text-3xl font-black text-blue-300">{inAppNotifications.length}</span>
          </div>
          <p className="text-white font-semibold text-sm">In-App Notifications</p>
          <p className="text-gray-500 text-xs mt-0.5">Real-time via Socket.io</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-green-500/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📧</span>
            <span className="text-3xl font-black text-green-300">{emailNotifications.length}</span>
          </div>
          <p className="text-white font-semibold text-sm">Email Notifications</p>
          <p className="text-gray-500 text-xs mt-0.5">Via Nodemailer SMTP</p>
        </div>
        <div className="bg-gray-800/40 backdrop-blur-sm border border-emerald-500/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📱</span>
            <span className="text-3xl font-black text-emerald-300">{whatsappNotifications.length}</span>
          </div>
          <p className="text-white font-semibold text-sm">WhatsApp Messages</p>
          <p className="text-gray-500 text-xs mt-0.5">Via Twilio API</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                ? `bg-${tab.color}-600/30 text-${tab.color}-300 border border-${tab.color}-500/40`
                : "text-gray-400 hover:bg-gray-800/40 hover:text-white border border-transparent"
              }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-black ${activeTab === tab.id ? `bg-${tab.color}-500 text-white` : "bg-gray-700 text-gray-300"
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title, trigger, or recipient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800/40 border border-blue-900/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-800/30 border border-blue-900/30 rounded-xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest w-8">#</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Channel</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Title</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">When / Why (Trigger)</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Sent To</th>
                <th className="px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-widest">Source File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredData.map((notif, i) => (
                <tr key={i} className="hover:bg-gray-800/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono">{i + 1}</td>
                  <td className="px-4 py-3">
                    <ChannelBadge channel={activeTab} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white text-sm font-bold">{notif.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-400 text-sm">{notif.trigger}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-700/50 text-gray-300 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      {notif.sentTo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-blue-400/70 text-xs font-mono">{notif.triggerFile}</span>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
        <p className="text-blue-200 text-sm font-semibold mb-1">ℹ️ About this page</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          This is a static catalog of all notifications sent by the FoundU platform. It lists every In-App notification,
          Email, and WhatsApp message along with the trigger event and the backend file responsible for sending it.
          Use this as a quick reference to understand the notification system.
        </p>
      </div>
    </AdminLayout>
  );
}
