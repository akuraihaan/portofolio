"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Layers, CheckCircle2, MapPin, Compass, Sparkles, Code2, ArrowUpRight } from "lucide-react";
import { WordReveal } from "../motion/TextReveal";
import { HoverPerspective } from "../motion/HoverPerspective";
import { ScrollReveal } from "../motion/ScrollReveal";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface EditorialAboutProps {
  avatarUrl?: string | null;
  ownerName?: string;
  stats?: {
    projectsCount: number;
    certificatesCount: number;
    gpa: string;
    graduationYear: string;
  };
}

export function EditorialAbout({
  avatarUrl = null,
  ownerName = "Taufik Raihandani",
  stats = {
    projectsCount: 6,
    certificatesCount: 6,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: EditorialAboutProps) {
  return (
    <section
      id="about"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header with Editorial Numbering */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            01 / ABOUT
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            PHILOSOPHY & PROFILE
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          BANJARMASIN, ID · EST. 2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        {/* Left Column: Headline, Narrative & Personal Statement (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <ScrollReveal direction="up" distance={20}>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#777970] dark:text-[#A1A49A] block mb-3">
              CREATIVE DEVELOPER ARCHIVE
            </span>
          </ScrollReveal>

          {/* Master Prompt Headline */}
          <div className="mb-6">
            <h2 className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE]">
              Curiosity drives the process.
            </h2>
          </div>

          <ScrollReveal delay={0.1} direction="up">
            <p className="text-lg sm:text-xl font-normal text-[#171816]/90 dark:text-[#F4F3EE]/95 leading-relaxed mb-5">
              Saya Taufik Raihandani, lulusan Sarjana Pendidikan (S.Pd.) Pendidikan Komputer dari Universitas Lambung Mangkurat. Menggabungkan disiplin pedagogi dengan ketelitian rekayasa perangkat lunak modern untuk menciptakan produk web yang intuitif, fungsional, dan dapat diandalkan.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} direction="up">
            <p className="text-sm sm:text-base text-[#777970] dark:text-[#A1A49A] leading-relaxed mb-6 font-normal">
              Bagi saya, pemrograman bukan sekadar menulis sintaks, melainkan seni memecahkan masalah nyata dan merancang arsitektur sistem yang mudah dipahami oleh pengguna. Dari pengembangan media pembelajaran interaktif berbasis web (Flowwind Learn) hingga infrastruktur cloud computing (Bangkit Academy 2024), setiap baris kode dibangun dengan tujuan yang jelas.
            </p>
          </ScrollReveal>

          {/* Personal Statement Quote Block */}
          <ScrollReveal delay={0.2} direction="up" className="w-full">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border-l-4 border-[#C8F169] border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-8">
              <span className="font-mono text-[10px] font-bold text-[#777970] dark:text-[#A1A49A] uppercase tracking-widest block mb-2">
                PERSONAL STATEMENT // 2026
              </span>
              <p className="font-display font-bold text-base sm:text-lg text-[#171816] dark:text-[#F4F3EE] leading-snug italic">
                &ldquo;Technology is at its best when it empowers human learning and simplifies complex workflows into elegant, responsive experiences.&rdquo;
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Authentic KPI Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <div className="p-4 rounded-2xl bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE] block">
                {stats.projectsCount}+
              </span>
              <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
                Proyek
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE] block">
                {stats.certificatesCount}+
              </span>
              <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
                Sertifikat
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#C8F169] block">
                {stats.gpa}
              </span>
              <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
                IPK / GPA
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-center">
              <span className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE] block">
                {stats.graduationYear}
              </span>
              <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
                Tahun Lulus
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Portrait Card, Metadata & Professional Focus (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <HoverPerspective maxTilt={6}>
            <div className="w-full relative p-3.5 bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 rounded-3xl shadow-xl overflow-hidden aspect-[4/5] group">
              {/* Corner crosshairs (+) */}
              <div className="absolute top-4 left-4 z-20 font-mono text-xs text-[#171816]/30 dark:text-[#F4F3EE]/30 pointer-events-none select-none">+</div>
              <div className="absolute top-4 right-4 z-20 font-mono text-xs text-[#171816]/30 dark:text-[#F4F3EE]/30 pointer-events-none select-none">+</div>
              <div className="absolute bottom-4 left-4 z-20 font-mono text-xs text-[#171816]/30 dark:text-[#F4F3EE]/30 pointer-events-none select-none">+</div>
              <div className="absolute bottom-4 right-4 z-20 font-mono text-xs text-[#171816]/30 dark:text-[#F4F3EE]/30 pointer-events-none select-none">+</div>

              {/* Media Container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5 flex flex-col items-center justify-center p-6 text-center">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={ownerName}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <div className="w-24 h-24 rounded-full bg-[#171816] dark:bg-[#C8F169] flex items-center justify-center text-3xl font-display font-black text-[#F4F3EE] dark:text-[#171816] mb-4 shadow-md">
                      TR
                    </div>
                    <h3 className="font-display font-bold text-2xl text-[#171816] dark:text-[#F4F3EE]">
                      {ownerName}
                    </h3>
                    <p className="font-mono text-xs text-[#171816] dark:text-[#C8F169] mt-1 font-bold">
                      Web Developer & Computer Educator
                    </p>
                    <p className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] mt-1">
                      Universitas Lambung Mangkurat (2026)
                    </p>
                  </div>
                )}

                {/* Floating Bottom Inset Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-[#111310]/90 border border-[#171816]/10 dark:border-[#F4F3EE]/10 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#171816] dark:text-[#F4F3EE] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#C8F169]"></span>
                    S.Pd. Komputer
                  </span>
                  <span className="font-bold text-[#171816] dark:text-[#C8F169]">Lulus 2026 · GPA 3.54</span>
                </div>
              </div>
            </div>
          </HoverPerspective>

          {/* Education & Location Specifications Box */}
          <div className="p-6 rounded-3xl bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10">
              <span className="font-bold uppercase tracking-wider text-[#171816] dark:text-[#F4F3EE]">
                IDENTITY & SPECIFICATIONS
              </span>
              <span className="text-[10px] text-[#777970] dark:text-[#A1A49A]">VERIFIED // ULM</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase text-[#777970] dark:text-[#A1A49A] block mb-0.5">
                  Institusi & Jenjang
                </span>
                <span className="font-bold text-[#171816] dark:text-[#F4F3EE]">
                  Universitas Lambung Mangkurat · S.Pd. Komputer
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#777970] dark:text-[#A1A49A] block mb-0.5">
                  Domisili & Koordinat
                </span>
                <span className="font-bold text-[#171816] dark:text-[#F4F3EE]">
                  Banjarmasin, Kalimantan Selatan (LAT -3.3167 / LON 114.5900)
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#777970] dark:text-[#A1A49A] block mb-0.5">
                  Fokus Profesional
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#171816]/5 dark:bg-white/10 text-[#171816] dark:text-[#F4F3EE] font-semibold text-[11px]">
                    Frontend Engineering
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#171816]/5 dark:bg-white/10 text-[#171816] dark:text-[#F4F3EE] font-semibold text-[11px]">
                    Backend & REST API
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#171816]/5 dark:bg-white/10 text-[#171816] dark:text-[#F4F3EE] font-semibold text-[11px]">
                    Cloud Infrastructure
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#171816]/5 dark:bg-white/10 text-[#171816] dark:text-[#F4F3EE] font-semibold text-[11px]">
                    Learning Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
