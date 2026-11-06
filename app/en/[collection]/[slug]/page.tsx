import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBundle, origin } from "@/lib/data";
import { text } from "@/lib/domain";
import { EnglishShell, EnglishBody } from "@/components/english-portfolio";
type Props = { params: Promise<{ collection: string; slug: string }> };
async function content(params: Props["params"]) {
  const { collection, slug } = await params;
  if (!["projects", "articles", "playground"].includes(collection)) notFound();
  const bundle = await getPublicBundle();
  const row = bundle.collections.translations?.data.find(
    (row) => row.source_type === collection && row.slug === slug,
  );
  const sourceId =
    row?.[
      (
        {
          projects: "project_id",
          articles: "article_id",
          playground: "playground_id",
        } as Record<string, string>
      )[collection]
    ];
  const source = bundle.collections[collection]?.data.find(
    (item) => item.id === sourceId || item.slug === slug,
  );
  if (!row && !source) notFound();
  return {
    bundle,
    row,
    original: "/" + collection + "/" + text(source?.slug || slug),
    collection,
    slug,
  };
}
export async function generateMetadata({ params }: Props) {
  const { bundle, row, original, collection, slug } = await content(params);
  return {
    title: row ? text(row.title) : "Translation unavailable",
    description: text(row?.summary),
    robots: { index: !!row, follow: true },
    alternates: {
      canonical: origin(bundle.settings) + "/en/" + collection + "/" + slug,
      languages: {
        id: origin(bundle.settings) + original,
        en: origin(bundle.settings) + "/en/" + collection + "/" + slug,
      },
    },
  };
}
export default async function EnglishDetail({ params }: Props) {
  const { bundle, row, original } = await content(params);
  return (
    <EnglishShell bundle={bundle} original={original}>
      <main id="main" className="shell section">
        {row ? (
          <EnglishBody row={row} />
        ) : (
          <>
            <h1>Translation in progress.</h1>
            <p>
              This page is available in Indonesian while its English translation
              is being reviewed.
            </p>
            <Link className="pill" href={original} hrefLang="id">
              Read the Indonesian version ↗
            </Link>
          </>
        )}
      </main>
    </EnglishShell>
  );
}
