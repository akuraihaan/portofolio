"use client";

import { type Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { SpaceBackground } from "./SpaceBackground";
import { SpaceNavbar } from "./SpaceNavbar";
import { SpaceHero } from "./SpaceHero";
import { SpaceAbout } from "./SpaceAbout";
import { SpacePortfolio, type ProjectItem, type CertificateItem } from "./SpacePortfolio";
import { SpaceContact } from "./SpaceContact";
import { SpaceFooter } from "./SpaceFooter";

interface SpaceMainProps {
  bundle?: Bundle;
}

export function SpaceMain({ bundle }: SpaceMainProps) {
  // Extract profile & settings
  const ownerName =
    text(bundle?.profile?.full_name) ||
    text(bundle?.settings?.owner_name) ||
    text(bundle?.settings?.site_name) ||
    "Taufik Raihandani";

  const ownerEmail =
    text(bundle?.settings?.owner_email) || "raihandani270204@gmail.com";

  const ownerLocation =
    text(bundle?.settings?.owner_location) ||
    "Banjarmasin, Kalimantan Selatan, Indonesia";

  const ownerBio =
    text(bundle?.profile?.bio) ||
    "Mahasiswa Pendidikan Komputer Universitas Lambung Mangkurat & Alumnus Bangkit Academy (Cloud Computing). Bersemangat dalam merancang web interaktif, performa tinggi, dan arsitektur cloud yang handal.";

  const resumeUrl = safeHref(bundle?.settings?.resume_url) || "#contact";

  const avatarUrl =
    safeHref(bundle?.profile?.avatar_url) ||
    safeHref(bundle?.settings?.hero_image_url) ||
    null;

  // Map Projects
  const bundleProjects: ProjectItem[] = (
    bundle?.collections?.projects?.data || []
  ).map((row) => {
    const rawTech = row.technologies;
    const technologies: string[] = Array.isArray(rawTech)
      ? rawTech.map(String)
      : typeof rawTech === "string"
      ? rawTech.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const caseStudy = row.case_study as Record<string, string> | undefined;

    return {
      id: text(row.id) || Math.random().toString(),
      title: text(row.title) || "Proyek Web",
      category: text(row.category) || "Proyek",
      summary: text(row.summary) || text(row.description),
      description: text(row.description) || text(row.summary),
      technologies,
      cover_url: safeHref(row.cover_url) || null,
      thumbnail_url: safeHref(row.thumbnail_url) || null,
      project_url: safeHref(row.project_url) || null,
      repository_url: safeHref(row.repository_url) || null,
      case_study: {
        background: caseStudy?.background || undefined,
        features: caseStudy?.features || undefined,
        contribution: caseStudy?.contribution || undefined,
        outcome: caseStudy?.outcome || undefined,
        process: caseStudy?.process || undefined,
      },
    };
  });

  // Fallback authentic projects if none returned
  const finalProjects =
    bundleProjects.length > 0
      ? bundleProjects
      : [
          {
            id: "1",
            title:
              "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Materi Framework Tailwind CSS",
            category: "Tugas Akhir",
            summary:
              "Media pembelajaran web interaktif untuk materi CSS dasar dan Tailwind CSS, dengan learning analytics untuk membantu guru memantau kinerja siswa.",
            description:
              "Media pembelajaran berbasis web yang menyajikan materi CSS dasar hingga framework Tailwind CSS secara interaktif. Learning analytics diterapkan untuk mendukung pemantauan kinerja siswa oleh guru.",
            technologies: ["Express.js", "Tailwind CSS", "MySQL", "Laravel"],
            case_study: {
              background:
                "Proyek tugas akhir berupa media pembelajaran web interaktif untuk materi CSS dasar hingga framework Tailwind CSS.",
              features:
                "Materi CSS dasar hingga Tailwind CSS disajikan secara interaktif. Learning analytics membantu guru memantau kinerja siswa.",
              contribution:
                "Mengembangkan media pembelajaran berbasis web dan menerapkan learning analytics untuk mendukung pemantauan kinerja siswa oleh guru.",
              outcome:
                "Media pembelajaran dinyatakan valid oleh validator materi dan validator media.",
            },
          },
          {
            id: "2",
            title: "Combridge — Aplikasi Penerjemah Bahasa Isyarat BISINDO",
            category: "Proyek Kelompok",
            summary:
              "Aplikasi Android untuk menerjemahkan bahasa isyarat BISINDO menjadi huruf. Kontribusi saya berfokus pada layanan cloud dan API.",
            description:
              "Combridge dikembangkan bersama tim Bangkit Academy sebagai aplikasi Android penerjemah bahasa isyarat BISINDO menjadi huruf. Saya berkontribusi sebagai Cloud Engineer.",
            technologies: ["Google Cloud", "Android", "API", "Express.js"],
            case_study: {
              background:
                "Combridge adalah proyek kelompok Bangkit Academy berupa aplikasi Android penerjemah bahasa isyarat BISINDO menjadi huruf.",
              features:
                "Autentikasi pengguna, akses daring ke gambar peraga bahasa isyarat, dan API pembacaan hasil terjemahan.",
              contribution:
                "Menyiapkan fitur autentikasi, akses daring ke gambar peraga pada kamus, dan API untuk membaca hasil terjemahan dari dataset yang disediakan tim machine learning.",
              outcome:
                "Berhasil diintegrasikan ke aplikasi mobile dan dipresentasikan pada capstone project Bangkit Academy.",
            },
          },
          {
            id: "3",
            title: "Game Edukasi Kuis Bahasa Dayak Ngaju",
            category: "Proyek Perkuliahan",
            summary:
              "Game kuis sederhana berbasis web untuk memperkenalkan bahasa Dayak Ngaju kepada generasi muda secara interaktif.",
            description:
              "Aplikasi web edukatif yang dirancang untuk pelestarian bahasa daerah Dayak Ngaju melalui mekanisme permainan kuis interaktif.",
            technologies: ["HTML5", "CSS3", "JavaScript"],
          },
          {
            id: "4",
            title: "Game Edukasi Mengenal Ikan di Lahan Basah",
            category: "Proyek Perkuliahan",
            summary:
              "Game edukasi sederhana untuk mengenalkan berbagai jenis ikan yang hidup di ekosistem lahan basah Kalimantan Selatan.",
            description:
              "Media edukasi interaktif berbasis Laravel untuk pengenalan fauna lahan basah bagi pelajar.",
            technologies: ["PHP", "Laravel", "MySQL"],
          },
          {
            id: "5",
            title: "Aplikasi Konversi Satuan Panjang",
            category: "Proyek Perkuliahan",
            summary:
              "Aplikasi Python untuk mengonversi satuan panjang dalam perhitungan matematika dan fisika secara akurat.",
            description:
              "Program utilitas matematika yang memudahkan pengguna dalam mengonversi metrik panjang antar standar internasional.",
            technologies: ["Python", "Algorithms"],
          },
          {
            id: "6",
            title: "Aplikasi Pencatatan Berbasis Android",
            category: "Proyek Perkuliahan",
            summary:
              "Aplikasi mobile Android untuk keperluan pencatatan catatan harian, dibuat dalam mata kuliah Pemrograman Android.",
            description:
              "Aplikasi pencatat tugas dan ide dengan antarmuka mobile yang responsif dan penyimpanan lokal.",
            technologies: ["Android", "Java", "SQLite"],
          },
          {
            id: "7",
            title: "Web Scraping dan Pengujian Data",
            category: "Proyek Perkuliahan",
            summary:
              "Proyek Data Science yang mencakup ekstraksi data melalui web scraping dan pengujian performa model dengan dataset Kaggle.",
            description:
              "Pipeline pengumpulan data web otomatis dan visualisasi eksploratori berbasis Python.",
            technologies: ["Python", "Kaggle", "BeautifulSoup"],
          },
        ];

  // Map Certificates
  const bundleCertificates: CertificateItem[] = (
    bundle?.collections?.certificates?.data || []
  ).map((row) => ({
    id: text(row.id) || Math.random().toString(),
    title: text(row.title) || "Sertifikat Kompetensi",
    issuer: text(row.issuer) || "Penyelenggara Resmi",
    issue_date: text(row.issue_date) || undefined,
    credential_url: safeHref(row.credential_url) || null,
    certificate_url:
      safeHref(row.certificate_url) || safeHref(row.image_url) || null,
    image_url: safeHref(row.image_url) || null,
    description: text(row.description) || undefined,
  }));

  const finalCertificates =
    bundleCertificates.length > 0
      ? bundleCertificates
      : [
          {
            id: "c1",
            title: "Sertifikat Seminar Nasional Komputer 2026",
            issuer: "SENDIKOM 2026",
            issue_date: "2026-06-23",
            certificate_url:
              "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
          },
          {
            id: "c2",
            title:
              "TIK untuk kemajuan literasi digital masyarakat lahan basah",
            issuer: "Pendidikan Komputer ULM",
            issue_date: "2023-08-02",
            certificate_url:
              "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
          },
          {
            id: "c3",
            title: "Webinar Nasional GDSC X IT FEST",
            issuer: "Google Developer Student Club",
            issue_date: "2023-11-11",
            certificate_url:
              "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
          },
          {
            id: "c4",
            title: "Sertifikat Peksiminas FKIP XVIII",
            issuer: "Puspresnas Kemdikbud",
            issue_date: "2024-04-15",
            certificate_url:
              "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
          },
          {
            id: "c5",
            title:
              "Pelatihan Pemrograman Scratch bagi siswa di sekolah SMAN 1 Panyipatan",
            issuer: "Pendidikan Komputer ULM",
            issue_date: "2025-09-08",
            certificate_url:
              "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
          },
        ];

  // Map Education
  const bundleEducations = (bundle?.collections?.educations?.data || []).map(
    (row) => ({
      id: text(row.id),
      institution: text(row.institution) || "Universitas",
      degree: text(row.degree) || "Sarjana",
      field_of_study: text(row.field_of_study) || "Teknologi",
      location: text(row.location) || "Banjarmasin",
      start_date: row.start_date
        ? String(row.start_date).slice(0, 4)
        : "2022",
      end_date: row.end_date ? String(row.end_date).slice(0, 4) : "2026",
      is_current: Boolean(row.is_current),
      description:
        text(row.description) ||
        "Pendidikan pada bidang komputer, pembelajaran, dan pengembangan teknologi pendidikan.",
    })
  );

  // Map Experience
  const bundleExperiences = (bundle?.collections?.experiences?.data || []).map(
    (row) => {
      const rawResp = row.responsibilities;
      const responsibilities: string[] = Array.isArray(rawResp)
        ? rawResp.map(String)
        : typeof rawResp === "string"
        ? rawResp.split(/\n+/).map((s) => s.trim()).filter(Boolean)
        : [];

      return {
        id: text(row.id),
        company: text(row.company) || "Bangkit Academy Batch 2024",
        role_title:
          text(row.role_title) || "Cloud Computing Cohort / Cloud Engineer",
        location: text(row.location) || "Jakarta (Remote)",
        start_date: row.start_date
          ? String(row.start_date).slice(0, 7)
          : "Agu 2024",
        end_date: row.end_date
          ? String(row.end_date).slice(0, 7)
          : "Jan 2025",
        is_current: Boolean(row.is_current),
        description:
          text(row.description) ||
          "Program kesiapan karier bersertifikat dari Kampus Merdeka, yang dipimpin oleh Google, GoTo, Tokopedia, dan Traveloka.",
        responsibilities,
      };
    }
  );

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 font-sans selection:bg-[#2c67ed] selection:text-white overflow-x-hidden">
      {/* 1. Deep Space Starfield & Cosmic Nebula Background */}
      <SpaceBackground />

      {/* 2. Floating Centered Glow Navbar */}
      <SpaceNavbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 3. Hero Section with Typewriter Effect */}
        <SpaceHero
          name={ownerName}
          bio={ownerBio}
          resumeUrl={resumeUrl}
        />

        {/* 4. About Me with Photo, Education, Experience, & Stats */}
        <SpaceAbout
          avatarUrl={avatarUrl}
          ownerName={ownerName}
          ownerBio={ownerBio}
          ownerLocation={ownerLocation}
          educations={bundleEducations.length > 0 ? bundleEducations : undefined}
          experiences={
            bundleExperiences.length > 0 ? bundleExperiences : undefined
          }
          stats={{
            projectsCount: finalProjects.length,
            certificatesCount: finalCertificates.length,
            technologiesCount: 12,
            experienceYears: "2+",
          }}
        />

        {/* 5. Portfolio Section with 3 Tabs: Projects, Certificates, Tech Stack */}
        <SpacePortfolio
          projects={finalProjects}
          certificates={finalCertificates}
        />

        {/* 6. Contact Section with Form & Social Links */}
        <SpaceContact
          ownerEmail={ownerEmail}
          ownerLocation={ownerLocation}
          ownerName={ownerName}
        />
      </main>

      {/* 7. Space Footer */}
      <SpaceFooter ownerName={ownerName} />
    </div>
  );
}

