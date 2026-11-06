import { notFound } from "next/navigation";
import { Portfolio, PublicShell } from "@/components/portfolio";
import { prdPreviewBundle } from "@/lib/prd-content";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Pratinjau rancangan PRD",
  robots: { index: false, follow: false },
};
export default function DesignPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  const bundle = prdPreviewBundle();
  return (
    <>
      <aside className="design-preview-banner">
        Pratinjau lokal · Isi dari PRD untuk ditinjau, belum diterbitkan.
      </aside>
      <PublicShell bundle={bundle} home>
        <Portfolio bundle={bundle} />
      </PublicShell>
    </>
  );
}
