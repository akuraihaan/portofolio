"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { BrandPreloader } from "../motion/BrandPreloader";
import { CustomCursor } from "../motion/CustomCursor";
import { ScrollProgress } from "../motion/ScrollProgress";

import { MotorsportNavbar } from "./MotorsportNavbar";
import { MotorsportHero } from "./MotorsportHero";
import { MotorsportAbout } from "./MotorsportAbout";
import {
  MotorsportSkills,
  motorsportSkillGroups,
  type DynamicSkillRecord,
} from "./MotorsportSkills";
import {
  MotorsportGallery,
  type MotorsportProjectItem,
  defaultMotorsportProjects,
} from "./MotorsportGallery";
import {
  MotorsportExperience,
  type MotorsportExperienceRecord,
  defaultMotorsportExperiences,
} from "./MotorsportExperience";
import {
  MotorsportCertificates,
  type MotorsportCertificateItem,
  defaultMotorsportCertificates,
} from "./MotorsportCertificates";
import {
  MotorsportResearch,
  type MotorsportArticleItem,
  defaultMotorsportArticles,
} from "./MotorsportResearch";
import { MotorsportContact } from "./MotorsportContact";
import { MotorsportFooter } from "./MotorsportFooter";

interface MotorsportMainProps {
  bundle?: Bundle;
}

