"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  stats = {
    projectsCount: 7,
    certificatesCount: 5,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: EditorialAboutProps) {
  const prefersReduced = useReducedMotion();

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-8%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="about"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-14">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          01 / About
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </motion.div>

      {/* Main Headline */}
      <motion.h2
        {...inView(0.05)}
        className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-3xl leading-tight mb-14"
      >
        Education meets modern software engineering.
      </motion.h2>

      {/* Two-Column Editorial Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* Left Column: Narrative (7 cols) */}
        <motion.div
          {...inView(0.1)}
          className="md:col-span-7 space-y-6 text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 text-base sm:text-lg leading-relaxed font-normal"
        >
          <p>
            Saya Taufik Raihandani (dikenal secara profesional sebagai{" "}
            <strong>BWORIEY</strong>), lulusan Sarjana Pendidikan Komputer (S.Pd.)
            dari Universitas Lambung Mangkurat dan Alumnus program Bangkit Academy
            2024 yang dipimpin oleh Google, GoTo, Tokopedia, dan Traveloka.
          </p>

          <p className="text-[#86868B] text-base leading-relaxed">
            Latar belakang pendidikan komputasi memberikan perspektif mendalam:
            teknologi digital bukan sekadar tumpukan kode, melainkan media
            instruksional yang harus mempermudah pemahaman manusia. Filosofi ini
            diterapkan langsung dalam riset skripsi melalui{" "}
            <strong>Flowwind Learn</strong> — platform pembelajaran web interaktif
            yang mengintegrasikan Learning Analytics untuk memantau performa siswa
            secara otomatis.
          </p>

          <p className="text-[#86868B] text-base leading-relaxed">
            Dalam rekayasa sistem, berfokus pada arsitektur web modern (Next.js,
            React 19, TypeScript), komputasi awan serverless di Google Cloud
            Platform, dan integrasi database relasional yang aman dengan
            Row-Level Security.
          </p>
        </motion.div>

        {/* Right Column: Specification Sheet (5 cols) */}
        <motion.div
          {...inView(0.18)}
          className="md:col-span-5 bg-[#F5F5F7] dark:bg-[#161617] rounded-2xl p-7 border border-black/[0.04] dark:border-white/[0.06]"
        >
          <span className="font-mono text-[10px] font-semibold tracking-wider text-[#86868B] uppercase block mb-5">
            Profile Specifications
          </span>

          <div className="space-y-4 text-sm font-sans">
            <div className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#86868B] text-xs block mb-0.5">Formal Education</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block">
                S.Pd. Pendidikan Komputer (2022–2026)
              </span>
              <span className="text-xs text-[#86868B] block mt-0.5">
                Universitas Lambung Mangkurat (IPK: {stats.gpa} / 4.00)
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#86868B] text-xs block mb-0.5">Industry Training</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block">
                Bangkit Academy 2024 Batch 2
              </span>
              <span className="text-xs text-[#86868B] block mt-0.5">
                Spesialisasi Cloud Computing (Google, GoTo, Traveloka)
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#86868B] text-xs block mb-0.5">Primary Focus</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block">
                Full-Stack Architecture &amp; Educational Tech
              </span>
            </div>

            <div className="pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[#86868B] text-xs block mb-0.5">Projects &amp; Credentials</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block">
                {stats.projectsCount} projects · {stats.certificatesCount} certificates
              </span>
            </div>

            <div>
              <span className="text-[#86868B] text-xs block mb-0.5">Location &amp; Status</span>
              <span className="font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block">
                Banjarmasin, Indonesia · Open for Roles
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
