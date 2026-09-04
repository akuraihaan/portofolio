-- Additive migration for saved, shareable portfolio builder versions.
-- No existing table or row is removed.

create extension if not exists pgcrypto;

create table if not exists public.portfolio_versions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text not null unique,
  portfolio_type text not null default 'general',
  description text,
  language text not null default 'id',
  theme text not null default 'dark',
  accent_color text not null default '#dc5000',
  selected_projects jsonb not null default '[]'::jsonb,
  selected_experiences jsonb not null default '[]'::jsonb,
  selected_certificates jsonb not null default '[]'::jsonb,
  section_order jsonb not null default '["about","skills","projects","experience","education","certificates","process","contact"]'::jsonb,
  visibility text not null default 'draft' check (visibility in ('draft', 'published', 'disabled')),
  expires_at timestamptz,
  show_photo boolean not null default true,
  show_contact boolean not null default true,
  density text not null default 'full' check (density in ('compact', 'full')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_versions_owner_updated_idx
  on public.portfolio_versions(owner_id, updated_at desc);

create index if not exists portfolio_versions_public_idx
  on public.portfolio_versions(slug, visibility, expires_at);

drop trigger if exists set_portfolio_versions_updated_at on public.portfolio_versions;
create trigger set_portfolio_versions_updated_at
  before update on public.portfolio_versions
  for each row execute function public.set_dynamic_updated_at();

alter table public.portfolio_versions enable row level security;

drop policy if exists portfolio_versions_public_read on public.portfolio_versions;
create policy portfolio_versions_public_read
  on public.portfolio_versions for select
  to anon, authenticated
  using (
    visibility = 'published'
    and (expires_at is null or expires_at > timezone('utc', now()))
  );

drop policy if exists portfolio_versions_owner_read on public.portfolio_versions;
create policy portfolio_versions_owner_read
  on public.portfolio_versions for select
  to authenticated
  using (
    owner_id = auth.uid()
    and public.has_permission('settings.view')
  );

drop policy if exists portfolio_versions_owner_insert on public.portfolio_versions;
create policy portfolio_versions_owner_insert
  on public.portfolio_versions for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and public.has_permission('settings.update')
  );

drop policy if exists portfolio_versions_owner_update on public.portfolio_versions;
create policy portfolio_versions_owner_update
  on public.portfolio_versions for update
  to authenticated
  using (
    owner_id = auth.uid()
    and public.has_permission('settings.update')
  )
  with check (
    owner_id = auth.uid()
    and public.has_permission('settings.update')
  );

drop policy if exists portfolio_versions_owner_delete on public.portfolio_versions;
create policy portfolio_versions_owner_delete
  on public.portfolio_versions for delete
  to authenticated
  using (
    owner_id = auth.uid()
    and public.has_permission('settings.update')
  );

grant select on public.portfolio_versions to anon, authenticated;
grant insert, update, delete on public.portfolio_versions to authenticated;
