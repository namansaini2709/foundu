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
  X,
  Globe,
  Clock,
  Shield,
  Smartphone
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StartupPortals = () => {
  const [explanation, setExplanation] = useState("");
  const [portalType, setPortalType] = useState("");
  const [otherPortal, setOtherPortal] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  
  const portalOptions = [
    "Hiring & Talent Hub",
    "CRM Lead Manager",
    "Support Desk",
    "Vendor Portal",
    "Other"
  ];

  const timeSlots = [
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", 
    "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
  ];

  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-yellow-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambient Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-yellow-600/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-600/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black tracking-widest uppercase mb-8">
            <Sparkles size={14} className="animate-pulse" />
            <span>Premium Business Infrastructure</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic">
            Action <span className="text-yellow-500 not-italic">Portals.</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Deploy specialized business hubs instantly to manage hiring, leads, and vendors. 
            Custom-built portals designed to scale with your startup's operational needs.
          </p>

          {/* Why Portals Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-yellow-500 mb-4 flex justify-center"><Shield size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">Secure & Private</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Enterprise-grade security for your internal data, vendor communications, and hiring pipelines.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-yellow-500 mb-4 flex justify-center"><Smartphone size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">Fully Responsive</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Access your business hubs from any device with pixel-perfect layouts and smooth performance.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="text-yellow-500 mb-4 flex justify-center"><Zap size={32} /></div>
              <h4 className="font-black text-sm uppercase tracking-widest mb-2">Zero Dev Hassle</h4>
              <p className="text-gray-500 text-xs font-bold leading-relaxed">Skip the long development cycles. Get your specialized portal ready for deployment in record time.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          {/* Main Configuration - Left Column */}
          <div className="xl:col-span-2 space-y-12">
            
            {/* Step 1: Portal Details */}
            <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 space-y-10">
              <div className="space-y-6">
                <label className="text-xs font-black tracking-widest uppercase text-gray-500 block flex items-center gap-2">
                  <Layout size={14} className="text-yellow-500" /> Select Portal Architecture
                </label>
                <select 
                  value={portalType}
                  onChange={(e) => setPortalType(e.target.value)}
                  className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/5 text-white focus:outline-none focus:border-yellow-500/50 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose a portal type...</option>
                  {portalOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {portalType === "Other" && (
                <div className="space-y-6 pt-10 border-t border-white/5 animate-fade-in">
                  <label className="text-xs font-black tracking-widest uppercase text-gray-500 block">Specify Your Portal</label>
                  <input 
                    type="text"
                    placeholder="e.g. Inventory Management System, Affiliate Dashboard"
                    value={otherPortal}
                    onChange={(e) => setOtherPortal(e.target.value)}
                    className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-all font-bold"
                  />
                </div>
              )}

              <div className="space-y-6 pt-10 border-t border-white/5">
                <label className="text-xs font-black tracking-widest uppercase text-gray-500 block flex items-center gap-2">
                  <Rocket size={14} className="text-yellow-500" /> Explain your portal needs
                </label>
                <textarea 
                  rows="5"
                  placeholder="Tell us about the features you need, your target users, and operational goals..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-8 py-6 rounded-[2rem] bg-black/40 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-all font-medium resize-none text-lg"
                ></textarea>
              </div>

              <div className="space-y-6 pt-10 border-t border-white/5">
                <label className="text-xs font-black tracking-widest uppercase text-gray-500 block flex items-center gap-2">
                  <CreditCard size={14} className="text-yellow-500" /> Estimated Budget (₹)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 50,000 - 1,00,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-8 py-5 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-all font-bold"
                />
              </div>
            </section>

            {/* Step 2: Schedule Session */}
            <section className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-yellow-600/30">2</div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Schedule Demo Session</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Calendar UI */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 block">Select Date</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-gray-600 mb-2">{d}</div>
                    ))}
                    {days.map((date, idx) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(date)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                            isSelected 
                              ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/30' 
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 block">Available Slots (12 PM - 7 PM)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all border ${
                          selectedTime === slot 
                            ? 'bg-yellow-600 border-yellow-400 text-black shadow-lg shadow-yellow-600/30' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Cart & Summary - Right Column */}
          <aside className="sticky top-32">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 bg-gradient-to-br from-yellow-600/10 to-transparent">
                <div className="flex items-center gap-3 text-yellow-400 font-bold tracking-widest uppercase text-[10px] mb-4">
                  <Layout size={14} />
                  Requirement Matrix
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Your <span className="text-yellow-500 not-italic uppercase tracking-tighter">Portal.</span></h3>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold text-lg italic uppercase tracking-tighter">
                        {portalType === "Other" && otherPortal ? otherPortal : (portalType || "Custom Portal")}
                      </div>
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Architecture Design</div>
                    </div>
                    <div className="text-yellow-500 font-black text-2xl">FREE</div>
                  </div>

                  {selectedDate && (
                    <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Session Date</span>
                      <span className="text-white font-bold">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Time Slot</span>
                      <span className="text-white font-bold">{selectedTime}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm py-4 border-b border-white/5">
                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Budget Range</span>
                    <span className={`font-bold transition-colors ${budget ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {budget ? `₹${budget}` : 'NOT SPECIFIED'}
                    </span>
                  </div>
                </div>

                <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-center text-gray-400 font-medium">
                    <span>Consultation</span>
                    <span className="text-yellow-500 font-bold uppercase tracking-widest text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-yellow-500 font-bold">
                    <span>Platform Credit</span>
                    <span>-₹00.00</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Pay</div>
                    <div className="text-4xl font-black text-yellow-500 italic">FREE</div>
                  </div>
                </div>

                <button className="w-full py-6 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-2xl transition-all duration-300 transform hover:scale-[1.03] shadow-xl shadow-yellow-600/20 uppercase tracking-widest flex items-center justify-center gap-3 group/btn text-xs">
                  Book a Demo
                  <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
                
                <p className="text-[10px] text-gray-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                  Confirmation will be sent to your email. <br /> Our tech team will connect for a scope discussion.
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

export default StartupPortals;
