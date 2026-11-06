import Link from "next/link";
import { requireActor } from "@/lib/auth";
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const actor = await requireActor(),
    search = await searchParams,
    days = [7, 30, 90].includes(Number(search.days)) ? Number(search.days) : 30;
  const since = new Date(new Date().getTime() - days * 86400000).toISOString();
  const { data, error } = await actor.client
    .from("portfolio_events")
    .select("event_type,path,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);
  const counts: Record<string, number> = {},
    pages: Record<string, number> = {};
  for (const row of data || []) {
    counts[row.event_type] = (counts[row.event_type] || 0) + 1;
    if (row.event_type === "page_view")
      pages[row.path] = (pages[row.path] || 0) + 1;
  }
  return (
    <>
      <p className="eyebrow">Analitik · Asia/Makassar</p>
      <h1>Interaksi yang tercatat.</h1>
      <p>
        {days} hari terakhir. Kunjungan tidak menunjukkan lamaran atau tawaran
        kerja. Halaman ini menampilkan paling banyak 10.000 peristiwa terbaru
        dalam periode tersebut.
      </p>
      <nav className="actions">
        {[7, 30, 90].map((n) => (
          <Link
            className="pill"
            key={n}
            href={"/admin/analytics?days=" + n}
            aria-current={days === n ? "page" : undefined}
          >
            {n} hari
          </Link>
        ))}
      </nav>
      {error ? (
        <p role="alert">Analitik belum tersedia. Periksa migrasi database.</p>
      ) : !data?.length ? (
        <p className="empty-state">Belum ada data untuk periode ini.</p>
      ) : (
        <>
          <div className="flat-grid">
            {Object.entries({
              page_view: "Halaman dibuka",
              project_view: "Studi kasus dibuka",
              contact_click: "Klik kontak",
              contact_submit: "Pesan tersimpan",
              portfolio_pdf_download: "PDF dilayani",
              cv_download: "CV dilayani",
            }).map(([key, label]) => (
              <article className="flat-card" key={key}>
                <h3>{label}</h3>
                <p>{counts[key] ?? "Belum ada data"}</p>
              </article>
            ))}
          </div>
          <h2>Halaman yang dibuka</h2>
          <ol>
            {Object.entries(pages)
              .sort((a, b) => b[1] - a[1])
              .map(([path, count]) => (
                <li key={path}>
                  <Link href={path}>{path}</Link> · {count}
                </li>
              ))}
          </ol>
        </>
      )}
    </>
  );
}
