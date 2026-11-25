"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export function ContemporaryAbstractSculpture() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-200, 200], [15, -15]);
  const rotateY = useTransform(smoothX, [-200, 200], [-15, 15]);
  const translateX = useTransform(smoothX, [-200, 200], [-12, 12]);
  const translateY = useTransform(smoothY, [-200, 200], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square flex items-center justify-center select-none"
      style={{ perspective: 1000 }}
    >
      {/* Outer ambient blur aura */}
      <div className="absolute inset-0 bg-[#2563EB]/5 dark:bg-[#C8F169]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3D Interactive Composition */}
      <motion.div
        style={
          prefersReduced
            ? {}
            : {
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] flex items-center justify-center"
      >
        {/* Layer 1: Outer Concentric Precision Ring */}
        <motion.div
          animate={prefersReduced ? {} : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-black/[0.08] dark:border-white/[0.1] border-dashed"
        />

        {/* Layer 2: Middle Segmented Ring with Accent Node */}
        <motion.div
          animate={prefersReduced ? {} : { rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 rounded-full border border-[#2563EB]/25 dark:border-[#C8F169]/25"
        >
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2563EB] dark:bg-[#C8F169] shadow-sm" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/30 dark:bg-white/30" />
        </motion.div>

        {/* Layer 3: Central Isometric Precision Cube / Core */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Back square */}
          <div className="absolute inset-0 rounded-2xl border border-black/[0.12] dark:border-white/[0.15] bg-white/40 dark:bg-[#121214]/40 backdrop-blur-sm -rotate-6 transition-transform duration-500" />
          {/* Front square */}
          <div className="absolute inset-2 rounded-2xl border border-black/[0.15] dark:border-white/[0.2] bg-white/80 dark:bg-[#18181B]/80 backdrop-blur-md shadow-xl rotate-6 transition-transform duration-500 flex flex-col items-center justify-center p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#71717A] dark:text-[#A1A1AA] mb-1">
              SPEC // 2026
            </span>
            <span className="font-display font-black text-2xl tracking-tight text-[#121214] dark:text-[#F4F4F6]">
              BWORIEY
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#C8F169] animate-pulse" />
              <span className="font-mono text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                ULM S.Pd. Komputer
              </span>
            </div>
          </div>
        </div>

        {/* Floating Editorial Badges with Depth */}
        <motion.div
          animate={prefersReduced ? {} : { y: [-4, 4, -4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(30px)" }}
          className="absolute -top-2 -right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1A1A1E]/90 border border-black/[0.08] dark:border-white/[0.12] shadow-sm backdrop-blur-md font-mono text-[10px] font-semibold tracking-wider text-[#121214] dark:text-[#F4F4F6] flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Full-Stack Web</span>
        </motion.div>

        <motion.div
          animate={prefersReduced ? {} : { y: [4, -4, 4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(25px)" }}
          className="absolute -bottom-3 -left-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#1A1A1E]/90 border border-black/[0.08] dark:border-white/[0.12] shadow-sm backdrop-blur-md font-mono text-[10px] font-semibold tracking-wider text-[#121214] dark:text-[#F4F4F6] flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#C8F169]" />
          <span>Educational Tech</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
