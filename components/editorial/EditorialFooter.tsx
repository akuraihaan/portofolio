"use client";

import { ArrowUp, Compass } from "lucide-react";
import { MagneticElement } from "../motion/MagneticElement";
import { useMotionContext } from "../motion/MotionProvider";

interface EditorialFooterProps {
  ownerName?: string;
  socialLinks?: Array<{ platform: string; url: string; label?: string }>;
}

export function EditorialFooter({
  ownerName = "Taufik Raihandani",
  socialLinks,
}: EditorialFooterProps) {
  const { setCursor, resetCursor } = useMotionContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const defaultLinks = [
    { label: "GitHub", url: "https://github.com/bworiey" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/taufik-raihandani" },
    { label: "Instagram", url: "https://instagram.com/bworiey" },
  ];

  const links =
    socialLinks && socialLinks.length > 0
      ? socialLinks.map((s) => ({ label: s.label || s.platform, url: s.url }))
      : defaultLinks;

  return (
    <footer className="w-full border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 bg-[#F4F3EE] dark:bg-[#111310] py-20 px-6 md:px-12 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-16">
        {/* Top Row: Brand & Back to Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-12 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10">
          <div>
            <span className="font-display font-black text-2xl tracking-tight text-[#171816] dark:text-[#F4F3EE] block mb-1">
              BWORIEY®
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] block">
              {ownerName} · Computer Education & Web Engineering
            </span>
          </div>

          <MagneticElement strength={0.3}>
            <button
              onClick={scrollToTop}
              onMouseEnter={() => setCursor({ active: true, text: "TOP" })}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#171816]/15 dark:border-[#F4F3EE]/20 bg-white dark:bg-[#1C1F1A] font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE] hover:bg-black/5 dark:hover:bg-white/5 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4 text-[#C8F169]" />
            </button>
          </MagneticElement>
        </div>

        {/* Oversized BWORIEY Wordmark */}
        <div className="py-4 text-center overflow-hidden">
          <div className="font-display font-black tracking-tighter text-[15vw] leading-none text-[#171816]/10 dark:text-[#F4F3EE]/10 select-none hover:text-[#C8F169]/30 transition-colors duration-500">
            BWORIEY
          </div>
        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-[#777970] dark:text-[#A1A49A] pt-8 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10">
          <div className="md:col-span-5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider block text-[#777970]/60 dark:text-[#A1A49A]/60">
              Geographic Coordinates
            </span>
            <span className="text-[#171816] dark:text-[#F4F3EE] font-bold block">
              LAT -3.3167 / LON 114.5900 · Banjarmasin, Kalimantan Selatan
            </span>
            <span className="block text-[11px]">
              Alumnus Universitas Lambung Mangkurat (2026) · S.Pd. Komputer
            </span>
          </div>

          <div className="md:col-span-4 flex items-center flex-wrap gap-4 my-auto">
            {links.map((link, idx) => (
              <span key={link.url} className="flex items-center gap-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold hover:text-[#171816] dark:hover:text-[#C8F169] transition-colors relative group"
                >
                  <span>{link.label}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#C8F169] transition-all group-hover:w-full" />
                </a>
                {idx < links.length - 1 && <span className="opacity-30">/</span>}
              </span>
            ))}
          </div>

          <div className="md:col-span-3 text-left md:text-right my-auto">
            <p className="text-[11px]">
              © {new Date().getFullYear()} BWORIEY. All rights reserved.
            </p>
            <p className="text-[10px] opacity-60 mt-0.5">
              Built with Next.js, Tailwind CSS & Motion.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