export function MotorsportMain({ bundle }: MotorsportMainProps) {
  // Extract profile & settings from dynamic Supabase bundle
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
    "Lulusan Sarjana Pendidikan Komputer Universitas Lambung Mangkurat dan Alumnus Bangkit Academy 2024 by Google, GoTo, Tokopedia, Traveloka (Cloud Computing Capstone Lead). Berfokus pada Web Development, UI/UX Architecture, Educational Technology, dan Software Engineering.";

  // Dynamic Database Mapping for Projects
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: MotorsportProjectItem[] = rawProjects.map((row, idx) => {
    const rawTech = row.technologies;
    const technologies: string[] = Array.isArray(rawTech)
      ? rawTech.map(String)
      : typeof rawTech === "string"
      ? rawTech.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const caseStudy = row.case_study as Record<string, string> | undefined;
    const title = text(row.title) || "Proyek Rekayasa";

    let coverUrl = safeHref(row.cover_url) || safeHref(row.thumbnail_url);
    let repoUrl = safeHref(row.repository_url);

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
      subtitle: text(row.subtitle) || (idx === 0 ? "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar" : undefined),
      category: text(row.category) || (idx === 1 ? "Cloud Computing" : "Web Development"),
      year: row.created_at ? String(row.created_at).slice(0, 4) : "2024",
      role: text(row.role) || "Software Engineer",
      summary: text(row.summary) || text(row.description) || "Pengembangan sistem berbasis web dengan arsitektur modern.",
      description: text(row.description) || text(row.summary) || "Proyek rekayasa perangkat lunak terstruktur.",
      technologies: technologies.length > 0 ? technologies : ["Next.js", "TypeScript", "Tailwind CSS"],
      cover_url: coverUrl || null,
      thumbnail_url: coverUrl || null,
      project_url: safeHref(row.project_url) || null,
      repository_url: repoUrl || null,
      case_study: {
        background: caseStudy?.background || undefined,
        features: caseStudy?.features || undefined,
        contribution: caseStudy?.contribution || undefined,
        outcome: caseStudy?.outcome || undefined,
        process: caseStudy?.process || undefined,
      },
    };
  });

  const finalProjects = dbProjects.length > 0 ? dbProjects : defaultMotorsportProjects;

  // Dynamic Database Mapping for Certificates
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: MotorsportCertificateItem[] = rawCerts.map((row, idx) => {
    const title = text(row.title) || "Sertifikat Resmi";
    const issuer = text(row.issuer) || "Lembaga Terakreditasi";
    const certUrl = safeHref(row.certificate_url) || safeHref(row.image_url);

    let desc = text(row.description);
    let category = "Sertifikasi Resmi";
    let isAward = false;

    if (title.toLowerCase().includes("sendikom") || title.toLowerCase().includes("seminar")) {
      category = "Publikasi Ilmiah";
      desc = desc || "Sertifikat Pemakalah dalam Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset komputasi.";
    } else if (title.toLowerCase().includes("peksiminas")) {
      category = "Penghargaan Kompetisi";
      isAward = true;
      desc = desc || "Juara 2 Lomba Perancangan Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa FKIP ULM.";
    } else if (title.toLowerCase().includes("gdsc") || title.toLowerCase().includes("google")) {
      category = "Teknologi Industri";
      desc = desc || "Webinar Nasional Google Developer Student Club (GDSC) x IT FEST mengenai ekosistem cloud dan web modern.";
    } else if (title.toLowerCase().includes("scratch") || title.toLowerCase().includes("sman 1")) {
      category = "Instruktur & Pengabdian";
      desc = desc || "Sertifikat Instruktur Pelatihan Pemrograman Berbasis Visual (Scratch) di SMAN 1 Panyipatan.";
    } else if (title.toLowerCase().includes("lahan basah") || title.toLowerCase().includes("literasi")) {
      category = "Literasi Digital";
      desc = desc || "Sertifikat penerapan TIK untuk kemajuan literasi digital masyarakat lingkungan lahan basah.";
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

  const finalCerts = dbCerts.length > 0 ? dbCerts : defaultMotorsportCertificates;

  // Dynamic Database Mapping for Experiences
  const rawExperiences = bundle?.collections?.experiences?.data || [];
  const dbExperiences: MotorsportExperienceRecord[] = rawExperiences.map((row, idx) => {
    const rawResp = row.responsibilities;
    const responsibilities: string[] = Array.isArray(rawResp)
      ? rawResp.map(String)
      : typeof rawResp === "string"
      ? rawResp.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const startYear = row.start_date ? String(row.start_date).slice(0, 4) : "2024";
    const endYear = row.is_current ? "Sekarang" : (row.end_date ? String(row.end_date).slice(0, 4) : "2025");
    const period = `${startYear} – ${endYear}`;

    return {
      id: text(row.id) || `exp-${idx}`,
      role: text(row.role_title) || "Software Engineer",
      organization: text(row.company) || "Universitas Lambung Mangkurat",
      period,
      location: text(row.location) || "Banjarmasin, Indonesia",
      typeBadge: text(row.experience_type) || "Pengalaman Profesional",
      description: text(row.description) || "Rekam jejak dan kontribusi dalam pengembangan sistem perangkat lunak.",
      responsibilities: responsibilities.length > 0 ? responsibilities : [
        "Pengembangan sistem berbasis web dengan arsitektur modern.",
        "Kolaborasi tim lintas disiplin untuk menghasilkan solusi komputasi berkualitas.",
      ],
    };
  });

  const existingExpRoles = new Set(dbExperiences.map((e) => e.role.toLowerCase()));
  const supplementaryExp = defaultMotorsportExperiences.filter(
    (e) => !existingExpRoles.has(e.role.toLowerCase())
  );
  const finalExperiences =
    dbExperiences.length > 0
      ? [...dbExperiences, ...supplementaryExp]
      : defaultMotorsportExperiences;

  // Dynamic Database Mapping for Skills
  const rawSkills = bundle?.collections?.skills?.data || [];
  const dbSkills: DynamicSkillRecord[] = rawSkills.map((row) => ({
    name: text(row.name) || "Skill",
    category: text(row.category) || undefined,
    description: text(row.description) || undefined,
    level: typeof row.level === "number" ? row.level : undefined,
  }));

  // Dynamic Database Mapping for Articles
  const rawArticles = bundle?.collections?.articles?.data || [];
  const dbArticles: MotorsportArticleItem[] = rawArticles.map((row, idx) => {
    const rawTags = row.tags;
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags.map(String)
      : typeof rawTags === "string"
      ? rawTags.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const contentStr = text(row.content) || "";
    const wordCount = contentStr.split(/\s+/).filter(Boolean).length;
    const readingTime = wordCount > 0 ? `${Math.max(1, Math.ceil(wordCount / 200))} Menit Baca` : "5 Menit Baca";

    return {
      id: text(row.id) || `art-${idx}`,
      slug: text(row.slug) || `article-${idx}`,
      title: text(row.title) || "Artikel Komputasi",
      category: text(row.category) || "Rekayasa Web",
      excerpt: text(row.excerpt) || text(row.summary) || (contentStr ? contentStr.slice(0, 160) + "..." : "Artikel seputar rekayasa perangkat lunak dan komputasi awan."),
      content: contentStr,
      thumbnail_url: safeHref(row.thumbnail_url) || null,
      tags: tags.length > 0 ? tags : ["Tech", "Engineering"],
      created_at: row.created_at ? String(row.created_at).slice(0, 10) : "2026",
      reading_time: readingTime,
    };
  });

  const finalArticles = dbArticles.length > 0 ? dbArticles : defaultMotorsportArticles;

  // Dynamic Social Links
  const rawSocial = bundle?.collections?.social_links?.data || [];
  const dbSocial = rawSocial.map((row) => ({
    platform: text(row.platform) || "Social",
    label: text(row.label) || text(row.platform) || "Link",
    url: safeHref(row.url) || "#",
  }));

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Brand Preloader */}
        <BrandPreloader />

        {/* Custom Precision Cursor */}
        <CustomCursor />

        {/* Action Lime Scroll Progress */}
        <ScrollProgress color="#D1FF00" showPercentage={true} />

        {/* Primary Page Canvas (DESIGN.md: Warm Off-White #F5F5F0) */}
        <div className="relative min-h-screen bg-[#F5F5F0] dark:bg-[#111111] text-[#111111] dark:text-[#F5F5F0] font-sans selection:bg-[#D1FF00] selection:text-[#111111] transition-colors duration-200">
          {/* Header Navigation */}
          <MotorsportNavbar />

          <main id="main">
            {/* 00 // Hero Section (Asymmetric 1:2 Split) */}
            <MotorsportHero
              ownerName={ownerName.toUpperCase()}
              description={profileBio}
              resumeUrl={resumeUrl}
              avatarUrl={avatarUrl}
              projectCount={finalProjects.length}
              certificateCount={finalCerts.length}
            />

            {/* 01 // About Section */}
            <MotorsportAbout
              ownerName={ownerName}
              avatarUrl={avatarUrl}
              stats={{
                projectsCount: finalProjects.length,
                certificatesCount: finalCerts.length,
                gpa: "3.54",
                graduationYear: "2026",
              }}
            />

            {/* 02 // Skills & Specifications */}
            <MotorsportSkills
              groups={motorsportSkillGroups}
              dynamicSkills={dbSkills}
            />

            {/* 03 // Project Gallery (Immersive Dark Charcoal #1A1A1A Surface) */}
            <MotorsportGallery projects={finalProjects} />

            {/* 04 // Experience & Track Record */}
            <MotorsportExperience experiences={finalExperiences} />

            {/* 05 // Certificates & Awards */}
            <MotorsportCertificates certificates={finalCerts} />

            {/* 06 // Research & Articles */}
            <MotorsportResearch articles={finalArticles} />

            {/* 07 // Contact Section (Contained Panel with Lime Border Frame) */}
            <MotorsportContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
              socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
            />
          </main>

          {/* Footer (Contained Panel with Lime Border Frame) */}
          <MotorsportFooter
            ownerName={ownerName}
            socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
          />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}
