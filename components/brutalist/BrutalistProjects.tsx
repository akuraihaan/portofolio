"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  FolderGit2,
  Search,
  Sparkles,
  X,
  Layers,
  CheckCircle2,
  Calendar,
  User,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { CardTilt3D } from "../motion/CardTilt3D";
import { BrutalistMagnetic } from "../motion/BrutalistMagnetic";
import { TextScramble } from "../motion/TextScramble";
import { useMotionContext } from "../motion/MotionProvider";

export interface BrutalistProjectItem {
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
  cover_url: string | null;
  thumbnail_url: string | null;
  project_url: string | null;
  repository_url: string | null;
  is_featured?: boolean;
  case_study?: {
    background?: string;
    features?: string;
    contribution?: string;
    outcome?: string;
    process?: string;
  };
}

export const defaultBrutalistProjects: BrutalistProjectItem[] = [
  {
    id: "proj-1",
    number: "01",
    title: "Utilwind — Tailwind CSS Learning Media",
    subtitle: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
    category: "Teknologi Pendidikan",
    year: "2024",
    role: "Lead Software Engineer & Educational Researcher",
    summary:
      "Media pembelajaran berbasis web yang memadukan materi komprehensif Tailwind CSS, editor interaktif, kuis terstruktur, dan pelacakan Learning Analytics untuk mengukur keterlibatan kognitif mahasiswa.",
    description:
      "Dikembangkan sebagai riset skripsi di Universitas Lambung Mangkurat. Platform ini mengintegrasikan live code runner, tutorial bertahap, dan visualisasi pemahaman CSS secara real-time.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Chart.js", "PostgreSQL"],
    cover_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    thumbnail_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
    project_url: "https://flowwind-learn.vercel.app/",
    repository_url: "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind",
    is_featured: true,
    case_study: {
      background:
        "Mahasiswa pendidikan komputer sering menghadapi kendala dalam memahami konsep utility-first CSS tanpa feedback visual langsung.",
      features:
        "Live interactive code editor, modul sintaks utility Tailwind CSS, pelacak durasi belajar, dashboard analitika kognitif dosen.",
      contribution:
        "Merancang arsitektur full-stack, membuat algoritma pengumpul telemetri analitika pembelajaran, dan mengimplementasikan seluruh antarmuka interaktif.",
      outcome:
        "Meningkatkan retensi pemahaman materi sintaks utility sebesar 34% pada uji coba empiris serta sukses dipertahankan dalam sidang skripsi 2026.",
      process:
        "Riset diawali analisis kebutuhan kurikulum, perancangan prototipe interaktif di Figma, implementasi Next.js & Supabase, pengujian kegunaan SUS.",
    },
  },
  {
    id: "proj-2",
    number: "02",
    title: "Combridge BISINDO — Cloud Sign Translator",
    subtitle: "Sistem Penerjemah Bahasa Isyarat Indonesia (BISINDO) Berbasis Deep Learning & Google Cloud",
    category: "Cloud & Machine Learning",
    year: "2024",
    role: "Cloud Computing Lead & Backend Engineer",
    summary:
      "Aplikasi penerjemah BISINDO berbasis Computer Vision dan Machine Learning yang menjembatani komunikasi antara penyandang tunarungu dan masyarakat luas secara real-time.",
    description:
      "Proyek Capstone Bangkit Academy 2024 (Google, GoTo, Traveloka). Mengintegrasikan pipeline klasifikasi citra tangan dengan backend serverless di Google Cloud Platform.",
    technologies: ["Google Cloud Platform", "Cloud Run", "Python", "TensorFlow", "FastAPI", "Docker", "Node.js"],
    cover_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
    thumbnail_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
    project_url: null,
    repository_url: "https://github.com/bworiey/combridge-bisindo-cloud",
    is_featured: true,
    case_study: {
      background:
        "Minimnya aksesibilitas digital bagi komunitas Teman Tuli di ruang publik Indonesia yang memerlukan jembatan komunikasi isyarat visual seketika.",
      features:
        "Model klasifikasi pose tangan 26 huruf alfabet BISINDO, REST API latency rendah, deployment kontainer serverless di GCP Cloud Run.",
      contribution:
        "Memimpin arsitektur komputasi awan, merancang RESTful API menggunakan FastAPI, melakukan kontainerisasi Docker, dan mengonfigurasi autoscaling GCP.",
      outcome:
        "Mencapai latensi inferensi di bawah 200ms pada beban konkurensi tinggi serta mengantarkan tim meraih predikat tim terbaik Bangkit Academy 2024.",
      process:
        "Dataset dikurasi mandiri, dilatih menggunakan Transfer Learning MobileNet, dibungkus API mikroserver, dan di-deploy dengan continuous delivery.",
    },
  },
  {
    id: "proj-3",
    number: "03",
    title: "Game Edukasi Bahasa Dayak Ngaju",
    subtitle: "Media Pembelajaran Interaktif Preservasi Bahasa Daerah Kalimantan Tengah",
    category: "Teknologi Pendidikan",
    year: "2023",
    role: "Game & Creative Developer",
    summary:
      "Game edukasi interaktif berbasis kuis audio visual untuk melestarikan dan mengajarkan kosakata Bahasa Dayak Ngaju kepada generasi muda secara menyenangkan.",
    description:
      "Menggabungkan mekanisme gamifikasi, efek suara otentik, dan sistem skor dinamis untuk memotivasi anak-anak dalam mengenal bahasa daerah Kalimantan.",
    technologies: ["JavaScript", "HTML5 Canvas", "Tailwind CSS", "Web Audio API"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/game-kuis-dayak-ngaju",
    case_study: {
      background: "Penyusutan jumlah penutur aktif bahasa daerah pada kalangan generasi muda di Kalimantan Tengah.",
      features: "Level bertingkat, mini-game mencocokkan kata, pelafalan audio kosakata asli, leaderboard lokal.",
      contribution: "Mengembangkan seluruh game logic, aset audio-visual, dan sistem state interaktif.",
      outcome: "Digunakan dalam kegiatan literasi budaya dan mendapatkan tanggapan positif dari guru bahasa daerah.",
    },
  },
  {
    id: "proj-4",
    number: "04",
    title: "Game Edukasi Ikan Lahan Basah",
    subtitle: "Edugame Pengenalan Biodiversitas Fauna Perairan Rawa Kalimantan",
    category: "Teknologi Pendidikan",
    year: "2023",
    role: "Interactive Developer & Asset Designer",
    summary:
      "Game edukasi interaktif untuk mengenalkan keanekaragaman spesies ikan lokal ekosistem lahan basah Kalimantan Selatan kepada siswa sekolah dasar.",
    description:
      "Dilengkapi ensiklopedia digital mini, kuis tebak bentuk sirip dan morfologi, serta tantangan pelestarian habitat perairan rawa gambut.",
    technologies: ["JavaScript", "CSS3 Animations", "HTML5", "Responsive Web"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/edugame-ikan-lahan-basah",
    case_study: {
      background: "Kurangnya media ajar kontekstual mengenai ekologi lahan basah lokal Kalimantan bagi siswa SD.",
      features: "Ensiklopedia ikan rawa (Gabus, Betok, Sepat), animasi renang dinamis, kuis habitat.",
      contribution: "Merancang logika interaksi permainan dan ilustrasi spesies ikan air tawar.",
      outcome: "Membantu guru IPA mengenalkan materi biodiversitas lokal dengan tingkat interaksi tinggi.",
    },
  },
  {
    id: "proj-5",
    number: "05",
    title: "Aplikasi Konversi Satuan Interaktif",
    subtitle: "Peralatan Web Utilitas Perhitungan Matematika & Fisika Cepat",
    category: "Aplikasi Web",
    year: "2023",
    role: "Frontend Developer",
    summary:
      "Aplikasi web praktis untuk konversi multi-satuan metrik dan imperial (panjang, massa, suhu, tekanan, data digital) dengan kalkulator real-time.",
    description:
      "Didesain dengan antarmuka yang sangat responsif, mendukung riwayat perhitungan instan dan penyalinan hasil rumus satu klik.",
    technologies: ["JavaScript", "HTML5", "Tailwind CSS", "Local Storage API"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/aplikasi-konversi-satuan",
    case_study: {
      background: "Kebutuhan alat bantu konversi kalkulasi sains bagi mahasiswa teknik dan pengajar fisika.",
      features: "Konversi instan antar 8 jenis dimensi fisik, swap satuan cepat, riwayat riwayat sesi.",
      contribution: "Membangun kalkulator algoritma presisi dan tampilan antarmuka interaktif.",
      outcome: "Digunakan oleh mahasiswa angkatan sebagai utilitas komputasi harian.",
    },
  },
  {
    id: "proj-6",
    number: "06",
    title: "Aplikasi Android Smart Notes & Task",
    subtitle: "Aplikasi Mobile Pencatatan Produktivitas & Manajemen Tugas Mahasiswa",
    category: "Aplikasi Mobile",
    year: "2023",
    role: "Android Developer",
    summary:
      "Aplikasi Android native yang dirancang untuk membantu mahasiswa mengorganisir catatan perkuliahan, jadwal tenggat waktu tugas, dan pengingat harian.",
    description:
      "Mengadopsi pola arsitektur MVVM, penyimpanan lokal SQLite/Room, dan antarmuka Material Design modern yang nyaman di mata.",
    technologies: ["Android SDK", "Kotlin / Java", "Room Database", "Material 3"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/android-smart-notes",
    case_study: {
      background: "Manajemen tenggat tugas kuliah yang tercecer membutuhkan catatan dengan prioritas jelas.",
      features: "Kategorisasi catatan berdasarkan mata kuliah, alarm deadline, penandaan prioritas warna.",
      contribution: "Mendesain skema database Room, UI layout XML, dan adapter RecyclerView.",
      outcome: "Mendapat nilai A dalam mata kuliah Rekayasa Aplikasi Perangkat Bergerak.",
    },
  },
  {
    id: "proj-7",
    number: "07",
    title: "Web Scraping & Data Science Kaggle",
    subtitle: "Pipeline Ekstraksi Data Publik & Analisis Komputasional Sains Data",
    category: "Data Science & Scraping",
    year: "2024",
    role: "Data & Python Engineer",
    summary:
      "Pipeline pengumpulan data otomatis dari situs e-commerce dan web publik untuk kebutuhan analisis tren harga dan klasterisasi data menggunakan Python.",
    description:
      "Menggunakan BeautifulSoup dan Selenium untuk ekstraksi terstruktur, pembersihan data dengan Pandas, serta visualisasi korelasi statistik menggunakan Seaborn.",
    technologies: ["Python", "Pandas", "BeautifulSoup", "Selenium", "Jupyter Notebook", "Kaggle"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/data-science-scraping-kaggle",
    case_study: {
      background: "Kebutuhan dataset komparasi tren harga produk di pasar digital Indonesia.",
      features: "Crawler anti-bot throttling, parser JSON-LD/HTML, pembersih missing value, notebook eksplorasi.",
      contribution: "Menulis scraper modular berkecepatan tinggi dan notebook analisis statistik.",
      outcome: "Menghasilkan dataset bersih siap pakai yang dipublikasikan di portofolio Kaggle.",
    },
  },
  {
    id: "proj-8",
    number: "08",
    title: "WebGIS Pemetaan Sekolah Banjarmasin",
    subtitle: "Sistem Informasi Geografis Pemetaan Fasilitas Pendidikan Berbasis Peta Digital",
    category: "Aplikasi Web",
    year: "2024",
    role: "Full-Stack WebGIS Developer",
    summary:
      "Aplikasi peta interaktif untuk memetakan sebaran lokasi sekolah dan zonasi sarana pendidikan di wilayah Kota Banjarmasin dan sekitarnya.",
    description:
      "Menyajikan visualisasi geospasial interaktif dengan filtering radius zonasi, informasi akreditasi sekolah, data sarana prasarana, dan rute navigasi terdekat.",
    technologies: ["Leaflet.js", "GeoJSON", "JavaScript", "Next.js", "OpenStreetMap API"],
    cover_url: null,
    thumbnail_url: null,
    project_url: null,
    repository_url: "https://github.com/bworiey/webgis-pemetaan-sekolah-banjarmasin",
    case_study: {
      background: "Masyarakat membutuhkan visualisasi spasial jelas terkait zonasi PPDB sekolah di Banjarmasin.",
      features: "Peta interaktif Leaflet, marker clustering, filter akreditasi, kalkulator jarak euclidian.",
      contribution: "Mengonversi data koordinat sekolah ke GeoJSON dan merancang UI dashboard peta.",
      outcome: "Memudahkan pencarian sekolah terdekat berdasarkan titik koordinat pengguna secara akurat.",
    },
  },
];

interface BrutalistProjectsProps {
  projects?: BrutalistProjectItem[];
}

export function BrutalistProjects({ projects = defaultBrutalistProjects }: BrutalistProjectsProps) {
  const { setCursor, resetCursor } = useMotionContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [activeModalProject, setActiveModalProject] = useState<BrutalistProjectItem | null>(null);

  // Close modal on Escape key press and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveModalProject(null);
    };

    if (activeModalProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeModalProject]);

  // Derive categories
  const categories = useMemo(() => {
    const set = new Set<string>(["Semua"]);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Filter projects by category and query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === "Semua" || p.category === selectedCategory;
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section
      id="projects"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#FF5C00]">
                03 // ARCHIVE
              </span>
              <span className="font-mono text-xs font-bold text-[#FF5C00] uppercase">
                {projects.length} KARYA DIGITAL TERVERIFIKASI
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              PROJECT ARCHIVE
            </h2>
          </div>

          <p className="font-sans text-base md:text-lg max-w-md text-neutral-700 dark:text-neutral-300">
            Koleksi proyek rekayasa perangkat lunak, teknologi pendidikan, komputasi awan, dan media interaktif berstandar industri.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b-3 border-black dark:border-white">
          {/* Category Tabs with Dynamic Animated Spring Pill */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative font-mono text-xs font-black px-4 py-2 border-2 border-black dark:border-white transition-colors cursor-pointer select-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className="absolute inset-0 bg-[#FFE500] border-2 border-black shadow-[3px_3px_0px_#000] -z-10"
                    />
                  )}
                  <span className={isActive ? "text-black" : "text-black dark:text-white"}>
                    {cat}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Real-time Search Box */}
          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Cari proyek atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1A1A] text-black dark:text-white border-2 border-black dark:border-white font-mono text-xs font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FFE500] shadow-[2px_2px_0px_#000]"
            />
          </div>
        </div>

        {/* Varied Editorial Grid for Projects with PopLayout Physics */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => {
              // Asymmetric layout rules:
              // First 2 items get larger spans
              const isHeroCard = idx === 0;
              const isWideCard = idx === 1;
              const colSpan = isHeroCard
                ? "md:col-span-12 lg:col-span-12"
                : isWideCard
                ? "md:col-span-12 lg:col-span-7"
                : idx === 2
                ? "md:col-span-12 lg:col-span-5"
                : "md:col-span-6 lg:col-span-4";

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  className={`${colSpan}`}
                >
                  <CardTilt3D tiltMax={6} scaleHover={1.015}>
                  <div
                    onMouseEnter={() => setCursor({ active: true, text: "STUDI KASUS" })}
                    onMouseLeave={resetCursor}
                    className="h-full flex flex-col bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FFF] hover:shadow-[10px_10px_0px_#FFE500] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group relative"
                  >
                {/* Project Header Bar */}
                <div className="p-4 border-b-3 border-black dark:border-neutral-700 flex items-center justify-between bg-neutral-100 dark:bg-[#1C1F1A]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white dark:bg-[#FFE500] dark:text-black px-2 py-0.5">
                      #{project.number}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#FF5C00]">
                      {project.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold bg-white dark:bg-black px-2 py-0.5 border border-black dark:border-neutral-600">
                    {project.year}
                  </span>
                </div>

                {/* Project Media Preview (if available) */}
                {project.cover_url && (
                  <div className="relative aspect-video w-full border-b-3 border-black dark:border-neutral-700 overflow-hidden bg-neutral-900">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-[#FFE500] text-black font-mono text-[10px] font-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                      FEATURED SHOWCASE
                    </div>
                  </div>
                )}

                {/* Project Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight uppercase group-hover:text-[#0047FF] dark:group-hover:text-[#FFE500] transition-colors mb-2">
                      {project.title}
                    </h3>

                    {project.subtitle && (
                      <p className="font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                        {project.subtitle}
                      </p>
                    )}

                    <p className="font-sans text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed line-clamp-3 mb-4">
                      {project.summary}
                    </p>
                  </div>

                  <div>
                    {/* Technologies Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 5).map((tech, i) => (
                        <span
                          key={i}
                          className="font-mono text-[11px] font-bold px-2 py-0.5 bg-neutral-100 dark:bg-[#1E1E1E] text-black dark:text-neutral-300 border border-black dark:border-neutral-700 hover:bg-[#FFE500] hover:text-black transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 text-neutral-500">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Action Links & Case Study Trigger */}
                    <div className="pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-2">
                      <BrutalistMagnetic strength={0.2}>
                        <button
                          onClick={() => setActiveModalProject(project)}
                          className="font-display font-black text-xs px-3.5 py-2 bg-[#FFE500] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers size={14} className="stroke-[2.5]" />
                          <span>STUDI KASUS</span>
                        </button>
                      </BrutalistMagnetic>

                      <div className="flex items-center gap-2">
                        {project.repository_url && (
                          <BrutalistMagnetic strength={0.3}>
                            <a
                              href={project.repository_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white dark:bg-[#1E1E1E] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#FFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block"
                              title="Tinjau Repositori GitHub"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          </BrutalistMagnetic>
                        )}

                        {project.project_url && (
                          <BrutalistMagnetic strength={0.3}>
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-[#FF5C00] text-white border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1"
                              title="Buka Live Demo"
                            >
                              <ExternalLink size={15} className="stroke-[2.5]" />
                            </a>
                          </BrutalistMagnetic>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                  </div>
                </CardTilt3D>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center border-4 border-black dark:border-white bg-white dark:bg-[#141414] shadow-[8px_8px_0px_#FF5C00]"
          >
            <Code2 size={48} className="mx-auto mb-4 text-[#FF5C00]" />
            <h4 className="font-display font-black text-2xl uppercase mb-2">
              Tidak Ada Proyek yang Cocok
            </h4>
            <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Pencarian untuk "{searchQuery}" pada kategori "{selectedCategory}" tidak menghasilkan data.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Semua");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#FFE500] text-black font-display font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              RESET FILTER & PENCARIAN
            </button>
          </motion.div>
        )}
      </div>

      {/* Interactive Neo-Brutalist Case Study Modal with Physics Springs */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 25 } }}
              exit={{ scale: 0.92, y: 20, opacity: 0, transition: { duration: 0.2 } }}
              className="relative w-full max-w-3xl my-8 bg-[#F4F4F0] dark:bg-[#121212] text-black dark:text-[#F4F4F0] border-4 border-black dark:border-white shadow-[12px_12px_0px_#000] dark:shadow-[12px_12px_0px_#FFF] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#FFE500] text-black border-b-4 border-black flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-black text-[#FFE500] px-2 py-0.5">
                    STUDI KASUS #{activeModalProject.number}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase">
                    {activeModalProject.category}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-1.5 bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer border border-black"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
                <div>
                  <h3 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight mb-2">
                    {activeModalProject.title}
                  </h3>
                  {activeModalProject.subtitle && (
                    <p className="font-mono text-sm text-[#FF5C00] font-bold">
                      {activeModalProject.subtitle}
                    </p>
                  )}
                </div>

                {/* Cover Image in Modal */}
                {activeModalProject.cover_url && (
                  <div className="aspect-video w-full border-3 border-black overflow-hidden bg-black">
                    <img
                      src={activeModalProject.cover_url}
                      alt={activeModalProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Metadata Specs Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700 font-mono text-xs">
                  <div>
                    <span className="text-neutral-500 block">PERAN:</span>
                    <span className="font-bold">{activeModalProject.role}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">TAHUN:</span>
                    <span className="font-bold">{activeModalProject.year}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">STATUS KARYA:</span>
                    <span className="font-bold text-emerald-600">TERVERIFIKASI</span>
                  </div>
                </div>

                {/* Case Study Details */}
                <div className="space-y-4">
                  {activeModalProject.case_study?.background && (
                    <div className="p-4 bg-white dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700">
                      <h4 className="font-mono text-xs font-black uppercase text-[#FF5C00] mb-1">
                        01. LATAR BELAKANG & TANTANGAN
                      </h4>
                      <p className="font-sans text-sm leading-relaxed">
                        {activeModalProject.case_study.background}
                      </p>
                    </div>
                  )}

                  {activeModalProject.case_study?.features && (
                    <div className="p-4 bg-white dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700">
                      <h4 className="font-mono text-xs font-black uppercase text-[#0047FF] mb-1">
                        02. FITUR UTAMA & ARSITEKTUR
                      </h4>
                      <p className="font-sans text-sm leading-relaxed">
                        {activeModalProject.case_study.features}
                      </p>
                    </div>
                  )}

                  {activeModalProject.case_study?.contribution && (
                    <div className="p-4 bg-white dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700">
                      <h4 className="font-mono text-xs font-black uppercase text-emerald-600 mb-1">
                        03. KONTRIBUSI REKAYASA
                      </h4>
                      <p className="font-sans text-sm leading-relaxed">
                        {activeModalProject.case_study.contribution}
                      </p>
                    </div>
                  )}

                  {activeModalProject.case_study?.outcome && (
                    <div className="p-4 bg-[#FFE500] text-black border-2 border-black shadow-[3px_3px_0px_#000]">
                      <h4 className="font-mono text-xs font-black uppercase mb-1">
                        04. HASIL & DAMPAK NYATA
                      </h4>
                      <p className="font-sans text-sm font-semibold leading-relaxed">
                        {activeModalProject.case_study.outcome}
                      </p>
                    </div>
                  )}
                </div>

                {/* Technologies List */}
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-neutral-500 mb-2">
                    TEKNOLOGI & STACK YANG DIGUNAKAN:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-mono text-xs font-bold border-2 border-black dark:border-neutral-700 shadow-[2px_2px_0px_#000]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Links */}
                <div className="pt-4 border-t-3 border-black dark:border-neutral-700 flex flex-wrap gap-3">
                  {activeModalProject.project_url && (
                    <a
                      href={activeModalProject.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#FF5C00] text-white font-display font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 no-underline"
                    >
                      <ExternalLink size={16} />
                      <span>BUKA LIVE DEMO PROYEK</span>
                    </a>
                  )}

                  {activeModalProject.repository_url && (
                    <a
                      href={activeModalProject.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black font-display font-black text-xs border-2 border-black dark:border-white shadow-[3px_3px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 no-underline"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>REPOSITORI GITHUB</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveModalProject(null)}
                    className="ml-auto px-4 py-2.5 bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-mono text-xs font-bold border-2 border-black dark:border-neutral-700 cursor-pointer"
                  >
                    TUTUP
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
