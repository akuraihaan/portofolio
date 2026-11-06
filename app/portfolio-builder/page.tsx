import { requireActor } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Builder() {
  await requireActor("settings.update");
  redirect("/admin/portfolio_versions");
}
