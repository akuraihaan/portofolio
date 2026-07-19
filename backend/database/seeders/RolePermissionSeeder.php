<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $all = PermissionSeeder::PERMISSIONS;
        $content = array_values(array_filter($all, fn (string $permission) => ! str_starts_with($permission, 'users.') && ! str_starts_with($permission, 'roles.') && ! str_starts_with($permission, 'permissions.') && ! in_array($permission, ['security.manage', 'backups.manage', 'settings.update'], true)));
        $editor = ['dashboard.view', 'projects.view', 'projects.create', 'projects.update', 'articles.view', 'articles.create', 'articles.update', 'media.manage', 'profile.view', 'profile.update'];

        Role::findByName('Super Admin')->syncPermissions($all);
        Role::findByName('Admin')->syncPermissions(array_values(array_unique(array_merge($content, ['users.view', 'users.create', 'users.update', 'users.change-status', 'projects.delete', 'articles.delete', 'analytics.view', 'activity-logs.view', 'login-history.view', 'profile.view', 'profile.update']))));
        Role::findByName('Editor')->syncPermissions($editor);
        Role::findByName('Viewer')->syncPermissions(['dashboard.view', 'profile.view']);

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
