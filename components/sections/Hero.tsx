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

  // Scroll-linked subtle parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const collageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  // Pointer-based micro-parallax on collage cluster
  const ptrX = useMotionValue(0);
  const ptrY = useMotionValue(0);
  const smoothX = useSpring(useTransform(ptrX, [-0.5, 0.5], [-10, 10]), SPRINGS.fluid);
  const smoothY = useSpring(useTransform(ptrY, [-0.5, 0.5], [-8, 8]), SPRINGS.fluid);

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
      className="relative w-full max-w-7xl mx-auto pt-10 pb-24 md:pt-16 md:pb-32 px-6 sm:px-8 overflow-x-clip"
    >
      {/* Sparse Hand-crafted Sprites in Negative Space */}
      <Sprite kind="flower" color="green" size="md" float className="absolute top-6 right-12 hidden md:inline-block" />
      <Sprite kind="star" color="pink" size="sm" delay={0.3} className="absolute bottom-24 left-8 hidden md:inline-block" />
      <Sprite kind="smile" color="ink" size="sm" delay={0.5} className="absolute top-1/2 left-1/3 hidden lg:inline-block opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* LEFT (7 cols): Asymmetric Editorial Statement & CTAs */}
        <motion.div
          style={prefersReduced ? {} : { y: textY }}
          className="lg:col-span-7 space-y-7 relative z-10"
        >
          {/* Green Metadata Label Tag */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.medium, ease: EASINGS.editorial }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-[11px] uppercase tracking-[0.05em]"
          >
            <span>✿</span>
            <span>COMPUTER SCIENCE EDUCATION · CREATIVE DEVELOPER</span>
          </motion.div>

          {/* Main Display Title */}
          <div className="space-y-1">
            <h1 className="font-hero-display text-[clamp(3.2rem,7.5vw,6.2rem)] text-[#000000] dark:text-[#FAF8F5] leading-[1.02] tracking-[-0.02em]">
              <SplitText text="BWORIEY" type="chars" immediate />
            </h1>
            <p className="font-editorial italic text-[clamp(2rem,4.5vw,3.5rem)] text-[#F05A28] leading-[1.1]">
              <SplitText text={ownerName} type="words" delay={0.25} immediate />
            </p>
          </div>

          {/* Figtree Light Body Copy */}
          <motion.p
            initial={prefersReduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.45, ease: EASINGS.editorial }}
            className="font-body-editorial text-base sm:text-lg text-[#000000]/80 dark:text-[#FAF8F5]/85 max-w-xl"
          >
            {description}
          </motion.p>

          {/* Magnetic CTAs */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.6, ease: EASINGS.editorial }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
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
          </motion.div>
        </motion.div>

        {/* RIGHT (5 cols): Scattered Collage Cluster */}
        <motion.div
          style={prefersReduced ? {} : { y: collageY, x: smoothX }}
          className="lg:col-span-5 relative flex flex-col items-center lg:items-end pt-4 lg:pt-0"
        >
          {/* Floating Draggable Blue Sticker */}
          <Sticker
            tone="blue"
            rotate={-10}
            label="Draggable studio sticker"
            className="px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-wider self-start lg:self-auto lg:absolute lg:-top-6 lg:left-4 z-20 mb-4 lg:mb-0"
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ULM &rsquo;26 · DRAG ME</span>
            </span>
          </Sticker>

          {/* Primary Orange Identity Card */}
          <InfoCard
            rotate={-4}
            mobileRotate={-2}
            binderHoles
            className="w-full max-w-[360px] z-10"
          >
            {avatarUrl ? (
              <div className="mb-4 aspect-[4/3] w-full overflow-hidden bg-[#1A1917]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarUrl}
                  alt={ownerName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-4 py-5 px-4 bg-[#1A1917]/15 flex items-center justify-between">
                <span className="font-editorial italic text-4xl text-[#FAF8F5]">TR</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#FAF8F5]/90">
                  BANJARMASIN, ID
                </span>
              </div>
            )}
            <p className="font-editorial text-2xl sm:text-3xl leading-[1.15] text-[#FAF8F5]">
              Prototyping, storytelling &amp; interactive web engineering.
            </p>
            <div className="mt-4 pt-3 border-t border-[#FAF8F5]/25 flex items-center justify-between font-mono text-[11px] text-[#FAF8F5]/90">
              <span>{projectCount} PROJECTS</span>
              <span>{certificateCount} CERTS</span>
            </div>
          </InfoCard>

          {/* Overlapping Peach Secondary Text Box */}
          <motion.div
            style={prefersReduced ? {} : { y: smoothY }}
            className="w-full max-w-[290px] -mt-6 lg:-mt-10 lg:-mr-2 z-20"
          >
            <TextCard rotate={3} mobileRotate={2} foldedCorner>
              <p className="font-mono text-xs leading-relaxed text-[#000000]">
                S1 Pendidikan Komputer ULM (IPK 3.54) · Bangkit Academy 2024 Cloud Computing Lead.
              </p>
            </TextCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
