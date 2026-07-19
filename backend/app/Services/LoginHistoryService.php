<?php

namespace App\Services;

use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Http\Request;

class LoginHistoryService
{
    public function recordSuccess(Request $request, User $user): LoginHistory
    {
        return LoginHistory::create($this->context($request, $user, [
            'was_successful' => true,
            'login_at' => now(),
            'session_id' => $request->session()->getId(),
        ]));
    }

    public function recordFailure(Request $request, ?User $user, string $reason): LoginHistory
    {
        return LoginHistory::create($this->context($request, $user, [
            'was_successful' => false,
            'login_at' => now(),
            'failure_reason' => $reason,
        ]));
    }

    public function recordLogout(Request $request, ?User $user): void
    {
        if (! $user) {
            return;
        }

        LoginHistory::query()
            ->where('user_id', $user->id)
            ->where('session_id', $request->session()->getId())
            ->whereNull('logout_at')
            ->latest('login_at')
            ->first()?->update(['logout_at' => now()]);
    }

    private function context(Request $request, ?User $user, array $values): array
    {
        [$device, $browser, $platform] = $this->parseUserAgent($request->userAgent());

        return array_merge([
            'user_id' => $user?->id,
            'email' => mb_strtolower((string) ($user?->email ?? $request->input('email', 'unknown'))),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => $device,
            'browser' => $browser,
            'platform' => $platform,
        ], $values);
    }

    /** @return array{0:string,1:string,2:string} */
    private function parseUserAgent(?string $userAgent): array
    {
        $ua = (string) $userAgent;
        $device = preg_match('/mobile|android|iphone|ipad/i', $ua) ? 'Mobile' : 'Desktop';
        $browser = match (true) {
            str_contains($ua, 'Edg') => 'Edge',
            str_contains($ua, 'Chrome') => 'Chrome',
            str_contains($ua, 'Firefox') => 'Firefox',
            str_contains($ua, 'Safari') => 'Safari',
            default => 'Unknown browser',
        };
        $platform = match (true) {
            str_contains($ua, 'Windows') => 'Windows',
            str_contains($ua, 'Mac OS') => 'macOS',
            str_contains($ua, 'Android') => 'Android',
            str_contains($ua, 'iPhone') || str_contains($ua, 'iPad') => 'iOS',
            str_contains($ua, 'Linux') => 'Linux',
            default => 'Unknown platform',
        };

        return [$device, $browser, $platform];
    }
}
