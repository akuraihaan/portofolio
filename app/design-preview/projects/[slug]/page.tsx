import Link from "next/link";
import { notFound } from "next/navigation";
import { Detail } from "@/components/portfolio";
import { prdPreviewBundle } from "@/lib/prd-content";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pratinjau studi kasus PRD",
  robots: { index: false, follow: false },
};
export default async function PreviewProject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const bundle = prdPreviewBundle(),
    { slug } = await params;
  const row = bundle.collections.projects.data.find(
    (project) => project.slug === slug,
  );
  if (!row) notFound();
  return (
    <>
      <aside className="design-preview-banner">
        Pratinjau PRD · Lengkapi proses, hasil, dan bukti sebelum publikasi.{" "}
        <Link href="/design-preview">Kembali ke rancangan</Link>
      </aside>
      <Detail bundle={bundle} row={row} moduleKey="projects" />
    </>
  );
}
