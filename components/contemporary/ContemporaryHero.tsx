"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowDown, Download, Mail } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface ContemporaryHeroProps {
  ownerName?: string;
  description?: string;
  resumeUrl?: string;
}

export function ContemporaryHero({
  ownerName = "TAUFIK RAIHANDANI",
  description = "Pengembang web dengan latar belakang Pendidikan Komputer yang berfokus pada pengembangan aplikasi web, teknologi pendidikan, dan pengalaman digital interaktif.",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
}: ContemporaryHeroProps) {
  const prefersReduced = useReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const anim = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="beranda"
      className="relative w-full max-w-7xl mx-auto pt-36 pb-20 md:pt-48 md:pb-32 px-6 sm:px-8 min-h-[92vh] flex flex-col justify-between"
    >
      {/* Top Metadata & Availability Status */}
      <motion.div
        {...anim(0)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.08] dark:border-white/[0.1] mb-12"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#2563EB] dark:text-[#C8F169] font-bold">
            00 // PORTOFOLIO UTAMA
          </span>
          <span className="text-black/20 dark:text-white/20">/</span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
            EDISI 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-xs text-[#121214] dark:text-[#F4F4F6] font-medium tracking-wide">
            Tersedia untuk Posisi Rekayasa &amp; Kolaborasi Riset
          </span>
        </div>
      </motion.div>

      {/* Main Asymmetric Typographic Composition */}
      <div className="space-y-8 my-auto">
        {/* Name Display */}
        <motion.div {...anim(0.08)}>
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-[#71717A] dark:text-[#A1A1AA] block mb-2">
            PENGEMBANG WEB FULL-STACK &amp; TEKNOLOGI PENDIDIKAN
          </span>
          <h1 className="font-display font-black text-[clamp(2.75rem,8.5vw,7.5rem)] tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-[0.94] uppercase">
            {ownerName}
          </h1>
        </motion.div>

        {/* Master Headline & Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-4 items-start">
          <motion.div {...anim(0.18)} className="lg:col-span-7">
            <h2 className="font-display font-medium text-[clamp(1.5rem,3.2vw,2.75rem)] tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-[1.15]">
              &ldquo;Merancang dan membangun pengalaman digital melalui teknologi.&rdquo;
            </h2>
          </motion.div>

          <motion.div {...anim(0.26)} className="lg:col-span-5 space-y-6">
            <p className="font-sans text-base sm:text-lg text-[#71717A] dark:text-[#A1A1AA] leading-relaxed font-normal">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollTo("proyek")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] hover:bg-[#2563EB] dark:hover:bg-[#C8F169] dark:hover:text-[#121214] transition-all cursor-pointer shadow-sm group"
              >
                <span>Eksplorasi Proyek</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-mono font-medium uppercase tracking-wider border border-black/15 dark:border-white/20 text-[#121214] dark:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                <Download className="w-4 h-4 text-[#71717A]" />
                <span>Unduh CV</span>
              </a>

              <button
                onClick={() => scrollTo("kontak")}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-medium text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Editorial Statistics Strip */}
      <motion.div
        {...anim(0.38)}
        className="mt-16 pt-8 border-t border-black/[0.08] dark:border-white/[0.1] grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            3.54<span className="text-xs font-mono text-[#71717A] ml-1">/ 4.00</span>
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            IPK · Universitas Lambung Mangkurat
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            2026
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Sarjana Pendidikan Komputer (S.Pd.)
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            GCP
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Alumnus Bangkit Cloud Computing
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            7+
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Sistem Perangkat Lunak Tervalidasi
          </span>
        </div>
      </motion.div>

      {/* Subtle Scroll Hint */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASINGS.gentle }}
        className="hidden md:flex items-center gap-2 font-mono text-[11px] text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-widest absolute bottom-8 right-8 cursor-pointer"
        onClick={() => scrollTo("tentang")}
      >
        <span>GULIR KE BAWAH</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.div>
    </section>
  );
}
