<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserService
{
    public function __construct(private readonly ActivityLogService $activity)
    {
    }

    public function create(array $data, ?Request $request = null): User
    {
        return DB::transaction(function () use ($data, $request): User {
            $roleNames = $data['roles'] ?? [];
            unset($data['roles']);
            $data['status'] ??= UserStatus::ACTIVE;
            $user = User::create($data);

            if ($roleNames) {
                $user->syncRoles($this->roles($roleNames));
            }

            $this->activity->record('created', 'users', $user, $request, null, $this->safe($user));

            return $user->refresh();
        });
    }

    public function update(User $user, array $data, ?Request $request = null): User
    {
        return DB::transaction(function () use ($user, $data, $request): User {
            $before = $this->safe($user);
            $roleNames = $data['roles'] ?? null;
            unset($data['roles']);
            $user->fill($data)->save();

            if ($roleNames !== null) {
                $this->syncRoles($user, $roleNames, $request);
            }

            $this->activity->record('updated', 'users', $user, $request, $before, $this->safe($user->refresh()));

            return $user->refresh();
        });
    }

    public function changeStatus(User $target, UserStatus $status, User $actor, ?Request $request = null): void
    {
        $this->assertCanManage($target, $actor);
        if ($target->isSuperAdmin() && $status !== UserStatus::ACTIVE) {
            $this->assertNotLastSuperAdmin($target);
        }

        $before = $this->safe($target);
        $target->update(['status' => $status]);
        $this->activity->record('status-changed', 'users', $target, $request, $before, $this->safe($target->refresh()));
    }

    public function syncRoles(User $target, array $roleNames, ?Request $request = null): void
    {
        $actor = auth()->user();
        abort_unless($actor instanceof User, 403);
        $this->assertCanManage($target, $actor);
        $roleNames = array_values(array_unique(array_filter($roleNames)));

        if (in_array('Super Admin', $roleNames, true) && ! $actor->isSuperAdmin()) {
            abort(403, 'Only Super Admin can assign the Super Admin role.');
        }
        if ($target->isSuperAdmin() && ! in_array('Super Admin', $roleNames, true)) {
            $this->assertNotLastSuperAdmin($target);
        }

        $before = $target->getRoleNames()->all();
        $target->syncRoles($this->roles($roleNames));
        $this->activity->record('roles-synced', 'users', $target, $request, ['roles' => $before], ['roles' => $roleNames]);
    }

    public function syncPermissions(User $target, array $permissionNames, User $actor, ?Request $request = null): void
    {
        $this->assertCanManage($target, $actor);
        $permissionNames = array_values(array_unique(array_filter($permissionNames)));
        if (! $actor->isSuperAdmin()) {
            $allowed = $actor->getAllPermissions()->pluck('name')->all();
            abort_if(array_diff($permissionNames, $allowed), 403, 'You cannot grant a permission you do not have.');
        }

        $before = $target->getDirectPermissions()->pluck('name')->all();
        $target->syncPermissions(Permission::query()->where('guard_name', 'web')->whereIn('name', $permissionNames)->get());
        $this->activity->record('permissions-synced', 'users', $target, $request, ['permissions' => $before], ['permissions' => $permissionNames]);
    }

    public function delete(User $target, User $actor, ?Request $request = null): void
    {
        $this->assertCanManage($target, $actor);
        if ($target->isSuperAdmin()) {
            $this->assertNotLastSuperAdmin($target);
        }
        abort_if($target->is($actor), 403, 'You cannot delete your own account from this screen.');
        $target->delete();
        $this->activity->record('deleted', 'users', $target, $request, null, ['id' => $target->id]);
    }

    public function restore(User $target, User $actor, ?Request $request = null): void
    {
        $this->assertCanManage($target, $actor);
        $target->restore();
        $this->activity->record('restored', 'users', $target, $request, null, $this->safe($target));
    }

    public function forceDelete(User $target, User $actor, ?Request $request = null): void
    {
        $this->assertCanManage($target, $actor);
        abort_if($target->isSuperAdmin(), 403, 'The Super Admin account is protected.');
        $target->forceDelete();
        $this->activity->record('force-deleted', 'users', null, $request, ['id' => $target->id], null);
    }

    private function roles(array $roleNames): Collection
    {
        return Role::query()->where('guard_name', 'web')->whereIn('name', $roleNames)->get();
    }

    private function assertCanManage(User $target, User $actor): void
    {
        abort_if($target->isSuperAdmin() && ! $actor->isSuperAdmin(), 403, 'The Super Admin account is protected.');
        abort_if($target->is($actor), 403, 'You cannot change your own access from this screen.');
    }

    private function assertNotLastSuperAdmin(User $target): void
    {
        $count = User::role('Super Admin')->where('status', UserStatus::ACTIVE)->count();
        abort_if($count <= 1, 403, 'The last active Super Admin must remain protected.');
    }

    private function safe(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status?->value,
            'roles' => $user->getRoleNames()->values()->all(),
        ];
    }
}
