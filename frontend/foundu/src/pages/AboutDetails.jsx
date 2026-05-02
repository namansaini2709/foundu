import { useNavigate } from 'react-router-dom';
import { Rocket, Target, Users, Zap, Shield, Sparkles, Globe, ArrowLeft, MousePointer2, Flame, GitBranch } from 'lucide-react';
import Footer from "../components/Footer";
const AboutDetails = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Target className="w-10 h-10" />,
      title: "Precision Matching",
      description: "Our proprietary AI doesn't just look at keywords; it analyzes cultural fit, project complexity, and historical success to find your perfect partner.",
      color: "blue"
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Vetted Ecosystem",
      description: "Every user in our network undergoes a rigorous verification process, ensuring that transparency and trust remain our highest priorities.",
      color: "indigo"
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "Visionary Focus",
      description: "We cater specifically to the startup mindset. Foundu is designed to handle the fast-paced, high-stakes requirements of modern innovation.",
      color: "purple"
    }
  ];
  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambient Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(9,9,121,0.15)_0,transparent_70%)]"></div>
      </div>
      <main className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-300/80 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        {/* Hero Section */}
        <div className="text-center mb-20 md:mb-32 relative">
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9]">
            WHAT IS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x bg-[length:200%_200%] uppercase">FOUNDU?</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light px-4">
            Founded on the principle that the right connection can change the world, Foundu is the AI-powered nervous system of the global startup ecosystem.
          </p>
        </div>
        {/* The Problem & The Solution - Redesigned */}
        <div className="mb-32">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">
              The Great <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-[12px]">Challenge</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
              In 2026, finding talent isn't hard—finding the <span className="text-white font-medium">right</span> talent is. Startups spend 40% of their early runway just trying to assemble a team that works together.
            </p>
            <div className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group max-w-2xl">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <p className="relative z-10 text-blue-200 italic font-light text-lg">
                "We realized that resumes don't build unicorns. Synergistic minds do. That's why we built Foundu."
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
               {[
                 { 
                   label: "The Talent Gap", 
                   detail: "The elite 1% of builders are often hidden behind traditional noise.", 
                   icon: <Target className="w-8 h-8 text-blue-400" />,
                 },
                 { 
                   label: "Burn Velocity", 
                   detail: "Inefficient hiring consumes up to 40% of early-stage capital runway.", 
                   icon: <Flame className="w-8 h-8 text-orange-400" />,
                 },
                 { 
                   label: "Neural Sync", 
                   detail: "Mismatched culture is the #1 killer of co-founder partnerships.", 
                   icon: <GitBranch className="w-8 h-8 text-purple-400" />,
                 },
                 { 
                   label: "Market Inertia", 
                   detail: "Slow team assembly delays product-market fit by months.", 
                   icon: <Zap className="w-8 h-8 text-emerald-400" />,
                 }
               ].map((item, i) => (
                 <div 
                   key={i} 
                   className="group/item flex flex-col items-center text-center space-y-6 transition-all duration-500 hover:-translate-y-2"
                 >
                   <div className="relative">
                     <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-0 group-hover/item:scale-150 transition-transform duration-700"></div>
                     <div className="relative z-10 p-4 rounded-full bg-white/5 border border-white/10 group-hover/item:border-white/30 transition-all duration-500">
                       {item.icon}
                     </div>
                   </div>
                   <div className="space-y-3">
                     <h4 className="text-white font-bold text-2xl tracking-tight">{item.label}</h4>
                     <p className="text-gray-400 text-base leading-relaxed font-light max-w-[250px] mx-auto group-hover:text-gray-300 transition-colors">{item.detail}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Our Pillars - Redesigned without boxes */}
        <div className="mb-32">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 px-4">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-blue-400">Our Core Pillars</h2>
            </div>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-md">The foundation upon which every successful startup team is built.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="space-y-6 relative z-10">
                  <div className={`p-4 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 text-${feature.color}-400 inline-block transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold group-hover:text-blue-300 transition-colors tracking-tight">
                      {feature.title}
                    </h3>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Callout - Redesigned without boxes */}
        <div className="relative py-32 mb-32 flex flex-col items-center justify-center text-center px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-full bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 space-y-10">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(59,130,246,0.1)] group transition-all duration-700 hover:scale-110 hover:border-white/30">
               <Zap className="w-10 h-10 md:w-16 md:h-16 text-blue-400 fill-current animate-pulse group-hover:scale-125 transition-transform duration-700" />
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black max-w-5xl leading-[1.1] tracking-tighter">
              THE ONLY PLATFORM <br className="hidden md:block" />
              THAT UNDERSTANDS <br className="hidden md:block" />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x bg-[length:200%_200%] uppercase">VISION.</span>
            </h2>
            
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>
        {/* Why Foundu Section */}
        <div className="space-y-32">
          <section className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest">
                <Sparkles className="w-5 h-5" />
                <span>AI Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black">AI that breathes startups.</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Most platforms use simple keyword tags. Foundu uses deep-learning neural networks to understand the "soul" of your startup. Whether you need a co-founder who complements your technical debt or a freelancer who has scaled similar MVPs, we know exactly who you need before you even ask.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="relative group h-72">
                <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all"></div>
                <div className="relative h-full space-y-8 p-6 md:p-10 flex flex-col justify-between group-hover:-translate-y-2 transition-all duration-500">
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase">Neural-Engine v4.0</div>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-blue-500/30 rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-blue-500/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="w-full h-px bg-gradient-to-r from-blue-500 to-transparent mb-6"></div>
                    <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Vision Alignment Matrix</h4>
                    <p className="text-blue-300/50 text-xs font-mono">STATUS: OPTIMIZING_MATCH_DNA</p>
                  </div>
                </div>
              </div>

              <div className="relative group h-72 sm:mt-16">
                <div className="absolute inset-0 bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative h-full space-y-8 p-6 md:p-10 flex flex-col justify-between group-hover:-translate-y-2 transition-all duration-500">
                  <div className="flex justify-between items-start">
                    <div className="text-[10px] font-mono text-purple-400 tracking-[0.3em] uppercase">Synergy-OS Core</div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></div>
                  </div>
                  <div>
                    <div className="w-full h-px bg-gradient-to-r from-purple-500 to-transparent mb-6"></div>
                    <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Cognitive Overlap Analysis</h4>
                    <p className="text-purple-300/50 text-xs font-mono">ENCRYPTED_SYNERGY_SYNC: 99.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Final CTA */}
          <section className="relative py-16 md:py-20 px-6 md:px-8 rounded-3xl md:rounded-[4rem] overflow-hidden text-center bg-gradient-to-b from-blue-600 to-transparent border border-blue-400/30">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
             <h2 className="text-4xl md:text-7xl font-bold mb-8 relative z-10">Ready to build your legacy?</h2>
             <p className="text-lg md:text-2xl text-blue-100/70 max-w-2xl mx-auto mb-10 md:mb-12 relative z-10 font-light">
               Join 2,000+ startups currently scaling with the Foundu ecosystem.
             </p>
             <button 
              onClick={() => navigate('/login-signup')}
              className="w-full md:w-auto px-10 py-5 bg-white text-[#020024] rounded-2xl text-xl md:text-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] relative z-10"
             >
               GET STARTED NOW
             </button>
             <div className="mt-8 text-blue-200/50 flex items-center justify-center gap-4 relative z-10">
                <Globe className="w-5 h-5 animate-spin-slow" />
                <span>Global talent. Unrestricted growth.</span>
             </div>
          </section>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite block;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}} />
    </div>
  );
};
export default AboutDetails;