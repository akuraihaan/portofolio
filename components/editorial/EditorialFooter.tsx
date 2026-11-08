"use client";

import React from "react";
import { ArrowUp } from "lucide-react";

export function EditorialFooter({
  ownerName = "Taufik Raihandani",
}: {
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-black/[0.08] dark:border-white/[0.1] bg-[#F5F5F7] dark:bg-[#000000] py-14 px-6 md:px-8 text-xs text-[#86868B] font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <span className="font-display font-bold text-lg text-[#1D1D1F] dark:text-[#F5F5F7] block">
              BWORIEY
            </span>
            <span className="text-xs text-[#86868B] block mt-0.5">
              {ownerName} · S.Pd. Pendidikan Komputer ULM (2026) · Bangkit 2024 Alumnus
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px]">
          <div>
            <span>LAT -3.3167 / LON 114.5900 · Banjarmasin, Kalimantan Selatan</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
            >
              GitHub
            </a>
            <span>·</span>
            <a
              href="https://linkedin.com/in/taufik-raihandani"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://instagram.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] transition-colors"
            >
              Instagram
            </a>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} BWORIEY. Built with Next.js 16 &amp; Motion.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
