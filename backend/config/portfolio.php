<?php

return [
    'registration_enabled' => (bool) env('REGISTRATION_ENABLED', false),
    'require_email_verification' => (bool) env('REQUIRE_EMAIL_VERIFICATION', true),
    'activity_update_interval' => (int) env('ACTIVITY_UPDATE_INTERVAL', 300),
    'login_history_retention_days' => (int) env('LOGIN_HISTORY_RETENTION_DAYS', 365),
    'system_roles' => ['Super Admin', 'Admin', 'Editor', 'Viewer'],
    'admin_permissions' => ['dashboard.view', 'profile.view', 'profile.update'],
    'core_permissions' => ['dashboard.view', 'users.view', 'roles.view', 'permissions.view', 'security.manage'],
];
