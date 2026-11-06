"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  ExternalLink, 
  Search, 
  X, 
  Sparkles, 
  Layers, 
  ArrowUpRight,
  Code2,
  CheckCircle2,
  BookOpen
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

interface SpaceProjectsProps {
  projects?: ProjectItem[];
}

export function SpaceProjects({ projects = [] }: SpaceProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories
  const categories = ["Semua", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = activeCategory === "Semua" || p.category === activeCategory;
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
    <section
      id="projects"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default px-6 md:px-12 border-t border-blue-900/20 relative"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#2c67ed]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Eyebrow & Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#6ba0ff] uppercase mb-3 flex items-center gap-2">
          <FolderGit2 className="w-3.5 h-3.5 text-[#2c67ed]" />
          <span>Selected Works</span>
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
            Featured <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">Projects</span>
          </h3>
          <p className="text-sm md:text-base text-slate-400 max-w-md">
            Koleksi proyek nyata yang saya rancang dan kembangkan, mencakup sistem web interaktif, arsitektur cloud, dan rekayasa multimedia edukasi.
          </p>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#2c67ed] text-white shadow-[0_0_15px_rgba(44,103,237,0.5)]"
                  : "bg-[#060a20]/80 text-slate-400 border border-white/5 hover:border-[#2c67ed]/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari proyek atau teknologi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#060a20]/90 border border-[#2c67ed]/25 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#2c67ed] focus:ring-1 focus:ring-[#2c67ed] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((project, idx) => {
          const coverImage = project.cover_url || project.thumbnail_url;

          return (
            <motion.div
              key={project.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative flex flex-col rounded-3xl bg-[#060a20]/70 border border-[#2c67ed]/20 overflow-hidden hover:border-[#2c67ed]/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(44,103,237,0.2)]"
            >
              {/* Media Container */}
              <div
                onClick={() => setSelectedProject(project)}
                className="relative h-60 sm:h-72 w-full bg-[#04081c] overflow-hidden cursor-pointer"
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#04081c] via-[#060a20] to-[#0a1638] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#2c67ed_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#2c67ed]/20 border border-[#2c67ed]/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(44,103,237,0.4)]">
                      <Code2 className="w-8 h-8 text-[#60a5fa]" />
                    </div>
                    <span className="relative z-10 text-xs font-mono text-blue-200 uppercase tracking-widest">
                      Interactive Project
                    </span>
                  </div>
                )}

                {/* Category chip on media */}
                {project.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#02040a]/80 backdrop-blur-md border border-[#2c67ed]/40 text-xs font-mono text-[#6ba0ff] shadow-md">
                      {project.category}
                    </span>
                  </div>
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a20] via-transparent to-transparent opacity-80" />
              </div>

              {/* Project Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    onClick={() => setSelectedProject(project)}
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3 cursor-pointer hover:text-[#6ba0ff] transition-colors"
                  >
                    {project.title}
                  </h4>

                  <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 mb-6">
                    {project.summary || project.description}
                  </p>

                  {/* Technology Pills */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-blue-200/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6ba0ff] hover:text-white transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Lihat Studi Kasus</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Repository GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c67ed] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-[0_0_15px_rgba(44,103,237,0.4)] transition-all"
                      >
                        <span>Demo Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#060a20] border border-[#2c67ed]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(44,103,237,0.35)] custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed]/40 text-xs font-mono text-[#6ba0ff]">
                  {selectedProject.category || "Proyek"}
                </span>
                <span className="text-xs text-slate-400 font-mono">Studi Kasus Lengkap</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 pr-8">
                {selectedProject.title}
              </h3>

              {/* Cover Image in Modal if present */}
              {(selectedProject.cover_url || selectedProject.thumbnail_url) && (
                <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-[#2c67ed]/20">
                  <img
                    src={selectedProject.cover_url || selectedProject.thumbnail_url || ""}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Case Study Sections */}
              <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                {/* Latar Belakang */}
                {selectedProject.case_study?.background && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c] border border-white/5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#6ba0ff] mb-2 font-bold">
                      01. Latar Belakang Proyek
                    </h5>
                    <p>{selectedProject.case_study.background}</p>
                  </div>
                )}

                {/* Fitur Utama */}
                {selectedProject.case_study?.features && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c] border border-white/5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#6ba0ff] mb-2 font-bold">
                      02. Fitur & Kapabilitas
                    </h5>
                    <p>{selectedProject.case_study.features}</p>
                  </div>
                )}

                {/* Kontribusi */}
                {selectedProject.case_study?.contribution && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c] border border-white/5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#6ba0ff] mb-2 font-bold">
                      03. Peran & Kontribusi
                    </h5>
                    <p>{selectedProject.case_study.contribution}</p>
                  </div>
                )}

                {/* Hasil & Dampak */}
                {selectedProject.case_study?.outcome && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c] border border-white/5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#6ba0ff] mb-2 font-bold">
                      04. Dampak & Hasil Akhir
                    </h5>
                    <p>{selectedProject.case_study.outcome}</p>
                  </div>
                )}

                {/* Overview Description if no case study */}
                {!selectedProject.case_study?.background && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#04081c] border border-white/5">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#6ba0ff] mb-2 font-bold">
                      Deskripsi Proyek
                    </h5>
                    <p>{selectedProject.description || selectedProject.summary}</p>
                  </div>
                )}

                {/* Tech Stack in Modal */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-semibold">
                      Teknologi yang Digunakan
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-[#2c67ed]/15 border border-[#2c67ed]/30 text-xs font-mono text-blue-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
                >
                  Tutup
                </button>

                <div className="flex items-center gap-3">
                  {selectedProject.repository_url && (
                    <a
                      href={selectedProject.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Lihat Kode</span>
                    </a>
                  )}
                  {selectedProject.project_url && (
                    <a
                      href={selectedProject.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2c67ed] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-[0_0_15px_rgba(44,103,237,0.5)] transition-all"
                    >
                      <span>Kunjungi Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

