import { useState, useEffect } from "react";
import { 
  Rocket, 
  Layers, 
  Palette, 
  FileText, 
  CreditCard, 
  Layout, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Trash2,
  Plus,
  Type,
  Users,
  Target,
  Zap,
  Upload,
  FileUp,
  X
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TIER_PRICES = {
  "8-slides": 4999,
  "10-slides": 6999,
  "12-plus": 9999
};

const PitchDeckPurchase = () => {
  const [selectedTier, setSelectedTier] = useState("10-slides");
  const [colorTheme, setColorTheme] = useState("#3B82F6");
  const [details, setDetails] = useState("");
  const [startupName, setStartupName] = useState("");
  const [sector, setSector] = useState("");
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [brandKit, setBrandKit] = useState(null);

  const fonts = [
    "Inter", "Montserrat", "Plus Jakarta Sans", "Poppins", "Roboto", 
    "Playfair Display", "Outfit", "Space Grotesk", "Lexend", "Clash Display"
  ];

  const tiers = [
    {
      id: "8-slides",
      name: "Standard Pack",
      slides: "8 SLIDES",
      price: TIER_PRICES["8-slides"],
      desc: "Perfect for seed-stage pitches and elevator decks.",
      features: ["Problem/Solution", "Market Analysis", "Team Slide", "Basic Financials"]
    },
    {
      id: "10-slides",
      name: "Growth Pro",
      slides: "10 SLIDES",
      price: TIER_PRICES["10-slides"],
      desc: "Comprehensive deck for Series A and high-stakes meetings.",
      features: ["Everything in Standard", "Competitor Matrix", "Milestone Roadmap", "Detailed GTM"]
    },
    {
      id: "12-plus",
      name: "Foundu Elite",
      slides: "12+ SLIDES",
      price: TIER_PRICES["12-plus"],
      desc: "Full-scale institutional investment presentation.",
      features: ["Everything in Growth", "Unit Economics", "Use of Funds", "Strategic Exit Analysis"]
    }
  ];

  const totalPrice = TIER_PRICES[selectedTier];

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span>Premium Deck Architecture</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic">
            Visualize <span className="text-blue-500 not-italic">Success.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Professional pitch decks designed by AI & Experts to secure your next round. 
            Select your architecture and customize your deployment.
          </p>

          {/* Why Foundu Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-blue-500 mb-4 flex justify-center"><Users size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">100% Human Made</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Unlike automated generators, our decks are crafted by expert designers ensuring narrative flow and emotional impact.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-blue-500 mb-4 flex justify-center"><Target size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">Investor Ready</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Structured based on successful pitch patterns that have raised over $100M+ in collective capital.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-blue-500 mb-4 flex justify-center"><Zap size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">High Precision</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Data-driven visualizations and pixel-perfect layouts that command attention in every slide.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          {/* Main Configuration - Left Column */}
          <div className="xl:col-span-2 space-y-16">
            
            {/* Step 1: Tier Selection */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">1</div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Select Deck Tier</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 text-left group overflow-hidden ${
                      selectedTier === tier.id 
                        ? 'bg-blue-600 border-blue-400 shadow-2xl scale-[1.02]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {selectedTier === tier.id && (
                       <div className="absolute top-4 right-4 text-white">
                         <CheckCircle2 size={24} />
                       </div>
                    )}
                    <div className="text-[10px] font-black tracking-widest text-blue-400 group-hover:text-blue-300 mb-2 uppercase">
                      {tier.name}
                    </div>
                    <div className="text-3xl font-black text-white mb-4">{tier.slides}</div>
                    <div className="text-gray-400 group-hover:text-gray-200 text-xs mb-8 font-medium">
                      {tier.desc}
                    </div>
                    <div className="mt-auto">
                      <div className="text-2xl font-black text-white">₹{tier.price.toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 2: visual Customization */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">2</div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Visual & Branding</h2>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 space-y-10">
                <div>
                  <label className="text-xs font-black tracking-widest uppercase text-gray-500 block mb-6 flex items-center gap-2">
                    <Palette size={14} className="text-blue-500" /> Primary Color Identity
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {["#3B82F6", "#EF4444", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setColorTheme(color)}
                        className={`w-14 h-14 rounded-2xl transition-all duration-300 transform ${
                          colorTheme === color ? 'scale-110 border-4 border-white' : 'hover:scale-105 border-2 border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <div className="relative group">
                       <input 
                        type="color" 
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-1 cursor-pointer"
                       />
                       <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase">Custom</span>
                    </div>
                  </div>
                </div>

                {/* Brand Kit Upload Area */}
                <div className="pt-10 border-t border-white/5">
                  <label className="text-xs font-black tracking-widest uppercase text-gray-500 block mb-6 flex items-center gap-2">
                    <Upload size={14} className="text-blue-500" /> Brand Kit Protocol
                  </label>
                  
                  <div className="relative group/upload">
                    {!brandKit ? (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-10 h-10 text-gray-500 group-hover:text-blue-400 mb-4 transition-colors" />
                          <p className="mb-2 text-sm text-gray-400 font-bold uppercase tracking-widest">Upload Brand Assets</p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">PDF, AI, FIGMA, or ZIP (MAX. 50MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => setBrandKit(e.target.files[0])}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-600 rounded-xl">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white max-w-[200px] truncate">{brandKit.name}</div>
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Asset Attached</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setBrandKit(null)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                  <div className="space-y-4">
                    <label className="text-xs font-black tracking-widest uppercase text-gray-500 block">Startup Identity</label>
                    <input 
                      type="text" 
                      placeholder="Enter Startup Name"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black tracking-widest uppercase text-gray-500 block">Business Sector</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fintech, SaaS, D2C"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3: Typography Selection */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">3</div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Typography Protocol</h2>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10">
                <label className="text-xs font-black tracking-widest uppercase text-gray-500 block mb-8">Select Primary Font Core</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(font)}
                      className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
                        selectedFont === font 
                          ? 'bg-blue-600 border-blue-400 text-white font-bold' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs">{font}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Step 4: Detailed Intel */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/30">4</div>
                <h2 className="text-3xl font-black tracking-tight uppercase">Operational Details</h2>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10">
                <label className="text-xs font-black tracking-widest uppercase text-gray-500 block mb-6">Additional Specifications</label>
                <textarea 
                  rows="5"
                  placeholder="Mention any specific slides you need, target investors, or key metrics to highlight..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-6 py-5 rounded-3xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium resize-none"
                ></textarea>
              </div>
            </section>
          </div>

          {/* Cart & Summary - Right Column */}
          <aside className="sticky top-32">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
                <div className="flex items-center gap-3 text-blue-400 font-bold tracking-widest uppercase text-[10px] mb-4">
                  <CreditCard size={14} />
                  Checkout Matrix
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Your <span className="text-blue-500 not-italic uppercase tracking-tighter">Order.</span></h3>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold text-lg">{tiers.find(t => t.id === selectedTier).name}</div>
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{selectedTier.replace('-', ' ')}</div>
                    </div>
                    <div className="text-white font-black">₹{totalPrice.toLocaleString()}</div>
                  </div>

                  <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Theme Color</span>
                    <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: colorTheme }}></div>
                  </div>

                  <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Font Core</span>
                    <span className="text-white font-bold">{selectedFont}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Brand Kit</span>
                    <span className={`font-bold transition-colors ${brandKit ? 'text-blue-400' : 'text-gray-600'}`}>
                      {brandKit ? 'ATTACHED' : 'PENDING'}
                    </span>
                  </div>

                  {startupName && (
                    <div className="space-y-2">
                       <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Project Identity</span>
                       <div className="text-white font-bold">{startupName}</div>
                    </div>
                  )}
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-center text-gray-400 font-medium">
                    <span>Base Architecture</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-400 font-bold">
                    <span>Foundu Founding Discount</span>
                    <span>-₹00.00</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Investment</div>
                    <div className="text-4xl font-black text-white italic">₹{totalPrice.toLocaleString()}</div>
                  </div>
                </div>

                <button className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-xl shadow-blue-600/20 uppercase tracking-widest flex items-center justify-center gap-3 group/btn text-xs">
                  Construct Deck
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-[10px] text-gray-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                  Secured by Razorpay. <br /> Delivery within 48-72 business hours.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PitchDeckPurchase;
