import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { sessionClient } from "./supabase/server";
export const currentActor = cache(async () => {
  const client = await sessionClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("id,full_name,is_active")
    .eq("id", user.id)
    .single();
  if (profileError || !profile?.is_active) return null;
  return { client, user, profile };
});
export async function requireActor(permission = "dashboard.view") {
  const actor = await currentActor();
  if (!actor) redirect("/login");
  const assurance =
    await actor.client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance.error)
    throw new Error("Status keamanan sesi belum dapat diperiksa.");
  if (
    assurance.data.nextLevel === "aal2" &&
    assurance.data.currentLevel !== "aal2"
  )
    redirect("/auth/mfa");
  const { data, error } = await actor.client.rpc("has_permission", {
    required_permission: permission,
  });
  if (error || data !== true)
    throw new Error("Akun tidak memiliki izin untuk tindakan ini.");
  return actor;
}
