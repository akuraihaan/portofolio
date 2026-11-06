import { isSameOrigin } from "@/lib/request-security";
import { NextResponse, type NextRequest } from "next/server";
import { requireActor } from "@/lib/auth";
import { validateUpload } from "@/lib/upload-validation";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Asal permintaan tidak valid." },
      { status: 403 },
    );
  const actor = await requireActor("media.manage");
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Permintaan tidak valid." },
      { status: 422 },
    );
  }
  const name = String(input.name || "").slice(0, 240),
    type = String(input.type || ""),
    size = Number(input.size),
    validation = validateUpload(name, type, size);
  if (validation.error)
    return NextResponse.json({ error: validation.error }, { status: 422 });
  const id = crypto.randomUUID(),
    path = actor.user.id + "/" + id + "." + validation.ext;
  const saved = await actor.client.from("media_assets").insert({
    id,
    owner_id: actor.user.id,
    created_by: actor.user.id,
    bucket_id: "portfolio-private",
    path,
    file_name: name,
    mime_type: type,
    size_bytes: size,
    status: "draft",
    verified_at: null,
  });
  if (saved.error)
    return NextResponse.json(
      { error: "Metadata belum dapat disimpan. Periksa schema media." },
      { status: 503 },
    );
  const signed = await actor.client.storage
    .from("portfolio-private")
    .createSignedUploadUrl(path, { upsert: false });
  if (signed.error)
    return NextResponse.json(
      { error: "Izin unggah belum dapat dibuat." },
      { status: 503 },
    );
  return NextResponse.json(
    { id, signedUrl: signed.data.signedUrl },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
