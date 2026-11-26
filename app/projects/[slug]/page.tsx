import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicBundle, origin } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { ArrowLeft, ExternalLink, ArrowUpRight, CheckCircle2, Layers } from "lucide-react";
import { GithubIcon } from "@/components/space/SocialIcons";
import { MotorsportNavbar } from "@/components/motorsport/MotorsportNavbar";
import { MotorsportFooter } from "@/components/motorsport/MotorsportFooter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { defaultMotorsportProjects, type MotorsportProjectItem } from "@/components/motorsport/MotorsportGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPublicBundle();
  const rawProjects = bundle.collections.projects?.data || [];
  
  const found = rawProjects.find((p) => p.slug === slug || p.id === slug) ||
    defaultMotorsportProjects.find((p) => p.id === slug);

  const title = text(found?.title) || "Proyek Rekayasa";
  const desc = text(found?.summary) || text(found?.description) || "Detail studi kasus rekayasa perangkat lunak.";
  const image = safeHref(found?.cover_url || found?.thumbnail_url);

  return {
    title: `${title} · Studi Kasus Rekayasa BWORIEY`,
    description: desc,
    alternates: {
      canonical: `${origin(bundle.settings)}/projects/${slug}`,
    },
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

  // Match by slug or id, or fallback to default curated projects
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
      coverUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png";
      repoUrl = repoUrl || "https://github.com/bworiey/web-pembelajaran-interaktif-tailwind";
    } else if (title.toLowerCase().includes("combridge") || title.toLowerCase().includes("bisindo")) {
      coverUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png";
      repoUrl = repoUrl || "https://github.com/bworiey/combridge-bisindo-cloud";
    }

    project = {
      id: text(dbMatch.id) || slug,
      number: "01",
      title,
      subtitle: text(dbMatch.subtitle) || undefined,
      category: text(dbMatch.category) || "Web Development",
      year: dbMatch.created_at ? String(dbMatch.created_at).slice(0, 4) : "2024",
      role: text(dbMatch.role) || "Software Engineer",
      summary: text(dbMatch.summary) || text(dbMatch.description) || "Studi kasus rekayasa.",
      description: text(dbMatch.description) || text(dbMatch.summary) || "Detail arsitektur.",
      technologies: technologies.length > 0 ? technologies : ["Next.js", "TypeScript", "Tailwind CSS"],
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
    project = defaultMotorsportProjects.find((p) => p.id === slug || p.title.toLowerCase().replace(/\s+/g, "-") === slug);
  }

  if (!project) {
    notFound();
  }

  const relatedProjects = defaultMotorsportProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  const ownerName = text(bundle.profile?.full_name) || text(bundle.settings.owner_name) || "Taufik Raihandani";

  return (
    <MotionProvider>
      <div className="min-h-screen bg-[#F5F5F0] dark:bg-[#111111] text-[#111111] dark:text-[#F5F5F0] font-sans selection:bg-[#D1FF00] selection:text-[#111111]">
        <ScrollProgress color="#D1FF00" />
        <CustomCursor />
        <MotorsportNavbar />

        <PageTransition pageKey={project.id}>
          <main className="pt-32 pb-24 max-w-6xl mx-auto px-6 sm:px-8">
        {/* Navigation Breadcrumb Back to Exhibition */}
        <div className="mb-12">
          <Link
            href="/#proyek"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#555555] hover:text-[#111111] dark:hover:text-[#D1FF00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE DIGITAL EXHIBITION</span>
          </Link>
        </div>

        {/* Hero Section of Case Study */}
        <header className="space-y-6 pb-12 border-b border-[#333333]/20 mb-12">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1 rounded bg-[#1A1A1A] text-[#D1FF00] font-bold uppercase tracking-wider border border-[#333333]">
              {project.category}
            </span>
            <span className="text-[#555555]">&bull;</span>
            <span className="text-[#555555]">TAHUN: {project.year}</span>
            <span className="text-[#555555]">&bull;</span>
            <span className="text-[#555555]">PERAN: <strong className="text-[#111111] dark:text-[#F5F5F0]">{project.role}</strong></span>
          </div>

          <h1 className="font-hero-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-[#111111] dark:text-[#F5F5F0] leading-[0.95] tracking-tight uppercase">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="font-editorial text-xl sm:text-2xl text-[#555555] dark:text-[#AAAAAA] font-medium leading-relaxed max-w-4xl">
              {project.subtitle}
            </p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all shadow-md"
              >
                <span>BUKA DEMO LIVE</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.repository_url && (
              <a
                href={project.repository_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[0.75rem] bg-[#1A1A1A] text-[#F5F5F0] border border-[#333333] hover:border-[#D1FF00] font-sans text-xs font-bold uppercase tracking-wider active:scale-95 transition-all"
              >
                <GithubIcon className="w-4 h-4" />
                <span>SOURCE REPOSITORY</span>
              </a>
            )}
          </div>
        </header>

        {/* Featured Image Banner */}
        {project.cover_url && (
          <div className="mb-16 aspect-[16/9] w-full rounded-[1.5rem] overflow-hidden bg-[#1A1A1A] border-2 border-[#333333] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.cover_url}
              alt={project.title}
              className="w-full h-full object-cover filter contrast-105"
            />
          </div>
        )}

        {/* Case Study Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Main Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <section className="space-y-4">
              <h2 className="font-section-display text-3xl font-bold uppercase text-[#111111] dark:text-[#F5F5F0]">
                Ringkasan Proyek
              </h2>
              <p className="font-body-editorial text-base sm:text-lg text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-light">
                {project.description}
              </p>
            </section>

            {/* Problem & Background */}
            {project.case_study?.background && (
              <section className="space-y-4 p-8 rounded-[1.5rem] bg-[#1A1A1A] border border-[#333333] text-[#F5F5F0]">
                <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase tracking-wider block">
                  01 // LATAR BELAKANG &amp; MASALAH
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F5F5F0]">
                  Tantangan yang Dihadapi
                </h3>
                <p className="font-body-editorial text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-light">
                  {project.case_study.background}
                </p>
              </section>
            )}

            {/* Features & Architecture */}
            {project.case_study?.features && (
              <section className="space-y-4">
                <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#D1FF00] uppercase tracking-wider block">
                  02 // FITUR &amp; ARSITEKTUR UTAMA
                </span>
                <h3 className="font-section-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-[#F5F5F0]">
                  Solusi Rekayasa yang Diterapkan
                </h3>
                <p className="font-body-editorial text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-light">
                  {project.case_study.features}
                </p>
              </section>
            )}

            {/* Engineering Contribution */}
            {project.case_study?.contribution && (
              <section className="space-y-4 p-8 rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00]/40 text-[#F5F5F0]">
                <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase tracking-wider block">
                  03 // KONTRIBUSI PRIBADI
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F5F5F0]">
                  Peran &amp; Implementasi Teknis
                </h3>
                <p className="font-body-editorial text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-light">
                  {project.case_study.contribution}
                </p>
              </section>
            )}

            {/* Outcome & Lessons */}
            {project.case_study?.outcome && (
              <section className="space-y-4">
                <span className="font-mono text-xs font-bold text-[#111111] dark:text-[#D1FF00] uppercase tracking-wider block">
                  04 // VALIDASI &amp; DAMPAK
                </span>
                <h3 className="font-section-display text-2xl sm:text-3xl font-bold uppercase text-[#111111] dark:text-[#F5F5F0]">
                  Hasil Pengujian
                </h3>
                <p className="font-body-editorial text-base text-[#555555] dark:text-[#AAAAAA] leading-relaxed font-light">
                  {project.case_study.outcome}
                </p>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Tech Metadata (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Tech Stack Spec Card */}
            <div className="p-6 rounded-[1.5rem] bg-[#1A1A1A] border border-[#333333] text-[#F5F5F0] space-y-5">
              <span className="font-mono text-xs font-bold text-[#D1FF00] uppercase tracking-wider block border-b border-[#333333] pb-3">
                SPESIFIKASI TEKNOLOGI
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-[0.5rem] bg-[#111111] border border-[#333333] font-mono text-xs text-[#F5F5F0]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-[#333333] space-y-2 font-mono text-xs text-[#AAAAAA]">
                <div className="flex justify-between">
                  <span>Kategori:</span>
                  <strong className="text-[#F5F5F0]">{project.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tahun Selesai:</span>
                  <strong className="text-[#D1FF00]">{project.year}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <strong className="text-emerald-400">Verified &amp; Published</strong>
                </div>
              </div>
            </div>

            {/* Direct Connect Card */}
            <div className="p-6 rounded-[1.5rem] bg-[#111111] border-2 border-[#D1FF00] text-[#F5F5F0] space-y-4">
              <h4 className="font-editorial text-xl font-bold text-[#F5F5F0]">
                Tertarik Mengembangkan Sistem Serupa?
              </h4>
              <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">
                Mari mendiskusikan implementasi arsitektur perangkat lunak untuk kebutuhan tim atau institusi Anda.
              </p>
              <Link
                href="/#kontak"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all"
              >
                <span>HUBUNGI REKAYASAWAN</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Projects Exhibition Strip */}
        <section className="pt-16 border-t border-[#333333]/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-section-display text-3xl font-bold uppercase text-[#111111] dark:text-[#F5F5F0]">
              Eksplorasi Proyek Lainnya
            </h3>
            <Link
              href="/#proyek"
              className="font-mono text-xs uppercase tracking-wider text-[#D1FF00] bg-[#1A1A1A] px-3 py-1.5 rounded-[0.5rem] hover:brightness-110"
            >
              LIHAT SEMUA KARYA &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <Link
                key={rel.id}
                href={`/projects/${rel.id}`}
                className="group p-5 rounded-[1rem] bg-[#1A1A1A] border border-[#333333] hover:border-[#D1FF00] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
                    <span className="text-[#D1FF00]">{rel.category}</span>
                    <span className="text-[#888888]">{rel.year}</span>
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-[#F5F5F0] group-hover:text-[#D1FF00] transition-colors mb-2">
                    {rel.title}
                  </h4>
                  <p className="font-sans text-xs text-[#AAAAAA] line-clamp-2 leading-relaxed">
                    {rel.summary}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#333333] flex items-center justify-between font-mono text-[11px] text-[#D1FF00]">
                  <span>STUDI KASUS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
        </PageTransition>

      <MotorsportFooter ownerName={ownerName} />
    </div>
    </MotionProvider>
  );
}
