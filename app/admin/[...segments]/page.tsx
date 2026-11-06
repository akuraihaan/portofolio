import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireActor } from "@/lib/auth";
import {
  modules,
  aliases,
  text,
  titleOf,
  object,
  type Row,
} from "@/lib/domain";
import { ContentEditor } from "@/components/content-editor";
import {
  RoleManager,
  AccountStatus,
  MediaMetadata,
} from "@/components/role-manager";
import {
  InboxStatus,
  RoleEditor,
  UploadLibrary,
} from "@/components/admin-special";
type Props = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{
    q?: string;
    page?: string;
    status?: string;
    duplicate?: string;
    section?: string;
  }>;
};
export default async function ModulePage({ params, searchParams }: Props) {
  const { segments } = await params;
  if (segments[0] === "preview") {
    await requireActor("settings.view");
    redirect("/preview");
  }
  if (segments[0] === "pdf") {
    await requireActor("settings.view");
    redirect("/admin/portfolio_versions");
  }
  const key = aliases[segments[0]] || segments[0],
    definition = modules[key];
  if (!definition || segments.length > 2) notFound();
  const actor = await requireActor(definition.view),
    search = await searchParams;
  if (
    key === "sections" &&
    segments[1] &&
    segments[1] !== "new" &&
    !/^[a-f0-9-]{36}$/i.test(segments[1])
  ) {
    const { data, error } = await actor.client
      .from("page_sections")
      .select("id")
      .eq("section_key", segments[1])
      .maybeSingle();
    if (error) throw error;
    redirect(
      data
        ? "/admin/sections/" + data.id
        : "/admin/sections/new?section=" + encodeURIComponent(segments[1]),
    );
  }
  if (segments[1] && !definition.readOnly) {
    await requireActor(definition.permission);
    const isNew = segments[1] === "new",
      id = isNew ? randomUUID() : segments[1];
    if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
    const sourceId = isNew ? search.duplicate : id;
    let initial: Row =
      key === "sections" && search.section
        ? { section_key: search.section, section_name: search.section }
        : {};
    if (sourceId) {
      const result = await actor.client
        .from(definition.table)
        .select("*")
        .eq("id", sourceId)
        .maybeSingle();
      if (result.error)
        return (
          <p role="alert">Konten tidak dapat dimuat ({result.error.code}).</p>
        );
      if (!result.data && search.duplicate) notFound();
      initial = result.data || {};
      if (search.duplicate) {
        initial = {
          ...initial,
          title: text(initial.title)
            ? text(initial.title) + " (salinan)"
            : undefined,
          slug: initial.slug
            ? text(initial.slug) + "-salinan-" + id.slice(0, 6)
            : undefined,
        };
        delete initial.id;
        delete initial.owner_id;
        delete initial.created_by;
        delete initial.status;
        delete initial.visibility;
      }
    }
    const revision = await actor.client
      .from("content_revisions")
      .select("payload,updated_at")
      .eq("target_table", definition.table)
      .eq("target_id", id)
      .maybeSingle();
    if (revision.error)
      return (
        <>
          <h1>Editor belum tersedia.</h1>
          <p role="alert">
            Schema revisi privat belum siap ({revision.error.code}). Terapkan
            migrasi Next CMS sebelum menyunting.
          </p>
        </>
      );
    if (revision.data)
      initial = { ...initial, ...object(revision.data.payload) };
    if (!isNew && !initial.id && !revision.data) notFound();
    const relations: Record<string, Row[]> = {};
    const relationResults = await Promise.all(
      [
        ...new Set(
          definition.fields.flatMap((f) => (f.table ? [f.table] : [])),
        ),
      ].map(async (table) => ({
        table,
        ...(await actor.client.from(table).select("*").limit(1000)),
      })),
    );
    for (const result of relationResults) {
      if (result.error)
        return (
          <p role="alert">
            Pilihan relasi {result.table} gagal dimuat ({result.error.code}).
          </p>
        );
      relations[result.table] = result.data || [];
    }
    const media = await actor.client
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return (
      <ContentEditor
        key={
          key +
          id +
          text(initial.updated_at) +
          (revision.data?.updated_at || "")
        }
        moduleKey={key}
        id={id}
        initial={initial}
        revisionAt={revision.data?.updated_at}
        relations={relations}
        media={media.data || []}
      />
    );
  }
  const page = Math.max(1, Number(search.page) || 1),
    size = 25;
  let query = actor.client
    .from(definition.table)
    .select("*", { count: "exact" });
  if (search.status && definition.status)
    query = query.eq(
      definition.status,
      ["is_visible", "is_active", "is_public"].includes(definition.status)
        ? search.status === "true"
        : search.status,
    );
  if (key === "messages" && search.status) query=query.eq("status",search.status);
  if (key === "messages" && search.q) {
    const term=search.q.replace(/[^\p{L}\p{N}\s@.\-]/gu,"").slice(0,100);
    if(term) query=query.or(`name.ilike.%${term}%,email.ilike.%${term}%,metadata->>subject.ilike.%${term}%`);
  }
  const titleColumn = definition.fields.find((f) =>
    [
      "title",
      "name",
      "full_name",
      "label",
      "company",
      "institution",
      "key",
    ].includes(f.name),
  )?.name;
  if (search.q && titleColumn)
    query = query.ilike(titleColumn, "%" + search.q.replace(/[%_]/g, "") + "%");
  query = query.order(
    definition.fields.some((f) => f.name === "sort_order")
      ? "sort_order"
      : key === "permissions" || key === "roles"
        ? "id"
        : "created_at",
    { ascending: definition.fields.some((f) => f.name === "sort_order") },
  );
  const { data, error, count } = await query.range(
    (page - 1) * size,
    page * size - 1,
  );
  const rows = (data || []) as Row[];
  const revisions = definition.readOnly
    ? null
    : await actor.client
        .from("content_revisions")
        .select("target_id,payload,updated_at")
        .eq("target_table", definition.table)
        .order("updated_at", { ascending: false });
  const roles =
      key === "users" ? await actor.client.from("roles").select("*") : null,
    assignments =
      key === "users"
        ? await actor.client.from("user_roles").select("user_id,role_id")
        : null;
  const rolePermissions =
    key === "roles" ? await actor.client.from("permissions").select("*") : null;
  const roleMappings =
    key === "roles"
      ? await actor.client.from("role_permissions").select("*")
      : null;
  const href = (p: number) =>
    "/admin/" +
    key +
    "?" +
    new URLSearchParams({
      page: String(p),
      ...(search.q ? { q: search.q } : {}),
      ...(search.status ? { status: search.status } : {}),
    });
  return (
    <>
      <p className="eyebrow">Content studio</p>
      <h1>{definition.label}</h1>
      <div className="admin-toolbar">
        {!definition.readOnly && key !== "profile" && (
          <Link className="pill" href={"/admin/" + key + "/new"}>
            Tambah konten ＋
          </Link>
        )}
        <form>
          <input
            type="search"
            name="q"
            aria-label="Cari konten"
            placeholder="Cari judul…"
            defaultValue={search.q}
          />
          {definition.status && (
            <select
              name="status"
              aria-label="Filter status"
              defaultValue={search.status || ""}
            >
              <option value="">Semua status</option>
              {(definition.status === "status"
                ? ["draft", "published", "hidden", "archived"]
                : definition.status === "visibility"
                  ? ["draft", "published", "disabled"]
                  : ["true", "false"]
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          {key === "messages" && <select name="status" aria-label="Status pesan" defaultValue={search.status || ""}><option value="">Semua status</option>{Object.entries({unread:"Baru",read:"Dibaca",followed_up:"Ditindaklanjuti",archived:"Arsip"}).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select>}
          <button>Cari</button>
        </form>
      </div>
      {error ? (
        <p role="alert" className="notice">
          Data tidak dapat dimuat ({error.code}). Periksa migrasi dan izin akun.
        </p>
      ) : (
        <>
          {key === "media" && <UploadLibrary rows={rows} />}
          {key === "roles" && (
            <RoleManager
              roles={rows}
              permissions={rolePermissions?.data || []}
              mappings={roleMappings?.data || []}
            />
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Konten</th>
                  <th>Status / informasi</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={text(row.id)}>
                    <td>
                      {titleOf(row) || text(row.email) || text(row.id)}
                      {key === "messages" && (
                        <>
                          <p>{text(row.email)}</p>
                          <p>{text(row.message)}</p>
                        </>
                      )}
                    </td>
                    <td>
                      {text(row[definition.status || "status"]) ||
                        text(row.description) ||
                        text(row.mime_type) ||
                        text(row.created_at)}
                      {revisions?.data?.some((r) => r.target_id === row.id) && (
                        <p className="meta">Ada revisi privat</p>
                      )}
                    </td>
                    <td>
                      {key === "media" && <MediaMetadata row={row} />}{" "}
                      {key === "messages" ? (
                        <InboxStatus
                          id={text(row.id)}
                          status={text(row.status)}
                          email={text(row.email)}
                          notes={text(row.internal_notes)}
                        />
                      ) : key === "users" ? (
                        <>
                          <AccountStatus
                            id={text(row.id)}
                            active={row.is_active === true}
                          />
                          <RoleEditor
                            userId={text(row.id)}
                            roles={roles?.data || []}
                            assigned={(assignments?.data || [])
                              .filter((r) => r.user_id === row.id)
                              .map((r) => String(r.role_id))}
                          />
                        </>
                      ) : !definition.readOnly ? (
                        <>
                          <Link href={"/admin/" + key + "/" + text(row.id)}>
                            Sunting
                          </Link>
                          {key !== "profile" && (
                            <>
                              {" "}
                              ·{" "}
                              <Link
                                href={
                                  "/admin/" +
                                  key +
                                  "/new?duplicate=" +
                                  text(row.id)
                                }
                              >
                                Duplikat
                              </Link>
                            </>
                          )}
                        </>
                      ) : key === "media" ? (
                        <a
                          href={"/api/media/" + text(row.id)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buka media
                        </a>
                      ) : (
                        <details>
                          <summary>Detail</summary>
                          <dl>
                            {Object.entries(row).map(([k, v]) => (
                              <div key={k}>
                                <dt>{k}</dt>
                                <dd>
                                  {typeof v === "object"
                                    ? JSON.stringify(v)
                                    : text(v)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length && (
            <p className="empty-state">Tidak ada konten untuk filter ini.</p>
          )}
          <div className="actions">
            {page > 1 && (
              <Link className="pill" href={href(page - 1)}>
                ← Sebelumnya
              </Link>
            )}
            <span>
              Halaman {page} · {count ?? 0} konten
            </span>
            {page * size < (count || 0) && (
              <Link className="pill" href={href(page + 1)}>
                Berikutnya →
              </Link>
            )}
          </div>
        </>
      )}
      {revisions?.error && (
        <p className="notice">
          Revisi privat belum dapat dimuat ({revisions.error.code}).
        </p>
      )}
      {!!revisions?.data?.length && (
        <section>
          <h2>Revisi privat</h2>
          {revisions.data.map((r) => (
            <p key={r.target_id}>
              <Link href={"/admin/" + key + "/" + r.target_id}>
                {titleOf(object(r.payload)) || r.target_id}
              </Link>{" "}
              · {r.updated_at}
            </p>
          ))}
        </section>
      )}
    </>
  );
}
