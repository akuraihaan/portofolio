-- Create the dynamic portfolio content schema that the Vite frontend reads.
-- The live project already has access-control tables from migration 007;
-- this migration adds the missing content tables and their RLS policies.

create extension if not exists pgcrypto;

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    category text,
    summary text,
    description text,
    cover_image_url text,
    project_url text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    is_featured boolean not null default false,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.articles (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    excerpt text,
    content text not null default '',
    cover_image_url text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    is_featured boolean not null default false,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.skills (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    level integer check (level between 0 and 100),
    category text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.experiences (
    id uuid primary key default gen_random_uuid(),
    company text not null,
    role_title text not null,
    description text,
    location text,
    start_date date,
    end_date date,
    is_current boolean not null default false,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.educations (
    id uuid primary key default gen_random_uuid(),
    institution text not null,
    degree text,
    field_of_study text,
    location text,
    description text,
    start_date date,
    end_date date,
    is_current boolean not null default false,
    logo_url text,
    sort_order integer not null default 0,
    is_featured boolean not null default false,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    published_at timestamptz,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.certificates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    issuer text,
    issue_date date,
    credential_url text,
    image_url text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    description text,
    icon text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    is_featured boolean not null default false,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.testimonials (
    id uuid primary key default gen_random_uuid(),
    author_name text not null,
    author_role text,
    quote text not null,
    avatar_url text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    is_featured boolean not null default false,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
);

create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.social_links (
    id uuid primary key default gen_random_uuid(),
    platform text not null,
    label text not null,
    url text not null,
    username text,
    icon text,
    is_active boolean not null default true,
    open_in_new_tab boolean not null default true,
    sort_order integer not null default 0,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
    id uuid primary key default gen_random_uuid(),
    group_name text not null default 'general',
    key text not null unique,
    value jsonb not null default 'null'::jsonb,
    is_public boolean not null default true,
    is_translatable boolean not null default false,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.media_assets (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references auth.users(id) on delete set null,
    bucket_id text not null default 'portfolio-public',
    path text not null,
    file_name text not null,
    mime_type text not null,
    size_bytes bigint not null default 0,
    alt_text text,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    unique (bucket_id, path)
);

create table if not exists public.login_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    email text,
    was_successful boolean not null default false,
    failure_reason text,
    ip_address inet,
    user_agent text,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.security_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    event_type text not null,
    severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    actor_id uuid references auth.users(id) on delete set null,
    action text not null,
    table_name text not null,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    created_at timestamptz not null default timezone('utc', now())
);

-- Complete an older educations table if one existed with the legacy shape.
alter table public.educations
    add column if not exists field_of_study text,
    add column if not exists location text,
    add column if not exists is_current boolean not null default false,
    add column if not exists logo_url text,
    add column if not exists is_featured boolean not null default false;

create index if not exists projects_public_index on public.projects (status, sort_order, published_at);
create index if not exists articles_public_index on public.articles (status, sort_order, published_at);
create index if not exists skills_public_index on public.skills (status, sort_order, published_at);
create index if not exists experiences_public_index on public.experiences (status, sort_order, published_at);
create index if not exists educations_public_index on public.educations (status, sort_order, published_at);
create index if not exists certificates_public_index on public.certificates (status, sort_order, published_at);
create index if not exists services_public_index on public.services (status, sort_order, published_at);
create index if not exists testimonials_public_index on public.testimonials (status, sort_order, published_at);
create index if not exists messages_status_index on public.contact_messages (status, created_at desc);
create index if not exists login_history_user_index on public.login_history (user_id, created_at desc);
create index if not exists audit_logs_created_index on public.audit_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

do $$
declare
    table_name text;
begin
    foreach table_name in array array[
        'projects', 'articles', 'skills', 'experiences', 'educations',
        'certificates', 'services', 'testimonials', 'contact_messages',
        'social_links', 'site_settings', 'media_assets'
    ] loop
        execute format('drop trigger if exists set_%s_updated_at on public.%I', table_name, table_name);
        execute format('create trigger set_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
    end loop;
end;
$$;

-- The public contact form uses this validated security-definer RPC.
create or replace function public.submit_contact_message(
    message_name text,
    message_email text,
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
       or length(trim(message_body)) not between 10 and 5000
       or trim(message_email) !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
        raise exception 'Invalid contact data';
    end if;

    insert into public.contact_messages (name, email, message)
    values (trim(message_name), lower(trim(message_email)), trim(message_body))
    returning id into message_id;

    return message_id;
end;
$$;

grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;

-- All content tables keep RLS enabled. Policy names are stable so this file is
-- safe to run repeatedly after a partial deployment.
do $$
declare
    table_name text;
begin
    foreach table_name in array array[
        'projects', 'articles', 'skills', 'experiences', 'educations',
        'certificates', 'services', 'testimonials', 'contact_messages',
        'social_links', 'site_settings', 'media_assets', 'login_history',
        'security_events', 'audit_logs'
    ] loop
        execute format('alter table public.%I enable row level security', table_name);
    end loop;
end;
$$;

drop policy if exists projects_public_read on public.projects;
drop policy if exists projects_authenticated_read on public.projects;
drop policy if exists projects_insert on public.projects;
drop policy if exists projects_update on public.projects;
drop policy if exists projects_delete on public.projects;
create policy projects_public_read on public.projects for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy projects_authenticated_read on public.projects for select to authenticated using (public.has_permission('projects.view') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy projects_insert on public.projects for insert to authenticated with check (public.has_permission('projects.create'));
create policy projects_update on public.projects for update to authenticated using (public.has_permission('projects.update')) with check (public.has_permission('projects.update'));
create policy projects_delete on public.projects for delete to authenticated using (public.has_permission('projects.delete'));

drop policy if exists articles_public_read on public.articles;
drop policy if exists articles_authenticated_read on public.articles;
drop policy if exists articles_insert on public.articles;
drop policy if exists articles_update on public.articles;
drop policy if exists articles_delete on public.articles;
create policy articles_public_read on public.articles for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy articles_authenticated_read on public.articles for select to authenticated using (public.has_permission('articles.view') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy articles_insert on public.articles for insert to authenticated with check (public.has_permission('articles.create'));
create policy articles_update on public.articles for update to authenticated using (public.has_permission('articles.update')) with check (public.has_permission('articles.update'));
create policy articles_delete on public.articles for delete to authenticated using (public.has_permission('articles.delete'));

drop policy if exists skills_public_read on public.skills;
drop policy if exists skills_authenticated_read on public.skills;
drop policy if exists skills_manage_insert on public.skills;
drop policy if exists skills_manage_update on public.skills;
drop policy if exists skills_manage_delete on public.skills;
create policy skills_public_read on public.skills for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy skills_authenticated_read on public.skills for select to authenticated using (public.has_permission('skills.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy skills_manage_insert on public.skills for insert to authenticated with check (public.has_permission('skills.manage'));
create policy skills_manage_update on public.skills for update to authenticated using (public.has_permission('skills.manage')) with check (public.has_permission('skills.manage'));
create policy skills_manage_delete on public.skills for delete to authenticated using (public.has_permission('skills.manage'));

drop policy if exists experiences_public_read on public.experiences;
drop policy if exists experiences_authenticated_read on public.experiences;
drop policy if exists experiences_manage_insert on public.experiences;
drop policy if exists experiences_manage_update on public.experiences;
drop policy if exists experiences_manage_delete on public.experiences;
create policy experiences_public_read on public.experiences for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy experiences_authenticated_read on public.experiences for select to authenticated using (public.has_permission('experiences.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy experiences_manage_insert on public.experiences for insert to authenticated with check (public.has_permission('experiences.manage'));
create policy experiences_manage_update on public.experiences for update to authenticated using (public.has_permission('experiences.manage')) with check (public.has_permission('experiences.manage'));
create policy experiences_manage_delete on public.experiences for delete to authenticated using (public.has_permission('experiences.manage'));

drop policy if exists educations_public_read on public.educations;
drop policy if exists educations_authenticated_read on public.educations;
drop policy if exists educations_manage_insert on public.educations;
drop policy if exists educations_manage_update on public.educations;
drop policy if exists educations_manage_delete on public.educations;
drop policy if exists "Public membaca education" on public.educations;
drop policy if exists "Public membaca educations published" on public.educations;
drop policy if exists "Admin membaca educations" on public.educations;
drop policy if exists "Admin membuat educations" on public.educations;
drop policy if exists "Admin memperbarui educations" on public.educations;
drop policy if exists "Admin menghapus educations" on public.educations;
create policy educations_public_read on public.educations for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy educations_authenticated_read on public.educations for select to authenticated using (public.has_permission('educations.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy educations_manage_insert on public.educations for insert to authenticated with check (public.has_permission('educations.manage'));
create policy educations_manage_update on public.educations for update to authenticated using (public.has_permission('educations.manage')) with check (public.has_permission('educations.manage'));
create policy educations_manage_delete on public.educations for delete to authenticated using (public.has_permission('educations.manage'));

drop policy if exists certificates_public_read on public.certificates;
drop policy if exists certificates_authenticated_read on public.certificates;
drop policy if exists certificates_manage_insert on public.certificates;
drop policy if exists certificates_manage_update on public.certificates;
drop policy if exists certificates_manage_delete on public.certificates;
create policy certificates_public_read on public.certificates for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy certificates_authenticated_read on public.certificates for select to authenticated using (public.has_permission('certificates.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy certificates_manage_insert on public.certificates for insert to authenticated with check (public.has_permission('certificates.manage'));
create policy certificates_manage_update on public.certificates for update to authenticated using (public.has_permission('certificates.manage')) with check (public.has_permission('certificates.manage'));
create policy certificates_manage_delete on public.certificates for delete to authenticated using (public.has_permission('certificates.manage'));

drop policy if exists services_public_read on public.services;
drop policy if exists services_authenticated_read on public.services;
drop policy if exists services_manage_insert on public.services;
drop policy if exists services_manage_update on public.services;
drop policy if exists services_manage_delete on public.services;
create policy services_public_read on public.services for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy services_authenticated_read on public.services for select to authenticated using (public.has_permission('services.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy services_manage_insert on public.services for insert to authenticated with check (public.has_permission('services.manage'));
create policy services_manage_update on public.services for update to authenticated using (public.has_permission('services.manage')) with check (public.has_permission('services.manage'));
create policy services_manage_delete on public.services for delete to authenticated using (public.has_permission('services.manage'));

drop policy if exists testimonials_public_read on public.testimonials;
drop policy if exists testimonials_authenticated_read on public.testimonials;
drop policy if exists testimonials_manage_insert on public.testimonials;
drop policy if exists testimonials_manage_update on public.testimonials;
drop policy if exists testimonials_manage_delete on public.testimonials;
create policy testimonials_public_read on public.testimonials for select to anon using (status = 'published' and (published_at is null or published_at <= timezone('utc', now())));
create policy testimonials_authenticated_read on public.testimonials for select to authenticated using (public.has_permission('testimonials.manage') or (status = 'published' and (published_at is null or published_at <= timezone('utc', now()))));
create policy testimonials_manage_insert on public.testimonials for insert to authenticated with check (public.has_permission('testimonials.manage'));
create policy testimonials_manage_update on public.testimonials for update to authenticated using (public.has_permission('testimonials.manage')) with check (public.has_permission('testimonials.manage'));
create policy testimonials_manage_delete on public.testimonials for delete to authenticated using (public.has_permission('testimonials.manage'));

drop policy if exists social_links_public_read on public.social_links;
drop policy if exists social_links_manage_read on public.social_links;
drop policy if exists social_links_manage_insert on public.social_links;
drop policy if exists social_links_manage_update on public.social_links;
drop policy if exists social_links_manage_delete on public.social_links;
create policy social_links_public_read on public.social_links for select to anon using (is_active = true);
create policy social_links_manage_read on public.social_links for select to authenticated using (public.has_permission('social_links.manage') or is_active = true);
create policy social_links_manage_insert on public.social_links for insert to authenticated with check (public.has_permission('social_links.manage'));
create policy social_links_manage_update on public.social_links for update to authenticated using (public.has_permission('social_links.manage')) with check (public.has_permission('social_links.manage'));
create policy social_links_manage_delete on public.social_links for delete to authenticated using (public.has_permission('social_links.manage'));

drop policy if exists site_settings_public_read on public.site_settings;
drop policy if exists site_settings_authenticated_read on public.site_settings;
drop policy if exists site_settings_insert on public.site_settings;
drop policy if exists site_settings_update on public.site_settings;
drop policy if exists site_settings_delete on public.site_settings;
create policy site_settings_public_read on public.site_settings for select to anon using (is_public = true);
create policy site_settings_authenticated_read on public.site_settings for select to authenticated using (public.has_permission('settings.view') or is_public = true);
create policy site_settings_insert on public.site_settings for insert to authenticated with check (public.has_permission('settings.update'));
create policy site_settings_update on public.site_settings for update to authenticated using (public.has_permission('settings.update')) with check (public.has_permission('settings.update'));
create policy site_settings_delete on public.site_settings for delete to authenticated using (public.has_permission('settings.update'));

drop policy if exists contact_messages_admin_read on public.contact_messages;
drop policy if exists contact_messages_admin_update on public.contact_messages;
drop policy if exists contact_messages_admin_delete on public.contact_messages;
create policy contact_messages_admin_read on public.contact_messages for select to authenticated using (public.has_permission('messages.view'));
create policy contact_messages_admin_update on public.contact_messages for update to authenticated using (public.has_permission('messages.update')) with check (public.has_permission('messages.update'));
create policy contact_messages_admin_delete on public.contact_messages for delete to authenticated using (public.has_permission('messages.delete'));

drop policy if exists media_assets_admin_read on public.media_assets;
drop policy if exists media_assets_admin_insert on public.media_assets;
drop policy if exists media_assets_admin_update on public.media_assets;
drop policy if exists media_assets_admin_delete on public.media_assets;
create policy media_assets_admin_read on public.media_assets for select to authenticated using (public.has_permission('media.manage'));
create policy media_assets_admin_insert on public.media_assets for insert to authenticated with check (public.has_permission('media.manage'));
create policy media_assets_admin_update on public.media_assets for update to authenticated using (public.has_permission('media.manage')) with check (public.has_permission('media.manage'));
create policy media_assets_admin_delete on public.media_assets for delete to authenticated using (public.has_permission('media.manage'));

drop policy if exists security_events_admin_read on public.security_events;
create policy security_events_admin_read on public.security_events for select to authenticated using (public.has_permission('security.view'));

drop policy if exists login_history_admin_read on public.login_history;
create policy login_history_admin_read on public.login_history for select to authenticated using (public.has_permission('login_history.view'));

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs for select to authenticated using (public.has_permission('security.view'));

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.articles, public.skills, public.experiences,
    public.educations, public.certificates, public.services, public.testimonials,
    public.social_links, public.site_settings to anon, authenticated;
grant select, insert, update, delete on public.projects, public.articles, public.skills,
    public.experiences, public.educations, public.certificates, public.services,
    public.testimonials, public.social_links, public.site_settings, public.contact_messages,
    public.media_assets, public.login_history, public.security_events, public.audit_logs
    to authenticated;

insert into public.permissions (key, module, action, description)
values ('educations.manage', 'educations', 'manage', 'Mengelola data pendidikan')
on conflict (key) do update set
    module = excluded.module,
    action = excluded.action,
    description = excluded.description;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
  from public.roles r
 cross join public.permissions p
 where r.name = 'super_admin'
   and p.key = 'educations.manage'
on conflict (role_id, permission_id) do nothing;

insert into public.educations (
    institution, degree, field_of_study, location, description,
    start_date, is_current, sort_order, is_featured, status, published_at
)
select
    'Universitas Lambung Mangkurat',
    'Sarjana Pendidikan',
    'Pendidikan Komputer',
    'Banjarmasin',
    'Pendidikan pada bidang komputer, pembelajaran, dan pengembangan teknologi pendidikan.',
    '2022-01-01',
    true,
    1,
    true,
    'published',
    timezone('utc', now())
where not exists (
    select 1
      from public.educations
     where institution = 'Universitas Lambung Mangkurat'
       and degree = 'Sarjana Pendidikan'
);

notify pgrst, 'reload schema';
