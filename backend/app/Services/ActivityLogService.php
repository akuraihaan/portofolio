<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    public function record(
        string $action,
        string $module,
        ?Model $subject = null,
        ?Request $request = null,
        ?array $before = null,
        ?array $after = null,
    ): ActivityLog {
        return ActivityLog::create([
            'actor_user_id' => Auth::id(),
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'action' => $action,
            'module' => $module,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'before' => $before,
            'after' => $after,
        ]);
    }
}
