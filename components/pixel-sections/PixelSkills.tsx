"use client";

import React, { useState } from "react";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { Code2, Server, Cloud, Cpu, BookOpen, Layers, Terminal, CheckCircle2 } from "lucide-react";

export interface SkillCategory {
  id: string;
  name: string;
  code: string;
  icon: any;
  skills: {
    name: string;
    level: "PROD" | "EXPERT" | "CORE";
    desc: string;
    highlight?: boolean;
  }[];
}

const defaultSkillCategories: SkillCategory[] = [
  {
    id: "frontend",
    name: "Frontend & Motion Engineering",
    code: "01",
    icon: Code2,
    skills: [
      { name: "TypeScript", level: "PROD", desc: "Strict type safety, generic types, robust interfaces", highlight: true },
      { name: "Next.js (App Router)", level: "PROD", desc: "Turbopack, Server Actions, SSR & Streaming", highlight: true },
      { name: "React 19", level: "PROD", desc: "Concurrent features, use hooks, Actions", highlight: true },
      { name: "Tailwind CSS", level: "EXPERT", desc: "Design systems, fluid typography, arbitrary variants", highlight: true },
      { name: "Framer Motion", level: "EXPERT", desc: "Spring physics, layout transitions, reduced motion", highlight: true },
      { name: "HTML5 Canvas", level: "CORE", desc: "2D isometric projection, pixel art engines, 60fps loop" },
    ],
  },
  {
    id: "backend",
    name: "Backend, Database & Security",
    code: "02",
    icon: Server,
    skills: [
      { name: "Supabase & PostgreSQL", level: "PROD", desc: "Row Level Security (RLS), stored procedures (RPC), realtime", highlight: true },
      { name: "Node.js & Next API", level: "PROD", desc: "RESTful endpoints, secure middleware, rate limiting" },
      { name: "Database Design", level: "EXPERT", desc: "Relational schema modeling, normalization, indexed queries" },
      { name: "Auth & RBAC", level: "PROD", desc: "Session management, MFA, secure cookie tokens" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud, Infrastructure & DevOps",
    code: "03",
    icon: Cloud,
    skills: [
      { name: "Vercel Edge Platform", level: "PROD", desc: "Instant invalidation, serverless functions, analytics", highlight: true },
      { name: "Git & GitHub CLI", level: "EXPERT", desc: "SSH deployment keys, semantic commit trees, worktrees" },
      { name: "Linux / Shell", level: "CORE", desc: "PowerShell, Bash scripting, process automation" },
      { name: "PGLite & Test Suites", level: "CORE", desc: "In-memory database isolation, TAP runners, smoke tests" },
    ],
  },
  {
    id: "pedagogy",
    name: "Pedagogical & Instructional Tech",
    code: "04",
    icon: BookOpen,
    skills: [
      { name: "Instructional Design", level: "EXPERT", desc: "Kurikulum komputasi terstruktur, lesson plans", highlight: true },
      { name: "Learning Analytics", level: "EXPERT", desc: "Evaluasi pemahaman mahasiswa, riset empiris skripsi" },
      { name: "Technical Writing", level: "PROD", desc: "PRD documentation, API specifications, user manuals" },
      { name: "Figma to Production", level: "EXPERT", desc: "High-fidelity component token translation" },
    ],
  },
];

interface PixelSkillsProps {
  categories?: SkillCategory[];
}

export function PixelSkills({ categories = defaultSkillCategories }: PixelSkillsProps) {
  const [activeTab, setActiveTab] = useState("all");

  const displayedCategories =
    activeTab === "all"
      ? categories
      : categories.filter((c) => c.id === activeTab);

  return (
    <section id="skills" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [02 // STACK]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              TECHNICAL INVENTORY &amp; MATRIX
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
              Verified Capability Matrix.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Keahlian praktis yang telah divalidasi melalui proyek produksi, riset akademik, dan standar industri modern.
            </p>
          </div>
        </PixelReveal>

        {/* Filter Category Tabs */}
        <PixelReveal delay={0.2}>
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#171816]/10 dark:border-white/10 font-pixel text-[8px] sm:text-[9px]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2 border transition-colors ${
                activeTab === "all"
                  ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                  : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
              }`}
            >
              [ALL_MODULES]
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-2 border transition-colors ${
                  activeTab === cat.id
                    ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                    : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
                }`}
              >
                [{cat.code} · {cat.name.split(" ")[0].toUpperCase()}]
              </button>
            ))}
          </div>
        </PixelReveal>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedCategories.map((cat, idx) => {
            const Icon = cat.icon || Code2;
            return (
              <PixelReveal key={cat.id} delay={0.15 + idx * 0.1}>
                <PixelCard variant="default" className="h-full flex flex-col justify-between">
                  <div>
                    {/* Module Title */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#171816]/10 dark:border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border border-black/30">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A]">
                            MODULE_{cat.code}
                          </span>
                          <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE] leading-snug">
                            {cat.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Skill Chips List */}
                    <div className="space-y-3">
                      {cat.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className={`p-3 border transition-colors ${
                            skill.highlight
                              ? "bg-[#C8F169]/10 dark:bg-[#C8F169]/5 border-[#C8F169]/60 dark:border-[#C8F169]/40"
                              : "bg-[#171816]/5 dark:bg-[#111310] border-[#171816]/10 dark:border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-[#171816] dark:text-[#F4F3EE] flex items-center gap-1.5">
                              {skill.highlight && (
                                <span className="w-1.5 h-1.5 bg-[#C8F169]" />
                              )}
                              <span>{skill.name}</span>
                            </span>
                            <span
                              className={`font-pixel text-[8px] px-2 py-0.5 border ${
                                skill.level === "PROD"
                                  ? "bg-[#C8F169] text-[#171816] border-[#171816]"
                                  : "bg-[#171816] text-[#F4F3EE] dark:bg-[#1C1F1A] dark:text-[#C8F169] border-[#171816] dark:border-[#C8F169]/40"
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] leading-relaxed">
                            {skill.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#171816]/10 dark:border-white/10 flex items-center justify-between font-mono text-[10px] text-[#777970] dark:text-[#A1A49A]">
                    <span>STATUS: VALIDATED IN PRODUCTION</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  </div>
                </PixelCard>
              </PixelReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

