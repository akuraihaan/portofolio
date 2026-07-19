<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function before(User $actor, string $ability): ?bool
    {
        return $actor->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $actor): bool
    {
        return $actor->can('users.view');
    }

    public function view(User $actor, User $target): bool
    {
        return $actor->can('users.view') && ($actor->id === $target->id || ! $target->isSuperAdmin());
    }

    public function create(User $actor): bool
    {
        return $actor->can('users.create');
    }

    public function update(User $actor, User $target): bool
    {
        return $actor->can('users.update') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }

    public function delete(User $actor, User $target): bool
    {
        return $actor->can('users.delete') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }

    public function restore(User $actor, User $target): bool
    {
        return $actor->can('users.restore') && ! $target->isSuperAdmin();
    }

    public function forceDelete(User $actor, User $target): bool
    {
        return $actor->can('users.force-delete') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }

    public function assignRole(User $actor, User $target): bool
    {
        return $actor->can('users.assign-role') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }

    public function assignPermission(User $actor, User $target): bool
    {
        return $actor->can('users.assign-permission') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }

    public function changeStatus(User $actor, User $target): bool
    {
        return $actor->can('users.change-status') && $actor->id !== $target->id && ! $target->isSuperAdmin();
    }
}
