import React, { useState, useEffect } from "react";
const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [email, setEmail] = useState("");
  const [stars, setStars] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  /* ---------- STARS ---------- */
  useEffect(() => {
    const starArray = [];
    for (let i = 0; i < 220; i++) {
      starArray.push({
        id: i,
        size: Math.random() * 2 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 3 + 3,
      });
    }
    setStars(starArray);
  }, []);
  /* ---------- COUNTDOWN ---------- */
  useEffect(() => {
    const target = new Date("March 1, 2026 00:00:00").getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff < 0) return;
      setTimeLeft({
        days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((diff / 3600000) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((diff / 60000) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  /* ---------- MOUSE PARALLAX ---------- */
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`We'll notify you at ${email}`);
    setEmail("");
  };
  return (
    <div
      className="h-screen relative overflow-hidden text-white flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, rgba(2,0,36,1) 16%, rgba(9,9,121,1) 100%)",
      }}
    >
      {/* STARS - FIXED BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: s.size,
              height: s.size,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>
      {/* CONTENT CONTAINER WITH PARALLAX */}
      <div
        className="relative z-10 flex flex-col h-full transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        {/* HEADER */}
        <header className="px-6 sm:px-12 lg:px-20 pt-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3 text-xl sm:text-2xl font-semibold">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg rounded-tr-none" />
            Logo
          </div>
          <div className="text-sm sm:text-base lg:text-lg text-gray-300 hidden sm:block">
            Say hello! <span className="text-white">foundu.in@gmail.com</span>
          </div>
        </header>
        {/* MAIN - CENTERED CONTENT */}
        <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 pb-6">
          <div className="text-center max-w-5xl w-full">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 sm:mb-8">
              We Are <br /> Coming Soon
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 mb-10 sm:mb-12">
              We're strong believers that the best solutions come from gathering
              new insights and pushing conventional boundaries.
            </p>
            {/* COUNTDOWN */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-10 mb-10 sm:mb-12 flex-wrap">
              <TimeBox label="Days" value={timeLeft.days} />
              <TimeBox label="Hours" value={timeLeft.hours} />
              <TimeBox label="Minutes" value={timeLeft.minutes} />
              <TimeBox label="Seconds" value={timeLeft.seconds} />
            </div>
            {/* WAITLIST */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">
              Join the waitlist
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  flex-1 px-5 py-3 sm:px-6 sm:py-4 rounded-xl
                  bg-white/15 backdrop-blur-xl
                  border border-white/30
                  text-white placeholder-gray-300
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                "
              />
              <button
                type="submit"
                className="
                  px-6 py-3 sm:px-8 sm:py-4 rounded-xl
                  bg-white/20 backdrop-blur-xl
                  border border-white/40
                  font-medium
                  hover:bg-white/30
                  transition
                "
              >
                Join
              </button>
            </form>
          </div>
        </main>
        {/* FOOTER - COPYRIGHT */}
        <footer className="px-6 sm:px-12 lg:px-20 pb-4 text-center text-sm text-gray-400 flex-shrink-0">
          © {new Date().getFullYear()} All rights reserved.
        </footer>
      </div>
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
const TimeBox = ({ label, value }) => (
  <div className="text-center">
    <div className="text-xs sm:text-sm md:text-lg text-gray-400 mb-2 sm:mb-3">
      {label}
    </div>
    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
      {value}
    </div>
  </div>
);
export default ComingSoon;