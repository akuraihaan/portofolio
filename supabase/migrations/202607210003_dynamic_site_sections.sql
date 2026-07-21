-- Shared content configuration for the public portfolio.
-- This migration is additive and safe to run repeatedly. Existing content
-- tables remain the source of truth for repeatable lists such as projects.

create extension if not exists pgcrypto;

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_name text not null,
  eyebrow text,
  title text,
  subtitle text,
  description text,
  badge_text text,
  primary_button_label text,
  primary_button_url text,
  secondary_button_label text,
  secondary_button_url text,
  image_url text,
  image_path text,
  background_image_url text,
  background_image_path text,
  layout_variant text not null default 'default',
  content_alignment text not null default 'left',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  custom_data jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  section_key text,
  icon text,
  target text not null default '_self',
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  suffix text,
  icon text,
  source_type text not null default 'manual' check (source_type in ('manual', 'count')),
  source_table text,
  source_filter jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  media_url text not null,
  media_path text not null,
  alt_text text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.site_settings
  add column if not exists description text,
  add column if not exists resume_url text,
  add column if not exists resume_path text;

alter table public.social_links
  add column if not exists show_in_hero boolean not null default true,
  add column if not exists show_in_contact boolean not null default true,
  add column if not exists show_in_footer boolean not null default true;

alter table public.services
  add column if not exists features jsonb not null default '[]'::jsonb,
  add column if not exists price_label text,
  add column if not exists cta_label text,
  add column if not exists cta_url text;

alter table public.projects
  add column if not exists technologies jsonb not null default '[]'::jsonb,
  add column if not exists repository_url text,
  add column if not exists start_date date,
  add column if not exists completion_date date;

alter table public.articles
  add column if not exists category text,
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists reading_time integer;

alter table public.certificates
  add column if not exists credential_id text,
  add column if not exists expiry_date date;

alter table public.testimonials
  add column if not exists company text,
  add column if not exists rating integer;

create index if not exists page_sections_visibility_order_idx on public.page_sections (is_visible, sort_order);
create index if not exists navigation_items_visibility_order_idx on public.navigation_items (is_visible, sort_order);
create index if not exists statistics_visibility_order_idx on public.statistics (is_visible, sort_order);
create index if not exists project_media_project_order_idx on public.project_media (project_id, sort_order);

create or replace function public.set_dynamic_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_page_sections_updated_at on public.page_sections;
create trigger set_page_sections_updated_at before update on public.page_sections for each row execute function public.set_dynamic_updated_at();
drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at before update on public.navigation_items for each row execute function public.set_dynamic_updated_at();
drop trigger if exists set_statistics_updated_at on public.statistics;
create trigger set_statistics_updated_at before update on public.statistics for each row execute function public.set_dynamic_updated_at();

alter table public.page_sections enable row level security;
alter table public.navigation_items enable row level security;
alter table public.statistics enable row level security;
alter table public.project_media enable row level security;

drop policy if exists page_sections_public_read on public.page_sections;
create policy page_sections_public_read on public.page_sections for select to anon, authenticated using (is_visible = true);
drop policy if exists page_sections_admin_read on public.page_sections;
create policy page_sections_admin_read on public.page_sections for select to authenticated using (public.has_permission('settings.view'));
drop policy if exists page_sections_admin_insert on public.page_sections;
create policy page_sections_admin_insert on public.page_sections for insert to authenticated with check (public.has_permission('settings.update'));
drop policy if exists page_sections_admin_update on public.page_sections;
create policy page_sections_admin_update on public.page_sections for update to authenticated using (public.has_permission('settings.update')) with check (public.has_permission('settings.update'));
drop policy if exists page_sections_admin_delete on public.page_sections;
create policy page_sections_admin_delete on public.page_sections for delete to authenticated using (public.has_permission('settings.update'));

drop policy if exists navigation_items_public_read on public.navigation_items;
create policy navigation_items_public_read on public.navigation_items for select to anon, authenticated using (is_visible = true);
drop policy if exists navigation_items_admin_read on public.navigation_items;
create policy navigation_items_admin_read on public.navigation_items for select to authenticated using (public.has_permission('settings.view'));
drop policy if exists navigation_items_admin_insert on public.navigation_items;
create policy navigation_items_admin_insert on public.navigation_items for insert to authenticated with check (public.has_permission('settings.update'));
drop policy if exists navigation_items_admin_update on public.navigation_items;
create policy navigation_items_admin_update on public.navigation_items for update to authenticated using (public.has_permission('settings.update')) with check (public.has_permission('settings.update'));
drop policy if exists navigation_items_admin_delete on public.navigation_items;
create policy navigation_items_admin_delete on public.navigation_items for delete to authenticated using (public.has_permission('settings.update'));

