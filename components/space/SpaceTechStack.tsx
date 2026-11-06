"use client";

import { motion } from "framer-motion";
import { 
  Cpu, 
  Code2, 
  Database, 
  Cloud, 
  Wrench, 
  Sparkles,
  Layers,
  CheckCircle2
} from "lucide-react";

interface TechItem {
  name: string;
  badge?: string;
  desc: string;
  highlight?: boolean;
}

interface TechCategory {
  title: string;
  icon: typeof Code2;
  description: string;
  items: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    title: "Frontend Development",
    icon: Code2,
    description:
      "Bahasa, pustaka, dan framework untuk merancang antarmuka web modern yang responsif, terstruktur, dan berkinerja tinggi.",
    items: [
      { name: "React.js", badge: "Core UI", desc: "Component architecture & custom hooks", highlight: true },
      { name: "Next.js", badge: "App Router", desc: "SSR, Server Actions, & Route Handlers", highlight: true },
      { name: "Tailwind CSS", badge: "Expert", desc: "Responsive styling & custom design tokens", highlight: true },
      { name: "Framer Motion", badge: "Animation", desc: "Interactive layouts & gesture transitions", highlight: true },
      { name: "TypeScript", badge: "Type Safe", desc: "Strict contracts, robust data types" },
      { name: "HTML5 & CSS3", badge: "Semantic", desc: "Accessible DOM & modern CSS layouts" },
    ],
  },
  {
    title: "Backend & Cloud",
    icon: Cloud,
    description:
      "Layanan cloud serverless, RESTful API, dan arsitektur backend yang memastikan ketersediaan dan kehandalan sistem.",
    items: [
      { name: "Google Cloud Platform", badge: "Bangkit 2024", desc: "Cloud Run, Storage, Compute Engine", highlight: true },
      { name: "Laravel (PHP)", badge: "Framework", desc: "MVC, Eloquent ORM, authentication", highlight: true },
      { name: "Express.js & Node", badge: "RESTful", desc: "Asynchronous API & microservices" },
      { name: "RESTful API", badge: "Architecture", desc: "Endpoint design, JSON serialization" },
    ],
  },
  {
    title: "Database & Storage",
    icon: Database,
    description:
      "Pemodelan data relasional terstruktur, Row-Level Security, dan manajemen query yang optimal.",
    items: [
      { name: "MySQL", badge: "Relational", desc: "Schema design, relational indexing, views", highlight: true },
      { name: "Supabase", badge: "BaaS", desc: "PostgreSQL, Auth, RLS, Realtime & Storage", highlight: true },
      { name: "PostgreSQL", badge: "SQL", desc: "ACID compliance & complex querying" },
    ],
  },
  {
    title: "Tools & Workflow",
    icon: Wrench,
    description:
      "Perangkat kontrol versi kolaboratif, desain antarmuka, dan lingkungan pengembangan terstandarisasi.",
    items: [
      { name: "Git & GitHub", badge: "VCS", desc: "Branching workflows, review, & CI/CD", highlight: true },
      { name: "Android Studio", badge: "Mobile", desc: "Native Android & XML UI layouting" },
      { name: "Figma", badge: "UI/UX", desc: "Interactive wireframes & component specs" },
      { name: "VS Code", badge: "Editor", desc: "Primary development workspace & tooling" },
    ],
  },
];

export function SpaceTechStack() {
  return (
    <section
      id="techstack"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default px-6 md:px-12 border-t border-blue-900/20 relative"
    >
      {/* Ambient Backdrop */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Eyebrow & Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 md:mb-20 text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#6ba0ff] uppercase mb-3 flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#2c67ed]" />
          <span>Capabilities & Arsenal</span>
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
            Technical <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">Stack</span>
          </h3>
          <p className="text-sm md:text-base text-slate-400 max-w-md">
            Rangkaian teknologi, framework, dan perangkat lunak yang saya andalkan dalam mewujudkan solusi digital.
          </p>
        </div>
      </motion.div>

      {/* Categorized Rows (1/3 narrative on left + 2/3 pill grid on right) */}
      <div className="space-y-12">
        {techCategories.map((cat, cIdx) => {
          const CategoryIcon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: cIdx * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-3xl bg-[#060a20]/60 border border-[#2c67ed]/15 backdrop-blur-xl relative overflow-hidden"
            >
              {/* Category narrative (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2c67ed]/15 border border-[#2c67ed]/30 w-fit mb-3">
                  <CategoryIcon className="w-4 h-4 text-[#60a5fa]" />
                  <span className="text-xs font-mono font-bold text-blue-200 uppercase tracking-wider">
                    {cat.title}
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                  {cat.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Grid of items (8 cols) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={item.name}
                    className={`group/card relative p-4 rounded-2xl border transition-all duration-300 ${
                      item.highlight
                        ? "bg-[#04081c]/90 border-[#2c67ed]/35 hover:border-[#2c67ed] hover:shadow-[0_0_20px_rgba(44,103,237,0.3)] hover:-translate-y-0.5"
                        : "bg-[#04081c]/60 border-white/5 hover:border-[#2c67ed]/30 hover:bg-[#04081c]/90 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white group-hover/card:text-[#6ba0ff] transition-colors flex items-center gap-2">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2c67ed]/20 text-[#60a5fa] border border-[#2c67ed]/30">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

