"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "./ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { BrandPreloader } from "../motion/BrandPreloader";
import { EditorialNavbar } from "./EditorialNavbar";
import { EditorialHero } from "./EditorialHero";
import { EditorialAbout } from "./EditorialAbout";
import { EditorialSkills, defaultSkillCategories } from "./EditorialSkills";
import { EditorialProjects, type EditorialProjectItem, defaultProjects } from "./EditorialProjects";
import { EditorialExperience, type ExperienceRecord, defaultExperiences } from "./EditorialExperience";
import { EditorialEducation, type EducationRecord } from "./EditorialEducation";
import { EditorialCertificates, type EditorialCertificateItem, defaultCertificates } from "./EditorialCertificates";
import { EditorialContact } from "./EditorialContact";
import { EditorialFooter } from "./EditorialFooter";

interface EditorialMainProps {
  bundle?: Bundle;
}

export function EditorialMain({ bundle }: EditorialMainProps) {
  // Extract profile & settings
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

  // Map Database Projects with Enrichments
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: EditorialProjectItem[] = rawProjects.map((row, idx) => {
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

  const mergedProjects = dbProjects.length >= 4 ? dbProjects : defaultProjects;

  // Map Database Certificates with Enrichments
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: EditorialCertificateItem[] = rawCerts.map((row, idx) => {
    const title = text(row.title) || "Sertifikat";
    const issuer = text(row.issuer) || "Lembaga Resmi";
    const certUrl = safeHref(row.certificate_url) || safeHref(row.image_url);

    let desc = text(row.description);
    let category = "Sertifikasi Resmi";
    let isAward = false;

    if (title.toLowerCase().includes("sendikom") || title.toLowerCase().includes("seminar")) {
      category = "Publikasi Ilmiah";
      desc = desc || "Sertifikat Pemakalah / Peserta Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset teknologi komputasi.";
    } else if (title.toLowerCase().includes("peksiminas")) {
      category = "Penghargaan Kompetisi";
      isAward = true;
      desc = desc || "Juara 2 Lomba Perancangan Desain Media Kampanye Sosial pada Pekan Seni Mahasiswa FKIP ULM.";
    } else if (title.toLowerCase().includes("gdsc") || title.toLowerCase().includes("google")) {
      category = "Teknologi Industri";
      desc = desc || "Webinar Nasional Google Developer Student Club (GDSC) x IT FEST mengenai ekosistem cloud dan web engineering.";
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

  const mergedCerts = dbCerts.length > 0 ? dbCerts : defaultCertificates;

  // Map Database Social Links
  const rawSocial = bundle?.collections?.social_links?.data || [];
  const dbSocial = rawSocial.map((row) => ({
    platform: text(row.platform) || "Social",
    label: text(row.label) || text(row.platform) || "Link",
    url: safeHref(row.url) || "#",
  }));

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Initial Experience: BWORIEY Brand Bumper */}
        <BrandPreloader />

        <div className="relative min-h-screen bg-[#FFFFFF] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] font-sans selection:bg-[#1D1D1F] selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
          {/* Apple-Inspired Frosted Navbar */}
          <EditorialNavbar />

          <main id="main">
            {/* Hero Section */}
            <EditorialHero
              name={ownerName}
              avatarUrl={avatarUrl}
              resumeUrl={resumeUrl}
            />

            {/* 01 / About Section */}
            <EditorialAbout
              avatarUrl={avatarUrl}
              ownerName={ownerName}
              stats={{
                projectsCount: mergedProjects.length,
                certificatesCount: mergedCerts.length,
                gpa: "3.54",
                graduationYear: "2026",
              }}
            />

            {/* 02 / Skills & Tech Specs */}
            <EditorialSkills categories={defaultSkillCategories} />

            {/* 03 / Selected Works & Artifacts */}
            <EditorialProjects projects={mergedProjects} />

            {/* 04 / Experience Timeline */}
            <EditorialExperience experiences={defaultExperiences} />

            {/* 05 / Academic Foundation & Research */}
            <EditorialEducation />

            {/* 06 / Verified Credentials & Honors */}
            <EditorialCertificates certificates={mergedCerts} />

            {/* 07 / Direct Inquiries & Contact */}
            <EditorialContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
              socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
            />
          </main>

          {/* Footer */}
          <EditorialFooter
            ownerName={ownerName}
            socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
          />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}
