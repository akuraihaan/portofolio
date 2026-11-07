"use client";

import { ArrowUp, Compass } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";

interface EditorialFooterProps {
  ownerName?: string;
}

export function EditorialFooter({ ownerName = "Taufik Raihandani" }: EditorialFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[#e4e1d7] dark:border-[#222530] bg-[#faf8f5] dark:bg-[#0c0d10] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-12">
        {/* Top Row: Brand & Back to Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-12 border-b border-black/5 dark:border-white/10">
          <div>
            <span className="font-display font-bold text-2xl tracking-tight text-charcoal dark:text-white block mb-1">
              BWORIEY
            </span>
            <span className="font-mono text-xs text-charcoal/50 dark:text-white/40 block">
              {ownerName} · Computer Education & Web Engineering
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-[#14151b] font-mono text-xs text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors self-start sm:self-auto"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-forest dark:text-lime" />
          </button>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-charcoal/60 dark:text-white/50">
          <div className="md:col-span-5 space-y-1">
            <span className="text-charcoal/40 dark:text-white/40 block text-[10px] uppercase">
              Geographic Coordinates
            </span>
            <span className="text-charcoal dark:text-white block">
              LAT -3.3167 / LON 114.5900 · Banjarmasin, Kalimantan Selatan
            </span>
            <span className="block text-[11px]">
              Alumnus Universitas Lambung Mangkurat (2026)
            </span>
          </div>

          <div className="md:col-span-4 flex items-center gap-4">
            <a
              href="https://github.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-charcoal dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span>/</span>
            <a
              href="https://www.linkedin.com/in/taufik-raihandani"
              target="_blank"
              rel="noreferrer"
              className="hover:text-charcoal dark:hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <span>/</span>
            <a
              href="https://instagram.com/bworiey"
              target="_blank"
              rel="noreferrer"
              className="hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>

          <div className="md:col-span-3 text-left md:text-right">
            <span>© 2026 BWORIEY. All rights reserved.</span>
            <span className="block text-[10px] text-charcoal/40 dark:text-white/40 mt-0.5">
              Designed with Modern Editorial Principles.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

