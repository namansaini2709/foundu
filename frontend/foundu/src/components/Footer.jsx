import { Link } from "react-router-dom";
import logo from "../assets/whitelogo.png";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/foundu.in/",
    icon: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/founduindia/",
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
];

const footerLinks = [
  {
    title: "Contact Us",
    items: [
      { label: "info@foundu.in", href: "mailto:info@foundu.in" },
      // { label: "+1 (555) 123-4567", href: "tel:+15551234567" },
      { label: "Direct Contact", to: "/contact-us" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "About Us", to: "/about-details" },
      { label: "Our Team", to: "/our-team" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact Us", to: "/contact-us" },
    ],
  },
  {
    title: "For Startups",
    items: [
      { label: "Browse Talent", to: "/live-feed" },
      { label: "Create Profile", to: "/login-signup" },
      { label: "Post Gig", to: "/add-job" },
      { label: "Explore Community", to: "/live-feed" },
      { label: "Partner With Us", to: "/contact-us" },
    ],
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 bg-gradient-to-b from-[#020024] to-[#000]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2 overflow-hidden h-16 md:h-20 w-full">
                <img src={logo} alt="FoundU Logo" className="h-32 md:h-40 w-auto object-contain scale-110" />
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
                The central platform for startups to discover, connect, and
                collaborate with skilled freelancers and co-founders. AI-powered
                matching, instant connections.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold text-lg mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      {item.to ? (
                        <Link
                          to={item.to}
                          className="text-white/80 hover:text-white transition-colors text-sm"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="text-white/80 hover:text-white transition-colors text-sm"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl md:text-[15rem] font-black text-white/5 select-none pointer-events-none uppercase tracking-tighter leading-none w-full text-center">
            FOUNDU
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-6 relative z-10">
            <Link
              to="/privacy-policy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookie-policy"
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="text-white/60 text-sm relative z-10">
            © {currentYear} Foundu, All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

