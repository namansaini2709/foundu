import React from 'react'
import Footer from '../components/Footer'
import { FileText, UserPlus, Scale, ShieldAlert, BookOpen, Fingerprint, Gavel, ExternalLink } from 'lucide-react'

const gradientBlackToBlue = {
  background: 'linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)'
}
export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col pt-20 overflow-x-hidden font-sans" style={gradientBlackToBlue}>
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center w-full z-10 px-4 md:px-0 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-6 shadow-xl shadow-blue-500/10">
            <Scale className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Terms of <span className="text-blue-400 text-shadow-glow">Service</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Establishing the legal framework for a professional, secure, and successful collaborative ecosystem on Foundu.
          </p>
        </div>

        {/* Content Container - 85% Width */}
        <div 
          className="w-full md:w-[85%] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none group-hover:bg-blue-600/10 transition-colors duration-1000"></div>

          <div className="relative z-10 space-y-20 text-gray-300">
            
            {/* 1. Acceptance of Terms */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-blue-400" />
                1. Acceptance of Agreement
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  By accessing, browsing, or using the Foundu platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these terms.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you and Foundu regarding your use of the Service. We reserve the right to amend these terms at our sole discretion.
                </p>
              </div>
            </section>

            {/* 2. User Accounts & Security */}
            <section className="p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <Fingerprint className="w-8 h-8 text-blue-400" />
                2. Account Identity & Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-300">Registration</h3>
                  <p className="text-md leading-relaxed">
                    To access specific features, you must register for an account. You agree to provide accurate, current, and complete information and maintain the security of your password and credentials.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-300">Responsibility</h3>
                  <p className="text-md leading-relaxed">
                    You are solely responsible for all activity that occurs under your account. You must notify Foundu immediately of any unauthorized use or security breach.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Intellectual Property Rights */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-400" />
                3. Intellectual Property
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                The Service and its original content, features, and functionality are and will remain the exclusive property of Foundu and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
              </p>
              <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                 <ShieldAlert className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                 <p className="text-sm font-medium italic">
                   Users retain ownership of the content they submit (profiles, job postings, portfolio items), but grant Foundu a worldwide, non-exclusive license to host, display, and distribute such content for service optimization.
                 </p>
              </div>
            </section>

            {/* 4. Prohibited Conduct */}
            <section>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
                <Scale className="w-8 h-8 text-blue-400" />
                4. Acceptable Use Policy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "No automated data collection or scraping of user profiles.",
                  "Strict prohibition of fraudulent job listings or profiles.",
                  "No attempts to circumvent the platform's security measures.",
                  "Respecting privacy and intellectual property of other users.",
                  "No distribution of harmful code, viruses, or malware.",
                  "Adherence to all professional engagement community standards."
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-red-500/20 transition-all group/rule">
                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover/rule:bg-red-400 transition-colors"></div>
                    <span className="text-md font-medium">{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Limitation of Liability */}
            <section className="p-10 bg-gradient-to-br from-indigo-600/10 to-transparent rounded-[2.5rem] border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-4">
                <Gavel className="w-8 h-8 text-blue-400" />
                5. Limitation of Liability
              </h2>
              <p className="text-lg leading-relaxed">
                In no event shall Foundu, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            {/* 6. Governing Law */}
            <section className="text-center pt-10 border-t border-white/5">
              <h2 className="text-3xl font-bold text-white mb-4">Governing Law</h2>
              <p className="text-lg mb-8 text-gray-400 max-w-xl mx-auto">
                These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 font-bold text-sm tracking-tight shadow-lg">
                  Revision 4.2.1 — March 2026
                </div>
                <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold group">
                  Download Full PDF <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
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
