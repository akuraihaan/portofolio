"use client";

import { motion } from "framer-motion";
import { Code2, Server, Cloud, HeartHandshake, Layers, Terminal, Sparkles } from "lucide-react";

interface SkillItem {
  name: string;
  level: "Advanced" | "Intermediate" | "Familiar";
  note: string;
}

interface SkillCategory {
  title: string;
  categoryNumber: string;
  icon: typeof Code2;
  description: string;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    categoryNumber: "01",
    icon: Code2,
    description:
      "Membangun antarmuka web yang terstruktur semantik, responsif, cepat, dan aksesibel di berbagai ukuran layar.",
    skills: [
      { name: "Tailwind CSS", level: "Advanced", note: "Utility-first design tokens, dynamic themes, layouting" },
      { name: "HTML5", level: "Advanced", note: "Semantic structure, web accessibility, forms" },
      { name: "CSS3", level: "Advanced", note: "Modern layout models (Flexbox, Grid), animations" },
      { name: "JavaScript", level: "Intermediate", note: "ES6+, asynchronous DOM manipulation, APIs" },
    ],
  },
  {
    title: "Backend Development",
    categoryNumber: "02",
    icon: Server,
    description:
      "Perancangan logika server, manajemen basis data relasional, dan penyediaan titik integrasi REST API yang andal.",
    skills: [
      { name: "PHP", level: "Intermediate", note: "Object-oriented scripting, form processing, secure handling" },
      { name: "Laravel", level: "Intermediate", note: "MVC architecture, Eloquent ORM, Blade, routing" },
      { name: "REST API", level: "Intermediate", note: "Endpoint architecture, JSON serialization, HTTP status" },
      { name: "MySQL", level: "Intermediate", note: "Relational database schema, indexing, foreign keys" },
    ],
  },
  {
    title: "Cloud & Tools",
    categoryNumber: "03",
    icon: Cloud,
    description:
      "Penerapan infrastruktur cloud modern dan alat kolaborasi pengembang berbasis standar industri.",
    skills: [
      { name: "Google Cloud Platform", level: "Intermediate", note: "Cloud Run, Cloud Storage, deployment (Bangkit 2024)" },
      { name: "Cloud Computing Fundamentals", level: "Intermediate", note: "Serverless concepts, IAM, microservices architecture" },
      { name: "Git & GitHub", level: "Intermediate", note: "Version control, branching workflows, pull requests" },
    ],
  },
  {
    title: "Other Skills & Professional Competencies",
    categoryNumber: "04",
    icon: HeartHandshake,
    description:
      "Keterampilan pendukung dalam pengajaran Informatika, kolaborasi tim, dan pemecahan masalah.",
    skills: [
      { name: "Teamwork & Collaboration", level: "Advanced", note: "Kolaborasi lintas divisi (Capstone Bangkit Academy)" },
      { name: "Problem Solving", level: "Advanced", note: "Analisis sistematis kebutuhan pengguna & debugging" },
      { name: "Communication & Instruction", level: "Advanced", note: "Penyampaian materi Informatika & workshop Scratch" },
      { name: "Adaptability", level: "Advanced", note: "Cepat mempelajari paradigma dan perkakas teknologi baru" },
      { name: "Microsoft Office", level: "Advanced", note: "Dokumentasi teknis, analisis data tabulasi, laporan" },
    ],
  },
];

export function EditorialSkills() {
  return (
    <section
      id="skills"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            02 / SKILLS
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            TECHNICAL ARSENAL
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          VERIFIED COMPETENCIES · NO ARTIFICIAL METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.15] mb-4"
          >
            Verified capabilities, rooted in practice.
          </motion.h2>
          <p className="text-charcoal/70 dark:text-white/70 text-base max-w-2xl leading-relaxed">
            Dikelompokkan berdasarkan fokus rekayasa perangkat lunak dan pedagogi teknologi. Setiap keahlian bersumber dari implementasi nyata pada proyek perkuliahan, capstone Bangkit Academy, dan pengalaman mengajar.
          </p>
        </div>
      </div>

      {/* 4 Categorized Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((cat, idx) => {
          const CategoryIcon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#f0eee6] dark:bg-[#1f212a] flex items-center justify-center text-charcoal dark:text-white">
                      <CategoryIcon className="w-4 h-4 text-forest dark:text-lime" />
                    </span>
                    <h3 className="font-display font-bold text-lg text-charcoal dark:text-white">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-charcoal/40 dark:text-white/40">
                    CAT // {cat.categoryNumber}
                  </span>
                </div>

                <p className="text-xs text-charcoal/60 dark:text-white/60 mb-5 leading-relaxed">
                  {cat.description}
                </p>

                {/* List of Skills */}
                <div className="space-y-3 font-mono">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-charcoal dark:text-white">
                          {skill.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            skill.level === "Advanced"
                              ? "bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime border-forest/20 dark:border-lime/30 font-bold"
                              : "bg-black/5 dark:bg-white/10 text-charcoal/70 dark:text-white/70 border-black/10 dark:border-white/10 font-medium"
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal/60 dark:text-white/50 leading-snug">
                        {skill.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

