import { notFound } from "next/navigation";
import { requireActor } from "@/lib/auth";
import { readPublicBundle, type Bundle } from "@/lib/data";
import { modules, object, text, type Row } from "@/lib/domain";
import {
  Portfolio,
  PublicShell,
  Detail,
  ContentCards,
} from "@/components/portfolio";
import { VersionPage } from "@/components/version-page";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Preview privat",
  robots: { index: false, follow: false },
};
export default async function Preview({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module: key, id } = await params,
    definition = modules[key];
  if (!definition || definition.readOnly) notFound();
  const actor = await requireActor(definition.view);
  const [{ data: canonical }, { data: revision, error }] = await Promise.all([
    actor.client.from(definition.table).select("*").eq("id", id).maybeSingle(),
    actor.client
      .from("content_revisions")
      .select("payload")
      .eq("target_table", definition.table)
      .eq("target_id", id)
      .maybeSingle(),
  ]);
  if (error) throw new Error("Revisi belum dapat dimuat.");
  if (!canonical && !revision) notFound();
  const row: Row = { ...canonical, ...object(revision?.payload), id };
  const b: Bundle = await readPublicBundle();
  b.collections[key] = {
    data: [...(b.collections[key]?.data || []).filter((r) => r.id !== id), row],
    error: null,
  };
  if (key === "profile") b.profile = row;
  if (key === "settings") b.settings[text(row.key)] = row.value;
  return (
    <>
      <div className="preview-banner">
        Preview privat · Perubahan ini belum tentu tersedia di situs publik.
      </div>
      {key === "portfolio_versions" ? (
        <VersionPage bundle={b} version={row} preview />
      ) : ["projects", "articles", "playground"].includes(key) ? (
        <PublicShell bundle={b}>
          <Detail bundle={b} row={row} moduleKey={key} />
        </PublicShell>
      ) : [
          "profile",
          "settings",
          "sections",
          "navigation",
          "statistics",
        ].includes(key) ? (
        <PublicShell bundle={b}>
          <Portfolio bundle={b} />
        </PublicShell>
      ) : (
        <PublicShell bundle={b}>
          <main id="main" className="shell section">
            <h1>{definition.label}</h1>
            <ContentCards moduleKey={key} rows={[row]} />
          </main>
        </PublicShell>
      )}
    </>
  );
}
