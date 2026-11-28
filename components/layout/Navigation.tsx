"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { EASINGS, SPRINGS, staggerContainer, staggerItem } from "../motion/MotionSystem";
import { useMotionContext } from "../motion/MotionProvider";

const NAV_ITEMS = [
  { id: "about", label: "Tentang" },
  { id: "playground", label: "Proyek" },
  { id: "skills", label: "Keahlian" },
  { id: "experience", label: "Pengalaman" },
  { id: "certificates", label: "Sertifikat" },
  { id: "contact", label: "Kontak" },
];

export function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (!isHome) return;
      const ids = ["hero", ...NAV_ITEMS.map((n) => n.id)];
      const pos = window.scrollY + 220;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= pos) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navigateTo = (id: string) => {
    setMenuOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <>
      {/* Floating Navigation Bar — transitions from transparent top bar to crisp floating bar on scroll */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 px-6 sm:px-8 ${
          scrolled ? "pt-3 pb-2" : "py-6"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled
              ? "bg-[#FAF8F5]/95 dark:bg-[#1A1917]/95 border border-[#000000]/15 dark:border-[#FAF8F5]/15 px-5 py-3 rounded-[0.75rem]"
              : ""
          }`}
        >
          {/* Brand Wordmark */}
          <Link
            href="/"
            onMouseEnter={() => setCursor({ active: true, variant: "link" })}
            onMouseLeave={resetCursor}
            className="inline-flex items-baseline gap-2 group focus:outline-none"
          >
            <span className="font-editorial italic text-2xl sm:text-3xl text-[#000000] dark:text-[#FAF8F5] tracking-tight">
              bworiey
            </span>
            <span className="w-2 h-2 rounded-full bg-[#F05A28] inline-block group-hover:scale-125 transition-transform" />
          </Link>

          {/* Desktop Navigation Cluster */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = isHome && active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
                  onMouseLeave={resetCursor}
                  className={`relative font-mono text-xs uppercase tracking-[0.02em] py-1 cursor-pointer transition-colors focus:outline-none ${
                    isActive
                      ? "text-[#F05A28]"
                      : "text-[#000000]/80 dark:text-[#FAF8F5]/80 hover:text-[#F05A28]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="pgNavIndicator"
                      transition={SPRINGS.snappy}
                      className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#F05A28]"
                    />
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("bworiey:open-cmd"))}
              onMouseEnter={() => setCursor({ active: true, text: "CMD", variant: "hover" })}
              onMouseLeave={resetCursor}
              aria-label="Buka Command Palette"
              className="px-2.5 py-1 rounded-[0.4rem] border border-[#000000]/20 dark:border-[#FAF8F5]/20 font-mono text-[11px] text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:border-[#F05A28] hover:text-[#F05A28] cursor-pointer transition-colors"
            >
              ⌘K
            </button>
            <ThemeToggle />
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("bworiey:open-cmd"))}
              onMouseEnter={() => setCursor({ active: true, text: "CMD", variant: "hover" })}
              onMouseLeave={resetCursor}
              aria-label="Buka Command Palette"
              className="px-2.5 py-1 rounded-[0.4rem] border border-[#000000]/20 dark:border-[#FAF8F5]/20 font-mono text-[11px] text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:border-[#F05A28] hover:text-[#F05A28] cursor-pointer transition-colors"
            >
              ⌘K
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer focus:outline-none"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#000000] dark:bg-[#FAF8F5] origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#000000] dark:bg-[#FAF8F5] origin-center"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={SPRINGS.snappy}
                className="block w-5 h-[1.5px] bg-[#000000] dark:bg-[#FAF8F5] origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={prefersReduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={prefersReduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: EASINGS.expo }}
            className="fixed inset-0 z-50 bg-[#1A1917] text-[#FAF8F5] flex flex-col justify-between p-8 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-editorial italic text-2xl text-[#FAF8F5]">
                bworiey
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={staggerContainer(0.06, 0.12)}
              className="flex flex-col gap-3"
              aria-label="Mobile Navigation"
            >
              {NAV_ITEMS.map((item) => (
                <motion.button
                  key={item.id}
                  variants={staggerItem}
                  onClick={() => navigateTo(item.id)}
                  className="text-left font-editorial italic text-4xl text-[#FAF8F5] hover:text-[#F05A28] py-1.5 border-b border-[#FAF8F5]/15 transition-colors cursor-pointer"
                >
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>

            <div className="font-mono text-xs text-[#C4D94E] flex items-center justify-between">
              <span>TAUFIK RAIHANDANI</span>
              <span>✿ BANJARMASIN, ID</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
