-- BWORIEY portfolio schema.
-- This migration is safe to run repeatedly with `supabase db push`.

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    username text unique,
    avatar_url text,
    phone text,
    bio text,
    is_active boolean not null default true,
    last_login_at timestamptz,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.roles (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    label text not null,
    description text,
    is_system boolean not null default false,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.permissions (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    module text not null,
    action text not null,
    description text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.role_permissions (
    role_id uuid not null references public.roles(id) on delete cascade,
    permission_id uuid not null references public.permissions(id) on delete cascade,
    assigned_at timestamptz not null default timezone('utc', now()),
    primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
    user_id uuid not null references auth.users(id) on delete cascade,
    role_id uuid not null references public.roles(id) on delete cascade,
    assigned_by uuid references auth.users(id) on delete set null,
    assigned_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, role_id)
);

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
    degree text not null,
    description text,
    start_date date,
    end_date date,
    status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
    sort_order integer not null default 0,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now()),
    published_at timestamptz
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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'portfolio-public',
    'portfolio-public',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']::text[]
)
on conflict (id) do update set
    name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
