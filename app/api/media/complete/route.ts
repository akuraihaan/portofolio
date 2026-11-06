import { isSameOrigin } from "@/lib/request-security";
import { NextResponse, type NextRequest } from "next/server";
import { requireActor } from "@/lib/auth";
import { validateUpload, validSignature } from "@/lib/upload-validation";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Asal permintaan tidak valid." },
      { status: 403 },
    );
  const actor = await requireActor("media.manage");
  let id;
  try {
    id = (await request.json()).id;
  } catch {
    return NextResponse.json(
      { error: "Permintaan tidak valid." },
      { status: 422 },
    );
  }
  if (typeof id !== "string" || !/^[a-f0-9-]{36}$/i.test(id))
    return NextResponse.json({ error: "ID tidak valid." }, { status: 422 });
  const { data: asset } = await actor.client
    .from("media_assets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", actor.user.id)
    .eq("bucket_id", "portfolio-private")
    .maybeSingle();
  if (!asset)
    return NextResponse.json(
      { error: "Media tidak tersedia." },
      { status: 404 },
    );
  const { data: file, error } = await actor.client.storage
    .from(asset.bucket_id)
    .download(asset.path);
  if (error || !file)
    return NextResponse.json(
      { error: "File belum selesai diunggah. Coba kembali." },
      { status: 409 },
    );
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (
    file.size !== asset.size_bytes ||
    validateUpload(asset.file_name, asset.mime_type, file.size).error ||
    !validSignature(bytes, asset.mime_type)
  )
    return NextResponse.json(
      { error: "Isi file tidak sesuai metadata. Unggah file yang valid." },
      { status: 422 },
    );
  const saved = await actor.client
    .from("media_assets")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", id);
  if (saved.error)
    return NextResponse.json(
      { error: "Verifikasi media belum tersimpan." },
      { status: 503 },
    );
  return NextResponse.json(
    { id, url: "/api/media/" + id, path: "" },
    { status: 201, headers: { "Cache-Control": "private, no-store" } },
  );
}
