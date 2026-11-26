"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Clock, ArrowUpRight, Tag } from "lucide-react";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS } from "../motion/MotionSystem";

export interface MotorsportArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  thumbnail_url?: string | null;
  tags: string[];
  created_at: string;
  reading_time?: string;
}

export const defaultMotorsportArticles: MotorsportArticleItem[] = [
  {
    id: "art-learning-analytics-flowwind",
    slug: "penerapan-learning-analytics-media-pembelajaran-interaktif",
    title: "Implementasi Learning Analytics pada Lingkungan Belajar Web Interaktif",
    category: "Riset Teknologi Pendidikan",
    excerpt:
      "Studi rancang bangun mekanisme perekaman dwell time dan analisis akurasi sintaksis Tailwind CSS secara in-browser tanpa dependensi lokal bagi mahasiswa pemula.",
    tags: ["Learning Analytics", "Tailwind CSS", "Pendidikan Komputer", "ADDIE"],
    created_at: "2026-01-15",
    reading_time: "6 Menit Baca",
  },
  {
    id: "art-gcp-serverless-bisindo",
    slug: "arsitektur-serverless-gcp-cloud-run-inferensi-bisindo",
    title: "Merancang Microservices Serverless Google Cloud Run untuk Inferensi Realtime",
    category: "Cloud Engineering",
    excerpt:
      "Pembahasan arsitektur kontainer Docker multi-stage, konfigurasi Artifact Registry, dan optimasi latensi request API Express.js pada proyek capstone Bangkit Academy 2024.",
    tags: ["GCP", "Cloud Run", "Docker", "Express.js", "Bangkit"],
    created_at: "2025-01-20",
    reading_time: "8 Menit Baca",
  },
  {
    id: "art-gamifikasi-budaya-dayak",
    slug: "gamifikasi-pelestarian-budaya-leksikon-dayak-ngaju",
    title: "Pendekatan Gamifikasi Web untuk Pelestarian Bahasa Daerah Dayak Ngaju",
    category: "Media Pembelajaran",
    excerpt:
      "Eksplorasi penggunaan HTML5 Canvas dan Web Audio API dalam menyusun media kuis interaktif yang meningkatkan retensi kosakata bahasa daerah pada generasi muda.",
    tags: ["Gamifikasi", "Dayak Ngaju", "JavaScript ES6", "Budaya"],
    created_at: "2024-11-10",
    reading_time: "5 Menit Baca",
  },
];

interface MotorsportResearchProps {
  articles?: MotorsportArticleItem[];
}

export function MotorsportResearch({
  articles = defaultMotorsportArticles,
}: MotorsportResearchProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

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
      id="riset"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]/15"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#111111] dark:text-[#D1FF00] uppercase">
          06 // RISET &amp; BASIS PENGETAHUAN
        </span>
        <div className="h-px flex-1 bg-[#333333]/15" />
        <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
          ARTIKEL &amp; RISET ILMIAH
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-14">
        <h2 className="font-section-display text-4xl sm:text-5xl text-[#111111] dark:text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
          Dokumentasi riset, pemikiran arsitektur, dan diseminasi keilmuan.
        </h2>
        <p className="font-body-editorial text-sm sm:text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed">
          Refleksi mendalam seputar desain perangkat lunak instruksional, efisiensi komputasi awan, dan rekayasa web berbasis bukti empiris.
        </p>
      </motion.div>

      {/* Editorial Article Stack */}
      <div className="space-y-6">
        {articles.map((art, idx) => (
          <motion.article
            key={art.id}
            {...inView(0.06 * idx)}
            onMouseEnter={() => setCursor({ active: true, text: "BACA RISET" })}
            onMouseLeave={resetCursor}
            className="group p-6 sm:p-8 rounded-[1.5rem] bg-[#1A1A1A] border border-[#333333] hover:border-[#D1FF00]/80 transition-all flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#D1FF00] font-bold uppercase tracking-wider">
                  {art.category}
                </span>
                <span className="text-[#333333]">&bull;</span>
                <span className="text-[#888888] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#555555]" />
                  {art.reading_time || "5 Menit Baca"}
                </span>
                <span className="text-[#333333]">&bull;</span>
                <span className="text-[#888888]">{art.created_at}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F5F0] group-hover:text-[#D1FF00] transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="font-body-editorial text-xs sm:text-sm text-[#AAAAAA] leading-relaxed font-light">
                {art.excerpt}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {art.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#111111] text-[#888888] border border-[#333333]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[0.75rem] bg-[#111111] text-[#D1FF00] border border-[#333333] group-hover:border-[#D1FF00] font-mono text-xs font-bold uppercase tracking-wider transition-colors">
                <span>BACA RISET</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
