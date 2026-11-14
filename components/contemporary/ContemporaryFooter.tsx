"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

export function ContemporaryFooter({
  ownerName = "Taufik Raihandani",
}: {
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#080809] py-16 px-6 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Top Directory Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <span className="font-display font-black text-xl text-[#121214] dark:text-[#F4F4F6] block">
              BWORIEY
            </span>
            <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] block mt-1">
              {ownerName} · S.Pd. Pendidikan Komputer ULM (2026) · Bangkit Academy 2024 Alumnus
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider text-[#121214] dark:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer border border-black/10 dark:border-white/10"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Metadata & Geolocation Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono text-xs text-[#71717A] dark:text-[#A1A1AA]">
          <div>
            <span>LAT -3.3167 / LON 114.5900 · Banjarmasin, Kalimantan Selatan, Indonesia</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors"
            >
              GitHub
            </a>
            <span>·</span>
            <a
              href="https://linkedin.com/in/taufik-raihandani"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://instagram.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors"
            >
              Instagram
            </a>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} BWORIEY. Dikembangkan dengan Next.js &amp; Supabase.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
