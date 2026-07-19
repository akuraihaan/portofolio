-- Apply after the first Auth user exists. Safe to run repeatedly.
-- This repairs the known administrator when earlier seed migrations ran first.

insert into public.roles (name, label, description, is_system)
values ('super_admin', 'Super Admin', 'Akses penuh ke seluruh sistem', true)
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

insert into public.profiles (id, full_name, is_active)
select u.id, coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 'Super Administrator'), true
from auth.users u
where u.id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'
on conflict (id) do update set
    is_active = true,
    updated_at = timezone('utc', now());

insert into public.user_roles (user_id, role_id)
select u.id, r.id
from auth.users u
cross join public.roles r
where u.id = '47e09d2c-e2c5-4d81-8c93-5b74b9f86014'
  and r.name = 'super_admin'
on conflict (user_id, role_id) do nothing;

notify pgrst, 'reload schema';
