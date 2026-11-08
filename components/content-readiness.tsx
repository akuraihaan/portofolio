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
    <section className="p-6 border-2 border-[#171816]/20 dark:border-white/10 bg-white dark:bg-[#1C1F1A] shadow-pixel dark:shadow-pixel-lime" aria-labelledby="readiness-title">
      <div className="pb-4 border-b border-black/5 dark:border-white/5 mb-4">
        <h3 id="readiness-title" className="font-display font-bold text-lg text-charcoal dark:text-white">
          Kesiapan Konten Portofolio
        </h3>
        <p className="font-mono text-xs text-charcoal/50 dark:text-white/40">
          Audit otomatis kelengkapan data publikasi
        </p>
      </div>

      {sections.error || projects.error || settings.error ? (
        <p role="status" className="p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-xs border border-amber-500/20">
          Pemeriksaan belum lengkap. Periksa koneksi dan migrasi database.
        </p>
      ) : null}

      {notes.length ? (
        <ul className="space-y-2 font-mono text-xs my-4">
          {notes.slice(0, 5).map((note) => (
            <li key={note.href} className="p-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <Link href={note.href} className="flex items-center justify-between text-charcoal/80 dark:text-white/80 hover:text-forest dark:hover:text-lime">
                <span>{note.label}</span>
                <span className="font-bold">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono text-xs border border-emerald-500/20 my-4 flex items-center gap-2">
          <span>✓</span>
          <span>Seluruh field utama portofolio lengkap dan siap diterbitkan.</span>
        </div>
      )}

      <p className="text-xs text-charcoal/50 dark:text-white/40 font-mono">
        Tambahkan tautan demo, hasil penelitian, dan sertifikat hanya jika bukti riil tersedia.
      </p>
    </section>
  );
}
