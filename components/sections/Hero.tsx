"use client";

import React, { useRef, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Sparkles } from "lucide-react";
import { InfoCard, TextCard, Sticker, Sprite } from "../collage";
import { SplitText } from "../motion/SplitText";
import { MagneticButton } from "../motion/MagneticButton";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION, SPRINGS } from "../motion/MotionSystem";

interface HeroProps {
  ownerName?: string;
  description?: string;
  resumeUrl?: string;
  avatarUrl?: string | null;
  projectCount?: number;
  certificateCount?: number;
}

/**
 * Hero — Asymmetric editorial collage composition (breaks away from standard 2-column hero).
 * Top: Full-width oversized typographic statement + orbiting draggable sticker.
 * Bottom: Staggered collage cluster of rotated Orange InfoCard, overlapping Peach TextCard, and Magnetic CTAs.
 */
export function Hero({
  ownerName = "Taufik Raihandani",
  description = "Sarjana Pendidikan Komputer Universitas Lambung Mangkurat & Alumnus Bangkit Academy 2024 (Cloud Computing Capstone Lead). Membangun sistem web interaktif, learning analytics, dan arsitektur cloud.",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
  avatarUrl = null,
  projectCount = 7,
  certificateCount = 5,
}: HeroProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const clusterY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const ptrX = useMotionValue(0);
  const ptrY = useMotionValue(0);
  const smoothX = useSpring(useTransform(ptrX, [-0.5, 0.5], [-14, 14]), SPRINGS.fluid);
  const smoothY = useSpring(useTransform(ptrY, [-0.5, 0.5], [-10, 10]), SPRINGS.fluid);
  const titleX = useSpring(useTransform(ptrX, [-0.5, 0.5], [10, -10]), SPRINGS.fluid);
  const titleSkew = useSpring(useTransform(ptrX, [-0.5, 0.5], [-1.2, 1.2]), SPRINGS.fluid);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReduced || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      ptrX.set((e.clientX - rect.left) / rect.width - 0.5);
      ptrY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [prefersReduced, ptrX, ptrY]
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onPointerMove={handlePointerMove}
      className="relative w-full max-w-7xl mx-auto pt-8 pb-24 md:pt-14 md:pb-32 px-6 sm:px-8 overflow-x-clip"
    >
      {/* Sparse Hand-crafted Sprites */}
      <Sprite kind="flower" color="green" size="md" float className="absolute top-6 right-12 hidden md:inline-block" />
      <Sprite kind="star" color="pink" size="sm" delay={0.3} className="absolute bottom-24 left-8 hidden md:inline-block" />
      <Sprite kind="smile" color="ink" size="sm" delay={0.5} className="absolute top-44 right-1/4 hidden lg:inline-block opacity-50" />

      {/* Top Meta Strip */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.medium, ease: EASINGS.editorial }}
        className="flex flex-wrap items-center justify-between gap-4 mb-10"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-[11px] uppercase tracking-[0.05em]">
          <span>✿</span>
          <span>COMPUTER SCIENCE EDUCATION · CREATIVE DEVELOPER</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.05em] text-[#000000]/60 dark:text-[#FAF8F5]/60">
          BANJARMASIN, ID · {projectCount} WORKS · {certificateCount} CERTS
        </span>
      </motion.div>

      {/* Oversized Asymmetric Typographic Statement */}
      <motion.div
        style={prefersReduced ? {} : { y: titleY }}
        className="relative mb-12 md:mb-16"
      >
        {/* Floating Draggable Blue Sticker overlapping headline edge */}
        <Sticker
          tone="blue"
          rotate={-8}
          label="Draggable studio sticker"
          className="px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider mb-4 lg:mb-0 lg:absolute lg:top-2 lg:right-8 z-20"
        >
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ULM &rsquo;26 · DRAG ME</span>
          </span>
        </Sticker>

        <h1 className="font-hero-display text-[clamp(4rem,13vw,10.5rem)] text-[#000000] dark:text-[#FAF8F5] leading-[0.94] tracking-[-0.02em]">
          <motion.span
            style={prefersReduced ? {} : { x: titleX, skewX: titleSkew }}
            className="inline-block"
          >
            <SplitText text="BWORIEY" type="chars" immediate />
          </motion.span>
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mt-2">
          <p className="font-editorial italic text-[clamp(2rem,5vw,4rem)] text-[#F05A28] leading-[1.05]">
            <SplitText text={ownerName} type="words" delay={0.22} immediate />
          </p>
          <span className="font-mono text-xs uppercase tracking-[0.04em] text-[#000000]/65 dark:text-[#FAF8F5]/65">
            DIGITAL PLAYGROUND &amp; FULL-STACK ENGINEERING
          </span>
        </div>
      </motion.div>

      {/* Asymmetric Scattered Collage Strip (Non-2-Column) */}
      <motion.div
        style={prefersReduced ? {} : { y: clusterY }}
        className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Rotated Orange Identity Card (offset left) */}
        <motion.div
          style={prefersReduced ? {} : { x: smoothX }}
          className="lg:col-span-5 lg:col-start-1 z-10"
        >
          <InfoCard rotate={-5} mobileRotate={-2} binderHoles className="w-full max-w-[400px]">
            {avatarUrl ? (
              <div className="mb-4 aspect-[16/10] w-full overflow-hidden bg-[#1A1917]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt={ownerName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mb-4 py-4 px-4 bg-[#1A1917]/15 flex items-center justify-between">
                <span className="font-editorial italic text-3xl text-[#FAF8F5]">TR</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#FAF8F5]/90">
                  BANGKIT &rsquo;24 LEAD
                </span>
              </div>
            )}
            <p className="font-editorial text-2xl sm:text-3xl leading-[1.15] text-[#FAF8F5]">
              Prototyping, storytelling &amp; interactive web engineering.
            </p>
          </InfoCard>
        </motion.div>

        {/* Overlapping Peach Card + CTAs (offset down-right) */}
        <motion.div
          style={prefersReduced ? {} : { y: smoothY }}
          className="lg:col-span-6 lg:col-start-6 lg:mt-12 space-y-6 z-20"
        >
          <TextCard rotate={2.5} mobileRotate={1.5} foldedCorner>
            <p className="font-body-editorial text-sm sm:text-base text-[#000000] leading-relaxed">
              {description}
            </p>
          </TextCard>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <MagneticButton
              onClick={() => scrollTo("playground")}
              onMouseEnter={() => setCursor({ active: true, text: "PLAYGROUND", variant: "project" })}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.05em] cursor-pointer"
            >
              <span>EXPLORE PLAYGROUND</span>
              <ArrowDownRight className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollTo("contact")}
              onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[0.5rem] bg-[#FFD4C2] text-[#000000] font-mono text-xs uppercase tracking-[0.05em] cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setCursor({ active: true, variant: "link" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-4 py-3 font-mono text-xs text-[#000000]/75 dark:text-[#FAF8F5]/75 hover:text-[#F05A28] uppercase tracking-[0.04em] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>RESUME.PDF</span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Desktop Scroll Indicator */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, delay: 0.9, ease: EASINGS.editorial }}
        className="mt-16 flex items-center justify-between pt-6 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
      >
        <button
          type="button"
          onClick={() => scrollTo("about")}
          onMouseEnter={() => setCursor({ active: true, text: "SCROLL", variant: "hover" })}
          onMouseLeave={resetCursor}
          className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:text-[#F05A28] cursor-pointer transition-colors"
        >
          <span className="relative w-4 h-7 rounded-full border border-current flex items-start justify-center p-1">
            <motion.span
              animate={prefersReduced ? {} : { y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1 h-1.5 rounded-full bg-[#F05A28]"
            />
          </span>
          <span>SCROLL TO EXPLORE</span>
        </button>

        <span className="hidden sm:inline-block font-mono text-[11px] text-[#000000]/50 dark:text-[#FAF8F5]/50 uppercase tracking-[0.05em]">
          NEXT.JS 16 · FRAMER MOTION · SUPABASE
        </span>
      </motion.div>
    </section>
  );
}
