"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { MotorsportAtmosphericLines } from "./MotorsportAtmosphericLines";
import { MagneticButton } from "../motion/MagneticButton";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS } from "../motion/MotionSystem";

interface MotorsportHeroProps {
  ownerName?: string;
  description?: string;
  resumeUrl?: string;
  avatarUrl?: string | null;
  projectCount?: number;
  certificateCount?: number;
}

export function MotorsportHero({
  ownerName = "TAUFIK RAIHANDANI",
  description = "Sarjana Pendidikan Komputer Universitas Lambung Mangkurat dan Alumnus Bangkit Academy 2024 by Google, GoTo, Tokopedia, Traveloka (Cloud Computing Capstone Lead). Berfokus pada arsitektur web modern, pedagogi komputasi interaktif, dan rekayasa cloud berlatensi rendah.",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
  avatarUrl = null,
  projectCount = 7,
  certificateCount = 5,
}: MotorsportHeroProps) {
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
          transition: { duration: 0.7, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="beranda"
      className="relative w-full max-w-7xl mx-auto pt-32 pb-20 md:pt-40 md:pb-32 px-6 sm:px-8 min-h-[92vh] flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative Aerodynamic Wind-Tunnel Atmospheric Lines */}
      <MotorsportAtmosphericLines />

      {/* Top Spec Header */}
      <motion.div
        {...anim(0)}
        className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#333333]/15 mb-12"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#111111] dark:text-[#F5F5F0] font-semibold tracking-wider">
            00 // EDITORIAL MOTORSPORT PORTFOLIO
          </span>
          <span className="text-[#555555]">/</span>
          <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
            BWORIEY EDISI 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D1FF00]" />
          <span className="font-mono text-xs text-[#111111] dark:text-[#F5F5F0] font-medium tracking-wide">
            AVAILABLE FOR ENGINEERING &amp; RESEARCH COLLABORATION
          </span>
        </div>
      </motion.div>

      {/* Asymmetric 1:2 Split Composition (Left 1/3 Imagery, Right 2/3 Typography) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">
        {/* Left Column (4 cols ~ 1/3 ratio): Cut-out Portrait / Monogram Visual */}
        <motion.div
          {...anim(0.12)}
          className="lg:col-span-4 flex flex-col items-center lg:items-start"
        >
          <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00]/40 overflow-hidden shadow-2xl flex flex-col justify-between p-6 group">
            {/* Corner Badge */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D1FF00] bg-[#111111] px-2.5 py-1 rounded">
                DRIVER // CREATIVE DEV
              </span>
              <span className="font-mono text-xs text-[#555555]">ULM &middot; 2026</span>
            </div>

            {/* Visual Portrait / Cut-out Graphic */}
            <div className="relative my-auto flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={ownerName}
                  className="w-full h-full object-cover filter contrast-105"
                />
              ) : (
                <div className="text-center py-8">
                  {/* Abstract Helmet Monogram Wireframe */}
                  <div className="w-28 h-28 mx-auto rounded-full border-2 border-[#D1FF00] flex items-center justify-center relative mb-4">
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center">
                      <span className="font-editorial text-4xl font-bold text-[#F5F5F0] tracking-tighter">
                        TR
                      </span>
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 bg-[#D1FF00] text-[#111111] font-mono text-[9px] font-bold uppercase tracking-widest rounded">
                      BWORIEY
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#555555] uppercase tracking-wider">
                    TAUFIK RAIHANDANI
                  </p>
                </div>
              )}
            </div>

            {/* Card Bottom Meta */}
            <div className="pt-4 border-t border-[#333333] flex items-center justify-between font-mono text-xs">
              <span className="text-[#555555]">PROYEK: {projectCount}</span>
              <span className="text-[#D1FF00] font-bold">SERTIF: {certificateCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column (8 cols ~ 2/3 ratio): High-Contrast Editorial Typography */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Headline */}
          <motion.div {...anim(0.08)}>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#555555] block mb-3 font-medium">
              FULL-STACK DEVELOPER &middot; CLOUD COMPUTING &middot; EDUCATIONAL TECHNOLOGY
            </span>
            <h1 className="font-hero-display text-[clamp(3.5rem,7.5vw,7.5rem)] text-[#111111] dark:text-[#F5F5F0] uppercase tracking-[-0.03em] leading-[0.9] font-bold">
              BWORIEY
            </h1>
            <h2 className="font-hero-display text-[clamp(2.5rem,5.5vw,5.5rem)] text-[#555555] dark:text-[#888888] uppercase tracking-[-0.03em] leading-[0.92] font-bold mt-1">
              TAUFIK RAIHANDANI
            </h2>
          </motion.div>

          {/* Description Prose */}
          <motion.div {...anim(0.16)} className="max-w-2xl">
            <p className="font-body-editorial text-base sm:text-lg text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-light">
              {description}
            </p>
          </motion.div>

          {/* Primary Action Buttons (DESIGN.md specification: solid lime fill, near-black text, rounded-action) */}
          <motion.div
            {...anim(0.22)}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              onClick={() => scrollTo("proyek")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-[0.05em] hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowDownRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollTo("kontak")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[0.75rem] bg-transparent text-[#111111] dark:text-[#F5F5F0] border border-[#111111] dark:border-[#F5F5F0] font-sans text-xs font-medium uppercase tracking-[0.05em] hover:bg-[#111111] hover:text-[#D1FF00] dark:hover:bg-[#F5F5F0] dark:hover:text-[#111111] active:scale-95 transition-all cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-4 font-mono text-xs text-[#555555] hover:text-[#111111] dark:hover:text-[#F5F5F0] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>RESUME (CV)</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Ticker Metric Strip */}
      <motion.div
        {...anim(0.28)}
        className="relative z-10 pt-8 mt-12 border-t border-[#333333]/15 flex flex-wrap items-center justify-between gap-6 font-mono text-xs text-[#555555]"
      >
        <div className="flex items-center gap-6">
          <span>ALMAMATER: <strong className="text-[#111111] dark:text-[#F5F5F0]">PENDIDIKAN KOMPUTER ULM</strong></span>
          <span className="text-[#333333]">&bull;</span>
          <span>CAPSTONE: <strong className="text-[#D1FF00] bg-[#111111] px-2 py-0.5 rounded">BANGKIT 2024 LEAD</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#555555]">LAT -3.3167 / LON 114.5900</span>
          <span className="text-[#111111] dark:text-[#F5F5F0] font-medium">BANJARMASIN, ID</span>
        </div>
      </motion.div>
    </section>
  );
}
