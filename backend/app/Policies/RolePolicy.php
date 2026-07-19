<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function before(User $actor): ?bool
    {
        return $actor->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $actor): bool { return $actor->can('roles.view'); }
    public function create(User $actor): bool { return $actor->can('roles.create'); }
    public function update(User $actor, Role $role): bool { return $actor->can('roles.update') && ! in_array($role->name, config('portfolio.system_roles'), true); }
    public function delete(User $actor, Role $role): bool { return $actor->can('roles.delete') && ! in_array($role->name, config('portfolio.system_roles'), true); }
}
