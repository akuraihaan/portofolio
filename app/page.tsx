import { getPublicBundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { origin } from "@/lib/data";
import { ContemporaryMain } from "@/components/contemporary/ContemporaryMain";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const b = await getPublicBundle();
  const s = b.settings;
  const ownerName = text(b.profile?.full_name) || text(s.owner_name) || "Taufik Raihandani";
  const shortDescription = `BWORIEY — Portofolio Personal ${ownerName}. Creative Developer, Cloud Computing & Educational Technology. Contemporary Swiss & Modern Editorial Portfolio.`;

  return {
    title: `BWORIEY — ${ownerName} · Creative Developer & Educational Technology`,
    description: shortDescription,
    alternates: {
      canonical: origin(s),
      ...(b.collections.translations?.data.some((row) => row.source_type === "home")
        ? { languages: { id: origin(s), en: origin(s) + "/en" } }
        : {}),
    },
    openGraph: {
      title: `BWORIEY — ${ownerName} · Creative Developer & Educational Technology`,
      description: shortDescription,
      ...(safeHref(s.og_image_url)
        ? { images: [safeHref(s.og_image_url)!] }
        : {}),
    },
    ...(safeHref(s.favicon_url)
      ? { icons: { icon: safeHref(s.favicon_url) } }
      : {}),
  };
}

export default async function Home() {
  const bundle = await getPublicBundle();

  return <ContemporaryMain bundle={bundle} />;
}
