"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, Download, Terminal, Sparkles, Code2, Cloud, GraduationCap } from "lucide-react";

interface BrutalistHeroProps {
  ownerName?: string;
  resumeUrl?: string;
}

export function BrutalistHero({
  ownerName = "TAUFIK RAIHANDANI",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
}: BrutalistHeroProps) {
  return (
    <section
      id="hero"
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
          <div className="inline-flex items-center gap-2.5 bg-[#FFE500] text-black px-3.5 py-1.5 border-2 border-black font-mono text-xs font-black tracking-wider uppercase shadow-[3px_3px_0px_#000]">
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
          {/* Floating Sticker 1 - Top Left */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="hidden md:inline-flex absolute -top-6 left-2 z-20 items-center gap-1.5 bg-[#FF5C00] text-white font-mono text-xs font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] select-none pointer-events-none"
          >
            <Code2 size={14} className="stroke-[3]" />
            <span>CREATIVE DEVELOPER</span>
          </motion.div>

          {/* Floating Sticker 2 - Top Right */}
          <motion.div
            initial={{ scale: 0, rotate: 15 }}
            animate={{ scale: 1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
            className="hidden md:inline-flex absolute -top-4 right-8 z-20 items-center gap-1.5 bg-[#C8F169] text-black font-mono text-xs font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] select-none pointer-events-none"
          >
            <Cloud size={14} className="stroke-[3]" />
            <span>BANGKIT CLOUD COHORT LEAD</span>
          </motion.div>

          {/* Oversized Name Header */}
          <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-tighter uppercase leading-[0.88] select-none break-words">
            <span className="block text-black dark:text-white drop-shadow-[4px_4px_0px_#FFE500]">
              TAUFIK
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-800 to-black dark:from-white dark:via-neutral-200 dark:to-white [-webkit-text-stroke:2px_#000] dark:[-webkit-text-stroke:2px_#FFF] hover:text-black dark:hover:text-white transition-colors duration-300">
              RAIHANDANI
            </span>
          </h1>
        </div>

        {/* Asymmetrical Grid: Headline, Description & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Main Headline */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-block bg-black text-[#FFE500] dark:bg-white dark:text-black font-display font-black text-2xl sm:text-3xl md:text-4xl px-4 py-2 border-3 border-black shadow-[5px_5px_0px_#FF5C00] uppercase tracking-tight">
              "I BUILD THINGS FOR THE DIGITAL WORLD."
            </div>
            <p className="font-sans text-base sm:text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-200 max-w-2xl leading-relaxed">
              Pengembang web dan arsitek teknologi edukasi dengan latar belakang{" "}
              <strong className="font-black text-black dark:text-white underline decoration-[#FFE500] decoration-4">
                Pendidikan Komputer
              </strong>{" "}
              Universitas Lambung Mangkurat. Berfokus pada sistem berbasis web performa tinggi, komputasi awan, dan media interaktif.
            </p>
          </div>

          {/* Action Callouts / CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Primary Button */}
            <a
              href="#projects"
              className="flex items-center justify-between bg-[#FFE500] text-black font-display font-black text-base md:text-lg px-6 py-4 border-3 border-black shadow-[5px_5px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000] active:translate-x-1.5 active:translate-y-1.5 active:shadow-none transition-all no-underline group"
            >
              <span>EXPLORE MY WORK</span>
              <ArrowDownRight
                size={22}
                className="stroke-[3] group-hover:rotate-[-45deg] transition-transform duration-200"
              />
            </a>

            {/* Secondary Button */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white dark:bg-[#1A1A1A] text-black dark:text-white font-display font-bold text-sm md:text-base px-6 py-3.5 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all no-underline"
            >
              <span className="flex items-center gap-2">
                <Download size={16} className="stroke-[2.5]" />
                <span>UNDUH RESUME CV (PDF)</span>
              </span>
              <span className="font-mono text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5">
                v2026
              </span>
            </a>

            {/* Quick Spec Badge Box */}
            <div className="p-3 bg-neutral-100 dark:bg-[#141414] border-2 border-black dark:border-neutral-700 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-500">PRODI:</span>
                <span className="font-bold">PENDIDIKAN KOMPUTER ULM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">IPK KELULUSAN:</span>
                <span className="font-bold text-[#FF5C00]">3.54 / 4.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">SPESIALISASI:</span>
                <span className="font-bold">FULL-STACK & EDTECH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4">
          {[
            { label: "TAHUN EKSPLORASI", value: "4+ TAHUN", color: "bg-[#FFE500]" },
            { label: "PROYEK SELESAI", value: "15+ KARYA", color: "bg-[#FF5C00] text-white" },
            { label: "IPK KELULUSAN", value: "3.54 / 4.00", color: "bg-[#0047FF] text-white" },
            { label: "KREDENSIAL RESMI", value: "10+ SERTIFIKAT", color: "bg-[#C8F169] text-black" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 md:p-4 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] ${stat.color}`}
            >
              <div className="font-mono text-[10px] md:text-xs font-bold tracking-wider opacity-85">
                {stat.label}
              </div>
              <div className="font-display font-black text-xl md:text-2xl tracking-tight mt-1">
                {stat.value}
              </div>
            </div>
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
