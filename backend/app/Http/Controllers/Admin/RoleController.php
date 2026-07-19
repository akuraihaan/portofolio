<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(private readonly ActivityLogService $activity)
    {
    }

    public function index(): View
    {
        return view('admin.roles.index', [
            'roles' => Role::withCount('users')->with('permissions')->orderBy('name')->paginate(12),
            'permissions' => Permission::orderBy('name')->get()->groupBy(fn ($permission) => str($permission->name)->before('.')->toString()),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = DB::transaction(function () use ($request) {
            $role = Role::create(['name' => $request->string('name'), 'guard_name' => 'web']);
            $role->syncPermissions($request->input('permissions', []));
            return $role;
        });
        $this->activity->record('created', 'roles', $role, $request, null, ['name' => $role->name]);

        return back()->with('status', 'Role berhasil dibuat.');
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        abort_if(in_array($role->name, config('portfolio.system_roles'), true) && $role->name !== $request->string('name')->toString(), 403, 'Role sistem tidak dapat diganti nama.');
        $before = ['name' => $role->name, 'permissions' => $role->permissions->pluck('name')->all()];
        DB::transaction(function () use ($request, $role): void {
            $role->update(['name' => $request->string('name')]);
            $role->syncPermissions($request->input('permissions', []));
        });
        $this->activity->record('updated', 'roles', $role, $request, $before, ['name' => $role->name, 'permissions' => $role->permissions()->pluck('name')->all()]);

        return back()->with('status', 'Role berhasil diperbarui.');
    }

    public function destroy(Request $request, Role $role): RedirectResponse
    {
        abort_if(in_array($role->name, config('portfolio.system_roles'), true), 403, 'Role sistem tidak dapat dihapus.');
        abort_if($role->users()->exists(), 422, 'Role masih digunakan oleh pengguna.');
        $role->delete();
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        $this->activity->record('deleted', 'roles', null, $request, ['name' => $role->name], null);

        return back()->with('status', 'Role berhasil dihapus.');
    }
}
