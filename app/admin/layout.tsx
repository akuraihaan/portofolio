import { requireActor } from "@/lib/auth";
import { modules } from "@/lib/domain";
import { AdminShellClient } from "@/components/admin-editorial/AdminShellClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Workspace · BWORIEY",
  robots: { index: false, follow: false },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireActor();

  // Check module view permissions
  const allowed = (
    await Promise.all(
      Object.entries(modules).map(async ([key, m]) => {
        const { data } = await actor.client.rpc("has_permission", {
          required_permission: m.view,
        });
        return data ? { key, label: m.label } : null;
      }),
    )
  ).filter((m): m is { key: string; label: string } => m !== null);

  // Compute unread contact messages count for notification badge
  const { count: unreadCount } = await actor.client
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("status", "unread");

  return (
    <AdminShellClient
      actor={{
        user: { email: actor.user.email },
        profile: {
          id: actor.profile.id,
          full_name: actor.profile.full_name,
        },
      }}
      allowed={allowed}
      unreadMessagesCount={unreadCount || 0}
    >
      {children}
    </AdminShellClient>
  );
}
