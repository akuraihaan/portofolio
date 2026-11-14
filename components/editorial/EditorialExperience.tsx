"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ExperienceRecord {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  typeBadge?: string;
  description: string;
  responsibilities: string[];
}

export const defaultExperiences: ExperienceRecord[] = [
  {
    id: "flowwind-lead",
    role: "Lead Full-Stack Developer & Researcher",
    organization: "Universitas Lambung Mangkurat (ULM)",
    period: "2025 – 2026",
    location: "Banjarmasin, Indonesia",
    typeBadge: "Riset Skripsi & Pengembangan Sistem",
    description:
      "Merancang dan mengembangkan platform pembelajaran interaktif Flowwind Learn berbasis Laravel dan MySQL dengan sistem Learning Analytics untuk memetakan pemahaman konsep Tailwind CSS pada mahasiswa.",
    responsibilities: [
      "Mengembangkan in-browser interactive code editor dengan preview iframe real-time terisolasi",
      "Mengimplementasikan algoritma perekaman data analitik belajar (dwell time, syntax accuracy)",
      "Meraih hasil validasi sangat layak dari tim validator ahli media dan materi pendidikan komputasi",
    ],
  },
  {
    id: "bangkit-2024",
    role: "Cloud Computing Cohort (Capstone Lead)",
    organization: "Bangkit Academy by Google, GoTo, Tokopedia, Traveloka",
    period: "2024 – 2025",
    location: "Jakarta / Remote, Indonesia",
    typeBadge: "Studi Independen Bersertifikat",
    description:
      "Menyelesaikan kurikulum intensif arsitektur cloud Google Cloud Platform (GCP) dan bertindak sebagai Cloud Engineer dalam tim capstone ComBridge BISINDO.",
    responsibilities: [
      "Lulus dengan predikat kelulusan cohort tinggi dan sertifikasi resmi dari Google & mitra konsorsium",
      "Men-deploy backend microservices di Google Cloud Run dengan kontainer Docker terisolasi",
      "Menghubungkan layanan API cloud dengan model machine learning computer vision dan aplikasi Android",
    ],
  },
  {
    id: "asisten-dosen",
    role: "Asisten Dosen & Laboratorium Komputer",
    organization: "Pendidikan Komputer FKIP Universitas Lambung Mangkurat",
    period: "2023 – 2025",
    location: "Banjarmasin, Indonesia",
    typeBadge: "Akademik & Pedagogi",
    description:
      "Membimbing lebih dari 120+ mahasiswa dalam praktikum mata kuliah Pemrograman Web, Algoritma & Struktur Data, serta Sistem Basis Data.",
    responsibilities: [
      "Menyusun modul praktikum pemrograman terstruktur dan latihan kode interaktif",
      "Membimbing mahasiswa memecahkan error kode (debugging) dan standar arsitektur database relasional",
      "Mengevaluasi proyek akhir praktikum mahasiswa berdasarkan prinsip clean code",
    ],
  },
  {
    id: "peksiminas-juara",
    role: "Perancang Media Visual & Kampanye Sosial (Juara 2)",
    organization: "Pusat Prestasi Nasional & BEM FKIP ULM",
    period: "2024",
    location: "Banjarmasin, Indonesia",
    typeBadge: "Prestasi Kompetisi Nasional",
    description:
      "Meraih Juara 2 dalam Lomba Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa (Peksiminas) tingkat fakultas/universitas.",
    responsibilities: [
      "Penghargaan Juara 2 Lomba Perancangan Desain Media Kampanye Sosial",
      "Penerapan prinsip tipografi editorial, komposisi visual kontemporer, dan aksesibilitas pesan publik",
    ],
  },
];

export function EditorialExperience({
  experiences = defaultExperiences,
}: {
  experiences?: ExperienceRecord[];
}) {
  const prefersReduced = useReducedMotion();

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="experience"
      className="w-full max-w-6xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-14">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          04 / Experience
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="mb-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-2xl leading-tight mb-4">
          Professional &amp; academic milestones.
        </h2>
        <p className="text-base text-[#86868B] max-w-xl leading-relaxed">
          Rekam jejak rekayasa perangkat lunak, peran kepemimpinan capstone cloud, dan asistensi
          akademik komputasi.
        </p>
      </motion.div>

      {/* Editorial Timeline */}
      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-4%" }}
            transition={{
              duration: DURATION.medium,
              delay: idx * 0.08,
              ease: EASINGS.editorial,
            }}
            className="bg-[#F5F5F7] dark:bg-[#161617] rounded-2xl p-6 sm:p-8 border border-black/[0.04] dark:border-white/[0.06]"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {exp.role}
                </h3>
                <span className="text-sm font-medium text-[#86868B] block mt-0.5">
                  {exp.organization}
                  {exp.location ? ` · ${exp.location}` : ""}
                </span>
              </div>
              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <span className="font-mono text-[10px] text-[#86868B] whitespace-nowrap">
                  {exp.period}
                </span>
                {exp.typeBadge && (
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] text-[#86868B] whitespace-nowrap">
                    {exp.typeBadge}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-relaxed mb-4 font-normal">
              {exp.description}
            </p>

            <ul className="space-y-2">
              {exp.responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#86868B]">
                  <span className="font-mono text-[#86868B] mt-0.5 shrink-0">—</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
