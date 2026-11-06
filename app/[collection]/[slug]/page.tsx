import { notFound, permanentRedirect } from "next/navigation";
import { getPublicBundle, origin } from "@/lib/data";
import { publicClient } from "@/lib/supabase/server";
import { text, titleOf, safeHref } from "@/lib/domain";
import { PublicShell, Detail } from "@/components/portfolio";
import { ReadingProgress } from "@/components/reading-progress";
import type { Metadata } from "next";
type Props = {
  params: Promise<{ collection: string; slug: string }>;
  searchParams: Promise<{ from?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, slug } = await params;
  const b = await getPublicBundle(),
    r = b.collections[collection]?.data.find((r) => r.slug === slug);
  if (!r) return { robots: { index: false, follow: false } };
  const image = safeHref(r.og_image_url || r.cover_url || r.thumbnail_url);
  const translation = b.collections.translations?.data.find(
    (row) =>
      row.project_id === r.id ||
      row.article_id === r.id ||
      row.playground_id === r.id,
  );
  return {
    title: text(r.seo_title) || titleOf(r),
    description: text(r.meta_description || r.summary || r.excerpt),
    alternates: {
      canonical: origin(b.settings) + "/" + collection + "/" + slug,
      ...(translation
        ? {
            languages: {
              id: origin(b.settings) + "/" + collection + "/" + slug,
              en:
                origin(b.settings) +
                "/en/" +
                collection +
                "/" +
                text(translation.slug),
            },
          }
        : {}),
    },
    openGraph: { title: titleOf(r), ...(image ? { images: [image] } : {}) },
  };
}
export default async function Entry({ params, searchParams }: Props) {
  const { collection, slug } = await params;
  if (!["projects", "articles", "playground"].includes(collection)) notFound();
  const b = await getPublicBundle();
  if (b.collections[collection]?.error)
    throw new Error("Konten tidak dapat dimuat.");
  const row = b.collections[collection]?.data.find((row) => row.slug === slug);
  if (!row) {
    const { data } = await publicClient()
      .from("slug_redirects")
      .select("target_id")
      .eq("module", collection)
      .eq("old_slug", slug)
      .maybeSingle();
    const current = b.collections[collection]?.data.find(
      (r) => r.id === data?.target_id,
    );
    if (current) permanentRedirect("/" + collection + "/" + text(current.slug));
    notFound();
  }
  return (
    <PublicShell bundle={b}>
      <ReadingProgress />
      {b.collections.translations?.data
        .filter(
          (item) =>
            item.project_id === row.id ||
            item.article_id === row.id ||
            item.playground_id === row.id,
        )
        .map((item) => (
          <div className="shell actions" key={text(item.id)}>
            <a href={"/en/" + collection + "/" + text(item.slug)} hrefLang="en">
              Read this page in English ↗
            </a>
          </div>
        ))}
      <Detail
        bundle={b}
        row={row}
        moduleKey={collection}
        returnTo={(await searchParams).from}
      />
    </PublicShell>
  );
}
