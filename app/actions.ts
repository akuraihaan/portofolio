"use server";
import { mutateEntry, messageStatus, roleAssignment } from "@/lib/mutations";
import type { Row } from "@/lib/domain";
import { sessionClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { requireActor } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { prdDrafts } from "@/lib/prd-content";
import { modules, object, titleOf } from "@/lib/domain";
export async function importPrdDrafts() {
  const actor = await requireActor("settings.update");
  const report: string[] = [];
  for (const entry of prdDrafts) {
    const table = modules[entry.module].table;
    const [existing, drafts] = await Promise.all([
      actor.client
        .from(table)
        .select("id")
        .eq(entry.match, entry.data[entry.match])
        .limit(1),
      actor.client
        .from("content_revisions")
        .select("target_id,payload")
        .eq("target_table", table),
    ]);
    if (existing.error || drafts.error) {
      report.push(`${titleOf(entry.data)}: data belum dapat diperiksa.`);
      continue;
    }
    if (
      existing.data?.length ||
      drafts.data?.some(
        (row) =>
          row.target_id === entry.id ||
          object(row.payload)[entry.match] === entry.data[entry.match],
      )
    ) {
      report.push(`${titleOf(entry.data)}: sudah tersedia, dilewati.`);
      continue;
    }
    const saved = await mutateEntry(
      entry.module,
      entry.id,
      entry.data,
      "draft",
    );
    report.push(`${titleOf(entry.data)}: ${saved.error || "draf tersimpan."}`);
  }
  revalidatePath("/admin");
  return report;
}
export async function restoreContent(
  id: string,
  trash: boolean,
  expected?: string,
) {
  const actor = await requireActor();
  const { data, error } = await actor.client.rpc("cms_restore_content", {
    p_id: id,
    p_trash: trash,
    p_expected: expected || null,
  });
  if (error)
    return {
      error:
        error.code === "40001"
          ? "Draf berubah di tab lain. Muat ulang sebelum memulihkan."
          : "Pemulihan ditolak atau revisi telah kedaluwarsa.",
    };
  revalidatePath("/admin");
  return { id: String(data) };
}
export async function saveRole(input: {
  id?: number;
  name: string;
  label: string;
  description: string;
  permissions: number[];
}) {
  const actor = await requireActor("roles.manage");
  if (
    !/^[a-z][a-z0-9_]{1,63}$/.test(input.name) ||
    !input.label.trim() ||
    input.label.length > 120 ||
    input.description.length > 3000 ||
    input.permissions.some((id) => !Number.isSafeInteger(id))
  )
    return { error: "Periksa nama, label, dan permission." };
  const { error } = await actor.client.rpc("cms_update_role", {
    p_id: input.id || null,
    p_name: input.name,
    p_label: input.label,
    p_description: input.description,
    p_permissions: input.permissions,
  });
  if (error) return { error: "Perubahan peran ditolak: " + error.message };
  revalidatePath("/admin/roles");
  return { ok: true };
}
export async function userActivation(id: string, active: boolean) {
  const actor = await requireActor("users.update");
  if (id === actor.user.id)
    return { error: "Status akun sendiri tidak dapat diubah di sini." };
  const { error } = await actor.client
    .from("profiles")
    .update({ is_active: active })
    .eq("id", id);
  if (error) return { error: "Perubahan status ditolak." };
  revalidatePath("/admin/users");
  return { ok: true };
}
export async function mediaMetadata(id: string, alt: string, name: string) {
  const actor = await requireActor("media.manage");
  if (alt.length > 2000 || name.length > 240)
    return { error: "Teks terlalu panjang." };
  const { error } = await actor.client
    .from("media_assets")
    .update({ alt_text: alt, file_name: name })
    .eq("id", id);
  if (error) return { error: "Metadata belum tersimpan." };
  revalidatePath("/admin/media");
  return { ok: true };
}
export async function saveEntry(
  moduleKey: string,
  id: string,
  input: Row,
  intent: "draft" | "publish" | "hide" | "delete",
  expected?: string,
) {
  return mutateEntry(moduleKey, id, input, intent, expected);
}
export async function updateMessage(id: string, status: string) {
  return messageStatus(id, status);
}
export async function saveMessageNotes(id: string, notes: string) {
  const actor = await requireActor("messages.update");
  if (notes.length > 5000) return { error: "Catatan maksimal 5.000 karakter." };
  const { error } = await actor.client
    .from("contact_messages")
    .update({ internal_notes: notes })
    .eq("id", id);
  revalidatePath("/admin/messages");
  return error ? { error: "Catatan belum tersimpan." } : { ok: true };
}
export async function deleteMessage(id: string) {
  const actor = await requireActor("messages.delete");
  const { error } = await actor.client
    .from("contact_messages")
    .delete()
    .eq("id", id);
  revalidatePath("/admin/messages");
  return error ? { error: "Pesan belum dapat dihapus." } : { ok: true };
}
export async function assignRole(
  userId: string,
  roleId: string,
  remove = false,
) {
  return roleAssignment(userId, roleId, remove);
}
export async function logout() {
  const client = await sessionClient();
  await client.auth.signOut();
  redirect("/login");
}
export async function login(email: string, password: string) {
  if (!email || !password) return { error: "Email dan password wajib diisi." };
  const client = await sessionClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error)
    return {
      error: "Email atau password tidak sesuai, atau akun belum aktif.",
    };
  redirect("/admin");
}
export async function updatePassword(password: string) {
  if (password.length < 12) return { error: "Gunakan minimal 12 karakter." };
  const client = await sessionClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: "Sesi pemulihan tidak valid. Minta tautan baru." };
  const { error } = await client.auth.updateUser({ password });
  return error ? { error: "Password belum diperbarui." } : { ok: true };
}
