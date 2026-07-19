<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Requests\Admin\UpdateUserStatusRequest;
use App\Http\Requests\Admin\AssignUserPermissionRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users)
    {
    }

    public function index(Request $request): View
    {
        $users = User::query()
            ->with('roles')
            ->when($request->boolean('with_trashed'), fn ($query) => $query->withTrashed())
            ->when($request->filled('search'), fn ($query) => $query->where(function ($query) use ($request) {
                $query->where('name', 'like', '%'.$request->string('search').'%')
                    ->orWhere('email', 'like', '%'.$request->string('search').'%');
            }))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when($request->filled('role'), fn ($query) => $query->role($request->string('role')))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return view('admin.users.index', [
            'users' => $users,
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(),
            'statuses' => UserStatus::cases(),
        ]);
    }

    public function create(): View
    {
        return view('admin.users.form', [
            'user' => new User(['status' => UserStatus::ACTIVE]),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(),
            'mode' => 'create',
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['password'] = $data['password'];
        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }
        abort_if(! $request->user()->can('users.assign-role'), 403, 'Role assignment requires a separate permission.');
        if (in_array('Super Admin', $data['roles'], true) && ! $request->user()->isSuperAdmin()) abort(403);

        $this->users->create($data, $request);

        return to_route('admin.users.index')->with('status', 'Pengguna berhasil dibuat.');
    }

    public function show(User $user): View
    {
        return view('admin.users.show', [
            'user' => $user->load(['roles', 'permissions', 'loginHistories' => fn ($query) => $query->latest()->limit(8)]),
        ]);
    }

    public function edit(User $user): View
    {
        $this->authorize('update', $user);

        return view('admin.users.form', [
            'user' => $user->load('roles'),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->get(),
            'mode' => 'edit',
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validatedForUser();
        if ($request->hasFile('avatar')) {
            $oldAvatar = $user->avatar;
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
            if ($oldAvatar) {
                Storage::disk('public')->delete($oldAvatar);
            }
        }
        abort_if(! $request->user()->can('users.assign-role'), 403, 'Role assignment requires a separate permission.');
        if (in_array('Super Admin', $data['roles'], true) && ! $request->user()->isSuperAdmin()) abort(403);

        $this->users->update($user, $data, $request);

        return to_route('admin.users.index')->with('status', 'Pengguna berhasil diperbarui.');
    }

    public function updatePermissions(AssignUserPermissionRequest $request, User $user): RedirectResponse
    {
        $this->authorize('assignPermission', $user);
        $this->users->syncPermissions($user, $request->input('permissions', []), $request->user(), $request);

        return back()->with('status', 'Permission langsung berhasil diperbarui.');
    }

    public function changeStatus(UpdateUserStatusRequest $request, User $user): RedirectResponse
    {
        $this->authorize('changeStatus', $user);
        $this->users->changeStatus($user, UserStatus::from($request->string('status')->toString()), $request->user(), $request);

        return back()->with('status', 'Status pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);
        $this->users->delete($user, $request->user(), $request);

        return back()->with('status', 'Pengguna dipindahkan ke sampah.');
    }

    public function restore(Request $request, int $user): RedirectResponse
    {
        $target = User::withTrashed()->findOrFail($user);
        $this->authorize('restore', $target);
        $this->users->restore($target, $request->user(), $request);

        return back()->with('status', 'Pengguna berhasil dipulihkan.');
    }

    public function forceDestroy(Request $request, int $user): RedirectResponse
    {
        $target = User::withTrashed()->findOrFail($user);
        $this->authorize('forceDelete', $target);
        $this->users->forceDelete($target, $request->user(), $request);

        return back()->with('status', 'Pengguna dihapus permanen.');
    }
}
