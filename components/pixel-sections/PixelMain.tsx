"use client";

import React, { useState } from "react";
import type { Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "../editorial/ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { CursorFollower } from "../motion/CursorFollower";
import { PixelPreloader } from "../pixel3d/PixelPreloader";
import { PixelGridBackdrop } from "../pixel3d/PixelGridBackdrop";
import { ScrollProgress } from "../pixel3d/ScrollProgress";
import { PixelNavbar } from "./PixelNavbar";
import { PixelHero } from "./PixelHero";
import { PixelAbout } from "./PixelAbout";
import { PixelSkills, type SkillCategory } from "./PixelSkills";
import { PixelProjects, type ProjectItem } from "./PixelProjects";
import { PixelExperience, type ExperienceRecord } from "./PixelExperience";
import { PixelEducation, type EducationRecord } from "./PixelEducation";
import { PixelCertificates, type CertificateItem } from "./PixelCertificates";
import { PixelContact } from "./PixelContact";
import { PixelFooter } from "./PixelFooter";
import { Code2, Server, Cloud, BookOpen } from "lucide-react";

interface PixelMainProps {
  bundle?: Bundle;
}

export function PixelMain({ bundle }: PixelMainProps) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Extract Profile & Settings
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

  const resumeUrl = safeHref(bundle?.settings?.resume_url) || "#contact";

  const avatarUrl =
    safeHref(bundle?.profile?.avatar_url) ||
    safeHref(bundle?.settings?.hero_image_url) ||
    null;

  // Map Database Projects if available
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: ProjectItem[] = rawProjects.map((row, idx) => {
    const rawTech = row.technologies;
    const technologies: string[] = Array.isArray(rawTech)
      ? rawTech.map(String)
      : typeof rawTech === "string"
      ? rawTech.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const caseStudy = row.case_study as Record<string, string> | undefined;

    return {
      id: text(row.id) || `proj-${idx}`,
      number: String(idx + 1).padStart(2, "0"),
      title: text(row.title) || "Proyek Digital",
      category: text(row.category) || "Web Development",
      year: row.created_at ? String(row.created_at).slice(0, 4) : "2024",
      role: text(row.role) || "Developer",
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

  // Map Database Certificates if available
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: CertificateItem[] = rawCerts.map((row, idx) => {
    return {
      id: text(row.id) || `cert-${idx}`,
      title: text(row.title) || "Sertifikat",
      issuer: text(row.issuer) || "Penyelenggara",
      issue_date: row.issue_date ? String(row.issue_date).slice(0, 10) : "2024",
      certificate_url: safeHref(row.certificate_url) || safeHref(row.image_url) || null,
      credential_url: safeHref(row.credential_url) || safeHref(row.certificate_url) || null,
      description: text(row.description) || undefined,
      isAward:
        text(row.title)?.toLowerCase().includes("juara") ||
        text(row.title)?.toLowerCase().includes("place"),
    };
  });

  // Map Database Skills if available
  const rawSkills = bundle?.collections?.skills?.data || [];
  let dbSkillCategories: SkillCategory[] | undefined = undefined;
  if (rawSkills.length > 0) {
    const groupMap = new Map<string, Array<{ name: string; level: "PROD" | "EXPERT" | "CORE"; desc: string }>>();
    rawSkills.forEach((s) => {
      const cat = text(s.category) || "Core Engineering";
      if (!groupMap.has(cat)) groupMap.set(cat, []);
      groupMap.get(cat)!.push({
        name: text(s.name) || "Skill",
        level: (s.level === "expert" ? "EXPERT" : s.level === "master" ? "PROD" : "CORE") as "PROD" | "EXPERT" | "CORE",
        desc: text(s.description) || "Kemampuan teknis teruji dalam proyek nyata",
      });
    });

    dbSkillCategories = Array.from(groupMap.entries()).map(([catName, list], idx) => ({
      id: `cat-${idx}`,
      name: catName,
      code: String(idx + 1).padStart(2, "0"),
      icon: idx === 0 ? Code2 : idx === 1 ? Server : idx === 2 ? Cloud : BookOpen,
      skills: list,
    }));
  }

  // Map Database Experiences if available
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
      role: text(row.position) || text(row.role) || "Software Engineer",
      organization: text(row.company) || text(row.organization) || "Perusahaan",
      location: text(row.location) || undefined,
      start_date: row.start_date ? String(row.start_date).slice(0, 7) : "2023",
      end_date: row.end_date ? String(row.end_date).slice(0, 7) : null,
      description: text(row.description) || undefined,
      highlights: highlights.length > 0 ? highlights : undefined,
      type: text(row.type) || "Pengalaman",
    };
  });

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Pixel Opening Sequence */}
        <PixelPreloader onComplete={() => setPreloaderDone(true)} />

        {/* Global Motion Cursor Follower */}
        <CursorFollower />

        {/* Isometric Grid Backdrop & HUD Coordinates */}
        <PixelGridBackdrop />

        {/* Scroll Depth HUD */}
        <ScrollProgress />

        {/* Main Digital World Container */}
        <div className="relative min-h-screen text-[#171816] dark:text-[#F4F3EE] transition-colors duration-200">
          <PixelNavbar />

          <main id="main">
            <PixelHero
              ownerName={ownerName}
              description={text(bundle?.profile?.bio) || undefined}
              resumeUrl={resumeUrl}
            />

            <PixelAbout
              ownerName={ownerName}
              avatarUrl={avatarUrl}
              bio={text(bundle?.profile?.bio) || undefined}
            />

            <PixelSkills
              categories={dbSkillCategories && dbSkillCategories.length > 0 ? dbSkillCategories : undefined}
            />

            <PixelProjects
              projects={dbProjects.length > 0 ? dbProjects : undefined}
            />

            <PixelExperience
              experiences={dbExperiences.length > 0 ? dbExperiences : undefined}
            />

            <PixelEducation />

            <PixelCertificates
              certificates={dbCerts.length > 0 ? dbCerts : undefined}
            />

            <PixelContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
            />
          </main>

          <PixelFooter />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}

