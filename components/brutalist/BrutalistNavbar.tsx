"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "../editorial/ThemeContext";
import { MagneticButton } from "../motion/MagneticButton";
import { useMotionContext } from "../motion/MotionProvider";

export interface NavLinkItem {
  name: string;
  href: string;
  num?: string;
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { num: "01", name: "PROYEK", href: "#projects" },
  { num: "02", name: "TENTANG", href: "#about" },
  { num: "03", name: "KEAHLIAN", href: "#skills" },
  { num: "04", name: "REKAM JEJAK", href: "#experience" },
  { num: "05", name: "SERTIFIKAT", href: "#certificates" },
  { num: "06", name: "KONTAK", href: "#contact" },
];

interface BrutalistNavbarProps {
  navigationItems?: NavLinkItem[];
  ownerName?: string;
  availabilityStatus?: string;
}

export function BrutalistNavbar({
  navigationItems,
  ownerName = "TAUFIK RAIHANDANI",
  availabilityStatus = "AVAILABLE FOR PROJECTS",
}: BrutalistNavbarProps) {
  const navLinks = navigationItems && navigationItems.length > 0 ? navigationItems : DEFAULT_NAV_LINKS;
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ["hero", "projects", "about", "skills", "experience", "certificates", "contact"];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { setCursor, resetCursor } = useMotionContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-200">
      {/* Top Mini Marquee Ticker */}
      <div className="bg-[#FFE500] text-black border-b-2 border-black overflow-hidden py-1 font-mono text-[11px] font-bold tracking-wider select-none hidden md:block">
        <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite]">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-6 mx-4">
              <span>✦ TAUFIK RAIHANDANI</span>
              <span className="bg-black text-[#FFE500] px-1.5 py-0.2 text-[10px] rounded-none">PORTFOLIO ARCHIVE</span>
              <span>✦ CREATIVE DEVELOPER & EDTECH ARCHITECT</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>AVAILABLE FOR PROJECTS</span>
              </span>
              <span>✦ BANJARMASIN, ID</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Neo-Brutalist Navigation Bar */}
      <nav className="bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white px-4 md:px-8 py-3 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Sticker */}
          <a
            href="#hero"
            onMouseEnter={() => setCursor({ active: true, text: "BWORIEY" })}
            onMouseLeave={resetCursor}
            className="flex items-center gap-2 group text-inherit no-underline focus-visible:ring-2 focus-visible:ring-[#FFE500] focus-visible:outline-none"
          >
            <div className="bg-black text-[#FFE500] dark:bg-[#FFE500] dark:text-black font-display font-black text-xl md:text-2xl px-2.5 py-1 tracking-tighter border-2 border-black dark:border-white shadow-[3px_3px_0px_#FF5C00] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
              BWORIEY
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FF5C00] text-white border-2 border-black rotate-[-2deg] shadow-[2px_2px_0px_#000]">
              v2.6
            </span>
          </a>

          {/* Desktop Nav Links with Dynamic Spring layoutId Highlight */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: NavLinkItem) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => setCursor({ active: true, text: link.name })}
                  onMouseLeave={resetCursor}
                  className="relative font-mono text-xs font-bold px-3.5 py-1.5 transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#FFE500] focus-visible:outline-none z-10"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute inset-0 bg-black dark:bg-[#FFE500] border-2 border-black dark:border-white shadow-[2px_2px_0px_#0047FF] -z-10"
                    />
                  )}
                  <span
                    className={`text-[10px] ${
                      isActive
                        ? "text-[#FFE500] dark:text-black font-black"
                        : "opacity-60 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {link.num ? `${link.num}.` : "✦"}
                  </span>
                  <span
                    className={
                      isActive
                        ? "text-[#FFE500] dark:text-black font-black"
                        : "text-black dark:text-white hover:text-[#0047FF] dark:hover:text-[#FFE500]"
                    }
                  >
                    {link.name}
                  </span>
                </motion.a>
              );
            })}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Mode"
              onMouseEnter={() => setCursor({ active: true, text: theme === "dark" ? "LIGHT" : "DARK" })}
              onMouseLeave={resetCursor}
              className="p-2 border-2 border-black dark:border-white bg-white dark:bg-[#1A1A1A] text-black dark:text-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FFE500] focus-visible:outline-none"
            >
              {theme === "dark" ? <Sun size={16} className="text-[#FFE500]" /> : <Moon size={16} />}
            </button>

            {/* Desktop Contact CTA with Magnetic feel */}
            <MagneticButton strength={0.3}>
              <a
                href="#contact"
                onMouseEnter={() => setCursor({ active: true, text: "KONTAK" })}
                onMouseLeave={resetCursor}
                className="hidden sm:flex items-center gap-1.5 bg-[#FFE500] text-black font-display font-black text-xs px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all no-underline focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
              >
                <span>HUBUNGI SAYA</span>
                <ArrowUpRight size={14} className="stroke-[3]" />
              </a>
            </MagneticButton>

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 border-2 border-black dark:border-white bg-[#FFE500] text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer with Staggered Framer Motion Reveal */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#F4F4F0] dark:bg-[#0A0A0A] border-b-4 border-black dark:border-white px-6 py-6 overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
              className="flex flex-col gap-3"
            >
              {navLinks.map((link: NavLinkItem) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 24 } },
                  }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-3 border-2 border-black dark:border-white bg-white dark:bg-[#1A1A1A] font-display font-black text-lg tracking-tight shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#FFF] active:translate-x-0.5 active:translate-y-0.5 no-underline text-inherit"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#FF5C00]">{link.num || "✦"}</span>
                    <span>{link.name}</span>
                  </span>
                  <ArrowUpRight size={18} />
                </motion.a>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
                }}
                className="pt-2 flex flex-col gap-2"
              >
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 bg-[#FFE500] text-black font-display font-black text-center text-sm border-2 border-black shadow-[4px_4px_0px_#000] no-underline block hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                  HUBUNGI SAYA SEKARANG
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
