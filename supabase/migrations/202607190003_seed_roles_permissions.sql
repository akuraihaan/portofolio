-- Built-in roles and least-privilege permission assignments.

insert into public.roles (name, label, description, is_system)
values
    ('super_admin', 'Super Admin', 'Full access to the portfolio workspace.', true),
    ('admin', 'Admin', 'Operational access to content and users.', true),
    ('editor', 'Editor', 'Content editing access without user administration.', true),
    ('viewer', 'Viewer', 'Read-only dashboard and published content access.', true)
on conflict (name) do update set
    label = excluded.label,
    description = excluded.description,
    is_system = excluded.is_system,
    updated_at = timezone('utc', now());

insert into public.permissions (key, module, action, description)
values
    ('dashboard.view', 'dashboard', 'view', 'View dashboard metrics.'),
    ('projects.view', 'projects', 'view', 'Read projects.'),
    ('projects.create', 'projects', 'create', 'Create projects.'),
    ('projects.update', 'projects', 'update', 'Update and publish projects.'),
    ('projects.delete', 'projects', 'delete', 'Delete projects.'),
    ('articles.view', 'articles', 'view', 'Read articles.'),
    ('articles.create', 'articles', 'create', 'Create articles.'),
    ('articles.update', 'articles', 'update', 'Update and publish articles.'),
    ('articles.delete', 'articles', 'delete', 'Delete articles.'),
    ('skills.manage', 'skills', 'manage', 'Manage skills.'),
    ('experiences.manage', 'experiences', 'manage', 'Manage experience entries.'),
    ('educations.manage', 'educations', 'manage', 'Manage education entries.'),
    ('certificates.manage', 'certificates', 'manage', 'Manage certificates.'),
    ('services.manage', 'services', 'manage', 'Manage services.'),
    ('testimonials.manage', 'testimonials', 'manage', 'Manage testimonials.'),
    ('messages.view', 'messages', 'view', 'Read contact messages.'),
    ('messages.update', 'messages', 'update', 'Change contact message status.'),
    ('messages.delete', 'messages', 'delete', 'Delete contact messages.'),
    ('media.manage', 'media', 'manage', 'Upload and manage media assets.'),
    ('settings.view', 'settings', 'view', 'Read private site settings.'),
    ('settings.update', 'settings', 'update', 'Update site settings.'),
    ('social_links.manage', 'social_links', 'manage', 'Manage social links.'),
    ('users.view', 'users', 'view', 'Read user profiles and roles.'),
    ('users.create', 'users', 'create', 'Create users through a trusted auth flow.'),
    ('users.update', 'users', 'update', 'Update user profiles and non-admin roles.'),
    ('users.deactivate', 'users', 'deactivate', 'Activate or deactivate users.'),
    ('roles.view', 'roles', 'view', 'Read roles.'),
    ('roles.manage', 'roles', 'manage', 'Manage roles and role permissions.'),
    ('permissions.view', 'permissions', 'view', 'Read permissions.'),
    ('security.view', 'security', 'view', 'Read security and audit events.'),
    ('login_history.view', 'login_history', 'view', 'Read login history.')
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
        ('admin', 'dashboard.view'), ('admin', 'projects.view'), ('admin', 'projects.create'), ('admin', 'projects.update'), ('admin', 'projects.delete'), ('admin', 'articles.view'), ('admin', 'articles.create'), ('admin', 'articles.update'), ('admin', 'articles.delete'),
        ('admin', 'skills.manage'), ('admin', 'experiences.manage'), ('admin', 'educations.manage'), ('admin', 'certificates.manage'), ('admin', 'services.manage'), ('admin', 'testimonials.manage'), ('admin', 'messages.view'), ('admin', 'messages.update'), ('admin', 'messages.delete'), ('admin', 'media.manage'), ('admin', 'settings.view'), ('admin', 'settings.update'), ('admin', 'social_links.manage'), ('admin', 'users.view'), ('admin', 'users.update'), ('admin', 'users.deactivate'), ('admin', 'roles.view'),
        ('editor', 'dashboard.view'), ('editor', 'projects.view'), ('editor', 'projects.create'), ('editor', 'projects.update'), ('editor', 'articles.view'), ('editor', 'articles.create'), ('editor', 'articles.update'), ('editor', 'skills.manage'), ('editor', 'experiences.manage'), ('editor', 'educations.manage'), ('editor', 'certificates.manage'), ('editor', 'services.manage'), ('editor', 'testimonials.manage'), ('editor', 'media.manage'), ('editor', 'social_links.manage'),
        ('viewer', 'dashboard.view'), ('viewer', 'projects.view'), ('viewer', 'articles.view')
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from role_permissions_seed seed
join public.roles r on r.name = seed.role_name
join public.permissions p on p.key = seed.permission_key
on conflict (role_id, permission_id) do nothing;

-- Existing Auth users receive the same safe default as newly registered users.
insert into public.profiles (id, full_name, is_active)
select u.id, nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), true
from auth.users u
on conflict (id) do nothing;

insert into public.user_roles (user_id, role_id)
select u.id, r.id
from auth.users u
cross join public.roles r
where r.name = 'viewer'
on conflict (user_id, role_id) do nothing;

insert into public.site_settings (group_name, key, value, is_public)
values
    ('identity', 'site_name', '"bworiey"'::jsonb, true),
    ('identity', 'studio_name', '"bworiey"'::jsonb, true),
    ('identity', 'site_tagline', '"Portfolio digital bworiey"'::jsonb, true),
    ('identity', 'site_description', '"Portfolio dinamis bworiey dengan konten yang dikelola melalui panel admin."'::jsonb, true),
    ('identity', 'availability_label', '"Konten publik bworiey"'::jsonb, true),
    ('identity', 'hero_badge', '"Portfolio digital"'::jsonb, true),
    ('identity', 'hero_title', '"Konten belum tersedia."'::jsonb, true),
    ('identity', 'hero_description', '"Konten belum tersedia."'::jsonb, true),
    ('identity', 'about_text', '"Konten belum tersedia."'::jsonb, true),
    ('identity', 'professional_titles', '[]'::jsonb, true),
    ('seo', 'default_meta_title', '"bworiey — Portfolio digital"'::jsonb, true),
    ('seo', 'default_meta_description', '"Portfolio digital dinamis bworiey."'::jsonb, true),
    ('appearance', 'default_language', '"id"'::jsonb, true),
    ('system', 'contact_form_enabled', 'true'::jsonb, true)
on conflict (key) do update set
    group_name = excluded.group_name,
    is_public = excluded.is_public,
    updated_at = timezone('utc', now());
