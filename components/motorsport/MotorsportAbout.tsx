"use client";

/**
 * MotorsportAbout — upgraded with full editorial motion choreography:
 * - Headline: word-by-word SplitText reveal
 * - Photo: clip-path masked reveal with parallax
 * - Decorative SVG line draws itself progressively
 * - Stats cards staggered entrance with scale
 * - Prose text fade-stagger from left
 */
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { GraduationCap, Award, BookOpen, Layers } from "lucide-react";
import { SplitText } from "../motion/SplitText";
import { RevealImage } from "../motion/RevealImage";
import {
  staggerContainer,
  staggerItem,
  EASINGS,
  DURATION,
  VIEWPORT_ONCE,
} from "../motion/MotionSystem";

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

const statCards = (stats: NonNullable<MotorsportAboutProps["stats"]>) => [
  { value: stats.gpa || "3.54",           label: "IPK (MAGNA CUM LAUDE)", sub: "S1 Pendidikan Komputer" },
  { value: stats.graduationYear || "2026", label: "TAHUN KELULUSAN",        sub: "Univ. Lambung Mangkurat" },
  { value: String(stats.projectsCount || 7), label: "PROYEK REKAYASA",    sub: "Full-Stack & Cloud" },
  { value: String(stats.certificatesCount || 5), label: "SERTIFIKASI RESMI", sub: "Google, ULM & Sendikom" },
];

const pillars = [
  { code: "01 // ARSITEKTUR", title: "High Performance", desc: "Penerapan Next.js App Router, caching edge, dan Docker untuk latensi minimal." },
  { code: "02 // PEDAGOGI",   title: "Learning Analytics", desc: "Pelacakan metrik belajar real-time dan lingkungan editor interaktif mahasiswa." },
  { code: "03 // KEAMANAN",   title: "PostgreSQL & RLS", desc: "Row-Level Security, sanitasi server-side, dan kepatuhan standar web modern." },
];

export function MotorsportAbout({
  ownerName = "Taufik Raihandani",
  avatarUrl = null,
  stats = { projectsCount: 7, certificatesCount: 5, gpa: "3.54", graduationYear: "2026" },
}: MotorsportAboutProps) {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // SVG draw progress linked to section scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "start 20%"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="tentang"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]/15"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: DURATION.medium, ease: EASINGS.editorial }}
        className="flex items-center gap-3 mb-16"
      >
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#111111] dark:text-[#D1FF00] uppercase">
          01 // TENTANG &amp; LATAR BELAKANG
        </span>
        {/* Decorative SVG draw line */}
        <svg className="flex-1 h-px overflow-visible" aria-hidden>
          <motion.line
            x1="0" y1="0.5" x2="100%" y2="0.5"
            stroke={prefersReduced ? "#33333326" : "#33333326"}
            strokeWidth="1"
            style={{ pathLength: prefersReduced ? 1 : pathLength }}
          />
        </svg>
        <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
          PROFIL REKAYASA &amp; PEDAGOGI
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Word-reveal headline */}
          <div>
            <h2 className="font-section-display text-4xl sm:text-5xl text-[#111111] dark:text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
              <SplitText text="Rekayasa Perangkat Lunak · Riset Edukasi" type="words" />
            </h2>
            <motion.p
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: DURATION.medium, delay: 0.3, ease: EASINGS.editorial }}
              className="font-body-editorial text-sm sm:text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed"
            >
              Memadukan prinsip pedagogi komputasi dengan ketepatan rekayasa perangkat lunak modern.
            </motion.p>
          </div>

          {/* Avatar / portrait if available */}
          {avatarUrl && (
            <RevealImage
              src={avatarUrl}
              alt={ownerName}
              className="w-full max-w-[280px] aspect-square rounded-[1.5rem] overflow-hidden"
              parallax
            />
          )}

          {/* Stats grid staggered */}
          <motion.div
            className="grid grid-cols-2 gap-4 pt-4"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.09, 0.1)}
          >
            {statCards(stats).map((card) => (
              <motion.div
                key={card.label}
                variants={staggerItem}
                className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333] hover:border-[#D1FF00]/40 transition-colors"
              >
                <span className="font-hero-display text-4xl sm:text-5xl font-bold text-[#D1FF00] block">{card.value}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#555555] block mt-1">{card.label}</span>
                <span className="font-mono text-xs text-[#F5F5F0] mt-1 block">{card.sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            className="space-y-5 font-body-editorial text-base sm:text-lg text-[#111111]/90 dark:text-[#F5F5F0]/90 leading-relaxed font-light"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.1, 0.05)}
          >
            {[
              <>Saya adalah lulusan <strong>Pendidikan Komputer FKIP Universitas Lambung Mangkurat (ULM)</strong> yang mendedikasikan ketertarikan pada persimpangan antara rekayasa perangkat lunak skala produksi dan media instruksional berbasis teknologi.</>,
              <>Sebagai alumnus program prestisius <strong>Bangkit Academy 2024 by Google, GoTo, Tokopedia, Traveloka</strong> pada alur Cloud Computing, saya memimpin arsitektur backend serverless, kontainerisasi Docker di GCP Cloud Run, serta integrasi API berlatensi rendah untuk sistem deteksi bahasa isyarat BISINDO.</>,
              <>Dalam riset skripsi sarjana, saya merancang platform pembelajaran interaktif <em>Flowwind Learn</em> yang mengintegrasikan mesin <em>Learning Analytics</em> untuk memantau dwell time serta pemahaman sintaksis Tailwind CSS mahasiswa secara terisolasi tanpa memerlukan instalasi lokal.</>,
            ].map((para, i) => (
              <motion.p key={i} variants={staggerItem}>{para}</motion.p>
            ))}
          </motion.div>

          {/* Three pillars */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#333333]/15"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={staggerContainer(0.1, 0.1)}
          >
            {pillars.map((p) => (
              <motion.div
                key={p.code}
                variants={staggerItem}
                className="p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333] hover:border-[#D1FF00]/40 transition-colors group"
              >
                <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase block mb-1">{p.code}</span>
                <h3 className="font-editorial text-lg font-bold text-[#F5F5F0] mb-2">{p.title}</h3>
                <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
