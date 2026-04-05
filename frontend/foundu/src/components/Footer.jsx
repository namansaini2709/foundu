import { Link } from "react-router-dom";
import logo from "../assets/whitelogo.png";

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
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
      { label: "FAQ", href: "#" },
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

