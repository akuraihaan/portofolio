import type { NextConfig } from "next";

const defaultSupabaseUrl = "https://txsqhxhnamgteofarqfz.supabase.co";
const defaultKey = "sb_publishable_VJzrD1xlPgvCuMuNId2nyw_fJkd2zNf";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  defaultSupabaseUrl;

const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  defaultKey;

const config: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(supabaseUrl).hostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.phototourl.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default config;
