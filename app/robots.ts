import type { MetadataRoute } from "next";
import { origin } from "@/lib/data";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/preview",
        "/design-preview",
        "/auth",
        "/api",
        "/login",
        "/reset-password",
        "/portfolio-builder",
      ],
    },
    sitemap: origin() + "/sitemap.xml",
  };
}
