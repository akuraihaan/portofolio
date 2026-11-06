"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  User, 
  Briefcase, 
  Mail, 
  Menu, 
  X, 
  Sparkles,
  ExternalLink 
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: typeof Rocket;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Beranda", icon: Rocket },
  { id: "about", label: "Tentang", icon: User },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "contact", label: "Kontak", icon: Mail },
];

export function SpaceNavbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Floating Center Navbar */}
      <header className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[720px] transition-all duration-300">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex items-center justify-between px-3 py-2 md:px-5 md:py-2.5 rounded-full border transition-all duration-300 ${
            isScrolled
              ? "bg-[#04081c]/85 border-[#2c67ed]/50 shadow-[0_0_30px_rgba(44,103,237,0.45)] backdrop-blur-2xl"
              : "bg-[#04081c]/70 border-[#2c67ed]/30 shadow-[0_0_20px_rgba(44,103,237,0.3)] backdrop-blur-xl"
          }`}
          style={{
            boxShadow: isScrolled
              ? "0 0 30px rgba(44, 103, 237, 0.45), inset 0 0 15px rgba(44, 103, 237, 0.2)"
              : "0 0 20px rgba(44, 103, 237, 0.3), inset 0 0 10px rgba(44, 103, 237, 0.12)",
          }}
        >
          {/* Logo / Brand Mark */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 group text-left focus:outline-none pl-1"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed] shadow-[0_0_12px_rgba(44,103,237,0.6)] group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-[#60a5fa] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold tracking-wider text-white uppercase group-hover:text-[#6ba0ff] transition-colors">
                Bworiey
              </span>
              <span className="text-[10px] text-blue-300/60 font-mono -mt-0.5">
                Portfolio
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 focus:outline-none ${
                    isActive
                      ? "text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 rounded-full bg-[#2c67ed] shadow-[0_0_15px_rgba(44,103,237,0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 opacity-90" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status Badge & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2c67ed]/15 border border-[#2c67ed]/40 text-[11px] text-blue-200 font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60a5fa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2c67ed]"></span>
              </span>
              <span>Available</span>
            </div>

            <button
              onClick={() => scrollTo("contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2c67ed] to-[#1e40af] text-white text-xs font-medium hover:brightness-110 shadow-[0_0_15px_rgba(44,103,237,0.5)] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Hire Me</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 p-3 rounded-2xl bg-[#04081c]/95 border border-[#2c67ed]/50 backdrop-blur-2xl shadow-[0_0_25px_rgba(44,103,237,0.4)] flex flex-col gap-1.5"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#2c67ed] text-white shadow-[0_0_15px_rgba(44,103,237,0.5)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-blue-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between px-2 mt-1">
                <span className="text-xs text-blue-300/70 font-mono flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ready to collaborate
                </span>
                <button
                  onClick={() => scrollTo("contact")}
                  className="px-3 py-1 rounded-full bg-[#2c67ed] text-white text-xs font-semibold shadow-[0_0_12px_rgba(44,103,237,0.5)]"
                >
                  Kontak ↗
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

