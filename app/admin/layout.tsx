import Link from "next/link";
import { requireActor } from "@/lib/auth";
import { modules, text } from "@/lib/domain";
import { logout } from "@/app/actions";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const actor = await requireActor();
  const allowed = await Promise.all(
    Object.entries(modules).map(async ([key, m]) => {
      const { data } = await actor.client.rpc("has_permission", {
        required_permission: m.view,
      });
      return data ? { key, label: m.label } : null;
    }),
  );
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <Link href="/admin">Content studio ↗</Link>
        <p>{text(actor.profile.full_name)}</p>
        <nav aria-label="Modul admin">
          {Object.entries({
            Konten: [
              "profile",
              "projects",
              "skills",
              "experiences",
              "educations",
              "certificates",
              "achievements",
              "articles",
              "playground",
              "services",
              "testimonials",
            ],
            Publikasi: [
              "sections",
              "navigation",
              "statistics",
              "portfolio_versions",
              "translations",
            ],
            Media: ["media", "project_media"],
            Pesan: ["messages"],
            Pengaturan: [
              "settings",
              "social_links",
              "users",
              "roles",
              "permissions",
              "security",
              "login_history",
            ],
          }).map(([group, keys]) => (
            <div className="nav-group" key={group}>
              <p className="eyebrow">{group}</p>
              {allowed
                .filter((m) => m && keys.includes(m.key))
                .map(
                  (m) =>
                    m && (
                      <Link key={m.key} href={"/admin/" + m.key}>
                        {m.label}
                      </Link>
                    ),
                )}
            </div>
          ))}
        </nav>
        <Link href="/admin/history">Riwayat & tempat sampah</Link>
        <Link href="/admin/analytics">Analitik</Link>
        <Link href="/admin/account-security">Autentikasi dua langkah</Link>
        <Link href="/">Lihat situs ↗</Link>
        <form action={logout}>
          <button>Keluar</button>
        </form>
      </aside>
      <main id="main" className="admin-main">
        {children}
      </main>
    </div>
  );
}
