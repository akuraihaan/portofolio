import { getPublicBundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { origin } from "@/lib/data";
import { SpaceMain } from "@/components/space/SpaceMain";

export async function generateMetadata() {
  const b = await getPublicBundle();
  const s = b.settings;
  const ownerName = text(b.profile?.full_name) || text(s.owner_name) || "Taufik Raihandani";
  const shortDescription = `Portofolio personal luar angkasa ${ownerName} — Junior Developer & Tech Enthusiast.`;

  return {
    title: `${ownerName} · Space Portfolio | Junior Developer & Tech Enthusiast`,
    description: shortDescription,
    alternates: {
      canonical: origin(s),
      ...(b.collections.translations?.data.some((row) => row.source_type === "home")
        ? { languages: { id: origin(s), en: origin(s) + "/en" } }
        : {}),
    },
    openGraph: {
      title: `${ownerName} · Space Portfolio`,
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

  return <SpaceMain bundle={bundle} />;
}
