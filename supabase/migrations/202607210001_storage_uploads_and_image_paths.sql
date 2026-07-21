-- Centralized public image storage contract for BWORIEY.
-- Existing URL columns remain backward-compatible while new uploads also keep
-- their object path for cleanup and future migrations.

alter table public.profiles add column if not exists avatar_path text;
alter table public.projects add column if not exists thumbnail_url text;
alter table public.projects add column if not exists thumbnail_path text;
alter table public.projects add column if not exists cover_path text;
alter table public.articles add column if not exists thumbnail_url text;
alter table public.articles add column if not exists thumbnail_path text;
alter table public.articles add column if not exists cover_path text;
alter table public.experiences add column if not exists logo_url text;
alter table public.experiences add column if not exists logo_path text;
alter table public.educations add column if not exists logo_path text;
alter table public.certificates add column if not exists certificate_path text;
alter table public.services add column if not exists icon_url text;
alter table public.services add column if not exists icon_path text;
alter table public.testimonials add column if not exists avatar_path text;
alter table public.site_settings add column if not exists asset_url text;
alter table public.site_settings add column if not exists asset_path text;
alter table public.contact_messages add column if not exists subject text;

alter table public.media_assets add column if not exists bucket_name text;
alter table public.media_assets add column if not exists object_path text;
alter table public.media_assets add column if not exists public_url text;
alter table public.media_assets add column if not exists uploaded_by uuid references auth.users(id) on delete set null;

update public.media_assets
set bucket_name = coalesce(bucket_name, bucket_id, 'portfolio-public'),
    object_path = coalesce(object_path, path)
where bucket_name is null or object_path is null;

insert into storage.buckets (id, name, public)
values ('portfolio-public', 'portfolio-public', true)
on conflict (id) do update set public = true;

drop policy if exists portfolio_public_read on storage.objects;
create policy portfolio_public_read
on storage.objects for select
to public
using (bucket_id = 'portfolio-public');

drop policy if exists portfolio_public_insert on storage.objects;
create policy portfolio_public_insert
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-public' and public.current_user_has_permission('media.manage'));

drop policy if exists portfolio_public_update on storage.objects;
create policy portfolio_public_update
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-public' and public.current_user_has_permission('media.manage'))
with check (bucket_id = 'portfolio-public' and public.current_user_has_permission('media.manage'));

drop policy if exists portfolio_public_delete on storage.objects;
create policy portfolio_public_delete
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-public' and public.current_user_has_permission('media.manage'));

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
    raise exception 'Invalid contact request';
  end if;
  if length(trim(message_name)) not between 2 and 120
     or length(trim(message_email)) not between 5 and 255
     or length(trim(coalesce(message_subject, ''))) > 180
     or length(trim(message_body)) not between 10 and 5000
     or trim(message_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Invalid contact data';
  end if;
  insert into public.contact_messages (name, email, subject, message)
  values (trim(message_name), lower(trim(message_email)), nullif(trim(message_subject), ''), trim(message_body))
  returning id into message_id;
  return message_id;
end;
$$;

grant execute on function public.submit_contact_message(text, text, text, text, text) to anon, authenticated;

notify pgrst, 'reload schema';
