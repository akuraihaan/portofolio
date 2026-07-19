<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public const PERMISSIONS = [
        'dashboard.view',
        'users.view', 'users.create', 'users.update', 'users.delete', 'users.restore', 'users.force-delete', 'users.change-status', 'users.assign-role', 'users.assign-permission',
        'roles.view', 'roles.create', 'roles.update', 'roles.delete', 'roles.assign-permission',
        'permissions.view', 'permissions.create', 'permissions.update', 'permissions.delete',
        'profile.view', 'profile.update',
        'site-settings.view', 'site-settings.update',
        'professional-titles.manage', 'social-links.manage', 'resumes.manage',
        'projects.view', 'projects.create', 'projects.update', 'projects.delete', 'projects.publish',
        'articles.view', 'articles.create', 'articles.update', 'articles.delete', 'articles.publish',
        'skills.manage', 'experiences.manage', 'educations.manage', 'certificates.manage', 'services.manage', 'testimonials.manage', 'messages.manage', 'media.manage',
        'public-profile.view',
        'analytics.view', 'activity-logs.view', 'login-history.view', 'settings.view', 'settings.update', 'security.manage', 'backups.manage',
    ];

    public function run(): void
    {
        foreach (self::PERMISSIONS as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        config(['portfolio.core_permissions' => ['dashboard.view', 'users.view', 'roles.view', 'permissions.view', 'security.manage']]);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        Cache::forget('spatie.permission.cache');
    }
}
