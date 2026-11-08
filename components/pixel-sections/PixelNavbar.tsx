"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal, Sun, Moon, ArrowUpRight } from "lucide-react";
import { useTheme } from "../editorial/ThemeContext";
import { VoxelCube3D } from "../pixel3d/VoxelCube3D";

const navLinks = [
  { href: "#about", label: "ABOUT", code: "01" },
  { href: "#skills", label: "STACK", code: "02" },
  { href: "#projects", label: "PROJECTS", code: "03" },
  { href: "#experience", label: "TIMELINE", code: "04" },
  { href: "#certificates", label: "VAULT", code: "05" },
  { href: "#contact", label: "CONTACT", code: "06" },
];

export function PixelNavbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section spy
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const s of sections.reverse()) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 transition-all duration-200">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 border-2 border-[#171816] dark:border-[#C8F169]/60 bg-white/95 dark:bg-[#111310]/95 backdrop-blur-md transition-shadow duration-200 ${
          scrolled
            ? "shadow-pixel-lg dark:shadow-pixel-lime-lg"
            : "shadow-pixel dark:shadow-pixel-lime"
        }`}
      >
        {/* Brand / Voxel Monogram */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline text-[#171816] dark:text-[#F4F3EE] group"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-pixel text-[11px] font-bold border border-black/40 shadow-sm">
            BW
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg sm:text-xl tracking-tight leading-none text-[#171816] dark:text-[#F4F3EE]">
              BWORIEY
            </span>
            <span className="font-pixel text-[7px] text-[#777970] dark:text-[#A1A49A] tracking-wider mt-0.5">
              SYS.2026 // ONLINE
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation HUD */}
        <nav className="hidden lg:flex items-center gap-1 font-pixel text-[9px]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 transition-all duration-100 flex items-center gap-1.5 no-underline ${
                  isActive
                    ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816]"
                    : "text-[#171816] dark:text-[#F4F3EE] hover:bg-[#171816]/10 dark:hover:bg-[#C8F169]/10"
                }`}
              >
                <span className="text-[7px] opacity-60">[{link.code}]</span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Tools: Coordinates, Theme Toggle, Connect CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Availability Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#C8F169]/20 border border-[#C8F169]/50 font-pixel text-[8px] text-[#171816] dark:text-[#C8F169]">
            <span className="w-2 h-2 bg-[#C8F169] animate-pulse rounded-none" />
            <span>OPEN FOR ROLES</span>
          </div>

          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="p-2 border border-[#171816] dark:border-[#C8F169]/60 bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#C8F169] hover:bg-[#171816]/5 dark:hover:bg-white/5 active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-[#C8F169]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Direct CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border border-[#171816] dark:border-[#C8F169] font-pixel text-[8px] no-underline shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-transform"
          >
            <span>TRANSMIT</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 border border-[#171816] dark:border-[#C8F169] text-[#171816] dark:text-[#F4F3EE]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile HUD Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 max-w-7xl mx-auto border-2 border-[#171816] dark:border-[#C8F169] bg-white dark:bg-[#111310] p-6 shadow-pixel-lg dark:shadow-pixel-lime-lg"
          >
            <div className="flex flex-col gap-2 font-pixel text-[10px]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="p-3 border border-[#171816]/20 dark:border-white/10 hover:bg-[#C8F169] hover:text-[#171816] dark:hover:text-[#171816] transition-colors flex items-center justify-between no-underline text-inherit"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[8px] opacity-60">[{link.code}]</span>
                    <span>{link.label}</span>
                  </span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
              <div className="pt-4 border-t border-[#171816]/10 dark:border-white/10 font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] flex justify-between items-center">
                <span>LAT -3.3167 / LON 114.5900</span>
                <span>BANJARMASIN, ID</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

