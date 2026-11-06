import "server-only";
import { requireActor } from "./auth";
import { modules, validatePayload, text, type Row } from "./domain";
import { revalidatePath, revalidateTag } from "next/cache";
export type SaveResult = {
  ok?: boolean;
  error?: string;
  fields?: Record<string, string>;
  id?: string;
  revisionId?: string;
  updatedAt?: string;
};
export async function mutateEntry(
  moduleKey: string,
  id: string,
  input: Row,
  intent: "draft" | "publish" | "hide" | "delete",
  expected?: string,
): Promise<SaveResult> {
  const definition = modules[moduleKey];
  if (!definition || definition.readOnly || !/^[\da-f-]{36}$/i.test(id))
    return { error: "Konten tidak valid." };
  const actor = await requireActor(definition.permission);
  try {
    const current = await actor.client
      .from(definition.table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (current.error) throw current.error;
    if (
      moduleKey === "portfolio_versions" &&
      current.data &&
      current.data.owner_id !== actor.user.id
    )
      return { error: "Versi ini milik pengguna lain." };
    if (moduleKey === "profile" && !current.data)
      return {
        error: "Profil harus berasal dari akun Supabase yang sudah ada.",
      };
    if (intent === "delete") {
      if (moduleKey === "profile")
        return {
          error: "Penghapusan akun dilakukan melalui pengelolaan akun.",
        };
      const result = await actor.client.rpc("cms_trash_content", {
        p_table: definition.table,
        p_target: id,
      });
      if (result.error) throw result.error;
    } else if (intent === "hide") {
      if (!definition.status)
        return { error: "Modul ini tidak mempunyai status tersembunyi." };
      const value =
        definition.status === "status"
          ? "hidden"
          : definition.status === "visibility"
            ? "disabled"
            : false;
      const result = await actor.client
        .from(definition.table)
        .update({ [definition.status]: value })
        .eq("id", id);
      if (result.error) throw result.error;
    } else {
      const { payload, errors } = validatePayload(moduleKey, input);
      if (moduleKey === "testimonials" && intent === "publish" && payload.publication_consent !== true) return {error:"Izin pemberi testimoni harus dikonfirmasi sebelum publikasi.",fields:{publication_consent:"Konfirmasikan izin publikasi."}};
      if (
        moduleKey === "translations" &&
        intent === "publish" &&
        payload.source_type !== "home"
      ) {
        const sources: Record<string, string> = {
          projects: "project_id",
          articles: "article_id",
          playground: "playground_id",
        };
        const table = text(payload.source_type),
          field = sources[table];
        if (!field || !text(payload[field]))
          return {
            error: "Pilih satu sumber yang sesuai dengan jenis halaman.",
          };
        const source = await actor.client
          .from(table)
          .select("updated_at,status")
          .eq("id", payload[field])
          .maybeSingle();
        if (source.error || source.data?.status !== "published")
          return { error: "Sumber harus diterbitkan sebelum terjemahan." };
        payload.source_updated_at = source.data.updated_at;
      }
      const fields =
        intent === "draft"
          ? Object.fromEntries(
              Object.entries(errors).filter(
                ([, message]) => message !== "Wajib diisi.",
              ),
            )
          : errors;
      if (Object.keys(fields).length)
        return { error: "Periksa field yang ditandai.", fields };
      const draft = await actor.client
        .from("content_revisions")
        .select("id,updated_at,base_updated_at")
        .eq("target_table", definition.table)
        .eq("target_id", id)
        .maybeSingle();
      if (draft.error) throw draft.error;
      if (expected && draft.data && draft.data.updated_at !== expected)
        return {
          error:
            "Draft telah diubah di tempat lain. Muat ulang untuk menghindari penimpaan.",
        };
      const saved = await actor.client
        .rpc("cms_save_revision", {
          p_table: definition.table,
          p_target: id,
          p_payload: payload,
          p_expected: expected || null,
          p_base:
            draft.data?.base_updated_at ??
            input.updated_at ??
            current.data?.updated_at ??
            null,
        })
        .single<{ id: string; updated_at: string }>();
      if (saved.error) throw saved.error;
      if (intent === "draft")
        return {
          ok: true,
          id,
          revisionId: saved.data.id,
          updatedAt: saved.data.updated_at,
        };
      const published = await actor.client.rpc("cms_publish_revision", {
        revision_id: saved.data.id,
      });
      if (published.error)
        return {
          error:
            "Revisi tersimpan, tetapi publikasi gagal: " +
            published.error.message,
          updatedAt: saved.data.updated_at,
        };
    }
    revalidateTag("portfolio-public", { expire: 0 });
    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (error) {
    const issue = error as { code?: string; message?: string };
    return {
      error:
        issue.code === "23505"
          ? "Alamat sudah digunakan; pilih slug lain."
          : issue.code === "40001"
            ? issue.message
            : "Operasi belum berhasil. " +
              (issue.message || "Periksa koneksi, schema, dan izin."),
    };
  }
}
export async function messageStatus(
  id: string,
  status: string,
): Promise<SaveResult> {
  const actor = await requireActor("messages.update");
  if (!["unread", "read", "followed_up", "archived"].includes(status))
    return { error: "Status tidak valid." };
  const { error } = await actor.client
    .from("contact_messages")
    .update({ status })
    .eq("id", id);
  if (error) return { error: "Pesan belum diperbarui." };
  revalidatePath("/admin/messages");
  return { ok: true };
}
export async function roleAssignment(
  userId: string,
  roleId: string,
  remove: boolean,
): Promise<SaveResult> {
  const actor = await requireActor("roles.manage");
  if (userId === actor.user.id)
    return {
      error:
        "Peran akun sendiri tidak dapat dinaikkan atau dihapus dari panel ini.",
    };
  const query = remove
    ? actor.client
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role_id", roleId)
    : actor.client.from("user_roles").insert({
        user_id: userId,
        role_id: Number(roleId),
        assigned_by: actor.user.id,
      });
  const { error } = await query;
  if (error)
    return { error: "Perubahan peran ditolak: " + text(error.message) };
  revalidatePath("/admin/users");
  return { ok: true };
}
