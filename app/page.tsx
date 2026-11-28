import { getPublicBundle, origin } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { PlaygroundMain } from "@/components/sections/PlaygroundMain";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const b = await getPublicBundle();
  const s = b.settings;
  const ownerName = text(b.profile?.full_name) || text(s.owner_name) || "Taufik Raihandani";
  const shortDescription = `${ownerName} — Web Developer, Cloud Computing, dan Lulusan Pendidikan Komputer.`;

  return {
    title: "bworiey",
    description: shortDescription,
    alternates: {
      canonical: origin(s),
      ...(b.collections.translations?.data.some((row) => row.source_type === "home")
        ? { languages: { id: origin(s), en: origin(s) + "/en" } }
        : {}),
    },
    openGraph: {
      title: "bworiey",
      description: shortDescription,
      ...(safeHref(s.og_image_url) ? { images: [safeHref(s.og_image_url)!] } : {}),
    },
    ...(safeHref(s.favicon_url) ? { icons: { icon: safeHref(s.favicon_url) } } : {}),
  };
}

export default async function Home() {
  const bundle = await getPublicBundle();

  return <PlaygroundMain bundle={bundle} />;
}
