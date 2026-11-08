"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  FolderGit2,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Share2,
  Mail,
  FileText,
  Settings,
  Archive,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Database,
  Image as ImageIcon,
} from "lucide-react";
import { logout } from "@/app/actions";

interface AllowedModule {
  key: string;
  label: string;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface AdminShellClientProps {
  actor: {
    user: { email?: string };
    profile: { id: string; full_name?: string | null };
  };
  allowed: AllowedModule[];
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export function AdminShellClient({
  actor,
  allowed,
  unreadMessagesCount,
  children,
}: AdminShellClientProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("bworiey-theme") as "light" | "dark" | null;
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("bworiey-theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const allowedKeys = new Set(allowed.map((m) => m.key));

  // Categorized sidebar items according to Master Prompt specification
  const navigationGroups: NavGroup[] = [
    {
      group: "Utama",
      items: [
        { key: "dashboard", label: "Overview", href: "/admin", icon: LayoutDashboard },
        { key: "profile", label: "Profil & Bio", href: "/admin/profile", icon: UserCheck },
      ].filter((i) => i.key === "dashboard" || allowedKeys.has(i.key)),
    },
    {
      group: "Konten Portofolio",
      items: [
        { key: "projects", label: "Proyek Showcase", href: "/admin/projects", icon: FolderGit2 },
        { key: "skills", label: "Keahlian", href: "/admin/skills", icon: Code2 },
        { key: "experiences", label: "Pengalaman", href: "/admin/experiences", icon: Briefcase },
        { key: "educations", label: "Pendidikan", href: "/admin/educations", icon: GraduationCap },
        { key: "certificates", label: "Sertifikasi", href: "/admin/certificates", icon: Award },
        { key: "achievements", label: "Prestasi & Awards", href: "/admin/achievements", icon: Trophy },
      ].filter((i) => allowedKeys.has(i.key)),
    },
    {
      group: "Komunikasi & Publikasi",
      items: [
        {
          key: "messages",
          label: "Kotak Masuk Pesan",
          href: "/admin/messages",
          icon: Mail,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
        },
        { key: "social_links", label: "Media Sosial", href: "/admin/social_links", icon: Share2 },
        { key: "portfolio_versions", label: "CV & Versi Dokumen", href: "/admin/portfolio_versions", icon: FileText },
        { key: "media", label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ].filter((i) => allowedKeys.has(i.key)),
    },
    {
      group: "Sistem & Keamanan",
      items: [
        { key: "settings", label: "SEO & Pengaturan", href: "/admin/settings", icon: Settings },
        { key: "history", label: "Riwayat & Sampah", href: "/admin/history", icon: Archive },
        { key: "analytics", label: "Analitik Kunjungan", href: "/admin/analytics", icon: BarChart3 },
        { key: "account-security", label: "Keamanan Akun (2FA)", href: "/admin/account-security", icon: ShieldCheck },
      ],
    },
  ];

  // Derive current page title & breadcrumbs
  const getBreadcrumb = () => {
    if (pathname === "/admin") return { title: "Overview", breadcrumbs: ["Admin", "Dashboard"] };
    if (pathname.startsWith("/admin/projects")) return { title: "Proyek Showcase", breadcrumbs: ["Admin", "Konten", "Proyek"] };
    if (pathname.startsWith("/admin/profile")) return { title: "Profil Pengguna", breadcrumbs: ["Admin", "Utama", "Profil"] };
    if (pathname.startsWith("/admin/skills")) return { title: "Keahlian & Kompetensi", breadcrumbs: ["Admin", "Konten", "Keahlian"] };
    if (pathname.startsWith("/admin/experiences")) return { title: "Pengalaman Kerja & Mengajar", breadcrumbs: ["Admin", "Konten", "Pengalaman"] };
    if (pathname.startsWith("/admin/educations")) return { title: "Riwayat Pendidikan", breadcrumbs: ["Admin", "Konten", "Pendidikan"] };
    if (pathname.startsWith("/admin/certificates")) return { title: "Sertifikasi & Lisensi", breadcrumbs: ["Admin", "Konten", "Sertifikasi"] };
    if (pathname.startsWith("/admin/achievements")) return { title: "Prestasi & Penghargaan", breadcrumbs: ["Admin", "Konten", "Prestasi"] };
    if (pathname.startsWith("/admin/messages")) return { title: "Kotak Masuk Pesan", breadcrumbs: ["Admin", "Komunikasi", "Pesan"] };
    if (pathname.startsWith("/admin/social_links")) return { title: "Media Sosial", breadcrumbs: ["Admin", "Pengaturan", "Media Sosial"] };
    if (pathname.startsWith("/admin/settings")) return { title: "Pengaturan & SEO", breadcrumbs: ["Admin", "Sistem", "Pengaturan"] };
    if (pathname.startsWith("/admin/portfolio_versions")) return { title: "CV & Dokumen", breadcrumbs: ["Admin", "Publikasi", "Versi Dokumen"] };
    if (pathname.startsWith("/admin/history")) return { title: "Riwayat Konten & Tempat Sampah", breadcrumbs: ["Admin", "Sistem", "Riwayat"] };
    if (pathname.startsWith("/admin/analytics")) return { title: "Analitik Portofolio", breadcrumbs: ["Admin", "Sistem", "Analitik"] };
    if (pathname.startsWith("/admin/account-security")) return { title: "Keamanan Akun (2FA)", breadcrumbs: ["Admin", "Sistem", "Keamanan"] };
    return { title: "Studio Konten", breadcrumbs: ["Admin", "Studio"] };
  };

  const { title: pageTitle, breadcrumbs } = getBreadcrumb();

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0c0d10] text-[#141518] dark:text-[#f3f4f6] font-sans antialiased flex">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Modern Editorial Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#14151b] border-r border-[#e4e1d7] dark:border-[#222530] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#e4e1d7] dark:border-[#222530] flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-3 group focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-forest dark:bg-lime flex items-center justify-center text-white dark:text-charcoal font-display font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                BW
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base tracking-tight text-charcoal dark:text-white leading-none">
                  BWORIEY
                </span>
                <span className="font-mono text-[10px] text-charcoal/50 dark:text-white/40 tracking-wider uppercase mt-1">
                  CMS Workspace
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-charcoal/50 hover:text-charcoal dark:text-white/50 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6" aria-label="Menu Admin BWORIEY">
            {navigationGroups.map((group) => (
              <div key={group.group}>
                <p className="px-3 text-[10px] font-mono font-bold tracking-widest uppercase text-charcoal/40 dark:text-white/40 mb-2">
                  {group.group}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                          isActive
                            ? "bg-forest dark:bg-lime text-white dark:text-charcoal font-bold shadow-sm"
                            : "text-charcoal/70 dark:text-white/70 hover:bg-[#f0eee6] dark:hover:bg-[#1a1c24] hover:text-charcoal dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white dark:text-charcoal" : "text-charcoal/50 dark:text-white/50"}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white dark:bg-charcoal text-forest dark:text-lime"
                                : "bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-[#e4e1d7] dark:border-[#222530] bg-[#faf8f5]/50 dark:bg-[#101217]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  {actor.profile.full_name?.slice(0, 2).toUpperCase() || "TR"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-charcoal dark:text-white truncate">
                    {actor.profile.full_name || "Taufik Raihandani"}
                  </p>
                  <p className="font-mono text-[10px] text-charcoal/40 dark:text-white/40 truncate">
                    {actor.user.email || "Administrator"}
                  </p>
                </div>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  title="Keluar dari sesi admin"
                  className="p-1.5 rounded-lg text-charcoal/50 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[11px] font-mono text-charcoal/50 dark:text-white/40">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Supabase Sync</span>
              </div>
              <Link
                href="/"
                target="_blank"
                className="hover:text-forest dark:hover:text-lime transition-colors flex items-center gap-1"
              >
                <span>Lihat Web</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Modern SaaS Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#14151b]/90 backdrop-blur-md border-b border-[#e4e1d7] dark:border-[#222530] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-charcoal/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 lg:hidden focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 font-mono text-xs text-charcoal/40 dark:text-white/40">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  <span className={idx === breadcrumbs.length - 1 ? "text-charcoal dark:text-white font-bold" : ""}>
                    {crumb}
                  </span>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-charcoal/30 dark:text-white/30" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Production Live</span>
            </div>

            {/* Preview Site Button */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e4e1d7] dark:border-[#222530] bg-[#faf8f5] dark:bg-[#0c0d10] font-mono text-xs text-charcoal dark:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors shadow-sm"
            >
              <span>Lihat Situs</span>
              <ExternalLink className="w-3 h-3 text-forest dark:text-lime" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Beralih ke mode ${theme === "light" ? "gelap" : "terang"}`}
              className="p-2 rounded-xl border border-[#e4e1d7] dark:border-[#222530] bg-[#faf8f5] dark:bg-[#0c0d10] text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-lime" />}
            </button>
          </div>
        </header>

        {/* Child Content */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

