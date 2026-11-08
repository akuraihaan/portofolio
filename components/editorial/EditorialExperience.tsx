"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ArrowUpRight, GraduationCap } from "lucide-react";

export interface ExperienceRecord {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  typeBadge: string;
  description: string;
  responsibilities: string[];
}

export const defaultExperiences: ExperienceRecord[] = [
  {
    id: "teaching-assistant-smp13",
    role: "Teaching Assistant – Informatics",
    organization: "SMP Negeri 13 Banjarmasin",
    period: "January – July 2025",
    location: "Banjarmasin, Kalimantan Selatan",
    typeBadge: "Pendidikan & Pengajaran",
    description:
      "Mendukung proses pembelajaran Informatika serta membantu pelaksanaan kegiatan belajar mengajar bagi siswa sekolah menengah.",
    responsibilities: [
      "Pendampingan praktikum komputer & logika algoritma",
      "Penyusunan materi pengantar literasi digital & keselamatan siber",
      "Membantu guru dalam evaluasi asesmen pembelajaran siswa",
    ],
  },
  {
    id: "scratch-presenter",
    role: "Scratch Programming Workshop Presenter",
    organization: "SMP Negeri 1 Panyipatan",
    period: "September 2025",
    location: "Tanah Laut, Kalimantan Selatan",
    typeBadge: "Workshop & Pelatihan",
    description:
      "Memperkenalkan konsep dasar pemrograman visual menggunakan Scratch melalui demonstrasi dan praktik interaktif kepada para siswa.",
    responsibilities: [
      "Demonstrasi langsung pemrograman blok visual dan game sederhana",
      "Memandu siswa merancang animasi interaktif pertama mereka",
      "Membangun antusiasme terhadap computational thinking sejak dini",
    ],
  },
  {
    id: "bangkit-cohort",
    role: "Cloud Computing Cohort",
    organization: "Bangkit Academy Batch II (Dicoding Indonesia)",
    period: "September 2024 – January 2025",
    location: "Jakarta, ID (Remote Cohort)",
    typeBadge: "Studi Independen Bersertifikat",
    description:
      "Mengikuti program pembelajaran intensif dalam bidang cloud computing, backend development, dan cloud infrastructure melalui pembelajaran mandiri serta kolaborasi tim capstone lintas disiplin.",
    responsibilities: [
      "Implementasi arsitektur cloud serverless di Google Cloud Platform",
      "Pengembangan RESTful API Express.js untuk aplikasi ComBridge BISINDO",
      "Penyelesaian kurikulum bersertifikat Google Cloud Skills Boost",
    ],
  },
];

export function EditorialExperience({
  initialExperiences,
}: {
  initialExperiences?: ExperienceRecord[];
}) {
  const experiences =
    initialExperiences && initialExperiences.length > 0
      ? initialExperiences
      : defaultExperiences;

  return (
    <section
      id="experience"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            04 / EXPERIENCE
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            CHRONOLOGICAL TIMELINE
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          CONFIRMED ENGAGEMENTS (2024–2025)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.15] mb-3"
          >
            Practical experience in teaching and technology.
          </motion.h2>
          <p className="text-charcoal/70 dark:text-white/70 text-base max-w-xl leading-relaxed">
            Pengalaman nyata dalam mendampingi pengajaran Informatika, memfasilitasi workshop pemrograman anak, serta menyelesaikan program intensif komputasi awan.
          </p>
        </div>
      </div>

      {/* Editorial Timeline List with Spotlight Dimming on Hover */}
      <div className="group/timeline flex flex-col space-y-6">
        {experiences.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="group/item relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300 group-hover/timeline:opacity-40 group-hover/timeline:blur-[0.5px] hover:!opacity-100 hover:!blur-none hover:border-black/30 dark:hover:border-white/30 hover:shadow-lg"
          >
            {/* Period & Org (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-start">
              <span className="font-mono text-xs font-bold text-forest dark:text-lime uppercase tracking-wider mb-1">
                {item.period}
              </span>
              <h3 className="font-display font-bold text-lg text-charcoal dark:text-white">
                {item.organization}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-mono text-charcoal/50 dark:text-white/40 mt-1">
                <MapPin className="w-3 h-3 text-forest dark:text-lime" />
                <span>{item.location}</span>
              </div>
              <div className="mt-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f0eee6] dark:bg-[#1f212a] text-[10px] font-mono text-charcoal/80 dark:text-white/80 border border-black/5 dark:border-white/5">
                  {item.typeBadge}
                </span>
              </div>
            </div>

            {/* Role, Description, & Key Responsibilities (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-xl text-charcoal dark:text-white mb-2">
                  {item.role}
                </h4>
                <p className="text-sm text-charcoal/80 dark:text-white/80 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Bullet points */}
                <ul className="space-y-1.5 font-mono text-xs text-charcoal/70 dark:text-white/70">
                  {item.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-forest dark:text-lime font-bold">›</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

