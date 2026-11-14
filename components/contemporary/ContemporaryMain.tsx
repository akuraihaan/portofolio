"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { BrandPreloader } from "../motion/BrandPreloader";
import { ContemporaryNavbar } from "./ContemporaryNavbar";
import { ContemporaryHero } from "./ContemporaryHero";
import { ContemporaryAbout } from "./ContemporaryAbout";
import { ContemporarySkills, contemporarySkillGroups } from "./ContemporarySkills";
import {
  ContemporaryProjects,
  type ContemporaryProjectItem,
  defaultContemporaryProjects,
} from "./ContemporaryProjects";
import {
  ContemporaryExperience,
  type ContemporaryExperienceRecord,
  defaultContemporaryExperiences,
} from "./ContemporaryExperience";
import { ContemporaryEducation, type ContemporaryEducationRecord } from "./ContemporaryEducation";
import {
  ContemporaryCertificates,
  type ContemporaryCertificateItem,
  defaultContemporaryCertificates,
} from "./ContemporaryCertificates";
import {
  ContemporaryArticles,
  type ContemporaryArticleItem,
  defaultContemporaryArticles,
} from "./ContemporaryArticles";
import { ContemporaryContact } from "./ContemporaryContact";
import { ContemporaryFooter } from "./ContemporaryFooter";

interface ContemporaryMainProps {
  bundle?: Bundle;
}

export function ContemporaryMain({ bundle }: ContemporaryMainProps) {
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
    "Pengembang web dengan latar belakang Pendidikan Komputer yang berfokus pada pengembangan aplikasi web, teknologi pendidikan, dan pengalaman digital interaktif.";

  // Dynamic Database Mapping for Projects
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: ContemporaryProjectItem[] = rawProjects.map((row, idx) => {
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

  const finalProjects = dbProjects.length >= 4 ? dbProjects : defaultContemporaryProjects;

  // Dynamic Database Mapping for Articles
  const rawArticles = bundle?.collections?.articles?.data || [];
  const dbArticles: ContemporaryArticleItem[] = rawArticles.map((row, idx) => {
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

  const finalArticles = dbArticles.length > 0 ? dbArticles : defaultContemporaryArticles;

  // Dynamic Database Mapping for Certificates
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: ContemporaryCertificateItem[] = rawCerts.map((row, idx) => {
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

  const finalCerts = dbCerts.length > 0 ? dbCerts : defaultContemporaryCertificates;

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
        {/* Initial Brand Experience */}
        <BrandPreloader />

        <div className="relative min-h-screen bg-[#F8F8F6] dark:bg-[#0B0B0C] text-[#121214] dark:text-[#F4F4F6] font-sans selection:bg-[#2563EB] selection:text-white dark:selection:bg-[#C8F169] dark:selection:text-[#121214] transition-colors duration-200">
          {/* Navigation Bar */}
          <ContemporaryNavbar />

          <main id="main">
            {/* 00 / Beranda & Hero */}
            <ContemporaryHero
              ownerName={ownerName.toUpperCase()}
              description={profileBio}
              resumeUrl={resumeUrl}
            />

            {/* 01 / Tentang Saya */}
            <ContemporaryAbout
              ownerName={ownerName}
              avatarUrl={avatarUrl}
              stats={{
                projectsCount: finalProjects.length,
                certificatesCount: finalCerts.length,
                gpa: "3.54",
                graduationYear: "2026",
              }}
            />

            {/* 02 / Keahlian & Spesifikasi Teknologi */}
            <ContemporarySkills groups={contemporarySkillGroups} />

            {/* 03 / Proyek Rekayasa & Karya Pilihan */}
            <ContemporaryProjects projects={finalProjects} />

            {/* 04 / Pengalaman & Rekam Jejak */}
            <ContemporaryExperience experiences={defaultContemporaryExperiences} />

            {/* 05 / Pendidikan & Riset Akademik */}
            <ContemporaryEducation />

            {/* 06 / Sertifikasi & Penghargaan */}
            <ContemporaryCertificates certificates={finalCerts} />

            {/* 07 / Artikel & Basis Pengetahuan */}
            <ContemporaryArticles articles={finalArticles} />

            {/* 08 / Kontak & Kolaborasi */}
            <ContemporaryContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
              socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
            />
          </main>

          {/* Footer */}
          <ContemporaryFooter
            ownerName={ownerName}
            socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
          />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}
