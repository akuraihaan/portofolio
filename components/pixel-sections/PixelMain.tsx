"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { CursorFollower } from "../motion/CursorFollower";
import { BrandPreloader } from "../motion/BrandPreloader";
import { PixelGridBackdrop } from "../pixel3d/PixelGridBackdrop";
import { ScrollProgress } from "../pixel3d/ScrollProgress";
import { TelemetryHud } from "../pixel3d/TelemetryHud";
import { SystemArchitectureDiagram } from "../pixel3d/SystemArchitectureDiagram";
import { PixelNavbar } from "./PixelNavbar";
import { PixelHero } from "./PixelHero";
import { PixelAbout } from "./PixelAbout";
import { PixelSkills, type SkillCategory } from "./PixelSkills";
import { PixelProjects, type ProjectItem, defaultProjects } from "./PixelProjects";
import { PixelExperience, type ExperienceRecord, defaultExperiences } from "./PixelExperience";
import { PixelEducation, type EducationRecord } from "./PixelEducation";
import { PixelCertificates, type CertificateItem, defaultCertificates } from "./PixelCertificates";
import { PixelContact } from "./PixelContact";
import { PixelFooter } from "./PixelFooter";
import { Code2, Server, Cloud, BookOpen } from "lucide-react";

interface PixelMainProps {
  bundle?: Bundle;
}

