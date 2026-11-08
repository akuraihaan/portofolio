"use client";

import React from "react";
import { GraduationCap, Award, BookOpen, FileCode, CheckCircle2 } from "lucide-react";

export interface EducationRecord {
  institution?: string;
  degree?: string;
  field_of_study?: string;
  location?: string;
  period?: string;
  gpa?: string;
}

export function EditorialEducation({
  education = {
    institution: "Universitas Lambung Mangkurat (ULM)",
    degree: "Sarjana Pendidikan (S.Pd.)",
    field_of_study: "Pendidikan Komputer",
    location: "Banjarmasin, Kalimantan Selatan",
    period: "2022 – 2026",
    gpa: "3.54 / 4.00",
  },
}: {
  education?: EducationRecord;
}) {
  return (
    <section
      id="education"
      className="w-full max-w-5xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          05 / Education &amp; Research
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      {/* Main Headline */}
      <div className="mb-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-2xl leading-tight mb-4">
          Academic foundation.
        </h2>
        <p className="text-base text-[#86868B] max-w-xl leading-relaxed">
          Pondasi akademik formal dalam ilmu komputasi, pengembangan media instruksional digital, dan metodologi riset perangkat lunak.
        </p>
      </div>

      {/* Main Education Card */}
      <div className="bg-[#F5F5F7] dark:bg-[#161617] rounded-3xl p-6 sm:p-10 border border-black/[0.04] dark:border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 mb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-[#86868B]" />
              <span className="text-xs font-semibold tracking-wider text-[#86868B] uppercase">
                {education.degree} — {education.field_of_study}
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] dark:text-[#F5F5F7]">
              {education.institution}
            </h3>
          </div>
          <div className="flex flex-col sm:items-end">
            <span className="text-xs font-mono text-[#86868B]">{education.period}</span>
            <span className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] mt-0.5">
              IPK: {education.gpa}
            </span>
          </div>
        </div>

        {/* Thesis Showcase Block */}
        <div className="space-y-4">
          <span className="text-xs font-semibold tracking-wider text-[#86868B] uppercase block">
            Riset Skripsi / Undergraduate Thesis
          </span>
          <h4 className="font-display font-bold text-lg sm:text-xl text-[#1D1D1F] dark:text-[#F5F5F7] leading-snug">
            &ldquo;Penerapan Learning Analytics pada Web Pembelajaran Interaktif Materi Framework Tailwind CSS&rdquo;
          </h4>
          <p className="text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-relaxed font-normal">
            Riset pengembangan (R&amp;D) media pembelajaran interaktif berbasis web untuk materi dasar hingga Tailwind CSS dengan sistem pencatatan analitik belajar otomatis untuk mengevaluasi waktu pengerjaan tugas dan pola penguasaan sintaks mahasiswa. Divalidasi oleh validator ahli materi dan media pendidikan komputasi.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#86868B]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] dark:text-white shrink-0" />
              <span>Algoritma Pemrograman &amp; Struktur Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] dark:text-white shrink-0" />
              <span>Sistem Basis Data &amp; Pemodelan Relasional</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] dark:text-white shrink-0" />
              <span>Rekayasa Perangkat Lunak &amp; Desain Antarmuka</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1D1D1F] dark:text-white shrink-0" />
              <span>Jaringan Komputer &amp; Komputasi Awan (Cloud)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
