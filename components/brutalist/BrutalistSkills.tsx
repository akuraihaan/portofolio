"use client";

import React from "react";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface SkillItem {
  name: string;
  tag?: string;
  icon?: string;
}

interface SkillCategory {
  key: string;
  number: string;
  title: string;
  subtitle: string;
  color: string;
  textColor: string;
  shadowColor: string;
  icon: React.ReactNode;
  skills: SkillItem[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "frontend",
    number: "01",
    title: "FRONTEND REKAYASA WEB",
    subtitle: "Modern Component Architecture & State Orchestration",
    color: "bg-[#FFE500]",
    textColor: "text-black",
    shadowColor: "shadow-[6px_6px_0px_#000]",
    icon: <Code2 size={24} className="stroke-[2.5]" />,
    skills: [
      { name: "Next.js (App Router)", tag: "Framework Utama" },
      { name: "React 19", tag: "UI Core" },
      { name: "TypeScript", tag: "Type-Safe" },
      { name: "Tailwind CSS", tag: "Utility-First" },
      { name: "Framer Motion", tag: "Motion Engine" },
      { name: "JavaScript ES6+", tag: "Vanilla Modern" },
      { name: "HTML5 & CSS3 Semantik", tag: "Aksesibilitas" },
    ],
  },
  {
    key: "backend",
    number: "02",
    title: "BACKEND & API SERVICES",
    subtitle: "High-Performance Server Logic & Data Contracts",
    color: "bg-[#0047FF]",
    textColor: "text-white",
    shadowColor: "shadow-[6px_6px_0px_#000]",
    icon: <Server size={24} className="stroke-[2.5]" />,
    skills: [
      { name: "Node.js", tag: "Runtime" },
      { name: "Express.js", tag: "REST API" },
      { name: "Next.js Server Actions", tag: "Full-Stack" },
      { name: "Python", tag: "Scripting & ML" },
      { name: "FastAPI", tag: "Microservices" },
      { name: "Autentikasi JWT & Sesi", tag: "Keamanan" },
      { name: "Middleware Pipeline", tag: "Proteksi" },
    ],
  },
  {
    key: "database",
    number: "03",
    title: "DATABASE & PERSISTENSI DATA",
    subtitle: "Relational Modeling, Query Optimization & RLS",
    color: "bg-[#FF5C00]",
    textColor: "text-white",
    shadowColor: "shadow-[6px_6px_0px_#000]",
    icon: <Database size={24} className="stroke-[2.5]" />,
    skills: [
      { name: "PostgreSQL", tag: "Relasional Inti" },
      { name: "Supabase", tag: "BaaS & Storage" },
      { name: "Row Level Security (RLS)", tag: "Kebijakan Data" },
      { name: "SQLite / Room DB", tag: "Penyimpanan Lokal" },
      { name: "Database Migrations", tag: "Skema DDL" },
      { name: "Query Indexing & Optimasi", tag: "Performa" },
    ],
  },
  {
    key: "cloud",
    number: "04",
    title: "CLOUD COMPUTING & INFRASTRUKTUR",
    subtitle: "Bangkit Academy Alumnus Expertise in Google Cloud",
    color: "bg-[#C8F169]",
    textColor: "text-black",
    shadowColor: "shadow-[6px_6px_0px_#000]",
    icon: <Cloud size={24} className="stroke-[2.5]" />,
    skills: [
      { name: "Google Cloud Platform", tag: "Alumni Bangkit" },
      { name: "GCP Cloud Run", tag: "Serverless" },
      { name: "Compute Engine & VM", tag: "Infrastruktur" },
      { name: "Cloud Storage", tag: "Objek Media" },
      { name: "Docker Containerization", tag: "Packaging" },
      { name: "Vercel Edge Deployment", tag: "Global CDN" },
      { name: "CI/CD Deployment Actions", tag: "Automasi" },
    ],
  },
  {
    key: "tools",
    number: "05",
    title: "TOOLS, WORKFLOW & DESAIN",
    subtitle: "Developer Ergonomics, Prototyping & Inspection",
    color: "bg-white dark:bg-[#1A1A1A]",
    textColor: "text-black dark:text-white",
    shadowColor: "shadow-[6px_6px_0px_#FFE500]",
    icon: <Wrench size={24} className="stroke-[2.5]" />,
    skills: [
      { name: "Git & GitHub", tag: "Version Control" },
      { name: "Figma", tag: "UI/UX Design" },
      { name: "Turbopack & Vite", tag: "Build Tooling" },
      { name: "Postman & Insomnia", tag: "API Testing" },
      { name: "Linux & Bash Terminal", tag: "CLI Mastery" },
      { name: "ESLint & Prettier", tag: "Code Quality" },
      { name: "Learning Analytics Tracking", tag: "Riset Edukasi" },
    ],
  },
];

export function BrutalistSkills() {
  return (
    <section
      id="skills"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#0047FF]">
                04 // EXPERIMENTAL SKILLS
              </span>
              <span className="font-mono text-xs font-bold text-[#0047FF] dark:text-[#FFE500] uppercase">
                TANPA PROGRESS BAR GENERIK
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              TEKNOLOGI & KOMPETENSI
            </h2>
          </div>

          <p className="font-sans text-base md:text-lg max-w-md text-neutral-700 dark:text-neutral-300">
            Daftar teknologi dan alat kerja nyata yang digunakan dalam pengembangan produk digital, sistem serverless, dan riset edukasi.
          </p>
        </div>

        {/* 5 Distinct Neo-Brutalist Category Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {SKILL_CATEGORIES.map((category, idx) => {
            // Asymmetrical grid column layout
            const colSpan =
              idx === 0 || idx === 1
                ? "lg:col-span-6"
                : idx === 2
                ? "lg:col-span-4"
                : idx === 3
                ? "lg:col-span-4"
                : "lg:col-span-4";

            return (
              <div
                key={category.key}
                className={`${colSpan} flex flex-col border-4 border-black dark:border-white bg-white dark:bg-[#141414] shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FFF] hover:shadow-[10px_10px_0px_#FF5C00] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200`}
              >
                {/* Category Header Strip */}
                <div
                  className={`p-4 border-b-4 border-black dark:border-white flex items-center justify-between ${category.color} ${category.textColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black border-2 border-current px-1.5 py-0.5">
                      #{category.number}
                    </span>
                    <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-tight">
                      {category.title}
                    </h3>
                  </div>
                  <div>{category.icon}</div>
                </div>

                {/* Subtitle / Spec Note */}
                <div className="px-4 py-2 bg-neutral-100 dark:bg-[#1E1E1E] border-b-2 border-black dark:border-neutral-700 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  {category.subtitle}
                </div>

                {/* Skills Badges Grid */}
                <div className="p-5 flex-1 flex flex-wrap content-start gap-2.5">
                  {category.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="group/badge inline-flex items-center gap-2 p-2 bg-neutral-50 dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700 hover:border-[#0047FF] dark:hover:border-[#FFE500] hover:bg-[#FFE500]/20 transition-colors shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#333]"
                    >
                      <span className="font-display font-bold text-xs md:text-sm text-black dark:text-white">
                        {skill.name}
                      </span>
                      {skill.tag && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {skill.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Card Base Decorator */}
                <div className="px-4 py-2 border-t-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-[#161616] flex items-center justify-between font-mono text-[10px] text-neutral-500">
                  <span>TOTAL: {category.skills.length} TEKNOLOGI</span>
                  <span className="text-[#0047FF] dark:text-[#FFE500] font-bold">STATUS: PRODUKSI</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
