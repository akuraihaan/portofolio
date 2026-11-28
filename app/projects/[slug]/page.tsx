import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicBundle, origin } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ArrowLeft, ExternalLink, ArrowUpRight, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/space/SocialIcons";
import { ProjectImageViewer } from "@/components/projects/ProjectImageViewer";
import { CaseStudyBlockRenderer } from "@/components/projects/CaseStudyBlockRenderer";
import { normalizeCaseStudyBlocks } from "@/lib/case-study-blocks";
import { ThemeProvider } from "@/components/editorial/ThemeContext";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { PageTransition } from "@/components/motion/PageTransition";
import { DottedCanvas, InfoCard, TextCard } from "@/components/collage";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/sections/Footer";
import {
  defaultMotorsportProjects,
  type MotorsportProjectItem,
} from "@/components/motorsport/MotorsportGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPublicBundle();
  const rawProjects = bundle.collections.projects?.data || [];

  const found =
    rawProjects.find((p) => p.slug === slug || p.id === slug) ||
    defaultMotorsportProjects.find((p) => p.id === slug);

  const title = text(found?.title) || "Proyek Rekayasa";
  const desc =
    text(found?.summary) ||
    text(found?.description) ||
    "Detail studi kasus rekayasa perangkat lunak.";
  const image = safeHref(found?.cover_url || found?.thumbnail_url);

  return {
    title: `${title} · Playground BWORIEY`,
    description: desc,
    alternates: { canonical: `${origin(bundle.settings)}/projects/${slug}` },
    openGraph: {
      title: `${title} · BWORIEY`,
      description: desc,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const bundle = await getPublicBundle();
  const rawProjects = bundle.collections.projects?.data || [];

  let project: MotorsportProjectItem | undefined;
  const dbMatch = rawProjects.find((p) => p.slug === slug || p.id === slug);

  if (dbMatch) {
    const rawTech = dbMatch.technologies;
    const technologies: string[] = Array.isArray(rawTech)
      ? rawTech.map(String)
      : typeof rawTech === "string"
      ? rawTech.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      : [];

    const caseStudy = dbMatch.case_study as Record<string, string> | undefined;
    const title = text(dbMatch.title) || "Proyek Rekayasa";
    let coverUrl = safeHref(dbMatch.cover_url) || safeHref(dbMatch.thumbnail_url);
    let repoUrl = safeHref(dbMatch.repository_url);

    if (title.toLowerCase().includes("tailwind") || title.toLowerCase().includes("flowwind")) {
      coverUrl =
        "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png";
      repoUrl = repoUrl || "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind";
    } else if (title.toLowerCase().includes("combridge") || title.toLowerCase().includes("bisindo")) {
      coverUrl =
        "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png";
      repoUrl = repoUrl || "https://github.com/bworiey/combridge-bisindo-cloud";
    }

    project = {
      id: text(dbMatch.slug) || text(dbMatch.id) || slug,
      number: "01",
      title,
      subtitle: text(dbMatch.subtitle) || undefined,
      category: text(dbMatch.category) || "Web Development",
      year: dbMatch.created_at ? String(dbMatch.created_at).slice(0, 4) : "2024",
      role: text(dbMatch.role) || "Software Engineer",
      summary: text(dbMatch.summary) || text(dbMatch.description) || "Studi kasus rekayasa.",
      description: text(dbMatch.description) || text(dbMatch.summary) || "Detail arsitektur.",
      technologies: technologies.length > 0 ? technologies : ["Next.js", "TypeScript"],
      cover_url: coverUrl || null,
      project_url: safeHref(dbMatch.project_url) || null,
      repository_url: repoUrl || null,
      case_study: {
        background: caseStudy?.background || undefined,
        features: caseStudy?.features || undefined,
        contribution: caseStudy?.contribution || undefined,
        outcome: caseStudy?.outcome || undefined,
        process: caseStudy?.process || undefined,
      },
    };
  } else {
    project = defaultMotorsportProjects.find(
      (p) => p.id === slug || p.title.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }

  if (!project) notFound();

  const currentIdx = defaultMotorsportProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    currentIdx > 0
      ? defaultMotorsportProjects[currentIdx - 1]
      : defaultMotorsportProjects[defaultMotorsportProjects.length - 1];
  const nextProject =
    currentIdx >= 0 && currentIdx < defaultMotorsportProjects.length - 1
      ? defaultMotorsportProjects[currentIdx + 1]
      : defaultMotorsportProjects[0];
  const related = defaultMotorsportProjects.filter((p) => p.id !== project.id).slice(0, 3);
  const ownerName =
    text(bundle.profile?.full_name) || text(bundle.settings.owner_name) || "Taufik Raihandani";
  const ownerEmail = text(bundle.settings.owner_email) || "raihandani270204@gmail.com";

  return (
    <ThemeProvider>
      <MotionProvider>
        <ScrollProgress color="#F05A28" />
        <CustomCursor />
        <DottedCanvas>
          <Navigation />
          <PageTransition pageKey={project.id}>
            <main className="pt-8 pb-24 max-w-6xl mx-auto px-6 sm:px-8">
              <div className="mb-10">
                <Link
                  href="/#playground"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:text-[#F05A28] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>BACK TO PLAYGROUND</span>
                </Link>
              </div>

              <header className="space-y-5 pb-10 border-b border-[#000000]/15 dark:border-[#FAF8F5]/15 mb-12">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-[0.4rem] bg-[#C4D94E] text-[#000000] uppercase">
                    {project.category}
                  </span>
                  <span className="text-[#000000]/60 dark:text-[#FAF8F5]/60">{project.year}</span>
                  <span className="text-[#000000]/40 dark:text-[#FAF8F5]/40">·</span>
                  <span className="text-[#000000]/80 dark:text-[#FAF8F5]/80">{project.role}</span>
                </div>

                <h1 className="font-hero-display text-[clamp(2.5rem,6vw,5rem)] text-[#000000] dark:text-[#FAF8F5] leading-[1.05]">
                  {project.title}
                </h1>

                {project.subtitle && (
                  <p className="font-editorial italic text-xl sm:text-2xl text-[#000000]/75 dark:text-[#FAF8F5]/75 max-w-3xl">
                    {project.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase tracking-wider"
                    >
                      <span>LIVE DEMO</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.repository_url && (
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-[0.5rem] bg-[#FFD4C2] text-[#000000] font-mono text-xs uppercase tracking-wider"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>REPOSITORY</span>
                    </a>
                  )}
                </div>
              </header>

              {/* Sharp Project Image Banner with Fullscreen Zoom */}
              {project.cover_url && (
                <ProjectImageViewer src={project.cover_url} alt={project.title} />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
                <div className="lg:col-span-8 space-y-8">
                  <section className="space-y-3">
                    <h2 className="font-section-display text-3xl text-[#000000] dark:text-[#FAF8F5]">
                      Overview
                    </h2>
                    <p className="font-body-editorial text-base text-[#000000]/80 dark:text-[#FAF8F5]/80">
                      {project.description}
                    </p>
                  </section>

                  {/* Dynamic CMS Case Study Blocks */}
                  <CaseStudyBlockRenderer
                    blocks={normalizeCaseStudyBlocks(
                      project.case_study as Record<string, unknown> | undefined
                    )}
                  />
                </div>

                {/* Sidebar Tech Stack */}
                <aside className="lg:col-span-4 p-6 rounded-[0.75rem] bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 space-y-5">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#F05A28] block mb-3">
                      TECHNOLOGY STACK
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-xs px-2.5 py-1 bg-[#FFD4C2]/70 dark:bg-[#1A1917] text-[#000000] dark:text-[#FAF8F5]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.case_study?.process && (
                    <div className="pt-4 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#000000]/60 dark:text-[#FAF8F5]/60 block mb-1">
                        METHODOLOGY
                      </span>
                      <p className="font-mono text-xs text-[#000000]/80 dark:text-[#FAF8F5]/80">
                        {project.case_study.process}
                      </p>
                    </div>
                  )}
                </aside>
              </div>

              {/* Next / Previous Project Navigation */}
              <nav
                aria-label="Navigasi Proyek"
                className="mb-14 pt-8 border-t border-[#000000]/15 dark:border-[#FAF8F5]/15 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Link
                  href={`/projects/${prevProject.id}`}
                  className="p-5 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 hover:border-[#F05A28] transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase text-[#000000]/55 dark:text-[#FAF8F5]/55 inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" />
                    <span>Proyek Sebelumnya</span>
                  </span>
                  <div className="font-editorial text-2xl mt-1">{prevProject.title}</div>
                </Link>
                <Link
                  href={`/projects/${nextProject.id}`}
                  className="p-5 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 hover:border-[#F05A28] transition-colors sm:text-right"
                >
                  <span className="font-mono text-[10px] uppercase text-[#000000]/55 dark:text-[#FAF8F5]/55 inline-flex items-center gap-1">
                    <span>Proyek Berikutnya</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <div className="font-editorial text-2xl mt-1">{nextProject.title}</div>
                </Link>
              </nav>

              {/* Related Works */}
              <section className="pt-12 border-t border-[#000000]/15 dark:border-[#FAF8F5]/15">
                <span className="font-mono text-xs uppercase tracking-wider text-[#F05A28] block mb-6">
                  MORE FROM PLAYGROUND
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/projects/${rel.id}`}
                      className="group p-5 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 hover:border-[#F05A28] transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-[#F05A28] uppercase">
                          {rel.category} · {rel.year}
                        </span>
                        <h3 className="font-editorial text-2xl mt-1 group-hover:text-[#F05A28] transition-colors">
                          {rel.title}
                        </h3>
                        <p className="font-body-editorial text-xs text-[#000000]/70 dark:text-[#FAF8F5]/70 line-clamp-2 mt-2">
                          {rel.summary}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-[#F05A28] inline-flex items-center gap-1 mt-4">
                        <span>OPEN</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </main>
          </PageTransition>
          <Footer ownerName={ownerName} ownerEmail={ownerEmail} />
        </DottedCanvas>
      </MotionProvider>
    </ThemeProvider>
  );
}
