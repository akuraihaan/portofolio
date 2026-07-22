-- Repair the production media contract without changing Auth, roles, or RLS
-- on content tables. Safe to run repeatedly.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-public',
  'portfolio-public',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

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

notify pgrst, 'reload schema';
