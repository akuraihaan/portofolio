"use client";

import React from "react";
import { PixelCard } from "../pixel3d/PixelCard";
import { VoxelCube3D } from "../pixel3d/VoxelCube3D";
import { PixelReveal } from "../motion/PixelReveal";
import { GraduationCap, Award, Code2, Compass, Sparkles } from "lucide-react";

interface PixelAboutProps {
  ownerName?: string;
  avatarUrl?: string | null;
  bio?: string;
}

export function PixelAbout({
  ownerName = "Taufik Raihandani",
  avatarUrl,
  bio,
}: PixelAboutProps) {
  return (
    <section id="about" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [01 // ABOUT]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              BIOGRAPHY & PHILOSOPHY
            </span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight mb-8">
            World Architect &amp; Educator.
          </h2>
        </PixelReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait Card & Academic Specs (5 cols) */}
          <div className="lg:col-span-5">
            <PixelReveal delay={0.2}>
              <PixelCard variant="default" className="p-6">
                {/* Avatar with Pixel Crosshairs */}
                <div className="relative aspect-[4/4.5] bg-[#E9E8E1] dark:bg-[#1C1F1A] border-2 border-[#171816] dark:border-[#C8F169]/50 overflow-hidden mb-6 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={ownerName}
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <VoxelCube3D size={64} color="#C8F169" />
                      <span className="font-pixel text-[11px] font-bold mt-4 text-[#171816] dark:text-[#F4F3EE]">
                        TR MONOGRAM
                      </span>
                      <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] mt-1">
                        PHOTO_ARCHIVE_VERIFIED
                      </span>
                    </div>
                  )}

                  {/* Corner Crosshairs */}
                  <span className="absolute top-2 left-2 font-mono text-xs text-[#171816] dark:text-[#C8F169] select-none">
                    +
                  </span>
                  <span className="absolute top-2 right-2 font-mono text-xs text-[#171816] dark:text-[#C8F169] select-none">
                    +
                  </span>
                  <span className="absolute bottom-2 left-2 font-mono text-xs text-[#171816] dark:text-[#C8F169] select-none">
                    +
                  </span>
                  <span className="absolute bottom-2 right-2 font-mono text-xs text-[#171816] dark:text-[#C8F169] select-none">
                    +
                  </span>
                </div>

                {/* Identity Tag */}
                <div className="font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#171816]/10 dark:border-white/10">
                    <span className="text-[#777970] dark:text-[#A1A49A]">Nama Lengkap</span>
                    <span className="font-bold text-[#171816] dark:text-[#F4F3EE]">{ownerName}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#171816]/10 dark:border-white/10">
                    <span className="text-[#777970] dark:text-[#A1A49A]">Pendidikan</span>
                    <span className="text-right text-[#171816] dark:text-[#F4F3EE]">S.Pd. Pendidikan Komputer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#777970] dark:text-[#A1A49A]">Institusi</span>
                    <span className="font-bold text-[#171816] dark:text-[#C8F169]">Univ. Lambung Mangkurat</span>
                  </div>
                </div>
              </PixelCard>
            </PixelReveal>
          </div>

          {/* Right Column: Narrative, Quote, and 4 Voxel Stat Cards (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <PixelReveal delay={0.25}>
              <div className="prose prose-lg dark:prose-invert max-w-none text-base sm:text-lg text-[#171816]/85 dark:text-[#F4F3EE]/85 leading-relaxed font-sans space-y-4">
                <p>
                  Saya percaya bahwa software terbaik bukan hanya tentang kode yang berjalan tanpa error, melainkan bagaimana sistem tersebut dirancang secara komprehensif: memadukan arsitektur yang kokoh, estetika visual yang bernyawa, dan kemudahan bagi manusia yang menggunakannya.
                </p>
                <p>
                  Dengan latar belakang di <strong>Pendidikan Komputer</strong>, saya terbiasa menyederhanakan masalah teknis yang kompleks menjadi modul-modul terstruktur. Menggabungkan wawasan pedagogis dengan teknologi modern seperti <strong>Next.js, TypeScript, Tailwind CSS, dan PostgreSQL (Supabase)</strong>, saya membangun aplikasi web yang tahan uji, mudah dirawat, dan memiliki identitas kuat.
                </p>
              </div>
            </PixelReveal>

            {/* Editorial Quote Box */}
            <PixelReveal delay={0.3}>
              <div className="p-6 border-l-4 border-[#C8F169] bg-[#171816]/5 dark:bg-[#1C1F1A] font-mono text-xs sm:text-sm text-[#171816] dark:text-[#F4F3EE] leading-relaxed">
                <p className="italic">
                  &ldquo;Teknologi dan pedagogi memiliki tujuan yang sama: memberdayakan manusia melalui kejelasan instruksi, arsitektur yang logis, dan desain yang bermakna.&rdquo;
                </p>
                <span className="block mt-2 font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase">
                  // BWORIEY PHILOSOPHY MANIFESTO
                </span>
              </div>
            </PixelReveal>

            {/* 4 Voxel Metric Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <PixelCard variant="default" className="p-4 text-center">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#C8F169] block">
                  2026
                </span>
                <span className="font-pixel text-[7px] text-[#777970] dark:text-[#A1A49A] block mt-1 uppercase">
                  ALUMNI ULM
                </span>
              </PixelCard>

              <PixelCard variant="default" className="p-4 text-center">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#C8F169] block">
                  3.54
                </span>
                <span className="font-pixel text-[7px] text-[#777970] dark:text-[#A1A49A] block mt-1 uppercase">
                  IPK S.PD.
                </span>
              </PixelCard>

              <PixelCard variant="default" className="p-4 text-center">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#C8F169] block">
                  2024
                </span>
                <span className="font-pixel text-[7px] text-[#777970] dark:text-[#A1A49A] block mt-1 uppercase">
                  BANGKIT COHORT
                </span>
              </PixelCard>

              <PixelCard variant="default" className="p-4 text-center">
                <span className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#C8F169] block">
                  100%
                </span>
                <span className="font-pixel text-[7px] text-[#777970] dark:text-[#A1A49A] block mt-1 uppercase">
                  TYPE SAFETY
                </span>
              </PixelCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

