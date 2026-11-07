"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface NavLink {
  id: string;
  label: string;
  number: string;
}

const navLinks: NavLink[] = [
  { id: "about", label: "About", number: "01" },
  { id: "skills", label: "Skills", number: "02" },
  { id: "projects", label: "Projects", number: "03" },
  { id: "experience", label: "Experience", number: "04" },
  { id: "education", label: "Education", number: "05" },
  { id: "certificates", label: "Awards", number: "06" },
  { id: "contact", label: "Contact", number: "07" },
];

export function EditorialNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["hero", ...navLinks.map((l) => l.id)];
      const scrollPos = window.scrollY + 160;

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#faf8f5]/90 dark:bg-[#0c0d10]/90 backdrop-blur-md border-[#e4e1d7] dark:border-[#222530] py-3.5 shadow-sm"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <span className="font-display font-bold text-xl tracking-tight text-charcoal dark:text-white group-hover:text-forest dark:group-hover:text-lime transition-colors">
              BWORIEY
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-charcoal/5 dark:bg-white/10 text-charcoal/60 dark:text-white/60 tracking-wider">
              2026
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                    isActive
                      ? "text-charcoal dark:text-white font-semibold bg-black/5 dark:bg-white/10"
                      : "text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-[10px] opacity-40 font-mono">
                    {link.number}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      className="inline-block w-1 h-1 rounded-full bg-forest dark:bg-lime ml-0.5"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Status, Theme Switcher & Contact CTA */}
          <div className="flex items-center gap-3">
            {/* Live Availability Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 dark:border-white/15 bg-[#f0eee6] dark:bg-[#14151b] text-[11px] font-mono text-charcoal/80 dark:text-white/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#84cc16] dark:bg-lime"></span>
              </span>
              <span>Available</span>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-black/10 dark:border-white/15 bg-white/60 dark:bg-[#14151b] text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-charcoal/80" />
              ) : (
                <Sun className="w-4 h-4 text-lime" />
              )}
            </button>

            {/* Let's Talk CTA button */}
            <button
              onClick={() => scrollTo("contact")}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-charcoal dark:bg-lime text-white dark:text-charcoal text-xs font-mono font-medium hover:opacity-90 transition-opacity"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-50 p-6 rounded-2xl bg-[#faf8f5] dark:bg-[#14151b] border border-black/10 dark:border-white/15 shadow-xl lg:hidden flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-mono transition-colors text-left ${
                    isActive
                      ? "bg-black/5 dark:bg-white/10 font-bold text-charcoal dark:text-white"
                      : "text-charcoal/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs opacity-40 font-mono">
                      {link.number}
                    </span>
                    <span>{link.label}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-charcoal/60 dark:text-white/60">
                Taufik Raihandani
              </span>
              <button
                onClick={() => scrollTo("contact")}
                className="px-4 py-2 rounded-full bg-charcoal dark:bg-lime text-white dark:text-charcoal text-xs font-mono font-bold"
              >
                Hire / Connect ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

