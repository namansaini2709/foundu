import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft, Image as ImageIcon, Send, Mail, Bell, Smartphone, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import api from '../utils/axiosConfig';
import { getUserId } from '../utils/authUtils';

const EventOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, extraEmails, extraWhatsApp, finalAmount } = location.state || {};

  // If accessed directly without selecting a plan, redirect back
  if (!plan) {
    navigate('/event-promotion');
    return null;
  }

  const [step, setStep] = useState(1); // 1 = Form, 2 = Preview

  const [formData, setFormData] = useState({
    eventName: '',
    targetAudience: [],
    eventDate: '',
    eventTime: '',
    registrationDeadline: '',
    registrationLink: '',
    organizerName: '',
    organizerNumber: '',
    organizerEmail: '',
    brief: '',
    location: '',
    flyer: null
  });

  const [flyerPreview, setFlyerPreview] = useState(null);

  const audienceOptions = ['Founder', 'Co-Founder', 'Freelancer', 'Influencer'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudienceToggle = (aud) => {
    setFormData(prev => {
      if (prev.targetAudience.includes(aud)) {
        return { ...prev, targetAudience: prev.targetAudience.filter(a => a !== aud) };
      }
      return { ...prev, targetAudience: [...prev.targetAudience, aud] };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, flyer: file }));
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    const requiredFields = ['eventName', 'eventDate', 'eventTime', 'location', 'registrationDeadline', 'registrationLink', 'brief'];
    const isMissing = requiredFields.some(field => !formData[field]);
    if (isMissing || formData.targetAudience.length === 0 || !formData.flyer) {
      toast.error('Please fill all required fields and upload a flyer.', { theme: 'dark' });
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSaveAndPay = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to continue.', { theme: 'dark' });
      return;
    }

    const loadToast = toast.loading('Preparing campaign...', { theme: 'dark' });

    try {
      // 1. Create FormData for the event
      const data = new FormData();
      data.append('user_id', userId);
      data.append('plan_name', plan.name);
      data.append('extra_emails', extraEmails);
      data.append('extra_whatsapp', extraWhatsApp);
      data.append('final_amount', finalAmount);
      data.append('event_name', formData.eventName);
      data.append('target_audience', JSON.stringify(formData.targetAudience));
      data.append('event_date', formData.eventDate);
      data.append('event_time', formData.eventTime);
      data.append('registration_deadline', formData.registrationDeadline);
      data.append('registration_link', formData.registrationLink);
      data.append('organizer_name', formData.organizerName);
      data.append('organizer_number', formData.organizerNumber);
      data.append('organizer_email', formData.organizerEmail);
      data.append('brief', formData.brief);
      data.append('location', formData.location);
      data.append('flyer', formData.flyer);

      // 2. Call backend to create pending event
      const createRes = await api.post('/api/events/promote', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!createRes.data.success) {
        throw new Error(createRes.data.message || 'Failed to create event');
      }

      const eventId = createRes.data.event_id;

      // 3. Create Razorpay order
      const orderRes = await api.post('/api/payments/create-order', {
        amount: finalAmount,
        receipt: `event_promo_${eventId}`
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to initialize payment gateway');
      }

      toast.dismiss(loadToast);

      // 4. Open Razorpay Window
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure you have this in .env
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'FoundU',
        description: `Promote Event: ${formData.eventName}`,
        order_id: orderRes.data.order_id,
        handler: async function (response) {
          toast.loading('Verifying payment...', { id: 'verify', theme: 'dark' });
          try {
            const verifyRes = await api.post('/api/events/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              event_id: eventId
            });

            if (verifyRes.data.success) {
              toast.update('verify', { render: 'Event Promoted Successfully!', type: 'success', isLoading: false, autoClose: 3000 });
              navigate('/event-marketplace');
            } else {
              toast.update('verify', { render: 'Payment verification failed.', type: 'error', isLoading: false, autoClose: 3000 });
            }
          } catch (err) {
            toast.update('verify', { render: 'Payment verification error.', type: 'error', isLoading: false, autoClose: 3000 });
          }
        },
        prefill: {
          name: formData.organizerName || 'User',
          email: formData.organizerEmail || '',
          contact: formData.organizerNumber || ''
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed or cancelled', { theme: 'dark' });
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.dismiss(loadToast);
      toast.error(error.message || 'An error occurred during checkout', { theme: 'dark' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020024] text-white selection:bg-blue-500/30 font-sans">

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-20">
        
        {/* Top Summary Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2 block">Selected Plan</span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{plan.name}</h1>
            <div className="flex gap-4 mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
              {extraEmails > 0 && <span>+{extraEmails} Emails</span>}
              {extraWhatsApp > 0 && <span>+{extraWhatsApp} WhatsApp</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Total Billed</span>
            <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">₹{finalAmount}</div>
          </div>
        </motion.div>

        {step === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {/* Form Column */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Event Details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Name *</label>
                    <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Startup Weekend 2026" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Audience *</label>
                    <div className="flex flex-wrap gap-2">
                      {audienceOptions.map(aud => (
                        <button 
                          key={aud} 
                          type="button"
                          onClick={() => handleAudienceToggle(aud)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${formData.targetAudience.includes(aud) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30'}`}
                        >
                          {aud}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Date *</label>
                      <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Time *</label>
                      <input type="time" name="eventTime" value={formData.eventTime} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registration Deadline *</label>
                      <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Online, Bangalore, or Zoom Link" />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registration Link *</label>
                    <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6 mt-6">
                    <div className="md:col-span-3">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Organizer Contact Details</label>
                    </div>
                    <div>
                      <input type="text" name="organizerName" value={formData.organizerName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm" placeholder="Name *" />
                    </div>
                    <div>
                      <input type="tel" name="organizerNumber" value={formData.organizerNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm" placeholder="Phone Number *" />
                    </div>
                    <div>
                      <input type="email" name="organizerEmail" value={formData.organizerEmail} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm" placeholder="Email *" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Brief About Event *</label>
                    <textarea name="brief" value={formData.brief} onChange={handleInputChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Describe your event and why people should attend..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Flyer Column */}
            <div className="md:col-span-1">
               <div className="sticky top-32 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Flyer *</label>
                  <label className="cursor-pointer block w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-white/20 hover:border-blue-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center text-center p-6 group overflow-hidden relative">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    {flyerPreview ? (
                      <img src={flyerPreview} alt="Flyer" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-600 group-hover:text-blue-500 transition-colors mb-4" />
                        <span className="text-sm font-bold text-gray-400">Click to upload flyer</span>
                        <span className="text-[10px] text-gray-600 mt-2">1080x1350px recommended</span>
                      </>
                    )}
                  </label>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3 group"
                >
                  Preview & Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStep(1)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Campaign Preview</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Email Preview */}
              <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-bold">Email Blast Preview</span>
                </div>
                <div className="p-6 bg-white text-black min-h-[400px]">
                  <div className="max-w-md mx-auto mt-4">
                    <h1 className="text-2xl font-bold mb-4">{formData.eventName || 'Event Name'}</h1>
                    {flyerPreview && <img src={flyerPreview} className="w-full rounded-xl mb-6 shadow-md" alt="Flyer" />}
                    <p className="text-gray-700 whitespace-pre-wrap mb-6">{formData.brief || 'Event description goes here.'}</p>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm">
                      <p><strong>Date:</strong> {formData.eventDate}</p>
                      <p><strong>Time:</strong> {formData.eventTime}</p>
                      <p><strong>Organizer:</strong> {formData.organizerName}</p>
                    </div>
                    <a href={formData.registrationLink || '#'} className="block text-center bg-blue-600 text-white font-bold py-3 rounded-lg">Register Now</a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Preview */}
              <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <Smartphone className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">WhatsApp Preview</span>
                </div>
                <div className="p-6 bg-[#efeae2] text-black min-h-[400px] flex items-center justify-center">
                  <div className="bg-white rounded-xl p-2 max-w-[280px] w-full shadow-sm relative">
                    {flyerPreview && <img src={flyerPreview} className="w-full h-40 object-cover rounded-lg mb-2" alt="Flyer" />}
                    <div className="p-2">
                      <p className="text-sm whitespace-pre-wrap">🚀 *{formData.eventName}* is happening!\n\n{formData.brief?.substring(0, 100)}...\n\n📅 Date: {formData.eventDate}\n⏰ Time: {formData.eventTime}\n\nRegister here: {formData.registrationLink}</p>
                      <span className="text-[10px] text-gray-400 float-right mt-1">12:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Web Notification Preview */}
              <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 col-span-1 lg:col-span-2">
                <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-3 border-b border-white/5">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-bold">Web Platform Notification</span>
                </div>
                <div className="p-12 bg-[#020024] flex items-center justify-center min-h-[200px]">
                  <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 flex gap-4 w-full max-w-md border border-gray-700 shadow-2xl">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Bell className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">New Event: {formData.eventName}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{formData.brief}</p>
                      <button className="mt-3 text-xs font-bold text-blue-400">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center max-w-xl mx-auto border-t border-white/10 pt-12">
               <button 
                  onClick={handleSaveAndPay}
                  className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-green-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 group"
                >
                  Pay ₹{finalAmount} & Launch Campaign
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <p className="mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Secure payment powered by Razorpay
                </p>
            </div>
          </motion.div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default EventOnboarding;
