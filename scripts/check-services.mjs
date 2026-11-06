// Read-only deployment preflight. Never prints credentials or user records.
import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error(
    "FAIL: konfigurasi URL/publishable key Supabase belum tersedia.",
  );
  process.exit(1);
}
const headers = { apikey: key, Authorization: `Bearer ${key}` };
let failed = false;
const tables = [
  "page_sections",
  "projects",
  "content_revisions",
  "content_history",
  "content_trash",
  "translations",
  "media_assets",
  "contact_messages",
];
await Promise.all(
  tables.map(async (table) => {
    try {
      const response = await fetch(
        `${url}/rest/v1/${table}?select=id&limit=0`,
        { headers, signal: AbortSignal.timeout(15000) },
      );
      const result = await response.json();
      const denied = response.status === 401 || response.status === 403;
      const okay = response.ok || (denied && result.code !== "PGRST205");
      if (!okay) failed = true;
      console.log(
        `${okay ? "OK" : "FAIL"} ${table}: ${response.ok ? "tersedia" : denied ? "akses anonim ditolak" : result.code || response.status}`,
      );
    } catch {
      failed = true;
      console.log(`FAIL ${table}: koneksi tidak tersedia`);
    }
  }),
);
try {
  // The checked-in RPC rejects null arguments before any write. This probes
  // the signature and validation, never sending a valid contact message.
  const response = await fetch(`${url}/rest/v1/rpc/cms_submit_contact`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      p_name: null,
      p_email: null,
      p_subject: null,
      p_message: null,
      p_submission_id: null,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  const contact = result?.code === "22023";
  console.log(
    `${contact ? "OK" : "FAIL"} cms_submit_contact: ${contact ? "validasi publik menolak input kosong" : result?.code || response.status}`,
  );
  if (!contact) failed = true;
} catch {
  failed = true;
  console.log("FAIL: kontrak RPC publik belum dapat diperiksa.");
}
const canonical = process.env.NEXT_PUBLIC_SITE_URL;
if (!canonical || !/^https:\/\//.test(canonical)) {
  failed = true;
  console.log("FAIL: NEXT_PUBLIC_SITE_URL HTTPS production belum diatur.");
}
console.log(
  "Pemeriksaan ini tidak membuktikan seluruh kebijakan RLS, login, storage, atau pengiriman pesan. Uji alur dengan akun admin setelah migrasi.",
);
process.exitCode = failed ? 1 : 0;
