-- Synchronize the live Supabase schema with the Vite portfolio contract.
-- This migration is safe to run more than once and keeps legacy URL columns
-- populated while the frontend uses the explicit URL/path pairs below.

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists avatar_path text;

alter table public.projects
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_path text,
  add column if not exists cover_image_url text,
  add column if not exists cover_url text,
  add column if not exists cover_path text;

alter table public.articles
  add column if not exists cover_image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists thumbnail_path text,
  add column if not exists cover_path text;

alter table public.experiences
  add column if not exists logo_url text,
  add column if not exists logo_path text;

alter table public.educations
  add column if not exists logo_url text,
  add column if not exists logo_path text;

alter table public.certificates
  add column if not exists image_url text,
  add column if not exists certificate_url text,
  add column if not exists certificate_path text;

alter table public.services
  add column if not exists icon_url text,
  add column if not exists icon_path text;

alter table public.testimonials
  add column if not exists avatar_url text,
  add column if not exists avatar_path text;

alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists logo_path text,
  add column if not exists asset_url text,
  add column if not exists asset_path text,
  add column if not exists hero_image_url text,
  add column if not exists hero_image_path text,
  add column if not exists favicon_url text,
  add column if not exists favicon_path text,
  add column if not exists og_image_url text,
  add column if not exists og_image_path text;

alter table public.contact_messages
  add column if not exists subject text;

alter table public.media_assets
  add column if not exists bucket_name text,
  add column if not exists object_path text,
  add column if not exists public_url text,
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null;

-- Migrate existing URL values into the canonical names without deleting
-- legacy columns or changing existing content.
update public.projects
set cover_url = coalesce(cover_url, cover_image_url)
where cover_url is null;

update public.articles
set thumbnail_url = coalesce(thumbnail_url, cover_image_url)
where thumbnail_url is null;

update public.certificates
set certificate_url = coalesce(certificate_url, image_url)
where certificate_url is null;

update public.media_assets
set bucket_name = coalesce(bucket_name, bucket_id, 'portfolio-public'),
    object_path = coalesce(object_path, path)
where bucket_name is null
   or object_path is null;

insert into storage.buckets (id, name, public)
values ('portfolio-public', 'portfolio-public', true)
on conflict (id) do update
set name = excluded.name,
    public = true;

drop policy if exists portfolio_public_read on storage.objects;
create policy portfolio_public_read
on storage.objects for select
to public
using (bucket_id = 'portfolio-public');

drop policy if exists portfolio_public_insert on storage.objects;
create policy portfolio_public_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-public'
  and public.has_permission('media.manage')
);

drop policy if exists portfolio_public_update on storage.objects;
create policy portfolio_public_update
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-public'
  and public.has_permission('media.manage')
)
with check (
  bucket_id = 'portfolio-public'
  and public.has_permission('media.manage')
);

drop policy if exists portfolio_public_delete on storage.objects;
create policy portfolio_public_delete
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-public'
  and public.has_permission('media.manage')
);

grant select on public.media_assets to anon, authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;

create or replace function public.submit_contact_message(
  message_name text,
  message_email text,
  message_subject text,
  message_body text,
  honeypot text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  message_id uuid;
begin
  if coalesce(trim(honeypot), '') <> '' then
    raise exception 'Invalid submission';
  end if;

  if nullif(trim(message_name), '') is null
    or nullif(trim(message_email), '') is null
    or nullif(trim(message_body), '') is null then
    raise exception 'Name, email, and message are required';
  end if;

  insert into public.contact_messages (name, email, subject, message)
  values (
    trim(message_name),
    lower(trim(message_email)),
    nullif(trim(message_subject), ''),
    trim(message_body)
  )
  returning id into message_id;

  return message_id;
end;
$$;

grant execute on function public.submit_contact_message(text, text, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
