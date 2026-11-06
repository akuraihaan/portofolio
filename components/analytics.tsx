"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
const delivered = new Set<string>();
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !/^\/(en\/)?(projects(\/[a-z0-9-]+)?|articles(\/[a-z0-9-]+)?|playground(\/[a-z0-9-]+)?|portfolio\/[a-z0-9-]+|privacy)?$/.test(
        pathname,
      )
    )
      return;
    function record(type: string) {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: crypto.randomUUID(), type, path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }
    if (!delivered.has(pathname)) {
      delivered.add(pathname);
      record("page_view");
      if (pathname.startsWith("/projects/")) record("project_view");
    }
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (
        link &&
        /^(mailto:|tel:|https:\/\/wa\.me\/)/.test(
          link.getAttribute("href") || "",
        )
      )
        record("contact_click");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [pathname]);
  return null;
}
