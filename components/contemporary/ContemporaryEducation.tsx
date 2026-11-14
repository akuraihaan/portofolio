"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ContemporaryEducationRecord {
  institution?: string;
  degree?: string;
  field_of_study?: string;
  location?: string;
  period?: string;
  gpa?: string;
}

export function ContemporaryEducation({
  education = {
    institution: "Universitas Lambung Mangkurat (ULM)",
    degree: "Sarjana Pendidikan (S.Pd.)",
    field_of_study: "Pendidikan Komputer",
    location: "Banjarmasin, Kalimantan Selatan",
    period: "2022 – 2026",
    gpa: "3.54 / 4.00",
  },
}: {
  education?: ContemporaryEducationRecord;
}) {
  const prefersReduced = useReducedMotion();

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="pendidikan"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          05 // PENDIDIKAN &amp; RISET AKADEMIK
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          ALMAMATER &amp; SKRIPSI
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-16">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Fondasi akademik dalam ilmu komputasi dan metodologi pembelajaran.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Pendidikan tinggi formal yang membentuk pemahaman mendalam tentang teori komputasi, struktur algoritma, arsitektur basis data, serta riset pengembangan media instruksional.
        </p>
      </motion.div>

      {/* Education Card */}
      <motion.div
        {...inView(0.12)}
        className="bg-white dark:bg-[#121214] rounded-2xl sm:rounded-3xl p-7 sm:p-11 border border-black/[0.08] dark:border-white/[0.1] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 mb-8 border-b border-black/[0.08] dark:border-white/[0.1]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-[#2563EB] dark:text-[#C8F169]" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#2563EB] dark:text-[#C8F169] uppercase">
                {education.degree} — {education.field_of_study}
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#121214] dark:text-[#F4F4F6]">
              {education.institution}
            </h3>
          </div>

          <div className="flex flex-col sm:items-end font-mono">
            <span className="text-xs text-[#71717A] dark:text-[#A1A1AA]">{education.period}</span>
            <span className="text-sm font-bold text-[#121214] dark:text-[#F4F4F6] mt-1">
              IPK: {education.gpa} (Magna Cum Laude)
            </span>
          </div>
        </div>

        {/* Thesis Showcase Block */}
        <div className="space-y-5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] block">
            Riset Skripsi Sarjana / Undergraduate Thesis
          </span>
          <h4 className="font-display font-bold text-xl sm:text-2xl text-[#121214] dark:text-[#F4F4F6] leading-snug">
            &ldquo;Penerapan Learning Analytics pada Web Pembelajaran Interaktif Materi Framework Tailwind CSS Dasar&rdquo;
          </h4>
          <p className="font-sans text-sm sm:text-base text-[#121214]/80 dark:text-[#F4F4F6]/80 leading-relaxed font-normal">
            Riset pengembangan (R&amp;D) media pembelajaran berbasis web untuk materi dasar hingga Tailwind CSS dengan sistem pencatatan analitik belajar otomatis untuk mengevaluasi waktu pengerjaan tugas dan pola penguasaan sintaks mahasiswa. Divalidasi dan diuji langsung dalam pembelajaran praktikum Informatika.
          </p>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA] border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#C8F169] shrink-0" />
              <span>Algoritma Pemrograman &amp; Struktur Data Lanjutan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#C8F169] shrink-0" />
              <span>Sistem Manajemen Basis Data Relasional &amp; SQL</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#C8F169] shrink-0" />
              <span>Rekayasa Perangkat Lunak &amp; Desain Antarmuka</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#C8F169] shrink-0" />
              <span>Jaringan Komputer &amp; Infrastruktur Komputasi Awan</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