drop policy if exists statistics_public_read on public.statistics;
create policy statistics_public_read on public.statistics for select to anon, authenticated using (is_visible = true);
drop policy if exists statistics_admin_read on public.statistics;
create policy statistics_admin_read on public.statistics for select to authenticated using (public.has_permission('settings.view'));
drop policy if exists statistics_admin_insert on public.statistics;
create policy statistics_admin_insert on public.statistics for insert to authenticated with check (public.has_permission('settings.update'));
drop policy if exists statistics_admin_update on public.statistics;
create policy statistics_admin_update on public.statistics for update to authenticated using (public.has_permission('settings.update')) with check (public.has_permission('settings.update'));
drop policy if exists statistics_admin_delete on public.statistics;
create policy statistics_admin_delete on public.statistics for delete to authenticated using (public.has_permission('settings.update'));

drop policy if exists project_media_public_read on public.project_media;
create policy project_media_public_read on public.project_media for select to anon, authenticated using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published'));
drop policy if exists project_media_admin_read on public.project_media;
create policy project_media_admin_read on public.project_media for select to authenticated using (public.has_permission('projects.view'));
drop policy if exists project_media_admin_insert on public.project_media;
create policy project_media_admin_insert on public.project_media for insert to authenticated with check (public.has_permission('projects.update'));
drop policy if exists project_media_admin_update on public.project_media;
create policy project_media_admin_update on public.project_media for update to authenticated using (public.has_permission('projects.update')) with check (public.has_permission('projects.update'));
drop policy if exists project_media_admin_delete on public.project_media;
create policy project_media_admin_delete on public.project_media for delete to authenticated using (public.has_permission('projects.update'));

grant select on public.page_sections, public.navigation_items, public.statistics, public.project_media to anon, authenticated;
grant insert, update, delete on public.page_sections, public.navigation_items, public.statistics to authenticated;
grant insert, update, delete on public.project_media to authenticated;

