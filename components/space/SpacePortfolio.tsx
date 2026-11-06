"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  Award, 
  Cpu, 
  ExternalLink, 
  Layers, 
  Calendar, 
  Sparkles, 
  X, 
  Eye, 
  Check, 
  ShieldCheck, 
  ArrowUpRight,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Wrench,
  Search
} from "lucide-react";
import { GithubIcon } from "./SocialIcons";

export interface ProjectItem {
  id: string;
  title: string;
  category?: string;
  summary?: string;
  description?: string;
  technologies?: string[];
  cover_url?: string | null;
  thumbnail_url?: string | null;
  project_url?: string | null;
  repository_url?: string | null;
  case_study?: {
    background?: string;
    features?: string;
    contribution?: string;
    outcome?: string;
    process?: string;
  };
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  credential_url?: string | null;
  certificate_url?: string | null;
  image_url?: string | null;
  description?: string | null;
}

export interface TechSkill {
  name: string;
  category: "Frontend" | "Backend & Cloud" | "Database" | "Mobile" | "Tools";
  level: number; // 0 - 100
  desc: string;
  featured?: boolean;
}

const defaultTechStack: TechSkill[] = [
  // Frontend
  { name: "React.js", category: "Frontend", level: 90, desc: "Modern UI, custom hooks, context, component architecture.", featured: true },
  { name: "Next.js", category: "Frontend", level: 88, desc: "App Router, SSR, Server Components, API routes.", featured: true },
  { name: "Tailwind CSS", category: "Frontend", level: 95, desc: "Responsive design, utility-first styling, custom dark palettes.", featured: true },
  { name: "Framer Motion", category: "Frontend", level: 85, desc: "Interactive transitions, layout animations, gestures.", featured: true },
  { name: "TypeScript", category: "Frontend", level: 84, desc: "Type safety, robust interfaces, clean contracts." },
  { name: "HTML5 & CSS3", category: "Frontend", level: 95, desc: "Semantic markup, modern layout models, accessibility." },
  
  // Backend & Cloud
  { name: "Google Cloud Platform", category: "Backend & Cloud", level: 82, desc: "Cloud Run, Storage, Compute Engine, Bangkit graduate.", featured: true },
  { name: "Laravel (PHP)", category: "Backend & Cloud", level: 86, desc: "MVC, Eloquent ORM, RESTful API, Blade, authentication.", featured: true },
  { name: "Express.js & Node", category: "Backend & Cloud", level: 83, desc: "REST APIs, asynchronous middleware, backend services." },
  { name: "RESTful API", category: "Backend & Cloud", level: 90, desc: "API design, endpoint routing, JSON payloads." },

  // Database
  { name: "MySQL", category: "Database", level: 88, desc: "Relational modeling, indexing, queries & migrations.", featured: true },
  { name: "Supabase & Postgres", category: "Database", level: 82, desc: "Row-Level Security, realtime subscriptions, PostgreSQL." },

  // Mobile
  { name: "Android Development", category: "Mobile", level: 80, desc: "Android Studio, XML layouts, API consumption.", featured: true },

  // Tools
  { name: "Git & GitHub", category: "Tools", level: 90, desc: "Version control, branching, PRs, CI/CD basics.", featured: true },
  { name: "Figma", category: "Tools", level: 85, desc: "UI/UX wireframing, component libraries, prototyping." },
  { name: "VS Code", category: "Tools", level: 95, desc: "Primary development environment, linters, extensions." },
];

interface SpacePortfolioProps {
  projects?: ProjectItem[];
  certificates?: CertificateItem[];
}

