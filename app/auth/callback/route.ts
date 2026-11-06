import { NextResponse, type NextRequest } from "next/server";
import { sessionClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code"),
    next = request.nextUrl.searchParams.get("next");
  const destination = next === "/reset-password" ? next : "/admin";
  if (code) {
    const client = await sessionClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destination, request.url));
  }
  return NextResponse.redirect(new URL("/login?error=callback", request.url));
}
