"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS } from "../motion/MotionSystem";

export interface MotorsportProjectItem {
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

export const defaultMotorsportProjects: MotorsportProjectItem[] = [
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
        "Penyusunan arsitektur cloud, pembuatan Dockerfile multi-stage, konfigurasi Google Artifact Registry, dan integrasi dengan tim Mobile & Machine Learning.",
    },
  },
  {
    id: "kuis-dayak-ngaju",
    number: "03",
    title: "Game Edukasi Bahasa Dayak Ngaju",
    subtitle: "Gamifikasi Kuis Budaya & Kosakata Dayak Ngaju",
    category: "Educational Technology",
    year: "2024",
    role: "Lead Game & Web Developer",
    summary:
      "Aplikasi game edukasi interaktif berbasis web untuk pelestarian bahasa dan budaya Dayak Ngaju bagi siswa sekolah dan masyarakat umum.",
    description:
      "Dikembangkan untuk melestarikan bahasa daerah melalui media interaktif. Menampilkan mekanika kuis berjenjang, efek suara, papan skor, dan materi kosakata bergambar yang ramah pengguna.",
    technologies: ["JavaScript ES6", "HTML5 Canvas", "Tailwind CSS", "Web Audio API", "LocalStorage"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/game-kuis-dayak-ngaju",
    case_study: {
      background:
        "Penurunan penutur bahasa daerah di kalangan generasi muda mendorong perlunya inovasi media edukasi digital yang menarik dan mudah diakses.",
      features:
        "Kuis interaktif pilihan ganda, modul glosarium kosakata Dayak Ngaju, sistem skor progresif, dan umpan balik visual instan.",
      contribution:
        "Merancang state management permainan dengan vanilla JavaScript dan Web Audio API untuk performa optimal di semua peramban.",
      outcome:
        "Telah diuji dan mendapatkan respons antusias dari siswa karena antarmuka yang bersih dan mudah dimainkan.",
      process:
        "Riset materi leksikon Dayak Ngaju, perancangan antarmuka pengguna, dan pengembangan logika permainan.",
    },
  },
  {
    id: "edugame-lahan-basah",
    number: "04",
    title: "Edugame Ikan Lahan Basah",
    subtitle: "Media Pembelajaran Ekosistem Perairan Lahan Basah Kalimantan",
    category: "Educational Technology",
    year: "2024",
    role: "Front-End Developer & Content Designer",
    summary:
      "Game edukatif yang memperkenalkan keanekaragaman fauna ikan endemik di kawasan ekosistem lahan basah Kalimantan Selatan.",
    description:
      "Karya dalam program keunggulan lingkungan lahan basah Universitas Lambung Mangkurat. Menggabungkan pengenalan taksonomi ikan lokal, habitat sungai, dan kuis konservasi lingkungan.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "Multimedia Interaktif"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/edugame-ikan-lahan-basah",
    case_study: {
      background:
        "Lingkungan lahan basah merupakan ciri khas Kalimantan Selatan yang kaya akan keanekaragaman hayati yang perlu dikenalkan sejak dini.",
      features:
        "Ensiklopedia interaktif spesies ikan lahan basah, kuis tebak habitat, dan tips pelestarian ekosistem rawa dan sungai.",
      contribution:
        "Perancangan aset visual, tata letak interaktif yang responsif pada layar sentuh, dan pemrograman logika kuis.",
      outcome:
        "Menjadi salah satu proyek percontohan media pembelajaran berbasis muatan lokal lahan basah FKIP ULM.",
      process:
        "Studi literatur keanekaragaman hayati lahan basah dan implementasi web interaktif berbasis standar W3C.",
    },
  },
  {
    id: "aplikasi-konversi-satuan",
    number: "05",
    title: "Aplikasi Konversi Satuan Web",
    subtitle: "Multi-Unit Precision Calculation Tool",
    category: "Web Development",
    year: "2023",
    role: "Frontend Engineer",
    summary:
      "Aplikasi kalkulasi dan konversi satuan multi-dimensi instan (panjang, massa, suhu, waktu, digital storage) dengan antarmuka presisi tinggi.",
    description:
      "Alat bantu perhitungan matematis dan fisika berbasis web yang dibangun dengan standar modular JavaScript. Menghitung rumus konversi secara instan dengan riwayat kalkulasi.",
    technologies: ["JavaScript ES6", "CSS Grid & Flexbox", "Semantic HTML", "Unit Testing"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/aplikasi-konversi-satuan",
    case_study: {
      background:
        "Kebutuhan alat konversi satuan yang bersih tanpa iklan pihak ketiga, cepat diakses, dan memiliki akurasi desimal tinggi.",
      features:
        "Konversi lintas satuan metrik dan imperial, validasi input numerik ketat, dan antarmuka tanpa latensi kalkulasi.",
      contribution:
        "Menulis fungsi matematika konversi bebas floating-point error dan merancang tata letak UI yang ergonomis.",
      outcome:
        "Digunakan oleh mahasiswa dan siswa sebagai alat bantu cepat dalam praktikum fisika dasar dan matematika.",
      process:
        "Pemetaan rumus konversi standar internasional (SI) dan implementasi kode terstruktur.",
    },
  },
  {
    id: "android-smart-notes",
    number: "06",
    title: "Aplikasi Catatan Pintar Android",
    subtitle: "Native Mobile Productivity & Task Management",
    category: "Software Development",
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

interface MotorsportGalleryProps {
  projects?: MotorsportProjectItem[];
}

export function MotorsportGallery({
  projects = defaultMotorsportProjects,
}: MotorsportGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [selectedProject, setSelectedProject] = useState<MotorsportProjectItem | null>(null);
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

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
          viewport: { once: true, margin: "-8%" },
          transition: { duration: 0.7, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="proyek"
      className="w-full bg-[#1A1A1A] text-[#F5F5F0] py-24 md:py-36 px-6 sm:px-8 border-y border-[#333333]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#D1FF00] uppercase">
            03 // PROJECT GALLERY &middot; IMMERSIVE SURFACE
          </span>
          <div className="h-px flex-1 bg-[#333333]" />
          <span className="font-mono text-xs text-[#888888] uppercase tracking-wider">
            KARYA REKAYASA &middot; DATA ASLI
          </span>
        </motion.div>

        {/* Section Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <motion.div {...inView(0.06)} className="max-w-2xl">
            <h2 className="font-hero-display text-4xl sm:text-6xl text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
              Pilihan Proyek &middot; Eksplorasi Rekayasa
            </h2>
            <p className="font-body-editorial text-sm sm:text-base text-[#AAAAAA] leading-relaxed font-light">
              Struktur grid disiplin yang menyajikan seluruh karya web, cloud microservices, dan media pembelajaran interaktif. Klik kartu mana pun untuk membuka studi kasus lengkap.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div {...inView(0.1)} className="w-full lg:w-80">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari teknologi atau nama..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[0.75rem] bg-[#111111] border border-[#333333] text-xs font-mono text-[#F5F5F0] placeholder-[#555555] focus:outline-none focus:border-[#D1FF00] transition-colors"
              />
            </div>
          </motion.div>
        </div>

        {/* Category Filters */}
        <motion.div {...inView(0.12)} className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-[0.75rem] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#D1FF00] text-[#111111] font-bold"
                  : "bg-[#111111] text-[#888888] hover:text-[#F5F5F0] border border-[#333333]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid (Disciplined Grid with Varied Layouts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, idx) => {
            const isFeatured = idx === 0 || idx === 1;
            return (
              <motion.div
                key={project.id}
                {...inView(0.04 * idx)}
                onMouseEnter={() => setCursor({ active: true, text: "LIHAT PROYEK" })}
                onMouseLeave={resetCursor}
                onClick={() => setSelectedProject(project)}
                className={`group relative bg-[#111111] rounded-[1rem] border border-[#333333] hover:border-[#D1FF00]/80 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isFeatured && filteredProjects.length > 2
                    ? "lg:col-span-2 lg:flex-row lg:gap-8"
                    : "col-span-1"
                }`}
              >
                {/* Visual Image / Wireframe Display */}
                <div
                  className={`relative rounded-[0.75rem] overflow-hidden bg-[#1A1A1A] border border-[#333333] mb-5 lg:mb-0 flex items-center justify-center ${
                    isFeatured && filteredProjects.length > 2
                      ? "lg:w-1/2 aspect-[16/10]"
                      : "aspect-[16/10] w-full"
                  }`}
                >
                  {project.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                    />
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full border border-[#D1FF00]/40 mx-auto flex items-center justify-center text-[#D1FF00]">
                        <Layers className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider block">
                        KARYA REKAYASA SISTEM
                      </span>
                    </div>
                  )}

                  {/* Corner Overlay Badge Pairing Name with Year in Action Lime (DESIGN.md Helmet Card Pattern) */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#111111]/90 backdrop-blur-md px-3 py-1 rounded-[0.5rem] border border-[#333333]">
                    <span className="font-mono text-[10px] text-[#F5F5F0] font-medium uppercase">
                      {project.number}
                    </span>
                    <span className="text-[#333333]">&middot;</span>
                    <span className="font-mono text-[10px] text-[#D1FF00] font-bold">
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`flex flex-col justify-between ${
                    isFeatured && filteredProjects.length > 2 ? "lg:w-1/2" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#D1FF00] font-semibold">
                        {project.category}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-[#D1FF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F5F5F0] group-hover:text-[#D1FF00] transition-colors mb-2">
                      {project.title}
                    </h3>

                    <p className="font-body-editorial text-xs sm:text-sm text-[#AAAAAA] line-clamp-3 leading-relaxed mb-4 font-light">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech Stack Pills & Direct Route Link */}
                  <div>
                    <div className="pt-4 border-t border-[#333333]/60 flex flex-wrap gap-1.5 mb-3">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#1A1A1A] text-[#CCCCCC] border border-[#333333]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1A1A1A] text-[#888888] border border-[#333333]">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[11px] pt-1">
                      <span className="text-[#888888] flex items-center gap-1 group-hover:text-[#D1FF00] transition-colors">
                        <span>PRATINJAU KASUS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <Link
                        href={`/projects/${project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#D1FF00] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>HALAMAN DETAIL</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-[#333333] rounded-[1rem] bg-[#111111]">
            <p className="font-mono text-sm text-[#888888]">
              Tidak ada proyek yang sesuai dengan kueri &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}
      </div>

      {/* Case Study Slide-over Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASINGS.editorial }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl h-full bg-[#1A1A1A] border-l-2 border-[#D1FF00]/60 p-6 sm:p-10 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#333333]">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase tracking-wider block mb-1">
                      STUDI KASUS // {selectedProject.category} &middot; {selectedProject.year}
                    </span>
                    <h3 className="font-hero-display font-bold text-2xl sm:text-4xl text-[#F5F5F0]">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full text-[#888888] hover:text-[#F5F5F0] hover:bg-white/10 cursor-pointer"
                    aria-label="Tutup Detail"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Case Study Body */}
                <div className="space-y-6 text-sm text-[#CCCCCC] font-sans leading-relaxed">
                  {selectedProject.cover_url && (
                    <div className="aspect-[16/9] rounded-[1rem] overflow-hidden border border-[#333333] mb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProject.cover_url}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                      Ringkasan &amp; Peran Rekayasa
                    </h4>
                    <p>{selectedProject.description}</p>
                    <p className="font-mono text-xs text-[#888888] mt-2">
                      Peran: <strong className="text-[#F5F5F0]">{selectedProject.role}</strong>
                    </p>
                  </div>

                  {selectedProject.case_study?.background && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                        Latar Belakang Masalah
                      </h4>
                      <p>{selectedProject.case_study.background}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.features && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                        Fitur Utama &amp; Arsitektur
                      </h4>
                      <p>{selectedProject.case_study.features}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.contribution && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                        Kontribusi Rekayasa Pribadi
                      </h4>
                      <p>{selectedProject.case_study.contribution}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.outcome && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                        Hasil &amp; Validasi
                      </h4>
                      <p>{selectedProject.case_study.outcome}</p>
                    </div>
                  )}

                  {selectedProject.case_study?.process && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-1.5">
                        Metodologi &amp; Proses
                      </h4>
                      <p>{selectedProject.case_study.process}</p>
                    </div>
                  )}

                  {/* Tech stack breakdown */}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-[#D1FF00] mb-2">
                      Stack Teknologi
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-[0.5rem] bg-[#111111] border border-[#333333] font-mono text-xs text-[#F5F5F0]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-6 mt-8 border-t border-[#333333] flex flex-wrap gap-4">
                <Link
                  href={`/projects/${selectedProject.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-wider hover:brightness-105"
                >
                  <span>BUKA HALAMAN STUDI KASUS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[0.75rem] bg-[#111111] text-[#F5F5F0] border border-[#333333] hover:border-[#D1FF00] font-sans text-xs font-bold uppercase tracking-wider hover:brightness-105"
                  >
                    <span>LIHAT DEMO LIVE</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedProject.repository_url && (
                  <a
                    href={selectedProject.repository_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[0.75rem] bg-[#111111] text-[#F5F5F0] border border-[#333333] hover:border-[#D1FF00] font-sans text-xs font-bold uppercase tracking-wider"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>SOURCE CODE REPOSITORY</span>
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
