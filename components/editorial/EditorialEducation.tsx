"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, CheckCircle2, FileText, ArrowUpRight } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface EducationRecord {
  institution?: string;
  degree?: string;
  field_of_study?: string;
  location?: string;
  period?: string;
  gpa?: string;
  description?: string;
  statusBadge?: string;
}

export function EditorialEducation({
  initialEducation,
}: {
  initialEducation?: EducationRecord;
}) {
  const institution = initialEducation?.institution || "Universitas Lambung Mangkurat";
  const degree = initialEducation?.degree || "Bachelor of Education (S.Pd.)";
  const fieldOfStudy = initialEducation?.field_of_study || "Pendidikan Komputer";
  const location = initialEducation?.location || "Fakultas Keguruan dan Ilmu Pendidikan · Banjarmasin";
  const period = initialEducation?.period || "2022 – 2026";
  const gpa = initialEducation?.gpa || "GPA: 3.54 / 4.00 (Sangat Memuaskan)";
  const statusBadge = initialEducation?.statusBadge || "Status: Sudah Lulus (Graduated)";

  return (
    <section
      id="education"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            05 / EDUCATION
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            ACADEMIC BACKGROUND
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          ALMA MATER · S.Pd. DEGREE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Education Highlight Card (8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.slow, ease: EASINGS.editorial }}
          className="lg:col-span-8 p-7 sm:p-12 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E9E8E1] dark:bg-[#111310] flex items-center justify-center text-[#171816] dark:text-[#C8F169] shadow-sm">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
                  {institution}
                </h3>
                <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                  {location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] font-mono text-xs font-bold flex items-center gap-1.5 border border-[#C8F169]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{statusBadge}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
              <span className="text-[#777970] dark:text-[#A1A49A] block mb-1 uppercase text-[10px] tracking-wider">Jenjang & Gelar:</span>
              <span className="text-sm font-bold text-[#171816] dark:text-[#F4F3EE] block">
                {degree}
              </span>
              <span className="text-[#777970] dark:text-[#A1A49A] block mt-0.5">
                {fieldOfStudy}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
              <span className="text-[#777970] dark:text-[#A1A49A] block mb-1 uppercase text-[10px] tracking-wider">Masa Studi & Capaian:</span>
              <span className="text-sm font-bold text-[#171816] dark:text-[#F4F3EE] block">
                {period}
              </span>
              <span className="text-[#171816] dark:text-[#C8F169] font-bold block mt-0.5">
                {gpa}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#171816] dark:text-[#C8F169] uppercase mb-2">
                <FileText className="w-4 h-4" />
                <span>Fokus Skripsi / Tugas Akhir</span>
              </div>
              <h4 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE] mb-2">
                Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework Tailwind CSS
              </h4>
              <p className="text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] leading-relaxed font-sans">
                Penelitian dan pengembangan media instruksional berbasis web interaktif dengan editor kode langsung di browser serta metrik analitik belajar untuk memfasilitasi pemahaman sintaks utility-first bagi siswa dan instruktur Informatika.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Context Card (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.slow, ease: EASINGS.editorial, delay: 0.1 }}
          className="lg:col-span-4 space-y-4"
        >
          <div className="p-6 sm:p-7 rounded-3xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171816] dark:text-[#F4F3EE] mb-3">
              Bidang Kompetensi Akademik
            </h4>
            <ul className="space-y-2.5 font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
              <li className="flex items-start gap-2">
                <span className="text-[#171816] dark:text-[#C8F169] font-bold">›</span>
                <span className="text-[#171816]/90 dark:text-[#F4F3EE]/90">Rekayasa Perangkat Lunak Pendidikan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#171816] dark:text-[#C8F169] font-bold">›</span>
                <span className="text-[#171816]/90 dark:text-[#F4F3EE]/90">Learning Analytics & Evaluasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#171816] dark:text-[#C8F169] font-bold">›</span>
                <span className="text-[#171816]/90 dark:text-[#F4F3EE]/90">Algoritma Pemrograman & Basis Data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#171816] dark:text-[#C8F169] font-bold">›</span>
                <span className="text-[#171816]/90 dark:text-[#F4F3EE]/90">Pengembangan Media Web Interaktif</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-xl font-mono text-xs">
            <span className="text-[#777970] dark:text-[#A1A49A] block mb-1 uppercase text-[10px] tracking-wider">
              ALUMNI INTEGRITY // 2026
            </span>
            <p className="text-[#777970] dark:text-[#A1A49A] leading-relaxed font-sans text-xs">
              Mengkombinasikan keilmuan pedagogi dengan keahlian teknis pemrograman modern untuk menciptakan teknologi yang ramah bagi pengguna dan pembelajar.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
