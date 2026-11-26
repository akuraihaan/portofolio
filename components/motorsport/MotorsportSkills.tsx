"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Code2, Server, Database, Palette, Terminal, BookOpen } from "lucide-react";
import { EASINGS } from "../motion/MotionSystem";

export interface SkillDetail {
  name: string;
  level: "Mahir" | "Menengah" | "Kompeten";
  desc: string;
}

export interface DynamicSkillRecord {
  name: string;
  category?: string;
  description?: string;
  level?: number | string;
}

export interface SkillCategoryGroup {
  id: string;
  name: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: SkillDetail[];
}

export const motorsportSkillGroups: SkillCategoryGroup[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    code: "01",
    icon: Code2,
    skills: [
      { name: "Next.js 16 (App Router)", level: "Mahir", desc: "Turbopack, Server Actions, Dynamic Streaming SSR & SSG" },
      { name: "React 19 & Modern Hooks", level: "Mahir", desc: "Concurrent rendering, useActionState, modular components" },
      { name: "TypeScript 5.5", level: "Mahir", desc: "Keamanan tipe data ketat, interface generik, kontrak API" },
      { name: "Tailwind CSS v4", level: "Mahir", desc: "Desain sistem terukur, tipografi fluid, layout responsif" },
      { name: "Framer Motion", level: "Mahir", desc: "Fisika pegas organik, animasi layout, aksesibilitas gerakan" },
      { name: "HTML5 & Web Standards", level: "Mahir", desc: "Struktur semantik, WCAG AAA, kompatibilitas lintas browser" },
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
    name: "Database & Security",
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
      { name: "Editorial Design System", level: "Mahir", desc: "Skala token warna motorsport, spacing unit, atomic design" },
      { name: "Tipografi High-Contrast", level: "Mahir", desc: "Hierarki tipografi display serif Brier & ultra-light sans" },
      { name: "Aksesibilitas Web (WCAG)", level: "Mahir", desc: "Rasio kontras warna, navigasi keyboard penuh, pembaca layar" },
      { name: "Wireframing & Prototyping", level: "Menengah", desc: "Pemetaan user journey, mockup wireframe, uji coba antarmuka" },
    ],
  },
  {
    id: "tools",
    name: "Tools & Infrastructure",
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

interface MotorsportSkillsProps {
  groups?: SkillCategoryGroup[];
  dynamicSkills?: DynamicSkillRecord[];
}

export function MotorsportSkills({
  groups = motorsportSkillGroups,
  dynamicSkills = [],
}: MotorsportSkillsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const prefersReduced = useReducedMotion();

  // Merge dynamic skills from database
  const effectiveGroups = React.useMemo(() => {
    if (!dynamicSkills || dynamicSkills.length === 0) return groups;

    const groupMap = new Map<string, SkillCategoryGroup>();
    groups.forEach((g) => {
      groupMap.set(g.id, { ...g, skills: [...g.skills] });
    });

    dynamicSkills.forEach((ds) => {
      const rawCat = (ds.category || "").toLowerCase();
      let targetId = "tools";
      if (rawCat.includes("front") || rawCat.includes("react") || rawCat.includes("web") || rawCat.includes("css")) {
        targetId = "frontend";
      } else if (rawCat.includes("back") || rawCat.includes("server") || rawCat.includes("api") || rawCat.includes("node")) {
        targetId = "backend";
      } else if (rawCat.includes("data") || rawCat.includes("sql") || rawCat.includes("sec") || rawCat.includes("aman")) {
        targetId = "database";
      } else if (rawCat.includes("design") || rawCat.includes("ui") || rawCat.includes("ux")) {
        targetId = "uiux";
      } else if (rawCat.includes("cloud") || rawCat.includes("devops") || rawCat.includes("tool") || rawCat.includes("git")) {
        targetId = "tools";
      } else if (rawCat.includes("edu") || rawCat.includes("didaktik") || rawCat.includes("pedagogi")) {
        targetId = "pedagogy";
      }

      const targetGroup = groupMap.get(targetId);
      if (targetGroup) {
        const alreadyExists = targetGroup.skills.some((s) => s.name.toLowerCase() === ds.name.toLowerCase());
        if (!alreadyExists) {
          let lvl: "Mahir" | "Menengah" | "Kompeten" = "Mahir";
          if (typeof ds.level === "number") {
            lvl = ds.level >= 80 ? "Mahir" : ds.level >= 60 ? "Menengah" : "Kompeten";
          } else if (ds.level === "Menengah" || ds.level === "Kompeten") {
            lvl = ds.level;
          }
          targetGroup.skills.push({
            name: ds.name,
            level: lvl,
            desc: ds.description || "Kompetensi teknis terverifikasi dalam rekayasa sistem.",
          });
        }
      }
    });

    return Array.from(groupMap.values());
  }, [groups, dynamicSkills]);

  const displayed =
    activeTab === "all" ? effectiveGroups : effectiveGroups.filter((g) => g.id === activeTab);

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: 0.7, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="keahlian"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]/15"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#111111] dark:text-[#D1FF00] uppercase">
          02 // KEAHLIAN &amp; SPESIFIKASI TEKNOLOGI
        </span>
        <div className="h-px flex-1 bg-[#333333]/15" />
        <span className="font-mono text-xs text-[#555555] uppercase tracking-wider">
          STANDAR TEKNIS REKAYASA
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-12">
        <h2 className="font-section-display text-4xl sm:text-5xl text-[#111111] dark:text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
          Spesifikasi kapabilitas teruji dan siap produksi.
        </h2>
        <p className="font-body-editorial text-sm sm:text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed">
          Enam pilar teknis tanpa estimasi persentase acak: seluruh keahlian didukung portofolio kode nyata, skripsi divalidasi ahli, dan sertifikasi industri resmi.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div {...inView(0.1)} className="flex flex-wrap items-center gap-2 mb-12">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-[0.75rem] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#D1FF00] text-[#111111] font-bold"
              : "bg-[#1A1A1A] text-[#AAAAAA] hover:text-[#F5F5F0] border border-[#333333]"
          }`}
        >
          Semua Domain ({effectiveGroups.length})
        </button>
        {effectiveGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`px-4 py-2 rounded-[0.75rem] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === group.id
                ? "bg-[#D1FF00] text-[#111111] font-bold"
                : "bg-[#1A1A1A] text-[#AAAAAA] hover:text-[#F5F5F0] border border-[#333333]"
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
          transition={{ duration: 0.35, ease: EASINGS.editorial }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayed.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className="bg-[#1A1A1A] rounded-[1rem] p-6 sm:p-7 border border-[#333333] shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#333333]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-[0.5rem] bg-[#111111] text-[#D1FF00] border border-[#D1FF00]/30">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-editorial text-xl font-bold text-[#F5F5F0]">
                        {group.name}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#D1FF00] font-bold">
                      {group.code}
                    </span>
                  </div>

                  {/* Skill Items */}
                  <div className="space-y-4">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="pb-3 border-b border-[#333333]/40 last:border-b-0"
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-medium text-xs sm:text-sm text-[#F5F5F0]">
                            {skill.name}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#111111] text-[#D1FF00] border border-[#D1FF00]/30 font-bold">
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-[#AAAAAA] leading-relaxed font-sans font-light">
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
