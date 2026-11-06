-- Read-only audit for the existing Supabase project's SQL Editor.
-- Review and save this output before applying any pending migration.
select current_database() as database_name;
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' order by c.relname;
select tablename,policyname,roles,cmd,qual,with_check
from pg_policies where schemaname in ('public','storage') order by schemaname,tablename,policyname;
select id,public,file_size_limit,allowed_mime_types from storage.buckets order by id;
select routine_name from information_schema.routines
where routine_schema='public' and (routine_name like 'cms_%' or routine_name in ('is_admin','has_permission')) order by routine_name;
select table_name,column_name,data_type from information_schema.columns
where table_schema='public' and table_name in ('projects','page_sections','profiles','site_settings','media_assets','contact_messages') order by table_name,ordinal_position;
-- If the project uses Supabase CLI migration tracking, also inspect:
-- select version,name from supabase_migrations.schema_migrations order by version;
