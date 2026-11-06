import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { PortfolioPdf } from "@/components/portfolio-pdf";
import {
  readPublicBundle,
  withVersionSnapshot,
  selectVersion,
  origin,
} from "@/lib/data";
import { publicClient } from "@/lib/supabase/server";
import { text } from "@/lib/domain";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  try {
    const bundle = await readPublicBundle();
    const version = bundle.collections.portfolio_versions?.data.find(
      (row) => row.slug === slug,
    );
    if (!version)
      return Response.json(
        { error: "Versi tidak tersedia." },
        { status: 404, headers },
      );
    const selected = selectVersion(
      await withVersionSnapshot(bundle, version),
      version,
    );
    if (!["projects","skills","experiences","educations","certificates","articles"].some(key=>selected.collections[key]?.data.length))
      return Response.json(
        { error: "Versi tidak memiliki karya yang dapat diakses." },
        { status: 404, headers },
      );
    const url = origin(bundle.settings) + "/portfolio/" + slug;
    const qr = await QRCode.toDataURL(url, { margin: 1 });
    const images: Record<string, string> = {};
    const client = publicClient();
    // Only verified media in our own configured storage can enter the renderer.
    for (const row of (selected.collections.projects?.data || []).slice(0, 30)) {
      const match = text(row.cover_url || row.thumbnail_url).match(
        /^\/api\/media\/([a-f0-9-]{36})$/i,
      );
      if (!match) continue;
      const asset = await client
        .rpc("cms_public_asset", { asset_id: match[1] })
        .maybeSingle<{ bucket_id: string; path: string; mime_type: string }>();
      if (
        !asset.data ||
        !["image/jpeg", "image/png"].includes(asset.data.mime_type)
      )
        continue;
      const file = await client.storage
        .from(asset.data.bucket_id)
        .download(asset.data.path);
      if (file.data && file.data.size <= 10 * 1024 * 1024)
        images[text(row.id)] =
          `data:${asset.data.mime_type};base64,${Buffer.from(await file.data.arrayBuffer()).toString("base64")}`;
    }
    const bytes = await renderToBuffer(
      PortfolioPdf({ bundle: selected, version, url, qr, images }),
    );
    // Do not serve a document if publication changed while it was rendered.
    const fresh = await readPublicBundle();
    const current = fresh.collections.portfolio_versions?.data.find(
      (row) => row.id === version.id,
    );
    if (!current || current.updated_at !== version.updated_at)
      return Response.json(
        { error: "Versi berubah. Silakan buat PDF lagi." },
        { status: 409, headers },
      );
    for (const [key, collection] of Object.entries(selected.collections)) {
      if (
        ![
          "projects",
          "skills",
          "experiences",
          "educations",
          "certificates",
          "articles",
        ].includes(key)
      )
        continue;
      const active = new Set(fresh.collections[key]?.data.map((row) => row.id));
      if (collection.data.some((row) => !active.has(row.id)))
        return Response.json(
          {
            error:
              "Sumber telah dicabut. Buat PDF baru dari konten yang masih aktif.",
          },
          { status: 409, headers },
        );
    }
    const owner = text(bundle.profile?.full_name)
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase();
    const filename = `${owner}-${slug}-${text(version.language) || "id"}-${new Date().toISOString().slice(0, 10)}.pdf`;
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return Response.json(
      {
        error: "PDF belum dapat dibuat. Periksa publikasi versi dan coba lagi.",
      },
      { status: 503, headers },
    );
  }
}
