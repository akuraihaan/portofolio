import { isSameOrigin } from "@/lib/request-security";
import { NextResponse, type NextRequest } from "next/server";
import { requireActor } from "@/lib/auth";
import { validateUpload, validSignature } from "@/lib/upload-validation";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const actor = await requireActor("media.manage");
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Asal permintaan tidak valid." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") || 0) > 52 * 1024 * 1024)
    return NextResponse.json({ error: "File terlalu besar." }, { status: 413 });
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "Pilih file." }, { status: 422 });
  const { ext, error: validationError } = validateUpload(
    file.name,
    file.type,
    file.size,
  );
  if (validationError)
    return NextResponse.json({ error: validationError }, { status: 422 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const valid = validSignature(bytes, file.type);
  if (!valid)
    return NextResponse.json(
      { error: "Isi file tidak sesuai format." },
      { status: 422 },
    );
  const id = crypto.randomUUID(),
    path = actor.user.id + "/" + id + "." + ext;
  const uploaded = await actor.client.storage
    .from("portfolio-private")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (uploaded.error)
    return NextResponse.json(
      { error: "Upload gagal. Periksa bucket privat dan izin Storage." },
      { status: 503 },
    );
  const saved = await actor.client.from("media_assets").insert({
    id,
    owner_id: actor.user.id,
    created_by: actor.user.id,
    bucket_id: "portfolio-private",
    path,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    status: "draft",
    verified_at: new Date().toISOString(),
  });
  if (saved.error)
    return NextResponse.json(
      {
        error:
          "File terkirim tetapi metadata belum tersimpan. File lama tetap dipertahankan.",
      },
      { status: 503 },
    );
  return NextResponse.json(
    { id, url: "/api/media/" + id, path: "", fileName: file.name },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