insert into public.page_sections (section_key, section_name, eyebrow, title, subtitle, description, primary_button_label, primary_button_url, secondary_button_label, secondary_button_url, is_visible, sort_order, custom_data)
values
  ('hero', 'Hero / Section 1', 'Portfolio digital', 'Membangun pengalaman digital yang berarti.', 'Portfolio BWORIEY', 'Saya membangun aplikasi web yang dinamis, mudah digunakan, dan berorientasi pada pengalaman pengguna.', 'Lihat proyek', '#work', 'Hubungi saya', '#contact', true, 1, '{"greeting":"Halo, saya","roles":["Full Stack Developer","UI Developer","Educational Technology Enthusiast"],"availability_status":"Tersedia untuk proyek terpilih","show_social_links":true,"show_statistics":true,"show_scroll_indicator":true}'::jsonb),
  ('about', 'Tentang saya', 'Tentang saya', 'Kejelasan untuk membuat hal yang berarti.', 'Cara kerja yang tenang dan terarah.', 'Dari ide pertama hingga produk yang siap digunakan, setiap detail dibangun dengan tujuan.', 'Kenali lebih dekat', '#contact', null, null, true, 2, '{"facts":[{"label":"Lokasi","value":"Indonesia","icon":"location"},{"label":"Fokus","value":"Produk digital dan teknologi pendidikan","icon":"focus"}]}'::jsonb),
  ('statistics', 'Statistik', 'Pencapaian', 'Angka yang tumbuh dari proses.', null, null, null, null, null, null, true, 3, '{}'::jsonb),
  ('skills', 'Keahlian', 'Keahlian', 'Keahlian yang terus berkembang.', null, 'Perangkat dan cara berpikir yang saya gunakan untuk mengubah ide menjadi pengalaman yang jelas.', null, null, null, null, true, 4, '{}'::jsonb),
  ('services', 'Layanan', 'Layanan', 'Bantuan untuk membuat ide bergerak.', null, 'Pilih cara kerja yang paling sesuai dengan kebutuhan proyek Anda.', 'Bicarakan proyek', '#contact', null, null, true, 5, '{}'::jsonb),
  ('featured_projects', 'Proyek unggulan', 'Proyek unggulan', 'Proyek yang dipilih dengan cermat.', null, 'Beberapa karya yang mewakili cara saya merancang dan membangun.', null, null, null, null, true, 6, '{}'::jsonb),
  ('projects', 'Semua proyek', 'Proyek', 'Ide yang dibuat menjadi nyata.', null, 'Jelajahi proyek yang sudah dipublikasikan.', 'Lihat semua proyek', '#work', null, null, true, 7, '{}'::jsonb),
  ('experiences', 'Pengalaman', 'Pengalaman', 'Pengalaman yang terus bergerak.', null, 'Perjalanan yang membentuk cara saya bekerja bersama tim, produk, dan komunitas.', null, null, null, null, true, 8, '{}'::jsonb),
  ('educations', 'Pendidikan', 'Pendidikan', 'Belajar sebagai bagian dari perjalanan.', null, 'Pendidikan yang membentuk cara saya berpikir, merancang, dan membangun.', null, null, null, null, true, 9, '{}'::jsonb),
  ('certificates', 'Sertifikat', 'Sertifikat', 'Bukti dari proses belajar.', null, 'Sertifikat dan pengalaman yang mendukung perjalanan profesional.', null, null, null, null, true, 10, '{}'::jsonb),
  ('articles', 'Artikel', 'Catatan', 'Gagasan yang masih terus tumbuh.', null, 'Catatan singkat tentang desain, teknologi, dan proses membangun.', 'Baca semua catatan', '#notes', null, null, true, 11, '{}'::jsonb),
  ('testimonials', 'Testimonial', 'Testimonial', 'Cerita dari orang yang pernah berkolaborasi.', null, null, null, null, null, null, true, 12, '{}'::jsonb),
  ('contact', 'Kontak', 'Mari berbicara', 'Mari membuat sesuatu bergerak.', null, 'Ceritakan apa yang sedang Anda bangun dan mari menemukan cara terbaik untuk membuatnya bergerak.', 'Kirim pesan', '#contact', null, null, true, 13, '{"success_message":"Pesan berhasil dikirim. Terima kasih sudah menghubungi saya."}'::jsonb),
  ('cta', 'Call to action', 'Siap mulai?', 'Mari bekerja sama.', null, 'Jika idenya terasa tepat, saya siap mendengarkan.', 'Hubungi saya', '#contact', null, null, true, 14, '{}'::jsonb),
  ('process', 'Proses kerja', 'Proses kerja', 'Lebih sedikit basa-basi. Lebih banyak membuat.', null, 'Cara kerja yang jelas, umpan balik yang cepat, dan momentum yang sehat.', null, null, null, null, true, 15, '{"steps":[{"title":"Temukan intinya","description":"Kita memahami masalah, menentukan yang penting, lalu menyusun langkah yang bisa dijalankan."},{"title":"Buat terasa nyata","description":"Ide menjadi prototipe lebih awal agar cerita, rasa, dan arah dapat diuji bersama."},{"title":"Wujudkan dengan baik","description":"Desain yang matang bertemu kode yang terawat dan siap digunakan."}]}'::jsonb),
  ('footer', 'Footer', 'BWORIEY', 'Membangun dengan niat baik.', null, 'Portfolio digital yang terus tumbuh melalui proses, kolaborasi, dan perhatian pada detail.', null, null, null, null, true, 16, '{"admin_login_visible":true,"back_to_top_visible":true}'::jsonb)
on conflict (section_key) do nothing;

insert into public.navigation_items (label, href, section_key, target, is_visible, sort_order)
values
  ('Beranda', '#top', 'hero', '_self', true, 1),
  ('Tentang', '#about', 'about', '_self', true, 2),
  ('Keahlian', '#capabilities', 'skills', '_self', true, 3),
  ('Proyek', '#work', 'projects', '_self', true, 4),
  ('Pengalaman', '#experience', 'experiences', '_self', true, 5),
  ('Pendidikan', '#education', 'educations', '_self', true, 6),
  ('Artikel', '#notes', 'articles', '_self', true, 7),
  ('Kontak', '#contact', 'contact', '_self', true, 8)
on conflict do nothing;

insert into public.site_settings (group_name, key, value, is_public)
values
  ('identity', 'site_name', '"BWORIEY"'::jsonb, true),
  ('identity', 'site_tagline', '"Portfolio digital yang terus tumbuh."'::jsonb, true),
  ('identity', 'owner_name', '"BWORIEY"'::jsonb, true),
  ('identity', 'owner_email', '"hello@bworiey.studio"'::jsonb, true),
  ('identity', 'owner_location', '"Indonesia"'::jsonb, true),
  ('identity', 'site_description', '"Portfolio digital BWORIEY — pengalaman web yang jelas, dinamis, dan mudah digunakan."'::jsonb, true),
  ('identity', 'site_keywords', '["portfolio","full stack developer","educational technology"]'::jsonb, true),
  ('appearance', 'default_theme', '"dark"'::jsonb, true),
  ('footer', 'copyright_text', '"© {year} BWORIEY"'::jsonb, true),
  ('footer', 'admin_login_visible', 'true'::jsonb, true),
  ('seo', 'canonical_url', '"https://portofolio-bworiey.vercel.app/"'::jsonb, true)
on conflict (key) do nothing;

notify pgrst, 'reload schema';
