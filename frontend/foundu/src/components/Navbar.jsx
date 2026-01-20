import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const gradientBlackToBlue = {
  background:
    "linear-gradient(180deg, rgba(2, 0, 36, 1) 16%, rgba(9, 9, 121, 1) 100%)",
};

const navLinks = [
  { label: "Hire Freelancer", to: "/freelancer-jobs" },
  { label: "Find Best Match", to: "/signup" },
  { label: "For Startups", to: "/startup-services" },
  { label: "About Us", to: "/" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={gradientBlackToBlue}
    >
      <div
        className={`bg-black/30 backdrop-blur-md border-b border-blue-700/30 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-300">F</span>
            <span className="text-xl font-bold text-white">OUNDU</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-blue-300"
                    : "text-white hover:text-blue-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/login-signup")}
              className="hidden sm:inline-flex bg-transparent border border-blue-400 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/20 transition-all duration-300"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="hidden sm:inline-flex bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg"
            >
              Get started
            </button>
            <button
              type="button"
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-blue-700/30 bg-black/70 backdrop-blur-md">
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium ${
                    location.pathname === link.to
                      ? "text-blue-300"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login-signup")}
                  className="flex-1 bg-transparent border border-blue-400 text-blue-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/20 transition-all duration-300"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

