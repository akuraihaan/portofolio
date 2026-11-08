"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Server, Cloud, HeartHandshake, Layers, Terminal, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface SkillItem {
  name: string;
  level: "Advanced" | "Intermediate" | "Familiar";
  note: string;
  projects?: string[];
}

export interface SkillCategory {
  title: string;
  categoryNumber: string;
  icon: typeof Code2;
  description: string;
  skills: SkillItem[];
}

export const defaultSkillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    categoryNumber: "01",
    icon: Code2,
    description:
      "Membangun antarmuka web modern dengan standar semantik, performa tinggi, aksesibilitas tinggi, dan fluid typography.",
    skills: [
      { name: "Tailwind CSS", level: "Advanced", note: "Utility-first design tokens, dynamic dark mode, fluid clamp layouting", projects: ["Flowwind Learn", "BWORIEY Portfolio"] },
      { name: "HTML5 & Web Semantics", level: "Advanced", note: "Struktur semantik ramah SEO, form accessibility, validasi dokumen", projects: ["Web Pembelajaran", "Sistem Kampus"] },
      { name: "Modern CSS3", level: "Advanced", note: "CSS Grid, Flexbox, keyframe animations, responsive container queries", projects: ["UI/UX Projects"] },
      { name: "JavaScript (ES6+)", level: "Intermediate", note: "Asynchronous DOM manipulation, Web Fetch API, closures, event delegation", projects: ["ComBridge", "Game Interaktif"] },
      { name: "TypeScript / React", level: "Intermediate", note: "Component primitives, state management, Next.js server/client boundaries", projects: ["BWORIEY CMS", "Portfolio"] },
    ],
  },
  {
    title: "Backend",
    categoryNumber: "02",
    icon: Server,
    description:
      "Perancangan logika server, manajemen basis data relasional terindeks, dan penyediaan titik integrasi REST API yang andal.",
    skills: [
      { name: "PHP", level: "Intermediate", note: "Object-oriented scripting, secure session management, form validation", projects: ["SIAKAD ULM", "Proyek Perkuliahan"] },
      { name: "Laravel Framework", level: "Intermediate", note: "MVC architecture, Eloquent ORM, database migrations, Blade templating", projects: ["Sistem Informasi Sekolah", "Aplikasi Ujian"] },
      { name: "RESTful API Engineering", level: "Intermediate", note: "Endpoint architecture, JSON serialization, status handling, CORS", projects: ["ComBridge Backend", "Mobile Services"] },
      { name: "MySQL & Relational DB", level: "Intermediate", note: "Relational schema design, normalization, foreign keys, indexing", projects: ["Database Mahasiswa", "App Storage"] },
      { name: "Supabase & PostgreSQL", level: "Intermediate", note: "Row Level Security (RLS), realtime subscriptions, secure RPC functions", projects: ["BWORIEY Dynamic CMS"] },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    categoryNumber: "03",
    icon: Cloud,
    description:
      "Penerapan infrastruktur cloud modern berbasis standar industri melalui program intensif Bangkit Academy 2024.",
    skills: [
      { name: "Google Cloud Platform (GCP)", level: "Intermediate", note: "Cloud Run container deployment, Cloud Storage buckets, IAM roles", projects: ["Bangkit Capstone 2024"] },
      { name: "Serverless Architecture", level: "Intermediate", note: "Event-driven microservices, auto-scaling, decoupled compute", projects: ["ComBridge BISINDO"] },
      { name: "Vercel Edge Platform", level: "Advanced", note: "Zero-config deployment, Edge CDN caching, On-demand revalidation tags", projects: ["BWORIEY Production"] },
    ],
  },
  {
    title: "Tools & DevOps",
    categoryNumber: "04",
    icon: Terminal,
    description:
      "Alat pengembang, kontrol versi Git, lingkungan kerja lokal, dan otomasi alur rilis modern.",
    skills: [
      { name: "Git & GitHub", level: "Intermediate", note: "Branching workflows, pull requests, semantic commits, merge strategies", projects: ["GitHub @bworiey"] },
      { name: "Laragon & Local Dev", level: "Advanced", note: "Multi-PHP version environment, Nginx/Apache virtual hosts, SSL lokal", projects: ["Full-Stack Workspace"] },
      { name: "Postman API Testing", level: "Intermediate", note: "Endpoint assertion, environment variables, authentication header tests", projects: ["API Capstone"] },
    ],
  },
  {
    title: "Professional & Pedagogical",
    categoryNumber: "05",
    icon: HeartHandshake,
    description:
      "Keahlian pengajaran Informatika, transfer pengetahuan komputasional, komunikasi publik, dan kolaborasi multidisiplin.",
    skills: [
      { name: "Instruksional Informatika", level: "Advanced", note: "Penyusunan materi kurikulum komputasi, praktikum laboratorium sekolah", projects: ["Teaching Assistant SMPN 13"] },
      { name: "Visual Block Programming (Scratch)", level: "Advanced", note: "Fasilitator workshop pengenalan logika coding untuk siswa sekolah", projects: ["Presenter SMPN 1 Panyipatan"] },
      { name: "Cross-Disciplinary Teamwork", level: "Advanced", note: "Kolaborasi antara tim Machine Learning, Mobile Dev, dan Cloud Computing", projects: ["Bangkit Academy Cohort"] },
      { name: "Learning Analytics & Evaluation", level: "Advanced", note: "Riset skripsi pemantauan analitik belajar siswa pada framework web", projects: ["Skripsi S.Pd. ULM 2026"] },
    ],
  },
];

