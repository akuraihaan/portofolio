<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $interval = max(60, (int) config('portfolio.activity_update_interval', 300));

        if ($user && (! $user->last_activity_at || $user->last_activity_at->lt(now()->subSeconds($interval)))) {
            $user->forceFill(['last_activity_at' => now()])->saveQuietly();
        }

        return $next($request);
    }
}
