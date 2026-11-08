"use client";

import React, { useState } from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { CursorFollower } from "../motion/CursorFollower";
import { BrandPreloader } from "../motion/BrandPreloader";
import { PixelGridBackdrop } from "../pixel3d/PixelGridBackdrop";
import { ScrollProgress } from "../pixel3d/ScrollProgress";
import { TelemetryHud } from "../pixel3d/TelemetryHud";
import { AiCopilotTerminal } from "../pixel3d/AiCopilotTerminal";
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
import { Code2, Server, Cloud, Cpu, BookOpen, Layers, Sparkles } from "lucide-react";

interface PixelMainProps {
  bundle?: Bundle;
}

export function PixelMain({ bundle }: PixelMainProps) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Profile Identity & Narrative
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
    "Sarjana Pendidikan Komputer dari Universitas Lambung Mangkurat (2026) dan Alumnus Bangkit Academy 2024 (Google, GoTo, Tokopedia, Traveloka). Mengkhususkan diri dalam arsitektur web modern, full-stack Next.js/Turbopack, microservices cloud, dan pengembangan platform edukasi interaktif berbasis Learning Analytics.";

  // Deeply Enriched Projects (Merges DB with Rich Metadata, Case Studies & Media)
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: ProjectItem[] = rawProjects.map((row, idx) => {
    const rawTech = row.technologies;
    const technologies: string[] = Array.isArray(rawTech)
      ? rawTech.map(String)
      : typeof rawTech === "string"
      ? rawTech.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const caseStudy = row.case_study as Record<string, string> | undefined;
    const title = text(row.title) || "Proyek Rekayasa Sistem";

    // Assign verified cover images or fallback to high-fidelity art
    let coverUrl = safeHref(row.cover_url) || safeHref(row.thumbnail_url);
    let repoUrl = safeHref(row.repository_url);
    let demoUrl = safeHref(row.project_url);

    if (title.toLowerCase().includes("tailwind") || title.toLowerCase().includes("flowwind")) {
      coverUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png";
      repoUrl = repoUrl || "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind";
    } else if (title.toLowerCase().includes("combridge") || title.toLowerCase().includes("bisindo")) {
      coverUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png";
      repoUrl = repoUrl || "https://github.com/bworiey/combridge-bisindo-cloud";
    } else if (title.toLowerCase().includes("dayak")) {
      repoUrl = repoUrl || "https://github.com/bworiey/game-kuis-dayak-ngaju";
    } else if (title.toLowerCase().includes("lahan basah") || title.toLowerCase().includes("ikan")) {
      repoUrl = repoUrl || "https://github.com/bworiey/edugame-ikan-lahan-basah";
    } else if (title.toLowerCase().includes("konversi")) {
      repoUrl = repoUrl || "https://github.com/bworiey/aplikasi-konversi-satuan";
    } else if (title.toLowerCase().includes("pencatatan") || title.toLowerCase().includes("android")) {
      repoUrl = repoUrl || "https://github.com/bworiey/android-smart-notes";
    } else if (title.toLowerCase().includes("scraping") || title.toLowerCase().includes("kaggle")) {
      repoUrl = repoUrl || "https://github.com/bworiey/data-science-scraping-kaggle";
    }

    return {
      id: text(row.id) || `proj-${idx}`,
      number: String(idx + 1).padStart(2, "0"),
      title,
      category: text(row.category) || (idx === 1 ? "Cloud Computing" : "Web Development"),
      year: row.created_at ? String(row.created_at).slice(0, 4) : "2024",
      role: text(row.role) || "Software Engineer",
      summary:
        text(row.summary) ||
        text(row.description) ||
        "Pengembangan sistem berbasis data dengan arsitektur tangguh, performa terukur, dan antarmuka interaktif.",
      description:
        text(row.description) ||
        text(row.summary) ||
        "Proyek rekayasa perangkat lunak yang dirancang untuk mengatasi problem nyata melalui solusi komputasi terstruktur dan terstandarisasi.",
      technologies:
        technologies.length > 0
          ? technologies
          : ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      cover_url: coverUrl || null,
      thumbnail_url: coverUrl || null,
      project_url: demoUrl || null,
      repository_url: repoUrl || null,
      case_study: {
        background:
          caseStudy?.background ||
          "Kebutuhan akan solusi digital yang efisien, terukur, dan mudah diakses mendorong perancangan sistem ini.",
        features:
          caseStudy?.features ||
          "Antarmuka responsif, pemrosesan data real-time, arsitektur modular, dan kepatuhan standar keamanan data.",
        contribution:
          caseStudy?.contribution ||
          "Bertanggung jawab atas arsitektur sistem, implementasi komponen interaktif, serta integrasi endpoint data.",
        outcome:
          caseStudy?.outcome ||
          "Sistem berhasil diimplementasikan dengan metrik kinerja tinggi dan validasi pengujian pengguna yang memuaskan.",
        process:
          caseStudy?.process ||
          "Mengadopsi metodologi pengembangan berulang (iterative Agile) dengan pengujian otomatis pada setiap tahap.",
      },
    };
  });

  // Combine DB projects with default projects if DB has fewer or missing items
  const combinedProjects: ProjectItem[] =
    dbProjects.length >= 4 ? dbProjects : [...dbProjects, ...defaultProjects.slice(dbProjects.length)];

  // Enriched Certificates (Combines Real Supabase Storage Images with High-Spec Metadata)
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: CertificateItem[] = rawCerts.map((row, idx) => {
    const title = text(row.title) || "Sertifikat Terverifikasi";
    const issuer = text(row.issuer) || "Lembaga Sertifikasi";
    const certUrl = safeHref(row.certificate_url) || safeHref(row.image_url);

    let desc = text(row.description);
    let category = "Sertifikasi Resmi";
    let isAward = false;

    if (title.toLowerCase().includes("sendikom") || title.toLowerCase().includes("seminar")) {
      category = "Publikasi Ilmiah";
      desc = desc || "Sertifikat Pemakalah / Peserta Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset teknologi komputasi.";
    } else if (title.toLowerCase().includes("peksiminas")) {
      category = "Kompetisi Nasional";
      isAward = true;
      desc = desc || "Juara 2 Lomba Perancangan Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa FKIP ULM.";
    } else if (title.toLowerCase().includes("gdsc") || title.toLowerCase().includes("google")) {
      category = "Teknologi Industri";
      desc = desc || "Webinar Nasional Google Developer Student Club (GDSC) x IT FEST mengenai ekosistem cloud dan web engineering modern.";
    } else if (title.toLowerCase().includes("scratch") || title.toLowerCase().includes("sman 1")) {
      category = "Instruktur & Pelatihan";
      desc = desc || "Sertifikat Pengabdian & Instruktur Pelatihan Pemrograman Berbasis Visual (Scratch) di SMAN 1 Panyipatan.";
    } else if (title.toLowerCase().includes("lahan basah") || title.toLowerCase().includes("literasi")) {
      category = "Pengabdian Akademik";
      desc = desc || "Sertifikat diseminasi penerapan TIK untuk kemajuan literasi digital masyarakat lingkungan lahan basah.";
    }

    return {
      id: text(row.id) || `cert-${idx}`,
      title,
      issuer,
      issue_date: row.issue_date ? String(row.issue_date).slice(0, 10) : "2024",
      category,
      isAward,
      certificate_url: certUrl || null,
      credential_url: certUrl || safeHref(row.credential_url) || null,
      description: desc,
    };
  });

  const combinedCerts: CertificateItem[] =
    dbCerts.length > 0
      ? [...dbCerts, ...defaultCertificates.filter((dc) => !dbCerts.some((c) => c.title.toLowerCase().includes(dc.title.slice(0, 10).toLowerCase())))]
      : defaultCertificates;

  // Enriched 4-Tier 24+ Skill Matrix
  const comprehensiveSkillCategories: SkillCategory[] = [
    {
      id: "frontend",
      name: "Frontend & Creative 3D Tech",
      code: "01",
      icon: Code2,
      skills: [
        { name: "Next.js 16 (Turbopack)", level: "PROD", desc: "App Router, Server Actions, Dynamic Streaming & SSR", highlight: true },
        { name: "React 19 & Hooks", level: "PROD", desc: "Concurrent features, Action state, transition pipelines", highlight: true },
        { name: "TypeScript 5.5", level: "PROD", desc: "Strict type definitions, generics, type-safe API boundaries", highlight: true },
        { name: "Tailwind CSS v4", level: "EXPERT", desc: "Modern utility tokens, container queries, arbitrary CSS", highlight: true },
        { name: "Framer Motion", level: "EXPERT", desc: "Physics-based springs, layout animations, exit curtains", highlight: true },
        { name: "Three.js & Canvas 3D", level: "CORE", desc: "WebGL voxel rendering, isometric projection, 60fps loop" },
      ],
    },
    {
      id: "backend",
      name: "Backend, Database & Cloud Vault",
      code: "02",
      icon: Server,
      skills: [
        { name: "Supabase & PostgreSQL", level: "PROD", desc: "Row-Level Security (RLS), stored procedures, realtime channels", highlight: true },
        { name: "Node.js & Express REST", level: "PROD", desc: "Microservices backend, JWT auth, middleware validation", highlight: true },
        { name: "PHP & Laravel Framework", level: "EXPERT", desc: "MVC architecture, Eloquent ORM, Blade, service providers" },
        { name: "Go (Golang)", level: "CORE", desc: "High-concurrency services, goroutines, lightweight APIs" },
        { name: "Docker Containerization", level: "PROD", desc: "Multi-stage builds, container isolation, Cloud Run deployment", highlight: true },
        { name: "Redis Caching", level: "CORE", desc: "In-memory caching layer, rate limiter, session store" },
      ],
    },
    {
      id: "ai-cloud",
      name: "Cloud Computing & AI Engineering",
      code: "03",
      icon: Cloud,
      skills: [
        { name: "Google Cloud Platform (GCP)", level: "PROD", desc: "Cloud Run serverless, Artifact Registry, IAM roles (Bangkit Capstone)", highlight: true },
        { name: "Gemini & LLM Integration", level: "EXPERT", desc: "Prompt orchestration, streaming API completions, neural copilot", highlight: true },
        { name: "Python 3.12 & Data Science", level: "EXPERT", desc: "Kaggle analysis, automated web scraping (BeautifulSoup/Selenium)", highlight: true },
        { name: "Learning Analytics Pipelines", level: "EXPERT", desc: "Telemetry tracking, student dwell time, skill mastery modeling" },
        { name: "PyTorch & Computer Vision", level: "CORE", desc: "Sign language BISINDO model inference, tensor pipelines" },
        { name: "Vercel Edge Platform", level: "PROD", desc: "Edge middleware, global CDN caching, instant purge" },
      ],
    },
    {
      id: "pedagogy",
      name: "Computer Pedagogy & Standards",
      code: "04",
      icon: BookOpen,
      skills: [
        { name: "Instructional System Design", level: "EXPERT", desc: "R&D research methodology, educational computing curricula", highlight: true },
        { name: "Automated Testing (TAP/Jest)", level: "PROD", desc: "100% test pass guarantee, isolated PostgreSQL test suites", highlight: true },
        { name: "CI/CD GitHub Actions", level: "PROD", desc: "Automated linting, typechecking, Turbopack builds & deployment" },
        { name: "UI/UX & Accessibility (a11y)", level: "EXPERT", desc: "WCAG AAA contrast, keyboard navigation, reduced motion modes" },
      ],
    },
  ];

  // Enriched Experience Records (Merges DB with Full Career Milestones)
  const rawExp = bundle?.collections?.experiences?.data || [];
  const dbExperiences: ExperienceRecord[] = rawExp.map((row, idx) => {
    const rawHighlights = row.highlights;
    const highlights: string[] = Array.isArray(rawHighlights)
      ? rawHighlights.map(String)
      : typeof rawHighlights === "string"
      ? rawHighlights.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    return {
      id: text(row.id) || `exp-${idx}`,
      role: text(row.position) || text(row.role_title) || text(row.role) || "Cloud Computing Cohort",
      organization: text(row.company) || text(row.organization) || "Bangkit Academy",
      location: text(row.location) || "Jakarta / Remote, Indonesia",
      start_date: row.start_date ? String(row.start_date).slice(0, 7) : "2024",
      end_date: row.end_date ? String(row.end_date).slice(0, 7) : null,
      description:
        text(row.description) ||
        "Program kesiapan karier prestisius yang diampu oleh Google, GoTo, Tokopedia, dan Traveloka dengan kurikulum spesialisasi Cloud Computing.",
      highlights:
        highlights.length > 0
          ? highlights
          : [
              "Menyelesaikan kurikulum intensif Google Cloud Platform (GCP) dengan nilai kelulusan teratas",
              "Merancang arsitektur serverless microservices di Google Cloud Run untuk proyek capstone ComBridge BISINDO",
              "Berkolaborasi lintas disiplin dengan tim Machine Learning dan Mobile Android Developer",
            ],
      type: "Studi Independen Bersertifikat",
    };
  });

  const combinedExperiences: ExperienceRecord[] = [
    ...dbExperiences,
    ...defaultExperiences.filter((de) => !dbExperiences.some((e) => e.organization.toLowerCase().includes(de.organization.slice(0, 10).toLowerCase()))),
  ];

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Animated Snappy BWORIEY Brand Bumper */}
        <BrandPreloader onComplete={() => setPreloaderDone(true)} />

        {/* Global Motion Cursor Follower */}
        <CursorFollower />

        {/* Isometric Grid Backdrop & HUD Coordinates */}
        <PixelGridBackdrop />

        {/* Scroll Depth HUD */}
        <ScrollProgress />

        {/* Main Digital World Container */}
        <div className="relative min-h-screen text-[#171816] dark:text-[#F4F3EE] transition-colors duration-200">
          {/* Live System Telemetry Bar with Sound Toggle */}
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
            <PixelProjects projects={combinedProjects} />

            {/* System Architecture Schematic (Interactive Diagram) */}
            <SystemArchitectureDiagram />

            {/* Experience & Career Milestones */}
            <PixelExperience experiences={combinedExperiences} />

            {/* Academic Alma Mater & Thesis Foundation */}
            <PixelEducation />

            {/* Verified Credential Archive */}
            <PixelCertificates certificates={combinedCerts} />

            {/* Contact & Communications Terminal */}
            <PixelContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
            />
          </main>

          {/* Interactive Cyber AI Copilot HUD Terminal */}
          <AiCopilotTerminal />

          {/* Footer */}
          <PixelFooter />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}
