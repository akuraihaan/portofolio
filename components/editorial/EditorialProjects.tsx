"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderGit2, 
  ExternalLink, 
  ArrowUpRight, 
  X, 
  CheckCircle2, 
  Sparkles, 
  BookOpen,
  Code2, 
  Calendar, 
  Layers, 
  Search,
  ChevronRight,
  Terminal,
  Cpu
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { HoverPerspective } from "../motion/HoverPerspective";
import { MagneticElement } from "../motion/MagneticElement";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface EditorialProjectItem {
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
  highlights?: string[];
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

export const defaultProjects: EditorialProjectItem[] = [
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
    highlights: [
      "In-browser interactive code editor with live render preview",
      "Algoritma pencatatan analitik belajar siswa",
      "Kurikulum tutorial bertahap dari CSS murni ke Tailwind",
      "Dasbor evaluasi instruktur Informatika",
    ],
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
    highlights: [
      "Arsitektur serverless microservices di Google Cloud Run",
      "Low-latency RESTful API untuk inferensi model ML",
      "Kolaborasi tim lintas divisi (Cloud, ML, Mobile Dev)",
      "Teknologi asistif ramah aksesibilitas",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Keterbatasan akses komunikasi antara teman Tuli dan masyarakat yang tidak memahami BISINDO memerlukan solusi penerjemah portabel yang cepat dan dapat diakses di mana saja.",
      features:
        "Deteksi gerakan tangan berbasis kamera ponsel, klasifikasi karakter isyarat menggunakan computer vision, dan sinkronisasi kamus kata.",
      contribution:
        "Merancang dan menerapkan arsitektur backend di Google Cloud Run, mengonfigurasi bucket Cloud Storage, dan memastikan endpoint API memiliki latensi rendah.",
      outcome:
        "Layanan berhasil lulus evaluasi capstone Bangkit Academy 2024 dengan performa tinggi di bawah pengujian beban pengguna.",
    },
  },
  {
    id: "game-dayak-ngaju",
    number: "03",
    title: "Game Budaya Dayak Ngaju",
    subtitle: "Interactive 2D Cultural Heritage Educational Game",
    category: "Game & Media Edukasi",
    year: "2024",
    role: "Game Developer & Designer",
    summary:
      "Game edukasi interaktif 2D bertema pelestarian warisan budaya suku Dayak Ngaju Kalimantan yang ditujukan bagi generasi muda.",
    description:
      "Media pembelajaran interaktif yang dirancang untuk mengenalkan rumah adat betang, pakaian tradisional, senjata mandau, dan nilai kearifan lokal suku Dayak Ngaju melalui alur gameplay petualangan dan kuis kebudayaan.",
    technologies: ["Construct 3", "JavaScript", "Game Design", "Pixel Art"],
    highlights: [
      "Pelestarian kearifan lokal Kalimantan Tengah",
      "Mekanik gameplay platformer interaktif dengan kuis budaya",
      "Asset visual otentik motif Dayak",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Minimnya media digital interaktif mengenai kebudayaan suku Dayak Ngaju yang dapat menarik minat siswa sekolah dasar dan menengah.",
      features:
        "Eksplorasi wilayah adat, dialog naratif dengan tokoh tetua adat, tantangan memecahkan teka-teki budaya, dan papan skor kuis.",
      contribution:
        "Mengembangkan logika game loop, interaksi objek, integrasi audio latar tradisional, dan pengujian respons pengguna.",
      outcome:
        "Digunakan sebagai peraga pembelajaran seni budaya dan muatan lokal Kalimantan.",
    },
  },
  {
    id: "game-ikan-lahan-basah",
    number: "04",
    title: "Game Ikan Lahan Basah",
    subtitle: "Wetland Biodiversity Interactive Educational Simulation",
    category: "Game & Media Edukasi",
    year: "2024",
    role: "Lead Developer",
    summary:
      "Game simulasi interaktif edukasi keanekaragaman hayati fauna ikan endemik ekosistem lahan basah Kalimantan Selatan.",
    description:
      "Mengintegrasikan keunggulan lokal lahan basah (wetland environment) ke dalam media pembelajaran digital interaktif. Pemain diajak mengenali jenis-jenis ikan lokal seperti gabus, haruan, dan papuyu beserta peran ekologisnya.",
    technologies: ["HTML5 Canvas", "JavaScript", "Construct", "Audio Engineering"],
    highlights: [
      "Integrasi visi keilmuan Lahan Basah ULM",
      "Karakteristik visual spesies ikan lokal",
      "Sistem kuis skor adaptif",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
  },
  {
    id: "konversi-satuan-panjang",
    number: "05",
    title: "Media Konversi Satuan Panjang",
    subtitle: "Web-Based Visual Mathematics Measurement Tool",
    category: "Web Development",
    year: "2023",
    role: "Frontend Developer",
    summary:
      "Aplikasi web alat bantu visual untuk memahami konsep tangga konversi satuan panjang (km hingga mm) secara dinamis.",
    description:
      "Membantu siswa memvisualisasikan aturan perkalian dan pembagian tiap anak tangga konversi ukuran dengan representasi interaktif visual.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive UI"],
    highlights: [
      "Alat visual tangga konversi interaktif",
      "Kalkulasi waktu-nyata tanpa reload halaman",
      "Animasi penjelasan langkah demi langkah",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
  },
  {
    id: "pencatatan-android",
    number: "06",
    title: "Aplikasi Pencatatan Android",
    subtitle: "Offline-First Mobile Note Taking Application",
    category: "Mobile Development",
    year: "2023",
    role: "Android Developer",
    summary:
      "Aplikasi mobile pencatatan aktivitas dan to-do list berbasis Android dengan penyimpanan lokal SQLite.",
    description:
      "Menerapkan konsep arsitektur Android, SQLite database helper, RecyclerView dengan ViewHolder pattern, dan Material Design UI.",
    technologies: ["Java / Kotlin", "Android SDK", "SQLite", "Material Design"],
    highlights: [
      "Offline-first local database persistence",
      "CRUD catatan dengan filter kategori",
      "Desain antarmuka bersih dan ringan",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
  },
];

export function EditorialProjects({
  initialProjects,
}: {
  initialProjects?: EditorialProjectItem[];
}) {
  const projects =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : defaultProjects;

  const [selectedProject, setSelectedProject] = useState<EditorialProjectItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { setCursor, resetCursor } = useMotionContext();

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="projects"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            03 / SELECTED WORKS
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            FEATURED ARTIFACTS
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          {projects.length} PROJECTS CATALOGUED
        </span>
      </div>

      {/* Main Headline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <h2 className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE] mb-4">
            Useful things, built with intent.
          </h2>
          <p className="text-[#777970] dark:text-[#A1A49A] text-base sm:text-lg max-w-2xl leading-relaxed">
            Koleksi proyek nyata yang mencakup rekayasa aplikasi web, arsitektur komputasi awan, media pembelajaran interaktif, dan aplikasi mobile.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16 pb-6 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? "bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] border-transparent shadow-sm"
                    : "bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] text-[#777970] dark:text-[#A1A49A] border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#F4F3EE]/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777970] dark:text-[#A1A49A]" />
          <input
            type="text"
            placeholder="Cari proyek atau teknologi…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-xs font-mono text-[#171816] dark:text-[#F4F3EE] placeholder-[#777970] dark:placeholder-[#A1A49A] focus:outline-none focus:border-[#C8F169]"
          />
        </div>
      </div>

      {/* Full-width Alternating Project Showcase */}
      <div className="space-y-20 sm:space-y-28">
        {filteredProjects.map((project, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: DURATION.slow, ease: EASINGS.editorial }}
              onMouseEnter={() => setCursor({ active: true, text: "CASE STUDY" })}
              onMouseLeave={resetCursor}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#C8F169]/40 shadow-xl transition-all duration-300"
            >
              {/* Media Column (6 cols) */}
              <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                <HoverPerspective maxTilt={5}>
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-inner flex flex-col justify-between p-6">
                    {project.cover_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.cover_url}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="flex items-center justify-between text-xs font-mono text-[#777970] dark:text-[#A1A49A]">
                          <span className="flex items-center gap-1.5 font-bold text-[#171816] dark:text-[#F4F3EE]">
                            <Terminal className="w-3.5 h-3.5 text-[#C8F169]" />
                            <span>{project.category}</span>
                          </span>
                          <span>{project.year}</span>
                        </div>

                        <div className="my-auto text-center py-6">
                          <span className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#F4F3EE] block mb-2">
                            {project.title}
                          </span>
                          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                            {project.role}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[#777970] dark:text-[#A1A49A] pt-3 border-t border-[#171816]/5 dark:border-[#F4F3EE]/5">
                          <span>BWORIEY ARTIFACT // #{project.number}</span>
                          <span className="text-[#171816] dark:text-[#C8F169] font-bold">CLICK TO INSPECT →</span>
                        </div>
                      </>
                    )}

                    {/* Hover Badge Inset */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#171816]/80 dark:bg-[#111310]/80 backdrop-blur-md font-mono text-[10px] font-bold text-[#F4F3EE] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>OPEN STORY</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C8F169]" />
                    </div>
                  </div>
                </HoverPerspective>
              </div>

              {/* Text Information Column (6 cols) */}
              <div className={`lg:col-span-6 flex flex-col justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#777970] dark:text-[#A1A49A]">
                    {project.category} · {project.year}
                  </span>
                  <span className="font-display font-black text-4xl sm:text-6xl text-[#171816]/10 dark:text-[#F4F3EE]/10 select-none">
                    #{project.number}
                  </span>
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl text-[#171816] dark:text-[#F4F3EE] tracking-tight mb-2 group-hover:text-[#171816] dark:group-hover:text-[#C8F169] transition-colors">
                  {project.title}
                </h3>

                {project.subtitle && (
                  <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mb-4 font-semibold">
                    {project.subtitle}
                  </p>
                )}

                <p className="text-sm sm:text-base text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed mb-6 font-normal">
                  {project.summary}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[#E9E8E1] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 font-mono text-xs text-[#171816] dark:text-[#F4F3EE]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Case Study Trigger Link */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#171816] dark:text-[#C8F169] group-hover:translate-x-1 transition-transform">
                    <span>Baca Studi Kasus Lengkap</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full border border-[#171816]/10 dark:border-[#F4F3EE]/15 text-[#777970] dark:text-[#A1A49A] hover:text-[#171816] dark:hover:text-[#F4F3EE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="Buka Repositori GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Case Study Modal Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#111310]/80 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: EASINGS.editorial }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/15 dark:border-[#F4F3EE]/15 shadow-2xl p-6 sm:p-10 z-10 text-[#171816] dark:text-[#F4F3EE]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#E9E8E1] dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                aria-label="Tutup studi kasus"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="pb-6 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-8">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider mb-2">
                  <span>PROJECT ARTIFACT // #{selectedProject.number}</span>
                  <span>·</span>
                  <span>{selectedProject.category}</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-5xl text-[#171816] dark:text-[#F4F3EE] tracking-tight mb-2">
                  {selectedProject.title}
                </h2>

                {selectedProject.subtitle && (
                  <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] font-semibold mb-4">
                    {selectedProject.subtitle}
                  </p>
                )}

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-4 border-t border-[#171816]/5 dark:border-[#F4F3EE]/5">
                  <div>
                    <span className="text-[#777970] dark:text-[#A1A49A] text-[10px] uppercase block">Peran</span>
                    <span className="font-bold">{selectedProject.role}</span>
                  </div>
                  <div>
                    <span className="text-[#777970] dark:text-[#A1A49A] text-[10px] uppercase block">Tahun</span>
                    <span className="font-bold">{selectedProject.year}</span>
                  </div>
                  <div>
                    <span className="text-[#777970] dark:text-[#A1A49A] text-[10px] uppercase block">Status</span>
                    <span className="font-bold text-[#171816] dark:text-[#C8F169]">Verified Production</span>
                  </div>
                  <div>
                    <span className="text-[#777970] dark:text-[#A1A49A] text-[10px] uppercase block">Repositori</span>
                    {selectedProject.repository_url ? (
                      <a
                        href={selectedProject.repository_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#171816] dark:text-[#C8F169] hover:underline flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#777970] dark:text-[#A1A49A]">Arsip Akademik</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Body: Overview & Narrative */}
              <div className="space-y-8 font-sans">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#171816] dark:text-[#F4F3EE] mb-3">
                    Ringkasan Proyek
                  </h3>
                  <p className="text-base text-[#171816]/85 dark:text-[#F4F3EE]/85 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Case Study Details if provided */}
                {selectedProject.case_study && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10">
                    {selectedProject.case_study.background && (
                      <div className="p-5 rounded-2xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777970] dark:text-[#A1A49A] mb-2">
                          Latar Belakang & Masalah
                        </h4>
                        <p className="text-xs sm:text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed">
                          {selectedProject.case_study.background}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.contribution && (
                      <div className="p-5 rounded-2xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777970] dark:text-[#A1A49A] mb-2">
                          Kontribusi Teknis
                        </h4>
                        <p className="text-xs sm:text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed">
                          {selectedProject.case_study.contribution}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.features && (
                      <div className="p-5 rounded-2xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777970] dark:text-[#A1A49A] mb-2">
                          Fitur & Arsitektur
                        </h4>
                        <p className="text-xs sm:text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed">
                          {selectedProject.case_study.features}
                        </p>
                      </div>
                    )}

                    {selectedProject.case_study.outcome && (
                      <div className="p-5 rounded-2xl bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10">
                        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777970] dark:text-[#A1A49A] mb-2">
                          Hasil & Validasi
                        </h4>
                        <p className="text-xs sm:text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed">
                          {selectedProject.case_study.outcome}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tech Stack Listing */}
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777970] dark:text-[#A1A49A] mb-3">
                    Teknologi & Lingkungan Kerja
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-3.5 py-1.5 rounded-full bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-6 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 rounded-full border border-[#171816]/20 dark:border-[#F4F3EE]/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    ← Kembali ke Galeri
                  </button>

                  {selectedProject.repository_url && (
                    <a
                      href={selectedProject.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                      <span>Lihat Kode di GitHub</span>
                      <ArrowUpRight className="w-4 h-4" />
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
