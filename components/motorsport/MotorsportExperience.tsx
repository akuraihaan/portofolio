"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Calendar, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import { EASINGS } from "../motion/MotionSystem";

export interface MotorsportExperienceRecord {
  id: string;
  role: string;
  organization: string;
  period: string;
  location?: string;
  typeBadge?: string;
  description: string;
  responsibilities: string[];
}

export const defaultMotorsportExperiences: MotorsportExperienceRecord[] = [
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

interface MotorsportExperienceProps {
  experiences?: MotorsportExperienceRecord[];
}

export function MotorsportExperience({
  experiences = defaultMotorsportExperiences,
}: MotorsportExperienceProps) {
  const prefersReduced = useReducedMotion();

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-8%" },
          transition: { duration: 0.7, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="pengalaman"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]/15"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#111111] dark:text-[#D1FF00] uppercase">
          04 // REKAM JEJAK &amp; PENDIDIKAN
        </span>
        <div className="h-px flex-1 bg-[#333333]/15" />
        <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
          TIMELINE EDITORIAL &middot; INDIKATOR LIME
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-16">
        <h2 className="font-section-display text-4xl sm:text-5xl text-[#111111] dark:text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
          Pengalaman profesional, kepemimpinan riset, dan rekam akademik.
        </h2>
        <p className="font-body-editorial text-sm sm:text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed">
          Dedikasi nyata dalam pengembangan kurikulum komputasi, infrastruktur cloud Bangkit Academy, dan diseminasi riset teknologi pendidikan.
        </p>
      </motion.div>

      {/* Formal Degree Card (ULM) */}
      <motion.div
        {...inView(0.1)}
        className="mb-16 p-7 sm:p-10 rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00]/40 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[#333333]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-[#D1FF00]" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#D1FF00] uppercase">
                PENDIDIKAN TINGGI FORMAL
              </span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-[#F5F5F0]">
              Universitas Lambung Mangkurat (ULM)
            </h3>
            <p className="font-sans text-sm text-[#CCCCCC] mt-1">
              Sarjana Pendidikan (S.Pd.) &middot; Program Studi Pendidikan Komputer
            </p>
          </div>

          <div className="flex flex-col sm:items-end font-mono">
            <span className="text-xs text-[#888888]">2022 &ndash; 2026</span>
            <span className="text-sm font-bold text-[#D1FF00] mt-1">
              IPK: 3.54 / 4.00 (Magna Cum Laude)
            </span>
          </div>
        </div>

        <div className="pt-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#888888] block mb-2">
            Riset Skripsi Sarjana / Undergraduate Thesis:
          </span>
          <p className="font-editorial text-xl sm:text-2xl text-[#F5F5F0] font-bold leading-snug">
            &ldquo;Penerapan Learning Analytics pada Web Pembelajaran Interaktif Materi Framework Tailwind CSS Dasar&rdquo;
          </p>
          <p className="font-sans text-xs text-[#AAAAAA] mt-3 leading-relaxed">
            Divalidasi dengan predikat &lsquo;Sangat Layak&rsquo; oleh validator ahli materi dan media, platform ini membuktikan bahwa visualisasi analitik belajar efektif memetakan kesulitan mahasiswa dalam memahami kelas utilitas CSS.
          </p>
        </div>
      </motion.div>

      {/* Minimalist Editorial Experience Timeline */}
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            {...inView(0.06 * idx)}
            className="p-6 sm:p-8 rounded-[1rem] bg-[#1A1A1A] border border-[#333333] hover:border-[#D1FF00]/60 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#111111] text-[#D1FF00] border border-[#D1FF00]/40 uppercase tracking-widest">
                    {exp.typeBadge || "PENGALAMAN"}
                  </span>
                  {exp.location && (
                    <span className="font-mono text-xs text-[#888888] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#555555]" />
                      {exp.location}
                    </span>
                  )}
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#F5F5F0] mt-2">
                  {exp.role}
                </h3>
                <p className="font-sans text-sm text-[#CCCCCC]">
                  {exp.organization}
                </p>
              </div>

              {/* Year indicator in Action Lime (DESIGN.md) */}
              <div className="font-mono text-sm font-bold text-[#D1FF00] bg-[#111111] px-3 py-1.5 rounded-[0.5rem] border border-[#333333] self-start sm:self-center">
                {exp.period}
              </div>
            </div>

            <p className="font-body-editorial text-sm text-[#AAAAAA] leading-relaxed mb-4 font-light">
              {exp.description}
            </p>

            {/* Bulleted Key Contributions */}
            <ul className="space-y-2 pt-2 border-t border-[#333333]/50">
              {exp.responsibilities.map((resp, rIdx) => (
                <li
                  key={rIdx}
                  className="flex items-start gap-2.5 font-sans text-xs text-[#CCCCCC] leading-relaxed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D1FF00] shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
