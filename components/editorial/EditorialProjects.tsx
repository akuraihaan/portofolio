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
  Search
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";

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

const confirmedProjects: EditorialProjectItem[] = [
  {
    id: "flowwind-learn",
    number: "01",
    title: "Flowwind Learn",
    subtitle: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar dengan Model Tutorial",
    category: "Final Year Project / Web Development",
    year: "2026",
    role: "Lead Developer & Researcher",
    summary:
      "Platform pembelajaran interaktif untuk mempelajari Tailwind CSS melalui materi tutorial, praktik kode, live preview, dan fitur learning analytics untuk memantau aktivitas serta perkembangan pembelajaran.",
    description:
      "Dikembangkan sebagai tugas akhir S.Pd. Pendidikan Komputer di Universitas Lambung Mangkurat. Platform ini menyajikan materi CSS dasar hingga framework Tailwind CSS secara langsung di browser tanpa perlu instalasi lingkungan lokal. Fitur learning analytics memetakan interaksi siswa, waktu pengerjaan tugas, dan tingkat penguasaan konsep untuk membantu instruktur/guru.",
    technologies: ["Laravel", "PHP", "Tailwind CSS", "JavaScript", "MySQL"],
    highlights: [
      "Interactive learning experience with tutorial model",
      "In-browser code editor and live preview",
      "Real-time learning progress tracking",
      "Learning analytics dashboard for instructors",
    ],
    cover_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    project_url: null,
    repository_url: "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind",
    case_study: {
      background:
        "Banyak siswa dan mahasiswa pemula mengalami kesulitan saat beralih dari CSS murni ke paradigma utility-first framework seperti Tailwind CSS karena kendala konfigurasi build tool. Flowwind Learn diciptakan untuk menyediakan media tutorial berbasis web yang interaktif.",
      features:
        "Modul materi bertingkat (Basic CSS ke Tailwind CSS), editor kode langsung dengan live render iframe, kuis pemahaman, dan dasbor analytics pelacakan kemajuan belajar.",
      contribution:
        "Merancang arsitektur sistem full-stack dengan Laravel & MySQL, menyusun konten tutorial pedagogis, serta mengimplementasikan algoritma perekaman analitik belajar.",
      outcome:
        "Media pembelajaran dinyatakan valid oleh validator ahli materi dan media, serta berhasil diujicobakan dalam pembelajaran Informatika.",
    },
  },
  {
    id: "combridge-bisindo",
    number: "02",
    title: "ComBridge",
    subtitle: "BISINDO Sign Language Recognition & Translation Service",
    category: "Bangkit Academy Capstone Project",
    year: "2024–2025",
    role: "Cloud Engineer",
    summary:
      "Aplikasi Android untuk mengenali bahasa isyarat BISINDO dan menerjemahkannya menjadi huruf. Kontribusi saya berfokus pada pengembangan layanan cloud dan RESTful API.",
    description:
      "Proyek capstone tim lintas disiplin pada program Bangkit Academy 2024 Batch 2 (Google, GoTo, Tokopedia, Traveloka). Aplikasi menjembatani komunikasi komunitas Tuli Indonesia dengan masyarakat umum menggunakan machine learning computer vision dan infrastruktur cloud yang skalabel.",
    technologies: ["Google Cloud Platform", "Cloud Run", "RESTful API", "Android", "Express.js"],
    highlights: [
      "Cross-discipline team collaboration (Cloud, ML, Mobile)",
      "Serverless deployment on Google Cloud Run",
      "Low-latency RESTful API development",
      "Assistive technology for BISINDO accessibility",
    ],
    cover_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey",
    case_study: {
      background:
        "Komunikasi bahasa isyarat BISINDO memerlukan alat bantu inklusif berbasis smartphone agar interaksi sehari-hari antara teman Tuli dan masyarakat dengar dapat berlangsung tanpa hambatan.",
      features:
        "Deteksi gerakan tangan real-time melalui kamera ponsel, penerjemahan huruf abjad BISINDO, dan sinkronisasi kamus isyarat berbasis cloud.",
      contribution:
        "Bertanggung jawab sebagai Cloud Engineer: merancang endpoint RESTful API, mengelola Google Cloud Storage untuk dataset gambar, dan mendeploy backend service ke Cloud Run.",
      outcome:
        "Berhasil menyelesaikan Capstone Project Bangkit Academy Batch 2 dengan predikat lulus dan evaluasi arsitektur cloud yang handal.",
    },
  },
  {
    id: "game-dayak-ngaju",
    number: "03",
    title: "Game Edukasi Kuis Bahasa Dayak Ngaju",
    subtitle: "Interactive Language Learning Web Game",
    category: "Academic Project",
    year: "2023",
    role: "Web & Game Developer",
    summary:
      "Game kuis berbasis web untuk memperkenalkan kosakata dan bahasa Dayak Ngaju melalui pengalaman belajar interaktif.",
    description:
      "Media pembelajaran gamifikasi untuk melestarikan bahasa daerah Dayak Ngaju bagi generasi muda, memadukan elemen kuis pilihan ganda, umpan balik visual, dan audio lokal.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Audio API"],
    highlights: [
      "Pelestarian bahasa daerah melalui media interaktif",
      "Sistem skor dan evaluasi kuis otomatis",
      "Desain responsif untuk perangkat komputer dan tablet",
    ],
    cover_url: null,
    project_url: null,
    repository_url: null,
    case_study: {
      background:
        "Minat generasi muda terhadap bahasa daerah Kalimantan Tengah kian menurun. Diperlukan media edukasi berbasis game agar proses belajar terasa menyenangkan.",
      features: "Level kuis bertingkat, bank soal kosakata sehari-hari, dan sistem skor instan.",
      contribution: "Mengembangkan logika permainan dengan JavaScript murni dan merancang antarmuka kuis.",
      outcome: "Digunakan sebagai media demonstrasi pada mata kuliah media pembelajaran interaktif.",
    },
  },
  {
    id: "game-ikan-lahan-basah",
    number: "04",
    title: "Game Edukasi Mengenal Ikan di Lahan Basah",
    subtitle: "Wetland Biodiversity Educational Multimedia",
    category: "Academic Project",
    year: "2023",
    role: "Interactive Developer",
    summary:
      "Game edukasi yang memperkenalkan berbagai jenis ikan yang hidup di ekosistem lahan basah Kalimantan.",
    description:
      "Proyek media pembelajaran kontekstual yang mengangkat keanekaragaman hayati perairan lahan basah (seperti ikan gabus, seluang, dan patin) dengan konsep drag-and-drop dan ensiklopedia mini.",
    technologies: ["Construct", "HTML5", "JavaScript"],
    highlights: [
      "Edukasi keanekaragaman hayati lahan basah",
      "Interaksi drag-and-drop ramah anak",
      "Ilustrasi visual fauna lokal",
    ],
    cover_url: null,
    project_url: null,
    repository_url: null,
  },
  {
    id: "konversi-satuan-panjang",
    number: "05",
    title: "Aplikasi Konversi Satuan Panjang",
    subtitle: "Mathematical Metric Conversion Tool",
    category: "Academic Project",
    year: "2023",
    role: "Software Developer",
    summary:
      "Aplikasi Python untuk membantu proses konversi satuan panjang dalam perhitungan matematika.",
    description:
      "Alat bantu perhitungan metrik dari kilometer hingga milimeter dengan validasi input angka dan penghitungan konversi otomatis bertingkat.",
    technologies: ["Python", "CLI / Algorithm"],
    highlights: ["Algoritma konversi metrik presisi", "Validasi kesalahan input pengguna"],
    cover_url: null,
    project_url: null,
    repository_url: null,
  },
  {
    id: "pencatatan-android",
    number: "06",
    title: "Aplikasi Pencatatan Berbasis Android",
    subtitle: "Mobile Daily Notes & Task Registry",
    category: "Academic Project",
    year: "2024",
    role: "Mobile Developer",
    summary:
      "Aplikasi Android sederhana untuk kebutuhan pencatatan harian dan pengelolaan tugas.",
    description:
      "Aplikasi native Android untuk menyimpan, menyunting, dan menghapus catatan personal secara offline menggunakan penyimpanan basis data lokal SQLite.",
    technologies: ["Android Studio", "Java / Kotlin", "SQLite"],
    highlights: ["Operasi CRUD basis data lokal", "Antarmuka Material Design mobile"],
    cover_url: null,
    project_url: null,
    repository_url: null,
  },
];

