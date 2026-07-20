-- Repair all existing Auth users after roles were seeded.
-- Existing users without a role receive the content-admin role. New users
-- continue to receive the least-privilege viewer role through the trigger.
-- Safe to run repeatedly.

alter table public.profiles
    add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.roles
    add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.permissions
    add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.role_permissions
    add column if not exists created_at timestamptz not null default timezone('utc', now());

insert into public.roles (name, label, description, is_system)
values
    ('super_admin', 'Super Admin', 'Akses penuh ke seluruh sistem', true),
    ('admin', 'Admin', 'Mengelola konten dan operasional portfolio', true),
    ('editor', 'Editor', 'Mengelola konten tanpa administrasi user', true),
    ('viewer', 'Viewer', 'Akses baca dashboard dan konten publik', true)
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

with role_permissions_seed(role_name, permission_key) as (
    values
        ('super_admin', 'dashboard.view'), ('super_admin', 'projects.view'), ('super_admin', 'projects.create'), ('super_admin', 'projects.update'), ('super_admin', 'projects.delete'),
        ('super_admin', 'articles.view'), ('super_admin', 'articles.create'), ('super_admin', 'articles.update'), ('super_admin', 'articles.delete'), ('super_admin', 'skills.manage'),
        ('super_admin', 'experiences.manage'), ('super_admin', 'educations.manage'), ('super_admin', 'certificates.manage'), ('super_admin', 'services.manage'), ('super_admin', 'testimonials.manage'),
        ('super_admin', 'messages.view'), ('super_admin', 'messages.update'), ('super_admin', 'messages.delete'), ('super_admin', 'media.manage'), ('super_admin', 'settings.view'), ('super_admin', 'settings.update'), ('super_admin', 'social_links.manage'),
        ('super_admin', 'users.view'), ('super_admin', 'users.create'), ('super_admin', 'users.update'), ('super_admin', 'users.deactivate'), ('super_admin', 'roles.view'), ('super_admin', 'roles.manage'), ('super_admin', 'permissions.view'), ('super_admin', 'security.view'), ('super_admin', 'login_history.view'),
        ('admin', 'dashboard.view'), ('admin', 'projects.view'), ('admin', 'projects.create'), ('admin', 'projects.update'), ('admin', 'projects.delete'),
        ('admin', 'articles.view'), ('admin', 'articles.create'), ('admin', 'articles.update'), ('admin', 'articles.delete'), ('admin', 'skills.manage'),
        ('admin', 'experiences.manage'), ('admin', 'educations.manage'), ('admin', 'certificates.manage'), ('admin', 'services.manage'), ('admin', 'testimonials.manage'),
        ('admin', 'messages.view'), ('admin', 'messages.update'), ('admin', 'messages.delete'), ('admin', 'media.manage'), ('admin', 'settings.view'), ('admin', 'settings.update'), ('admin', 'social_links.manage'),
        ('admin', 'users.view'), ('admin', 'users.update'), ('admin', 'users.deactivate'),
        ('editor', 'dashboard.view'), ('editor', 'projects.view'), ('editor', 'projects.create'), ('editor', 'projects.update'),
        ('editor', 'articles.view'), ('editor', 'articles.create'), ('editor', 'articles.update'), ('editor', 'skills.manage'),
        ('editor', 'experiences.manage'), ('editor', 'educations.manage'), ('editor', 'certificates.manage'), ('editor', 'services.manage'),
        ('editor', 'testimonials.manage'), ('editor', 'media.manage'), ('editor', 'social_links.manage'),
        ('viewer', 'dashboard.view'), ('viewer', 'projects.view'), ('viewer', 'articles.view')
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from role_permissions_seed seed
join public.roles r on r.name = seed.role_name
join public.permissions p on p.key = seed.permission_key
on conflict (role_id, permission_id) do nothing;

-- Repair every Auth user created before the trigger was available.
insert into public.profiles (id, full_name, is_active)
select
    u.id,
    coalesce(
        nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
        nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
        'Portfolio user'
    ),
    true
from auth.users u
on conflict (id) do update set
    is_active = true,
    updated_at = timezone('utc', now());

-- Keep the already assigned role of existing users. Any old account with no
-- role receives content-admin access so it can manage the portfolio safely
-- without receiving super-admin/role-management privileges.
insert into public.user_roles (user_id, role_id, assigned_by)
select u.id, r.id, null
from auth.users u
cross join public.roles r
where r.name = 'admin'
  and not exists (
      select 1 from public.user_roles existing_assignment
      where existing_assignment.user_id = u.id
  )
on conflict (user_id, role_id) do nothing;

-- Ensure future Auth signups always get a profile and a role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    viewer_role_id bigint;
begin
    insert into public.profiles (id, full_name, username, is_active)
    values (
        new.id,
        coalesce(
            nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
            nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
            'Portfolio user'
        ),
        nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
        true
    )
    on conflict (id) do nothing;

    select id into viewer_role_id
    from public.roles
    where name = 'viewer';

    if viewer_role_id is not null then
        insert into public.user_roles (user_id, role_id, assigned_by)
        values (new.id, viewer_role_id, null)
        on conflict (user_id, role_id) do nothing;
    end if;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

grant usage on schema public to authenticated;
grant select on public.profiles, public.roles, public.permissions, public.user_roles, public.role_permissions to authenticated;

notify pgrst, 'reload schema';
