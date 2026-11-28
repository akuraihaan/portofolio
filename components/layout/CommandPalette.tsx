"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ArrowRight, Sun, Moon, Copy, Shield, X } from "lucide-react";
import { useTheme } from "../editorial/ThemeContext";
import { SPRINGS } from "../motion/MotionSystem";
import type { MotorsportProjectItem } from "../motorsport/MotorsportGallery";

interface CommandPaletteProps {
  projects?: MotorsportProjectItem[];
  ownerEmail?: string;
}

export function CommandPalette({
  projects = [],
  ownerEmail = "raihandani270204@gmail.com",
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpenCustom = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("bworiey:open-cmd", onOpenCustom);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("bworiey:open-cmd", onOpenCustom);
    };
  }, []);

  const sections = useMemo(
    () => [
      { label: "Tentang", href: "/#about" },
      { label: "Proyek", href: "/#playground" },
      { label: "Keahlian & Teknologi", href: "/#skills" },
      { label: "Pengalaman & Pendidikan", href: "/#experience" },
      { label: "Sertifikat", href: "/#certificates" },
      { label: "Kontak", href: "/#contact" },
    ],
    []
  );

  const q = query.toLowerCase().trim();
  const filteredSections = sections.filter((s) => s.label.toLowerCase().includes(q));
  const filteredProjects = projects
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, 5);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9990] bg-[#1A1917]/75 flex items-start justify-center pt-[14vh] px-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -12 }}
            transition={SPRINGS.snappy}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF8F5] dark:bg-[#1A1917] text-[#000000] dark:text-[#FAF8F5] border border-[#000000]/20 dark:border-[#FAF8F5]/20 rounded-[0.75rem] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#000000]/12 dark:border-[#FAF8F5]/12">
              <Search className="w-4 h-4 text-[#F05A28]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari proyek, bagian, atau perintah..."
                className="flex-1 bg-transparent text-sm font-figtree focus:outline-none placeholder-[#000000]/45 dark:placeholder-[#FAF8F5]/45"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="p-1 hover:bg-[#FFD4C2] dark:hover:bg-[#252420] rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[55vh] overflow-y-auto p-3 space-y-4">
              {filteredProjects.length > 0 && (
                <div>
                  <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#F05A28] block mb-1.5">
                    Proyek
                  </span>
                  {filteredProjects.map((proj) => (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => go(`/projects/${proj.id}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-[0.5rem] hover:bg-[#FFD4C2]/60 dark:hover:bg-[#252420] text-left cursor-pointer transition-colors"
                    >
                      <span className="font-editorial text-lg">{proj.title}</span>
                      <span className="font-mono text-[10px] text-[#000000]/60 dark:text-[#FAF8F5]/60">
                        {proj.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {filteredSections.length > 0 && (
                <div>
                  <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#000000]/55 dark:text-[#FAF8F5]/55 block mb-1.5">
                    Navigasi
                  </span>
                  {filteredSections.map((sec) => (
                    <button
                      key={sec.href}
                      type="button"
                      onClick={() => go(sec.href)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-[0.5rem] hover:bg-[#FFD4C2]/60 dark:hover:bg-[#252420] font-mono text-xs cursor-pointer transition-colors"
                    >
                      <span>{sec.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F05A28]" />
                    </button>
                  ))}
                </div>
              )}

              <div>
                <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-[#000000]/55 dark:text-[#FAF8F5]/55 block mb-1.5">
                  Aksi Cepat
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[0.5rem] hover:bg-[#FFD4C2]/60 dark:hover:bg-[#252420] font-mono text-xs cursor-pointer"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#F05A28]" /> : <Moon className="w-3.5 h-3.5 text-[#F05A28]" />}
                  <span>Ganti Tema ({theme === "dark" ? "Terang" : "Gelap"})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(ownerEmail);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[0.5rem] hover:bg-[#FFD4C2]/60 dark:hover:bg-[#252420] font-mono text-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>Salin Email ({ownerEmail})</span>
                </button>
                <button
                  type="button"
                  onClick={() => go("/admin")}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[0.5rem] hover:bg-[#FFD4C2]/60 dark:hover:bg-[#252420] font-mono text-xs cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#F05A28]" />
                  <span>Buka Admin</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
