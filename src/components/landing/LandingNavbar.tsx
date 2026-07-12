import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, ArrowRight, Layers, LayoutGrid } from "lucide-react";

interface LandingNavbarProps {
  isAuthenticated: boolean;
}

export default function LandingNavbar({ isAuthenticated }: LandingNavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Features", id: "features" },
    { label: "Solutions", id: "preview" },
    { label: "Pricing", id: "pricing" },
    { label: "Documentation", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#030712]/75 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-indigo-950/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              FF
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-lg tracking-wider text-white font-display leading-none">
                FormFlow
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-1 tracking-widest uppercase">
                Enterprise SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 bg-white/5 border border-white/5 px-6 py-2 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.id)}
                className="text-xs font-semibold text-slate-300 hover:text-white transition duration-200 cursor-pointer relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Desktop Authentication / Get Started CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 cursor-pointer hover:scale-[1.02]"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Go to Workspace</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-slate-300 hover:text-white text-xs font-bold transition duration-200 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 cursor-pointer hover:scale-[1.02]"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Action */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-8 space-y-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left py-3 text-xs font-semibold text-slate-300 hover:text-white transition border-b border-white/5"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className="w-full justify-center py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Go to Workspace</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-center py-3 text-slate-300 hover:text-white text-xs font-bold transition border border-white/10 rounded-xl"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full justify-center py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
