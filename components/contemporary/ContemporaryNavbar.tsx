"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "../editorial/ThemeContext";
import { EASINGS } from "../motion/MotionSystem";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "tentang", label: "Tentang" },
  { id: "keahlian", label: "Keahlian" },
  { id: "proyek", label: "Proyek" },
  { id: "pengalaman", label: "Pengalaman" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "sertifikat", label: "Sertifikat" },
  { id: "artikel", label: "Artikel" },
  { id: "kontak", label: "Kontak" },
];

export function ContemporaryNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const sectionIds = ["beranda", ...navItems.map((item) => item.id)];
      const scrollPos = window.scrollY + 180;

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
            ? "bg-[#F8F8F6]/90 dark:bg-[#0B0B0C]/90 backdrop-blur-md border-b border-black/[0.08] dark:border-white/[0.1] py-3.5"
            : "bg-transparent py-5 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo & Availability Status */}
          <button
            onClick={() => scrollTo("beranda")}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
          >
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-[#121214] dark:text-[#F4F4F6] group-hover:text-[#2563EB] dark:group-hover:text-[#C8F169] transition-colors">
              BWORIEY
            </span>
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-black/10 dark:border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                Tersedia
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer relative py-1 ${
                    isActive
                      ? "text-[#121214] dark:text-[#F4F4F6] font-semibold"
                      : "text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] dark:bg-[#C8F169]"
                      transition={{ duration: 0.25, ease: EASINGS.editorial }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer focus:outline-none"
              title={theme === "light" ? "Ganti ke Mode Gelap" : "Ganti ke Mode Terang"}
              aria-label="Ganti Tema"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>

            {/* Resume Button */}
            <a
              href="https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-medium bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] hover:opacity-90 transition-opacity"
            >
              <span>Unduh CV</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#121214] dark:text-[#F4F4F6] focus:outline-none"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: EASINGS.editorial }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#F8F8F6] dark:bg-[#0B0B0C] border-b border-black/[0.08] dark:border-white/[0.1] p-6 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left font-mono text-sm uppercase tracking-wider py-2 text-[#121214] dark:text-[#F4F4F6] border-b border-black/[0.04] dark:border-white/[0.06]"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3">
                <a
                  href="https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-medium bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214]"
                >
                  <span>Unduh CV (PDF)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
