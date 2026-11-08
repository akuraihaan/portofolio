import { getPublicBundle } from "@/lib/data";
import { text, safeHref } from "@/lib/domain";
import { origin } from "@/lib/data";
import { PixelMain } from "@/components/pixel-sections/PixelMain";

export async function generateMetadata() {
  const b = await getPublicBundle();
  const s = b.settings;
  const ownerName = text(b.profile?.full_name) || text(s.owner_name) || "Taufik Raihandani";
  const shortDescription = `BWORIEY — Personal portfolio of ${ownerName}, Computer Education graduate with an interest in web development, software engineering, and educational technology.`;

  return {
    title: `BWORIEY — ${ownerName} · Pixel 3D Digital World Portfolio`,
    description: shortDescription,
    alternates: {
      canonical: origin(s),
      ...(b.collections.translations?.data.some((row) => row.source_type === "home")
        ? { languages: { id: origin(s), en: origin(s) + "/en" } }
        : {}),
    },
    openGraph: {
      title: `BWORIEY — ${ownerName} · Personal Portfolio`,
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

  return <PixelMain bundle={bundle} />;
}
