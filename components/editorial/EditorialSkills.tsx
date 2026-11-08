"use client";

import React, { useState } from "react";
import { Code2, Server, Cloud, BookOpen } from "lucide-react";

export interface SkillItem {
  name: string;
  level: "Advanced" | "Intermediate" | "Proficient";
  desc: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: SkillItem[];
}

export const defaultSkillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend & Interactive Engineering",
    code: "01",
    icon: Code2,
    skills: [
      { name: "Next.js 16 (App Router)", level: "Advanced", desc: "Turbopack, Server Actions, Dynamic Streaming & SSR" },
      { name: "React 19", level: "Advanced", desc: "Concurrent rendering, useActionState, component composition" },
      { name: "TypeScript 5.5", level: "Advanced", desc: "Strict type safety, generic interfaces, API contracts" },
      { name: "Tailwind CSS v4", level: "Advanced", desc: "Design systems, fluid responsive typography, custom tokens" },
      { name: "Framer Motion", level: "Advanced", desc: "Organic spring physics, layout animations, accessible transitions" },
      { name: "HTML5 & Web Standards", level: "Advanced", desc: "Semantic structure, responsive canvas, cross-browser compatibility" },
    ],
  },
  {
    id: "backend",
    name: "Backend, Database & Security",
    code: "02",
    icon: Server,
    skills: [
      { name: "Supabase & PostgreSQL", level: "Advanced", desc: "Row-Level Security (RLS), stored procedures, realtime subscriptions" },
      { name: "Node.js & Express REST", level: "Advanced", desc: "Microservices architecture, JWT authentication, request validation" },
      { name: "PHP & Laravel Framework", level: "Advanced", desc: "MVC architecture, Eloquent ORM, Blade templating" },
      { name: "Docker Containerization", level: "Intermediate", desc: "Multi-stage builds, isolated container environments, Cloud Run" },
      { name: "Relational Database Design", level: "Advanced", desc: "Schema normalization, indexing, data integrity constraints" },
    ],
  },
  {
    id: "cloud-data",
    name: "Cloud Infrastructure & Data",
    code: "03",
    icon: Cloud,
    skills: [
      { name: "Google Cloud Platform (GCP)", level: "Advanced", desc: "Cloud Run serverless, Artifact Registry, IAM roles (Bangkit Capstone)" },
      { name: "Vercel Edge Platform", level: "Advanced", desc: "Edge middleware, global CDN caching, zero-config invalidation" },
      { name: "Learning Analytics Pipelines", level: "Advanced", desc: "Perekaman telemetry belajar siswa, analisis dwell time, riset skripsi" },
      { name: "Python 3.12 & Web Scraping", level: "Intermediate", desc: "Automated crawling dengan BeautifulSoup & analisis dataset Kaggle" },
      { name: "Git & Version Control", level: "Advanced", desc: "Branching strategies, SSH keys, continuous integration" },
    ],
  },
  {
    id: "pedagogy",
    name: "Pedagogy & Engineering Standards",
    code: "04",
    icon: BookOpen,
    skills: [
      { name: "Instructional System Design", level: "Advanced", desc: "Metodologi riset R&D ADDIE untuk pengembangan media komputasi" },
      { name: "Automated Software Testing", level: "Advanced", desc: "Node TAP, unit testing, isolasi database PostgreSQL pengujian" },
      { name: "Web Accessibility (WCAG AAA)", level: "Advanced", desc: "Semantic markup, keyboard navigation, reduced motion modes" },
      { name: "CI/CD GitHub Actions", level: "Intermediate", desc: "Automated build verification, typechecking, and deployment pipelines" },
    ],
  },
];

export function EditorialSkills({
  categories = defaultSkillCategories,
}: {
  categories?: SkillCategory[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const displayed =
    activeTab === "all" ? categories : categories.filter((c) => c.id === activeTab);

  return (
    <section
      id="skills"
      className="w-full max-w-5xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          02 / Skills &amp; Tech Specs
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      {/* Main Headline */}
      <div className="mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-2xl leading-tight mb-4">
          Engineered for performance and clarity.
        </h2>
        <p className="text-base text-[#86868B] max-w-xl leading-relaxed">
          Struktur kapabilitas teknis yang diorganisasikan berdasarkan domain rekayasa perangkat lunak, infrastruktur awan, dan metodologi instruksional.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-12">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            activeTab === "all"
              ? "bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
              : "bg-[#F5F5F7] text-[#86868B] dark:bg-[#161617] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
          }`}
        >
          All Domains
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveTab(c.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              activeTab === c.id
                ? "bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
                : "bg-[#F5F5F7] text-[#86868B] dark:bg-[#161617] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
            }`}
          >
            {c.name.split("&")[0].trim()}
          </button>
        ))}
      </div>

      {/* Apple-Style Technical Specification Matrix */}
      <div className="space-y-12">
        {displayed.map((category) => (
          <div
            key={category.id}
            className="bg-[#F5F5F7] dark:bg-[#161617] rounded-3xl p-6 sm:p-8 border border-black/[0.04] dark:border-white/[0.06]"
          >
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <category.icon className="w-4 h-4 text-[#86868B]" />
              <h3 className="font-display font-semibold text-lg text-[#1D1D1F] dark:text-[#F5F5F7]">
                {category.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col pb-3 border-b border-black/[0.04] dark:border-white/[0.04] last:border-b-0"
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-medium text-sm text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {skill.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#86868B]">
                      {skill.level}
                    </span>
                  </div>
                  <span className="text-xs text-[#86868B] leading-relaxed">
                    {skill.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
