import { NextRequest } from "next/server";
import { isSameOrigin } from "@/lib/request-security";
import { publicClient, sessionClient } from "@/lib/supabase/server";
const headers = { "Cache-Control": "no-store" };
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request))
    return new Response(null, { status: 403, headers });
  if (
    process.env.PORTFOLIO_ANALYTICS !== "true" ||
    process.env.NODE_ENV !== "production"
  )
    return new Response(null, { status: 204, headers });
  try {
    if (Number(request.headers.get("content-length")) > 1000)
      return new Response(null, { status: 413, headers });
    const body = await request.json();
    if (
      !body ||
      typeof body.path !== "string" ||
      body.path.length > 240 ||
      !/^[a-f0-9-]{36}$/i.test(body.id) ||
      !["page_view", "project_view", "contact_click"].includes(body.type)
    )
      return new Response(null, { status: 422, headers });
    const client = await sessionClient();
    const { data } = await client.auth.getUser();
    if (data.user) return new Response(null, { status: 204, headers });
    await publicClient().rpc("cms_record_event", {
      p_id: body.id,
      p_type: body.type,
      p_path: body.path,
    });
  } catch {
    /* Analytics must not interrupt reading or sending a message. */
  }
  return new Response(null, { status: 204, headers });
}
