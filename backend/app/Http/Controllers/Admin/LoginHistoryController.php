<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoginHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LoginHistoryController extends Controller
{
    public function index(Request $request): View
    {
        $history = LoginHistory::with('user')
            ->when($request->filled('status'), fn ($query) => $query->where('was_successful', $request->string('status') === 'success'))
            ->when($request->filled('user'), fn ($query) => $query->where('user_id', $request->integer('user')))
            ->when($request->filled('search'), fn ($query) => $query->where('email', 'like', '%'.$request->string('search').'%'))
            ->latest('login_at')
            ->paginate(20)
            ->withQueryString();

        return view('admin.login-history.index', [
            'history' => $history,
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }
}
