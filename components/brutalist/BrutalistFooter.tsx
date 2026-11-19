"use client";

import React from "react";
import { ArrowUp, Terminal, Heart, Sparkles, MapPin, Globe } from "lucide-react";

interface BrutalistFooterProps {
  ownerName?: string;
  brandName?: string;
  locationText?: string;
  availabilityStatus?: string;
}

export function BrutalistFooter({
  ownerName = "TAUFIK RAIHANDANI",
  brandName = "BWORIEY",
  locationText = "Banjarmasin, Kalimantan Selatan, Indonesia",
  availabilityStatus = "Terbuka untuk posisi Full-time Software Engineer, Freelance Web Projects, & Kolaborasi Riset Edukasi.",
}: BrutalistFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-black text-[#F4F4F0] pt-16 md:pt-24 pb-12 px-4 md:px-8 border-t-4 border-black dark:border-white overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        {/* Top Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b-2 border-neutral-800">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-black text-[#FFE500] mb-2">
              <MapPin size={14} />
              <span>GEOLOKASI OPERASIONAL</span>
            </div>
            <p className="font-mono text-sm text-neutral-300">
              {locationText}<br />
              <span className="text-neutral-500 text-xs">LAT -3.3167 / LON 114.5900 (WITA / UTC+8)</span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-black text-[#FF5C00] mb-2">
              <Globe size={14} />
              <span>STATUS KETERSEDIAAN</span>
            </div>
            <p className="font-mono text-sm text-neutral-300">
              {availabilityStatus}
            </p>
          </div>

          <div className="flex flex-col md:items-end justify-between">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 bg-[#FFE500] text-black font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#FF5C00] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer w-fit"
            >
              <ArrowUp size={16} className="stroke-[3]" />
              <span>KEMBALI KE ATAS</span>
            </button>
          </div>
        </div>

        {/* Massive Oversized Experimental Display Typography */}
        <div className="py-12 md:py-16 text-center overflow-hidden">
          <div className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-tighter leading-none text-neutral-900 select-none hover:text-[#FFE500] transition-colors duration-300">
            {brandName}
          </div>
          <div className="font-mono text-xs sm:text-sm md:text-base font-black tracking-widest text-neutral-400 mt-2 uppercase">
            {ownerName} — EXPERIMENTAL BRUTALIST ARCHIVE
          </div>
        </div>

        {/* Bottom Copyright & Tech Stack Spec */}
        <div className="pt-8 border-t-2 border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {brandName} // Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">NEXT.JS 16 • TYPESCRIPT • TAILWIND • SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
