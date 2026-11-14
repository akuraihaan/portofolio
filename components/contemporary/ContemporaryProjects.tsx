"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ContemporaryProjectItem {
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

export const defaultContemporaryProjects: ContemporaryProjectItem[] = [
  {
    id: "flowwind-learn",
    number: "01",
    title: "Flowwind Learn",
    subtitle: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
    category: "Web Development",
    year: "2026",
    role: "Lead Full-Stack Developer & Researcher",
    summary:
      "Platform pembelajaran interaktif berbasis web untuk materi dasar hingga Tailwind CSS dengan sistem Learning Analytics untuk memantau waktu belajar dan pemahaman sintaks siswa secara real-time.",
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
        "Mengembangkan antarmuka responsif web, logika permainan kuis interaktif, serta evaluasi otomatis.",
      outcome:
        "Digunakan sebagai media peraga pembelajaran komputasi muatan lokal dalam tugas perkuliahan Pemrograman Web.",
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
      "Dibangun dengan framework Laravel dan MySQL, menyajikan ensiklopedia visual spesies ikan, habitat alami, serta game kuis interaktif untuk siswa sekolah.",
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

interface ContemporaryProjectsProps {
  projects?: ContemporaryProjectItem[];
}

export function ContemporaryProjects({
  projects = defaultContemporaryProjects,
}: ContemporaryProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ContemporaryProjectItem | null>(null);
  const prefersReduced = useReducedMotion();

  const categories = useMemo(() => {
    const rawCats = projects.map((p) => p.category).filter(Boolean);
    return ["Semua", ...Array.from(new Set(rawCats))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === "Semua" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="proyek"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          03 // PROYEK REKAYASA &amp; KARYA
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          PORTOFOLIO PILIHAN
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-12">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Studi kasus rekayasa perangkat lunak dari konsep hingga produksi.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Koleksi proyek perangkat lunak nyata yang dipublikasikan dengan tautan repositori terbuka, kontribusi arsitektur spesifik, dan hasil validasi terukur.
        </p>
      </motion.div>

      {/* Filter and Search Bar */}
      <motion.div
        {...inView(0.1)}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-14 pb-6 border-b border-black/[0.08] dark:border-white/[0.1]"
      >
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] font-bold"
                  : "bg-black/[0.04] text-[#71717A] dark:bg-white/[0.06] hover:text-[#121214] dark:hover:text-[#F4F4F6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari proyek atau teknologi..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#121214] border border-black/[0.12] dark:border-white/[0.15] text-xs font-mono text-[#121214] dark:text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#C8F169]"
          />
        </div>
      </motion.div>

      {/* Project Showcase List (Asymmetric Editorial Cards) */}
      <div className="space-y-12">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-4%" }}
            transition={{ duration: DURATION.medium, delay: idx * 0.08, ease: EASINGS.editorial }}
            className="bg-white dark:bg-[#121214] rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.1] overflow-hidden shadow-sm hover:border-black/20 dark:hover:border-white/25 transition-all group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Details Column (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Category & Index Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#C8F169]">
                        {project.number}
                      </span>
                      <span className="text-black/20 dark:text-white/20">/</span>
                      <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#71717A]">{project.year}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#121214] dark:text-[#F4F4F6] tracking-tight leading-snug mb-3 group-hover:text-[#2563EB] dark:group-hover:text-[#C8F169] transition-colors">
                    {project.title}
                  </h3>

                  {project.subtitle && (
                    <p className="font-sans text-xs sm:text-sm font-medium text-[#71717A] dark:text-[#A1A1AA] mb-4">
                      {project.subtitle}
                    </p>
                  )}

                  {/* Summary */}
                  <p className="font-sans text-sm sm:text-base text-[#121214]/80 dark:text-[#F4F4F6]/80 leading-relaxed font-normal mb-6">
                    {project.summary}
                  </p>

                  {/* Technologies Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-black/[0.04] dark:bg-white/[0.06] text-[#121214] dark:text-[#F4F4F6] border border-black/[0.04] dark:border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] hover:bg-[#2563EB] dark:hover:bg-[#C8F169] dark:hover:text-[#121214] transition-colors cursor-pointer"
                  >
                    <span>Detail Studi Kasus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono text-xs font-medium text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Repositori GitHub</span>
                    </a>
                  )}

                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-mono text-xs font-medium text-[#2563EB] dark:text-[#C8F169] hover:underline"
                    >
                      <span>Demo Langsung</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right Media Preview Column (5 cols) */}
              <div className="lg:col-span-5 bg-[#F0EFEB] dark:bg-[#080809] border-t lg:border-t-0 lg:border-l border-black/[0.08] dark:border-white/[0.1] relative min-h-[260px] sm:min-h-[320px] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                {project.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-xl border border-black/10 dark:border-white/10 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[#71717A]">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-[#71717A] uppercase tracking-wider">
                      Arsitektur Sistem &amp; Kode Sumber
                    </span>
                    <span className="font-mono text-[11px] text-[#71717A]/70">
                      Tersedia di Repositori GitHub
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Study Slide-over Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASINGS.editorial }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-full bg-[#F8F8F6] dark:bg-[#0B0B0C] border-l border-black/[0.1] dark:border-white/[0.15] p-6 sm:p-10 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-black/[0.08] dark:border-white/[0.1]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#2563EB] dark:text-[#C8F169] uppercase tracking-wider block mb-1">
                      STUDI KASUS // {selectedProject.category}
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#121214] dark:text-[#F4F4F6]">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] cursor-pointer"
                    aria-label="Tutup Detail"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Case Study Body */}
                <div className="space-y-6 text-sm text-[#121214]/90 dark:text-[#F4F4F6]/90 font-sans leading-relaxed">
                  {selectedProject.cover_url && (
                    <div className="aspect-[16/9] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProject.cover_url}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-1.5">
                      Ringkasan &amp; Peran Rekayasa
                    </h4>
                    <p>{selectedProject.description}</p>
                    <p className="font-mono text-xs text-[#71717A] mt-2">
                      Peran: <strong className="text-[#121214] dark:text-[#F4F4F6]">{selectedProject.role}</strong>
                    </p>
                  </div>

                  {selectedProject.case_study?.background && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-1.5">
                        Latar Belakang Masalah
                      </h4>
                      <p>{selectedProject.case_study.background}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.features && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-1.5">
                        Fitur Utama &amp; Arsitektur
                      </h4>
                      <p>{selectedProject.case_study.features}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.contribution && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-1.5">
                        Kontribusi Rekayasa Pribadi
                      </h4>
                      <p>{selectedProject.case_study.contribution}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.outcome && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-1.5">
                        Hasil &amp; Dampak Validasi
                      </h4>
                      <p>{selectedProject.case_study.outcome}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#2563EB] dark:text-[#C8F169] mb-2">
                      Teknologi yang Diterapkan
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-8 mt-8 border-t border-black/[0.08] dark:border-white/[0.1] flex flex-wrap items-center gap-3">
                {selectedProject.repository_url && (
                  <a
                    href={selectedProject.repository_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214]"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Buka di GitHub</span>
                  </a>
                )}
                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-mono text-xs font-medium border border-black/15 dark:border-white/20"
                  >
                    <span>Kunjungi Demo Langsung</span>
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
