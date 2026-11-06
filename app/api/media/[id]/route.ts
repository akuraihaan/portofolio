import { NextResponse, type NextRequest } from "next/server";
import { publicClient, sessionClient } from "@/lib/supabase/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id))
    return new NextResponse(null, { status: 404 });
  let client = publicClient();
  let asset = await client.rpc("cms_public_asset", { asset_id: id });
  if (!asset.data?.length) {
    const authenticated = await sessionClient();
    const {
      data: { user },
    } = await authenticated.auth.getUser();
    if (user) {
      client = authenticated;
      asset = await client.rpc("cms_public_asset", { asset_id: id });
    }
  }
  const row = asset.data?.[0];
  if (asset.error || !row)
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  const { data, error } = await client.storage
    .from(row.bucket_id)
    .download(row.path);
  if (error || !data) return new NextResponse(null, { status: 404 });
  return new NextResponse(data, {
    headers: {
      "Content-Type": row.mime_type,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `${request.nextUrl.searchParams.has("download") ? "attachment" : "inline"}; filename="${String(row.file_name).replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
    },
  });
}
