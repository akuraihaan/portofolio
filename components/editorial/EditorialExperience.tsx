"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, Calendar, MapPin, ArrowUpRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

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
      "Pendampingan praktikum komputer & logika algoritma siswa",
      "Penyusunan materi pengantar literasi digital & keamanan informasi",
      "Membantu guru dalam evaluasi dan asesmen pembelajaran",
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
    organization: "Bangkit Academy Batch II (Google, GoTo, Tokopedia, Traveloka)",
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

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 30,
  });

  return (
    <section
      id="experience"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            04 / EXPERIENCE
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            CHRONOLOGICAL TIMELINE
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          CONFIRMED ENGAGEMENTS (2024–2025)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8">
          <h2 className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE] mb-4">
            Practical experience in teaching and technology.
          </h2>
          <p className="text-[#777970] dark:text-[#A1A49A] text-base sm:text-lg max-w-xl leading-relaxed">
            Pengalaman nyata dalam mendampingi pengajaran Informatika, memfasilitasi workshop pemrograman anak, serta menyelesaikan program intensif komputasi awan.
          </p>
        </div>
      </div>

      {/* Animated Vertical Timeline Container */}
      <div ref={containerRef} className="relative pl-6 sm:pl-10 md:pl-16">
        {/* Background Inactive Line */}
        <div className="absolute left-2 sm:left-4 md:left-6 top-4 bottom-4 w-[2px] bg-[#171816]/10 dark:bg-[#F4F3EE]/10" />

        {/* Animated Active Line */}
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute left-2 sm:left-4 md:left-6 top-4 bottom-4 w-[2px] bg-[#C8F169]"
        />

        {/* Timeline Entries with Spotlight Dimming */}
        <div className="group/timeline space-y-10 sm:space-y-12">
          {experiences.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: DURATION.slow, ease: EASINGS.editorial, delay: idx * 0.1 }}
              className="relative p-7 sm:p-10 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-xl transition-all duration-300 group-hover/timeline:opacity-40 hover:!opacity-100 hover:border-[#171816]/30 dark:hover:border-[#C8F169]/40"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-6 sm:-left-10 md:-left-16 top-9 -translate-x-1/2 w-4 h-4 rounded-full bg-[#F4F3EE] dark:bg-[#111310] border-2 border-[#171816] dark:border-[#C8F169] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169]" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Period, Org & Location (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-start">
                  <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#C8F169] uppercase tracking-wider mb-1">
                    {item.period}
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
                    {item.organization}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#777970] dark:text-[#A1A49A] mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#171816] dark:text-[#C8F169]" />
                    <span>{item.location}</span>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E9E8E1] dark:bg-[#111310] text-[11px] font-mono text-[#171816] dark:text-[#F4F3EE] font-semibold border border-[#171816]/5 dark:border-[#F4F3EE]/5">
                      {item.typeBadge}
                    </span>
                  </div>
                </div>

                {/* Role, Description, & Responsibilities (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg sm:text-xl text-[#171816] dark:text-[#F4F3EE] mb-2">
                      {item.role}
                    </h4>
                    <p className="text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Responsibilities list */}
                    <ul className="space-y-2 font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                      {item.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2.5">
                          <span className="text-[#171816] dark:text-[#C8F169] font-bold">›</span>
                          <span className="text-[#171816]/90 dark:text-[#F4F3EE]/90">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
