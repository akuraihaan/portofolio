"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { MagneticButton } from "../motion/MagneticButton";
import {
  ExternalLink,
  Search,
  X,
  Layers,
  Calendar,
  User,
  ArrowRight,
  Terminal,
  Cpu,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  description: string;
  technologies: string[];
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

export const defaultProjects: ProjectItem[] = [
  {
    id: "flowwind-learn",
    number: "01",
    title: "Flowwind Learn",
    subtitle: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
    category: "Web Development",
    year: "2026",
    role: "Lead Developer & Researcher",
    summary:
      "Platform pembelajaran interaktif untuk mempelajari Tailwind CSS melalui materi tutorial, praktik kode, live preview di browser, dan sistem learning analytics.",
    description:
      "Dikembangkan sebagai tugas akhir S.Pd. Pendidikan Komputer di Universitas Lambung Mangkurat. Platform ini menyajikan materi CSS dasar hingga Tailwind CSS langsung di browser tanpa build tool lokal. Fitur learning analytics memetakan waktu pengerjaan tugas dan tingkat penguasaan sintaks untuk membantu instruktur.",
    technologies: ["Laravel", "PHP", "Tailwind CSS", "JavaScript", "MySQL", "Learning Analytics"],
    cover_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    project_url: null,
    repository_url: "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind",
    case_study: {
      background:
        "Banyak siswa dan mahasiswa pemula mengalami hambatan mental saat beralih dari CSS biasa ke paradigma utility-first framework seperti Tailwind CSS karena rumitnya konfigurasi build tool. Flowwind Learn diciptakan untuk menyediakan media tutorial berbasis web yang interaktif tanpa instalasi lokal.",
      features:
        "Modul materi bertingkat, live code editor dengan preview iframe terisolasi, kuis pemahaman konsep, dan dasbor analytics pelacakan kemajuan belajar siswa.",
      contribution:
        "Merancang arsitektur sistem full-stack dengan Laravel & MySQL, menyusun konten tutorial instruksional pedagogis, serta mengimplementasikan algoritma perekaman metrik belajar.",
      outcome:
        "Media pembelajaran dinyatakan sangat valid oleh validator ahli materi dan media, serta berhasil diujicobakan dalam pembelajaran Informatika.",
      process:
        "Menggunakan model pengembangan Waterfall yang disesuaikan dengan metodologi Research and Development (R&D) pendidikan komputasi.",
    },
  },
  {
    id: "combridge-bisindo",
    number: "02",
    title: "ComBridge BISINDO",
    subtitle: "BISINDO Sign Language Recognition & Translation Cloud Service",
    category: "Cloud Computing",
    year: "2024–2025",
    role: "Cloud Engineer",
    summary:
      "Aplikasi Android untuk mengenali bahasa isyarat BISINDO dan menerjemahkannya secara realtime. Bertanggung jawab atas infrastruktur cloud dan API backend.",
    description:
      "Proyek capstone tim lintas disiplin pada program Bangkit Academy 2024 Batch 2 (Google, GoTo, Tokopedia, Traveloka). Aplikasi menjembatani komunikasi komunitas Tuli Indonesia dengan masyarakat umum menggunakan machine learning computer vision dan infrastruktur cloud yang skalabel.",
    technologies: ["Google Cloud Platform", "Cloud Run", "RESTful API", "Express.js", "Docker"],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Komunikasi antara tunarungu yang menggunakan Bahasa Isyarat Indonesia (BISINDO) dan masyarakat umum yang belum memahami bahasa isyarat kerap terkendala jurang interpretasi. Diperlukan sistem penerjemah otomatis berbasis cloud yang cepat dan akurat.",
      features:
        "Infrastruktur serverless mikroservis otomatis terukur di Google Cloud Run, pipeline data pelatihan model ML, dan integrasi API respons cepat ke klien mobile Android.",
      contribution:
        "Menyiapkan seluruh arsitektur backend, kontainerisasi Docker, deployment container registry, dan konfigurasi API gateway berstandar industri.",
      outcome:
        "Proyek capstone berhasil dipresentasikan di hadapan mentor industri Bangkit Academy dan lulus dengan nilai kelulusan cohort tinggi.",
      process:
        "Kolaborasi agile Scrum lintas tiga divisi (Cloud Computing, Machine Learning, dan Mobile Development).",
    },
  },
  {
    id: "bworiey-platform",
    number: "03",
    title: "BWORIEY Portfolio Platform",
    subtitle: "Next-Gen Dynamic Portfolio & Headless Content Management System",
    category: "Web Development",
    year: "2026",
    role: "Full-Stack Creator",
    summary:
      "Platform portofolio personal dinamis dengan arsitektur modern Next.js 16, Supabase PostgreSQL, RLS multi-tenant, dan sistem animasi Framer Motion kelas dunia.",
    description:
      "Website yang Anda jelajahi saat ini: dibangun dari awal untuk mencerminkan standar tertinggi dalam rekayasa frontend dan desain produk. Dilengkapi dashboard `/admin` dengan RBAC ketat, audit log, pelacakan analitik mandiri, dan integrasi live Supabase.",
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Framer Motion"],
    cover_url: null,
    project_url: "https://portofolio-bworiey.vercel.app",
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Sebagian besar portfolio developer bersifat statis dan kaku. BWORIEY dirancang sebagai living platform yang dapat dikelola secara instan melalui sistem CMS pribadi tanpa perlu push commit untuk sekadar memperbarui draf karya.",
      features:
        "Dashboard admin terproteksi Supabase Auth + RLS, sistem preview draft, invalidasi cache instan via Server Actions, dan sistem animasi Motion berefisiensi tinggi.",
      contribution:
        "Konseptualisasi desain editorial, implementasi arsitektur database Supabase, pembangunan sistem motion, dan konfigurasi pipeline deployment Vercel.",
      outcome:
        "Platform berkinerja tinggi dengan skor Lighthouse optimal dan waktu muat instan di seluruh rute.",
      process:
        "Continuous integration dengan pengetikan TypeScript 100% ketat dan suite pengujian otomatis (Node test runner + PGLite).",
    },
  },
  {
    id: "sipekan-desa",
    number: "04",
    title: "SIPEKAN — Sistem Informasi Desa",
    subtitle: "Portal Layanan Administrasi Publik dan Pendataan Warga Terpadu",
    category: "Information Systems",
    year: "2024",
    role: "Full-Stack Developer",
    summary:
      "Sistem informasi pelayanan administrasi kependudukan desa untuk mempercepat pengurusan surat pengantar dan transparansi data bantuan warga.",
    description:
      "Platform digital desa yang dirancang untuk memangkas birokrasi manual. Warga dapat mengajukan permohonan surat secara online, sementara aparatur desa dapat memvalidasi dan mencetak berkas dengan tanda tangan elektronik dan kode verifikasi QR.",
    technologies: ["PHP", "Laravel", "MySQL", "Bootstrap", "Chart.js"],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Pelayanan administrasi di tingkat desa kerap terhambat antrean fisik dan pencatatan manual di buku besar yang rawan tercecer.",
      features:
        "Manajemen permohonan surat digital, modul inventaris kependudukan, tracking status dokumen realtime via nomor resi, dan ekspor laporan PDF.",
      contribution:
        "Pengembangan modul CRUD surat, perancangan database relasional warga, dan optimasi query data.",
      outcome:
        "Mempercepat waktu pelayanan warga dari hitungan hari menjadi hitungan menit dengan verifikasi otomatis.",
      process:
        "Observasi langsung alur pelayanan kantor desa dan perancangan prototype berbasis masukan perangkat desa.",
    },
  },
];

