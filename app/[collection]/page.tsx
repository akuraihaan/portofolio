import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPublicBundle, origin } from "@/lib/data";
import { modules, text, safeHref } from "@/lib/domain";
import {
  PublicShell,
  CollectionError,
  ContentCards,
  ContactInfo,
  TextBlock,
} from "@/components/portfolio";
import { ContactForm } from "@/components/contact-form";
import { SkillGroups } from "@/components/editorial";
import { ContentArchive } from "@/components/content-archive";
import { ProjectExplorer } from "@/components/project-explorer";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const bundle = await getPublicBundle();
  const title =
    collection === "about"
      ? "Tentang"
      : collection === "contact"
        ? "Kontak"
        : modules[collection]?.label || "Arsip";
  const section = bundle.collections.sections?.data.find(
    (row) => row.section_key === collection,
  );
  const description =
    text(section?.description) ||
    `${title} · ${text(bundle.profile?.full_name)}`;
  const url = origin(bundle.settings) + "/" + collection;
  const image = safeHref(bundle.settings.og_image_url);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      locale: "id_ID",
      ...(image ? { images: [image] } : {}),
    },
  };
}
export default async function Archive({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { collection } = await params;
  if (
    ![
      "projects",
      "articles",
      "playground",
      "about",
      "contact",
      "experiences",
      "educations",
      "skills",
      "certificates",
      "achievements",
    ].includes(collection)
  )
    notFound();
  const bundle = await getPublicBundle(),
    search = await searchParams,
    rows = bundle.collections[collection]?.data || [];
  const section = bundle.collections.sections?.data.find(
    (row) => row.section_key === collection,
  );
  if (collection === "about" && !section) notFound();
  if (
    !["projects", "about", "contact"].includes(collection) &&
    !rows.length &&
    !bundle.collections[collection]?.error
  )
    notFound();
  const title =
    collection === "about"
      ? "Tentang"
      : collection === "contact"
        ? "Kontak"
        : modules[collection].label;
  return (
    <PublicShell bundle={bundle}>
      <main id="main" className="shell section">
        <div className="section-heading">
          <p className="eyebrow">{text(bundle.profile?.full_name)}</p>
          <h1>{title}</h1>
        </div>
        <CollectionError bundle={bundle} name={collection} />
        {collection === "about" ? (
          <div className="prose">
            <TextBlock value={section?.description || bundle.profile?.bio} />
            {safeHref(bundle.settings.resume_url) && (
              <a
                className="pill"
                href={safeHref(bundle.settings.resume_url)}
                target="_blank"
                rel="noreferrer"
              >
                Buka CV ↗
              </a>
            )}
          </div>
        ) : collection === "contact" ? (
          <div className="contact-layout">
            <div>
              <TextBlock value={section?.description} />
              <ContactInfo bundle={bundle} />
            </div>
            <ContactForm />
          </div>
        ) : collection === "skills" ? (
          <SkillGroups
            rows={rows}
            projects={bundle.collections.projects?.data || []}
          />
        ) : [
            "experiences",
            "educations",
            "certificates",
            "achievements",
          ].includes(collection) ? (
          <ContentCards rows={rows} moduleKey={collection} />
        ) : collection === "projects" ? (
          <Suspense fallback={<p>Memuat pencarian…</p>}>
            <ProjectExplorer projects={rows} archive />
          </Suspense>
        ) : (
          <ContentArchive rows={rows} moduleKey={collection} search={search} />
        )}
      </main>
    </PublicShell>
  );
}
