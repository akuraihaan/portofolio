import type { MetadataRoute } from "next";
import { getPublicBundle, origin } from "@/lib/data";
import { text } from "@/lib/domain";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const b = await getPublicBundle(),
    base = origin(b.settings);
  return [
    { url: base },
    { url: base + "/privacy" },
    { url: base + "/contact" },
    ...(b.collections.sections?.data.some((row) => row.section_key === "about")
      ? [{ url: base + "/about" }]
      : []),
    ...(b.collections.translations?.data || []).map((row) => ({
      url:
        base +
        "/en" +
        (row.source_type === "home"
          ? ""
          : "/" + text(row.source_type) + "/" + text(row.slug)),
    })),
    ...[
      "projects",
      "articles",
      "playground",
      "experiences",
      "educations",
      "skills",
      "certificates",
      "achievements",
    ]
      .filter((key) => b.collections[key]?.data.length)
      .map((key) => ({ url: base + "/" + key })),
    ...["projects", "articles", "playground", "portfolio_versions"].flatMap(
      (key) =>
        (b.collections[key]?.data || [])
          .filter((r) => key !== "portfolio_versions" || r.indexable === true)
          .map((r) => ({
            url:
              base +
              "/" +
              (key === "portfolio_versions" ? "portfolio" : key) +
              "/" +
              text(r.slug),
            ...(r.updated_at ? { lastModified: text(r.updated_at) } : {}),
          })),
    ),
  ];
}
