<?php

namespace App\Http\Controllers\Admin;

use App\Models\ActivityLog;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DashboardController
{
    public function __invoke(): View
    {
        $user = auth()->user();
        $isSuperAdmin = $user->isSuperAdmin();

        return view('admin.dashboard', [
            'metrics' => [
                'users' => $isSuperAdmin ? User::count() : null,
                'active_users' => $isSuperAdmin ? User::where('status', 'active')->count() : null,
                'failed_logins' => $isSuperAdmin ? LoginHistory::where('was_successful', false)->where('created_at', '>=', now()->subDays(7))->count() : null,
                'roles' => $isSuperAdmin ? DB::table('roles')->count() : null,
            ],
            'recentActivities' => $isSuperAdmin
                ? ActivityLog::with('actor')->latest()->limit(8)->get()
                : ActivityLog::with('actor')->where('actor_user_id', $user->id)->latest()->limit(8)->get(),
        ]);
    }
}
