// Next's internal URL can use localhost behind a proxy. Compare browser Origin
// to the actual Host or X-Forwarded-Host header (critical for Vercel deployment),
// which browsers cannot override cross-origin.
export function isSameOrigin(request: Request) {
  try {
    const originHeader = request.headers.get("origin");
    if (!originHeader) return true;
    const origin = new URL(originHeader);
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "";
    return (
      ["http:", "https:"].includes(origin.protocol) &&
      (origin.host === host ||
        origin.host.split(":")[0] === host.split(":")[0])
    );
  } catch {
    return false;
  }
}