export function EditorialSkills({
  initialCategories,
}: {
  initialCategories?: SkillCategory[];
}) {
  const displayCategories =
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : defaultSkillCategories;

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { setCursor, resetCursor } = useMotionContext();

  const activeCategory = displayCategories[activeCategoryIndex] || displayCategories[0];
  const CategoryIcon = activeCategory.icon || Code2;

  return (
    <section
      id="skills"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            02 / SKILLS
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            TECHNICAL ARSENAL & INDEX
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          VERIFIED COMPETENCIES · NO ARTIFICIAL BARS
        </span>
      </div>

      {/* Headline & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
        <div className="lg:col-span-8">
          <h2 className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE] mb-4">
            Interactive technology index.
          </h2>
          <p className="text-[#777970] dark:text-[#A1A49A] text-base sm:text-lg max-w-2xl leading-relaxed">
            Dikelompokkan berdasarkan fokus rekayasa perangkat lunak dan pedagogi teknologi. Setiap keahlian bersumber dari implementasi nyata pada proyek perkuliahan, capstone Bangkit Academy, dan pengalaman mengajar Informatika.
          </p>
        </div>
      </div>

      {/* Interactive Category Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
        {displayCategories.map((cat, idx) => {
          const isActive = activeCategoryIndex === idx;
          return (
            <button
              key={cat.title}
              onClick={() => setActiveCategoryIndex(idx)}
              onMouseEnter={() => setCursor({ active: true, text: `CAT 0${idx + 1}` })}
              onMouseLeave={resetCursor}
              className={`relative px-5 py-3 rounded-2xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? "bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] border-transparent shadow-md"
                  : "bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] text-[#777970] dark:text-[#A1A49A] border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#F4F3EE]/30"
              }`}
            >
              <span className={`text-[10px] ${isActive ? "opacity-70" : "opacity-40"}`}>
                0{idx + 1}
              </span>
              <span>{cat.title}</span>
              {isActive && (
                <motion.span
                  layoutId="activeCategoryDot"
                  className="w-1.5 h-1.5 rounded-full bg-[#C8F169] dark:bg-[#171816] ml-1"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Category Panel with Layout Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: EASINGS.editorial }}
          className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-xl"
        >
          {/* Header of Active Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E9E8E1] dark:bg-[#111310] flex items-center justify-center text-[#171816] dark:text-[#C8F169] shadow-sm">
                <CategoryIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE]">
                  {activeCategory.title}
                </h3>
                <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                  CATALOG // SECTION 0{activeCategoryIndex + 1} · {activeCategory.skills.length} VERIFIED CAPABILITIES
                </span>
              </div>
            </div>

            <p className="max-w-md font-sans text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] leading-relaxed">
              {activeCategory.description}
            </p>
          </div>

          {/* List of Skills inside category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCategory.skills.map((skill, sIdx) => {
              const isHovered = hoveredSkill === skill.name;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.05, duration: DURATION.normal }}
                  onMouseEnter={() => {
                    setHoveredSkill(skill.name);
                    setCursor({ active: true, text: "TECH" });
                  }}
                  onMouseLeave={() => {
                    setHoveredSkill(null);
                    resetCursor();
                  }}
                  className={`p-5 rounded-2xl transition-all duration-300 border ${
                    isHovered
                      ? "bg-[#E9E8E1] dark:bg-[#111310] border-[#171816]/30 dark:border-[#C8F169]/40 shadow-md scale-[1.01]"
                      : "bg-[#F4F3EE]/60 dark:bg-[#111310]/50 border-[#171816]/5 dark:border-[#F4F3EE]/5 hover:border-[#171816]/20 dark:hover:border-[#F4F3EE]/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE]">
                      {skill.name}
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        skill.level === "Advanced"
                          ? "bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border-[#C8F169]/30"
                          : "bg-black/5 dark:bg-white/10 text-[#777970] dark:text-[#A1A49A] border-black/10 dark:border-white/10"
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-[#777970] dark:text-[#A1A49A] leading-relaxed mb-3">
                    {skill.note}
                  </p>

                  {/* Connected Projects Pill List */}
                  {skill.projects && skill.projects.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#171816]/5 dark:border-[#F4F3EE]/5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#777970]/70 dark:text-[#A1A49A]/70 mr-1">
                        Applied in:
                      </span>
                      {skill.projects.map((proj) => (
                        <span
                          key={proj}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-[#171816] dark:text-[#F4F3EE]"
                        >
                          {proj}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
