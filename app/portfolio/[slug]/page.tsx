import { notFound, permanentRedirect } from "next/navigation";
import { getPublicBundle, origin } from "@/lib/data";
import { text } from "@/lib/domain";
import { publicClient } from "@/lib/supabase/server";
import { VersionPage } from "@/components/version-page";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params,
    b = await getPublicBundle(),
    row = b.collections.portfolio_versions?.data.find((r) => r.slug === slug);
  return row
    ? {
        title: text(row.seo_title || row.title),
        description: text(row.meta_description || row.description),
        robots: { index: row.indexable === true, follow: true },
        openGraph: {
          title: text(row.seo_title || row.title),
          description: text(row.meta_description || row.description),
        },
        alternates: { canonical: origin(b.settings) + "/portfolio/" + slug },
      }
    : { robots: { index: false, follow: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params,
    b = await getPublicBundle();
  if (b.collections.portfolio_versions?.error)
    throw new Error("Versi belum dapat dimuat.");
  const row = b.collections.portfolio_versions?.data.find(
    (r) => r.slug === slug,
  );
  if (!row) {
    const { data } = await publicClient()
      .from("slug_redirects")
      .select("target_id")
      .eq("module", "portfolio_versions")
      .eq("old_slug", slug)
      .maybeSingle();
    const current = b.collections.portfolio_versions?.data.find(
      (r) => r.id === data?.target_id,
    );
    if (current) permanentRedirect("/portfolio/" + text(current.slug));
    notFound();
  }
  return <VersionPage bundle={b} version={row} />;
}
