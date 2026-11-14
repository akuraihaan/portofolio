"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ContemporaryExperienceRecord {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  typeBadge?: string;
  description: string;
  responsibilities: string[];
}

export const defaultContemporaryExperiences: ContemporaryExperienceRecord[] = [
  {
    id: "flowwind-lead",
    role: "Lead Full-Stack Developer & Researcher",
    organization: "Universitas Lambung Mangkurat (ULM)",
    period: "2025 – 2026",
    location: "Banjarmasin, Indonesia",
    typeBadge: "Riset Skripsi & Rekayasa Sistem",
    description:
      "Merancang dan mengembangkan platform pembelajaran interaktif Flowwind Learn berbasis Laravel dan MySQL dengan sistem Learning Analytics untuk memetakan pemahaman konsep Tailwind CSS pada mahasiswa.",
    responsibilities: [
      "Mengembangkan in-browser interactive code editor dengan preview iframe real-time terisolasi tanpa dependensi build tool lokal",
      "Mengimplementasikan algoritma perekaman data analitik belajar (dwell time, syntax accuracy, error frequency)",
      "Meraih hasil validasi 'Sangat Layak' dari validator ahli media dan ahli materi pendidikan komputasi",
    ],
  },
  {
    id: "bangkit-2024",
    role: "Cloud Computing Cohort (Capstone Lead)",
    organization: "Bangkit Academy by Google, GoTo, Tokopedia, Traveloka",
    period: "2024 – 2025",
    location: "Jakarta / Daring, Indonesia",
    typeBadge: "Studi Independen Bersertifikat",
    description:
      "Menyelesaikan kurikulum intensif arsitektur cloud Google Cloud Platform (GCP) dan bertindak sebagai Cloud Engineer dalam tim capstone ComBridge BISINDO.",
    responsibilities: [
      "Lulus dengan predikat kelulusan cohort tinggi dan sertifikasi kelulusan resmi dari Google & mitra konsorsium",
      "Men-deploy backend microservices di Google Cloud Run dengan kontainer Docker multi-stage terisolasi",
      "Menghubungkan layanan API cloud berlatensi rendah dengan model inferensi machine learning dan aplikasi Android",
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
      "Menyusun modul praktikum pemrograman terstruktur dan lembar kerja kode interaktif",
      "Membimbing mahasiswa memecahkan error kode (debugging) dan standar perancangan database relasional",
      "Mengevaluasi proyek akhir praktikum mahasiswa berdasarkan prinsip clean code dan kepatuhan standar web",
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
      "Penghargaan Juara 2 dalam perancangan media komunikasi visual dan kampanye sosial edukatif",
      "Penerapan prinsip tipografi editorial, komposisi visual kontemporer, dan aksesibilitas pesan publik",
    ],
  },
];

export function ContemporaryExperience({
  experiences = defaultContemporaryExperiences,
}: {
  experiences?: ContemporaryExperienceRecord[];
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
      id="pengalaman"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          04 // PENGALAMAN &amp; REKAM JEJAK
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:border-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          KARIER &amp; AKADEMIK
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-16">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Perjalanan kepemimpinan proyek, riset komputasi, dan asistensi akademik.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Rekam jejak kepemimpinan pengembangan sistem full-stack, kontribusi cloud engineering berskala industri, serta dedikasi pengajaran ilmu komputer.
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
            transition={{ duration: DURATION.medium, delay: idx * 0.08, ease: EASINGS.editorial }}
            className="bg-white dark:bg-[#121214] rounded-2xl p-6 sm:p-9 border border-black/[0.08] dark:border-white/[0.1] shadow-sm"
          >
            <div className="flex flex-col lg:flex-row lg:items-baseline justify-between gap-4 pb-5 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#121214] dark:text-[#F4F4F6] tracking-tight">
                  {exp.role}
                </h3>
                <span className="font-sans text-sm font-semibold text-[#2563EB] dark:text-[#C8F169] block mt-1">
                  {exp.organization}
                  {exp.location ? ` · ${exp.location}` : ""}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] bg-black/[0.04] dark:bg-white/[0.06] px-3 py-1 rounded-full">
                  {exp.period}
                </span>
                {exp.typeBadge && (
                  <span className="font-mono text-xs font-semibold text-[#121214] dark:text-[#F4F4F6] bg-[#2563EB]/10 dark:bg-[#C8F169]/10 px-3 py-1 rounded-full">
                    {exp.typeBadge}
                  </span>
                )}
              </div>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#121214]/80 dark:text-[#F4F4F6]/80 leading-relaxed font-normal mb-5">
              {exp.description}
            </p>

            <ul className="space-y-2.5">
              {exp.responsibilities.map((resp, rIdx) => (
                <li key={rIdx} className="flex items-start gap-3 font-sans text-xs sm:text-sm text-[#71717A] dark:text-[#A1A1AA]">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#C8F169] mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
