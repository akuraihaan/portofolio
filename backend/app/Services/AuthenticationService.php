<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthenticationService
{
    public function __construct(private readonly LoginHistoryService $loginHistory)
    {
    }

    public function loginSucceeded(Request $request, User $user): void
    {
        DB::transaction(function () use ($request, $user): void {
            $user->forceFill([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
                'last_activity_at' => now(),
            ])->save();

            $this->loginHistory->recordSuccess($request, $user);
        });
    }

    public function loginFailed(Request $request, ?User $user, string $reason): void
    {
        $this->loginHistory->recordFailure($request, $user, $reason);
    }

    public function logout(Request $request, ?User $user): void
    {
        $this->loginHistory->recordLogout($request, $user);
    }
}
