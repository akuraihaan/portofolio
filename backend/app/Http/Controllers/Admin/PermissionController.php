<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePermissionRequest;
use App\Http\Requests\Admin\UpdatePermissionRequest;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity)
    {
    }

    public function index(): View
    {
        return view('admin.permissions.index', ['permissions' => Permission::with('roles')->orderBy('name')->paginate(20)]);
    }

    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $permission = Permission::create(['name' => $request->string('name'), 'guard_name' => 'web']);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->activity->record('created', 'permissions', $permission, $request, null, ['name' => $permission->name]);

        return back()->with('status', 'Permission berhasil dibuat.');
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        abort_if(in_array($permission->name, config('portfolio.core_permissions', []), true), 403, 'Permission inti tidak dapat diubah.');
        $before = ['name' => $permission->name];
        $permission->update(['name' => $request->string('name')]);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->activity->record('updated', 'permissions', $permission, $request, $before, ['name' => $permission->name]);

        return back()->with('status', 'Permission berhasil diperbarui.');
    }

    public function destroy(Request $request, Permission $permission): RedirectResponse
    {
        abort_if(in_array($permission->name, config('portfolio.core_permissions', []), true), 403, 'Permission inti tidak dapat dihapus.');
        abort_if($permission->roles()->exists() || $permission->users()->exists(), 422, 'Permission masih digunakan.');
        $permission->delete();
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->activity->record('deleted', 'permissions', null, $request, ['name' => $permission->name], null);

        return back()->with('status', 'Permission berhasil dihapus.');
    }
}
