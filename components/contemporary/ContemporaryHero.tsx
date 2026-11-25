"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowDown, Download, Mail, Sparkles } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";
import { ContemporaryAbstractSculpture } from "./ContemporaryAbstractSculpture";
import { MagneticButton } from "../motion/MagneticButton";
import { useMotionContext } from "../motion/MotionProvider";

interface ContemporaryHeroProps {
  ownerName?: string;
  description?: string;
  resumeUrl?: string;
  projectCount?: number;
  certificateCount?: number;
}

export function ContemporaryHero({
  ownerName = "TAUFIK RAIHANDANI",
  description = "Lulusan Sarjana Pendidikan Komputer Universitas Lambung Mangkurat dan Alumnus Bangkit Academy 2024 (Google, GoTo, Tokopedia, Traveloka). Berfokus pada Web Development, UI/UX Architecture, Educational Technology, dan Software Engineering.",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
  projectCount = 7,
  certificateCount = 5,
}: ContemporaryHeroProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

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
      className="relative w-full max-w-7xl mx-auto pt-32 pb-16 md:pt-44 md:pb-24 px-6 sm:px-8 min-h-[92vh] flex flex-col justify-between"
    >
      {/* Top Metadata & Availability Status */}
      <motion.div
        {...anim(0)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.08] dark:border-white/[0.1] mb-8"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#2563EB] dark:text-[#C8F169] font-bold">
            00 // CREATIVE DEVELOPER PORTFOLIO
          </span>
          <span className="text-black/20 dark:text-white/20">/</span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
            EDISI 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-[#121214] dark:text-[#F4F4F6] font-medium tracking-wide">
            Tersedia untuk Posisi Rekayasa &amp; Kolaborasi Riset
          </span>
        </div>
      </motion.div>

      {/* Main Asymmetric Grid: Typography Left (7 cols) + Abstract Sculpture Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
        {/* Left Column: Identity & Master Headline */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div {...anim(0.06)}>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-[0.2em]">
              <span>BWORIEY</span>
              <span>·</span>
              <span>COMPUTER SCIENCE EDUCATION GRADUATE</span>
            </div>
            <h1 className="font-display font-black text-[clamp(2.75rem,7.5vw,6.5rem)] tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-[0.92] uppercase">
              {ownerName}
            </h1>
          </motion.div>

          <motion.div {...anim(0.14)}>
            <h2 className="font-display font-medium text-[clamp(1.4rem,2.8vw,2.4rem)] tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-[1.18]">
              &ldquo;Merancang dan membangun pengalaman digital melalui teknologi.&rdquo;
            </h2>
          </motion.div>

          <motion.p
            {...anim(0.22)}
            className="font-sans text-base sm:text-lg text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-xl font-normal"
          >
            {description}
          </motion.p>

          {/* Action CTAs with Magnetic Effect */}
          <motion.div {...anim(0.3)} className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton strength={0.25}>
              <button
                onClick={() => scrollTo("proyek")}
                onMouseEnter={() => setCursor({ active: true, text: "PROYEK" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] hover:bg-[#2563EB] dark:hover:bg-[#C8F169] dark:hover:text-[#121214] transition-all cursor-pointer shadow-sm group"
              >
                <span>Eksplorasi Proyek</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </MagneticButton>

            <MagneticButton strength={0.25}>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setCursor({ active: true, text: "RESUME" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider border border-black/15 dark:border-white/20 text-[#121214] dark:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                <Download className="w-4 h-4 text-[#71717A]" />
                <span>Unduh CV (PDF)</span>
              </a>
            </MagneticButton>

            <button
              onClick={() => scrollTo("kontak")}
              onMouseEnter={() => setCursor({ active: true, text: "KONTAK" })}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono font-medium text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Hubungi Saya</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Creative Interactive Abstract Composition */}
        <motion.div
          {...anim(0.18)}
          className="lg:col-span-5 flex items-center justify-center lg:justify-end"
        >
          <ContemporaryAbstractSculpture />
        </motion.div>
      </div>

      {/* Bottom Editorial Statistics Strip */}
      <motion.div
        {...anim(0.38)}
        className="mt-12 pt-8 border-t border-black/[0.08] dark:border-white/[0.1] grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            3.54<span className="text-xs font-mono text-[#71717A] ml-1">/ 4.00</span>
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            IPK · ULM (Magna Cum Laude)
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            S.Pd. 2026
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Pendidikan Komputer
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            GCP Alumnus
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Bangkit Cloud Computing
          </span>
        </div>

        <div className="space-y-1">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
            {projectCount}+ Karya
          </span>
          <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block">
            Sistem Web &amp; Riset Teruji
          </span>
        </div>
      </motion.div>
    </section>
  );
}
