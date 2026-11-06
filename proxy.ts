import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && request.nextUrl.pathname.startsWith("/design-preview"))
    return new NextResponse("Not found", {status:404,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex"}});
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  await client.auth.getClaims();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = {
  matcher: [
    "/design-preview/:path*",
    "/admin/:path*",
    "/preview/:path*",
    "/portfolio-builder",
    "/auth/:path*",
    "/login",
    "/reset-password",
    "/api/media/:path*",
  ],
};
