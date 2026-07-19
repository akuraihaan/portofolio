<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class SecurityController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity)
    {
    }

    public function index(Request $request): View
    {
        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get(['id', 'ip_address', 'user_agent', 'last_activity']);

        return view('profile.security', ['sessions' => $sessions, 'currentSession' => $request->session()->getId()]);
    }

    public function destroyOtherSessions(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);
        DB::table('sessions')->where('user_id', $request->user()->id)->where('id', '!=', $request->session()->getId())->delete();
        $this->activity->record('sessions-revoked', 'security', $request->user(), $request);

        return back()->with('status', 'Sesi pada perangkat lain telah dikeluarkan.');
    }

    public function destroy(Request $request, string $session): RedirectResponse
    {
        abort_if($session === $request->session()->getId(), 422, 'Sesi saat ini tidak dapat dihapus dari daftar ini.');
        DB::table('sessions')->where('user_id', $request->user()->id)->where('id', $session)->delete();
        $this->activity->record('session-revoked', 'security', $request->user(), $request);

        return back()->with('status', 'Sesi berhasil dikeluarkan.');
    }
}
