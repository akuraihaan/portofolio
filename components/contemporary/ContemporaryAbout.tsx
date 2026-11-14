"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Laptop, CheckCircle2 } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface ContemporaryAboutProps {
  ownerName?: string;
  avatarUrl?: string | null;
  stats?: {
    projectsCount: number;
    certificatesCount: number;
    gpa: string;
    graduationYear: string;
  };
}

export function ContemporaryAbout({
  ownerName = "Taufik Raihandani",
  stats = {
    projectsCount: 7,
    certificatesCount: 6,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: ContemporaryAboutProps) {
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
      id="tentang"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          01 // TENTANG SAYA
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          PROFIL &amp; FILOSOFI
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-4xl mb-16">
        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-[1.08]">
          Mengintegrasikan pedagogi komputasi dengan rekayasa perangkat lunak modern.
        </h2>
      </motion.div>

      {/* Two-Column Editorial Narrative & Profile Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Personal & Academic Narrative (7 cols) */}
        <motion.div
          {...inView(0.12)}
          className="lg:col-span-7 space-y-6 text-[#121214]/85 dark:text-[#F4F4F6]/85 text-base sm:text-lg leading-relaxed font-normal"
        >
          <p>
            Nama saya <strong>Taufik Raihandani</strong> (dikenal di ekosistem pengembang sebagai <strong>BWORIEY</strong>). Saya adalah lulusan Sarjana Pendidikan Komputer (S.Pd.) dari <strong>Universitas Lambung Mangkurat</strong> dan Alumnus program <strong>Bangkit Academy 2024 Batch 2</strong> dengan spesialisasi Cloud Computing yang diprakarsai oleh Google, GoTo, Tokopedia, dan Traveloka.
          </p>

          <p className="text-[#71717A] dark:text-[#A1A1AA] text-base leading-relaxed">
            Pendidikan di bidang keguruan ilmu komputer memberikan perspektif yang berbeda terhadap rekayasa sistem: perangkat lunak bukan semata deretan kode biner, melainkan instrumen komunikasi dan kognisi manusia. Setiap alur antarmuka harus intuitif, setiap respons server harus andal, dan setiap media digital harus memperjelas pemahaman pengguna.
          </p>

          <p className="text-[#71717A] dark:text-[#A1A1AA] text-base leading-relaxed">
            Filosofi ini tercermin nyata dalam riset skripsi saya melalui <strong>Flowwind Learn</strong> — platform pembelajaran web interaktif untuk materi sintaks Tailwind CSS yang dilengkapi engine <em>Learning Analytics</em> otomatis untuk memetakan kecepatan belajar dan penguasaan sintaks mahasiswa Informatika.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-black/[0.08] dark:border-white/[0.1]">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#2563EB] dark:text-[#C8F169] block font-semibold">
                FOKUS REKAYASA
              </span>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Arsitektur Next.js, React 19, TypeScript, sistem cloud serverless Google Cloud Platform, dan database PostgreSQL.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#2563EB] dark:text-[#C8F169] block font-semibold">
                NILAI KERJA
              </span>
              <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                Standar pengujian kode otomatis (100% test pass), kepatuhan aksesibilitas web (WCAG AAA), dan dokumentasi teknis yang jelas.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Swiss Profile Specification Matrix (5 cols) */}
        <motion.div
          {...inView(0.18)}
          className="lg:col-span-5 bg-white dark:bg-[#121214] rounded-2xl p-7 sm:p-8 border border-black/[0.08] dark:border-white/[0.1] shadow-sm"
        >
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.08] dark:border-white/[0.1]">
            <span className="font-mono text-xs font-bold tracking-wider text-[#121214] dark:text-[#F4F4F6] uppercase">
              LEMBAR SPESIFIKASI PROFIL
            </span>
            <span className="font-mono text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
              REF // 2026-TR
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] block mb-1">Nama Lengkap &amp; Gelar</span>
              <span className="font-bold text-[#121214] dark:text-[#F4F4F6] text-sm block">
                {ownerName}, S.Pd.
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] block mb-1">Pendidikan Formal</span>
              <span className="font-semibold text-[#121214] dark:text-[#F4F4F6] block">
                Pendidikan Komputer · FKIP ULM
              </span>
              <span className="text-[#71717A] block mt-0.5">
                Indeks Prestasi Kumulatif (IPK): {stats.gpa} / 4.00
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] block mb-1">Studi Independen Bersertifikat</span>
              <span className="font-semibold text-[#121214] dark:text-[#F4F4F6] block">
                Bangkit Academy 2024 Batch 2
              </span>
              <span className="text-[#71717A] block mt-0.5">
                Google, GoTo, Tokopedia, Traveloka (Cloud Computing)
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] block mb-1">Statistik Portofolio</span>
              <span className="font-semibold text-[#121214] dark:text-[#F4F4F6] block">
                {stats.projectsCount} Proyek Sistem Rekayasa · {stats.certificatesCount} Sertifikat Resmi
              </span>
            </div>

            <div>
              <span className="text-[#71717A] dark:text-[#A1A1AA] block mb-1">Domisili &amp; Fleksibilitas</span>
              <span className="font-semibold text-[#121214] dark:text-[#F4F4F6] block">
                Banjarmasin, Indonesia (Siap On-Site &amp; Remote)
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