interface PixelProjectsProps {
  projects?: ProjectItem[];
}

export function PixelProjects({ projects = defaultProjects }: PixelProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === "all" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [03 // SHOWROOM]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              SELECTED PROJECTS &amp; CASE STUDIES
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
              Digital Artifacts &amp; Systems.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Karya rekayasa sistem nyata dengan arsitektur mendalam, kepatuhan standar industri, dan dampak terukur.
            </p>
          </div>
        </PixelReveal>

        {/* Filter Controls: Search & Category Buttons */}
        <PixelReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#171816]/10 dark:border-white/10">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2 font-pixel text-[8px] sm:text-[9px]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 border transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                      : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
                  }`}
                >
                  [{cat.toUpperCase()}]
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#777970] dark:text-[#A1A49A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek / teknologi..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#1C1F1A] border-2 border-[#171816]/30 dark:border-white/20 font-mono text-xs text-[#171816] dark:text-[#F4F3EE] placeholder:text-[#777970] dark:placeholder:text-[#A1A49A] focus:outline-none focus:border-[#171816] dark:focus:border-[#C8F169]"
              />
            </div>
          </div>
        </PixelReveal>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj, idx) => (
            <PixelReveal key={proj.id} delay={0.15 + (idx % 4) * 0.1}>
              <PixelCard
                variant="default"
                onClick={() => setActiveProject(proj)}
                className="group flex flex-col justify-between h-full"
              >
                <div>
                  {/* Top Header: Number and Category Badge */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#171816]/10 dark:border-white/10">
                    <span className="font-pixel text-[11px] text-[#171816] dark:text-[#C8F169] font-bold">
                      #{proj.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A]">
                        {proj.year}
                      </span>
                      <span className="font-pixel text-[8px] px-2 py-0.5 bg-[#171816]/5 dark:bg-white/5 border border-[#171816]/20 dark:border-white/10 text-[#171816] dark:text-[#F4F3EE]">
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Preview / Voxel Frame */}
                  <div className="relative aspect-video bg-[#E9E8E1] dark:bg-[#111310] border-2 border-[#171816]/20 dark:border-white/10 overflow-hidden mb-4 flex items-center justify-center">
                    {proj.cover_url ? (
                      <img
                        src={proj.cover_url}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Terminal className="w-8 h-8 text-[#C8F169] mb-2" />
                        <span className="font-pixel text-[9px] text-[#171816] dark:text-[#F4F3EE]">
                          {proj.title}
                        </span>
                        <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] mt-1">
                          ARTIFACT_PREVIEW_3D
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display font-black text-2xl text-[#171816] dark:text-[#F4F3EE] group-hover:text-[#171816] dark:group-hover:text-[#C8F169] transition-colors leading-tight mb-2">
                    {proj.title}
                  </h3>
                  {proj.subtitle && (
                    <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mb-3 line-clamp-1">
                      {proj.subtitle}
                    </p>
                  )}

                  {/* Summary */}
                  <p className="text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed font-sans mb-4 line-clamp-3">
                    {proj.summary}
                  </p>

                  {/* Technologies Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 bg-[#171816]/5 dark:bg-white/5 border border-[#171816]/10 dark:border-white/10 text-[#171816] dark:text-[#F4F3EE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="pt-4 border-t border-[#171816]/10 dark:border-white/10 flex items-center justify-between font-pixel text-[8px]">
                  <span className="text-[#171816] dark:text-[#C8F169] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    <span>VIEW CASE STUDY</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>

                  <div className="flex items-center gap-2">
                    {proj.repository_url && (
                      <a
                        href={proj.repository_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 border border-[#171816]/20 dark:border-white/20 hover:bg-[#C8F169] hover:text-[#171816] transition-colors text-inherit"
                        aria-label="Repository link"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.project_url && (
                      <a
                        href={proj.project_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 border border-[#171816]/20 dark:border-white/20 hover:bg-[#C8F169] hover:text-[#171816] transition-colors text-inherit"
                        aria-label="Live link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </PixelCard>
            </PixelReveal>
          ))}
        </div>
      </div>

      {/* Case Study Modal / Drawer */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-3xl w-full my-8 bg-white dark:bg-[#111310] border-2 border-[#171816] dark:border-[#C8F169] p-6 sm:p-10 shadow-pixel-lg dark:shadow-pixel-lime-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 border border-[#171816] dark:border-[#C8F169] bg-[#171816] text-[#F4F3EE] dark:bg-[#C8F169] dark:text-[#171816] hover:opacity-80 transition-opacity"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 pb-4 border-b border-[#171816]/10 dark:border-white/10">
                <span className="font-pixel text-[8px] text-[#C8F169] bg-[#171816] px-2 py-1 inline-block mb-2">
                  CASE STUDY RECORD #{activeProject.number}
                </span>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#F4F3EE]">
                  {activeProject.title}
                </h3>
                {activeProject.subtitle && (
                  <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] mt-1">
                    {activeProject.subtitle}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#777970] dark:text-[#A1A49A] mt-3">
                  <span>Peran: {activeProject.role}</span>
                  <span>·</span>
                  <span>Tahun: {activeProject.year}</span>
                  <span>·</span>
                  <span>Kategori: {activeProject.category}</span>
                </div>
              </div>

              {/* Case Study Content Breakdown */}
              <div className="space-y-6 text-sm text-[#171816]/85 dark:text-[#F4F3EE]/85 font-sans leading-relaxed">
                <div>
                  <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-1.5">
                    // DESKRIPSI &amp; TUJUAN
                  </h4>
                  <p>{activeProject.description || activeProject.summary}</p>
                </div>

                {activeProject.case_study?.background && (
                  <div>
                    <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-1.5">
                      // LATAR BELAKANG MASALAH
                    </h4>
                    <p>{activeProject.case_study.background}</p>
                  </div>
                )}

                {activeProject.case_study?.features && (
                  <div>
                    <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-1.5">
                      // FITUR &amp; ARSITEKTUR UTAMA
                    </h4>
                    <p>{activeProject.case_study.features}</p>
                  </div>
                )}

                {activeProject.case_study?.contribution && (
                  <div>
                    <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-1.5">
                      // KONTRIBUSI TEKNIS
                    </h4>
                    <p>{activeProject.case_study.contribution}</p>
                  </div>
                )}

                {activeProject.case_study?.outcome && (
                  <div>
                    <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-1.5">
                      // HASIL &amp; DAMPAK
                    </h4>
                    <p>{activeProject.case_study.outcome}</p>
                  </div>
                )}

                {/* Tech Stack Matrix */}
                <div className="pt-4 border-t border-[#171816]/10 dark:border-white/10">
                  <h4 className="font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] uppercase mb-2">
                    // TEKNOLOGI YANG DIGUNAKAN
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-[#171816]/5 dark:bg-white/5 border border-[#171816]/20 dark:border-white/20 font-mono text-xs text-[#171816] dark:text-[#F4F3EE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal External Links */}
                <div className="pt-6 flex flex-wrap items-center gap-4">
                  {activeProject.project_url && (
                    <a
                      href={activeProject.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-[#C8F169] text-[#171816] border-2 border-[#171816] font-pixel text-[9px] font-bold shadow-pixel flex items-center gap-2 no-underline"
                    >
                      <span>BUKA LIVE DEMO</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {activeProject.repository_url && (
                    <a
                      href={activeProject.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-[#171816] text-[#F4F3EE] dark:bg-[#1C1F1A] dark:text-[#C8F169] border-2 border-[#171816] dark:border-[#C8F169] font-pixel text-[9px] shadow-pixel flex items-center gap-2 no-underline"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>SOURCE REPOSITORY</span>
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

