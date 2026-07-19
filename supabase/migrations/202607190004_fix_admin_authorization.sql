-- Repair admin authorization without changing the existing UUID schema.
-- This migration is idempotent and keeps RLS enabled.

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

create table if not exists public.user_roles (
    user_id uuid not null references auth.users(id) on delete cascade,
    role_id uuid not null references public.roles(id) on delete cascade,
    assigned_by uuid references auth.users(id) on delete set null,
    assigned_at timestamptz not null default timezone('utc', now()),
    primary key (user_id, role_id)
);

create table if not exists public.role_permissions (
    role_id uuid not null references public.roles(id) on delete cascade,
    permission_id uuid not null references public.permissions(id) on delete cascade,
    assigned_at timestamptz not null default timezone('utc', now()),
    created_at timestamptz not null default timezone('utc', now()),
    primary key (role_id, permission_id)
);

alter table public.role_permissions
add column if not exists created_at timestamptz not null default timezone('utc', now());

insert into public.roles (name, label, description, is_system)
values
    ('super_admin', 'Super Admin', 'Akses penuh ke seluruh sistem', true),
    ('admin', 'Admin', 'Mengelola operasional dan konten', true),
    ('editor', 'Editor', 'Mengelola konten tertentu', true),
    ('viewer', 'Viewer', 'Akses baca terbatas', true)
on conflict (name) do update set
    label = excluded.label,
    description = excluded.description,
    is_system = excluded.is_system,
    updated_at = timezone('utc', now());

insert into public.permissions (key, module, action, description)
values
    ('dashboard.view', 'dashboard', 'view', 'Melihat dashboard'),
    ('projects.view', 'projects', 'view', 'Melihat proyek'),
    ('projects.create', 'projects', 'create', 'Menambah proyek'),
    ('projects.update', 'projects', 'update', 'Mengubah proyek'),
    ('projects.delete', 'projects', 'delete', 'Menghapus proyek'),
    ('articles.view', 'articles', 'view', 'Melihat artikel'),
    ('articles.create', 'articles', 'create', 'Menambah artikel'),
    ('articles.update', 'articles', 'update', 'Mengubah artikel'),
    ('articles.delete', 'articles', 'delete', 'Menghapus artikel'),
    ('skills.manage', 'skills', 'manage', 'Mengelola skill'),
    ('experiences.manage', 'experiences', 'manage', 'Mengelola pengalaman'),
    ('educations.manage', 'educations', 'manage', 'Mengelola pendidikan'),
    ('certificates.manage', 'certificates', 'manage', 'Mengelola sertifikat'),
    ('services.manage', 'services', 'manage', 'Mengelola layanan'),
    ('testimonials.manage', 'testimonials', 'manage', 'Mengelola testimonial'),
    ('messages.view', 'messages', 'view', 'Melihat pesan'),
    ('messages.update', 'messages', 'update', 'Mengubah status pesan'),
    ('messages.delete', 'messages', 'delete', 'Menghapus pesan'),
    ('media.manage', 'media', 'manage', 'Mengelola media'),
    ('settings.view', 'settings', 'view', 'Melihat pengaturan'),
    ('settings.update', 'settings', 'update', 'Mengubah pengaturan'),
    ('social_links.manage', 'social_links', 'manage', 'Mengelola social link'),
    ('users.view', 'users', 'view', 'Melihat pengguna'),
    ('users.create', 'users', 'create', 'Menambah pengguna'),
    ('users.update', 'users', 'update', 'Mengubah pengguna'),
    ('users.deactivate', 'users', 'deactivate', 'Menonaktifkan pengguna'),
    ('roles.view', 'roles', 'view', 'Melihat role'),
    ('roles.manage', 'roles', 'manage', 'Mengelola role'),
    ('permissions.view', 'permissions', 'view', 'Melihat permission'),
    ('security.view', 'security', 'view', 'Melihat keamanan'),
    ('login_history.view', 'login_history', 'view', 'Melihat riwayat login')
on conflict (key) do update set
    module = excluded.module,
    action = excluded.action,
    description = excluded.description,
    updated_at = timezone('utc', now());

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'super_admin'
on conflict (role_id, permission_id) do nothing;

-- Repair the known first administrator only when the Auth user exists.
insert into public.profiles (id, full_name, is_active)
select u.id, coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'Super Administrator'), true
from auth.users u
where u.id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'
on conflict (id) do update set
    is_active = true,
    updated_at = timezone('utc', now());

delete from public.user_roles
where user_id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014';

insert into public.user_roles (user_id, role_id)
select '47e09d2c-e2c5-4d81-8c93-5b74b9f86014', r.id
from public.roles r
join auth.users u on u.id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'
where r.name = 'super_admin'
on conflict (user_id, role_id) do nothing;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;

drop policy if exists profiles_authenticated_read on public.profiles;
create policy profiles_authenticated_read
on public.profiles for select to authenticated
using (id = auth.uid() or public.has_permission('users.view'));

drop policy if exists roles_read on public.roles;
create policy roles_read
on public.roles for select to authenticated
using (true);

drop policy if exists permissions_read on public.permissions;
create policy permissions_read
on public.permissions for select to authenticated
using (true);

drop policy if exists user_roles_read on public.user_roles;
create policy user_roles_read
on public.user_roles for select to authenticated
using (user_id = auth.uid() or public.has_permission('users.view') or public.has_permission('roles.view'));

drop policy if exists role_permissions_read on public.role_permissions;
create policy role_permissions_read
on public.role_permissions for select to authenticated
using (true);

grant usage on schema public to authenticated;
grant select on public.profiles, public.roles, public.permissions, public.user_roles, public.role_permissions to authenticated;

notify pgrst, 'reload schema';