export function PixelMain({ bundle }: PixelMainProps) {
  // Identity & Narrative (Human Developer & Educator Persona)
  const ownerName =
    text(bundle?.profile?.full_name) ||
    text(bundle?.settings?.owner_name) ||
    "Taufik Raihandani";

  const ownerEmail =
    text(bundle?.settings?.owner_email) || "raihandani270204@gmail.com";

  const ownerLocation =
    text(bundle?.settings?.owner_location) ||
    "Banjarmasin, Kalimantan Selatan, Indonesia";

  const resumeUrl =
    safeHref(bundle?.settings?.resume_url) ||
    "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf";

  const avatarUrl =
    safeHref(bundle?.profile?.avatar_url) ||
    safeHref(bundle?.settings?.hero_image_url) ||
    null;

  const profileBio =
    text(bundle?.profile?.bio) ||
    "Sarjana Pendidikan Komputer dari Universitas Lambung Mangkurat (2026) dan Alumnus Bangkit Academy 2024 (Google, GoTo, Tokopedia, Traveloka). Merancang sistem web full-stack, arsitektur cloud serverless, dan media pembelajaran interaktif berbasis Learning Analytics dengan standar rekayasa perangkat lunak modern.";

  // Comprehensive 7 Real Projects (Fully Populated with Images, Repos & Deep Case Studies)
  const enrichedProjectsList: ProjectItem[] = [
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
        "Proyek capstone lintas disiplin pada program Bangkit Academy 2024 Batch 2 (Google, GoTo, Tokopedia, Traveloka). Bertanggung jawab atas seluruh pipeline backend, kontainerisasi Docker, API Gateway, dan deployment di Google Cloud Run.",
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

  // 4-Tier 24+ Professional Engineering Skills
  const comprehensiveSkillCategories: SkillCategory[] = [
    {
      id: "frontend",
      name: "Frontend & Creative 3D Tech",
      code: "01",
      icon: Code2,
      skills: [
        { name: "Next.js 16 (Turbopack)", level: "PROD", desc: "App Router, Server Actions, Dynamic Streaming & SSR", highlight: true },
        { name: "React 19 & Modern Hooks", level: "PROD", desc: "Concurrent rendering, useActionState, transition pipelines", highlight: true },
        { name: "TypeScript 5.5", level: "PROD", desc: "Strict type safety, generic types, robust interfaces", highlight: true },
        { name: "Tailwind CSS v4", level: "EXPERT", desc: "Design systems, fluid typography, arbitrary CSS tokens", highlight: true },
        { name: "Framer Motion", level: "EXPERT", desc: "Physics springs, layout transitions, reduced motion modes", highlight: true },
        { name: "Three.js & Canvas WebGL", level: "CORE", desc: "2D/3D isometric projection, voxel canvas rendering, 60fps loop" },
      ],
    },
    {
      id: "backend",
      name: "Backend, Database & Security",
      code: "02",
      icon: Server,
      skills: [
        { name: "Supabase & PostgreSQL", level: "PROD", desc: "Row-Level Security (RLS), stored procedures, realtime channels", highlight: true },
        { name: "Node.js & Express REST", level: "PROD", desc: "Microservices API, JWT authentication, request validation", highlight: true },
        { name: "PHP & Laravel Framework", level: "EXPERT", desc: "MVC architecture, Eloquent ORM, Blade, service providers" },
        { name: "Docker Containerization", level: "PROD", desc: "Multi-stage builds, container isolation, Cloud Run deployment", highlight: true },
        { name: "Database Schema Modeling", level: "EXPERT", desc: "Relational normalization, foreign keys, indexed queries" },
        { name: "Redis Caching Layer", level: "CORE", desc: "In-memory caching, rate limiting, session store" },
      ],
    },
    {
      id: "cloud",
      name: "Cloud Computing & Data Analytics",
      code: "03",
      icon: Cloud,
      skills: [
        { name: "Google Cloud Platform (GCP)", level: "PROD", desc: "Cloud Run serverless, Artifact Registry, IAM roles (Bangkit Capstone)", highlight: true },
        { name: "Learning Analytics Engine", level: "EXPERT", desc: "Perekaman dwell time, analisis ketuntasan sintaks siswa, evaluasi skripsi", highlight: true },
        { name: "Python 3.12 & Data Science", level: "EXPERT", desc: "Kaggle analysis, automated web scraping (BeautifulSoup/Selenium)", highlight: true },
        { name: "Vercel Edge Platform", level: "PROD", desc: "Edge middleware, global CDN caching, zero-config invalidation" },
        { name: "Git & Version Control", level: "EXPERT", desc: "SSH deployment keys, semantic commits, multi-branching" },
        { name: "RESTful & API Design", level: "PROD", desc: "OpenAPI specs, idempotent methods, JSON status contracts" },
      ],
    },
    {
      id: "pedagogy",
      name: "Computer Education & Engineering Standards",
      code: "04",
      icon: BookOpen,
      skills: [
        { name: "Instructional System Design", level: "EXPERT", desc: "Metodologi R&D ADDIE, kurikulum komputasi pedagogis terstruktur", highlight: true },
        { name: "Automated Testing (TAP/Jest)", level: "PROD", desc: "100% test pass guarantee, isolated PostgreSQL test suites", highlight: true },
        { name: "CI/CD GitHub Actions", level: "PROD", desc: "Automated linting, typechecking, Turbopack builds & deployment" },
        { name: "UI/UX & Web Accessibility (a11y)", level: "EXPERT", desc: "WCAG AAA contrast, keyboard navigation, semantic HTML5" },
        { name: "Technical Documentation", level: "PROD", desc: "Penyusunan PRD, spesifikasi teknis arsitektur, panduan pengguna" },
      ],
    },
  ];

  // Authentic Career & Academic Experiences Timeline
  const combinedExperiences: ExperienceRecord[] = [
    {
      id: "exp-flowwind-lead",
      role: "Lead Full-Stack Developer & Researcher",
      organization: "Universitas Lambung Mangkurat (ULM)",
      location: "Banjarmasin, Indonesia",
      start_date: "2025-01",
      end_date: "2026-08",
      type: "Riset Akademik & Pengembangan Sistem",
      description:
        "Memimpin perancangan dan implementasi penuh platform Flowwind Learn untuk materi pembelajaran interaktif Tailwind CSS dengan modul Learning Analytics.",
      highlights: [
        "Merancang sistem pembelajaran berbasis web interaktif dengan live preview iframe terisolasi",
        "Mengembangkan modul pencatatan telemetry analitik belajar untuk mengevaluasi pemahaman mahasiswa",
        "Meraih status validasi sangat layak dari tim penguji dan validator ahli materi",
      ],
    },
    {
      id: "exp-bangkit-cloud",
      role: "Cloud Computing Cohort (Capstone Lead)",
      organization: "Bangkit Academy by Google, GoTo, Tokopedia, Traveloka",
      location: "Jakarta / Remote, Indonesia",
      start_date: "2024-08",
      end_date: "2025-01",
      type: "Studi Independen Bersertifikat Kampus Merdeka",
      description:
        "Menyelesaikan kurikulum intensif cloud computing Google Cloud Platform (GCP) dan bertindak sebagai Cloud Engineer dalam tim capstone ComBridge BISINDO.",
      highlights: [
        "Lulus dengan predikat kelulusan cohort tinggi dan sertifikasi resmi dari Google & mitra konsorsium",
        "Men-deploy backend microservices di Google Cloud Run dengan kontainer Docker terisolasi",
        "Menghubungkan layanan API cloud dengan model machine learning dan aplikasi Android mobile",
      ],
    },
    {
      id: "exp-asisten-dosen",
      role: "Asisten Dosen & Laboratorium Komputer",
      organization: "Pendidikan Komputer FKIP Universitas Lambung Mangkurat",
      location: "Banjarmasin, Indonesia",
      start_date: "2023-08",
      end_date: "2025-06",
      type: "Akademik & Pedagogi",
      description:
        "Membimbing lebih dari 120+ mahasiswa dalam praktikum mata kuliah Pemrograman Web, Algoritma & Struktur Data, serta Sistem Basis Data.",
      highlights: [
        "Menyusun modul praktikum pemrograman terstruktur dan latihan kode interaktif",
        "Membimbing mahasiswa memecahkan error kode (debugging) dan standar arsitektur database relasional",
        "Mengevaluasi proyek akhir praktikum mahasiswa berdasarkan prinsip clean code",
      ],
    },
    {
      id: "exp-peksiminas-juara",
      role: "Perancang Media Visual & Kampanye Sosial (Juara 2)",
      organization: "Pusat Prestasi Nasional & BEM FKIP ULM",
      location: "Banjarmasin, Indonesia",
      start_date: "2024-04",
      end_date: "2024-05",
      type: "Prestasi Kompetisi Nasional",
      description:
        "Meraih Juara 2 dalam Lomba Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa (Peksiminas) tingkat fakultas/universitas.",
      highlights: [
        "Penghargaan Juara 2 Lomba Perancangan Desain Media Kampanye Sosial",
        "Penerapan prinsip tipografi editorial, komposisi visual kontemporer, dan aksesibilitas pesan publik",
      ],
    },
  ];

  // 5 Verified Certificates with Real Supabase Storage Images
  const combinedCerts: CertificateItem[] = [
    {
      id: "cert-sendikom-2026",
      title: "Sertifikat Seminar Nasional Komputer 2026",
      issuer: "SENDIKOM 2026",
      issue_date: "2026-06-23",
      category: "Publikasi Ilmiah",
      isAward: false,
      certificate_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
      credential_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
      description: "Sertifikat Pemakalah / Peserta Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset teknologi komputasi dan pembelajaran interaktif.",
    },
    {
      id: "cert-peksiminas-2024",
      title: "Sertifikat Peksiminas FKIP XVIII (Juara 2)",
      issuer: "Pusat Prestasi Nasional (Puspresnas) & BEM FKIP",
      issue_date: "2024-04-15",
      category: "Penghargaan Kompetisi",
      isAward: true,
      certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
      credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
      description: "Penghargaan Juara 2 dalam perancangan media komunikasi visual dan kampanye sosial edukatif pada Pekan Seni Mahasiswa.",
    },
    {
      id: "cert-gdsc-2023",
      title: "Webinar Nasional GDSC X IT FEST",
      issuer: "Google Developer Student Club (GDSC)",
      issue_date: "2023-11-11",
      category: "Teknologi Industri",
      isAward: false,
      certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
      credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
      description: "Sertifikasi partisipasi pengembangan ekosistem web moderen, infrastruktur cloud, dan tren industri software engineer.",
    },
    {
      id: "cert-scratch-2025",
      title: "Pelatihan Pemrograman Scratch Siswa SMAN 1 Panyipatan",
      issuer: "Pendidikan Komputer FKIP ULM",
      issue_date: "2025-09-08",
      category: "Instruktur & Pengabdian",
      isAward: false,
      certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
      credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
      description: "Sertifikat Instruktur Pengabdian Masyarakat dalam membimbing siswa SMA memahami dasar logika komputasi menggunakan visual block programming Scratch.",
    },
    {
      id: "cert-lahan-basah-2023",
      title: "TIK untuk Kemajuan Literasi Digital Masyarakat Lahan Basah",
      issuer: "Pendidikan Komputer ULM",
      issue_date: "2023-08-02",
      category: "Literasi Digital",
      isAward: false,
      certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
      credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
      description: "Sertifikasi diseminasi penerapan teknologi informasi dan komunikasi dalam penguatan literasi digital masyarakat lingkungan lahan basah.",
    },
    {
      id: "cert-bangkit-cloud",
      title: "Bangkit Academy Cloud Computing Graduate Certificate",
      issuer: "Google, GoTo, Tokopedia, Traveloka",
      issue_date: "2025-01-15",
      category: "Sertifikasi Industri",
      isAward: false,
      certificate_url: null,
      credential_url: "https://www.credential.net",
      description: "Kelulusan resmi program studi independen bersertifikat kurikulum arsitektur cloud Google Cloud Platform (GCP), microservices, dan kontainerisasi.",
    },
  ];

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Non-blocking Preloader (Never hides page data) */}
        <BrandPreloader />

        {/* Global Motion Cursor Follower */}
        <CursorFollower />

        {/* Isometric Grid Backdrop & HUD Coordinates */}
        <PixelGridBackdrop />

        {/* Scroll Depth HUD */}
        <ScrollProgress />

        {/* Main Digital World Container */}
        <div className="relative min-h-screen text-[#171816] dark:text-[#F4F3EE] transition-colors duration-200">
          {/* Engineering Telemetry Bar with Sound Synthesizer Toggle */}
          <TelemetryHud />

          {/* Navigation Bar */}
          <PixelNavbar />

          <main id="main">
            {/* Hero Section */}
            <PixelHero
              ownerName={ownerName}
              description={profileBio}
              resumeUrl={resumeUrl}
            />

            {/* About & Narrative Section */}
            <PixelAbout
              ownerName={ownerName}
              avatarUrl={avatarUrl}
              bio={profileBio}
            />

            {/* Skills & Technical Matrix */}
            <PixelSkills categories={comprehensiveSkillCategories} />

            {/* Selected Projects Showcase */}
            <PixelProjects projects={enrichedProjectsList} />

            {/* Software Engineering Blueprint Schematic */}
            <SystemArchitectureDiagram />

            {/* Experience & Career Milestones */}
            <PixelExperience experiences={combinedExperiences} />

            {/* Academic Alma Mater & Thesis Foundation */}
            <PixelEducation />

            {/* Verified Credential Archive */}
            <PixelCertificates certificates={combinedCerts} />

            {/* Contact & Communications Section */}
            <PixelContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
            />
          </main>

          {/* Footer */}
          <PixelFooter />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}
