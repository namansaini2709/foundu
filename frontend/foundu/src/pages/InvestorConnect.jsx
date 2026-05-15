import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Handshake, Globe, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";

export default function InvestorConnect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>

        {/* Feature Explanation Header */}
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-3 text-blue-400 font-black tracking-[0.3em] text-xs mb-6 uppercase">
            <Handshake className="w-5 h-5" />
            Foundu Elite
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            Connect With <span className="text-blue-500 not-italic">Investors.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl">
            We are building the world's most exclusive bridge between visionary founders and elite capital. Get direct access to Top-Tier VCs, Angel Investors, and Funding Networks.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Globe className="w-8 h-8 text-blue-400" />,
              title: "Global Network",
              desc: "Access a curated list of investors from Silicon Valley, London, Dubai, and Bangalore."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
              title: "Verified VCs",
              desc: "Every investor on our platform is verified for credibility and funding history."
            },
            {
              icon: <Zap className="w-8 h-8 text-purple-400" />,
              title: "Direct Pitching",
              desc: "Skip the cold emails. Pitch your startup directly to the decision makers."
            }
          ].map((benefit, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
              <div className="mb-6">{benefit.icon}</div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{benefit.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* The "Coming Soon" Half-Screen Blur Section */}
        <div className="relative mt-20 mb-40">
           {/* Content that will be blurred */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 opacity-30">
              <div className="space-y-8">
                <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                <div className="h-32 bg-white/5 rounded-3xl"></div>
              </div>
              <div className="space-y-8">
                <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                <div className="h-4 w-1/2 bg-white/10 rounded-full"></div>
                <div className="h-32 bg-white/5 rounded-3xl"></div>
              </div>
           </div>

           {/* The Blur Overlay */}
           <div className="absolute inset-x-0 -bottom-20 h-[150%] bg-gradient-to-t from-[#020024] via-[#020024]/80 to-transparent backdrop-blur-md flex flex-col items-center justify-center pointer-events-none">
              <div className="relative group flex flex-col items-center">
                <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <h2 className="text-[12vw] md:text-[10vw] font-black text-white leading-none tracking-tighter uppercase italic opacity-20 transition-opacity group-hover:opacity-40">
                  COMING
                </h2>
                <h2 className="text-[12vw] md:text-[10vw] font-black text-blue-500 leading-none tracking-tighter uppercase italic -mt-4 md:-mt-8">
                  SOON
                </h2>
              </div>
              <p className="text-blue-200/60 font-black tracking-[0.5em] text-xs md:text-sm mt-8 uppercase text-center max-w-md px-6">
                Revolutionizing Startup Funding. Coming to Foundu in Q3 2024.
              </p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