export function SpacePortfolio({
  projects = [],
  certificates = [],
}: SpacePortfolioProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "certificates" | "tech">("projects");
  const [projectCategory, setProjectCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Categories extraction
  const categories = ["Semua", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = projectCategory === "Semua" || p.category === projectCategory;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inTitle = p.title.toLowerCase().includes(q);
    const inSummary = (p.summary || "").toLowerCase().includes(q);
    const inCategory = (p.category || "").toLowerCase().includes(q);
    const inTech = (p.technologies || []).some((t) => t.toLowerCase().includes(q));
    return inTitle || inSummary || inCategory || inTech;
  });

  return (
    <section id="portfolio" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#2c67ed]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08102d]/80 border border-[#2c67ed]/30 text-blue-300 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(44,103,237,0.2)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Showcase · Hasil Karya & Kompetensi</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Galeri{" "}
          <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">
            Portfolio
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-slate-300/80 text-sm sm:text-base max-w-2xl mx-auto"
        >
          Pilih tab di bawah untuk melihat koleksi proyek yang telah saya kembangkan, sertifikasi kredensial, dan daftar teknologi yang saya gunakan.
        </motion.p>
      </div>

      {/* Main Tab Switcher with Glow */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 rounded-full bg-[#04081c]/90 border border-[#2c67ed]/35 shadow-[0_0_25px_rgba(44,103,237,0.3)] backdrop-blur-xl">
          {[
            { id: "projects", label: "Projects", icon: FolderGit2, count: projects.length },
            { id: "certificates", label: "Certificates", icon: Award, count: certificates.length },
            { id: "tech", label: "Tech Stack", icon: Cpu, count: defaultTechStack.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none ${
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="portfolioActiveTab"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2c67ed] to-[#1e40af] shadow-[0_0_20px_rgba(44,103,237,0.7)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* ======================= TAB 1: PROJECTS ======================= */}
        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Search Bar & Category Filter Pills */}
            <div className="flex flex-col items-center gap-4 mb-8">
              {/* Search input */}
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari proyek (judul, teknologi, kategori)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-white text-xs sm:text-sm focus:outline-none focus:border-[#2c67ed] focus:ring-2 focus:ring-[#2c67ed]/30 shadow-[0_0_15px_rgba(0,0,0,0.5)] placeholder:text-slate-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              {categories.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectCategory(cat as string)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        projectCategory === cat
                          ? "bg-[#2c67ed]/25 text-[#60a5fa] border border-[#2c67ed] shadow-[0_0_12px_rgba(44,103,237,0.4)]"
                          : "bg-white/5 text-slate-400 border border-white/5 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Empty Search State */}
            {filteredProjects.length === 0 && (
              <div className="py-16 text-center rounded-2xl bg-[#060a20]/60 border border-[#2c67ed]/20 p-8 max-w-md mx-auto">
                <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  Tidak ada proyek yang sesuai
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Coba ubah kata kunci pencarian atau pilih kategori yang berbeda.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setProjectCategory("Semua");
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#2c67ed] text-white text-xs font-semibold shadow-[0_0_12px_rgba(44,103,237,0.5)]"
                >
                  Reset Filter & Pencarian
                </button>
              </div>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.1)] hover:border-[#2c67ed]/60 hover:shadow-[0_0_30px_rgba(44,103,237,0.3)] transition-all flex flex-col justify-between"
                >
                  {/* Card Visual Header */}
                  <div>
                    <div className="relative w-full h-44 rounded-xl bg-gradient-to-br from-[#0c163d] via-[#080e29] to-[#040716] border border-[#2c67ed]/20 overflow-hidden mb-4 flex items-center justify-center">
                      {/* Ambient Grid in project preview */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2c67ed_1px,transparent_1px)] [background-size:16px_16px]" />
                      
                      {/* Project Icon Abstract Art */}
                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed]/50 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(44,103,237,0.5)] group-hover:scale-110 transition-transform">
                          <Code2 className="w-6 h-6 text-[#60a5fa]" />
                        </div>
                        <span className="text-xs font-mono text-blue-300/70 uppercase tracking-wider">
                          {project.category || "Proyek"}
                        </span>
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-[#04081c]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="px-4 py-2 rounded-full bg-[#2c67ed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(44,103,237,0.6)] hover:bg-[#3b75f5] flex items-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail Studi Kasus</span>
                        </button>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2c67ed]/15 border border-[#2c67ed]/30 text-blue-300 text-[11px] font-mono">
                        {project.category || "Aplikasi"}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        #0{idx + 1}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-slate-300/80 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                      {project.summary || project.description}
                    </p>
                  </div>

                  {/* Technologies Pills & Footer */}
                  <div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 text-[10px]">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-xs text-[#6ba0ff] hover:text-white font-medium flex items-center gap-1 group/btn"
                      >
                        <span>Lihat Studi Kasus</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>

                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Buka Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ======================= TAB 2: CERTIFICATES ======================= */}
        {activeTab === "certificates" && (
          <motion.div
            key="certificates"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((cert, idx) => {
              const imageSrc = cert.certificate_url || cert.image_url;
              return (
                <motion.div
                  key={cert.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.1)] hover:border-[#2c67ed]/60 hover:shadow-[0_0_30px_rgba(44,103,237,0.3)] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Certificate Preview Box */}
                    <div 
                      onClick={() => setSelectedCert(cert)}
                      className="relative w-full h-44 rounded-xl bg-gradient-to-br from-[#0c163d] via-[#091136] to-[#04081c] border border-[#2c67ed]/20 overflow-hidden mb-4 flex items-center justify-center cursor-pointer group/thumb"
                    >
                      {imageSrc ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={imageSrc}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <Award className="w-12 h-12 text-[#2c67ed] mb-2 drop-shadow-[0_0_12px_rgba(44,103,237,0.7)]" />
                          <span className="text-xs text-blue-200/70 font-mono">
                            Verifikasi Kredensial
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#04081c]/70 backdrop-blur-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-full bg-[#2c67ed] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(44,103,237,0.6)]">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Perbesar Sertifikat</span>
                        </span>
                      </div>
                    </div>

                    {/* Issuer & Date */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono">
                        {cert.issuer || "Kredensial"}
                      </span>
                      {cert.issue_date && (
                        <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{cert.issue_date}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                      {cert.title}
                    </h3>

                    {cert.description && (
                      <p className="text-slate-300/80 text-xs line-clamp-2 mb-3">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs text-[#6ba0ff] hover:text-white font-medium flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Lihat Dokumen</span>
                    </button>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <span>Validasi</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ======================= TAB 3: TECH STACK ======================= */}
        {activeTab === "tech" && (
          <motion.div
            key="tech"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            {/* Grouped by Categories */}
            {(["Frontend", "Backend & Cloud", "Database", "Mobile", "Tools"] as const).map((catGroup) => {
              const skillsInGroup = defaultTechStack.filter((s) => s.category === catGroup);
              const GroupIcon = {
                Frontend: Code2,
                "Backend & Cloud": Cloud,
                Database: Database,
                Mobile: Smartphone,
                Tools: Wrench,
              }[catGroup];

              return (
                <div key={catGroup} className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-blue-900/30">
                    <div className="p-1.5 rounded-lg bg-[#2c67ed]/20 text-[#60a5fa] border border-[#2c67ed]/30">
                      <GroupIcon className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {catGroup}
                    </h3>
                    <span className="text-xs font-mono text-slate-500">
                      ({skillsInGroup.length} teknologi)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skillsInGroup.map((skill, sIdx) => (
                      <motion.div
                        key={skill.name}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="p-4 rounded-xl bg-[#060a20]/80 border border-[#2c67ed]/20 backdrop-blur-md shadow-[0_0_15px_rgba(44,103,237,0.1)] hover:border-[#2c67ed]/50 hover:shadow-[0_0_20px_rgba(44,103,237,0.25)] transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2c67ed]" />
                            {skill.name}
                          </h4>
                          <span className="text-xs font-mono text-blue-300 font-semibold">
                            {skill.level}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden mb-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: sIdx * 0.05 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#2c67ed] to-cyan-400 shadow-[0_0_8px_#2c67ed]"
                          />
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {skill.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================= PROJECT CASE STUDY MODAL ======================= */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#060b24] border border-[#2c67ed]/50 p-6 sm:p-8 shadow-[0_0_50px_rgba(44,103,237,0.45)] z-10 custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed]/40 text-blue-300 text-xs font-mono">
                    {selectedProject.category || "Studi Kasus"}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                    {selectedProject.title}
                  </h3>
                </div>

                {/* Tech Pills */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-blue-200 text-xs font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Summary / Description */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm sm:text-base text-slate-200 leading-relaxed">
                  {selectedProject.description || selectedProject.summary}
                </div>

                {/* Case Study Details */}
                {selectedProject.case_study && (
                  <div className="space-y-4">
                    {selectedProject.case_study.background && (
                      <div>
                        <h4 className="text-sm font-bold text-[#60a5fa] uppercase tracking-wider mb-1">
                          Latar Belakang
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {selectedProject.case_study.background}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.features && (
                      <div>
                        <h4 className="text-sm font-bold text-[#60a5fa] uppercase tracking-wider mb-1">
                          Fitur Utama
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {selectedProject.case_study.features}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.contribution && (
                      <div>
                        <h4 className="text-sm font-bold text-[#60a5fa] uppercase tracking-wider mb-1">
                          Peran & Kontribusi
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {selectedProject.case_study.contribution}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.outcome && (
                      <div>
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-1">
                          Hasil & Validasi
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {selectedProject.case_study.outcome}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Modal Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-end">
                  {selectedProject.project_url && (
                    <a
                      href={selectedProject.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-[#2c67ed] text-white text-xs sm:text-sm font-semibold shadow-[0_0_15px_rgba(44,103,237,0.5)] hover:bg-[#3974f8] flex items-center gap-2"
                    >
                      <span>Kunjungi Proyek</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {selectedProject.repository_url && (
                    <a
                      href={selectedProject.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================= CERTIFICATE LIGHTBOX MODAL ======================= */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[#060b24] border border-[#2c67ed]/50 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(44,103,237,0.5)] z-10 flex flex-col"
            >
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs text-blue-300/80 font-mono">
                    {selectedCert.issuer} {selectedCert.issue_date && `· ${selectedCert.issue_date}`}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex items-center justify-center bg-[#02040a]">
                {selectedCert.certificate_url || selectedCert.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedCert.certificate_url || selectedCert.image_url || ""}
                    alt={selectedCert.title}
                    className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
                  />
                ) : (
                  <div className="py-20 text-center">
                    <Award className="w-16 h-16 text-[#2c67ed] mx-auto mb-3" />
                    <p className="text-slate-300 text-sm">Dokumen kredensial tersimpan dalam arsip.</p>
                  </div>
                )}
              </div>

              {selectedCert.credential_url && (
                <div className="p-4 border-t border-white/10 flex justify-end">
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-[#2c67ed] text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(44,103,237,0.5)]"
                  >
                    <span>Buka URL Verifikasi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
