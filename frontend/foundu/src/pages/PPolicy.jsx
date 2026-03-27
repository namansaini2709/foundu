import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Shield, Lock, Eye, Database, Globe, UserCheck, Mail, CheckCircle, ShieldAlert, Cpu, Briefcase, Info, Clock } from 'lucide-react'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}

export default function PPolicy() {
  return (
    <div className="min-h-screen flex flex-col pt-20 overflow-x-hidden font-sans" style={gradientBlackToBlue}>
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center w-full z-10 px-4 md:px-0 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-6 shadow-xl shadow-blue-500/10">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Privacy <span className="text-blue-400 text-shadow-glow">Policy</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            At Foundu, our commitment to your privacy is unwavering. We've built our platform on a foundation of security, transparency, and user-centric data control.
          </p>
        </div>

        {/* Content Container - 85% Width */}
        <div 
          className="w-full md:w-[85%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-48 -right-48 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/15 transition-colors duration-1000"></div>
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-600/15 transition-colors duration-1000"></div>
          
          <div className="relative z-10 space-y-20 text-gray-300">
            
            {/* 1. Introduction & Scope */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <Lock className="w-8 h-8 text-blue-400" />
                1. Scope & Acceptance
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  Foundu ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This Privacy Policy describes the types of information we may collect from you or that you may provide when you visit the website **Foundu.com** and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                </p>
                <p>
                  This policy applies to information we collect on this Website, in email, text, and other electronic messages between you and this Website, and through mobile and desktop applications you download from this Website. It also covers offline interactions where we explicitly reference this policy.
                </p>
              </div>
            </section>

             {/* 2. Lawful Basis for Processing (GDPR/CCPA) */}
             <section className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4 text-shadow-glow">
                <ShieldAlert className="w-8 h-8 text-blue-400" />
                2. Lawful Basis for Processing
              </h2>
              <div className="space-y-6 text-lg">
                <p>We only process your personal data when we have a valid legal reason to do so, including:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-500/30 transition-all">
                    <h4 className="font-bold text-blue-300 mb-2 uppercase tracking-tight text-xs">Contractual Necessity</h4>
                    <p className="text-sm text-gray-400">To fulfill our obligations under our Terms of Service and provide the core matching functionality.</p>
                  </div>
                  <div className="p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-all">
                    <h4 className="font-bold text-purple-300 mb-2 uppercase tracking-tight text-xs">Legitimate Interests</h4>
                    <p className="text-sm text-gray-400">For improving our AI-driven matching algorithms, preventing fraud, and enhancing platform security.</p>
                  </div>
                  <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/10 hover:border-green-500/30 transition-all">
                    <h4 className="font-bold text-green-300 mb-2 uppercase tracking-tight text-xs">Consent</h4>
                    <p className="text-sm text-gray-400">Where you have given us clear consent to process your data for a specific, non-core purpose (e.g., marketing updates).</p>
                  </div>
                  <div className="p-6 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 hover:border-yellow-500/30 transition-all">
                    <h4 className="font-bold text-yellow-300 mb-2 uppercase tracking-tight text-xs">Legal Obligations</h4>
                    <p className="text-sm text-gray-400">When we are required by law to maintain certain records or report information to regulatory bodies.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Granular Information We Collect */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <Database className="w-8 h-8 text-blue-400" />
                3. Detailed Data Inventory
              </h2>
              <div className="space-y-10">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                   <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-5 h-5 text-blue-400" />
                      <h4 className="text-xl font-bold text-white">Platform Interaction Data</h4>
                   </div>
                   <p className="text-md leading-relaxed text-gray-400 mb-6 font-medium">
                     We use advanced analytics to track your journey through our matching ecosystem to continuously refine our AI performance.
                   </p>
                   <div className="flex flex-wrap gap-4">
                      {["Search Queries", "Click Logs", "Matching Velocity", "Profile Visit Rates", "Engagement Scoring"].map(tag => (
                        <div key={tag} className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs font-bold uppercase">{tag}</div>
                      ))}
                   </div>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                   <div className="flex items-center gap-3 mb-4">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                      <h4 className="text-xl font-bold text-white">Professional Identity</h4>
                   </div>
                   <p className="text-md leading-relaxed text-gray-400 mb-6 font-medium">
                     The core of our platform relies on accurate professional data to facilitate meaningful connections between high-tier founders and freelancers.
                   </p>
                   <div className="flex flex-wrap gap-4">
                      {["Resumes/CVs", "Portfolio Links", "Skill Endorsements", "Historical Project Data", "Verification Badges"].map(tag => (
                        <div key={tag} className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs font-bold uppercase">{tag}</div>
                      ))}
                   </div>
                </div>
              </div>
            </section>

            {/* 4. Automated Decision Making */}
            <section className="p-8 bg-gradient-to-r from-blue-600/5 to-transparent rounded-3xl border border-blue-500/10">
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-blue-400" />
                  4. AI & Automated Matching
               </h2>
               <div className="space-y-4 text-md leading-relaxed font-medium">
                  <p>
                    Foundu utilizes proprietary AI algorithms to assist in the matching process between founders and freelancers. While these algorithms automate the discovery of potential matches, **final hiring decisions remain entirely with the users.**
                  </p>
                  <p>
                    You have the right to request information about the logic involved in our automated matching and to challenge the results if you believe an error has occurred in the data processing phase.
                  </p>
               </div>
            </section>

            {/* 5. International Data Transfers */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <Globe className="w-8 h-8 text-blue-400" />
                5. Global Operations & Data Sovereignty
              </h2>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-lg leading-relaxed mb-6">
                  We are a global ecosystem, and your information may be transferred to and maintained on computers located outside of your state, province, or country where the data protection laws may differ.
                </p>
                <div className="flex items-start gap-4 p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                   <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                   <p className="text-xs font-semibold uppercase tracking-tight text-blue-400">
                     Foundu utilizes Standard Contractual Clauses (SCCs) as approved by the European Commission to ensure a consistent level of protection across all international data transfers.
                   </p>
                </div>
              </div>
            </section>

             {/* 6. Data Security & Storage */}
             <section className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <Lock className="w-8 h-8 text-blue-400" />
                6. Security Infrastructure
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                We have implemented advanced technical and organizational measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <CheckCircle className="w-5 h-5 text-blue-400" />
                   <span className="text-sm font-bold uppercase tracking-tight">AES-256 Server-Side Encryption</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <CheckCircle className="w-5 h-5 text-blue-400" />
                   <span className="text-sm font-bold uppercase tracking-tight">Biannual Penetration Audits</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <CheckCircle className="w-5 h-5 text-blue-400" />
                   <span className="text-sm font-bold uppercase tracking-tight">Zero-Trust Internal Access Model</span>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <CheckCircle className="w-5 h-5 text-blue-400" />
                   <span className="text-sm font-bold uppercase tracking-tight">Multi-Factor Authentication (MFA)</span>
                </div>
              </div>
            </section>

            {/* 7. Retention Periods */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <Clock className="w-8 h-8 text-blue-400" />
                7. Data Retention Standards
              </h2>
              <p className="text-lg leading-relaxed">
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your personal information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
            </section>

            {/* 8. Children's Privacy (COPPA) */}
            <section className="p-10 bg-red-600/5 rounded-[2.5rem] border border-red-500/10">
               <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  8. Children's Privacy
               </h2>
               <p className="text-md leading-relaxed font-medium text-gray-400">
                 Our Website is not intended for children under 16 years of age. No one under age 16 may provide any personal information to or on the Website. We do not knowingly collect personal information from children under 16. If you are under 16, do not use or provide any information on this Website.
               </p>
            </section>

             {/* 9. California Privacy Rights (CCPA/CPRA) */}
             <section className="p-10 bg-gradient-to-br from-blue-600/10 to-transparent rounded-[2.5rem] border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-blue-400" />
                9. California Specific Rights
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  California residents have the right to request that we disclose certain information about our collection and use of your personal information over the past 12 months.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     "The categories of personal information we collected.",
                     "The sources from which personal information was collected.",
                     "The business/commercial purpose for collecting the data.",
                     "The categories of third parties with whom we share that data."
                   ].map((item, i) => (
                      <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-tight text-gray-500">
                        {item}
                      </div>
                   ))}
                </div>
              </div>
            </section>

            {/* 10. Contact Information */}
            <section className="text-center pt-10 border-t border-white/5">
              <h2 className="text-3xl font-bold text-white mb-4">Privacy Contact Center</h2>
              <p className="text-lg mb-8 text-gray-400 max-w-xl mx-auto">
                For complex requests or inquiries regarding our automated data processing, please contact our Data Protection Officer:
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a 
                  href="mailto:dpo@foundu.com" 
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                  <Mail className="w-5 h-5" /> dpo@foundu.com
                </a>
                <div className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 font-bold text-xs tracking-tight shadow-md uppercase">
                   Revision 5.0 — March 22, 2026
                </div>
              </div>
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
