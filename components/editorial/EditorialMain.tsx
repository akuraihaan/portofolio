"use client";

import { type Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "./ThemeContext";
import { EditorialNavbar } from "./EditorialNavbar";
import { EditorialHero } from "./EditorialHero";
import { EditorialAbout } from "./EditorialAbout";
import { EditorialSkills } from "./EditorialSkills";
import { EditorialProjects, type EditorialProjectItem } from "./EditorialProjects";
import { EditorialExperience } from "./EditorialExperience";
import { EditorialEducation } from "./EditorialEducation";
import { EditorialCertificates, type EditorialCertificateItem } from "./EditorialCertificates";
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

  // Map database projects if available
  const rawProjects = bundle?.collections?.projects?.data || [];
  const dbProjects: EditorialProjectItem[] = rawProjects.map((row, idx) => {
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

  // Map database certificates if available
  const rawCerts = bundle?.collections?.certificates?.data || [];
  const dbCerts: EditorialCertificateItem[] = rawCerts.map((row, idx) => {
    return {
      id: text(row.id) || `cert-${idx}`,
      title: text(row.title) || "Sertifikat",
      issuer: text(row.issuer) || "Penyelenggara",
      issue_date: row.issue_date ? String(row.issue_date).slice(0, 10) : "2024",
      certificate_url: safeHref(row.certificate_url) || safeHref(row.image_url) || null,
      credential_url: safeHref(row.credential_url) || safeHref(row.certificate_url) || null,
      description: text(row.description) || undefined,
      isAward: text(row.title)?.toLowerCase().includes("juara") || text(row.title)?.toLowerCase().includes("place"),
    };
  });

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-[#faf8f5] dark:bg-[#0c0d10] text-charcoal dark:text-dark-text font-sans selection:bg-forest dark:selection:bg-lime selection:text-white dark:selection:text-charcoal transition-colors duration-300">
        {/* Navigation */}
        <EditorialNavbar />

        {/* Main Content Sections */}
        <main id="main">
          {/* B. Hero Section */}
          <EditorialHero
            name={ownerName}
            avatarUrl={avatarUrl}
            resumeUrl={resumeUrl}
          />

          {/* C. About Section (01 / ABOUT) */}
          <EditorialAbout />

          {/* D. Skills Section (02 / SKILLS) */}
          <EditorialSkills />

          {/* E. Featured Projects (03 / SELECTED WORKS) */}
          <EditorialProjects
            initialProjects={dbProjects.length > 0 ? dbProjects : undefined}
          />

          {/* F. Experience Section (04 / EXPERIENCE) */}
          <EditorialExperience />

          {/* G. Education Section (05 / EDUCATION) */}
          <EditorialEducation />

          {/* H. Certificates & Achievements (06 / AWARDS & CREDENTIALS) */}
          <EditorialCertificates
            initialCertificates={dbCerts.length > 0 ? dbCerts : undefined}
          />

          {/* I. Contact Section (07 / CONTACT) */}
          <EditorialContact
            ownerEmail={ownerEmail}
            ownerLocation={ownerLocation}
            ownerName={ownerName}
          />
        </main>

        {/* J. Footer */}
        <EditorialFooter ownerName={ownerName} />
      </div>
    </ThemeProvider>
  );
}

