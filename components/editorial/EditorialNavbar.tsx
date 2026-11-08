"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { MagneticElement } from "../motion/MagneticElement";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface NavLink {
  id: string;
  label: string;
  number: string;
}

const navLinks: NavLink[] = [
  { id: "about", label: "About", number: "01" },
  { id: "skills", label: "Skills", number: "02" },
  { id: "projects", label: "Works", number: "03" },
  { id: "experience", label: "Experience", number: "04" },
  { id: "education", label: "Education", number: "05" },
  { id: "certificates", label: "Credentials", number: "06" },
  { id: "contact", label: "Contact", number: "07" },
];

export function EditorialNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { setCursor, resetCursor } = useMotionContext();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["hero", ...navLinks.map((l) => l.id)];
      const scrollPos = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#F4F3EE]/85 dark:bg-[#111310]/85 backdrop-blur-md border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 py-3.5 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo / Wordmark */}
          <MagneticElement strength={0.2}>
            <button
              onClick={() => scrollTo("hero")}
              onMouseEnter={() => setCursor({ active: true, text: "HOME" })}
              onMouseLeave={resetCursor}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#171816] dark:bg-[#C8F169] flex items-center justify-center text-[#F4F3EE] dark:text-[#171816] font-display font-bold text-xs tracking-tight group-hover:scale-105 transition-transform">
                BW
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-tight text-[#171816] dark:text-[#F4F3EE] leading-none">
                  BWORIEY
                </span>
                <span className="font-mono text-[9px] text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase mt-0.5">
                  CREATIVE DEV // 2026
                </span>
              </div>
            </button>
          </MagneticElement>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#E9E8E1]/60 dark:bg-[#1C1F1A]/80 border border-[#171816]/10 dark:border-[#F4F3EE]/10 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  onMouseEnter={() => setCursor({ active: true, text: link.label.toUpperCase() })}
                  onMouseLeave={resetCursor}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer ${
                    isActive
                      ? "text-[#171816] dark:text-[#171816] font-bold bg-[#C8F169] shadow-sm"
                      : "text-[#777970] dark:text-[#A1A49A] hover:text-[#171816] dark:hover:text-[#F4F3EE] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className={`text-[10px] font-mono ${isActive ? "text-[#171816]/70" : "opacity-40"}`}>
                    {link.number}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Availability, Theme Switcher & Magnetic Contact CTA */}
          <div className="flex items-center gap-3">
            {/* Live Availability Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[#171816]/10 dark:border-[#F4F3EE]/15 bg-[#E9E8E1] dark:bg-[#1C1F1A] text-[11px] font-mono text-[#171816] dark:text-[#F4F3EE]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8F169] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8F169]"></span>
              </span>
              <span>Available for Hire</span>
            </div>

            {/* Theme Switcher */}
            <MagneticElement strength={0.3}>
              <button
                onClick={toggleTheme}
                onMouseEnter={() => setCursor({ active: true, text: theme === "light" ? "DARK" : "LIGHT" })}
                onMouseLeave={resetCursor}
                aria-label="Toggle theme"
                className="p-2.5 rounded-full border border-[#171816]/10 dark:border-[#F4F3EE]/15 bg-white/70 dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer shadow-sm"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-[#171816]" />
                ) : (
                  <Sun className="w-4 h-4 text-[#C8F169]" />
                )}
              </button>
            </MagneticElement>

            {/* Let's Talk CTA button */}
            <MagneticElement strength={0.3}>
              <button
                onClick={() => scrollTo("contact")}
                onMouseEnter={() => setCursor({ active: true, text: "TALK" })}
                onMouseLeave={resetCursor}
                className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] text-xs font-mono font-bold hover:scale-105 transition-transform shadow-md cursor-pointer"
              >
                <span>Connect</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </MagneticElement>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#171816] dark:text-[#F4F3EE] hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.45, ease: EASINGS.cinematic }}
            className="fixed inset-0 z-40 bg-[#F4F3EE] dark:bg-[#111310] text-[#171816] dark:text-[#F4F3EE] flex flex-col justify-between p-8 pt-28 lg:hidden"
          >
            <div className="flex flex-col space-y-3">
              <span className="font-mono text-[11px] font-bold text-[#777970] dark:text-[#A1A49A] uppercase tracking-widest mb-2">
                INDEX // NAVIGATION
              </span>

              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: DURATION.normal }}
                    onClick={() => scrollTo(link.id)}
                    className={`flex items-baseline justify-between py-3 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 text-left cursor-pointer ${
                      isActive ? "text-[#C8F169] dark:text-[#C8F169]" : ""
                    }`}
                  >
                    <span className="font-display font-bold text-3xl">
                      {link.label}
                    </span>
                    <span className="font-mono text-xs opacity-50">
                      {link.number}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 flex flex-col gap-4 font-mono text-xs">
              <div className="flex items-center justify-between text-[#777970] dark:text-[#A1A49A]">
                <span>Taufik Raihandani (BWORIEY)</span>
                <span>LAT -3.3167 / LON 114.5900</span>
              </div>
              <button
                onClick={() => scrollTo("contact")}
                className="w-full py-3.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-bold text-center"
              >
                Let&apos;s Build Something ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
