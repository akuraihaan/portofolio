"use client";

/**
 * MotorsportHero — Ultra-interactive editorial hero section.
 *
 * Features:
 * - SplitText character-by-character word reveal on mount
 * - 3D spring tilt on Driver Card (pointer tracking)
 * - Pointer-based background parallax
 * - Scroll-linked hero scale + opacity transform
 * - Kinetic velocity-aware marquee ticker
 * - Magnetic CTAs
 * - Atmospheric aerodynamic line art SVG
 * - Fully responsive, reduced-motion safe
 */
import React, { useRef, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { MotorsportAtmosphericLines } from "./MotorsportAtmosphericLines";
import { MagneticButton } from "../motion/MagneticButton";
import { SplitText } from "../motion/SplitText";
import { MotionMarquee } from "../motion/MotionMarquee";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, SPRINGS, DURATION, VIEWPORT_PARTIAL } from "../motion/MotionSystem";

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
  const heroRef = useRef<HTMLElement>(null);

  // ── Scroll-linked hero transform ──────────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY      = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.6], [1, 0.94]);

  // ── Pointer-based background parallax ────────────────────────
  const ptrX = useMotionValue(0);
  const ptrY = useMotionValue(0);
  const bgX = useSpring(useTransform(ptrX, [-0.5, 0.5], [-12, 12]), { stiffness: 60, damping: 20 });
  const bgY = useSpring(useTransform(ptrY, [-0.5, 0.5], [-8, 8]), { stiffness: 60, damping: 20 });

  // ── 3D spring tilt on Driver Card ────────────────────────────
  const cardMX = useMotionValue(0);
  const cardMY = useMotionValue(0);
  const rotX = useSpring(useTransform(cardMY, [-0.5, 0.5], [12, -12]), SPRINGS.tilt);
  const rotY = useSpring(useTransform(cardMX, [-0.5, 0.5], [-12, 12]), SPRINGS.tilt);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (prefersReduced || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ptrX.set(x);
    ptrY.set(y);
  }, [prefersReduced, ptrX, ptrY]);

  const handleCardPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardMX.set(x);
    cardMY.set(y);
  }, [prefersReduced, cardMX, cardMY]);

  const handleCardLeave = useCallback(() => {
    cardMX.set(0);
    cardMY.set(0);
  }, [cardMX, cardMY]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      ref={heroRef}
      id="beranda"
      onPointerMove={handlePointerMove}
      style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
      className="relative w-full max-w-7xl mx-auto pt-32 pb-20 md:pt-40 md:pb-32 px-6 sm:px-8 min-h-[92vh] flex flex-col justify-between overflow-hidden"
    >
      {/* Background parallax layer */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <MotorsportAtmosphericLines />
      </motion.div>

      {/* Top spec header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, delay: 0.1, ease: EASINGS.editorial }}
        className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#333333]/15 mb-12"
      >
        <span className="font-mono text-xs text-[#111111] dark:text-[#F5F5F0] font-semibold tracking-wider">
          00 // EDITORIAL MOTORSPORT PORTFOLIO
        </span>
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            className="inline-block w-2 h-2 rounded-full bg-[#D1FF00]"
          />
          <span className="font-mono text-xs text-[#111111] dark:text-[#F5F5F0] font-medium tracking-wide">
            AVAILABLE FOR ENGINEERING &amp; RESEARCH COLLABORATION
          </span>
        </div>
      </motion.div>

      {/* Main 1:2 asymmetric composition */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto">

        {/* LEFT: 3D tilt driver card (1/3) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: DURATION.slow, delay: 0.25, ease: EASINGS.fluid }}
          className="lg:col-span-4 flex flex-col items-center lg:items-start [perspective:1000px]"
        >
          <motion.div
            style={prefersReduced ? {} : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardLeave}
            className="relative w-full max-w-[340px] aspect-[4/5] rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00]/40 overflow-hidden shadow-2xl flex flex-col justify-between p-6 group hover:border-[#D1FF00] hover:shadow-[0_24px_60px_rgba(209,255,0,0.14)] transition-all duration-500"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D1FF00] bg-[#111111] px-2.5 py-1 rounded">
                DRIVER // CREATIVE DEV
              </span>
              <span className="font-mono text-xs text-[#555555]">ULM · 2026</span>
            </div>

            <div className="relative my-auto flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={ownerName} className="w-full h-full object-cover filter contrast-105" />
              ) : (
                <div className="text-center py-8">
                  <div className="w-28 h-28 mx-auto rounded-full border-2 border-[#D1FF00] flex items-center justify-center relative mb-4">
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center">
                      <span className="font-editorial text-4xl font-bold text-[#F5F5F0] tracking-tighter">TR</span>
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 bg-[#D1FF00] text-[#111111] font-mono text-[9px] font-bold uppercase tracking-widest rounded">
                      BWORIEY
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#555555] uppercase tracking-wider">TAUFIK RAIHANDANI</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#333333] flex items-center justify-between font-mono text-xs">
              <span className="text-[#555555]">PROYEK: {projectCount}</span>
              <span className="text-[#D1FF00] font-bold">SERTIF: {certificateCount}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: editorial typography (2/3) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Headline */}
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#555555] block mb-3 font-medium">
              FULL-STACK DEVELOPER · CLOUD COMPUTING · EDUCATIONAL TECHNOLOGY
            </span>
            <h1 className="font-hero-display text-[clamp(3.5rem,7.5vw,7.5rem)] text-[#111111] dark:text-[#F5F5F0] uppercase tracking-[-0.03em] leading-[0.9] font-bold">
              <SplitText text="BWORIEY" type="chars" immediate />
            </h1>
            <h2 className="font-hero-display text-[clamp(2.5rem,5.5vw,5.5rem)] text-[#555555] dark:text-[#888888] uppercase tracking-[-0.03em] leading-[0.92] font-bold mt-1">
              <SplitText text="TAUFIK RAIHANDANI" type="words" delay={0.3} immediate />
            </h2>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.55, ease: EASINGS.editorial }}
            className="max-w-2xl"
          >
            <p className="font-body-editorial text-base sm:text-lg text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-light">
              {description}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.7, ease: EASINGS.editorial }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <MagneticButton
              onClick={() => scrollTo("proyek")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-[0.05em] hover:brightness-105 active:scale-95 transition-all shadow-md cursor-pointer"
              onMouseEnter={() => setCursor({ active: true, text: "LIHAT PROYEK", variant: "project" })}
              onMouseLeave={resetCursor}
            >
              <span>EXPLORE PROJECTS</span>
              <ArrowDownRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollTo("kontak")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-[0.75rem] bg-transparent text-[#111111] dark:text-[#F5F5F0] border border-[#111111] dark:border-[#F5F5F0] font-sans text-xs font-medium uppercase tracking-[0.05em] hover:bg-[#111111] hover:text-[#D1FF00] dark:hover:bg-[#F5F5F0] dark:hover:text-[#111111] active:scale-95 transition-all cursor-pointer"
              onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
              onMouseLeave={resetCursor}
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
                onMouseEnter={() => setCursor({ active: true, variant: "link" })}
                onMouseLeave={resetCursor}
              >
                <Download className="w-3.5 h-3.5" />
                <span>RESUME (CV)</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Kinetic marquee ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, delay: 0.9, ease: EASINGS.editorial }}
        className="relative z-10 mt-10 border-y border-[#333333]/15 py-3 select-none"
      >
        <MotionMarquee speed={0.8}>
          <div className="flex items-center gap-6 px-4 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#555555] dark:text-[#AAAAAA] uppercase">
            <span className="text-[#D1FF00]">✦</span>
            <span>FULL-STACK WEB DEVELOPMENT</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>CLOUD COMPUTING ARCHITECTURE</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>EDUCATIONAL TECHNOLOGY &amp; PEDAGOGY</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>BANGKIT ACADEMY 2024 CAPSTONE LEAD</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>NEXT.JS &amp; TAILWIND CSS</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>DISTRIBUTED SYSTEMS</span>
            <span className="text-[#D1FF00]">✦</span>
            <span>INTERACTIVE LEARNING SYSTEMS</span>
          </div>
        </MotionMarquee>
      </motion.div>

      {/* Bottom telemetry strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, delay: 1.0, ease: EASINGS.editorial }}
        className="relative z-10 pt-8 mt-6 border-t border-[#333333]/15 flex flex-wrap items-center justify-between gap-6 font-mono text-xs text-[#555555]"
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
    </motion.section>
  );
}
