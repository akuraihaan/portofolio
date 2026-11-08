"use client";

import React from "react";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { GraduationCap, BookOpen, Award, FileCode, CheckCircle } from "lucide-react";

export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
  thesis_title?: string;
  thesis_desc?: string;
  competencies?: string[];
}

export const defaultEducation: EducationRecord = {
  id: "ulm-computer-education",
  degree: "Sarjana Pendidikan (S.Pd.) — Pendidikan Komputer",
  institution: "Universitas Lambung Mangkurat (ULM)",
  year: "2022 — 2026",
  gpa: "3.54 / 4.00",
  thesis_title:
    "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
  thesis_desc:
    "Riset pengembangan (R&D) platform web tutorial interaktif Tailwind CSS dengan sistem pencatatan analitik belajar otomatis untuk mengevaluasi waktu pengerjaan dan pola kesalahan sintaks mahasiswa.",
  competencies: [
    "Algoritma & Pemrograman Berorientasi Objek",
    "Sistem Basis Data & Pemodelan Relasional",
    "Rekayasa Perangkat Lunak & Desain Antarmuka",
    "Jaringan Komputer & Infrastruktur Cloud",
    "Metodologi Penelitian Pendidikan Komputasi",
    "Perancangan Media Pembelajaran Digital",
  ],
};

interface PixelEducationProps {
  education?: EducationRecord;
}

export function PixelEducation({ education = defaultEducation }: PixelEducationProps) {
  return (
    <section id="education" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [05 // ALMA_MATER]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              ACADEMIC FOUNDATION &amp; RESEARCH
            </span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight mb-12">
            Academic Foundation.
          </h2>
        </PixelReveal>

        {/* Education Main Card */}
        <PixelReveal delay={0.2}>
          <PixelCard variant="default" className="p-8 sm:p-12 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Institution & Degree (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 font-pixel text-[8px] px-3 py-1 bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/40">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>ALUMNI TERAKREDITASI BAN-PT</span>
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#F4F3EE] leading-tight">
                  {education.institution}
                </h3>
                <p className="font-mono text-base sm:text-lg text-[#171816] dark:text-[#C8F169] font-bold">
                  {education.degree}
                </p>

                <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#777970] dark:text-[#A1A49A] pt-2">
                  <span>Periode: {education.year}</span>
                  <span>·</span>
                  <span>Predikat: Sangat Memuaskan</span>
                  <span>·</span>
                  <span className="text-[#171816] dark:text-[#C8F169] font-bold">
                    IPK: {education.gpa}
                  </span>
                </div>

                {/* Thesis Research Highlight */}
                {education.thesis_title && (
                  <div className="mt-8 p-6 bg-[#171816]/5 dark:bg-[#111310] border-2 border-[#171816]/20 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2 font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase">
                      <FileCode className="w-3.5 h-3.5 text-[#C8F169]" />
                      <span>SKRIPSI &amp; RISET TUGAS AKHIR</span>
                    </div>
                    <p className="font-display font-bold text-base sm:text-lg text-[#171816] dark:text-[#F4F3EE] leading-snug">
                      &ldquo;{education.thesis_title}&rdquo;
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] leading-relaxed">
                      {education.thesis_desc}
                    </p>
                  </div>
                )}
              </div>

              {/* Competencies Checklist (5 cols) */}
              <div className="lg:col-span-5 bg-[#171816]/5 dark:bg-[#1C1F1A] p-6 border-2 border-[#171816]/20 dark:border-white/10 space-y-4">
                <span className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase block pb-2 border-b border-[#171816]/10 dark:border-white/10">
                  // KOMPETENSI KURIKULUM
                </span>
                <div className="space-y-3 font-mono text-xs text-[#171816] dark:text-[#F4F3EE]">
                  {education.competencies?.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C8F169] shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PixelCard>
        </PixelReveal>
      </div>
    </section>
  );
}

