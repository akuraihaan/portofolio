"use client";

import React from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { BrandPreloader } from "../motion/BrandPreloader";
import { CustomCursor } from "../motion/CustomCursor";
import { ScrollProgress } from "../motion/ScrollProgress";
import { DottedCanvas } from "../collage";
import { Navigation } from "../layout/Navigation";
import { Hero } from "./Hero";
import { About } from "./About";
import { Playground } from "./Playground";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Certificates } from "./Certificates";
import { Articles } from "./Articles";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

import {
  defaultMotorsportProjects,
  type MotorsportProjectItem,
} from "../motorsport/MotorsportGallery";
import { type DynamicSkillRecord } from "../motorsport/MotorsportSkills";
import {
  defaultMotorsportExperiences,
  type MotorsportExperienceRecord,
} from "../motorsport/MotorsportExperience";
import {
  defaultMotorsportCertificates,
  type MotorsportCertificateItem,
} from "../motorsport/MotorsportCertificates";
import {
  defaultMotorsportArticles,
  type MotorsportArticleItem,
} from "../motorsport/MotorsportResearch";

interface PlaygroundMainProps {
  bundle?: Bundle;
}

export function PlaygroundMain({ bundle }: PlaygroundMainProps) {
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
    "Lulusan Sarjana Pendidikan Komputer Universitas Lambung Mangkurat dan Alumnus Bangkit Academy 2024 (Cloud Computing Capstone Lead). Membangun sistem web interaktif, learning analytics, dan arsitektur cloud.";

  // Projects from Supabase with curated fallback
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
      coverUrl =
        "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png";
      repoUrl = repoUrl || "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind";
    } else if (title.toLowerCase().includes("combridge") || title.toLowerCase().includes("bisindo")) {
      coverUrl =
        "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png";
      repoUrl = repoUrl || "https://github.com/bworiey/combridge-bisindo-cloud";
    }

    return {
      id: text(row.slug) || text(row.id) || `proj-${idx}`,
      number: String(idx + 1).padStart(2, "0"),
      title,
      subtitle: text(row.subtitle) || undefined,
      category: text(row.category) || "Web Development",
      year: row.created_at ? String(row.created_at).slice(0, 4) : "2024",
      role: text(row.role) || "Software Engineer",
      summary: text(row.summary) || text(row.description) || "Studi kasus rekayasa perangkat lunak.",
      description: text(row.description) || text(row.summary) || "Detail arsitektur sistem.",
      technologies: technologies.length > 0 ? technologies : ["Next.js", "TypeScript"],
      cover_url: coverUrl || null,
      thumbnail_url: safeHref(row.thumbnail_url) || coverUrl || null,
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

  const activeProjects = dbProjects.length > 0 ? dbProjects : defaultMotorsportProjects;

  const rawSkills = bundle?.collections?.skills?.data || [];
  const dynamicSkills: DynamicSkillRecord[] = rawSkills.map((row) => ({
    name: text(row.name) || text(row.title) || "Technology",
    category: text(row.category) || "Tools",
    description: text(row.description) || text(row.summary) || undefined,
    level: typeof row.level === "number" ? row.level : undefined,
  }));

  const rawExp = bundle?.collections?.experiences?.data || [];
  const dbExperiences: MotorsportExperienceRecord[] = rawExp.map((row, idx) => {
    const rawResp = row.responsibilities;
    const responsibilities: string[] = Array.isArray(rawResp)
      ? rawResp.map(String)
      : typeof rawResp === "string"
      ? rawResp.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

    const startYear = row.start_date ? String(row.start_date).slice(0, 4) : "";
    const endYear = row.is_current
      ? "Sekarang"
      : row.end_date
      ? String(row.end_date).slice(0, 4)
      : "";
    const period =
      startYear && endYear ? `${startYear} – ${endYear}` : startYear || "2024";

    return {
      id: text(row.id) || `exp-${idx}`,
      role: text(row.role) || text(row.title) || "Software Engineer",
      organization: text(row.organization) || text(row.company) || "Organisasi",
      period,
      location: text(row.location) || "Indonesia",
      typeBadge: text(row.type) || "Pengalaman",
      description: text(row.description) || text(row.summary) || "",
      responsibilities,
    };
  });
  const activeExperiences = dbExperiences.length > 0 ? dbExperiences : defaultMotorsportExperiences;

  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: MotorsportCertificateItem[] = rawCerts.map((row, idx) => ({
    id: text(row.id) || `cert-${idx}`,
    title: text(row.title) || text(row.name) || "Sertifikasi Resmi",
    issuer: text(row.issuer) || text(row.organization) || "Lembaga Sertifikasi",
    issue_date: row.issue_date ? String(row.issue_date).slice(0, 10) : "2024",
    category: text(row.category) || "Sertifikasi",
    certificate_url: safeHref(row.certificate_url) || safeHref(row.image_url) || null,
    credential_url: safeHref(row.credential_url) || null,
    description: text(row.description) || undefined,
  }));
  const activeCerts = dbCerts.length > 0 ? dbCerts : defaultMotorsportCertificates;

  const rawArticles = bundle?.collections?.articles?.data || [];
  const dbArticles: MotorsportArticleItem[] = rawArticles.map((row, idx) => {
    const rawTags = row.tags;
    const tags: string[] = Array.isArray(rawTags)
      ? rawTags.map(String)
      : typeof rawTags === "string"
      ? rawTags.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Riset", "Teknologi"];
    return {
      id: text(row.id) || `art-${idx}`,
      slug: text(row.slug) || `art-${idx}`,
      title: text(row.title) || "Artikel Riset",
      category: text(row.category) || "Publikasi",
      excerpt: text(row.excerpt) || text(row.summary) || "",
      content: text(row.content) || undefined,
      thumbnail_url: safeHref(row.thumbnail_url) || null,
      tags,
      created_at: row.created_at ? String(row.created_at).slice(0, 10) : "2025",
      reading_time: text(row.reading_time) || "5 Menit Baca",
    };
  });
  const activeArticles = dbArticles.length > 0 ? dbArticles : defaultMotorsportArticles;

  return (
    <ThemeProvider>
      <MotionProvider>
        <BrandPreloader />
        <ScrollProgress color="#F05A28" />
        <CustomCursor />
        <DottedCanvas>
          <Navigation />
          <main id="main">
            <Hero
              ownerName={ownerName}
              description={profileBio}
              resumeUrl={resumeUrl}
              avatarUrl={avatarUrl}
              projectCount={activeProjects.length}
              certificateCount={activeCerts.length}
            />
            <About
              ownerName={ownerName}
              stats={{
                projectsCount: activeProjects.length,
                certificatesCount: activeCerts.length,
                gpa: "3.54",
                graduationYear: "2026",
              }}
            />
            <Playground projects={activeProjects} />
            <Skills dynamicSkills={dynamicSkills} />
            <Experience experiences={activeExperiences} />
            <Certificates certificates={activeCerts} />
            <Articles articles={activeArticles} />
            <Contact ownerEmail={ownerEmail} ownerLocation={ownerLocation} />
          </main>
          <Footer ownerName={ownerName} ownerEmail={ownerEmail} />
        </DottedCanvas>
      </MotionProvider>
    </ThemeProvider>
  );
}