interface EditorialProjectsProps {
  initialProjects?: EditorialProjectItem[];
}

export function EditorialProjects({ initialProjects }: EditorialProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<EditorialProjectItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const projectsToDisplay = initialProjects && initialProjects.length > 0 ? initialProjects : confirmedProjects;

  const categories = ["All", "Final Year / Web", "Bangkit Capstone", "Academic Project"];

  const filteredProjects = projectsToDisplay.filter((p) => {
    const matchesCat =
      filterCategory === "All" ||
      (filterCategory === "Final Year / Web" && p.category.includes("Final Year")) ||
      (filterCategory === "Bangkit Capstone" && p.category.includes("Bangkit")) ||
      (filterCategory === "Academic Project" && p.category.includes("Academic"));

    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const inTitle = p.title.toLowerCase().includes(q);
    const inSummary = p.summary.toLowerCase().includes(q);
    const inTech = p.technologies.some((t) => t.toLowerCase().includes(q));
    return inTitle || inSummary || inTech;
  });

  return (
    <section
      id="projects"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            03 / SELECTED WORKS
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            PROVEN DELIVERABLES
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          INDEX: {filteredProjects.length} OF {projectsToDisplay.length} ENTRIES
        </span>
      </div>

      {/* Headline & Filter Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.15] mb-3"
          >
            Real projects, tangible utility.
          </motion.h2>
          <p className="text-charcoal/70 dark:text-white/70 text-base max-w-xl leading-relaxed">
            Dari sistem pembelajaran web beranalitik data hingga layanan cloud ramah disabilitas. Seluruh proyek berbasis data dan dokumentasi riil.
          </p>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#eeece4] dark:bg-[#14151b] border border-black/5 dark:border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  filterCategory === cat
                    ? "bg-charcoal dark:bg-lime text-white dark:text-charcoal font-semibold shadow-sm"
                    : "text-charcoal/60 dark:text-white/60 hover:text-charcoal dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-charcoal/40 dark:text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by tech or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-[#eeece4] dark:bg-[#14151b] border border-black/5 dark:border-white/10 text-charcoal dark:text-white text-xs font-mono placeholder:text-charcoal/40 dark:placeholder:text-white/40 focus:outline-none focus:border-charcoal dark:focus:border-lime w-full sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Editorial Layout: Asymmetric Featured Card for #1, then Grid for others */}
      <div className="space-y-8">
        {filteredProjects.map((project, idx) => {
          const isFeaturedHero = idx === 0 && filterCategory === "All" && !searchQuery;

          if (isFeaturedHero) {
            // High-impact Full Width Editorial Card
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime">
                        {project.number} // FEATURED FINAL PROJECT
                      </span>
                      <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
                        {project.year} · {project.role}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-4xl font-bold text-charcoal dark:text-white tracking-tight leading-tight mb-3">
                      {project.title}
                    </h3>
                    <p className="font-mono text-xs text-forest dark:text-lime font-medium mb-4">
                      {project.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-charcoal/70 dark:text-white/70 leading-relaxed mb-6">
                      {project.summary}
                    </p>

                    {/* Highlights bullet points */}
                    {project.highlights && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 text-xs font-mono text-charcoal/80 dark:text-white/80">
                        {project.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest dark:bg-lime"></span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Tech Pills & Actions */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/10 text-xs font-mono text-charcoal/80 dark:text-white/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-black/5 dark:border-white/10">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-charcoal dark:bg-lime text-white dark:text-charcoal text-xs font-mono font-bold hover:opacity-90 transition-opacity"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Detail Studi Kasus</span>
                      </button>

                      {project.repository_url && (
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Repository</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Visual Graphic for Hero Project */}
                <div className="lg:col-span-5 h-full flex flex-col justify-center">
                  <div className="w-full aspect-[4/3] rounded-2xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/10 p-6 flex flex-col justify-between relative overflow-hidden group-hover:border-black/20 dark:group-hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between font-mono text-[11px] text-charcoal/40 dark:text-white/40">
                      <span>MODULE // TUTORIAL MODEL</span>
                      <span>STATUS: VALIDATED</span>
                    </div>

                    <div className="my-auto text-center space-y-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-forest/10 dark:bg-lime/20 border border-forest/20 dark:border-lime/30 flex items-center justify-center mx-auto text-forest dark:text-lime">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <span className="font-display font-bold text-lg text-charcoal dark:text-white block">
                        Interactive Code & Analytics
                      </span>
                      <span className="font-mono text-xs text-charcoal/50 dark:text-white/50 block">
                        Tailwind CSS Compiler + Progress Tracker
                      </span>
                    </div>

                    <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between font-mono text-[10px] text-charcoal/50 dark:text-white/40">
                      <span>Universitas Lambung Mangkurat</span>
                      <span className="text-forest dark:text-lime font-bold">Skripsi 2026</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          return null;
        })}

        {/* 2-Column Grid for Subsequent Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => {
            const isFeaturedHero = idx === 0 && filterCategory === "All" && !searchQuery;
            if (isFeaturedHero) return null; // Already rendered above

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none flex flex-col justify-between hover:border-black/25 dark:hover:border-white/25 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs mb-3">
                    <span className="font-bold text-forest dark:text-lime">
                      {project.number} // {project.category}
                    </span>
                    <span className="text-charcoal/40 dark:text-white/40">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-white tracking-tight mb-1 group-hover:text-forest dark:group-hover:text-lime transition-colors">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="font-mono text-[11px] text-charcoal/60 dark:text-white/60 mb-3">
                      {project.subtitle}
                    </p>
                  )}

                  <div className="text-xs font-mono text-charcoal/50 dark:text-white/40 mb-3">
                    Peran: <span className="font-semibold text-charcoal dark:text-white">{project.role}</span>
                  </div>

                  <p className="text-sm text-charcoal/70 dark:text-white/70 leading-relaxed mb-6">
                    {project.summary}
                  </p>

                  {/* Highlights if any */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="space-y-1 mb-5 text-xs font-mono text-charcoal/80 dark:text-white/80">
                      {project.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-forest dark:text-lime font-bold">›</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-black/5 dark:border-white/10">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/10 text-[11px] font-mono text-charcoal/80 dark:text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-charcoal dark:text-white hover:text-forest dark:hover:text-lime transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Studi Kasus</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      {project.repository_url && (
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-black/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white transition-colors"
                          title="Repository GitHub"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forest dark:bg-lime text-white dark:text-charcoal text-[11px] font-mono font-bold"
                        >
                          <span>Live</span>
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
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#faf8f5] dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] p-6 sm:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/5 dark:bg-white/10 text-charcoal dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="font-mono text-xs text-forest dark:text-lime font-bold mb-2">
                {selectedProject.number} // {selectedProject.category} · {selectedProject.year}
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-white mb-2 pr-10">
                {selectedProject.title}
              </h3>
              {selectedProject.subtitle && (
                <p className="font-mono text-xs text-charcoal/60 dark:text-white/60 mb-6">
                  {selectedProject.subtitle}
                </p>
              )}

              <div className="p-4 rounded-xl bg-white dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 mb-6 font-mono text-xs flex flex-wrap gap-4">
                <div>
                  <span className="text-charcoal/40 dark:text-white/40 block">Peran:</span>
                  <span className="font-bold text-charcoal dark:text-white">{selectedProject.role}</span>
                </div>
                <div>
                  <span className="text-charcoal/40 dark:text-white/40 block">Tahun:</span>
                  <span className="font-bold text-charcoal dark:text-white">{selectedProject.year}</span>
                </div>
              </div>

              {/* Case Study Structured Sections */}
              <div className="space-y-6 text-sm text-charcoal/80 dark:text-white/80 leading-relaxed">
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-forest dark:text-lime mb-2">
                    01 // Ikhtisar & Deskripsi Proyek
                  </h4>
                  <p>{selectedProject.description || selectedProject.summary}</p>
                </div>

                {selectedProject.case_study?.background && (
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-forest dark:text-lime mb-2">
                      02 // Latar Belakang & Masalah
                    </h4>
                    <p>{selectedProject.case_study.background}</p>
                  </div>
                )}

                {selectedProject.case_study?.features && (
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-forest dark:text-lime mb-2">
                      03 // Fitur & Solusi yang Diimplementasikan
                    </h4>
                    <p>{selectedProject.case_study.features}</p>
                  </div>
                )}

                {selectedProject.case_study?.contribution && (
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-forest dark:text-lime mb-2">
                      04 // Peran & Kontribusi Spesifik
                    </h4>
                    <p>{selectedProject.case_study.contribution}</p>
                  </div>
                )}

                {selectedProject.case_study?.outcome && (
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-forest dark:text-lime mb-2">
                      05 // Hasil & Dampak
                    </h4>
                    <p>{selectedProject.case_study.outcome}</p>
                  </div>
                )}

                {/* Tech List */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/50 mb-3">
                    Teknologi yang Digunakan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-md bg-white dark:bg-[#0c0d10] border border-black/5 dark:border-white/10 text-xs font-mono text-charcoal dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-8 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs font-mono font-medium hover:bg-black/5 dark:hover:bg-white/5 text-charcoal dark:text-white transition-colors"
                >
                  Tutup
                </button>

                <div className="flex items-center gap-3">
                  {selectedProject.repository_url && (
                    <a
                      href={selectedProject.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs font-mono font-semibold text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest dark:bg-lime text-white dark:text-charcoal text-xs font-mono font-bold hover:opacity-90 transition-opacity"
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

