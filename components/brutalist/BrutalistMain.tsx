"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import {
  MotionProvider,
  CustomCursor,
  SmoothScrollProvider,
  NoiseOverlay,
  ScrollProgress,
} from "../motion";
import { BrandPreloader } from "../motion/BrandPreloader";
import { BrutalistNavbar } from "./BrutalistNavbar";
import { BrutalistHero } from "./BrutalistHero";
import { BrutalistAbout } from "./BrutalistAbout";
import {
  BrutalistProjects,
  type BrutalistProjectItem,
  defaultBrutalistProjects,
} from "./BrutalistProjects";
import { BrutalistSkills } from "./BrutalistSkills";
import {
  BrutalistExperienceEducation,
  type ExperienceItem,
  type EducationItem,
} from "./BrutalistExperienceEducation";
import {
  BrutalistCertificates,
  type BrutalistCertificateItem,
  defaultBrutalistCertificates,
} from "./BrutalistCertificates";
import { BrutalistContact } from "./BrutalistContact";
import { BrutalistFooter } from "./BrutalistFooter";
import type { NavLinkItem } from "./BrutalistNavbar";

interface BrutalistMainProps {
  bundle?: Bundle;
}

export function BrutalistMain({ bundle }: BrutalistMainProps) {
  // Extract profile & settings from dynamic Supabase bundle
  const ownerName =
    text(bundle?.profile?.full_name) ||
    text(bundle?.settings?.owner_name) ||
    "Taufik Raihandani";

  const ownerEmail =
    text(bundle?.settings?.owner_email) || "raihan@bworiey.my.id";

  const resumeUrl =
    safeHref(bundle?.settings?.resume_url) ||
    "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf";

  const avatarUrl =
    safeHref(bundle?.profile?.avatar_url) ||
    safeHref(bundle?.settings?.hero_image_url) ||
    null;

  // Dynamic Database Mapping for Projects
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: BrutalistProjectItem[] = rawProjects.map((row, idx) => {
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
    } else if (title.toLowerCase().includes("webgis") || title.toLowerCase().includes("pemetaan")) {
      repoUrl = repoUrl || "https://github.com/bworiey/webgis-pemetaan-sekolah-banjarmasin";
    }

    return {
      id: text(row.id) || `proj-${idx}`,
      number: String(idx + 1).padStart(2, "0"),
      title,
      subtitle: text(row.subtitle) || (idx === 0 ? "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar" : undefined),
      category: text(row.category) || (idx === 1 ? "Cloud & Machine Learning" : "Teknologi Pendidikan"),
      year: row.created_at ? String(row.created_at).slice(0, 4) : "2024",
      role: text(row.role) || "Software Engineer",
      summary: text(row.summary) || text(row.description) || "Pengembangan sistem berbasis web dengan arsitektur modern.",
      description: text(row.description) || text(row.summary) || "Proyek rekayasa perangkat lunak terstruktur.",
      technologies: technologies.length > 0 ? technologies : ["Next.js", "TypeScript", "Tailwind CSS"],
      cover_url: coverUrl || null,
      thumbnail_url: coverUrl || null,
      project_url: safeHref(row.project_url) || null,
      repository_url: repoUrl || null,
      is_featured: idx < 2,
      case_study: {
        background: caseStudy?.background || undefined,
        features: caseStudy?.features || undefined,
        contribution: caseStudy?.contribution || undefined,
        outcome: caseStudy?.outcome || undefined,
        process: caseStudy?.process || undefined,
      },
    };
  });

  const finalProjects = dbProjects.length >= 8 ? dbProjects : defaultBrutalistProjects;

  // Dynamic Database Mapping for Certificates
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: BrutalistCertificateItem[] = rawCerts.map((row, idx) => {
    const title = text(row.title) || "Sertifikat Resmi";
    const issuer = text(row.issuer) || "Lembaga Terakreditasi";
    const certUrl = safeHref(row.certificate_url) || safeHref(row.image_url);

    let desc = text(row.description);
    let category = "Sertifikasi Resmi";
    let isAward = false;

    if (title.toLowerCase().includes("sendikom") || title.toLowerCase().includes("seminar")) {
      category = "Publikasi Ilmiah";
      isAward = true;
      desc = desc || "Sertifikat Pemakalah dalam Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset komputasi.";
    } else if (title.toLowerCase().includes("peksiminas")) {
      category = "Penghargaan Kompetisi";
      isAward = true;
      desc = desc || "Juara 2 Lomba Perancangan Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa FKIP ULM.";
    } else if (title.toLowerCase().includes("google") || title.toLowerCase().includes("bangkit")) {
      category = "Teknologi Industri";
      isAward = true;
      desc = desc || "Sertifikat kelulusan program studi independen jalur Google Cloud Computing dengan predikat Distinction.";
    } else if (title.toLowerCase().includes("scratch") || title.toLowerCase().includes("sman 1")) {
      category = "Instruktur & Pengabdian";
      desc = desc || "Sertifikat Instruktur Pelatihan Pemrograman Berbasis Visual (Scratch) di SMAN 1 Panyipatan.";
    } else if (title.toLowerCase().includes("lahan basah") || title.toLowerCase().includes("literasi")) {
      category = "Literasi Digital";
      desc = desc || "Sertifikat penerapan TIK untuk kemajuan literasi digital masyarakat lingkungan lahan basah.";
    } else if (title.toLowerCase().includes("gdsc")) {
      category = "Teknologi Industri";
      desc = desc || "Webinar Nasional Google Developer Student Club (GDSC) x IT FEST mengenai ekosistem cloud.";
    }

    return {
      id: text(row.id) || `cert-${idx}`,
      title,
      issuer,
      issue_date: row.issue_date ? String(row.issue_date).slice(0, 4) : "2024",
      category,
      isAward,
      certificate_url: certUrl || null,
      credential_url: certUrl || safeHref(row.credential_url) || null,
      description: desc,
    };
  });

  const finalCertificates = dbCerts.length >= 6 ? dbCerts : defaultBrutalistCertificates;

  // Dynamic Database Mapping for Navigation
  const rawNav = bundle?.collections?.navigation?.data || [];
  const navigationItems: NavLinkItem[] | undefined =
    rawNav.length > 0
      ? rawNav.map((row, idx) => ({
          num: String(idx + 1).padStart(2, "0"),
          name: text(row.label).toUpperCase(),
          href: safeHref(row.href) || "#",
        }))
      : undefined;

  // Dynamic Database Mapping for Sections
  const rawSections = bundle?.collections?.sections?.data || [];
  const heroSection = rawSections.find((s) => text(s.section_key) === "hero");
  const aboutSection = rawSections.find((s) => text(s.section_key) === "about");
  const contactSection = rawSections.find((s) => text(s.section_key) === "contact");

  const availabilityStatus =
    text(bundle?.settings?.availability_status) ||
    text(heroSection?.badge_text) ||
    "AVAILABLE FOR PROJECTS";

  const brandName = text(bundle?.settings?.site_name) || "BWORIEY";

  // Dynamic Database Mapping for Skills
  const rawSkills = bundle?.collections?.skills?.data || [];
  const dynamicSkills =
    rawSkills.length > 0
      ? rawSkills.map((row) => ({
          name: text(row.name) || "Keahlian",
          category: text(row.category) || undefined,
          level: typeof row.level === "number" || typeof row.level === "string" ? row.level : undefined,
          description: text(row.description) || undefined,
        }))
      : undefined;

  // Dynamic Database Mapping for Experiences
  const rawExperiences = bundle?.collections?.experiences?.data || [];
  const badgePalette = [
    "bg-[#0047FF] text-white",
    "bg-[#FFE500] text-black",
    "bg-[#FF5C00] text-white",
    "bg-[#C8F169] text-black",
  ];
  const dynamicExperiences: ExperienceItem[] | undefined =
    rawExperiences.length > 0
      ? rawExperiences.map((row, idx) => {
          const resp = Array.isArray(row.responsibilities)
            ? row.responsibilities.map(String)
            : typeof row.responsibilities === "string"
            ? row.responsibilities.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
            : [];
          const ach = Array.isArray(row.achievements)
            ? row.achievements.map(String)
            : typeof row.achievements === "string"
            ? row.achievements.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
            : [];

          const highlights = ach.length > 0 ? ach : resp;
          const startDate = row.start_date ? String(row.start_date).slice(0, 4) : "";
          const endDate = row.is_current ? "Sekarang" : row.end_date ? String(row.end_date).slice(0, 4) : "";
          const period = startDate && endDate ? `${startDate} — ${endDate}` : startDate || endDate || "2024";

          return {
            id: text(row.id) || `exp-${idx}`,
            role: text(row.role_title) || "Software Engineer",
            company: text(row.company) || "Organisasi / Perusahaan",
            period,
            location: text(row.location) || "Indonesia",
            type: text(row.experience_type) || "Program Profesional",
            description: text(row.description) || "Rekayasa perangkat lunak dan manajemen sistem digital.",
            highlights: highlights.length > 0 ? highlights : ["Membangun dan memelihara sistem digital berkinerja tinggi."],
            badgeColor: badgePalette[idx % badgePalette.length],
          };
        })
      : undefined;

  // Dynamic Database Mapping for Education
  const rawEducations = bundle?.collections?.educations?.data || [];
  const primaryEdu = rawEducations[0];
  const dynamicEducation: EducationItem | undefined = primaryEdu
    ? {
        institution: text(primaryEdu.institution) || "Universitas Lambung Mangkurat",
        degree: text(primaryEdu.degree) || "S1 Pendidikan Komputer",
        period: primaryEdu.start_date
          ? `${String(primaryEdu.start_date).slice(0, 4)} — ${primaryEdu.is_current ? "Sekarang" : primaryEdu.end_date ? String(primaryEdu.end_date).slice(0, 4) : "2026"}`
          : "2020 — 2026",
        gpa: "3.54 / 4.00 (Sangat Memuaskan)",
        focus: text(primaryEdu.field_of_study) || "Rekayasa Perangkat Lunak Web & Media Pembelajaran Interaktif",
        thesis: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
        highlights: Array.isArray(primaryEdu.related_achievements)
          ? primaryEdu.related_achievements.map(String)
          : [
              "Konsentrasi keahlian pada rekayasa web frontend modern dan integrasi basis data awan.",
              "Skripsi berhasil diuji dan dinyatakan lulus dengan nilai memuaskan.",
              "Aktif dalam organisasi kepengurusan mahasiswa teknologi dan asisten laboratorium.",
            ],
      }
    : undefined;

  // Dynamic Social Links
  const rawSocial = bundle?.collections?.social_links?.data || [];
  const githubRow = rawSocial.find((s) => text(s.platform).toLowerCase().includes("github"));
  const linkedinRow = rawSocial.find((s) => text(s.platform).toLowerCase().includes("linkedin"));
  const instagramRow = rawSocial.find((s) => text(s.platform).toLowerCase().includes("instagram"));

  const githubUrl = safeHref(githubRow?.url) || "https://github.com/akuraihaan";
  const linkedinUrl = safeHref(linkedinRow?.url) || "https://linkedin.com/in/taufik-raihandani";
  const instagramUrl = safeHref(instagramRow?.url) || "https://instagram.com/bworiey";

  // Bio Paragraphs for About Section
  const rawBio = text(bundle?.profile?.bio) || text(aboutSection?.description);
  const bioParagraphs = rawBio ? rawBio.split(/\n\n+/).filter(Boolean) : undefined;

  const enableCursor = bundle?.settings?.enable_cursor !== false;

  return (
    <ThemeProvider>
      <MotionProvider>
        <SmoothScrollProvider>
          {/* Subtle Grain Texture Overlay */}
          <NoiseOverlay />

          {/* Sticky Reading & Scroll Progress Indicator */}
          <ScrollProgress />

          {/* Animated Brand Preloader Bumper */}
          <BrandPreloader />

          {/* Custom Cursor with Trailing Physics & Dynamic Context */}
          {enableCursor && <CustomCursor />}

          <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] font-sans selection:bg-[#FFE500] selection:text-black">
            {/* Main Neo-Brutalist Sticky Navbar */}
            <BrutalistNavbar
              navigationItems={navigationItems}
              ownerName={ownerName}
              availabilityStatus={availabilityStatus}
            />

            <main id="main" tabIndex={-1}>
              {/* 01. Hero Section */}
              <BrutalistHero
                ownerName={ownerName}
                resumeUrl={resumeUrl}
                headline={text(heroSection?.title) || undefined}
                subheadline={text(heroSection?.description) || undefined}
                badgeText={text(heroSection?.badge_text) || undefined}
                availabilityStatus={availabilityStatus}
                primaryButtonLabel={text(heroSection?.primary_button_label) || undefined}
                primaryButtonUrl={safeHref(heroSection?.primary_button_url) || undefined}
                secondaryButtonLabel={text(heroSection?.secondary_button_label) || undefined}
                secondaryButtonUrl={safeHref(heroSection?.secondary_button_url) || undefined}
              />

              {/* 02. About Section (Max 3 Sentences, Asymmetric Grid) */}
              <BrutalistAbout
                avatarUrl={avatarUrl}
                bioParagraphs={bioParagraphs}
                ownerName={ownerName}
              />

              {/* 03. Project Archive Section (Varied Preview Sizes, Real-time Search, Case Study Modal) */}
              <BrutalistProjects projects={finalProjects} />

              {/* 04. Experimental Skills Section (No Progress Bars, Visual Grouping) */}
              <BrutalistSkills dynamicSkills={dynamicSkills} />

              {/* 05. Experience & Education Section (Concise Timeline, Bangkit & ULM) */}
              <BrutalistExperienceEducation
                experiences={dynamicExperiences}
                education={dynamicEducation}
              />

              {/* 06. Certificate Archive Section (Visual Gallery, Inspection Modal) */}
              <BrutalistCertificates certificates={finalCertificates} />

              {/* 07. Contact Section (GOT SOMETHING INTERESTING?, Live Form to Supabase API) */}
              <BrutalistContact
                email={ownerEmail}
                githubUrl={githubUrl}
                linkedinUrl={linkedinUrl}
                instagramUrl={instagramUrl}
                title={text(contactSection?.title) || undefined}
                description={text(contactSection?.description) || undefined}
              />
            </main>

            {/* 08. Footer Section (Oversized Display Typography, Geolocation, Availability) */}
            <BrutalistFooter
              ownerName={ownerName}
              brandName={brandName}
              availabilityStatus={availabilityStatus}
            />
          </div>
        </SmoothScrollProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}
