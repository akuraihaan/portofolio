"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, CheckCircle2, FileText } from "lucide-react";

export function EditorialEducation() {
  return (
    <section
      id="education"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            05 / EDUCATION
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            ACADEMIC BACKGROUND
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          ALMA MATER · S.Pd. DEGREE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Education Highlight Card (8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-black/5 dark:border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest/10 dark:bg-lime/20 flex items-center justify-center text-forest dark:text-lime">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-charcoal dark:text-white">
                  Universitas Lambung Mangkurat
                </h3>
                <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
                  Fakultas Keguruan dan Ilmu Pendidikan · Banjarmasin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: Sudah Lulus (Graduated)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
              <span className="text-charcoal/40 dark:text-white/40 block mb-1">Jenjang & Gelar:</span>
              <span className="text-sm font-bold text-charcoal dark:text-white">
                Bachelor of Education (S.Pd.)
              </span>
              <span className="text-charcoal/60 dark:text-white/60 block mt-0.5">
                Pendidikan Komputer
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
              <span className="text-charcoal/40 dark:text-white/40 block mb-1">Masa Studi & Capaian:</span>
              <span className="text-sm font-bold text-charcoal dark:text-white">
                2022 – 2026
              </span>
              <span className="text-forest dark:text-lime font-bold block mt-0.5">
                GPA: 3.54 / 4.00 (Sangat Memuaskan)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-forest dark:text-lime uppercase mb-2">
                <FileText className="w-4 h-4" />
                <span>Fokus Skripsi / Tugas Akhir</span>
              </div>
              <h4 className="font-display font-bold text-base text-charcoal dark:text-white mb-1">
                Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework Tailwind CSS
              </h4>
              <p className="text-xs text-charcoal/70 dark:text-white/70 leading-relaxed font-sans">
                Penelitian dan pengembangan media instruksional berbasis web interaktif dengan editor kode langsung dan metrik analitik belajar untuk memfasilitasi pemahaman sintaks utility-first bagi siswa dan instruktur Informatika.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Context Card (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-4"
        >
          <div className="p-6 rounded-3xl bg-[#f0eee6] dark:bg-[#14151b] border border-black/5 dark:border-white/10">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-3">
              Bidang Kompetensi Akademik
            </h4>
            <ul className="space-y-2 font-mono text-xs text-charcoal/80 dark:text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-forest dark:text-lime font-bold">›</span>
                <span>Rekayasa Perangkat Lunak Pendidikan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest dark:text-lime font-bold">›</span>
                <span>Learning Analytics & Evaluasi Pembelajaran</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest dark:text-lime font-bold">›</span>
                <span>Algoritma Pemrograman & Basis Data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest dark:text-lime font-bold">›</span>
                <span>Pengembangan Media Web Interaktif</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none font-mono text-xs">
            <span className="text-charcoal/40 dark:text-white/40 block mb-1 uppercase text-[10px]">
              Alumni Integrity
            </span>
            <p className="text-charcoal/70 dark:text-white/70 leading-relaxed font-sans text-xs">
              Mengkombinasikan keilmuan pedagogi dengan keahlian teknis pemrograman modern untuk menciptakan teknologi yang ramah bagi pengguna dan pembelajar.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

