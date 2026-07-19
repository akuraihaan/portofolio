<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Permission;

class PermissionPolicy
{
    public function before(User $actor): ?bool
    {
        return $actor->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $actor): bool { return $actor->can('permissions.view'); }
    public function create(User $actor): bool { return $actor->can('permissions.create'); }
    public function update(User $actor, Permission $permission): bool { return $actor->can('permissions.update'); }
    public function delete(User $actor, Permission $permission): bool { return $actor->can('permissions.delete'); }
}
