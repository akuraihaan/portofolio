import Link from "next/link";
import { requireActor } from "@/lib/auth";
import { PrdImport } from "@/components/prd-import";
import { ContentReadiness } from "@/components/content-readiness";
import {
  FolderGit2,
  FileEdit,
  Award,
  Mail,
  Code2,
  Briefcase,
  Plus,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Settings,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const actor = await requireActor();

  // Fetch authentic real counts from Supabase
  const [
    publishedProjects,
    draftProjects,
    privateRevisions,
    certificates,
    unreadMessages,
    skills,
    experiences,
    recentProjects,
  ] = await Promise.all([
    actor.client
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    actor.client
      .from("projects")
      .select("id", { count: "exact", head: true })
      .neq("status", "published"),
    actor.client
      .from("content_revisions")
      .select("id", { count: "exact", head: true }),
    actor.client
      .from("certificates")
      .select("id", { count: "exact", head: true }),
    actor.client
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread"),
    actor.client
      .from("skills")
      .select("id", { count: "exact", head: true }),
    actor.client
      .from("experiences")
      .select("id", { count: "exact", head: true }),
    actor.client
      .from("projects")
      .select("id,title,status,category,updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
  ]);

  const metrics = [
    {
      title: "Proyek Diterbitkan",
      count: publishedProjects.count ?? 0,
      note: "Muncul di public portfolio",
      href: "/admin/projects?status=published",
      icon: FolderGit2,
      badge: "Public",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Draf & Revisi Privat",
      count: (draftProjects.count ?? 0) + (privateRevisions.count ?? 0),
      note: "Hanya tersimpan di admin",
      href: "/admin/projects?status=draft",
      icon: FileEdit,
      badge: "Private",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    {
      title: "Sertifikasi & Lisensi",
      count: certificates.count ?? 0,
      note: "Terverifikasi kredensial",
      href: "/admin/certificates",
      icon: Award,
      badge: "Kredensial",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      title: "Pesan Kontak Baru",
      count: unreadMessages.count ?? 0,
      note: "Menunggu respons admin",
      href: "/admin/messages?status=unread",
      icon: Mail,
      badge: (unreadMessages.count ?? 0) > 0 ? "Perlu Respons" : "Inbox Bersih",
      badgeColor: (unreadMessages.count ?? 0) > 0
        ? "bg-forest dark:bg-lime text-white dark:text-charcoal font-bold"
        : "bg-black/5 dark:bg-white/10 text-charcoal/60 dark:text-white/60",
    },
    {
      title: "Keahlian Terdata",
      count: skills.count ?? 0,
      note: "Frontend, Backend, Cloud",
      href: "/admin/skills",
      icon: Code2,
      badge: "Tech Stack",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      title: "Riwayat Pengalaman",
      count: experiences.count ?? 0,
      note: "Asisten Dosen, Workshop, Cohort",
      href: "/admin/experiences",
      icon: Briefcase,
      badge: "Timeline",
      badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Pixel Workbench Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10">
        <div>
          <div className="flex items-center gap-2 mb-2 font-pixel text-[9px] text-[#171816] dark:text-[#C8F169] tracking-wider uppercase">
            <span>[SYS.WORKBENCH]</span>
            <span>//</span>
            <span>PIXEL_3D_CMS · 2026</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#171816] dark:text-[#F4F3EE] tracking-tight leading-tight">
            Selamat datang, {actor.profile.full_name || "Taufik Raihandani"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#777970] dark:text-[#A1A49A] max-w-2xl leading-relaxed">
            Kelola seluruh konten portofolio BWORIEY secara dinamis. Simpan revisi sebagai draf privat, lalu terbitkan secara instan ke website publik tanpa perlu redeploy.
          </p>
        </div>

        {/* Live System Status */}
        <div className="p-4 border-2 border-[#171816] dark:border-[#C8F169] bg-white dark:bg-[#1C1F1A] shadow-pixel dark:shadow-pixel-lime flex flex-col gap-2 font-mono text-xs shrink-0 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-[#777970] dark:text-[#A1A49A]">Status Web:</span>
            <span className="flex items-center gap-1.5 font-bold text-[#171816] dark:text-[#C8F169]">
              <span className="w-2 h-2 bg-[#C8F169] animate-pulse"></span>
              <span>Online (Vercel)</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#777970] dark:text-[#A1A49A]">Database:</span>
            <span className="font-bold text-[#171816] dark:text-[#F4F3EE] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#171816] dark:text-[#C8F169]" />
              <span>Supabase RLS</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#777970] dark:text-[#A1A49A]">Cache Tag:</span>
            <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-[#171816] dark:text-[#F4F3EE]">
              portfolio-public
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-xl text-[#171816] dark:text-[#F4F3EE]">
            Statistik Konten Database Aktual
          </h2>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
            Dihitung langsung dari Supabase
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group p-6 border-2 border-[#171816]/20 dark:border-white/10 bg-white dark:bg-[#1C1F1A] shadow-pixel hover:shadow-pixel-lg dark:shadow-pixel-lime transition-all flex flex-col justify-between no-underline"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 bg-[#E9E8E1] dark:bg-[#111310] border border-black/10 dark:border-white/10 flex items-center justify-center text-[#171816] dark:text-[#F4F3EE] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#171816] dark:text-[#C8F169]" />
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-1 border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-mono text-xs font-bold text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider mb-1">
                    {item.title}
                  </h3>
                  <div className="font-display font-black text-4xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
                    {item.count}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                  <span>{item.note}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#171816] dark:text-[#C8F169] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="p-6 sm:p-8 border-2 border-[#171816]/20 dark:border-white/10 bg-white dark:bg-[#1C1F1A] shadow-pixel dark:shadow-pixel-lime">
        <h3 className="font-display font-black text-xl text-[#171816] dark:text-[#F4F3EE] mb-2">
          Aksi Cepat Pengelolaan
        </h3>
        <p className="text-xs text-[#777970] dark:text-[#A1A49A] mb-6 font-mono">
          Pintasan untuk membuat entri baru atau menyunting data utama portofolio.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/projects/new"
            className="flex flex-col items-center justify-center text-center p-4 border border-[#171816]/20 dark:border-white/10 bg-[#F4F3EE] dark:bg-[#111310] hover:border-[#C8F169] transition-colors group cursor-pointer no-underline"
          >
            <div className="w-10 h-10 bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Tambah Proyek
            </span>
          </Link>

          <Link
            href="/admin/certificates/new"
            className="flex flex-col items-center justify-center text-center p-4 border border-[#171816]/20 dark:border-white/10 bg-[#F4F3EE] dark:bg-[#111310] hover:border-[#C8F169] transition-colors group cursor-pointer no-underline"
          >
            <div className="w-10 h-10 bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Unggah Sertifikat
            </span>
          </Link>

          <Link
            href="/admin/profile"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#C8F169] transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Sunting Profil
            </span>
          </Link>

          <Link
            href="/admin/messages"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#C8F169] transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Buka Kotak Masuk
            </span>
          </Link>

          <Link
            href="/admin/skills"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#C8F169] transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Kelola Keahlian
            </span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#C8F169] transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <span className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE]">
              Pengaturan & SEO
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Updates & Content Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Projects List (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 border-2 border-[#171816]/20 dark:border-white/10 bg-white dark:bg-[#1C1F1A] shadow-pixel dark:shadow-pixel-lime">
          <div className="flex items-center justify-between pb-4 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE]">
                Proyek Terbaru di Database
              </h3>
              <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                Pembaruan terakhir dari modul proyek
              </span>
            </div>
            <Link
              href="/admin/projects"
              className="font-mono text-xs text-[#171816] dark:text-[#C8F169] hover:underline flex items-center gap-1 font-bold no-underline"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {recentProjects.data && recentProjects.data.length > 0 ? (
              recentProjects.data.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="truncate">
                    <p className="font-bold text-[#171816] dark:text-[#F4F3EE] truncate">
                      {proj.title || "Proyek Tanpa Judul"}
                    </p>
                    <span className="text-[11px] text-[#777970] dark:text-[#A1A49A]">
                      {proj.category || "Web Development"} · Diperbarui {proj.updated_at ? String(proj.updated_at).slice(0, 10) : "Hari ini"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-pixel ${
                        proj.status === "published"
                          ? "bg-[#C8F169] text-[#171816] border border-black/40"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {proj.status || "draft"}
                    </span>
                    <Link
                      href={`/admin/projects/${proj.id}`}
                      className="px-3 py-1 bg-white dark:bg-[#1C1F1A] border border-[#171816]/20 dark:border-white/20 text-[11px] font-bold text-[#171816] dark:text-[#F4F3EE] hover:border-[#171816] transition-colors no-underline"
                    >
                      Sunting
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#777970] dark:text-[#A1A49A] py-4 text-center">
                Belum ada proyek yang tersimpan di database.
              </p>
            )}
          </div>
        </div>

        {/* Content Readiness & Synchronization (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <ContentReadiness client={actor.client} />
          <PrdImport />
        </div>
      </div>
    </div>
  );
}
