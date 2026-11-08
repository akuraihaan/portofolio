"use client";

import React from "react";
import { ArrowUp, Terminal } from "lucide-react";

export function PixelFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t-2 border-[#171816]/20 dark:border-white/10 bg-white dark:bg-[#0E1013] py-16 px-4 sm:px-8 relative overflow-hidden">
      {/* Background isometric grid */}
      <div className="absolute inset-0 pixel-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col justify-between gap-12">
        {/* Top Tier: Giant Brand Wordmark + Back to top button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-10 border-b border-[#171816]/10 dark:border-white/10">
          <div>
            <span className="font-display font-black text-4xl sm:text-5xl text-[#171816] dark:text-[#F4F3EE] tracking-tight block">
              BWORIEY
            </span>
            <span className="font-pixel text-[8px] sm:text-[9px] text-[#777970] dark:text-[#A1A49A] block mt-1 tracking-wider">
              TAUFIK RAIHANDANI · PIXEL 3D DIGITAL WORLD // 2026 EDITION
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#171816] dark:border-[#C8F169] bg-[#C8F169] text-[#171816] font-pixel text-[8px] font-bold shadow-pixel hover:shadow-pixel-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom Metadata & Coordinates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
          <div className="md:col-span-5 space-y-1">
            <span className="font-pixel text-[8px] text-[#171816] dark:text-[#C8F169] block uppercase">
              GEOGRAPHIC COORDINATES
            </span>
            <span className="text-[#171816] dark:text-[#F4F3EE] block font-bold">
              LAT -3.3167 / LON 114.5900 · Banjarmasin, Kalimantan Selatan
            </span>
            <span className="block text-[11px]">
              Alumnus Universitas Lambung Mangkurat (S.Pd. 2026) · Bangkit 2024 Cohort
            </span>
          </div>

          <div className="md:col-span-4 flex items-center flex-wrap gap-4 font-pixel text-[8px]">
            <a
              href="https://github.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171816] dark:hover:text-[#C8F169] transition-colors no-underline text-inherit"
            >
              [GITHUB]
            </a>
            <span>/</span>
            <a
              href="https://www.linkedin.com/in/taufik-raihandani"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171816] dark:hover:text-[#C8F169] transition-colors no-underline text-inherit"
            >
              [LINKEDIN]
            </a>
            <span>/</span>
            <a
              href="https://instagram.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#171816] dark:hover:text-[#C8F169] transition-colors no-underline text-inherit"
            >
              [INSTAGRAM]
            </a>
          </div>

          <div className="md:col-span-3 text-left md:text-right font-mono text-xs">
            <span className="block text-[#171816] dark:text-[#F4F3EE] font-bold">
              © 2026 BWORIEY. All rights reserved.
            </span>
            <span className="block text-[10px] text-[#777970] dark:text-[#A1A49A] mt-0.5">
              Built with Next.js 16, Motion &amp; Supabase.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

