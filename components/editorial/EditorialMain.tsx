"use client";

import { type Bundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ThemeProvider } from "./ThemeContext";
import { MotionProvider } from "../motion/MotionProvider";
import { CursorFollower } from "../motion/CursorFollower";
import { BrandPreloader } from "../motion/BrandPreloader";
import { EditorialNavbar } from "./EditorialNavbar";
import { EditorialHero } from "./EditorialHero";
import { EditorialAbout } from "./EditorialAbout";
import { EditorialSkills, type SkillCategory } from "./EditorialSkills";
import { EditorialProjects, type EditorialProjectItem } from "./EditorialProjects";
import { EditorialExperience, type ExperienceRecord } from "./EditorialExperience";
import { EditorialEducation, type EducationRecord } from "./EditorialEducation";
import { EditorialCertificates, type EditorialCertificateItem } from "./EditorialCertificates";
import { EditorialContact } from "./EditorialContact";
import { EditorialFooter } from "./EditorialFooter";
import { Code2, Server, Cloud, HeartHandshake } from "lucide-react";

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

  // Map database skills if available
  const rawSkills = bundle?.collections?.skills?.data || [];
  let dbSkillCategories: SkillCategory[] | undefined = undefined;

  if (rawSkills.length > 0) {
    const iconMap: Record<string, typeof Code2> = {
      frontend: Code2,
      backend: Server,
      cloud: Cloud,
      tools: Cloud,
      other: HeartHandshake,
    };

    const grouped: Record<string, Array<{ name: string; level: "Advanced" | "Intermediate" | "Familiar"; note: string }>> = {};

    for (const item of rawSkills) {
      const cat = text(item.category) || "General Competencies";
      if (!grouped[cat]) grouped[cat] = [];
      const numLevel = Number(item.level);
      const level: "Advanced" | "Intermediate" | "Familiar" =
        numLevel >= 80 ? "Advanced" : numLevel >= 50 ? "Intermediate" : "Familiar";
      grouped[cat].push({
        name: text(item.name) || "Skill",
        level,
        note: text(item.description) || "Kompetensi terverifikasi",
      });
    }

    dbSkillCategories = Object.entries(grouped).map(([title, skills], idx) => {
      const lower = title.toLowerCase();
      let icon = Code2;
      if (lower.includes("backend") || lower.includes("server") || lower.includes("api")) icon = Server;
      else if (lower.includes("cloud") || lower.includes("devops") || lower.includes("infra")) icon = Cloud;
      else if (lower.includes("soft") || lower.includes("professional") || lower.includes("pedagogi")) icon = HeartHandshake;

      return {
        title,
        categoryNumber: String(idx + 1).padStart(2, "0"),
        icon,
        description: `Kumpulan keahlian dalam bidang ${title} yang diterapkan pada sistem produksi dan riset.`,
        skills,
      };
    });
  }

  // Map database experiences if available
  const rawExp = bundle?.collections?.experiences?.data || [];
  const dbExperiences: ExperienceRecord[] = rawExp.map((row, idx) => {
    const rawResp = row.responsibilities;
    const responsibilities: string[] = Array.isArray(rawResp)
      ? rawResp.map(String)
      : typeof rawResp === "string"
      ? rawResp.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const startDate = row.start_date ? String(row.start_date).slice(0, 7) : "2024";
    const endDate = row.is_current ? "Present" : row.end_date ? String(row.end_date).slice(0, 7) : "";
    const period = endDate ? `${startDate} – ${endDate}` : startDate;

    return {
      id: text(row.id) || `exp-${idx}`,
      role: text(row.role_title) || "Role",
      organization: text(row.company) || "Organisasi",
      period,
      location: text(row.location) || "Banjarmasin, Indonesia",
      typeBadge: text(row.experience_type) || "Pengalaman",
      description: text(row.description) || "",
      responsibilities: responsibilities.length > 0 ? responsibilities : ["Pengembangan & implementasi teknis"],
    };
  });

  // Map database education if available
  const rawEdu = bundle?.collections?.educations?.data || [];
  let dbEducation: EducationRecord | undefined = undefined;
  if (rawEdu.length > 0) {
    const firstEdu = rawEdu[0];
    dbEducation = {
      institution: text(firstEdu.institution) || undefined,
      degree: text(firstEdu.degree) || undefined,
      field_of_study: text(firstEdu.field_of_study) || undefined,
      location: text(firstEdu.location) || undefined,
      period: firstEdu.start_date ? `${String(firstEdu.start_date).slice(0, 4)} – ${firstEdu.end_date ? String(firstEdu.end_date).slice(0, 4) : "2026"}` : undefined,
      gpa: text(firstEdu.description)?.includes("GPA") ? text(firstEdu.description) : undefined,
    };
  }

  // Map database social links if available
  const rawSocial = bundle?.collections?.social_links?.data || [];
  const dbSocial = rawSocial.map((row) => ({
    platform: text(row.platform) || "Social",
    label: text(row.label) || text(row.platform) || "Link",
    url: safeHref(row.url) || "#",
  }));

  return (
    <ThemeProvider>
      <MotionProvider>
        {/* Brand Bumper Preloader & Magnetic Custom Cursor */}
        <BrandPreloader />
        <CursorFollower />

        <div className="relative min-h-screen bg-[#F4F3EE] dark:bg-[#111310] text-[#171816] dark:text-[#F4F3EE] font-sans selection:bg-[#C8F169] selection:text-[#171816] transition-colors duration-300">
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
            <EditorialAbout
              avatarUrl={avatarUrl}
              ownerName={ownerName}
              stats={{
                projectsCount: dbProjects.length > 0 ? dbProjects.length : 6,
                certificatesCount: dbCerts.length > 0 ? dbCerts.length : 6,
                gpa: "3.54",
                graduationYear: "2026",
              }}
            />

            {/* D. Skills Section (02 / SKILLS) */}
            <EditorialSkills
              initialCategories={dbSkillCategories}
            />

            {/* E. Featured Projects (03 / SELECTED WORKS) */}
            <EditorialProjects
              initialProjects={dbProjects.length > 0 ? dbProjects : undefined}
            />

            {/* F. Experience Section (04 / EXPERIENCE) */}
            <EditorialExperience
              initialExperiences={dbExperiences.length > 0 ? dbExperiences : undefined}
            />

            {/* G. Education Section (05 / EDUCATION) */}
            <EditorialEducation
              initialEducation={dbEducation}
            />

            {/* H. Certificates & Achievements (06 / AWARDS & CREDENTIALS) */}
            <EditorialCertificates
              initialCertificates={dbCerts.length > 0 ? dbCerts : undefined}
            />

            {/* I. Contact Section (07 / CONTACT) */}
            <EditorialContact
              ownerEmail={ownerEmail}
              ownerLocation={ownerLocation}
              ownerName={ownerName}
              socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
            />
          </main>

          {/* J. Footer */}
          <EditorialFooter
            ownerName={ownerName}
            socialLinks={dbSocial.length > 0 ? dbSocial : undefined}
          />
        </div>
      </MotionProvider>
    </ThemeProvider>
  );
}

