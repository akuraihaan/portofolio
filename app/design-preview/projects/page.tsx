import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectExplorer } from "@/components/project-explorer";
import { prdPreviewBundle } from "@/lib/prd-content";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pratinjau arsip PRD",
  robots: { index: false, follow: false },
};
export default function PreviewProjects() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <main id="main" className="shell section">
      <Link href="/design-preview">← Pratinjau beranda</Link>
      <div className="section-heading">
        <p className="eyebrow">Pratinjau lokal · Belum diterbitkan</p>
        <h1>Studi kasus.</h1>
      </div>
      <Suspense>
        <ProjectExplorer
          projects={prdPreviewBundle().collections.projects.data}
          archive
          basePath="/design-preview/projects"
        />
      </Suspense>
    </main>
  );
}
