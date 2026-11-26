"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { EASINGS } from "../motion/MotionSystem";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "tentang", label: "ABOUT" },
  { id: "keahlian", label: "SKILLS" },
  { id: "proyek", label: "PROJECTS" },
  { id: "pengalaman", label: "EXPERIENCE" },
  { id: "riset", label: "RESEARCH" },
  { id: "kontak", label: "CONTACT" },
];

export function MotorsportNavbar() {
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ["beranda", ...navItems.map((item) => item.id)];
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
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
            ? "bg-[#F5F5F0]/90 dark:bg-[#111111]/90 backdrop-blur-md border-b border-[#333333]/15 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Wordmark */}
          <button
            onClick={() => scrollTo("beranda")}
            className="group flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Kembali ke atas"
          >
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#111111] dark:text-[#F5F5F0]">
              BWORIEY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D1FF00] group-hover:scale-125 transition-transform" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`relative font-sans text-xs uppercase tracking-[0.08em] transition-colors py-1 cursor-pointer focus:outline-none ${
                    isActive
                      ? "text-[#111111] dark:text-[#F5F5F0] font-medium"
                      : "text-[#555555] hover:text-[#111111] dark:hover:text-[#F5F5F0]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D1FF00]"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CTA & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo("kontak")}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-semibold uppercase tracking-[0.05em] hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>CONNECT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#111111] dark:text-[#F5F5F0] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer focus:outline-none"
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: EASINGS.editorial }}
            className="fixed inset-x-0 top-[70px] z-40 bg-[#F5F5F0] dark:bg-[#111111] border-b border-[#333333]/20 p-6 md:hidden shadow-xl"
          >
            <nav className="flex flex-col space-y-4" aria-label="Menu Navigasi Mobile">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left font-sans text-sm uppercase tracking-wider py-2 flex items-center justify-between border-b border-[#333333]/10 cursor-pointer ${
                    activeSection === item.id
                      ? "text-[#111111] dark:text-[#F5F5F0] font-bold"
                      : "text-[#555555]"
                  }`}
                >
                  <span>{item.label}</span>
                  {activeSection === item.id && (
                    <span className="w-2 h-2 rounded-full bg-[#D1FF00]" />
                  )}
                </button>
              ))}

              <button
                onClick={() => scrollTo("kontak")}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <span>GET IN TOUCH</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
