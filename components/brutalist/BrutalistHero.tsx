"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowDownRight, Download, Terminal, Sparkles, Code2, Cloud, GraduationCap, Zap } from "lucide-react";
import { BrutalistMagnetic } from "../motion/BrutalistMagnetic";
import { Brutalist3DMesh } from "./Brutalist3DMesh";
import { useMotionContext } from "../motion/MotionProvider";

interface BrutalistHeroProps {
  ownerName?: string;
  resumeUrl?: string;
}

export function BrutalistHero({
  ownerName = "TAUFIK RAIHANDANI",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
}: BrutalistHeroProps) {
  const { setCursor, resetCursor } = useMotionContext();

  // Mouse Parallax Values for Floating Elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const parallaxX1 = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), springConfig);
  const parallaxY1 = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), springConfig);
  const parallaxX2 = useSpring(useTransform(mouseX, [-500, 500], [20, -20]), springConfig);
  const parallaxY2 = useSpring(useTransform(mouseY, [-500, 500], [20, -20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    mouseX.set(clientX - centerX);
    mouseY.set(clientY - centerY);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative pt-28 md:pt-36 pb-16 md:pb-24 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white overflow-hidden transition-colors duration-200"
    >
      {/* Background Neo-Brutalist Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 2px, transparent 2px), linear-gradient(to bottom, #000 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Meta Bar / Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Status Badge */}
          <div
            onMouseEnter={() => setCursor({ active: true, text: "OPEN FOR WORK" })}
            onMouseLeave={resetCursor}
            className="inline-flex items-center gap-2.5 bg-[#FFE500] text-black px-3.5 py-1.5 border-2 border-black font-mono text-xs font-black tracking-wider uppercase shadow-[3px_3px_0px_#000] cursor-default"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <span>AVAILABLE FOR PROJECTS</span>
          </div>

          {/* Location & Academic Stamp */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <span className="bg-white dark:bg-[#1A1A1A] px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#FFF]">
              BANJARMASIN, ID (UTC+8)
            </span>
            <span className="bg-[#0047FF] text-white px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
              S.Pd. KOMPUTER ULM '26
            </span>
          </div>
        </div>

        {/* Main Brutalist Typography Composition */}
        <div className="relative mb-8">
          {/* Floating Sticker 1 - Top Left with Parallax */}
          <motion.div
            style={{ x: parallaxX1, y: parallaxY1 }}
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="hidden md:inline-flex absolute -top-6 left-2 z-20 items-center gap-1.5 bg-[#FF5C00] text-white font-mono text-xs font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] select-none pointer-events-none"
          >
            <Code2 size={14} className="stroke-[3]" />
            <span>CREATIVE DEVELOPER</span>
          </motion.div>

          {/* Floating Sticker 2 - Top Right with Parallax */}
          <motion.div
            style={{ x: parallaxX2, y: parallaxY2 }}
            initial={{ scale: 0, rotate: 15 }}
            animate={{ scale: 1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            className="hidden md:inline-flex absolute -top-4 right-12 z-20 items-center gap-1.5 bg-[#C8F169] text-black font-mono text-xs font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] select-none pointer-events-none"
          >
            <Cloud size={14} className="stroke-[3]" />
            <span>BANGKIT CLOUD COHORT LEAD</span>
          </motion.div>

          {/* Oversized Name Header with Staggered Entrance */}
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-tighter uppercase leading-[0.88] select-none break-words">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="block text-black dark:text-white drop-shadow-[4px_4px_0px_#FFE500]"
            >
              TAUFIK
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-800 to-black dark:from-white dark:via-neutral-200 dark:to-white [-webkit-text-stroke:2px_#000] dark:[-webkit-text-stroke:2px_#FFF] hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              RAIHANDANI
            </motion.span>
          </h1>
        </div>

        {/* Asymmetrical Grid: Headline, Description & Interactive 3D Mesh */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Headline & Description (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-black text-[#FFE500] dark:bg-white dark:text-black font-display font-black text-2xl sm:text-3xl md:text-4xl px-4 py-2 border-3 border-black shadow-[5px_5px_0px_#FF5C00] uppercase tracking-tight"
            >
              "I BUILD THINGS FOR THE DIGITAL WORLD."
            </motion.div>
            <p className="font-sans text-base sm:text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-200 max-w-2xl leading-relaxed">
              Pengembang web dan arsitek teknologi edukasi dengan latar belakang{" "}
              <strong className="font-black text-black dark:text-white underline decoration-[#FFE500] decoration-4">
                Pendidikan Komputer
              </strong>{" "}
              Universitas Lambung Mangkurat. Berfokus pada sistem berbasis web performa tinggi, komputasi awan, dan media interaktif.
            </p>

            {/* CTAs with Magnetic Effect */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <BrutalistMagnetic strength={0.25}>
                <a
                  href="#projects"
                  onMouseEnter={() => setCursor({ active: true, text: "EXPLORE" })}
                  onMouseLeave={resetCursor}
                  className="flex items-center gap-2 bg-[#FFE500] text-black font-display font-black text-base md:text-lg px-6 py-4 border-3 border-black shadow-[5px_5px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all no-underline group"
                >
                  <span>EXPLORE MY WORK</span>
                  <ArrowDownRight
                    size={22}
                    className="stroke-[3] group-hover:rotate-[-45deg] transition-transform duration-200"
                  />
                </a>
              </BrutalistMagnetic>

              <BrutalistMagnetic strength={0.25}>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor({ active: true, text: "UNDUH CV" })}
                  onMouseLeave={resetCursor}
                  className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] text-black dark:text-white font-display font-bold text-sm md:text-base px-6 py-4 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all no-underline"
                >
                  <Download size={18} className="stroke-[2.5]" />
                  <span>UNDUH CV (PDF)</span>
                </a>
              </BrutalistMagnetic>
            </div>
          </div>

          {/* Right Column: Interactive 3D Canvas Mesh & Quick Specs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-center gap-4">
            {/* Interactive 3D Geometry */}
            <Brutalist3DMesh />

            {/* Quick Spec Badge Box */}
            <div className="w-full max-w-sm p-3.5 bg-neutral-100 dark:bg-[#141414] border-3 border-black dark:border-neutral-700 font-mono text-[11px] space-y-1.5 shadow-[3px_3px_0px_#000]">
              <div className="flex justify-between items-center border-b border-neutral-300 dark:border-neutral-800 pb-1">
                <span className="text-neutral-500 font-bold">ALMAMATER:</span>
                <span className="font-black">UNIV. LAMBUNG MANGKURAT</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-300 dark:border-neutral-800 pb-1">
                <span className="text-neutral-500 font-bold">IPK KELULUSAN:</span>
                <span className="font-black text-[#FF5C00]">3.54 / 4.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 font-bold">CORE DOMAIN:</span>
                <span className="font-black text-[#0047FF] dark:text-[#FFE500]">FULL-STACK & CLOUD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Statistics Strip with Hover Lift */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4">
          {[
            { label: "TAHUN EKSPLORASI", value: "4+ TAHUN", color: "bg-[#FFE500] text-black" },
            { label: "PROYEK SELESAI", value: "15+ KARYA", color: "bg-[#FF5C00] text-white" },
            { label: "IPK KELULUSAN", value: "3.54 / 4.00", color: "bg-[#0047FF] text-white" },
            { label: "KREDENSIAL RESMI", value: "10+ SERTIFIKAT", color: "bg-[#C8F169] text-black" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`p-3 md:p-4 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] cursor-default select-none ${stat.color}`}
            >
              <div className="font-mono text-[10px] md:text-xs font-bold tracking-wider opacity-85">
                {stat.label}
              </div>
              <div className="font-display font-black text-xl md:text-2xl tracking-tight mt-1">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Massive Running Ticker Marquee */}
      <div className="mt-14 -mx-4 md:-mx-8 border-y-4 border-black bg-black text-[#FFE500] py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] font-display font-black text-lg md:text-2xl tracking-wider">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-6 mx-4">
              <span>WEB DEVELOPMENT</span>
              <span className="text-[#FF5C00]">★</span>
              <span>CLOUD COMPUTING</span>
              <span className="text-[#0047FF]">★</span>
              <span>EDUCATIONAL TECHNOLOGY</span>
              <span className="text-[#C8F169]">★</span>
              <span>INTERACTIVE EXPERIENCES</span>
              <span className="text-white">★</span>
              <span>FULL-STACK ARCHITECTURE</span>
              <span className="text-[#FFE500]">★</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
