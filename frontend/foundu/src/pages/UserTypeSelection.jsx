import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Users, Briefcase, Rocket } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Gradient styles - same as HomePage
const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};
const gradientBlueToBlack = {
  background:
    "linear-gradient(180deg, rgba(9, 9, 121, 1) 16%, rgba(2, 0, 36, 1) 100%)",
};

function UserTypeSelection() {
  const navigate = useNavigate();
  const [hoveredType, setHoveredType] = useState(null);

  const userTypes = [
    {
      id: "cofounder",
      name: "Co-founder",
      icon: Users,
      description:
        "Looking for a business partner to build and grow your startup together? Join as a co-founder and connect with like-minded entrepreneurs.",
    },
    {
      id: "freelancer",
      name: "Freelancer",
      icon: Briefcase,
      description:
        "Offer your skills and expertise to startups. Find exciting projects, work with innovative teams, and grow your freelance career.",
    },
    {
      id: "founder",
      name: "Startup",
      icon: Rocket,
      description:
        "Need talented freelancers or co-founders for your startup? Discover top talent and build your dream team to scale your business.",
    },
  ];

  const handleTypeClick = (typeId) => {
    navigate(`/login-signup?type=${typeId}`);
  };

  // Navbar Component
  // const Navbar = () => <Navbar />;

  // Footer Component
  // const Footer = () => (
  //   <footer className="relative py-16 px-4" style={gradientBlackToBlue}>
  //     <div className="max-w-7xl mx-auto">
  //       <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
  //         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
  //           <div className="md:col-span-1">
  //             <div className="flex items-center mb-4">
  //               <span className="text-3xl font-bold text-white">F</span>
  //               <span className="text-white text-2xl font-bold ml-2">
  //                 OUNDU
  //               </span>
  //             </div>
  //             <p className="text-gray-300 text-sm leading-relaxed mb-4">
  //               The central platform for startups to discover, connect, and
  //               collaborate with skilled freelancers and co-founders. AI-powered
  //               matching, instant connections.
  //             </p>
  //             <div className="flex gap-4">
  //               <a
  //                 href="#"
  //                 className="text-white/80 hover:text-white transition-colors"
  //               >
  //                 <svg
  //                   className="w-6 h-6"
  //                   fill="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  //                 </svg>
  //               </a>
  //               <a
  //                 href="#"
  //                 className="text-white/80 hover:text-white transition-colors"
  //               >
  //                 <svg
  //                   className="w-6 h-6"
  //                   fill="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  //                 </svg>
  //               </a>
  //               <a
  //                 href="#"
  //                 className="text-white/80 hover:text-white transition-colors"
  //               >
  //                 <svg
  //                   className="w-6 h-6"
  //                   fill="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  //                 </svg>
  //               </a>
  //             </div>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">
  //               Contact Us
  //             </h3>
  //             <ul className="space-y-3">
  //               <li className="flex items-center text-white/80 text-sm">
  //                 <svg
  //                   className="w-5 h-5 mr-2"
  //                   fill="none"
  //                   stroke="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  //                   />
  //                 </svg>
  //                 foundu@example.com
  //               </li>
  //               <li className="flex items-center text-white/80 text-sm">
  //                 <svg
  //                   className="w-5 h-5 mr-2"
  //                   fill="none"
  //                   stroke="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth={2}
  //                     d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
  //                   />
  //                 </svg>
  //                 +1 (555) 123-4567
  //               </li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">
  //               Resources
  //             </h3>
  //             <ul className="space-y-2">
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   About Us
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Our Team
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   FAQ
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Contact Us
  //                 </a>
  //               </li>
  //             </ul>
  //           </div>
  //           <div>
  //             <h3 className="text-white font-semibold text-lg mb-4">
  //               For Startups
  //             </h3>
  //             <ul className="space-y-2">
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Browse Talent
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Create Profile
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Post Gig
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Explore Community
  //                 </a>
  //               </li>
  //               <li>
  //                 <a
  //                   href="#"
  //                   className="text-white/80 hover:text-white transition-colors text-sm"
  //                 >
  //                   Partner With Us
  //                 </a>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="text-center">
  //         <div className="text-6xl md:text-8xl font-bold text-white/10 mb-6">
  //           FOUNDU
  //         </div>
  //         <div className="flex justify-center gap-8 mb-6">
  //           <a
  //             href="#"
  //             className="text-white/60 hover:text-white transition-colors text-sm"
  //           >
  //             Privacy Policy
  //           </a>
  //           <a
  //             href="#"
  //             className="text-white/60 hover:text-white transition-colors text-sm"
  //           >
  //             Terms of Service
  //           </a>
  //           <a
  //             href="#"
  //             className="text-white/60 hover:text-white transition-colors text-sm"
  //           >
  //             Cookie Policy
  //           </a>
  //         </div>
  //         <div className="text-white/60 text-sm">
  //           © 2025 Foundu, All rights reserved.
  //         </div>
  //       </div>
  //     </div>
  //   </footer>
  // );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={gradientBlackToBlue}
    >
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-300/5 rounded-full blur-3xl"></div>
      </div>

      <section className="pt-24 pb-32 px-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          {/* Single Translucent Column Container - Made Smaller */}
          <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-3xl p-8 md:p-10 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-blue-400/30 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-blue-400/30 rounded-br-3xl"></div>

            {/* Heading with Animation */}
            <div className="text-center mb-12 md:mb-14">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-white">Which type of </span>
                <span className="text-blue-300 bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  user are you
                </span>
                <span className="text-white">?</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-4"></div>
            </div>

            {/* Three Columns with Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
              {userTypes.map((type, index) => {
                const IconComponent = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`relative group bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 backdrop-blur-sm border-2 rounded-2xl p-8 cursor-pointer transition-all duration-500 transform min-h-[300px] flex flex-col justify-center overflow-hidden ${
                      hoveredType === type.id
                        ? "border-blue-400 scale-105 shadow-2xl shadow-blue-400/50 -translate-y-2"
                        : "border-blue-700/50 hover:border-blue-400/70 hover:scale-102"
                    }`}
                    onMouseEnter={() => setHoveredType(type.id)}
                    onMouseLeave={() => setHoveredType(null)}
                    onClick={() => handleTypeClick(type.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Animated Background Gradient on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-blue-400/10 transition-opacity duration-500 ${
                        hoveredType === type.id ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>

                    {/* Glowing Border Effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                        hoveredType === type.id
                          ? "opacity-100 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                          : "opacity-0"
                      }`}
                    ></div>

                    <div className="text-center relative z-10">
                      {/* Icon with Animated Ring */}
                      <div className="flex justify-center mb-6 relative">
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            hoveredType === type.id ? "animate-ping" : ""
                          }`}
                        >
                          <div className="w-24 h-24 bg-blue-400/20 rounded-full"></div>
                        </div>
                        <div
                          className={`relative p-4 rounded-full bg-gradient-to-br from-blue-900/30 to-blue-700/30 transition-all duration-300 ${
                            hoveredType === type.id
                              ? "scale-110 rotate-6"
                              : "scale-100"
                          }`}
                        >
                          <IconComponent
                            size={64}
                            className={`transition-all duration-300 ${
                              hoveredType === type.id
                                ? "text-blue-300 scale-110"
                                : "text-blue-400 group-hover:text-blue-300"
                            }`}
                            strokeWidth={hoveredType === type.id ? 2.5 : 2}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h2
                        className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 ${
                          hoveredType === type.id
                            ? "text-blue-300 scale-105"
                            : "text-white group-hover:text-blue-200"
                        }`}
                      >
                        {type.name}
                      </h2>

                      {/* Description with Smooth Animation */}
                      <p
                        className={`text-gray-300 text-sm md:text-base leading-relaxed px-2 transition-all duration-300 ${
                          hoveredType === type.id ? "text-gray-200" : ""
                        }`}
                      >
                        {type.description}
                      </p>

                      {/* Hover Indicator Arrow */}
                      <div
                        className={`mt-6 flex justify-center transition-all duration-300 ${
                          hoveredType === type.id
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-blue-400">
                          <span className="text-sm font-semibold">
                            Get Started
                          </span>
                          <svg
                            className="w-5 h-5 animate-bounce"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Corner Decorative Elements */}
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-2xl"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-400/30 rounded-bl-2xl"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default UserTypeSelection;
