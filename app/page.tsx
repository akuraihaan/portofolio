import { getPublicBundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { origin } from "@/lib/data";
import { BrutalistMain } from "@/components/brutalist/BrutalistMain";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  const b = await getPublicBundle();
  const s = b.settings;
  const ownerName = text(b.profile?.full_name) || text(s.owner_name) || "Taufik Raihandani";
  const shortDescription = `BWORIEY — Portofolio Personal ${ownerName}. Creative Developer, Cloud Computing & Educational Technology. "I BUILD THINGS FOR THE DIGITAL WORLD."`;

  return {
    title: `BWORIEY — ${ownerName} · Experimental Portfolio`,
    description: shortDescription,
    alternates: {
      canonical: origin(s),
      ...(b.collections.translations?.data.some((row) => row.source_type === "home")
        ? { languages: { id: origin(s), en: origin(s) + "/en" } }
        : {}),
    },
    openGraph: {
      title: `BWORIEY — ${ownerName} · Experimental Portfolio`,
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

  return <BrutalistMain bundle={bundle} />;
}
