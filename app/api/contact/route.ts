import { isSameOrigin } from "@/lib/request-security";
import { NextResponse, type NextRequest } from "next/server";
import { submitContact } from "@/lib/contact";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return NextResponse.json(
      { error: "Asal permintaan tidak valid." },
      { status: 403 },
    );
  if (Number(request.headers.get("content-length") || 0) > 12000)
    return NextResponse.json(
      { error: "Pesan terlalu besar." },
      { status: 413 },
    );
  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    if (JSON.stringify(body).length > 12000) throw new Error();
  } catch {
    return NextResponse.json({ error: "Format tidak valid." }, { status: 400 });
  }
  const result = await submitContact(body);
  return NextResponse.json(result.body, {
    status: result.status,
    headers: {
      "Cache-Control": "no-store",
      ...(result.status === 429 ? { "Retry-After": "900" } : {}),
    },
  });
}
