import { requireActor } from "@/lib/auth";
import { readPublicBundle } from "@/lib/data";
import { modules, object, text, type Row } from "@/lib/domain";
import { PublicShell, Portfolio } from "@/components/portfolio";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Preview privat",
  robots: { index: false, follow: false },
};
export default async function Preview() {
  const actor = await requireActor("settings.view"),
    b = await readPublicBundle();
  const { data, error } = await actor.client
    .from("content_revisions")
    .select("target_table,target_id,payload");
  if (error) throw new Error("Schema revisi privat belum tersedia.");
  for (const revision of data || []) {
    const key = Object.keys(modules).find(
      (k) => modules[k].table === revision.target_table && modules[k].public,
    );
    if (!key) continue;
    const previous =
      b.collections[key]?.data.find((row) => row.id === revision.target_id) ||
      {};
    const row: Row = {
      ...previous,
      ...object(revision.payload),
      id: revision.target_id,
    };
    b.collections[key] = {
      data: [
        ...(b.collections[key]?.data || []).filter((r) => r.id !== row.id),
        row,
      ].sort((a, c) => Number(a.sort_order || 0) - Number(c.sort_order || 0)),
      error: null,
    };
    if (key === "profile") b.profile = row;
    if (key === "settings") b.settings[text(row.key)] = row.value;
  }
  return (
    <>
      <div className="preview-banner">
        Preview privat · Semua revisi yang dapat Anda akses.
      </div>
      <PublicShell bundle={b} home>
        <Portfolio bundle={b} />
      </PublicShell>
    </>
  );
}
