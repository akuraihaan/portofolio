"use client";

import React from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

interface MotorsportFooterProps {
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}

export function MotorsportFooter({
  ownerName = "Taufik Raihandani",
}: MotorsportFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#111111] py-16 px-6 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Contained Rounded Panel with Full Lime Border Frame (DESIGN.md Footer Pattern) */}
        <div className="rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00] p-8 sm:p-12 shadow-2xl flex flex-col justify-between gap-12">
          {/* Top Zone: Brand Wordmark & Back to Top */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-[#333333]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#F5F5F0]">
                  BWORIEY
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D1FF00]" />
              </div>
              <p className="font-mono text-xs text-[#888888]">
                {ownerName} &middot; S.Pd. Pendidikan Komputer ULM &middot; Bangkit Academy 2024 Alumnus
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-[#111111] text-[#D1FF00] border border-[#333333] hover:border-[#D1FF00] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>KEMBALI KE ATAS</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          {/* Middle Three-Zone Navigation (DESIGN.md) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono">
            {/* Zone 1: Directory Links */}
            <div className="space-y-3">
              <span className="text-[#D1FF00] font-bold uppercase tracking-widest block mb-2">
                DIREKTORI UTAMA
              </span>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li>
                  <button onClick={() => scrollTo("beranda")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    00 // BERANDA UTAMA
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("tentang")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    01 // TENTANG SAYA
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("keahlian")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    02 // KEAHLIAN &amp; SPESIFIKASI
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("proyek")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    03 // PROJECT GALLERY
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("pengalaman")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    04 // PENGALAMAN &amp; PENDIDIKAN
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("sertifikat")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    05 // SERTIFIKASI RESMI
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("riset")} className="hover:text-[#D1FF00] transition-colors cursor-pointer">
                    06 // RISET &amp; ARTIKEL
                  </button>
                </li>
              </ul>
            </div>

            {/* Zone 2: Kanal Sosial */}
            <div className="space-y-3">
              <span className="text-[#D1FF00] font-bold uppercase tracking-widest block mb-2">
                KANAL REKAYASA &amp; SOSIAL
              </span>
              <ul className="space-y-2 text-[#CCCCCC]">
                <li>
                  <a
                    href="https://github.com/bworiey"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#D1FF00] transition-colors flex items-center gap-1.5"
                  >
                    <span>GITHUB // @BWORIEY</span>
                    <ArrowUpRight className="w-3 h-3 text-[#555555]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/taufik-raihandani"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#D1FF00] transition-colors flex items-center gap-1.5"
                  >
                    <span>LINKEDIN // TAUFIK RAIHANDANI</span>
                    <ArrowUpRight className="w-3 h-3 text-[#555555]" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/bworiey"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#D1FF00] transition-colors flex items-center gap-1.5"
                  >
                    <span>INSTAGRAM // @BWORIEY</span>
                    <ArrowUpRight className="w-3 h-3 text-[#555555]" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:raihandani270204@gmail.com"
                    className="hover:text-[#D1FF00] transition-colors flex items-center gap-1.5"
                  >
                    <span>EMAIL // RESMI</span>
                    <ArrowUpRight className="w-3 h-3 text-[#555555]" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Zone 3: Standard & Production Architecture */}
            <div className="space-y-3">
              <span className="text-[#D1FF00] font-bold uppercase tracking-widest block mb-2">
                TEKNOLOGI SISTEM
              </span>
              <p className="text-[#AAAAAA] leading-relaxed">
                Dibangun dengan Next.js 16 App Router, TypeScript, Tailwind CSS, Framer Motion, dan Supabase PostgreSQL. Dideploy di Vercel Edge Network.
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-[#111111] text-[#D1FF00] border border-[#333333] font-bold">
                  VERCEL PRODUCTION DEPLOYMENT
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Geolocation Strip */}
          <div className="pt-6 border-t border-[#333333] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#888888]">
            <div>
              &copy; {new Date().getFullYear()} BWORIEY (Taufik Raihandani). Seluruh hak cipta dilindungi.
            </div>
            <div className="flex items-center gap-4">
              <span>LAT -3.3167 / LON 114.5900</span>
              <span className="text-[#333333]">&bull;</span>
              <span className="text-[#D1FF00]">BANJARMASIN, INDONESIA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
