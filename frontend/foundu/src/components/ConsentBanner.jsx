import React, { useState, useEffect } from 'react';
import { getUserId } from '../utils/authUtils';

const ConsentBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isLoggedIn = !!getUserId();

    useEffect(() => {
        if (isLoggedIn) return; // Don't show if logged in
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Show banner after a slight delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleChoice = (choice) => {
        localStorage.setItem('cookie_consent', choice);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-[9999] w-[90%] max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <p className="text-gray-200 text-sm leading-relaxed mb-8 font-medium">
                        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                        <a href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 ml-1 underline underline-offset-4 decoration-cyan-400/30">
                            Learn more
                        </a>
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => handleChoice('rejected')}
                            className="flex-1 py-3 px-6 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-bold text-sm"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => handleChoice('accepted')}
                            className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsentBanner;
