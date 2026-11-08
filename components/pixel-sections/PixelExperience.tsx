"use client";

import React from "react";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { Briefcase, Calendar, MapPin, Award, CheckCircle2 } from "lucide-react";

export interface ExperienceRecord {
  id: string;
  role: string;
  organization: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
  highlights?: string[];
  type?: string;
}

export const defaultExperiences: ExperienceRecord[] = [
  {
    id: "asisten-dosen-ulm",
    role: "Asisten Dosen & Laboratorium Komputer",
    organization: "Pendidikan Komputer FKIP Universitas Lambung Mangkurat",
    location: "Banjarmasin, Indonesia",
    start_date: "2023",
    end_date: "2025",
    type: "Akademik & Pedagogi",
    description:
      "Membimbing mahasiswa dalam praktikum mata kuliah Pemrograman Web, Algoritma & Struktur Data, serta Sistem Basis Data. Mengembangkan modul modul praktikum terstruktur dan mengevaluasi tugas pemrograman.",
    highlights: [
      "Membimbing lebih dari 100+ mahasiswa dalam praktikum komputasi terstruktur",
      "Mengembangkan modul materi latihan pemrograman interaktif",
      "Mengevaluasi kode tugas akhir praktikum dengan standar clean code",
    ],
  },
  {
    id: "bangkit-2024",
    role: "Cloud Computing Cohort",
    organization: "Bangkit Academy led by Google, GoTo, Traveloka",
    location: "Remote / Indonesia",
    start_date: "2024",
    end_date: "2025",
    type: "Studi Independen Bersertifikat",
    description:
      "Menyelesaikan kurikulum intensif arsitektur cloud Google Cloud Platform (GCP), deployment backend container microservices, dan berkolaborasi dalam proyek capstone ComBridge BISINDO.",
    highlights: [
      "Sertifikasi penyelesaian program Bangkit dengan predikat kelulusan tinggi",
      "Merancang dan men-deploy arsitektur cloud serverless di Google Cloud Run",
      "Kolaborasi agile lintas disiplin dengan divisi Machine Learning & Android",
    ],
  },
  {
    id: "peksiminas-design",
    role: "Perancang Media Kampanye Sosial",
    organization: "Pusat Prestasi Nasional & BEM FKIP ULM",
    location: "Banjarmasin, Indonesia",
    start_date: "2024",
    end_date: "2024",
    type: "Prestasi / Kompetisi",
    description:
      "Meraih Juara 2 dalam Lomba Desain Media Kampanye Sosial. Mengembangkan identitas visual dan materi komunikasi publik berbasis prinsip desain editorial dan aksesibilitas.",
    highlights: [
      "Juara 2 Tingkat Universitas / Fakultas",
      "Eksplorasi tipografi, komposisi asimetris, dan pesan sosial humanis",
    ],
  },
];

interface PixelExperienceProps {
  experiences?: ExperienceRecord[];
}

export function PixelExperience({ experiences = defaultExperiences }: PixelExperienceProps) {
  return (
    <section id="experience" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [04 // LOG]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              EXPERIENCE &amp; QUEST TIMELINE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
              Milestone &amp; Trajectory.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Jejak perjalanan profesional, pengalaman instruksional akademik, dan program inkubasi industri.
            </p>
          </div>
        </PixelReveal>

        {/* Vertical Pipeline Timeline */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-[#171816]/20 dark:border-[#C8F169]/30 space-y-12">
          {experiences.map((exp, idx) => (
            <PixelReveal key={exp.id} delay={0.15 + idx * 0.1}>
              <div className="relative group">
                {/* Pixel Node on timeline */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 bg-[#171816] dark:bg-[#C8F169] border-2 border-white dark:border-[#111310] shadow-pixel group-hover:scale-125 transition-transform" />

                <PixelCard variant="default" className="p-6 sm:p-8">
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#171816]/10 dark:border-white/10">
                    <div>
                      <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase">
                        NODE_{String(idx + 1).padStart(2, "0")} · {exp.type || "PENGALAMAN"}
                      </span>
                      <h3 className="font-display font-black text-xl sm:text-2xl text-[#171816] dark:text-[#F4F3EE]">
                        {exp.role}
                      </h3>
                      <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mt-0.5">
                        {exp.organization}
                      </p>
                    </div>

                    <div className="font-pixel text-[8px] px-3 py-1 bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] self-start sm:self-auto shadow-sm">
                      {exp.start_date} — {exp.end_date || "SELESAI"}
                    </div>
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="text-sm sm:text-base text-[#171816]/85 dark:text-[#F4F3EE]/85 font-sans leading-relaxed mb-4">
                      {exp.description}
                    </p>
                  )}

                  {/* Highlights Bullet List */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-mono text-[#777970] dark:text-[#A1A49A]">
                          <span className="text-[#171816] dark:text-[#C8F169] font-bold">▶</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </PixelCard>
              </div>
            </PixelReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

