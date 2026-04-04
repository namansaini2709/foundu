import React from 'react'
import Footer from '../components/Footer'
import Navbar from "../components/Navbar";
import { Cookie, Settings, ShieldCheck, Database, ListFilter, HelpCircle, AlertCircle } from 'lucide-react'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
export default function CPolicy() {
  return (
    <div className="min-h-screen flex flex-col pt-20 overflow-x-hidden font-sans" style={gradientBlackToBlue}>
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center w-full z-10 px-4 md:px-0 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-6 shadow-xl shadow-blue-500/10">
            <Cookie className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Cookie <span className="text-blue-400 text-shadow-glow">Policy</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            We use cookies to enhance your journey through the Foundu ecosystem. This policy explains how and why we utilize these technologies.
          </p>
        </div>

        {/* Content Container - 85% Width */}
        <div 
          className="w-full md:w-[85%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient Glows */}
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/15 transition-colors duration-1000"></div>
          
          <div className="relative z-10 space-y-20 text-gray-300">
            
            {/* 1. What Are Cookies? */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-blue-400" />
                1. What Are Cookies?
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
                </p>
                <p>
                  "First-party cookies" are cookies set by us. "Third-party cookies" are cookies set by parties other than us. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., like advertising, interactive content, and analytics).
                </p>
              </div>
            </section>

            {/* 2. Categories of Cookies We Use */}
            <section className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <ListFilter className="w-8 h-8 text-blue-400" />
                2. Cookie Categories
              </h2>
              <div className="space-y-10">
                {[
                  { 
                    title: "Strictly Necessary Cookies", 
                    desc: "These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
                    icon: ShieldCheck
                  },
                  { 
                    title: "Performance & Analytics Cookies", 
                    desc: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.",
                    icon: Database
                  },
                  { 
                    title: "Functional Cookies", 
                    desc: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers.",
                    icon: Settings
                  }
                ].map((cat, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                    <div className="p-3 bg-blue-500/10 rounded-xl h-fit border border-blue-500/20">
                      <cat.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                      <p className="text-md leading-relaxed text-gray-400">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Why We Use Cookies */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
                3. Purpose of Collection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg leading-relaxed">
                <div className="p-8 bg-gradient-to-br from-blue-600/5 to-transparent rounded-3xl border border-white/5">
                  <h4 className="text-blue-300 font-bold mb-3 uppercase tracking-tight text-sm">Authentication</h4>
                  <p>Keeping you logged in as you move between pages and ensuring your session remains secure and personalized.</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-indigo-600/5 to-transparent rounded-3xl border border-white/5">
                  <h4 className="text-indigo-300 font-bold mb-3 uppercase tracking-tight text-sm">Preferences</h4>
                  <p>Remembering your custom settings, filters, and dashboard configurations for your next visit.</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-purple-600/5 to-transparent rounded-3xl border border-white/5">
                  <h4 className="text-purple-300 font-bold mb-3 uppercase tracking-tight text-sm">Optimization</h4>
                  <p>Understanding which features are used most frequently to guide our platform development roadmap.</p>
                </div>
                <div className="p-8 bg-gradient-to-br from-green-600/5 to-transparent rounded-3xl border border-white/5">
                  <h4 className="text-green-300 font-bold mb-3 uppercase tracking-tight text-sm">Security</h4>
                  <p>Assisting in our security features and to detect activity that violates our Terms of Service.</p>
                </div>
              </div>
            </section>

            {/* 4. How to Manage Cookies */}
            <section className="p-10 bg-blue-600/5 rounded-[2.5rem] border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <Settings className="w-8 h-8 text-blue-400" />
                4. Controlling Your Options
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
                <div className="flex items-start gap-4 p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
                  <AlertCircle className="w-6 h-6 text-yellow-500/50 flex-shrink-0 mt-1" />
                  <p className="text-sm font-medium text-yellow-500/80 uppercase tracking-tight">
                    Note: Most browsers automatically accept cookies. Please visit your browser's "Help" or "Settings" menu for more advanced configuration.
                  </p>
                </div>
              </div>
            </section>

            {/* Final Update Section */}
            <section className="text-center pt-10 border-t border-white/5">
              <div className="inline-block px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-blue-400 font-bold text-sm tracking-tight shadow-lg">
                Last Expanded & Verified: March 22, 2026
              </div>
              <p className="mt-8 text-gray-500 text-sm font-medium">
                For further inquiries about our cookie usage, please contact our technical team via the support hub.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-sans {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        .text-shadow-glow {
          text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);
        }
      `}} />
    </div>
  )
}
