import { useNavigate } from 'react-router-dom';
import { Rocket, Target, Users, Zap, Shield, Sparkles, Globe, ArrowLeft, MousePointer2 } from 'lucide-react';
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
        <div className="text-center mb-24 relative">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-bold tracking-widest uppercase mb-6 animate-bounce">
            DISCOVER THE FUTURE
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
            WHAT IS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x bg-[length:200%_200%]">FOUNDU?</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            Founded on the principle that the right connection can change the world, Foundu is the AI-powered nervous system of the global startup ecosystem.
          </p>
        </div>
        {/* The Problem & The Solution */}
        <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">The Great <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-8">Challenge</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              In 2026, finding talent isn't hard—finding the <span className="text-white font-medium">right</span> talent is. Startups spend 40% of their early runway just trying to assemble a team that works together.
            </p>
            <div className="bg-gray-800/20 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
              <p className="relative z-10 text-blue-200 italic font-light text-xl">
                "We realized that resumes don't build unicorns. Synergistic minds do. That's why we built Foundu."
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <div className="relative bg-gradient-to-b from-blue-500/10 to-transparent border border-white/10 rounded-[3rem] p-12 backdrop-blur-md shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-700">
              <div className="grid grid-cols-2 gap-4">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl animate-pulse`} style={{ animationDelay: `${i*0.2}s` }}>
                     {i === 1 ? '🧠' : i === 2 ? '⚙️' : i === 3 ? '🤝' : '🚀'}
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
        {/* Our Pillars */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
            <h2 className="text-3xl font-bold uppercase tracking-widest text-blue-400">Our Core Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative h-full"
              >
                <div className={`absolute inset-0 bg-${feature.color}-500/5 blur-2xl group-hover:bg-${feature.color}-500/20 transition-all duration-500 rounded-3xl`}></div>
                <div className="relative h-full bg-gray-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 hover:-translate-y-4 transition-all duration-500 group-hover:border-white/20 shadow-xl overflow-hidden">
                  {/* Hover Light Reflection */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className={`mb-8 p-4 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 text-${feature.color}-400 inline-block transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Animation Strip/Callout */}
        <div className="relative h-[400px] md:h-[600px] mb-32 rounded-[4rem] overflow-hidden border border-white/5 group bg-blue-900/10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 animate-pulse"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 backdrop-blur-sm">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.4)] animate-bounce hover:scale-125 transition-transform cursor-pointer">
                <Zap className="w-12 h-12 text-[#020024] fill-current" />
             </div>
             <h2 className="text-4xl md:text-7xl font-bold max-w-3xl leading-tight">THE ONLY PLATFORM THAT UNDERSTANDS <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">VISION.</span></h2>
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
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-blue-600/20 p-8 rounded-3xl h-64 flex flex-col justify-end group hover:bg-blue-600/40 transition-colors">
                <span className="text-5xl mb-4 transform group-hover:scale-125 transition-transform">📊</span>
                <span className="font-bold text-2xl">98% Match Rate</span>
              </div>
              <div className="bg-purple-600/20 p-8 rounded-3xl h-64 flex flex-col justify-end mt-12 group hover:bg-purple-600/40 transition-colors">
                 <span className="text-5xl mb-4 transform group-hover:scale-125 transition-transform">⚡</span>
                 <span className="font-bold text-2xl">3x Faster Hiring</span>
              </div>
            </div>
          </section>
          {/* Final CTA */}
          <section className="relative py-20 px-8 rounded-[3rem] overflow-hidden text-center bg-gradient-to-b from-blue-600 to-transparent border border-blue-400/30">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
             <h2 className="text-5xl md:text-7xl font-bold mb-8 relative z-10">Ready to build your legacy?</h2>
             <p className="text-xl md:text-2xl text-blue-100/70 max-w-2xl mx-auto mb-12 relative z-10 font-light">
               Join 2,000+ startups currently scaling with the Foundu ecosystem.
             </p>
             <button 
              onClick={() => navigate('/login-signup')}
              className="px-12 py-6 bg-white text-[#020024] rounded-2xl text-2xl font-black hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] relative z-10"
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