"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Palette,
  Terminal,
  BookOpen,
  Cpu,
  Layers,
} from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface SkillDetail {
  name: string;
  level: "Mahir" | "Menengah" | "Kompeten";
  desc: string;
}

export interface SkillCategoryGroup {
  id: string;
  name: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: SkillDetail[];
}

export const contemporarySkillGroups: SkillCategoryGroup[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    code: "01",
    icon: Code2,
    skills: [
      { name: "Next.js 16 (App Router)", level: "Mahir", desc: "Turbopack, Server Actions, Dynamic Streaming SSR & SSG" },
      { name: "React 19 & Modern Hooks", level: "Mahir", desc: "Concurrent rendering, useActionState, arsitektur modular" },
      { name: "TypeScript 5.5", level: "Mahir", desc: "Keamanan tipe data ketat, interface generik, kontrak API" },
      { name: "Tailwind CSS v4", level: "Mahir", desc: "Desain sistem terukur, tipografi fluid, layout responsif" },
      { name: "Framer Motion", level: "Mahir", desc: "Fisika pegas organik, animasi layout, mode aksesibilitas gerakan" },
      { name: "HTML5 & Web Standards", level: "Mahir", desc: "Struktur semantik, canvas responsif, kompatibilitas browser" },
    ],
  },
  {
    id: "backend",
    name: "Backend Development",
    code: "02",
    icon: Server,
    skills: [
      { name: "Node.js & Express REST API", level: "Mahir", desc: "Arsitektur microservices, otentikasi JWT, validasi request aman" },
      { name: "PHP & Laravel Framework", level: "Mahir", desc: "Pola arsitektur MVC, Eloquent ORM, migrasi skema database" },
      { name: "Docker & Containerization", level: "Menengah", desc: "Multi-stage build, isolasi kontainer, konfigurasi Cloud Run" },
      { name: "RESTful API Engineering", level: "Mahir", desc: "Metode HTTP idempoten, spesifikasi API, respons JSON terstandar" },
    ],
  },
  {
    id: "database",
    name: "Database & Keamanan",
    code: "03",
    icon: Database,
    skills: [
      { name: "Supabase & PostgreSQL", level: "Mahir", desc: "Row-Level Security (RLS), stored procedures, realtime subscriptions" },
      { name: "Pemodelan Skema Relasional", level: "Mahir", desc: "Normalisasi tabel, foreign key integrity, pengindeksan performa" },
      { name: "Proteksi Data & OWASP", level: "Mahir", desc: "Sanitasi input server-side, proteksi CSRF/XSS, proteksi secret key" },
      { name: "Redis Caching Layer", level: "Kompeten", desc: "Caching in-memory, rate limiting, mitigasi lonjakan request" },
    ],
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    code: "04",
    icon: Palette,
    skills: [
      { name: "Desain Sistem Terstruktur", level: "Mahir", desc: "Skala token warna, spacing unit konsisten, atomic component design" },
      { name: "Tipografi Editorial", level: "Mahir", desc: "Hierarki tipografi Swiss, kontras optis, fluid clamp scaling" },
      { name: "Aksesibilitas Web (WCAG AAA)", level: "Mahir", desc: "Rasio kontras warna, navigasi keyboard penuh, pembaca layar" },
      { name: "Wireframing & Prototyping", level: "Menengah", desc: "Pemetaan user journey, mockup wireframe, uji coba antarmuka" },
    ],
  },
  {
    id: "tools",
    name: "Tools & Technologies",
    code: "05",
    icon: Terminal,
    skills: [
      { name: "Google Cloud Platform (GCP)", level: "Mahir", desc: "Google Cloud Run serverless, Artifact Registry, IAM (Bangkit Capstone)" },
      { name: "Vercel Edge Platform", level: "Mahir", desc: "Edge middleware, global CDN caching, invalidasi cache tanpa henti" },
      { name: "Git & Version Control", level: "Mahir", desc: "Branching strategies, semantic commits, autentikasi kunci SSH" },
      { name: "Python 3.12 Data Scraping", level: "Menengah", desc: "Web scraping otomatis dengan BeautifulSoup & analisis data Kaggle" },
    ],
  },
  {
    id: "pedagogy",
    name: "Educational Technology",
    code: "06",
    icon: BookOpen,
    skills: [
      { name: "Learning Analytics Engine", level: "Mahir", desc: "Perekaman dwell time, analisis ketuntasan sintaks belajar, riset skripsi" },
      { name: "Metodologi R&D ADDIE", level: "Mahir", desc: "Pengembangan media instruksional berbasis tahapan riset ilmiah" },
      { name: "Desain Media Pembelajaran", level: "Mahir", desc: "Live code editor browser terisolasi, kuis interaktif, gamifikasi kuis" },
      { name: "Pengujian Perangkat Lunak", level: "Mahir", desc: "Node TAP automated testing, isolasi database pengujian (100% pass)" },
    ],
  },
];

export function ContemporarySkills({
  groups = contemporarySkillGroups,
}: {
  groups?: SkillCategoryGroup[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const prefersReduced = useReducedMotion();

  const displayed =
    activeTab === "all" ? groups : groups.filter((g) => g.id === activeTab);

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="keahlian"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          02 // KEAHLIAN &amp; SPESIFIKASI
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          TEKNOLOGI &amp; STANDAR
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-12">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Kemampuan rekayasa yang teruji, terstruktur, dan siap produksi.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Enam domain kapabilitas yang mencakup frontend interaktif, backend dan keamanan database, infrastruktur cloud modern, hingga desain sistem pembelajaran komputasi.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div {...inView(0.1)} className="flex flex-wrap items-center gap-2 mb-12">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] font-bold"
              : "bg-black/[0.04] text-[#71717A] dark:bg-white/[0.06] hover:text-[#121214] dark:hover:text-[#F4F4F6]"
          }`}
        >
          Semua Domain ({groups.length})
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === group.id
                ? "bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] font-bold"
                : "bg-black/[0.04] text-[#71717A] dark:bg-white/[0.06] hover:text-[#121214] dark:hover:text-[#F4F4F6]"
            }`}
          >
            {group.name}
          </button>
        ))}
      </motion.div>

      {/* Skills Matrix Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: EASINGS.editorial }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayed.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className="bg-white dark:bg-[#121214] rounded-2xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#2563EB]/10 dark:bg-[#C8F169]/10 text-[#2563EB] dark:text-[#C8F169]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-display font-bold text-base text-[#121214] dark:text-[#F4F4F6]">
                        {group.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA]">
                      {group.code}
                    </span>
                  </div>

                  {/* Skill Items */}
                  <div className="space-y-4">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="pb-3 border-b border-black/[0.03] dark:border-white/[0.04] last:border-b-0"
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-medium text-xs sm:text-sm text-[#121214] dark:text-[#F4F4F6]">
                            {skill.name}
                          </span>
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                              skill.level === "Mahir"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                                : skill.level === "Menengah"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed font-sans">
                          {skill.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
