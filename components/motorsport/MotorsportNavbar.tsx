"use client";

/**
 * MotorsportNavbar — Upgraded with:
 * - Full-screen overlay menu on mobile with staggered item entrance
 * - Animated close / hamburger button
 * - Animated nav indicator using layoutId
 * - Magnetic hover on desktop links
 * - AnimatePresence-driven menu transitions
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASINGS, SPRINGS, staggerContainer, staggerItem } from "../motion/MotionSystem";
import { useMotionContext } from "../motion/MotionProvider";

const navItems = [
  { id: "tentang",    label: "ABOUT" },
  { id: "keahlian",  label: "SKILLS" },
  { id: "proyek",    label: "PROJECTS" },
  { id: "pengalaman",label: "EXPERIENCE" },
  { id: "riset",     label: "RESEARCH" },
  { id: "kontak",    label: "CONTACT" },
];

export function MotorsportNavbar() {
  const [active, setActive] = useState("beranda");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = ["beranda", ...navItems.map((n) => n.id)];
      const pos = window.scrollY + 200;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) { setActive(ids[i]); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F5F5F0]/90 dark:bg-[#111111]/90 backdrop-blur-md border-b border-[#333333]/15 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => scrollTo("beranda")}
            className="group flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Kembali ke atas"
          >
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#111111] dark:text-[#F5F5F0]">
              BWORIEY
            </span>
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#D1FF00]"
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
                  onMouseLeave={resetCursor}
                  className={`relative font-mono text-[11px] uppercase tracking-[0.1em] transition-colors py-1 cursor-pointer focus:outline-none ${
                    isActive
                      ? "text-[#111111] dark:text-[#F5F5F0] font-semibold"
                      : "text-[#555555] hover:text-[#111111] dark:hover:text-[#F5F5F0]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D1FF00]"
                      transition={SPRINGS.snappy}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => scrollTo("kontak")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-mono text-[11px] font-semibold uppercase tracking-[0.06em] hover:brightness-105 transition-all shadow-sm cursor-pointer"
            >
              <span>CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Animated hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer focus:outline-none"
              aria-label={menuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#111111] dark:bg-[#F5F5F0] origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#111111] dark:bg-[#F5F5F0] origin-center"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#111111] dark:bg-[#F5F5F0] origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASINGS.expo }}
            className="fixed inset-0 z-40 bg-[#111111] flex flex-col justify-between p-8 md:hidden overflow-hidden"
          >
            {/* Nav items staggered entrance */}
            <motion.nav
              className="mt-24 flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.07, 0.15)}
              aria-label="Menu Navigasi Mobile"
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={staggerItem}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left font-editorial text-[clamp(2.2rem,8vw,4rem)] font-bold uppercase leading-tight tracking-tight py-2 border-b border-[#333333]/40 flex items-center justify-between cursor-pointer focus:outline-none ${
                    active === item.id ? "text-[#D1FF00]" : "text-[#F5F5F0] hover:text-[#D1FF00]"
                  } transition-colors`}
                >
                  <span>{item.label}</span>
                  {active === item.id && (
                    <span className="font-mono text-xs text-[#D1FF00] tracking-widest">ACTIVE</span>
                  )}
                </motion.button>
              ))}
            </motion.nav>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASINGS.editorial }}
              className="pb-safe"
            >
              <button
                onClick={() => scrollTo("kontak")}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <p className="font-mono text-[10px] text-[#555555] text-center mt-4 tracking-wider">
                BWORIEY · TAUFIK RAIHANDANI · BANJARMASIN, ID
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
