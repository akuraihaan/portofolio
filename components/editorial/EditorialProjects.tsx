"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  X, 
  Search, 
  Layers, 
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { EASINGS } from "../motion/MotionSystem";

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
    role: "Lead Full-Stack Developer & Researcher",
    summary:
      "Platform pembelajaran interaktif berbasis web untuk materi CSS dasar hingga Tailwind CSS dengan sistem Learning Analytics untuk memantau waktu belajar dan pemahaman sintaks siswa secara real-time.",
    description:
      "Proyek riset skripsi S.Pd. Pendidikan Komputer di Universitas Lambung Mangkurat. Platform ini menyajikan materi tutorial berjenjang, live code editor terisolasi, kuis otomatis, serta dasbor analitik pembelajaran untuk instruktur tanpa membutuhkan build tool lokal.",
    technologies: ["Laravel", "PHP", "Tailwind CSS", "JavaScript", "MySQL", "Learning Analytics", "Express.js"],
    cover_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    thumbnail_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    project_url: null,
    repository_url: "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind",
    case_study: {
      background:
        "Banyak siswa pemula mengalami kesulitan saat berpindah dari CSS murni ke utilitas framework modern seperti Tailwind CSS karena rumitnya konfigurasi awal. Flowwind Learn diciptakan untuk menyediakan tutorial web interaktif instan di browser.",
      features:
        "Live code editor berbasis browser, preview hasil real-time, modul materi interaktif, kuis pemahaman konsep, dan modul perekaman learning analytics.",
      contribution:
        "Merancang arsitektur full-stack dengan Laravel dan MySQL, menyusun konten pedagogis komputasi, serta merancang skema database pelacakan analitik belajar.",
      outcome:
        "Media pembelajaran divalidasi sangat layak oleh validator ahli materi dan media, serta berhasil diujicobakan dalam proses pembelajaran Informatika.",
      process:
        "Mengadopsi model Research and Development (R&D) berbasis tahapan ADDIE yang disesuaikan untuk pengembangan perangkat lunak instruksional.",
    },
  },
  {
    id: "combridge-bisindo",
    number: "02",
    title: "ComBridge BISINDO",
    subtitle: "Layanan Cloud & API Penerjemah Bahasa Isyarat BISINDO Realtime",
    category: "Cloud Computing",
    year: "2024–2025",
    role: "Cloud Computing Engineer",
    summary:
      "Arsitektur cloud microservices serverless di Google Cloud Platform (GCP) untuk menerjemahkan bahasa isyarat BISINDO menjadi teks dan huruf secara realtime pada aplikasi Android.",
    description:
      "Proyek capstone tim lintas disiplin pada program Bangkit Academy 2024 Batch 2 (Google, GoTo, Tokopedia, Traveloka). Bertanggung jawab atas seluruh pipeline backend, kontainerisasi Docker, API Gateway, dan deployment di Google Cloud Run.",
    technologies: ["Google Cloud Platform", "Cloud Run", "Docker", "Express.js", "RESTful API", "Artifact Registry"],
    cover_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
    thumbnail_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
    project_url: null,
    repository_url: "https://github.com/bworiey/combridge-bisindo-cloud",
    case_study: {
      background:
        "Menjembatani kendala komunikasi antara komunitas Tuli pengguna BISINDO dan masyarakat umum melalui aplikasi mobile cerdas berkecepatan tinggi.",
      features:
        "Autentikasi aman JWT, REST API cepat untuk hasil inferensi model ML, manajemen kamus peraga bahasa isyarat daring, dan auto-scaling cloud.",
      contribution:
        "Membangun infrastruktur serverless di GCP Cloud Run, kontainerisasi multi-stage Docker, serta optimasi latensi request response API.",
      outcome:
        "Layanan cloud berhasil lulus evaluasi tim capstone Bangkit Academy dengan stabilitas 99.9% uptime dan latensi API di bawah 80ms.",
      process:
        "Kolaborasi intensif berbasis sprint Agile bersama divisi Machine Learning dan Mobile Development.",
    },
  },
  {
    id: "game-dayak-ngaju",
    number: "03",
    title: "Game Edukasi Kuis Bahasa Dayak Ngaju",
    subtitle: "Media Pembelajaran Interaktif Kuis Bahasa Daerah Berbasis Web",
    category: "Web Development",
    year: "2023",
    role: "Frontend Developer",
    summary:
      "Game kuis edukatif berbasis web browser yang dirancang untuk memperkenalkan dan melestarikan kosakata bahasa Dayak Ngaju secara interaktif dan menyenangkan.",
    description:
      "Aplikasi web edukatif yang menggabungkan elemen gamifikasi, sistem skor adaptif, serta bank soal multibahasa. Membantu generasi muda dan pelajar mengenal kearifan bahasa lokal Kalimantan.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Web Audio API", "LocalStorage"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/game-kuis-dayak-ngaju",
    case_study: {
      background:
        "Pelestarian bahasa daerah Dayak Ngaju memerlukan media pembelajaran digital yang ramah anak, ringan diakses, dan interaktif.",
      features:
        "Level berjenjang, papan skor lokal, umpan balik suara interaktif, dan kamus mini kosakata bahasa daerah.",
      contribution:
        "Mengembangkan seluruh antarmuka web, logika permainan kuis interaktif, serta sistem evaluasi jawaban otomatis.",
      outcome:
        "Aplikasi digunakan sebagai media peraga pembelajaran komputasi berbasis muatan lokal dalam tugas perkuliahan Pemrograman Web.",
      process:
        "Pengumpulan kosakata dari penutur asli dan perancangan wireframe ramah pengguna.",
    },
  },
  {
    id: "game-ikan-lahan-basah",
    number: "04",
    title: "Game Edukasi Mengenal Ikan di Lahan Basah",
    subtitle: "Sistem Edukasi Biodiversitas Ekologi Lahan Basah Berbasis Laravel",
    category: "Web Development",
    year: "2023",
    role: "Full-Stack Developer",
    summary:
      "Aplikasi web interaktif untuk mengenalkan keanekaragaman hayati ikan endemik di lingkungan lahan basah Kalimantan Selatan.",
    description:
      "Dibangun dengan framework Laravel dan MySQL, menyajikan ensiklopedia visual spesies ikan, habitat alami, serta game kuis interaktif untuk siswa sekolah dasar dan menengah.",
    technologies: ["PHP", "Laravel", "MySQL", "Bootstrap", "Blade Templates"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/edugame-ikan-lahan-basah",
    case_study: {
      background:
        "Kekayaan ekosistem lahan basah Kalimantan memerlukan media edukasi digital yang mampu meningkatkan kesadaran konservasi lingkungan sejak dini.",
      features:
        "Katalog visual fauna air, deskripsi taksonomi, modul kuis interaktif, dan dashboard pengelolaan konten bagi pendidik.",
      contribution:
        "Perancangan database relasional, implementasi modul MVC Laravel, dan pembuatan antarmuka responsif ramah anak.",
      outcome:
        "Mendapat apresiasi dalam pameran media pembelajaran mahasiswa Pendidikan Komputer ULM.",
      process:
        "Riset pustaka biodiversitas lahan basah dan pengujian fungsionalitas sistem secara bertahap.",
    },
  },
  {
    id: "konversi-satuan-panjang",
    number: "05",
    title: "Aplikasi Konversi Satuan Panjang",
    subtitle: "Perangkat Lunak Penghitungan Multi-Satuan Matematis Presisi",
    category: "Software Tool",
    year: "2023",
    role: "Software Developer",
    summary:
      "Aplikasi Python untuk melakukan konversi cepat dan akurat antarsatuan panjang metrik dan imperial dengan validasi input komprehensif.",
    description:
      "Program utilitas dengan antarmuka grafis ringan yang memudahkan perhitungan matematis konversi ukuran (meter, kilometer, mil, inch, yard) dengan presisi floating-point tinggi.",
    technologies: ["Python", "Algorithms", "GUI Tooling", "Unit Testing"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/aplikasi-konversi-satuan",
    case_study: {
      background:
        "Kebutuhan alat bantu konversi satuan yang cepat, offline, dan bebas iklan untuk keperluan pembelajaran matematika dan fisika dasar.",
      features:
        "Konversi dua arah instan, riwayat penghitungan, rumus referensi konversi, dan penanganan input tak valid.",
      contribution:
        "Perancangan algoritma perhitungan satuan matematis dan implementasi GUI berbasis Python.",
      outcome:
        "Berhasil diuji dengan 100% test case matematis lulus tanpa deviasi pembulatan signifikan.",
      process:
        "Penyusunan tabel faktor konversi standar internasional dan pengujian berbasis unit test.",
    },
  },
  {
    id: "aplikasi-catatan-android",
    number: "06",
    title: "Aplikasi Pencatatan Berbasis Android",
    subtitle: "Aplikasi Mobile Produktivitas & Manajemen Catatan Harian",
    category: "Mobile Development",
    year: "2024",
    role: "Android Developer",
    summary:
      "Aplikasi native Android untuk pencatatan ide, to-do list, dan manajemen tugas pribadi dengan penyimpanan database lokal SQLite.",
    description:
      "Dirancang dalam mata kuliah Pemrograman Mobile Android. Menampilkan arsitektur clean MVVM, pencarian teks instan, pengelompokan kategori catatan, dan antarmuka material modern.",
    technologies: ["Android SDK", "Kotlin / Java", "SQLite", "Material Design", "Room DB"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/android-smart-notes",
    case_study: {
      background:
        "Pentingnya aplikasi catatan yang ringan, hemat daya baterai, dan tidak bergantung pada koneksi internet untuk produktivitas harian.",
      features:
        "CRUD catatan cepat, filter kategori warna, proteksi privasi, dan fitur ekspor teks catatan.",
      contribution:
        "Perancangan UI XML Material Design, integrasi SQLite database helper, dan pengelolaan siklus hidup aktivitas Android.",
      outcome:
        "Aplikasi berjalan stabil pada berbagai versi OS Android dari Android 10 hingga Android 14.",
      process:
        "Penyusunan user stories, pembuatan mockup wireframe, dan implementasi kode bertahap.",
    },
  },
  {
    id: "web-scraping-kaggle",
    number: "07",
    title: "Web Scraping dan Pengujian Data",
    subtitle: "Automated Data Extraction Pipeline & Model Evaluation",
    category: "Data Science",
    year: "2024",
    role: "Data & Backend Engineer",
    summary:
      "Pipeline ekstraksi data otomatis berbasis web scraping yang dipadukan dengan pengujian dan pembersihan dataset kompetisi Kaggle.",
    description:
      "Proyek analitik data yang mencakup crawling data terstruktur dari situs web publik, pembersihan data (data cleaning), penanganan missing values, serta analisis statistik deskriptif.",
    technologies: ["Python", "BeautifulSoup", "Pandas", "Kaggle API", "NumPy", "Jupyter"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/data-science-scraping-kaggle",
    case_study: {
      background:
        "Kebutuhan dataset berkualitas untuk riset komputasi memerlukan otomasi pengambilan dan validasi data skala besar.",
      features:
        "Scraper multi-page otomatis, penanganan rate-limiting, pipeline normalisasi data CSV/JSON, dan visualisasi distribusi fitur data.",
      contribution:
        "Menulis skrip scraper robust dengan error-handling dan menyusun notebook analisis eksplorasi data (EDA).",
      outcome:
        "Dataset hasil scraping berhasil diintegrasikan dengan benchmark dataset Kaggle untuk evaluasi model akurasi tinggi.",
      process:
        "Analisis struktur DOM target, implementasi parser BeautifulSoup, dan validasi tipe data Pandas.",
    },
  },
];

export function EditorialProjects({
  projects = defaultProjects,
}: {
  projects?: EditorialProjectItem[];
}) {
  const [selectedProject, setSelectedProject] = useState<EditorialProjectItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      className="w-full max-w-5xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          03 / Projects
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      {/* Main Headline */}
      <div className="mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-2xl leading-tight mb-4">
          Featured engineering artifacts.
        </h2>
        <p className="text-base text-[#86868B] max-w-xl leading-relaxed">
          Koleksi proyek rekayasa perangkat lunak, sistem cloud serverless, dan media pembelajaran interaktif berbasis riset nyata.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
                    : "bg-[#F5F5F7] text-[#86868B] dark:bg-[#161617] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <input
            type="text"
            placeholder="Cari proyek atau teknologi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#F5F5F7] dark:bg-[#161617] border border-black/[0.04] dark:border-white/[0.06] text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Apple-Style Projects Showcase Grid */}
      <div className="space-y-12">
        {filteredProjects.map((project, idx) => {
          const isFeatured = idx === 0 || idx === 1;

          return (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer rounded-3xl bg-[#F5F5F7] dark:bg-[#161617] border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-10 transition-all hover:shadow-lg"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Media Presentation Column */}
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#E5E5EA] dark:bg-[#0B0B0C] flex items-center justify-center border border-black/[0.06] dark:border-white/[0.08]">
                    {project.cover_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.cover_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="p-6 text-center">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#86868B] block mb-1">
                          {project.category}
                        </span>
                        <h4 className="font-display font-bold text-lg text-[#1D1D1F] dark:text-[#F5F5F7]">
                          {project.title}
                        </h4>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"} flex flex-col justify-center`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#86868B]">#{project.number}</span>
                    <span className="text-xs text-[#86868B]">·</span>
                    <span className="text-xs font-medium text-[#86868B]">{project.category}</span>
                    <span className="text-xs text-[#86868B]">·</span>
                    <span className="text-xs font-mono text-[#86868B]">{project.year}</span>
                  </div>

                  <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-3 leading-snug group-hover:opacity-80 transition-opacity">
                    {project.title}
                  </h3>

                  {project.subtitle && (
                    <p className="text-xs text-[#86868B] font-mono mb-3 line-clamp-1">
                      {project.subtitle}
                    </p>
                  )}

                  <p className="text-sm text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 leading-relaxed mb-6 font-normal">
                    {project.summary}
                  </p>

                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-white dark:bg-[#0B0B0C] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Case Study</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>

                    {project.repository_url && (
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] flex items-center gap-1 transition-colors"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Deep Case Study Slide-Over Drawer */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.35, ease: EASINGS.apple }}
              className="w-full max-w-2xl h-full bg-[#FFFFFF] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] shadow-2xl p-6 sm:p-10 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-black/[0.06] dark:border-white/[0.08] mb-6">
                  <div>
                    <span className="text-xs font-mono text-[#86868B] uppercase tracking-wider block">
                      Case Study // {selectedProject.category}
                    </span>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1D1D1F] dark:text-[#F5F5F7] mt-1">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Case Study Details */}
                <div className="space-y-6 text-sm text-[#1D1D1F]/90 dark:text-[#F5F5F7]/90 leading-relaxed font-sans">
                  {selectedProject.cover_url && (
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#E5E5EA] dark:bg-[#0B0B0C] border border-black/[0.06] dark:border-white/[0.08] mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProject.cover_url}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5">
                      Ringkasan &amp; Peran
                    </h4>
                    <p>{selectedProject.description}</p>
                    <p className="text-xs text-[#86868B] mt-1">
                      Peran: <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">{selectedProject.role}</strong>
                    </p>
                  </div>

                  {selectedProject.case_study?.background && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5">
                        Latar Belakang Masalah
                      </h4>
                      <p>{selectedProject.case_study.background}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.features && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5">
                        Fitur Utama &amp; Arsitektur
                      </h4>
                      <p>{selectedProject.case_study.features}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.contribution && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5">
                        Kontribusi Rekayasa Pribadi
                      </h4>
                      <p>{selectedProject.case_study.contribution}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.outcome && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-1.5">
                        Hasil &amp; Validasi
                      </h4>
                      <p>{selectedProject.case_study.outcome}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#86868B] mb-2">
                      Teknologi yang Diterapkan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1 rounded-full bg-[#F5F5F7] dark:bg-[#0B0B0C] border border-black/[0.06] dark:border-white/[0.08]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                {selectedProject.repository_url && (
                  <a
                    href={selectedProject.repository_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Lihat di GitHub</span>
                  </a>
                )}
                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-medium border border-black/[0.1] dark:border-white/[0.15]"
                  >
                    <span>Buka Live Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
