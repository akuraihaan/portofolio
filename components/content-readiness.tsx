import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { text } from "@/lib/domain";

export async function ContentReadiness({ client }: { client: SupabaseClient }) {
  const [sections, projects, settings] = await Promise.all([
    client.from("page_sections").select("id,section_key,is_visible"),
    client
      .from("projects")
      .select("id,title,status,summary,role,cover_url,technologies,case_study"),
    client.from("site_settings").select("key,value,resume_url"),
  ]);
  const notes: { label: string; href: string }[] = [];
  for (const key of ["hero", "about"]) {
    const row = sections.data?.find((item) => item.section_key === key);
    if (!row?.is_visible)
      notes.push({
        label: `${key === "hero" ? "Hero" : "Tentang"} belum diterbitkan. Lengkapi isi dan periksa pratinjaunya.`,
        href: row ? `/admin/sections/${row.id}` : "/admin/sections/new",
      });
  }
  const hasCv = settings.data?.some(
    (row) => row.resume_url || (row.key === "resume_url" && text(row.value)),
  );
  if (!hasCv)
    notes.push({
      label: "CV belum tersedia. Unggah PDF pada pengaturan resume_url.",
      href: "/admin/settings",
    });
  for (const row of projects.data || []) {
    const missing = [
      !row.summary && "ringkasan",
      !row.role && "peran",
      !row.cover_url && "tangkapan layar",
      !row.case_study && "proses",
    ].filter(Boolean);
    if (missing.length)
      notes.push({
        label: `${row.title}: lengkapi ${missing.join(", ")}.`,
        href: `/admin/projects/${row.id}`,
      });
  }
  return (
    <section className="flat-card" aria-labelledby="readiness-title">
      <h2 id="readiness-title">Isi yang perlu dilengkapi</h2>
      {sections.error || projects.error || settings.error ? (
        <p role="status">
          Pemeriksaan belum lengkap. Periksa koneksi dan migrasi database.
        </p>
      ) : null}
      {notes.length ? (
        <ul>
          {notes.map((note) => (
            <li key={note.href}>
              <Link href={note.href}>{note.label} ↗</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Field utama sudah terisi. Periksa ketepatan isi dan bukti sebelum
          menerbitkan.
        </p>
      )}
      <p>
        Tambahkan hasil, tanggal, tautan demo, dan bukti hanya jika tersedia.
        Proyek tanpa media tetap tampil sebagai teks.
      </p>
    </section>
  );
}
