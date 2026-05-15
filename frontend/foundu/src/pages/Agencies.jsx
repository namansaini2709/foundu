import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Zap, TrendingUp, ShieldCheck, Briefcase, Sparkles, Layout } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Agencies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      
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
          <span className="text-sm font-black uppercase tracking-widest">Go Back</span>
        </button>

        {/* Header Section */}
        <div className="max-w-4xl mb-24">
          <div className="flex items-center gap-3 text-blue-400 font-black tracking-[0.3em] text-xs mb-6 uppercase">
            <Users className="w-5 h-5" />
            Foundu Communities
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            Freelancer <span className="text-blue-500 not-italic">Agencies.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl">
            Unite. Build. Scale. We're introducing a revolutionary way for freelancers to team up, form power-communities of 4-10 experts, and take on high-ticket projects as a single, unified agency.
          </p>
        </div>

        {/* Benefits Grid (Visible Details) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-blue-400" />,
              title: "Community Power",
              desc: "Form specialized agencies with 4-10 trusted freelancers from our blue-tick ecosystem."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
              title: "Unified Credibility",
              desc: "Appear as a single, high-trust agency to startup owners instead of solo freelancers."
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
              title: "Earn More",
              desc: "Qualify for massive agency-level projects and earn significantly more through collaboration."
            }
          ].map((benefit, i) => (
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl group hover:border-blue-500/30 transition-all duration-500">
              <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{benefit.icon}</div>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{benefit.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Blurred Content / Coming Soon Section */}
        <div className="relative mt-20 mb-40">
           {/* Content that will be blurred (Note to user: These are the half-details shown but obscured) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 opacity-30 select-none">
              <div className="p-10 rounded-[3rem] bg-white/5 space-y-8 border border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20"></div>
                    <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-3 w-full bg-white/5 rounded-full"></div>
                    <div className="h-3 w-5/6 bg-white/5 rounded-full"></div>
                    <div className="h-3 w-4/6 bg-white/5 rounded-full"></div>
                 </div>
                 <div className="h-40 bg-white/5 rounded-3xl border border-white/5"></div>
              </div>
              <div className="p-10 rounded-[3rem] bg-white/5 space-y-8 border border-white/10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20"></div>
                    <div className="h-4 w-3/4 bg-white/10 rounded-full"></div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-3 w-full bg-white/5 rounded-full"></div>
                    <div className="h-3 w-5/6 bg-white/5 rounded-full"></div>
                    <div className="h-3 w-4/6 bg-white/5 rounded-full"></div>
                 </div>
                 <div className="h-40 bg-white/5 rounded-3xl border border-white/5"></div>
              </div>
           </div>

           {/* The Blur Overlay with "COMING SOON" */}
           <div className="absolute inset-x-0 -bottom-20 h-[150%] bg-gradient-to-t from-[#020024] via-[#020024]/90 to-transparent backdrop-blur-xl flex flex-col items-center justify-center pointer-events-none">
              <div className="relative group flex flex-col items-center">
                <div className="absolute -inset-10 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
                <h2 className="text-[12vw] md:text-[10vw] font-black text-white leading-none tracking-tighter uppercase italic opacity-20">
                  COMING
                </h2>
                <h2 className="text-[12vw] md:text-[10vw] font-black text-blue-500 leading-none tracking-tighter uppercase italic -mt-4 md:-mt-8">
                  SOON
                </h2>
              </div>
              
              <div className="mt-12 text-center max-w-2xl px-6 space-y-4">
                <p className="text-blue-200/60 font-black tracking-[0.5em] text-[10px] md:text-xs uppercase">
                  Agency Revenue Sharing & Matching Engine
                </p>
                <p className="text-gray-400 text-sm font-medium italic">
                  "Individual freelancers compete. Agencies dominate. We are building the infrastructure for the next generation of collaborative working."
                </p>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
