import Link from "next/link";
import { requireActor } from "@/lib/auth";
import { modules, object, titleOf } from "@/lib/domain";
import { RestoreContent } from "@/components/restore-content";
export default async function History({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; id?: string; trash?: string }>;
}) {
  const actor = await requireActor(),
    search = await searchParams,
    trash = search.trash === "1";
  const definition = search.module ? modules[search.module] : undefined;
  let query = actor.client
    .from(trash ? "content_trash" : "content_history")
    .select("*")
    .order(trash ? "deleted_at" : "created_at", { ascending: false })
    .limit(100);
  if (definition) query = query.eq("target_table", definition.table);
  if (search.id) query = query.eq("target_id", search.id);
  if (trash) query = query.gt("expires_at", new Date().toISOString());
  const { data, error } = await query;
  const drafts = await actor.client
    .from("content_revisions")
    .select("target_id,target_table,updated_at");
  return (
    <>
      <p className="eyebrow">Publikasi</p>
      <h1>{trash ? "Tempat sampah." : "Riwayat konten."}</h1>
      <p>
        Pemulihan menghasilkan draf yang dapat Anda periksa sebelum diterbitkan.
        Isi tempat sampah dapat dipulihkan selama 30 hari.
      </p>
      <nav className="actions">
        <Link className="pill" href="/admin/history">
          Riwayat
        </Link>
        <Link className="pill" href="/admin/history?trash=1">
          Tempat sampah
        </Link>
      </nav>
      {error ? (
        <p role="alert">
          Riwayat belum tersedia. Terapkan migrasi PRD pada database.
        </p>
      ) : (
        <div className="revision-list">
          {data?.map((row) => {
            const moduleKey = Object.keys(modules).find(
              (key) =>
                modules[key].table === row.target_table &&
                !modules[key].readOnly,
            );
            return (
              <article className="flat-card" key={row.id}>
                <p className="meta">
                  {moduleKey && modules[moduleKey].label} ·{" "}
                  {new Date(row.created_at || row.deleted_at).toLocaleString(
                    "id-ID",
                    { timeZone: "Asia/Makassar" },
                  )}{" "}
                  WITA
                </p>
                <h3>{titleOf(object(row.payload)) || "Konten"}</h3>
                <details>
                  <summary>Lihat isi revisi</summary>
                  <pre className="revision-json">
                    {JSON.stringify(row.payload, null, 2)}
                  </pre>
                </details>
                {moduleKey && !drafts.error && (
                  <RestoreContent
                    id={row.id}
                    trash={trash}
                    moduleKey={moduleKey}
                    expected={
                      drafts.data?.find(
                        (draft) =>
                          draft.target_id === row.target_id &&
                          draft.target_table === row.target_table,
                      )?.updated_at
                    }
                  />
                )}
              </article>
            );
          })}
          {!data?.length && (
            <p className="empty-state">Belum ada riwayat untuk pilihan ini.</p>
          )}
        </div>
      )}
    </>
  );
}
