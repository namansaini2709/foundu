import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Users,
  MessageSquare,
  Mail,
  Zap,
  CheckCircle2,
  ArrowRight,
  Calendar as CalendarIcon,
  Globe,
  Star,
  Plus,
  Minus,
  Sparkles,
  Handshake,
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getUserId } from "../utils/authUtils";
import { toast } from "react-toastify";

const EventPromotion = () => {
  const navigate = useNavigate();
  const [extraEmails, setExtraEmails] = useState(0);
  const [extraWhatsApp, setExtraWhatsApp] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(3); // Default to Plan 4
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Generate next 30 days
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    // Skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(d);
    }
  }

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const handleBooking = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login to book a meeting");
      return;
    }

    setIsBooking(true);
    try {
      const payload = {
        user_id: userId,
        meeting_type: "Event Partnership",
        explanation: "Interested in Foundu as an official event partner for free promotion.",
        selected_date: selectedDate.toISOString().split('T')[0],
        selected_time: selectedTime,
        business_type: "Event Organizer"
      };

      const res = await api.post("/api/meetings/book", payload);
      if (res.data.success) {
        toast.success("Partnership meeting booked! We will contact you soon.");
        setShowBooking(false);
        setBookingStep(1);
        setSelectedDate(null);
        setSelectedTime("");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book meeting. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const plans = [
    {
      id: 0,
      name: "Starter",
      price: 99,
      features: ["Event Onboarding", "Live Feed Promotion", "Community Visibility"],
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      color: "from-yellow-500/20 to-yellow-900/10",
      border: "border-yellow-500/30"
    },
    {
      id: 1,
      name: "Growth",
      price: 199,
      features: ["Event Onboarding", "Live Feed Promotion", "Global Site Alerts", "Dedicated Placement"],
      icon: <Globe className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-500/20 to-cyan-900/10",
      border: "border-cyan-500/30"
    },
    {
      id: 2,
      name: "Pro",
      price: 249,
      isBestSeller: true,
      features: ["Live Feed + Site Alerts", "100 AI-Powered Emails", "Custom Event Roadmap", "Targeted Reach"],
      icon: <Mail className="w-6 h-6 text-pink-400" />,
      color: "from-pink-500/20 to-pink-900/10",
      border: "border-pink-500/30",
      hasEmails: true
    },
    {
      id: 3,
      name: "Elite",
      price: 299,
      features: ["Global Site + Feed Blast", "100 AI Emails Included", "100 WhatsApp Messages", "Priority Support"],
      icon: <Sparkles className="w-6 h-6 text-purple-400" />,
      color: "from-purple-500/20 to-purple-900/10",
      border: "border-purple-500/30",
      hasEmails: true,
      hasWhatsApp: true
    }
  ];

  const calculateTotal = () => {
    let base = plans[selectedPlan].price;
    let extra = 0;

    if (plans[selectedPlan].hasEmails) {
      extra += Math.ceil(extraEmails / 2);
    }
    if (plans[selectedPlan].hasWhatsApp) {
      extra += Math.ceil(extraWhatsApp / 2);
    }

    return base + extra;
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Star className="w-3 h-3 fill-blue-400" />
            Marketing Redefined
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6"
          >
            Amplify Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Event</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-2xl font-light italic max-w-3xl mx-auto leading-relaxed"
          >
            "We are not a hosting platform. We are your massive marketing engine. We onboard your event and broadcast it to the largest ecosystem of founders and freelancers."
          </motion.p>
        </div>

        {/* Marketing Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-32">
          {[
            {
              title: "Live Feed",
              desc: "Top-tier placement in our community live feed for maximum visibility.",
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              accent: "bg-yellow-400/20"
            },
            {
              title: "Global Alerts",
              desc: "Instant notifications to every active user across the platform.",
              icon: <Globe className="w-8 h-8 text-cyan-400" />,
              accent: "bg-cyan-400/20"
            },
            {
              title: "Direct Email",
              desc: "Custom AI-drafted invitations sent straight to targeted inboxes.",
              icon: <Mail className="w-8 h-8 text-pink-400" />,
              accent: "bg-pink-400/20"
            },
            {
              title: "WhatsApp",
              desc: "High-conversion direct messages delivered to verified founder numbers.",
              icon: <MessageSquare className="w-8 h-8 text-green-400" />,
              accent: "bg-green-400/20"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.accent} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Models */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-16">Choose Your <span className="text-blue-500">Blast Radius</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-500 flex flex-col items-start text-left ${selectedPlan === plan.id
                  ? `bg-gradient-to-b ${plan.color} ${plan.border} scale-[1.05] shadow-2xl z-20`
                  : "bg-white/5 border-white/10 hover:bg-white/10 opacity-60"
                  }`}
              >
                {plan.isBestSeller && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-green-500/20 z-30">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">{plan.name}</h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-black text-green-400">₹{plan.price}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">/ Event</span>
                </div>

                <div className="space-y-4 mb-8 w-full">
                  {plan.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                  <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                    View Details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown Section */}
          <motion.div
            key={selectedPlan}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto p-10 md:p-16 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-2xl relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br ${plans[selectedPlan].color} rounded-full blur-[100px] -z-10 opacity-30`}></div>

            <div className="flex flex-col md:flex-row gap-16 text-left">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  Plan Details
                </div>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                  {plans[selectedPlan].name}
                </h3>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {plans[selectedPlan].features.map((feature, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-xs font-bold text-gray-200">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {(plans[selectedPlan].hasEmails || plans[selectedPlan].hasWhatsApp) && (
                    <div className="space-y-10">
                      {plans[selectedPlan].hasEmails && (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-pink-400">Additional Email Blast</span>
                            <span className="text-sm font-black">+{extraEmails} Target Users</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="50"
                            value={extraEmails}
                            onChange={(e) => setExtraEmails(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                          />
                        </div>
                      )}

                      {plans[selectedPlan].hasWhatsApp && (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-green-400">Additional WhatsApp Reach</span>
                            <span className="text-sm font-black">+{extraWhatsApp} Active Founders</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            step="20"
                            value={extraWhatsApp}
                            onChange={(e) => setExtraWhatsApp(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Final Invoice / Checkout Sidebar */}
              <div className="w-full md:w-[350px]">
                <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 h-full flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 border-b border-white/5 pb-4">Order Summary</h4>

                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-400">{plans[selectedPlan].name} Base</span>
                      <span className="text-sm font-black">₹{plans[selectedPlan].price}</span>
                    </div>
                    {extraEmails > 0 && (
                      <div className="flex justify-between items-center text-pink-400">
                        <span className="text-xs font-bold italic">Extra Emails ({extraEmails})</span>
                        <span className="text-sm font-black">+₹{Math.ceil(extraEmails / 2)}</span>
                      </div>
                    )}
                    {extraWhatsApp > 0 && (
                      <div className="flex justify-between items-center text-green-400">
                        <span className="text-xs font-bold italic">Extra WhatsApp ({extraWhatsApp})</span>
                        <span className="text-sm font-black">+₹{Math.ceil(extraWhatsApp / 2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="flex flex-col items-center mb-8">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Final Amount</span>
                      <div className="text-5xl font-black text-white tracking-tighter">₹{calculateTotal()}</div>
                    </div>

                    <button
                      onClick={() => {
                        const planData = { ...plans[selectedPlan] };
                        delete planData.icon;
                        navigate('/event-onboarding', { state: { plan: planData, extraEmails, extraWhatsApp, finalAmount: calculateTotal() } });
                      }}
                      className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                    >
                      Proceed to Payment
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-4 text-[9px] text-gray-600 text-center font-bold uppercase tracking-[0.1em]">By proceeding, you agree to our Promotion Terms & Conditions</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Free Collaboration Section */}
        <div className="text-center pt-20 border-t border-white/5">
          <div className="text-7xl md:text-9xl font-black text-white/5 uppercase select-none mb-[-0.5em]">OR</div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-blue-500/30 relative overflow-hidden"
          >
            <div className="relative z-20">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Want it for <span className="text-blue-400">FREE?</span></h2>
              <p className="text-gray-400 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto">
                Make FoundU your official event partner. Let's collaborate to build the future of the startup ecosystem together.
              </p>
              <button
                onClick={() => setShowBooking(!showBooking)}
                className="px-12 py-5 bg-white text-blue-600 font-black rounded-2xl transition-all hover:scale-105 shadow-2xl flex items-center gap-4 mx-auto uppercase tracking-widest text-sm relative z-20"
              >
                {showBooking ? 'Close Booking' : 'Book a Partnership Meeting'} 
                <Zap className={`w-4 h-4 fill-blue-600 transition-transform duration-500 ${showBooking ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showBooking && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 48 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden bg-[#050505]/60 backdrop-blur-3xl rounded-[3rem] border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]"
                >
                  <div className="p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                      {bookingStep === 1 ? (
                        <div className="space-y-12">
                          <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                              Step 01/02
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 italic">Select a Date</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Available next 30 days (Mon-Fri)</p>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {dates.slice(0, 16).map((date, i) => (
                              <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDate(date)}
                                className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-2 ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/50'}`}
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-2xl font-black tracking-tighter leading-none">
                                  {date.getDate()}
                                </span>
                                <span className="text-[9px] font-bold uppercase">
                                  {date.toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                              </motion.button>
                            ))}
                          </div>

                          <div className="flex justify-center pt-8 border-t border-white/5">
                            <button
                              disabled={!selectedDate}
                              onClick={() => setBookingStep(2)}
                              className="px-12 py-5 bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all hover:bg-blue-500 shadow-xl shadow-blue-600/20 flex items-center gap-3 group"
                            >
                              Continue to Time
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-12">
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={() => setBookingStep(1)}
                              className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors group"
                            >
                              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Date
                            </button>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                              Step 02/02
                            </div>
                          </div>

                          <div className="text-center">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2 italic">Pick a Time</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                              Available Slots for <span className="text-white">{selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {timeSlots.map((time, i) => (
                              <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTime(time)}
                                className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${selectedTime === time ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30' : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/50'}`}
                              >
                                <Clock className={`w-5 h-5 ${selectedTime === time ? 'text-white' : 'text-blue-500'}`} />
                                <span className="text-base font-black tracking-tight">{time}</span>
                              </motion.button>
                            ))}
                          </div>

                          <div className="flex justify-center pt-8 border-t border-white/5">
                            <button
                              disabled={!selectedTime || isBooking}
                              onClick={handleBooking}
                              className="px-16 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl shadow-blue-600/30 flex items-center gap-3 active:scale-95"
                            >
                              {isBooking ? 'Booking Your Slot...' : 'Confirm Partnership Meeting'}
                              {!isBooking && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventPromotion;
