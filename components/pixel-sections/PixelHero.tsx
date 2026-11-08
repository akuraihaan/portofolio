"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VoxelCanvas } from "../pixel3d/VoxelCanvas";
import { PixelCard } from "../pixel3d/PixelCard";
import { MagneticButton } from "../motion/MagneticButton";
import { PixelReveal } from "../motion/PixelReveal";
import { ArrowDown, Terminal, Sparkles, FolderGit2, User, ExternalLink } from "lucide-react";

interface PixelHeroProps {
  ownerName?: string;
  headline?: string;
  description?: string;
  resumeUrl?: string;
}

export function PixelHero({
  ownerName = "Taufik Raihandani",
  headline,
  description,
  resumeUrl = "#contact",
}: PixelHeroProps) {
  const roles = [
    "COMPUTER EDUCATION GRADUATE",
    "FULL-STACK WEB DEVELOPER",
    "SOFTWARE & PRODUCT ENGINEER",
    "BANGKIT 2024 COHORT ALUMNUS",
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [roles.length]);

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
        {/* Top Coordinate Ticker */}
        <PixelReveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-between gap-3 font-pixel text-[8px] sm:text-[9px] text-[#777970] dark:text-[#A1A49A] mb-8 pb-3 border-b border-[#171816]/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#C8F169]" />
              <span className="text-[#171816] dark:text-[#C8F169]">ENVIRONMENT:</span>
              <span>PIXEL_3D_WORLD // V2026.1</span>
            </div>
            <div className="flex items-center gap-4">
              <span>LAT -3.3167 / LON 114.5900</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">BANJARMASIN, KALIMANTAN SELATAN</span>
            </div>
          </div>
        </PixelReveal>

        {/* Hero Grid: Typography & Content on Left, Interactive 3D Voxel Canvas on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Dominant BWORIEY Typography & Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <PixelReveal delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-pixel text-[8px] sm:text-[9px] tracking-wider mb-4 border border-black/30 shadow-pixel self-start">
                <Terminal className="w-3 h-3" />
                <span>WELCOME TO BWORIEY DIGITAL WORLD</span>
              </div>
            </PixelReveal>

            {/* Oversized BWORIEY Wordmark */}
            <PixelReveal delay={0.3}>
              <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none text-[#171816] dark:text-[#F4F3EE] mb-4">
                BWORIEY
              </h1>
            </PixelReveal>

            {/* Cycling Role Pill with Pixel Monospace */}
            <PixelReveal delay={0.4}>
              <div className="h-7 mb-4 flex items-center">
                <span className="font-pixel text-[10px] sm:text-[11px] text-[#171816] dark:text-[#C8F169] bg-[#C8F169]/20 px-3 py-1 border border-[#C8F169]/60 inline-flex items-center gap-2">
                  <span className="animate-pulse">▶</span>
                  <span>{roles[roleIndex]}</span>
                </span>
              </div>
            </PixelReveal>

            {/* Natural Persona Description */}
            <PixelReveal delay={0.5}>
              <p className="text-base sm:text-lg text-[#777970] dark:text-[#A1A49A] max-w-2xl leading-relaxed mb-8">
                {description ||
                  `Hai, saya ${ownerName}. Alumnus Pendidikan Komputer Universitas Lambung Mangkurat (2026) dan Bangkit Academy 2024. Merancang arsitektur web modern, sistem berbasis data, dan pengalaman interaktif dengan presisi estetika retro-futuristik.`}
              </p>
            </PixelReveal>

            {/* Interactive Voxel Action CTAs */}
            <PixelReveal delay={0.6}>
              <div className="flex flex-wrap items-center gap-4">
                <MagneticButton variant="lime" href="#projects">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>EXPLORE PROJECTS</span>
                </MagneticButton>

                <MagneticButton variant="secondary" href="#about">
                  <User className="w-3.5 h-3.5" />
                  <span>ABOUT & PROFILE</span>
                </MagneticButton>

                {resumeUrl && resumeUrl !== "#contact" && (
                  <MagneticButton variant="secondary" href={resumeUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>CV DOCUMENT</span>
                  </MagneticButton>
                )}
              </div>
            </PixelReveal>
          </div>

          {/* Right Column: Interactive 3D Voxel Sculpture & Identity HUD (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <PixelReveal delay={0.35} direction="left">
              {/* Voxel 3D Canvas */}
              <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                <VoxelCanvas size={420} />
              </div>

              {/* Voxel Specs Readout Card below canvas */}
              <PixelCard
                variant="default"
                interactive={false}
                className="w-full max-w-[420px] mt-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] pb-2 border-b border-[#171816]/10 dark:border-white/10 mb-3">
                  <span>IDENTITY RECORD</span>
                  <span className="text-[#171816] dark:text-[#C8F169]">#001-BWORIEY</span>
                </div>
                <div className="space-y-1.5 text-xs text-[#171816] dark:text-[#F4F3EE]">
                  <div className="flex justify-between">
                    <span className="text-[#777970] dark:text-[#A1A49A]">Nama:</span>
                    <span className="font-bold">{ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777970] dark:text-[#A1A49A]">Fakultas / Prodi:</span>
                    <span>FKIP / Pendidikan Komputer ULM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777970] dark:text-[#A1A49A]">IPK / Kelulusan:</span>
                    <span className="font-bold text-[#171816] dark:text-[#C8F169]">3.54 / S.Pd. 2026</span>
                  </div>
                </div>
              </PixelCard>
            </PixelReveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <PixelReveal delay={0.7}>
          <div className="mt-16 pt-8 flex items-center justify-center">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#171816]/30 dark:border-[#C8F169]/40 bg-white/50 dark:bg-[#1C1F1A]/50 font-pixel text-[8px] text-[#171816] dark:text-[#C8F169] hover:bg-[#C8F169] hover:text-[#171816] transition-colors no-underline shadow-pixel"
            >
              <ArrowDown className="w-3 h-3 animate-bounce" />
              <span>SCROLL TO ENTER WORLD</span>
            </a>
          </div>
        </PixelReveal>
      </div>
    </section>
  );
}

