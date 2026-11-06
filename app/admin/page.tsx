import Link from "next/link";
import { requireActor } from "@/lib/auth";
import { PrdImport } from "@/components/prd-import";
import { ContentReadiness } from "@/components/content-readiness";
export default async function Dashboard() {
  const actor = await requireActor();
  const counts = await Promise.all(
    ["projects", "articles", "contact_messages", "content_revisions"].map(
      async (table) => {
        const { count, error } = await actor.client
          .from(table)
          .select("*", { count: "exact", head: true });
        return { table, count, error };
      },
    ),
  );
  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1>Kelola portofolio.</h1>
      <p>Kelola konten, simpan revisi privat, lalu terbitkan ketika siap.</p>
      <div className="flat-grid">
        {counts.map((item) => (
          <article className="flat-card" key={item.table}>
            <h3>
              {
                (
                  {
                    projects: "Proyek",
                    articles: "Artikel",
                    contact_messages: "Pesan",
                    content_revisions: "Revisi privat",
                  } as Record<string, string>
                )[item.table]
              }
            </h3>
            <p>
              {item.error
                ? "Belum dapat dimuat (" + item.error.code + ")"
                : item.count}
            </p>
          </article>
        ))}
      </div>
      <div className="actions">
        <Link className="pill" href="/admin/projects/new">
          Tambah proyek
        </Link>
        <Link className="pill" href="/admin/portfolio_versions/new">
          Buat versi portofolio
        </Link>
      </div>
      <PrdImport />
      <ContentReadiness client={actor.client} />
    </>
  );
}
