import "server-only";
import { cache } from "react";
import { publicClient, credentials } from "./supabase/server";
import {
  modules,
  type Row,
  type Json,
  publicRow,
  text,
  object,
} from "./domain";
export type Collection = { data: Row[]; error: string | null };
export type Bundle = {
  collections: Record<string, Collection>;
  settings: Row;
  profile: Row | null;
};
export function assetUrl(value: Json | undefined): string | undefined {
  const raw = text(value);
  if (!raw) return undefined;
  if (/^https?:\/\//.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  return (
    credentials().url +
    "/storage/v1/object/public/portfolio-public/" +
    raw
      .replace(/^portfolio-public\//, "")
      .split("/")
      .map(encodeURIComponent)
      .join("/")
  );
}
function resolveRow(row: Row): Row {
  const copy = { ...row };
  for (const [key, value] of Object.entries(row))
    if (key.endsWith("_path") && value)
      copy[key.replace(/_path$/, "_url")] = assetUrl(value) || null;
  if (!copy.cover_url && copy.cover_image_url)
    copy.cover_url = copy.cover_image_url;
  if (!copy.thumbnail_url && copy.cover_url)
    copy.thumbnail_url = copy.cover_url;
  if (!copy.certificate_url && copy.image_url)
    copy.certificate_url = copy.image_url;
  return copy;
}
export async function readPublicBundle(): Promise<Bundle> {
  const entries = Object.entries(modules).filter(([, m]) => m.public);
  const collections: Record<string, Collection> = {};
  let client: ReturnType<typeof publicClient>;
  try {
    client = publicClient();
  } catch {
    return {
      collections: Object.fromEntries(
        entries.map(([key]) => [
          key,
          { data: [], error: "Supabase belum dikonfigurasi." },
        ]),
      ),
      settings: {},
      profile: null,
    };
  }
  await Promise.all(
    entries.map(async ([key, module]) => {
      let query = client
        .from(module.table)
        .select(
          key === "profile"
            ? "id,full_name,username,bio,avatar_url,avatar_path,phone,is_active,updated_at"
            : "*",
        );
      if (module.status === "status")
        query = query
          .eq("status", "published")
          .or(
            "published_at.is.null,published_at.lte." + new Date().toISOString(),
          );
      else if (module.status === "visibility")
        query = query
          .eq("visibility", "published")
          .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());
      else if (module.status) query = query.eq(module.status, true);
      if (key === "profile")
        query = query
          .not("full_name", "is", null)
          .neq("full_name", "")
          .order("updated_at", { ascending: true })
          .limit(100);
      else if (module.fields.some((field) => field.name === "sort_order"))
        query = query.order("sort_order");
      else query = query.order("updated_at", { ascending: false });
      try {
        const { data, error } = await query;
        collections[key] = {
          data: (data || []).map((row) =>
            resolveRow(publicRow(row as unknown as Row, module)),
          ),
          error: error
            ? `${module.label} tidak dapat dimuat (${error.code}).`
            : null,
        };
      } catch {
        collections[key] = {
          data: [],
          error: `${module.label} tidak dapat dimuat.`,
        };
      }
    }),
  );
  const settings: Row = {};
  for (const row of collections.settings?.data || []) {
    let value = row.value;
    if (typeof value === "string") {
      try {
        value = JSON.parse(value) as Json;
      } catch {}
    }
    settings[text(row.key)] = value;
    for (const field of [
      "resume_url",
      "hero_image_url",
      "logo_url",
      "og_image_url",
      "favicon_url",
    ])
      if (row[field]) settings[field] = row[field];
  }
  return {
    collections,
    settings,
    profile:
      collections.profile?.data.find(
        (row) => row.id === settings.owner_profile_id,
      ) ||
      collections.profile?.data.find(
        (row) => row.full_name === settings.owner_name,
      ) ||
      collections.profile?.data[0] ||
      null,
  };
}
// Deduplicate within one render only. Every new request rechecks RLS and
// publication status so hidden content cannot survive in a cross-request cache.
export const getPublicBundle = cache(readPublicBundle);
export async function withVersionSnapshot(
  bundle: Bundle,
  version: Row,
): Promise<Bundle> {
  const { data, error } = await publicClient().rpc(
    "cms_public_version_snapshot",
    { p_id: version.id },
  );
  if (error)
    throw new Error("Snapshot versi belum tersedia. Periksa migrasi database.");
  if (!data)
    throw new Error(
      "Versi ini perlu diterbitkan ulang untuk membuat snapshot.",
    );
  const snapshot = object(data);
  const collections = { ...bundle.collections };
  for (const key of [
    "projects",
    "skills",
    "experiences",
    "educations",
    "certificates",
    "articles",
  ]) {
    const activeIds = new Set(
      bundle.collections[key]?.data.map((row) => row.id),
    );
    collections[key] = {
      data: (Array.isArray(snapshot[key]) ? snapshot[key] : [])
        .map(object)
        .filter((row) => activeIds.has(row.id))
        .map((row) => resolveRow(publicRow(row, modules[key]))),
      error: null,
    };
  }
  collections.sections = {
    data: (Array.isArray(snapshot._sections) ? snapshot._sections : [])
      .map(object)
      .map((row) => resolveRow(publicRow(row, modules.sections))),
    error: null,
  };
  const settings: Row = {};
  for (const entry of Array.isArray(snapshot._settings)
    ? snapshot._settings
    : []) {
    const row = object(entry);
    let value = row.value;
    if (typeof value === "string") {
      try {
        value = JSON.parse(value) as Json;
      } catch {}
    }
    settings[text(row.key)] = value;
  }
  // Routing configuration remains current; published identity/copy is frozen.
  settings.site_url = bundle.settings.site_url;
  return {
    ...bundle,
    collections,
    settings,
    profile: snapshot._profile
      ? resolveRow(publicRow(object(snapshot._profile), modules.profile))
      : null,
  };
}
export { selectVersion } from "./presentation";
export { origin } from "./domain";
