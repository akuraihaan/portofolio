-- Additive content-management expansion for the Portfolio CMS.
-- Existing rows and columns are preserved; this migration only adds fields,
-- the achievements module, and the permission/RLS contract it needs.

create extension if not exists pgcrypto;

alter table public.projects
  add column if not exists project_year text,
  add column if not exists duration text,
  add column if not exists role text,
  add column if not exists client text,
  add column if not exists video_url text,
  add column if not exists figma_url text,
  add column if not exists documentation_url text,
  add column if not exists extra_links jsonb not null default '[]'::jsonb,
  add column if not exists case_study jsonb not null default '{}'::jsonb,
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists og_image_url text,
  add column if not exists og_image_path text,
  add column if not exists canonical_url text;

alter table public.experiences
  add column if not exists experience_type text,
  add column if not exists responsibilities jsonb not null default '[]'::jsonb,
  add column if not exists achievements jsonb not null default '[]'::jsonb,
  add column if not exists organization_url text;

alter table public.educations
  add column if not exists level text,
  add column if not exists related_achievements jsonb not null default '[]'::jsonb;

alter table public.certificates
  add column if not exists credential_id text,
  add column if not exists expiry_date date,
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists file_url text,
  add column if not exists file_path text;

alter table public.articles
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists og_image_url text,
  add column if not exists og_image_path text;

alter table public.media_assets
  add column if not exists display_name text,
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists usage_count integer not null default 0;

alter table public.portfolio_versions
  add column if not exists selected_skills jsonb not null default '[]'::jsonb,
  add column if not exists selected_educations jsonb not null default '[]'::jsonb,
  add column if not exists selected_articles jsonb not null default '[]'::jsonb,
  add column if not exists seo_title text,
  add column if not exists meta_description text;

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organizer text,
  result text,
  achievement_date date,
  description text,
  image_url text,
  image_path text,
  document_url text,
  document_path text,
  link_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create index if not exists achievements_public_index
  on public.achievements (status, sort_order, achievement_date desc);

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

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at
  before update on public.achievements
  for each row execute function public.set_dynamic_updated_at();

alter table public.achievements enable row level security;

drop policy if exists achievements_public_read on public.achievements;
create policy achievements_public_read
  on public.achievements for select to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));

drop policy if exists achievements_admin_read on public.achievements;
create policy achievements_admin_read
  on public.achievements for select to authenticated
  using (public.has_permission('achievements.manage'));

drop policy if exists achievements_admin_insert on public.achievements;
create policy achievements_admin_insert
  on public.achievements for insert to authenticated
  with check (public.has_permission('achievements.manage') and created_by = auth.uid());

drop policy if exists achievements_admin_update on public.achievements;
create policy achievements_admin_update
  on public.achievements for update to authenticated
  using (public.has_permission('achievements.manage'))
  with check (public.has_permission('achievements.manage'));

drop policy if exists achievements_admin_delete on public.achievements;
create policy achievements_admin_delete
  on public.achievements for delete to authenticated
  using (public.has_permission('achievements.manage'));

grant select on public.achievements to anon, authenticated;
grant insert, update, delete on public.achievements to authenticated;

insert into public.permissions (key, module, action, description)
values ('achievements.manage', 'achievements', 'manage', 'Mengelola prestasi portfolio')
on conflict (key) do nothing;

insert into public.role_permissions (role_id, permission_id)
select roles.id, permissions.id
from public.roles
cross join public.permissions
where roles.name in ('super_admin', 'admin', 'editor')
  and permissions.key = 'achievements.manage'
on conflict do nothing;

-- CV uploads use the same protected Storage policy as images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-public',
  'portfolio-public',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
on conflict (id) do update set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[];

notify pgrst, 'reload schema';
