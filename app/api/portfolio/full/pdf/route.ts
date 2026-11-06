import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { PortfolioPdf } from "@/components/portfolio-pdf";
import { origin, readPublicBundle, type Bundle } from "@/lib/data";
import { text, type Row } from "@/lib/domain";
import { sectionKind, visibleSections } from "@/lib/presentation";
import { publicClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
const contentKeys = ["projects", "skills", "experiences", "educations", "certificates", "articles", "achievements", "testimonials"];

function changedSinceRender(before: Bundle, after: Bundle) {
  if (text(before.profile?.updated_at) !== text(after.profile?.updated_at)) return true;
  return contentKeys.some((key) => {
    const current = new Map((after.collections[key]?.data || []).map((row) => [text(row.id), text(row.updated_at)]));
    return (before.collections[key]?.data || []).some((row) =>
      !current.has(text(row.id)) || current.get(text(row.id)) !== text(row.updated_at),
    );
  });
}

export async function GET() {
  try {
    const bundle = await readPublicBundle();
    if (contentKeys.some((key) => bundle.collections[key]?.error))
      return Response.json({ error: "Sebagian konten belum dapat dimuat. Silakan coba lagi." }, { status: 503, headers });
    if (!contentKeys.some((key) => bundle.collections[key]?.data.length))
      return Response.json({ error: "Belum ada konten portofolio yang dapat diunduh." }, { status: 404, headers });

    const sections = visibleSections(bundle);
    const showContact = sections.some((section) => ["contact", "collaborate"].includes(sectionKind(section)));
    const owner = text(bundle.profile?.full_name) || text(bundle.settings.site_name) || "Portofolio";
    const url = origin(bundle.settings);
    const version: Row = {
      slug: "lengkap",
      title: "Portofolio Lengkap",
      portfolio_type: "digital",
      description: text(bundle.profile?.bio) || "Kumpulan proyek, keahlian, pengalaman, dan informasi yang telah dipublikasikan.",
      language: "id",
      show_contact: showContact,
      section_order: contentKeys,
    };
    const qr = await QRCode.toDataURL(url, { margin: 1 });
    const images: Record<string, string> = {};
    const client = publicClient();
    for (const row of (bundle.collections.projects?.data || []).slice(0, 12)) {
      const match = text(row.cover_url || row.thumbnail_url).match(/^\/api\/media\/([a-f0-9-]{36})$/i);
      if (!match) continue;
      const asset = await client.rpc("cms_public_asset", { asset_id: match[1] }).maybeSingle<{ bucket_id: string; path: string; mime_type: string }>();
      if (!asset.data || !["image/jpeg", "image/png"].includes(asset.data.mime_type)) continue;
      const file = await client.storage.from(asset.data.bucket_id).download(asset.data.path);
      if (file.data && file.data.size <= 5 * 1024 * 1024)
        images[text(row.id)] = `data:${asset.data.mime_type};base64,${Buffer.from(await file.data.arrayBuffer()).toString("base64")}`;
    }

    const bytes = await renderToBuffer(PortfolioPdf({ bundle, version, url, qr, images }));
    const fresh = await readPublicBundle();
    if (changedSinceRender(bundle, fresh))
      return Response.json({ error: "Konten berubah saat PDF disiapkan. Silakan unduh kembali." }, { status: 409, headers });

    const safeOwner = owner.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "portofolio";
    const filename = `${safeOwner}-portofolio-lengkap-${new Date().toISOString().slice(0, 10)}.pdf`;
    return new Response(new Uint8Array(bytes), {
      headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"` },
    });
  } catch {
    return Response.json({ error: "PDF belum dapat dibuat. Silakan coba lagi." }, { status: 503, headers });
  }
}
