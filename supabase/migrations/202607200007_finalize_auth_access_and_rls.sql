-- Finalize the deployed authentication/access-control schema.
-- The live project uses bigint IDs for roles/permissions and uuid IDs for
-- auth users. This migration repairs that actual schema without exposing any
-- service-role credential to the browser.

do $$
declare
    role_id_type text;
    permission_id_type text;
begin
    select data_type
      into role_id_type
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'roles'
       and column_name = 'id';

    select data_type
      into permission_id_type
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'permissions'
       and column_name = 'id';

    if role_id_type is distinct from 'bigint'
       or permission_id_type is distinct from 'bigint' then
        raise exception 'Auth access repair expects bigint role/permission IDs; found roles.id=% and permissions.id=%', role_id_type, permission_id_type;
    end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;

-- Security-definer helpers are the single database source of truth for role
-- and permission checks. They read the access tables without recursive RLS.
create or replace function public.is_active_user(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select coalesce(
        exists (
            select 1
              from public.profiles p
             where p.id = coalesce(target_user_id, auth.uid())
               and p.is_active = true
        ), false
    );
$$;

create or replace function public.has_role(required_role text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select public.is_active_user(target_user_id)
       and exists (
            select 1
              from public.user_roles ur
              join public.roles r on r.id = ur.role_id
             where ur.user_id = coalesce(target_user_id, auth.uid())
               and r.name = required_role
        );
$$;

create or replace function public.has_permission(required_permission text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select public.has_role('super_admin', target_user_id)
        or (
            public.is_active_user(target_user_id)
            and exists (
                select 1
                  from public.user_roles ur
                  join public.role_permissions rp on rp.role_id = ur.role_id
                  join public.permissions p on p.id = rp.permission_id
                 where ur.user_id = coalesce(target_user_id, auth.uid())
                   and p.key = required_permission
            )
        );
$$;

-- Remove the old UUID overload if it was created by an earlier partial
-- migration. The deployed role IDs are bigint.
drop function if exists public.can_assign_role(uuid, uuid);
drop function if exists public.can_remove_user_role(uuid, uuid);

create or replace function public.can_assign_role(target_role_id bigint, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select target_user_id <> auth.uid()
       and (
            public.has_role('super_admin')
            or (
                public.has_permission('users.update')
                and not exists (
                    select 1
                      from public.roles r
                     where r.id = target_role_id
                       and r.name = 'super_admin'
                )
            )
       );
$$;

create or replace function public.can_remove_user_role(target_user_id uuid, target_role_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
    select target_user_id <> auth.uid()
       and (
            public.has_role('super_admin')
            or public.has_permission('users.update')
       )
       and (
            not exists (
                select 1
                  from public.roles r
                 where r.id = target_role_id
                   and r.name = 'super_admin'
            )
            or (
                public.has_role('super_admin')
                and (
                    select count(*)
                      from public.user_roles ur
                      join public.roles r on r.id = ur.role_id
                     where r.name = 'super_admin'
                ) > 1
            )
       );
$$;

grant execute on function public.is_active_user(uuid) to authenticated;
grant execute on function public.has_role(text, uuid) to authenticated;
grant execute on function public.has_permission(text, uuid) to authenticated;
grant execute on function public.can_assign_role(bigint, uuid) to authenticated;
grant execute on function public.can_remove_user_role(uuid, bigint) to authenticated;

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

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
  from public.roles r
 cross join public.permissions p
 where r.name = 'super_admin'
on conflict (role_id, permission_id) do nothing;

-- Existing Auth users must always have a profile. Do not use the legacy
-- profiles.role column for authorization; user_roles is the source of truth.
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

-- Existing accounts without a user_roles row receive least-privilege viewer.
insert into public.user_roles (user_id, role_id, assigned_by)
select u.id, r.id, null
  from auth.users u
  join public.roles r on r.name = 'viewer'
 where u.id <> '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'::uuid
   and not exists (
        select 1
          from public.user_roles existing_assignment
         where existing_assignment.user_id = u.id
   )
on conflict (user_id, role_id) do nothing;

-- Apply the requested super-admin assignment only when that Auth user really
-- exists. A SQL script cannot manufacture auth.users or a password.
do $$
declare
    super_admin_role_id bigint;
begin
    if exists (
        select 1 from auth.users
         where id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'::uuid
    ) then
        select id into super_admin_role_id
          from public.roles
         where name = 'super_admin';

        delete from public.user_roles
         where user_id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'::uuid;

        insert into public.user_roles (user_id, role_id, assigned_by)
        values (
            '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'::uuid,
            super_admin_role_id,
            null
        )
        on conflict (user_id, role_id) do nothing;
    end if;
end;
$$;

-- New Auth users receive a profile and viewer. If the requested UUID is later
-- created/imported, it is promoted automatically to super_admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    default_role_id bigint;
begin
    insert into public.profiles (id, full_name, is_active)
    values (
        new.id,
        coalesce(
            nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
            nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
            'Portfolio user'
        ),
        true
    )
    on conflict (id) do nothing;

    select id
      into default_role_id
      from public.roles
     where name = case
        when new.id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'::uuid
            then 'super_admin'
        else 'viewer'
     end
     limit 1;

    if default_role_id is not null then
        insert into public.user_roles (user_id, role_id, assigned_by)
        values (new.id, default_role_id, null)
        on conflict (user_id, role_id) do nothing;
    end if;

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Replace incomplete/recursive metadata read policies. Write policies remain
-- permission-gated and are checked by the same security-definer helpers.
drop policy if exists profiles_public_read on public.profiles;
drop policy if exists profiles_authenticated_read on public.profiles;
drop policy if exists profiles_update on public.profiles;
drop policy if exists profiles_select_authenticated on public.profiles;
drop policy if exists profiles_update_own_or_admin on public.profiles;
drop policy if exists "Admin dapat mengelola profil" on public.profiles;
drop policy if exists "Pengguna dapat membaca profil sendiri" on public.profiles;
drop policy if exists "Pengguna dapat memperbarui profil sendiri" on public.profiles;
drop policy if exists "User membaca profil sendiri" on public.profiles;

create policy profiles_public_read
on public.profiles for select to anon
using (is_active = true);

create policy profiles_select_authenticated
on public.profiles for select to authenticated
using (id = auth.uid() or public.has_permission('users.view'));

create policy profiles_update_own_or_admin
on public.profiles for update to authenticated
using (id = auth.uid() or public.has_permission('users.update'))
with check (id = auth.uid() or public.has_permission('users.update'));

drop policy if exists roles_read on public.roles;
drop policy if exists roles_insert on public.roles;
drop policy if exists roles_update on public.roles;
drop policy if exists roles_delete on public.roles;
drop policy if exists "Authenticated membaca role" on public.roles;

create policy roles_read
on public.roles for select to authenticated
using (true);

create policy roles_insert
on public.roles for insert to authenticated
with check (public.has_permission('roles.manage') and (is_system = false or public.has_role('super_admin')));

create policy roles_update
on public.roles for update to authenticated
using (public.has_permission('roles.manage') and (not is_system or public.has_role('super_admin')))
with check (public.has_permission('roles.manage') and (not is_system or public.has_role('super_admin')));

create policy roles_delete
on public.roles for delete to authenticated
using (public.has_role('super_admin') and not is_system);

drop policy if exists permissions_read on public.permissions;
drop policy if exists permissions_insert on public.permissions;
drop policy if exists permissions_update on public.permissions;
drop policy if exists permissions_delete on public.permissions;
drop policy if exists "Authenticated membaca permissions" on public.permissions;

create policy permissions_read
on public.permissions for select to authenticated
using (true);

create policy permissions_insert
on public.permissions for insert to authenticated
with check (public.has_role('super_admin'));

create policy permissions_update
on public.permissions for update to authenticated
using (public.has_role('super_admin'))
with check (public.has_role('super_admin'));

create policy permissions_delete
on public.permissions for delete to authenticated
using (public.has_role('super_admin'));

drop policy if exists role_permissions_read on public.role_permissions;
drop policy if exists role_permissions_insert on public.role_permissions;
drop policy if exists role_permissions_delete on public.role_permissions;
drop policy if exists "Authenticated membaca role permissions" on public.role_permissions;

create policy role_permissions_read
on public.role_permissions for select to authenticated
using (true);

create policy role_permissions_insert
on public.role_permissions for insert to authenticated
with check (public.has_permission('roles.manage'));

create policy role_permissions_delete
on public.role_permissions for delete to authenticated
using (public.has_permission('roles.manage'));

drop policy if exists user_roles_read on public.user_roles;
drop policy if exists user_roles_insert on public.user_roles;
drop policy if exists user_roles_delete on public.user_roles;
drop policy if exists "User membaca role sendiri" on public.user_roles;

create policy user_roles_read
on public.user_roles for select to authenticated
using (
    user_id = auth.uid()
    or public.has_permission('users.view')
    or public.has_permission('roles.view')
);

create policy user_roles_insert
on public.user_roles for insert to authenticated
with check (public.can_assign_role(role_id, user_id));

create policy user_roles_delete
on public.user_roles for delete to authenticated
using (public.can_remove_user_role(user_id, role_id));

grant usage on schema public to authenticated;
grant select on public.profiles, public.roles, public.permissions, public.user_roles, public.role_permissions to authenticated;
grant insert, update, delete on public.roles, public.permissions, public.role_permissions, public.user_roles to authenticated;

notify pgrst, 'reload schema';
