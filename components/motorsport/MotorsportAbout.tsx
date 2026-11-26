"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Layers } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface MotorsportAboutProps {
  ownerName?: string;
  avatarUrl?: string | null;
  stats?: {
    projectsCount?: number;
    certificatesCount?: number;
    gpa?: string;
    graduationYear?: string;
  };
}

export function MotorsportAbout({
  ownerName = "Taufik Raihandani",
  avatarUrl = null,
  stats = {
    projectsCount: 7,
    certificatesCount: 5,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: MotorsportAboutProps) {
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
      id="tentang"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]/15"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#111111] dark:text-[#D1FF00] uppercase">
          01 // TENTANG &amp; LATAR BELAKANG
        </span>
        <div className="h-px flex-1 bg-[#333333]/15" />
        <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
          PROFIL REKAYASA &amp; PEDAGOGI
        </span>
      </motion.div>

      {/* Asymmetric 1:2 Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column (5 cols): Key Numbers & Credentials */}
        <motion.div {...inView(0.08)} className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="font-section-display text-4xl sm:text-5xl text-[#111111] dark:text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
              Rekayasa Perangkat Lunak &middot; Riset Edukasi
            </h2>
            <p className="font-body-editorial text-sm sm:text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed">
              Memadukan prinsip pedagogi komputasi dengan ketepatan rekayasa perangkat lunak modern untuk menghasilkan platform digital yang cepat, tangguh, dan bermakna.
            </p>
          </div>

          {/* Grid of Key Quantitative Records */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-hero-display text-4xl sm:text-5xl font-bold text-[#D1FF00] block">
                {stats.gpa || "3.54"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555] block mt-1">
                IPK (MAGNA CUM LAUDE)
              </span>
              <span className="font-mono text-xs text-[#F5F5F0] mt-1 block">
                S1 Pendidikan Komputer
              </span>
            </div>

            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-hero-display text-4xl sm:text-5xl font-bold text-[#D1FF00] block">
                {stats.graduationYear || "2026"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555] block mt-1">
                TAHUN KELULUSAN
              </span>
              <span className="font-mono text-xs text-[#F5F5F0] mt-1 block">
                Univ. Lambung Mangkurat
              </span>
            </div>

            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-hero-display text-4xl sm:text-5xl font-bold text-[#D1FF00] block">
                {stats.projectsCount || "7"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555] block mt-1">
                PROYEK REKAYASA
              </span>
              <span className="font-mono text-xs text-[#F5F5F0] mt-1 block">
                Full-Stack &amp; Cloud
              </span>
            </div>

            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-hero-display text-4xl sm:text-5xl font-bold text-[#D1FF00] block">
                {stats.certificatesCount || "5"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555] block mt-1">
                SERTIFIKASI RESMI
              </span>
              <span className="font-mono text-xs text-[#F5F5F0] mt-1 block">
                Google, ULM &amp; Sendikom
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column (7 cols): Editorial Prose & Academic Pillar Cards */}
        <motion.div {...inView(0.14)} className="lg:col-span-7 space-y-8">
          <div className="space-y-5 font-body-editorial text-base sm:text-lg text-[#111111]/90 dark:text-[#F5F5F0]/90 leading-relaxed font-light">
            <p>
              Saya adalah lulusan <strong>Pendidikan Komputer FKIP Universitas Lambung Mangkurat (ULM)</strong> yang mendedikasikan ketertarikan pada persimpangan antara rekayasa perangkat lunak skala produksi dan media instruksional berbasis teknologi.
            </p>
            <p>
              Sebagai alumnus program prestisius <strong>Bangkit Academy 2024 by Google, GoTo, Tokopedia, Traveloka</strong> pada alur Cloud Computing, saya memimpin arsitektur backend serverless, kontainerisasi Docker di GCP Cloud Run, serta integrasi API berlatensi rendah untuk sistem deteksi bahasa isyarat BISINDO.
            </p>
            <p>
              Dalam riset skripsi sarjana, saya merancang platform pembelajaran interaktif <em>Flowwind Learn</em> yang mengintegrasikan mesin <em>Learning Analytics</em> untuk memantau dwell time serta pemahaman sintaksis Tailwind CSS mahasiswa secara terisolasi tanpa memerlukan instalasi lokal.
            </p>
          </div>

          {/* Three Engineering Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#333333]/15">
            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase block mb-1">
                01 // ARSITEKTUR
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#F5F5F0] mb-2">
                High Performance
              </h3>
              <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">
                Penerapan Next.js App Router, caching edge teroptimasi, dan kontainerisasi Docker untuk latensi minimal.
              </p>
            </div>

            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase block mb-1">
                02 // PEDAGOGI
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#F5F5F0] mb-2">
                Learning Analytics
              </h3>
              <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">
                Pelacakan metrik belajar real-time, validasi konsep komputasi, dan lingkungan editor interaktif.
              </p>
            </div>

            <div className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333]">
              <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase block mb-1">
                03 // KEAMANAN
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#F5F5F0] mb-2">
                PostgreSQL &amp; RLS
              </h3>
              <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">
                Proteksi data tingkat baris (RLS), sanitasi payload server-side, dan kepatuhan standar web modern.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
